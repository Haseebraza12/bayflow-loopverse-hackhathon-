"""Database errors mapped to error codes by constraint name (spec 02 §7.5-7.6, spec 03 §2.4).

Services normally prevent these with locks and checks; the constraints are the backstop. When one
fires anyway, the API answers with the matching code instead of a 500. Deadlocks and lock timeouts
become 409 `CONCURRENT_UPDATE` (the client may retry). Anything unmapped (including the append-only
trigger's `P0001`) stays a 500, because only a bug can reach it.
"""

from sqlalchemy.exc import DBAPIError

from app.core.errors import ErrorCode

# PostgreSQL SQLSTATE codes (https://www.postgresql.org/docs/16/errcodes-appendix.html).
UNIQUE_VIOLATION = "23505"
FOREIGN_KEY_VIOLATION = "23503"
CHECK_VIOLATION = "23514"
NOT_NULL_VIOLATION = "23502"
SERIALIZATION_FAILURE = "40001"
DEADLOCK_DETECTED = "40P01"
LOCK_NOT_AVAILABLE = "55P03"
RAISE_EXCEPTION = "P0001"

CONSTRAINT_CODES: dict[str, ErrorCode] = {
    "uq_users_email": ErrorCode.EMAIL_ALREADY_REGISTERED,
    "uq_parts_shop_id_sku": ErrorCode.CONFLICT,
    "uq_shop_memberships_shop_id_user_id": ErrorCode.CONFLICT,
    "uq_services_active_name": ErrorCode.CONFLICT,
    "ck_purchase_order_items_quantities": ErrorCode.CONFLICT,
    "uq_qc_inspections_one_open_per_booking": ErrorCode.ALREADY_PICKED,
    "uq_estimates_booking_id_version": ErrorCode.CONCURRENT_UPDATE,
    "uq_estimates_one_open_version_per_booking": ErrorCode.CONCURRENT_UPDATE,
    "uq_estimates_one_approved_per_booking": ErrorCode.CONCURRENT_UPDATE,
    "ck_parts_on_hand_non_negative": ErrorCode.INSUFFICIENT_STOCK,
    "ck_parts_reserved_non_negative": ErrorCode.INSUFFICIENT_STOCK,
    "ck_parts_reserved_lte_on_hand": ErrorCode.INSUFFICIENT_STOCK,
    "ck_booking_parts_quantities": ErrorCode.INSUFFICIENT_STOCK,
    "uq_call_logs_one_active_per_booking": ErrorCode.CALL_BUSY,  # bonus (spec 05 §3.9)
}

SQLSTATE_CODES: dict[str, ErrorCode] = {
    DEADLOCK_DETECTED: ErrorCode.CONCURRENT_UPDATE,
    LOCK_NOT_AVAILABLE: ErrorCode.CONCURRENT_UPDATE,
    SERIALIZATION_FAILURE: ErrorCode.CONCURRENT_UPDATE,
}


def _driver_error_attribute(error: DBAPIError, name: str) -> str | None:
    """Read an attribute of the driver error (asyncpg's error is the adapter error's cause)."""
    original = error.orig
    for candidate in (original, getattr(original, "__cause__", None)):
        value = getattr(candidate, name, None)
        if isinstance(value, str):
            return value
    return None


def constraint_name(error: DBAPIError) -> str | None:
    """Name of the violated constraint, e.g. `uq_parts_shop_id_sku` (None if unknown)."""
    return _driver_error_attribute(error, "constraint_name")


def sqlstate(error: DBAPIError) -> str | None:
    """The PostgreSQL SQLSTATE of a database error, e.g. `23505` (None if unknown)."""
    return _driver_error_attribute(error, "sqlstate")


def error_code_for(error: DBAPIError) -> ErrorCode | None:
    """The API error code for a database error, or None when it must stay a 500."""
    name = constraint_name(error)
    if name is not None and name in CONSTRAINT_CODES:
        return CONSTRAINT_CODES[name]
    state = sqlstate(error)
    if state is not None:
        return SQLSTATE_CODES.get(state)
    return None
