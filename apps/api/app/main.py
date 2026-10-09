"""BayFlow API application factory (spec 01).

`create_app()` wires settings, logging, middleware, error handlers, event-bus subscriptions,
routers and the lifespan (engine created at start-up, disposed at shutdown). Nothing does I/O at
import time, so tests and the OpenAPI export can build the app without a database.
"""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from enum import Enum

from fastapi import FastAPI
from fastapi.routing import APIRoute

from app.core.config import Settings, get_settings
from app.core.database import Database
from app.core.error_handlers import install_problem_openapi, register_error_handlers
from app.core.health import router as health_router
from app.core.logging import configure_logging
from app.core.middleware import install_middleware
from app.core.security import limiter
from app.models_registry import MODEL_MODULES
from app.shared.event_bus import EventBus
from app.shared.uow import drain_after_commit_tasks

API_TITLE = "BayFlow API"
# A fixed string: the exported OpenAPI file changes only when the contract changes (spec 03 §1.1).
API_VERSION = "1.0.0"
API_DESCRIPTION = (
    "Multi-tenant auto repair shop platform. Errors are RFC 9457 `application/problem+json` "
    "with a `code` (glossary §10). Authenticate with the `bf_session` cookie or "
    "`Authorization: Bearer <access_token>`."
)

logger = logging.getLogger("app")


def operation_id(route: APIRoute) -> str:
    """spec 03 §1.11: operationId = `<tag>_<endpoint function name>` (`system_health`)."""
    if not route.tags:
        return route.name
    tag = route.tags[0]
    return f"{tag.value if isinstance(tag, Enum) else tag}_{route.name}"


def register_event_handlers(bus: EventBus) -> None:
    """Explicit wiring of every module's `handlers.register(bus)` (spec 01 "Event bus").

    No module publishes or subscribes yet; nothing is ever subscribed at import time.
    """


def create_app(settings: Settings | None = None, *, database: Database | None = None) -> FastAPI:
    """Build the API. `database` lets tests inject an engine (e.g. with `NullPool`)."""
    settings = settings or get_settings()
    configure_logging(settings.log_level)
    for warning in settings.startup_warnings():
        logger.warning(warning)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        db = database or Database.from_settings(settings)
        app.state.db = db
        server_version = await db.server_version()
        logger.info(
            "BayFlow API %s starting (APP_ENV=%s, PostgreSQL %s, %d model modules)",
            API_VERSION,
            settings.app_env,
            server_version or "unreachable",
            len(MODEL_MODULES),
        )
        try:
            yield
        finally:
            await drain_after_commit_tasks()
            if database is None:
                await db.dispose()
            logger.info("BayFlow API stopped")

    app = FastAPI(
        title=API_TITLE,
        version=API_VERSION,
        description=API_DESCRIPTION,
        docs_url="/docs",
        redoc_url=None,
        openapi_url="/openapi.json",
        redirect_slashes=False,  # a redirect through the Vercel rewrite would lose the cookie
        generate_unique_id_function=operation_id,
        lifespan=lifespan,
        debug=False,  # never render tracebacks
    )
    app.state.settings = settings
    app.state.event_bus = EventBus()
    app.state.limiter = limiter  # slowapi reads it from here
    register_event_handlers(app.state.event_bus)
    register_error_handlers(app)
    install_middleware(app, settings)
    app.include_router(health_router)
    install_problem_openapi(app)
    return app


app = create_app()
