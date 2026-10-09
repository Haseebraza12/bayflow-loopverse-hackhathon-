"""SQL for the shops module's tables: `shops`, `shop_working_hours`, `shop_memberships`, `services`.

Every method on shop-owned rows takes a keyword-only `shop_id` (D20); the only reads keyed by
something else are the public directory (listed shops only), slug look-ups and a user's own
memberships (`/me`). Reads that may meet an object already in the session use `populate_existing`,
so a value changed by another transaction is never served from the identity map (D9). The shop
row is locked `FOR UPDATE` by grid and working-hours changes and `FOR SHARE` by booking creation
(D37); it is always the first lock of those transactions.
"""

import uuid
from collections import defaultdict
from collections.abc import Collection, Iterable, Sequence
from datetime import datetime

from sqlalchemy import ColumnElement, Select, exists, func, literal, or_, select
from sqlalchemy.exc import IntegrityError

from app.modules.shops.domain.grid import WorkingDay
from app.modules.shops.models import Service, Shop, ShopMembership, ShopWorkingHours
from app.shared.enums import MembershipRole
from app.shared.repository import Repository, ShopScopedRepository, constraint_name

SLUG_UNIQUE_CONSTRAINT = "uq_shops_slug"


class SlugCandidatesExhaustedError(RuntimeError):
    """Every slug candidate lost a race on `uq_shops_slug` (practically impossible; a 500)."""


def _directory_conditions(*, q: str | None, city: str | None) -> list[ColumnElement[bool]]:
    """Listed shops with at least one active service (D64), optionally filtered.

    `city` is a case-insensitive exact match; `q` a case-insensitive substring of the shop name,
    city or an active service name, with `%`, `_` and the escape character matched literally.
    """
    has_active_service = exists().where(Service.shop_id == Shop.id, Service.is_active.is_(True))
    conditions: list[ColumnElement[bool]] = [Shop.is_listed.is_(True), has_active_service]
    if city:
        conditions.append(func.lower(Shop.city) == func.lower(literal(city)))
    if q:
        service_matches = exists().where(
            Service.shop_id == Shop.id,
            Service.is_active.is_(True),
            Service.name.icontains(q, autoescape=True),
        )
        conditions.append(
            or_(
                Shop.name.icontains(q, autoescape=True),
                Shop.city.icontains(q, autoescape=True),
                service_matches,
            )
        )
    return conditions


class ShopRepository(Repository):
    """The tenant table itself: its key is the `shop_id`."""

    def _by_id(self, shop_id: uuid.UUID) -> Select[Shop]:
        return select(Shop).where(Shop.id == shop_id).execution_options(populate_existing=True)

    async def get(self, *, shop_id: uuid.UUID) -> Shop | None:
        return (await self.session.execute(self._by_id(shop_id))).scalar_one_or_none()

    async def get_for_update(self, *, shop_id: uuid.UUID) -> Shop | None:
        """`SELECT … FOR UPDATE`: grid and working-hours changes (D37)."""
        statement = self._by_id(shop_id).with_for_update()
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def get_for_share(self, *, shop_id: uuid.UUID) -> Shop | None:
        """`SELECT … FOR SHARE`: booking creation's first lock (D37). It conflicts with a grid
        change's `FOR UPDATE` but not with another booking's `FOR SHARE`."""
        statement = self._by_id(shop_id).with_for_update(read=True)
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Shop | None:
        statement = select(Shop).where(Shop.slug == slug).execution_options(populate_existing=True)
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def get_many(self, *, shop_ids: Collection[uuid.UUID]) -> list[Shop]:
        if not shop_ids:
            return []
        statement = (
            select(Shop)
            .where(Shop.id.in_(list(shop_ids)))
            .execution_options(populate_existing=True)
        )
        return list((await self.session.execute(statement)).scalars())

    async def taken_slugs(self, base: str) -> set[str]:
        """Slugs equal to `base` or starting with `base-` (`base` holds only `[a-z0-9-]`)."""
        statement = select(Shop.slug).where(
            or_(Shop.slug == base, Shop.slug.startswith(f"{base}-", autoescape=True))
        )
        return set((await self.session.execute(statement)).scalars())

    async def add_with_slug(self, shop: Shop, candidates: Iterable[str], *, attempts: int) -> None:
        """Insert `shop` with the first candidate slug that wins `uq_shops_slug`.

        Each try runs in a savepoint, so a concurrent creation that took the slug first only rolls
        back this insert and the next candidate is tried (`modules/shops.md` §7.3).
        """
        for slug, _ in zip(candidates, range(attempts), strict=False):
            shop.slug = slug
            try:
                async with self.session.begin_nested():
                    self.session.add(shop)
                    await self.session.flush()
            except IntegrityError as exc:
                if constraint_name(exc) != SLUG_UNIQUE_CONSTRAINT:
                    raise
                continue
            return
        msg = f"no free slug after {attempts} attempts"
        raise SlugCandidatesExhaustedError(msg)

    async def directory_page(
        self, *, q: str | None, city: str | None, limit: int, offset: int
    ) -> list[Shop]:
        statement = (
            select(Shop)
            .where(*_directory_conditions(q=q, city=city))
            .order_by(Shop.name, Shop.id)
            .limit(limit)
            .offset(offset)
        )
        return list((await self.session.execute(statement)).scalars())

    async def directory_count(self, *, q: str | None, city: str | None) -> int:
        statement = (
            select(func.count()).select_from(Shop).where(*_directory_conditions(q=q, city=city))
        )
        return int((await self.session.execute(statement)).scalar_one())

    async def directory_cities(self) -> list[str]:
        """One spelling per case-insensitive city of the directory's shops, alphabetical."""
        lowered = func.lower(Shop.city)
        statement = (
            select(func.min(Shop.city))
            .where(*_directory_conditions(q=None, city=None))
            .group_by(lowered)
            .order_by(lowered)
        )
        return list((await self.session.execute(statement)).scalars())


class WorkingHoursRepository(ShopScopedRepository):
    async def list_for_shop(self, *, shop_id: uuid.UUID) -> list[ShopWorkingHours]:
        """The shop's rows by weekday (unlocked: every writer holds the shop row first, §7.5)."""
        statement = (
            select(ShopWorkingHours)
            .where(ShopWorkingHours.shop_id == shop_id)
            .order_by(ShopWorkingHours.weekday)
            .execution_options(populate_existing=True)
        )
        return list((await self.session.execute(statement)).scalars())

    def add_week(
        self, *, shop_id: uuid.UUID, days: Sequence[WorkingDay], now: datetime
    ) -> list[ShopWorkingHours]:
        """Insert one row per day (closed days store no times)."""
        rows = [
            ShopWorkingHours(
                shop_id=shop_id,
                weekday=day.weekday,
                is_closed=day.is_closed,
                opens_at=None if day.is_closed else day.opens_at,
                closes_at=None if day.is_closed else day.closes_at,
                created_at=now,
                updated_at=now,
            )
            for day in days
        ]
        self.session.add_all(rows)
        return rows


class MembershipRepository(ShopScopedRepository):
    async def get_active(self, *, shop_id: uuid.UUID, user_id: uuid.UUID) -> ShopMembership | None:
        """The caller's active membership in `shop_id` (unique key `(shop_id, user_id)`)."""
        statement = (
            select(ShopMembership)
            .where(
                ShopMembership.shop_id == shop_id,
                ShopMembership.user_id == user_id,
                ShopMembership.is_active.is_(True),
            )
            .execution_options(populate_existing=True)
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def get_for_user(
        self, *, shop_id: uuid.UUID, user_id: uuid.UUID
    ) -> ShopMembership | None:
        """The user's membership in `shop_id`, active or not."""
        statement = (
            select(ShopMembership)
            .where(ShopMembership.shop_id == shop_id, ShopMembership.user_id == user_id)
            .execution_options(populate_existing=True)
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def get_for_update(
        self, *, shop_id: uuid.UUID, membership_id: uuid.UUID
    ) -> ShopMembership | None:
        """`SELECT … FOR UPDATE` by `(shop_id, id)`: another shop's membership is invisible."""
        statement = (
            select(ShopMembership)
            .where(ShopMembership.shop_id == shop_id, ShopMembership.id == membership_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def list_for_shop(
        self,
        *,
        shop_id: uuid.UUID,
        roles: Collection[MembershipRole] | None = None,
        is_active: bool | None = None,
    ) -> list[ShopMembership]:
        statement = (
            select(ShopMembership)
            .where(ShopMembership.shop_id == shop_id)
            .execution_options(populate_existing=True)
        )
        if roles is not None:
            statement = statement.where(ShopMembership.role.in_(list(roles)))
        if is_active is not None:
            statement = statement.where(ShopMembership.is_active.is_(is_active))
        return list((await self.session.execute(statement)).scalars())

    async def list_for_users(
        self, *, shop_id: uuid.UUID, user_ids: Collection[uuid.UUID]
    ) -> list[ShopMembership]:
        """The memberships of these users in `shop_id`, any status."""
        if not user_ids:
            return []
        statement = (
            select(ShopMembership)
            .where(
                ShopMembership.shop_id == shop_id,
                ShopMembership.user_id.in_(list(user_ids)),
            )
            .execution_options(populate_existing=True)
        )
        return list((await self.session.execute(statement)).scalars())

    async def owner_user_id(self, *, shop_id: uuid.UUID) -> uuid.UUID | None:
        statement = select(ShopMembership.user_id).where(
            ShopMembership.shop_id == shop_id, ShopMembership.role == MembershipRole.OWNER
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def has_active_staff(self, *, shop_id: uuid.UUID) -> bool:
        """At least one active non-owner membership (reporting `setup.has_team`)."""
        statement = select(
            exists().where(
                ShopMembership.shop_id == shop_id,
                ShopMembership.is_active.is_(True),
                ShopMembership.role != MembershipRole.OWNER,
            )
        )
        return bool((await self.session.execute(statement)).scalar_one())

    async def list_active_for_user(
        self, *, user_id: uuid.UUID, roles: Collection[MembershipRole] | None = None
    ) -> list[tuple[ShopMembership, Shop]]:
        """A user's own active memberships with their shops (`/me`, shop switcher): keyed by the
        caller, so it never reads another user's data (`ix_shop_memberships_user_active`)."""
        statement = (
            select(ShopMembership, Shop)
            .join(Shop, Shop.id == ShopMembership.shop_id)
            .where(ShopMembership.user_id == user_id, ShopMembership.is_active.is_(True))
            .order_by(func.lower(Shop.name), Shop.id)
            .execution_options(populate_existing=True)
        )
        if roles is not None:
            statement = statement.where(ShopMembership.role.in_(list(roles)))
        result = await self.session.execute(statement)
        return [(membership, shop) for membership, shop in result]


class ServiceRepository(ShopScopedRepository):
    def _for_shop(self, shop_id: uuid.UUID) -> Select[Service]:
        return (
            select(Service)
            .where(Service.shop_id == shop_id)
            .execution_options(populate_existing=True)
        )

    async def page(
        self, *, shop_id: uuid.UUID, include_inactive: bool, limit: int, offset: int
    ) -> list[Service]:
        statement = self._for_shop(shop_id)
        if not include_inactive:
            statement = statement.where(Service.is_active.is_(True))
        statement = statement.order_by(func.lower(Service.name), Service.id)
        statement = statement.limit(limit).offset(offset)
        return list((await self.session.execute(statement)).scalars())

    async def count(self, *, shop_id: uuid.UUID, include_inactive: bool) -> int:
        statement = select(func.count()).select_from(Service).where(Service.shop_id == shop_id)
        if not include_inactive:
            statement = statement.where(Service.is_active.is_(True))
        return int((await self.session.execute(statement)).scalar_one())

    async def get_for_update(self, *, shop_id: uuid.UUID, service_id: uuid.UUID) -> Service | None:
        """`SELECT … FOR UPDATE` by `(shop_id, id)`: another shop's service is invisible."""
        statement = self._for_shop(shop_id).where(Service.id == service_id).with_for_update()
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def get_many(
        self, *, shop_id: uuid.UUID, service_ids: Collection[uuid.UUID]
    ) -> list[Service]:
        """These services of `shop_id`, any status (other shops' ids are simply absent)."""
        if not service_ids:
            return []
        statement = self._for_shop(shop_id).where(Service.id.in_(list(service_ids)))
        return list((await self.session.execute(statement)).scalars())

    async def list_active(self, *, shop_id: uuid.UUID) -> list[Service]:
        statement = (
            self._for_shop(shop_id)
            .where(Service.is_active.is_(True))
            .order_by(func.lower(Service.name), Service.id)
        )
        return list((await self.session.execute(statement)).scalars())

    async def active_names_for_shops(
        self, *, shop_ids: Collection[uuid.UUID]
    ) -> dict[uuid.UUID, list[tuple[uuid.UUID, str]]]:
        """`(id, name)` of the active services of each shop, by name (one query per page)."""
        services: dict[uuid.UUID, list[tuple[uuid.UUID, str]]] = defaultdict(list)
        if not shop_ids:
            return services
        statement = (
            select(Service.shop_id, Service.id, Service.name)
            .where(Service.shop_id.in_(list(shop_ids)), Service.is_active.is_(True))
            .order_by(Service.shop_id, func.lower(Service.name), Service.id)
        )
        for shop_id, service_id, name in await self.session.execute(statement):
            services[shop_id].append((service_id, name))
        return services

    async def active_name_taken(
        self, *, shop_id: uuid.UUID, name: str, exclude_id: uuid.UUID | None = None
    ) -> bool:
        """Another active service of `shop_id` has this name, case-insensitively
        (the pre-check for `uq_services_active_name`)."""
        condition = exists().where(
            Service.shop_id == shop_id,
            Service.is_active.is_(True),
            func.lower(Service.name) == func.lower(literal(name)),
        )
        if exclude_id is not None:
            condition = condition.where(Service.id != exclude_id)
        return bool((await self.session.execute(select(condition))).scalar_one())

    async def has_active(self, *, shop_id: uuid.UUID) -> bool:
        statement = select(exists().where(Service.shop_id == shop_id, Service.is_active.is_(True)))
        return bool((await self.session.execute(statement)).scalar_one())
