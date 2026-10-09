"""SQL for the shops module's tables. Every method on shop-owned rows takes `shop_id` (D20)."""

import uuid

from sqlalchemy import select

from app.modules.shops.models import ShopMembership
from app.shared.repository import ShopScopedRepository


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
