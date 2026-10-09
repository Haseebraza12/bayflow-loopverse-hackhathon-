"""Schemas of the shops module (spec 04, `modules/shops.md`)."""

import uuid

from pydantic import BaseModel, ConfigDict

from app.shared.enums import MembershipRole


class MembershipRead(BaseModel):
    """A user's membership (one role) in one shop."""

    model_config = ConfigDict(from_attributes=True, frozen=True)

    id: uuid.UUID
    shop_id: uuid.UUID
    user_id: uuid.UUID
    role: MembershipRole
    is_active: bool
