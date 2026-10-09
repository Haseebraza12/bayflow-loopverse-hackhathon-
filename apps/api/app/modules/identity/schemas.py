"""Schemas of the identity module (spec 04). `password_hash` never leaves this module."""

import uuid

from pydantic import BaseModel, ConfigDict


class UserRead(BaseModel):
    """A user as other modules (and `app.shared.auth`) see it."""

    model_config = ConfigDict(from_attributes=True, frozen=True)

    id: uuid.UUID
    email: str
    full_name: str
    phone: str | None
    is_active: bool
