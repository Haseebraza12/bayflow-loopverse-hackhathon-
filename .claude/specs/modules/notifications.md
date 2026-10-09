# Module: notifications

**Status:** Draft
**Package:** `app.modules.notifications`
**Owns tables:** `notifications` (glossary §7)
**Priority:** P0 for the 11 "Minimum" types, the bell API and the realtime ticket + WebSocket hub (spec 03 §4.1). P1 for the 4 "Extra" types and e-mail (D26). P2 for `CALL_MISSED`, `AI_TASK_CREATED` and the call/task pushes.

## Purpose

Everything that reaches a user goes through this module: notification rows under the bell with an unread count, the in-memory WebSocket hub with its ticket endpoint, and optional e-mail. Brief §5.4: the minimum notification table, then "In-app notifications (bell icon with unread count) are enough for core. Email is a nice addition." It also serves brief §7.4 (SA "notification bell"), §3 "Customer anxiety: … notifications at key steps", §2 "customer calls repeatedly to ask 'is my car ready?'" and the optional §8.3 ideas "Email … notifications" and "Real-time dashboard updates using WebSockets" (D14).

Nobody calls this module to send something: it subscribes to events (spec 01 rule 4). Rows are written **inside** the action's transaction; pushes and e-mails run **after** the commit.

## In scope

- **P0**
  - One row per recipient for the 11 Minimum types of glossary §6, each with `recipient_role` and a server-computed `link` (D67); "SAs of the shop" with the Owner fallback (D26).
  - Bell API: list, unread count, mark one read, mark all read (spec 03 §4.12). The web polls the unread count and the current view every 15 s whatever the socket does (D14).
  - Realtime: `GET /api/v1/realtime/ticket` (D70) and `WS /api/v1/ws`; after-commit pushes of `notification.created` and the visibility-filtered `booking.updated` (glossary §11).
  - The D83 push: a PO receipt that changes a booking's parts without changing its status still sends `booking.updated`.
- **P1:** the 4 Extra types (`BOOKING_CONFIRMED`, `ESTIMATE_RETURNED`, `QC_PASSED`, `BOOKING_CANCELLED`); e-mail for `ESTIMATE_SENT` and `VEHICLE_READY` with the `none` / `smtp` / `http` adapters (D26); NOT-08. Tier 2 (spec 04): single-use tickets and closing a user's sockets when a membership is deactivated.
- **P2:** `CALL_MISSED` (split by direction) and `AI_TASK_CREATED` rows; `call.incoming`, `call.updated`, `task.created` pushes; re-sending `call.incoming` when a socket connects; presence for the calls module.

## Out of scope

SMS, WhatsApp, browser push and PWA (brief §8.3 optional, D4); per-user preferences, digests or deletion of notifications; a message for membership changes (spec 06 open question 3); several API replicas (Redis fan-out, D14); replaying missed messages after a reconnect; languages other than English; e-mail for any other type.

## Key decisions

| D | What it means here |
|---|---|
| D14 | One in-memory hub in the single API process; pushes only after commit and only to users allowed to see the data; the client polls every 15 s anyway. |
| D26 | Recipients exactly as glossary §6; "SAs of the shop" = every active Service Advisor, else the Owner. In-app always; e-mail (P1) only for `ESTIMATE_SENT` and `VEHICLE_READY`, through `EMAIL_PROVIDER` `none` / `smtp` / `http`, never to `.test`, `.example`, `.invalid` or `.localhost`. |
| D67 | Each row stores `recipient_role` and a relative `link` for that recipient; clients only follow `link`. |
| D70 | The ticket is a JWT with `typ = "ws"` living 60 s, used only for the handshake; a rejected handshake closes with 1008 (browsers see 1006); tickets are redacted from logs. The ticket route belongs to this module. |
| D83 | A receipt that reserves stock for a booking without moving it pushes `booking.updated` (via `PurchaseOrderReceived`). |
| D7 | The socket connects directly to the API host; REST goes through the web origin's `/api/*` rewrite. |
| D9, D21 | Push recipients come from live database state at push time: active memberships and the booking-visibility predicate. |
| D63 | `created_at` of every row = the action's instant (`occurred_at` of the event); `read_at` = `utcnow()`; ticket `iat`/`exp` use the app clock. |
| D61 | Every `/api/*` response, including the ticket, is `Cache-Control: no-store` (middleware). |
| D51, D60 | The seed writes rows through the same handlers but stays quiet: `EMAIL_PROVIDER=none` and no connected sockets (spec 11). |
| D57, D58 | Bonus rows and pushes follow spec 05 §3.8 and §8.4. |

## Files

| File | Contents |
|---|---|
| `router.py` | The four `/api/v1/me/notifications…` routes, `GET /api/v1/realtime/ticket` and the `WebSocket` route `/api/v1/ws` (excluded from OpenAPI); tag `notifications`. Not shop-scoped (D80 applies to `/shops/{shop_id}` routes only). |
| `schemas.py` | `NotificationRead`, `UnreadCountRead`, `RealtimeTicketRead` (spec 03 §3.2, §3.7); internal `NewNotification`. |
| `service.py` | Row creation, list, count, mark read, ticket. |
| `repository.py` | `NotificationRepository`: insert many, list by recipient, unread count, mark one/all read. |
| `models.py` | Already implemented: `Notification`. |
| `handlers.py` | `register(bus, *, hub, email_sender)` (core) and `register_call_handlers(bus, *, hub)` (P2). |
| `realtime.py` | `RealtimeHub`: socket registry, sends, presence, connect hooks (spec 01 "Realtime hub"). |
| `channels/email.py` | `EmailSender` protocol, `NoopEmailSender`, `SmtpEmailSender`, `HttpEmailSender`, `build_email_sender(settings)`, `is_reserved_address(email)`. |
| `domain/recipients.py` | The trigger table below and recipient resolution rules (pure). |
| `domain/links.py` | `link_for(recipient_role, type, shop_id, booking_id)` (pure). |
| `domain/messages.py` | Title and body templates, money formatting, truncation (pure). |

## Public service interface

Writes take `uow`, reads `session`, first (spec 01).

**Row creation (nested; called by this module's handlers inside the publisher's transaction; never commit).**

| Function | Returns |
|---|---|
| `create_for_booking_action(uow, event: BookingActionApplied)` | `list[NotificationRead]` (empty when the action has no type) |
| `create_for_call_event(uow, event: CallStateChanged)` *(P2)* | `list[NotificationRead]` |
| `create_for_ai_task(uow, event: AiTaskCreated)` *(P2)* | `list[NotificationRead]` |

**HTTP use cases.**

| Function | Returns | Raises |
|---|---|---|
| `list_for_user(session, *, user_id, unread_only, page)` | `Page[NotificationRead]`, newest first | — |
| `count_unread(session, *, user_id)` | `int` | — |
| `mark_read(uow, *, user_id, notification_id)` (top-level, commits) | `None`; idempotent | 404 `NOT_FOUND` when the id is unknown or another user's |
| `mark_all_read(uow, *, user_id)` (top-level, commits) | number of rows changed | — |
| `issue_ws_ticket(user_id)` | `RealtimeTicketRead(ticket, expires_in=60)` from `app.core.security.issue_token(user_id, "ws", utcnow())`; no server state | — |

**Seed support (spec 11 "Notifications after seeding").** `list_for_bookings(session, *, shop_id, booking_ids) -> list[NotificationRead]` and `mark_read_bulk(uow, *, user_id, notification_ids) -> int` (ignores ids that are not that user's; commits).

**Realtime hub** (`realtime.RealtimeHub`; one instance created by `create_app()`, stored at `app.state.realtime_hub`, bound to the database in the lifespan with `hub.bind(database)`; no module-level state, spec 01 rule 5):

| Method | Use |
|---|---|
| `connect(user_id, websocket)`, `disconnect(user_id, websocket)` | WS route |
| `send_to_users(user_ids, message)` | every push; drops sockets that fail |
| `push_notifications(rows)`, `push_booking_updated(shop_id, booking_id)` | after-commit callbacks queued by the handlers |
| `is_online(user_id)`, `online_user_ids(user_ids)` | the `Presence` port of the calls module (P2, spec 05 §3.3) |
| `add_connect_hook(hook)` | P2: re-send ringing calls on connect |

**Reads this module needs from others** (all on the caller's session or the push's own session):

| Module | Function | For |
|---|---|---|
| shops | `list_active_member_ids(session, *, shop_id, role=None)` (spec 01) | SAs, QC inspectors, "still an active member" filter |
| shops | `get_owner_user_id(session, *, shop_id)` (spec 01) | D26 fallback |
| shops | `get_shop_briefs(session, *, shop_ids)` (proposed) | shop name in texts and `NotificationRead.shop_name` |
| bookings | `list_booking_viewer_ids(session, *, shop_id, booking_id)` (spec 01) | `booking.updated` recipients (D21, glossary §11) |
| bookings | `get_booking_briefs(session, *, shop_id, booking_ids)` (proposed; also used by inventory and calls) | `status`/`version` at push time; `NotificationRead.booking_reference` |
| identity | `get_users_by_ids(session, user_ids)` (spec 01), `get_active_user(session, user_id)` | names in texts, e-mail addresses; the WS handshake |
| calls *(P2)* | `get_call_read`, `get_task_read`, `list_ringing_calls_for_user` | push payloads, re-send on connect |

## Endpoints

All in [spec 03 §4.12](../03-api-contracts.md) and §6:

| Method | Path | `operationId` | Auth | Success | Pri |
|---|---|---|---|---|---|
| GET | `/api/v1/me/notifications` (`unread_only`, `limit`, `offset`) | `notifications_list_my_notifications` | session | 200 `Page[NotificationRead]` | P0 |
| GET | `/api/v1/me/notifications/unread-count` | `notifications_get_unread_count` | session | 200 `UnreadCountRead` | P0 |
| POST | `/api/v1/me/notifications/{notification_id}/read` | `notifications_mark_notification_read` | session (own) | 204 | P0 |
| POST | `/api/v1/me/notifications/read-all` | `notifications_mark_all_notifications_read` | session | 204 | P0 |
| GET | `/api/v1/realtime/ticket` | `notifications_get_realtime_ticket` | session | 200 `RealtimeTicketRead` | P0 |
| WS | `/api/v1/ws?ticket=…` | — (not in OpenAPI) | ticket | 101 | P0 |

## Domain rules and algorithms

### Trigger table (glossary §6, spec 08 "Notifications" column)

| `BookingActionApplied.action` | Type | Recipients → `recipient_role` | Pri |
|---|---|---|---|
| `CREATE` | `BOOKING_CREATED` | SAs of the shop → `SERVICE_ADVISOR` (fallback Owner → `OWNER`) | P0 |
| `CONFIRM` | `BOOKING_CONFIRMED` | the customer → `CUSTOMER` | P1 |
| `ASSIGN_TECHNICIAN`, `REASSIGN_TECHNICIAN` | `TECHNICIAN_ASSIGNED` | `technician_user_id` after the action → `TECHNICIAN` | P0 (reassign P1) |
| `SUBMIT_ESTIMATE` | `ESTIMATE_SUBMITTED` | SAs of the shop | P0 |
| `SEND_ESTIMATE` | `ESTIMATE_SENT` | the customer (+ e-mail, P1) | P0 |
| `APPROVE_ESTIMATE` | `ESTIMATE_APPROVED` | SAs of the shop | P0 |
| `REJECT_ESTIMATE` | `ESTIMATE_REJECTED` | SAs of the shop (the body quotes the reason) | P0 |
| `RETURN_TO_TECHNICIAN` | `ESTIMATE_RETURNED` | the assigned technician → `TECHNICIAN` | P1 |
| `ASSIGN_PARTS_PERSON`, `REASSIGN_PARTS_PERSON` | `PARTS_NEEDED` | `parts_person_user_id` after the action → `PARTS_PERSON` | P0 (reassign P1) |
| `ALLOCATE_PARTS` | `PARTS_READY` | the assigned technician | P0 |
| `SEND_TO_QC` | `QC_REQUESTED` | every active QC inspector → `QC_INSPECTOR` (no fallback) | P0 |
| `FAIL_QC` | `QC_FAILED` | the assigned technician | P0 |
| `PASS_QC` | `QC_PASSED` | SAs of the shop | P1 |
| `NOTIFY_READY` | `VEHICLE_READY` | the customer (+ e-mail, P1); every repeat sends again (BK-23) | P0 |
| `DECLINE`, or `CANCEL` by an SA or the Owner | `BOOKING_CANCELLED` | the customer | P1 |
| `CANCEL` by the customer (`actor_role = CUSTOMER`) | `BOOKING_CANCELLED` | SAs of the shop + the assigned technician + the assigned parts person (those set) | P1 |
| `START_INSPECTION`, `EDIT_ESTIMATE`, `REVISE_ESTIMATE`, `ORDER_PARTS`, `MARK_PARTS_READY`, `RECEIVE_PARTS`, `START_REPAIR`, `PICK_QC`, `COMPLETE` | — | no row | — |

Every action in the table, with or without a row, still pushes `booking.updated` (spec 03 §6.4).

### Recipient resolution (`domain/recipients.py` + reads)

1. **SAs of the shop** = the active `SERVICE_ADVISOR` members; when there is none, the shop's `OWNER` with `recipient_role = OWNER` (D26, NOT-03).
2. **Named staff** (technician, parts person) = the ids carried by the event (the state after the action), kept only if the user still has an active membership in the shop (D9, NOT-04). A deactivated assignee (D19) therefore gets nothing.
3. **QC inspectors** = all active `QC_INSPECTOR` members; none → no row.
4. **The customer** = `customer_user_id` (customers are global, no membership check).
5. One row per user and action: duplicates (only possible when a staff member is also the booking's customer) keep the first role in the table's order. The actor is **not** excluded: glossary §6 lists recipients literally (see Open questions).
6. `SYSTEM` is never a recipient (spec 02 §3.20).

### Links (D67, spec 03 §3.7, spec 09 §4.10)

| `recipient_role` | `link` |
|---|---|
| `CUSTOMER` | `/bookings/{booking_id}` |
| `SERVICE_ADVISOR`, `OWNER` | `/pos/shops/{shop_id}/bookings/{booking_id}` |
| `TECHNICIAN` | `/pos/shops/{shop_id}/jobs/{booking_id}` |
| `PARTS_PERSON` | `/pos/shops/{shop_id}/parts/{booking_id}` |
| `QC_INSPECTOR` | `/pos/shops/{shop_id}/qc/{booking_id}` |
| any role, type `AI_TASK_CREATED` (P2) | `/pos/shops/{shop_id}/calls` |

Links are built only from ids, never from input, and always satisfy `ck_notifications_link_relative` (starts with `/`, not `//`, no backslash). Opening a link still runs every route check: a booking the user can no longer see answers 404 (spec 04 tenant table).

### Texts (`domain/messages.py`)

English, composed once at write time. Placeholders: `{ref}` (event `reference`), `{shop}` (shop name), `{actor}` (actor's full name), `{customer}` (customer's full name), `{version}` and `{total}` (event metadata `version`, `grand_total` shown as "PKR 16,100", D41), `{note}` (the event note: decline/cancel/reject reason, return note). Titles are cut to 160 and bodies to 1000 characters with "…" (column sizes, spec 02 §3.20). Bodies are plain text; the UI renders them as text only (spec 04 threat 9).

| Type | Title | Body |
|---|---|---|
| `BOOKING_CREATED` | New booking {ref} | {customer} booked a visit at {shop}. |
| `BOOKING_CONFIRMED` | Booking confirmed — {ref} | {shop} confirmed your booking. |
| `TECHNICIAN_ASSIGNED` | New job {ref} | {actor} assigned this booking to you. |
| `ESTIMATE_SUBMITTED` | Estimate to review — {ref} | {actor} submitted estimate v{version} ({total}). |
| `ESTIMATE_SENT` | Your estimate is ready — {ref} | {shop} sent estimate v{version}: {total}. Review and approve it in BayFlow. |
| `ESTIMATE_APPROVED` | Estimate approved — {ref} | {customer} approved estimate v{version} ({total}). |
| `ESTIMATE_REJECTED` | Estimate declined — {ref} | {customer} declined estimate v{version}. Reason: {note, or "none given"}. |
| `ESTIMATE_RETURNED` | Estimate returned — {ref} | {actor} returned the estimate to you. {note} |
| `PARTS_NEEDED` | Parts needed — {ref} | Check and reserve the parts for this job. |
| `PARTS_READY` | Parts ready — {ref} | The parts are allocated; you can start the repair. |
| `QC_REQUESTED` | QC requested — {ref} | This job is waiting in the QC queue. |
| `QC_FAILED` | QC failed — {ref} | {actor} returned the job with an issue to fix. {note} |
| `QC_PASSED` | QC passed — {ref} | The vehicle is ready for pick-up. Notify the customer. |
| `VEHICLE_READY` | Your vehicle is ready for pick-up | Booking {ref} at {shop} is ready for pick-up. |
| `BOOKING_CANCELLED` (to the customer) | Booking cancelled — {ref} | {shop} cancelled your booking. Reason: {note}. |
| `BOOKING_CANCELLED` (to staff) | Booking cancelled — {ref} | {customer} cancelled the booking. {note} |
| `CALL_MISSED` C2S → SAs *(P2)* | Missed call from {first name} ({ref}) | Appends "— answered by the AI Front Desk" when the AI leg was dispatched (spec 05 §3.8) |
| `CALL_MISSED` S2C → customer *(P2)* | Missed call from {shop} | {shop} tried to call you about {ref}. |
| `AI_TASK_CREATED` *(P2)* | AI task: {task title} | {ref}; "Urgent" first when `is_urgent` |

### Write path (inside the action's transaction; spec 08 step 13)

`handlers.on_booking_action_applied(event, uow)`:

1. Look the action up in the trigger table; resolve recipients (reads above).
2. Compose title, body and link per recipient; insert all rows with `created_at = event.occurred_at` (one `INSERT … VALUES …`); build `NotificationRead` for each (shop name and reference are known here).
3. Queue after-commit work: `hub.push_notifications(rows)`; `hub.push_booking_updated(shop_id, booking_id)`; for `ESTIMATE_SENT` / `VEHICLE_READY`, the e-mail send (P1).

A failure in steps 1–2 raises and rolls the whole action back (no partial success, NOT-07). Step 3 runs only after a successful commit.

`handlers.on_purchase_order_received(event, uow)` (D83): when `event.booking_id` is set, queue `hub.push_booking_updated(shop_id, booking_id)`. When the receipt also fired `RECEIVE_PARTS`, the booking gets two identical pushes; clients ignore the second (same version).

### Push path (after commit)

- `notification.created` → each row's recipient only, `data` = `NotificationRead`.
- `booking.updated` → at push time, open a session: `get_booking_briefs` gives the current `status` and `version`; `list_booking_viewer_ids` gives the customer plus every **active** member who can see the booking under D21 (SAs and the Owner, its technician, its parts person, QC inspectors while it is `QC_PENDING` / `QC_IN_PROGRESS` or who inspected it). `data` = `{booking_id, shop_id, status, version}` exactly (glossary §11).
- Callbacks run as background tasks with their own session (spec 01 event-bus rule 5); a failure is logged with the request ID and never changes the HTTP response; nothing is pushed for a rolled-back action.

### Realtime hub (spec 03 §6, spec 04 "WebSocket ticket")

- **Handshake, before `accept()`, in this order:** an `Origin` header, when present, must equal `CLIENT_URL`; the `ticket` query value must decode with `decode_token(ticket, utcnow(), "ws")` (signature, `exp` by the app clock, `typ == "ws"`); the user must exist and be active (`identity.service.get_active_user`). Any failure → `close(code=1008)` before accept (browsers see 1006; tests assert 1008 with Starlette's `TestClient`, SEC-33).
- **After accept:** register the socket under the user id (several tabs allowed), run the connect hooks (P2), then read frames: `{"type": "ping"}` → `{"type": "pong", "data": {}}`; anything else, including invalid JSON, is ignored and the socket stays open. The socket outlives its 60 s ticket.
- **Sends:** JSON text frames `{"type", "data"}`; each send has a 5 s timeout; a socket that fails is dropped. No replay: after a reconnect the client refetches (spec 09 §2.12) and polling covers gaps.
- **State:** a `dict[UUID, set[WebSocket]]` mutated only on the event-loop thread; sends iterate over a copy. One replica (D14); presence is per process.
- **Logs:** `app.core.logging` rewrites `ticket=<value>` to `ticket=[redacted]` on uvicorn's loggers (D70, SEC-38).
- **Deactivation:** Tier 1 — a deactivated member stops receiving new pushes because recipients are computed from live state (SEC-13). Tier 2 — the hub closes that user's sockets. **Single-use tickets** (Tier 2, SEC-42): an in-memory set of consumed ticket hashes kept until their `exp`.

### E-mail (P1, D26)

| Item | Rule |
|---|---|
| When | After commit, for `ESTIMATE_SENT` and `VEHICLE_READY` rows whose `recipient_role` is `CUSTOMER`; one attempt, 10 s timeout, best effort |
| Skip | `EMAIL_PROVIDER=none`; or the address's last domain label is `test`, `example`, `invalid` or `localhost` (`is_reserved_address`) — logged as a skip with the notification id, never the address |
| Message | From `SMTP_FROM`; subject = title; plain-text body = body + "Open in BayFlow: " + `CLIENT_URL` + `link` (links from `CLIENT_URL`, never the request `Host`, spec 04) |
| `smtp` | `smtplib.SMTP(SMTP_HOST, SMTP_PORT)` run in `asyncio.to_thread`; `starttls()` + `login()` only when `SMTP_USER` is set (Mailpit needs neither) |
| `http` | Resend: `POST https://api.resend.com/emails`, `Authorization: Bearer <EMAIL_API_KEY>`, JSON `{"from", "to": [address], "subject", "text"}`, success `200 {"id"}`, header `Idempotency-Key: <notification_id>` (honoured for 24 h) so a retried send never duplicates (Resend API reference, checked 2026-10-09). Uses `httpx.AsyncClient`, so `httpx` moves from the dev group to the API's runtime dependencies when this ships |
| Failure | Logged; the action, the row and the response are unaffected (NOT-09) |

`build_email_sender(settings)` runs in `create_app()` (settings are already validated at startup, spec 01 "Configuration") and is passed to `handlers.register`.

### Bonus (P2; spec 05 §3.8, §8.4)

`register_call_handlers(bus, *, hub)` imports `app.modules.calls.events` **inside the function**; `create_app()` calls it only when the calls package is installed, so deleting `app/modules/calls` (and that one call) leaves the core working (spec 01 rule 6).

- `CallStateChanged`: when `previous_status == RINGING` and `status == MISSED`, insert `CALL_MISSED` rows — customer → shop: SAs of the shop (Owner fallback), staff booking link; shop → customer: the customer, customer booking link. After commit push `call.incoming` (the C1 event, `previous_status` null) to the rung users, otherwise `call.updated` to the caller, the answerer and everyone who was rung; `data` = `CallRead` from `calls.service.get_call_read` (no staff-only fields).
- `AiTaskCreated`: `AI_TASK_CREATED` rows for the SAs of the shop (link `/pos/shops/{shop_id}/calls`); after commit `task.created` (`TaskRead`) and `notification.created` to the same users.
- Connect hook: when a socket connects, re-send `call.incoming` for calls still `RINGING` that target the user (`list_ringing_calls_for_user`).
- `online_user_ids` is the presence the calls module uses to fill `rung_user_ids`.

## Events

| Event | Publisher | Handler | In the transaction | After commit |
|---|---|---|---|---|
| `BookingActionApplied` | bookings | `on_booking_action_applied` | rows per the trigger table | `notification.created`, `booking.updated`, e-mail |
| `PurchaseOrderReceived` | inventory | `on_purchase_order_received` | — | `booking.updated` for a linked booking (D83) |
| `CallStateChanged` *(P2)* | calls | `on_call_state_changed` | `CALL_MISSED` rows | `call.incoming` / `call.updated`, `notification.created` |
| `AiTaskCreated` *(P2)* | calls | `on_ai_task_created` | `AI_TASK_CREATED` rows | `task.created`, `notification.created` |

Publishes nothing. `create_app()` registers these handlers after the bookings handlers (spec 01 rule "wiring is explicit").

## Permissions and visibility

- `/api/v1/me/notifications…` see and change only the caller's rows (`recipient_user_id = me`); another user's id is 404 (SEC-34). A user's rows span all their shops and roles, and remain readable after a membership is deactivated (their links then answer 404).
- The ticket route accepts any logged-in user; a 401 there means the session has expired (spec 09).
- `notification.created` goes to its recipient only. `booking.updated` goes only to users who can see the booking under D21 at push time (SEC-33, NOT-12). Every row's recipient is the booking's customer or an active member of its shop (NOT-04).

## Errors

| Code | HTTP | When |
|---|---|---|
| `UNAUTHENTICATED` | 401 | Missing, invalid or expired session on any route |
| `NOT_FOUND` | 404 | Mark-read of an unknown notification or another user's |
| `VALIDATION_ERROR` | 422 | Malformed `notification_id`, `unread_only`, `limit` or `offset` |
| WebSocket close 1008 | — | Rejected handshake (bad ticket, foreign `Origin`, inactive user) |

Push and e-mail failures are logged, never returned.

## Concurrency and transactions

- Rows are inserted by the event handler in the publisher's transaction (spec 08 step 13), so they commit or roll back with the action (NOT-07); they take no lock of their own.
- `mark_read` is one `UPDATE … SET read_at = :now WHERE id = :id AND recipient_user_id = :me AND read_at IS NULL`; when it changes no row, a scoped existence check decides between 204 (already read) and 404. `mark_all_read` is one `UPDATE`. Both are idempotent and commit.
- Indexes: `ix_notifications_unread` (count, mark-all), `ix_notifications_recipient_user_id_created_at` (list, `ORDER BY created_at DESC, id DESC`).
- After-commit work never reuses the request session and runs outside the request's lifetime; the shutdown drains pending callbacks (`drain_after_commit_tasks`).

## Tests

- **Must pass (spec 12):** NOT-01 … NOT-07, NOT-10, NOT-11; NOT-12 and SEC-33 once `/api/v1/ws` ships; NOT-02, NOT-08, NOT-09 (P1); NOT-13 (P2); SEC-13 (no realtime message for a deactivated member), SEC-34, SEC-38 (ticket redaction), API-13 (`no-store` on the ticket), DEP-04 (P1), SEED-18 (P1); web WEB-10, WEB-11 and SEC-39 rely on these responses.
- **Proposed additions:**

| ID | Test |
|---|---|
| NOT-14 | `link_for` for every `recipient_role` and `AI_TASK_CREATED` (unit); every link passes the `ck_notifications_link_relative` rule |
| NOT-15 | Texts: placeholders filled from the event; a 2,000-character cancel reason is cut to the 1,000-character body |
| NOT-16 | Ticket: exactly `sub`, `iat`, `exp = iat + 60`, `typ = "ws"`; used as a Bearer token → 401; no row or server state created |
| NOT-17 | WebSocket: `ping` → `pong`; unknown frames and invalid JSON are ignored and the socket stays open |
| NOT-18 | D83: a partial receipt pushes `booking.updated` to the booking's viewers only |
| NOT-19 | `http` adapter request (mocked transport): URL, Bearer key, JSON body, `Idempotency-Key`; reserved-TLD skip makes no request |
| NOT-20 | A socket whose send fails is removed; the action's HTTP response is unchanged |
| NOT-21 | Mark-read twice → 204 both times, `read_at` unchanged by the second call |

## Implementation checklist

1. `domain/recipients.py`, `domain/links.py`, `domain/messages.py` with unit tests (NOT-14, NOT-15).
2. `repository.py`, `service.py` (create rows, list, count, mark read, mark all read).
3. `handlers.register`: `BookingActionApplied` → rows; wire it in `create_app()` after bookings.
4. Bell routes (P0 bell works with polling, spec 14 PH6).
5. `realtime.py` hub, ticket route, WebSocket route; after-commit pushes; `hub.bind(database)` in the lifespan; `app.state.realtime_hub`.
6. D83 handler for `PurchaseOrderReceived`.
7. P1: Extra types; `channels/email.py` (`none`, `smtp`, `http`), `httpx` as a runtime dependency; seed-support functions.
8. P2: `register_call_handlers`, connect hook, presence for calls.
9. Tests above, including the WebSocket modules with Starlette's `TestClient` (spec 12 §4.2).

## Dependencies (specs)

- [17-decisions.md](../17-decisions.md) D7, D9, D14, D21, D26, D51, D60, D61, D63, D67, D70, D83 (bonus D57, D58); [18-glossary.md](../18-glossary.md) §2.2, §6, §8, §11, §12.
- [08-booking-state-machine.md](../08-booking-state-machine.md) "Notifications" column, step 13–15; [03-api-contracts.md](../03-api-contracts.md) §3.7, §4.12, §6; [02-data-model.md](../02-data-model.md) §3.20.
- [01-architecture.md](../01-architecture.md) event bus, after-commit hooks, realtime hub, e-mail; [04-auth-and-security.md](../04-auth-and-security.md) WebSocket ticket, threats 17, 18, 23, SEC-33/34; [07-deployment-and-docs.md](../07-deployment-and-docs.md) e-mail variables, Mailpit; [09-frontend-and-ux.md](../09-frontend-and-ux.md) §2.12, §4.10; [11-seed-data.md](../11-seed-data.md); [12-quality-and-testing.md](../12-quality-and-testing.md) NOT, SEC.
- [05-calling-and-ai-front-desk.md](../05-calling-and-ai-front-desk.md) §3.8, §8.4 (P2); [inventory.md](inventory.md), [qc.md](qc.md), [calls.md](calls.md).

## Open questions

1. **WebSocket priority.** Spec 03 §4.1 lists the ticket and `/api/v1/ws` as P0; spec 14 PH6 and spec 12 (NOT-08 P1, "P0 once `/api/v1/ws` ships") treat the socket as P1. This spec keeps spec 03's P0 but builds it after the polled bell.
2. **D83 and the client rule.** Spec 03 §6.4 says a partial receipt "pushes nothing" (and its open question 7 asks about it); D83 now requires the push. Because no booking event is written, the push carries an unchanged `version`, and spec 03 §6.4 / spec 09 §2.7 tell clients to ignore a `booking.updated` that is not newer. Proposal: on every `booking.updated` for an open booking, clients invalidate its child panels (parts, POs) even when the version is unchanged. The alternative, a `parts_changed` flag in the payload, would change glossary §11.
3. **Notifying the actor.** Glossary §6 lists recipients without excluding the actor. It only matters when a staff member is also the booking's customer (e.g. an SA who cancels their own booking gets the staff `BOOKING_CANCELLED`). Keep literal, or exclude the actor?
4. **Spec 01 rule 6 vs its dependency graph.** Rule 6 says no core module imports `calls`, while the graph lets notifications use calls events. Resolved here with `register_call_handlers` and a function-level import; spec 01 should record it.
5. **Ticket owner.** Spec 04's Tier 1 table (item 12) still says "identity module, realtime hub"; D70 puts the ticket route in this module.
6. **E-mail vendor.** The `http` adapter targets Resend (spec 07 open question 1); another vendor means another adapter class, not a configuration change.

## Proposed glossary additions

| Kind | Name | Meaning |
|---|---|---|
| Python modules | `app.modules.notifications.realtime` (already proposed by spec 01), `app.modules.notifications.channels.email` | Hub; e-mail adapters |
| Runtime objects | `RealtimeHub` (`app.state.realtime_hub`), `EmailSender` | Created by `create_app()`; passed to handlers |
| Port | `Presence` (`online_user_ids`, `is_online`) | Implemented by the hub, consumed by calls (spec 05 §3.3) |
| Service functions | `create_for_call_event`, `create_for_ai_task`, `list_for_bookings`, `mark_read_bulk`, `register_call_handlers` | P2 and seed support |
| Cross-module reads | shops `get_shop_briefs`; bookings `get_booking_briefs` | Shared with inventory, reporting and calls |
| Code constant | `RESEND_EMAILS_URL = "https://api.resend.com/emails"` | The `http` adapter endpoint (glossary §12 has no URL variable, spec 07) |
