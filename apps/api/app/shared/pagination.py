"""Pagination (glossary §9): `?limit=` (default 20, 1-100) and `?offset=` (>= 0).

Every list endpoint returns `{"items": [...], "total": n, "limit": l, "offset": o}`; the query
behind it uses a deterministic order and a `COUNT(*)` with the same filters (spec 01).
"""

from collections.abc import Sequence
from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, Query
from pydantic import BaseModel, Field

DEFAULT_LIMIT = 20
MAX_LIMIT = 100


@dataclass(frozen=True, slots=True)
class PageParams:
    limit: int = DEFAULT_LIMIT
    offset: int = 0


def get_page_params(
    limit: Annotated[
        int, Query(ge=1, le=MAX_LIMIT, description="Maximum number of items to return.")
    ] = DEFAULT_LIMIT,
    offset: Annotated[int, Query(ge=0, description="Number of items to skip.")] = 0,
) -> PageParams:
    return PageParams(limit=limit, offset=offset)


PageParamsDep = Annotated[PageParams, Depends(get_page_params)]


class Page[T](BaseModel):
    """One page of a list response."""

    items: list[T]
    total: int = Field(ge=0, description="Number of items matching the filters, on all pages.")
    limit: int = Field(ge=1, le=MAX_LIMIT)
    offset: int = Field(ge=0)

    @classmethod
    def build(cls, items: Sequence[T], *, total: int, params: PageParams) -> "Page[T]":
        return cls(items=list(items), total=total, limit=params.limit, offset=params.offset)
