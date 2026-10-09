"""Use cases of the identity module (spec 01 "Public service surface").

Only the read that `app.shared.auth` needs exists so far; registration, login and profile use
cases follow `modules/identity.md`. This service never imports `app.shared.auth` (spec 01 rule 8).
"""

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.repository import UserRepository
from app.modules.identity.schemas import UserRead


async def get_active_user(session: AsyncSession, user_id: uuid.UUID) -> UserRead | None:
    """The user if it exists and is active, re-read on every request (D9); otherwise None."""
    user = await UserRepository(session).get(user_id)
    if user is None or not user.is_active:
        return None
    return UserRead.model_validate(user)
