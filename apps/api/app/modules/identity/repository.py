"""SQL for the identity module's table (`users`). Users are global, not shop-owned.

Every read is fresh (`populate_existing`), so a row changed by another transaction is never served
from an earlier identity-map copy (D9). A `uq_users_email` violation surfaces as 409
`EMAIL_ALREADY_REGISTERED` through the global constraint map (`app.core.db_errors`).
"""

import uuid
from collections.abc import Collection
from datetime import datetime

from sqlalchemy import CursorResult, select, update

from app.modules.identity.models import User
from app.shared.repository import Repository


class UserRepository(Repository):
    async def get(self, user_id: uuid.UUID) -> User | None:
        """A fresh read of the row (D9: never served from an earlier identity-map copy)."""
        statement = select(User).where(User.id == user_id).execution_options(populate_existing=True)
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        """The account of a normalised (lower-case) e-mail; `uq_users_email` serves it."""
        statement = (
            select(User).where(User.email == email).execution_options(populate_existing=True)
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def get_many(self, user_ids: Collection[uuid.UUID]) -> list[User]:
        """The users with these ids, any status, in one query (unknown ids are skipped)."""
        if not user_ids:
            return []
        statement = (
            select(User)
            .where(User.id.in_(list(user_ids)))
            .execution_options(populate_existing=True)
        )
        return list((await self.session.execute(statement)).scalars())

    async def find_ids_by_name(self, q: str, *, limit: int) -> list[uuid.UUID]:
        """Ids of users whose `full_name` contains `q`, case-insensitively.

        `autoescape` escapes `%`, `_` and the escape character, so user input is matched literally.
        """
        statement = (
            select(User.id)
            .where(User.full_name.icontains(q, autoescape=True))
            .order_by(User.id)
            .limit(limit)
        )
        return list((await self.session.execute(statement)).scalars())

    async def set_phone_if_empty(self, *, user_id: uuid.UUID, phone: str, now: datetime) -> bool:
        """`UPDATE … SET phone WHERE phone IS NULL` (D33): never overwrites; True when written."""
        statement = (
            update(User)
            .where(User.id == user_id, User.phone.is_(None))
            .values(phone=phone, updated_at=now)
        )
        result = await self.session.execute(statement)
        return isinstance(result, CursorResult) and result.rowcount == 1
