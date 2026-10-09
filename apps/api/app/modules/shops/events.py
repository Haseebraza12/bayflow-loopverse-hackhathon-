"""Events published by the shops module (glossary §7.1, spec 01 "Event catalogue").

`ShopGridChanging` (D37): `update_shop` is about to change `slot_duration_minutes` or `timezone`;
the shop row is already locked `FOR UPDATE` and nothing is written yet. The bookings module vetoes
the change with 409 `CONFLICT` while the shop has a future non-cancelled booking; the exception
rolls the whole change back. With no subscriber the change proceeds.
"""

import uuid
from dataclasses import dataclass

from app.shared.event_bus import Event

GRID_FIELDS: tuple[str, ...] = ("slot_duration_minutes", "timezone")
"""The shop fields whose change moves the slot grid (D37), in this order."""


@dataclass(frozen=True, slots=True, kw_only=True)
class ShopGridChanging(Event):
    shop_id: uuid.UUID
    changed_fields: tuple[str, ...]  # a non-empty subset of GRID_FIELDS, in GRID_FIELDS order
    actor_user_id: uuid.UUID
