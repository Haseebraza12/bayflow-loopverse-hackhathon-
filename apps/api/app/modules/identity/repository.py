"""SQL for the identity module's table (`users`). Users are global, not shop-owned."""

import uuid

from sqlalchemy import select

from app.modules.identity.models import User
from app.shared.repository import Repository


class UserRepository(Repository):
    async def get(self, user_id: uuid.UUID) -> User | None:
        """A fresh read of the row (D9: never served from an earlier identity-map copy)."""
        statement = select(User).where(User.id == user_id).execution_options(populate_existing=True)
        return (await self.session.execute(statement)).scalar_one_or_none()
