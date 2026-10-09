"""Use cases and look-ups of the identity module (`modules/identity.md` §5; spec 04 "Authentication
flows").

- Top-level use cases (commit): `register_owner`, `login`; internal, seed only (D60):
  `set_user_active`, `set_password`.
- Nested (join the caller's transaction, never commit): `create_user`, `authenticate` (the one
  credential check behind login and the booking wizard, D32), `set_phone_if_empty` (D33).
- Pure: `issue_session` (reads the clock and the settings).
- Reads: `get_active_user` (used by `app.shared.auth`, D9), `get_user`, `get_users_by_ids`,
  `get_user_refs`, `find_user_by_email`, `find_user_ids_by_name`, internal `password_matches`.

Login is constant time: unknown e-mails are verified against a dummy hash, so every attempt runs
exactly one Argon2 verification, and unknown, wrong and inactive accounts get the same 401. The
per-account failure limiter (D69) is keyed by the normalised e-mail: each attempt is reserved with
one atomic `hit()` before the first `await`, so even a burst of parallel attempts reaches the
database and Argon2 at most 5 times per window; a success clears the counter. Identity is the
lowest module: it imports no other module and never imports `app.shared.auth` (spec 01 rule 8).
"""

import logging
import uuid
from collections.abc import Collection
from datetime import datetime
from typing import Protocol

from pwdlib.exceptions import UnknownHashError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.errors import (
    EmailAlreadyRegistered,
    FieldError,
    InvalidCredentials,
    NotFound,
    RateLimited,
    ValidationFailed,
)
from app.core.security import (
    FAILED_PASSWORD_LIMIT,
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH,
    account_limiter,
    hash_password,
    issue_token,
    retry_after_seconds,
    verify_password,
)
from app.modules.identity.models import User
from app.modules.identity.repository import UserRepository
from app.modules.identity.schemas import (
    FULL_NAME_MAX_LENGTH,
    SessionRead,
    SessionToken,
    UserRecord,
    UserRef,
    to_user_read,
)
from app.shared.clock import utcnow
from app.shared.email import normalize_email
from app.shared.orm import touch
from app.shared.phone import normalize_phone
from app.shared.repository import constraint_name
from app.shared.uow import UnitOfWork

logger = logging.getLogger(__name__)

FAILED_PASSWORD_SCOPE = "failed-password"  # noqa: S105 - a limiter namespace, not a secret
"""Namespace of the per-account limiter key: `("failed-password", <normalised e-mail>)`."""

NAME_SEARCH_LIMIT = 1000
EMAIL_UNIQUE_CONSTRAINT = "uq_users_email"
EMAIL_ALREADY_REGISTERED_DETAIL = (
    "This e-mail already has a BayFlow account. Log in, then create your shop."
)


class SecretValue(Protocol):
    """A masked secret (`pydantic.SecretStr` or the `Password` type's `Secret[str]`)."""

    def get_secret_value(self) -> str: ...


# --- Input guards for direct (non-HTTP) callers ------------------------------------------------
# HTTP inputs are already validated by the request schemas; the seed and other modules call these
# services directly, so the same rules are enforced here (defence in depth, spec 11 "no bypass").


def _field_error(field: str, code: str, message: str) -> ValidationFailed:
    return ValidationFailed(errors=[FieldError(field=field, code=code, message=message)])


def _normalised_email(value: str) -> str:
    try:
        return normalize_email(value.strip())
    except ValueError as exc:
        raise _field_error("email", "value_error", str(exc)) from None


def _lookup_key(email: str) -> str:
    """The normalised e-mail for look-ups and the limiter key (an invalid one never matches)."""
    try:
        return normalize_email(email.strip())
    except ValueError:
        return email.strip().lower()


def _required_full_name(value: str) -> str:
    name = value.strip()
    if not name:
        message = "String should have at least 1 character"
        raise _field_error("full_name", "string_too_short", message)
    if len(name) > FULL_NAME_MAX_LENGTH:
        message = f"String should have at most {FULL_NAME_MAX_LENGTH} characters"
        raise _field_error("full_name", "string_too_long", message)
    return name


def _new_password(password: SecretValue, *, field: str = "password") -> str:
    """The D10 policy for every new password: 12-128 characters, never trimmed."""
    value = password.get_secret_value()
    if len(value) < MIN_PASSWORD_LENGTH:
        message = f"String should have at least {MIN_PASSWORD_LENGTH} characters"
        raise _field_error(field, "string_too_short", message)
    if len(value) > MAX_PASSWORD_LENGTH:
        message = f"String should have at most {MAX_PASSWORD_LENGTH} characters"
        raise _field_error(field, "string_too_long", message)
    return value


def _optional_phone(value: str | None) -> str | None:
    """The shared `Phone` normalisation (spec 03 §1.5); idempotent for normalised values."""
    if value is None:
        return None
    try:
        return normalize_phone(value.strip())
    except ValueError as exc:
        raise _field_error("phone", "phone_invalid", str(exc)) from None


def _record(user: User) -> UserRecord:
    return UserRecord.model_validate(user)


async def _verify(password: str, user: User | None) -> tuple[bool, str | None]:
    """Exactly one Argon2 verification (a dummy one for an unknown user, spec 04).

    A stored hash pwdlib cannot parse (a corrupted row) is treated as a failed check and logged
    with the user id, never the hash (`modules/identity.md` §7.1).
    """
    try:
        return await verify_password(password, user.password_hash if user is not None else None)
    except UnknownHashError:
        user_id = str(user.id) if user is not None else None
        logger.warning("stored password hash is not recognised", extra={"user_id": user_id})
        return False, None


def _rate_limited(retry_after: int) -> RateLimited:
    return RateLimited(
        f"Too many attempts. Try again in {retry_after} seconds.",
        headers={"Retry-After": str(retry_after)},
    )


def _reserve_attempt(key: str) -> None:
    """D69: count this password check for `key` with one atomic `hit()` (`modules/identity.md`
    §7.4). Synchronous, and called before the first `await`, so parallel attempts can never all
    pass a check before any of them is counted: at most 5 per 15 minutes reach the database or
    Argon2. A blocked account gets 429 even with the right password; unknown e-mails are counted
    exactly like known ones, so the 429 reveals nothing."""
    if not account_limiter().hit(FAILED_PASSWORD_LIMIT, FAILED_PASSWORD_SCOPE, key):
        logger.warning("auth.account_rate_limited")
        raise _rate_limited(retry_after_seconds(FAILED_PASSWORD_LIMIT, FAILED_PASSWORD_SCOPE, key))


# --- Sessions -------------------------------------------------------------------------------------


def issue_session(user_id: uuid.UUID) -> SessionToken:
    """A `typ = session` token for `user_id` (D8), stamped with the app clock (D63)."""
    return SessionToken(
        access_token=issue_token(user_id, "session", utcnow()),
        token_type="bearer",  # noqa: S106 - the OAuth token type, not a secret
        expires_in=get_settings().jwt_lifetime_seconds,
    )


def _session_for(user: UserRecord) -> SessionRead:
    token = issue_session(user.id)
    return SessionRead(
        access_token=token.access_token,
        token_type=token.token_type,
        expires_in=token.expires_in,
        user=to_user_read(user),
    )


# --- Writes ---------------------------------------------------------------------------------------


async def _insert_user(  # noqa: PLR0913 - one keyword per users column the caller sets
    uow: UnitOfWork,
    *,
    email: str,
    full_name: str,
    password: SecretValue,
    phone: str | None,
    now: datetime,
    last_login_at: datetime | None = None,
) -> User:
    normalised_email = _normalised_email(email)
    name = _required_full_name(full_name)
    secret = _new_password(password)
    normalised_phone = _optional_phone(phone)
    repository = UserRepository(uow.session)
    if await repository.get_by_email(normalised_email) is not None:
        raise EmailAlreadyRegistered
    password_hash = await hash_password(secret)  # Argon2 off the event loop; no row lock held
    user = repository.add(
        User(
            email=normalised_email,
            password_hash=password_hash,
            full_name=name,
            phone=normalised_phone,
            is_active=True,
            last_login_at=last_login_at,
            created_at=now,
            updated_at=now,
        )
    )
    try:
        await repository.flush()
    except IntegrityError as exc:
        # A concurrent insert of the same e-mail won the race on `uq_users_email` (spec 02 §7.5):
        # the same 409 the pre-check gives, as a typed error every caller (and the seed) sees.
        if constraint_name(exc) != EMAIL_UNIQUE_CONSTRAINT:
            raise
        raise EmailAlreadyRegistered from exc
    return user


async def create_user(  # noqa: PLR0913 - spec signature plus the caller's instant and session flag
    uow: UnitOfWork,
    *,
    email: str,
    full_name: str,
    password: SecretValue,
    phone: str | None = None,
    now: datetime | None = None,
    starts_session: bool = False,
) -> UserRecord:
    """Create an account for an e-mail that has none (nested; the caller commits).

    Used by `register_owner`, `shops.add_member` (D18: the Owner set the password) and the booking
    wizard's case B (D32). Call it without holding row locks: it runs Argon2 (~55 ms). `now` lets
    the caller pass its action's clock instant (D63); it defaults to `utcnow()`.
    `starts_session=True` when the new account is logged in by this action (register-owner,
    wizard case B): `last_login_at` is set to `now` (`modules/identity.md` open question 2).
    A concurrent registration of the same e-mail → 409 `EMAIL_ALREADY_REGISTERED`.
    """
    instant = now or utcnow()
    user = await _insert_user(
        uow,
        email=email,
        full_name=full_name,
        password=password,
        phone=phone,
        now=instant,
        last_login_at=instant if starts_session else None,
    )
    return _record(user)


async def register_owner(
    uow: UnitOfWork,
    *,
    email: str,
    full_name: str,
    password: SecretValue,
    phone: str | None = None,
) -> SessionRead:
    """`POST /api/v1/auth/register-owner` (D17): a bare user, no membership; logged in (D81).

    An existing e-mail — found by the pre-check or by losing the `uq_users_email` race to a
    concurrent registration — is 409 with spec 03 §4.3's detail. The token is issued only after
    the commit, so it never names a rolled-back user.
    """
    try:
        user = await create_user(
            uow,
            email=email,
            full_name=full_name,
            password=password,
            phone=phone,
            now=utcnow(),
            starts_session=True,
        )
    except EmailAlreadyRegistered:
        await uow.rollback()
        raise EmailAlreadyRegistered(EMAIL_ALREADY_REGISTERED_DETAIL) from None
    await uow.commit()
    logger.info("auth.owner_registered", extra={"user_id": str(user.id)})
    return _session_for(user)


async def authenticate(
    uow: UnitOfWork,
    *,
    email: str,
    password: SecretValue,
    now: datetime | None = None,
) -> UserRecord:
    """The one credential check behind login and the wizard's cases C/D (nested, no commit).

    Order (`modules/identity.md` §7.4): reserve the attempt with the per-account limiter's atomic
    `hit` before any `await` (429 when the window is full) → user look-up (no row lock) → exactly
    one Argon2 verify → 401 `INVALID_CREDENTIALS` on failure (already counted; identical for
    unknown, wrong and inactive) → on success `clear`, `last_login_at`, transparent rehash. The
    bookings module maps `InvalidCredentials` to 409 `EMAIL_ALREADY_REGISTERED`; `RateLimited`
    passes through.
    """
    key = _lookup_key(email)
    _reserve_attempt(key)  # no `await` before this line: the check-and-count is atomic
    repository = UserRepository(uow.session)
    user = await repository.get_by_email(key)
    valid, new_hash = await _verify(password.get_secret_value(), user)
    if user is None or not valid or not user.is_active:
        logger.info("auth.login_failed")
        raise InvalidCredentials
    account_limiter().clear(FAILED_PASSWORD_LIMIT, FAILED_PASSWORD_SCOPE, key)
    instant = now or utcnow()
    user.last_login_at = instant
    touch(user, instant)  # always sent, even when the row was already stamped at `instant` (D63)
    if new_hash is not None:  # transparent Argon2 parameter upgrade (OWASP)
        user.password_hash = new_hash
    await repository.flush()
    return _record(user)


async def login(uow: UnitOfWork, *, email: str, password: SecretValue) -> SessionRead:
    """`POST /api/v1/auth/login`: the token fields and the `user`, no memberships (D81)."""
    user = await authenticate(uow, email=email, password=password)
    await uow.commit()
    logger.info("auth.login_succeeded", extra={"user_id": str(user.id)})
    return _session_for(user)


async def set_phone_if_empty(
    uow: UnitOfWork, *, user_id: uuid.UUID, phone: str, now: datetime | None = None
) -> bool:
    """Fill `users.phone` only while it is NULL; never overwrite it (D33). True when written."""
    normalised = _optional_phone(phone)
    if normalised is None:
        return False
    return await UserRepository(uow.session).set_phone_if_empty(
        user_id=user_id, phone=normalised, now=now or utcnow()
    )


# --- Internal account maintenance for the seed's demo-cast reconciliation (D60) ------------------
# Never mounted on a route. Each function writes only when the value differs, so a run with nothing
# to repair changes no row (SEED-19).


async def set_user_active(uow: UnitOfWork, *, user_id: uuid.UUID, is_active: bool) -> bool:
    """Activate or deactivate an account (top-level). True when changed; 404 for an unknown id."""
    user = await UserRepository(uow.session).get(user_id)
    if user is None:
        raise NotFound
    now = utcnow()
    if user.is_active == is_active:
        return False
    user.is_active = is_active
    touch(user, now)
    await uow.commit()
    return True


async def password_matches(
    session: AsyncSession, *, user_id: uuid.UUID, password: SecretValue
) -> bool:
    """One Argon2 verification of the stored hash: no limiter, no rehash write (D60, D69).

    False for an unknown user and for a hash pwdlib cannot parse.
    """
    user = await UserRepository(session).get(user_id)
    if user is None:
        return False
    valid, _ = await _verify(password.get_secret_value(), user)
    return valid


async def set_password(uow: UnitOfWork, *, user_id: uuid.UUID, new_password: SecretValue) -> None:
    """Store an Argon2id hash of `new_password` (top-level; D10 policy). 404 for an unknown id.

    Writes nothing when the stored hash already verifies the password (idempotent, SEED-19).
    """
    secret = _new_password(new_password, field="new_password")
    repository = UserRepository(uow.session)
    user = await repository.get(user_id)
    if user is None:
        raise NotFound
    now = utcnow()
    already_set, _ = await _verify(secret, user)
    if already_set:
        return
    user.password_hash = await hash_password(secret)
    touch(user, now)
    await uow.commit()


# --- Look-ups for other modules -------------------------------------------------------------------


async def get_active_user(session: AsyncSession, user_id: uuid.UUID) -> UserRecord | None:
    """The user if it exists and is active, re-read on every request (D9); otherwise None."""
    user = await UserRepository(session).get(user_id)
    if user is None or not user.is_active:
        return None
    return _record(user)


async def get_user(session: AsyncSession, user_id: uuid.UUID) -> UserRecord | None:
    """The user whatever its status, or None when the id is unknown."""
    user = await UserRepository(session).get(user_id)
    return _record(user) if user is not None else None


async def get_users_by_ids(
    session: AsyncSession, user_ids: Collection[uuid.UUID]
) -> dict[uuid.UUID, UserRecord]:
    """Users by id, any status, in one query; unknown ids are absent from the result."""
    users = await UserRepository(session).get_many(set(user_ids))
    return {user.id: _record(user) for user in users}


async def get_user_refs(
    session: AsyncSession, user_ids: Collection[uuid.UUID]
) -> dict[uuid.UUID, UserRef]:
    """`UserRef`s (spec 03 §3.1) for actor and author names, in one query."""
    users = await get_users_by_ids(session, user_ids)
    return {
        user_id: UserRef(user_id=user_id, full_name=user.full_name)
        for user_id, user in users.items()
    }


async def find_user_by_email(session: AsyncSession, email: str) -> UserRecord | None:
    """The account of an e-mail (normalised like the `Email` type, D62), any status."""
    user = await UserRepository(session).get_by_email(_lookup_key(email))
    return _record(user) if user is not None else None


async def find_user_ids_by_name(
    session: AsyncSession, *, q: str, limit: int = NAME_SEARCH_LIMIT
) -> list[uuid.UUID]:
    """Ids of users whose name contains `q` (case-insensitive, `%`/`_` literal), at most `limit`.

    Used by the staff booking search (`q` matches the customer name, spec 03 §4.8).
    """
    text = q.strip()
    if not text or limit < 1:
        return []
    return await UserRepository(session).find_ids_by_name(text, limit=limit)
