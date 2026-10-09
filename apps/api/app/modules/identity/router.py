"""HTTP routes of the identity module: `/api/v1/auth/*` (D81, spec 03 §4.3).

All three routes are public: they never read credentials (spec 03 §1.2). Login and owner
registration answer with the token fields and the `user` (no memberships) and set the `bf_session`
cookie; the web then calls `GET /api/v1/me` (served by the shops module). Per-IP ceilings are
slowapi decorators (route decorator above the limiter decorator; the endpoint takes `request`);
the per-account failure limiter, the primary control, lives in the service (D69).
"""

from fastapi import APIRouter, Request, Response, status

from app.core.error_handlers import problem_responses
from app.core.security import LOGIN_IP_LIMIT, REGISTER_OWNER_IP_LIMIT, limiter
from app.modules.identity import service
from app.modules.identity.schemas import OwnerRegistrationCreate, SessionCreate, SessionRead
from app.shared.auth import delete_session_cookie, set_session_cookie
from app.shared.uow import UowDep

router = APIRouter(prefix="/api/v1/auth", tags=["identity"])


@router.post(
    "/register-owner",
    status_code=status.HTTP_201_CREATED,
    summary="Register an owner account",
    description=(
        "Creates a user with no membership (D17) and logs it in: the token is returned in the "
        "body and set as the `bf_session` cookie. Create a shop next with `POST /api/v1/shops`."
    ),
    responses=problem_responses(409, 422, 429),
)
@limiter.limit(REGISTER_OWNER_IP_LIMIT)
async def register_owner(
    request: Request,
    response: Response,
    body: OwnerRegistrationCreate,
    uow: UowDep,
) -> SessionRead:
    session = await service.register_owner(
        uow,
        email=body.email,
        full_name=body.full_name,
        password=body.password,
        phone=body.phone,
    )
    set_session_cookie(response, session.access_token)
    return session


@router.post(
    "/login",
    summary="Log in",
    description=(
        "Returns the session token and the user (no memberships, D81) and sets the `bf_session` "
        "cookie. Call `GET /api/v1/me` next for memberships and capabilities. Five failed "
        "password checks per e-mail within 15 minutes block the account for the rest of the "
        "window (429), even with the right password (D69)."
    ),
    responses=problem_responses(401, 422, 429),
)
@limiter.limit(LOGIN_IP_LIMIT)
async def login(
    request: Request,
    response: Response,
    body: SessionCreate,
    uow: UowDep,
) -> SessionRead:
    session = await service.login(uow, email=body.email, password=body.password)
    set_session_cookie(response, session.access_token)
    return session


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    summary="Log out",
    description=(
        "Expires the `bf_session` cookie. Idempotent and needs no authentication. The JWT is "
        "stateless, so a copied Bearer token stays valid until it expires (spec 04)."
    ),
)
async def logout() -> Response:
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    delete_session_cookie(response)
    return response


routers = (router,)
