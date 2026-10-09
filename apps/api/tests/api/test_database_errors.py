"""Database errors mapped by constraint name (spec 02 §7.5-7.6, spec 03 §2.4)."""

import httpx
import pytest
from fastapi import APIRouter, FastAPI
from sqlalchemy.exc import DBAPIError

from app.core.database import DbSession
from app.core.db_errors import error_code_for
from app.core.errors import ErrorCode
from tests.rows import make_part, make_shop, make_user

router = APIRouter(prefix="/api/v1/_dberr", tags=["test"])


@router.post("/duplicate-email")
async def insert_duplicate_email(session: DbSession) -> None:
    session.add(make_user(email="twice@bayflow.test"))
    await session.flush()
    session.add(make_user(email="twice@bayflow.test"))
    await session.flush()


@router.post("/bad-sku")
async def insert_bad_sku(session: DbSession) -> None:
    shop = make_shop()
    session.add(shop)
    await session.flush()
    session.add(make_part(shop, sku="not a valid sku"))  # ck_parts_sku_format: not mapped
    await session.flush()


class FakeDriverError(Exception):
    def __init__(self, constraint: str | None, state: str | None) -> None:
        super().__init__("driver error")
        self.constraint_name = constraint
        self.sqlstate = state


def wrap(constraint: str | None, state: str | None, *, as_cause: bool = False) -> DBAPIError:
    driver = FakeDriverError(constraint, state)
    if as_cause:  # SQLAlchemy's asyncpg adapter raises its own error *from* asyncpg's
        adapted = Exception("adapted")
        adapted.__cause__ = driver
        return DBAPIError("SQL", {}, adapted)
    return DBAPIError("SQL", {}, driver)


@pytest.mark.parametrize(
    ("constraint", "state", "code"),
    [
        ("uq_users_email", "23505", ErrorCode.EMAIL_ALREADY_REGISTERED),
        ("uq_parts_shop_id_sku", "23505", ErrorCode.CONFLICT),
        ("uq_services_active_name", "23505", ErrorCode.CONFLICT),
        ("uq_qc_inspections_one_open_per_booking", "23505", ErrorCode.ALREADY_PICKED),
        ("uq_estimates_one_open_version_per_booking", "23505", ErrorCode.CONCURRENT_UPDATE),
        ("ck_parts_reserved_lte_on_hand", "23514", ErrorCode.INSUFFICIENT_STOCK),
        ("ck_booking_parts_quantities", "23514", ErrorCode.INSUFFICIENT_STOCK),
        (None, "40P01", ErrorCode.CONCURRENT_UPDATE),
        (None, "55P03", ErrorCode.CONCURRENT_UPDATE),
        ("ck_parts_sku_format", "23514", None),
        (None, "P0001", None),
        (None, None, None),
    ],
)
def test_error_codes_by_constraint_name(
    constraint: str | None, state: str | None, code: ErrorCode | None
) -> None:
    assert error_code_for(wrap(constraint, state)) == code
    assert error_code_for(wrap(constraint, state, as_cause=True)) == code


@pytest.fixture
def _routes(db_app: FastAPI) -> None:
    db_app.include_router(router)


@pytest.mark.usefixtures("_routes")
async def test_a_unique_violation_becomes_its_code(db_client: httpx.AsyncClient) -> None:
    response = await db_client.post("/api/v1/_dberr/duplicate-email")
    assert response.status_code == 409
    body = response.json()
    assert body["code"] == "EMAIL_ALREADY_REGISTERED"
    assert "uq_users_email" not in response.text
    assert "INSERT" not in response.text


@pytest.mark.usefixtures("_routes")
async def test_unmapped_database_errors_stay_internal(db_client: httpx.AsyncClient) -> None:
    response = await db_client.post("/api/v1/_dberr/bad-sku")
    assert response.status_code == 500
    assert response.json()["code"] == "INTERNAL_ERROR"
    assert "ck_parts_sku_format" not in response.text
    assert response.headers["cache-control"] == "no-store"
