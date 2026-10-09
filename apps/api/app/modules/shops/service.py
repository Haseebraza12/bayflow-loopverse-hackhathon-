"""Use cases of the shops module (spec 01 "Public service surface").

Only the read that `app.shared.auth` needs exists so far; shops, team and catalogue use cases
follow `modules/shops.md`. This service never imports `app.shared.auth` (spec 01 rule 8).
"""

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.shops.repository import MembershipRepository
from app.modules.shops.schemas import MembershipRead


async def get_active_membership(
    session: AsyncSession, *, shop_id: uuid.UUID, user_id: uuid.UUID
) -> MembershipRead | None:
    """The user's active membership in the shop, re-read on every request (D9, D20)."""
    membership = await MembershipRepository(session).get_active(shop_id=shop_id, user_id=user_id)
    return MembershipRead.model_validate(membership) if membership is not None else None
