# 19 — Platform administration (super admin) and the audit log

## Purpose

BayFlow is a multi-tenant SaaS: shops are tenants, and someone has to run the platform. This spec
defines the **platform admin** ("super admin") role, the platform-wide **audit log**, **shop
suspension**, the admin API (E-61…E-75) and the admin console (screens A-01…A-08). Decisions
D94–D97 (spec 17) summarise it; this file is authoritative for the details. Added on 2026-10-10 at
the owner's request; the brief does not ask for it, so it is P1 and never blocks a P0 path.

## 1. Roles and principles

| | Rule |
|---|---|
| **Who** | A platform admin is a BayFlow operator: a `users` row with `is_platform_admin = true` (D94). It is **not** a shop role (`MembershipRole` keeps its five values, D15). A platform admin may also hold shop memberships; each hat is used separately. |
| **How one is made** | Never by sign-up. The first admin comes from `python -m app.scripts.create_platform_admin --email … --full-name …` (password from the `PLATFORM_ADMIN_PASSWORD` environment variable or a prompt; idempotent: an existing user is promoted, nothing else changes) or from the seed's demo account (§8). After that, admins grant or revoke the flag in the console (E-70/E-71). |
| **What "full control" means** | Read everything across tenants (shops, users, bookings with their timelines, the audit log, platform KPIs) and use the platform's levers: suspend or reactivate a shop, deactivate or reactivate any account, grant or revoke platform admin. Tenants' own data (bookings, estimates, stock) is changed by tenants, never by an admin silently (least privilege): there is no impersonation, no booking edit and no hard delete (spec 02: deactivate, never delete). |
| **Safeguards** | No admin can revoke their own admin flag or deactivate themselves (403 `FORBIDDEN`). The last active platform admin can be neither revoked nor deactivated (409 `CONFLICT`, "BayFlow needs at least one active platform admin."). Granting requires an active account (422 `VALIDATION_ERROR` on `user_id`). Every admin write takes a reason where it restricts someone (suspend, deactivate). |
| **Accountability** | Every admin write, and every admin read of a person's or a booking's detail (A-05, A-07), writes an audit event (D95). The audit log is append-only: no API changes it and a database trigger rejects `UPDATE` and `DELETE` on `audit_events`. |

## 2. Shop suspension (D96)

A platform admin suspends a shop with a reason (5–500 characters); reactivation clears it. While a
shop is suspended:

| Surface | Behaviour |
|---|---|
| Public directory, shop detail, availability, booking creation (E-06…E-10) | The shop is treated exactly like an unlisted one: absent from lists and cities, 404 on detail, availability and `POST /bookings`. |
| Staff routes (everything behind `require_shop_member`, incl. reporting) | 403 `SHOP_SUSPENDED` for every member, the Owner included, before the role check. Detail: "This shop is suspended. Contact BayFlow support." |
| `GET /api/v1/me` | Each membership's `shop` gains `suspended: boolean`, so the POS can show the suspended state without calling a blocked route. |
| Customer routes (`/me/bookings…`) | Reads keep working. Actions return 403 `SHOP_SUSPENDED`, except `cancel`, so a customer is never stuck with a booking at a closed shop. |
| Data | Nothing is deleted or changed: bookings, stock and memberships stay as they are and resume on reactivation. |

Columns (spec 02): `shops.suspended_at`, `shops.suspended_reason`, `shops.suspended_by_user_id`
(FK `users`, `RESTRICT`), all null or all set (`ck_shops_suspension_complete`). Suspending a
suspended shop or reactivating an active one is 409 `CONFLICT`.

## 3. The audit log (D95)

### 3.1 Table `audit_events` (owned by the new `audit` module)

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | `uuid` | no | PK |
| `occurred_at` | `timestamptz` | no | The action's clock instant (D63) |
| `category` | `audit_category` enum | no | `AUTH`, `USER`, `SHOP`, `MEMBERSHIP`, `BOOKING`, `ADMIN` |
| `action` | `varchar(64)` | no | Dotted, lower snake case, from the catalogue below (e.g. `shop.suspended`) |
| `summary` | `varchar(300)` | no | One human sentence, no secrets (e.g. "Areeba Hashmi suspended Raza Auto Works") |
| `actor_user_id` | `uuid` | yes | FK `users` `RESTRICT`; null for anonymous and system events |
| `actor_role` | `varchar(32)` | yes | `PLATFORM_ADMIN`, a `MembershipRole`, `CUSTOMER`, `SYSTEM` or `ANONYMOUS` |
| `shop_id` | `uuid` | yes | FK `shops` `RESTRICT`; the tenant the event belongs to |
| `target_type` | `varchar(32)` | yes | `USER`, `SHOP`, `MEMBERSHIP`, `BOOKING` |
| `target_id` | `uuid` | yes | No FK (polymorphic) |
| `target_label` | `varchar(200)` | yes | What a human recognises: a booking reference, a shop name, an e-mail |
| `metadata` | `jsonb` | no | Default `{}`; e.g. `{reason}`, `{from_status, to_status}`, `{changes: {field: {from, to}}}`. Never a password, token or hash. |
| `ip` | `inet` | yes | `app.core.security.client_ip` of the request (trusted-proxy rules of the rate limiter) |
| `user_agent` | `varchar(255)` | yes | Truncated |
| `request_id` | `varchar(64)` | yes | The `X-Request-ID` (spec 03 §1.8) |

Indexes: `(occurred_at DESC, id DESC)`, `(shop_id, occurred_at DESC)`, `(actor_user_id,
occurred_at DESC)`, `(category, occurred_at DESC)`, `(target_type, target_id)`. Trigger
`trg_audit_events_append_only` raises on `UPDATE` and `DELETE`.

### 3.2 How rows are written

- **Event driven.** Modules publish domain events on the bus (spec 01 "Event bus"); the `audit`
  module's handlers turn each into one row **in the same transaction**, so the row commits
  together with the change or not at all. Modules never import `audit`.
- **Request context.** The HTTP middleware puts the client IP, user agent and request ID in context
  variables (`app.core`); the audit handlers read them. Scripts and the seed have none (nulls).
- **Failed logins.** `login` publishes `LoginFailed` / `LoginRateLimited` and commits that
  transaction (which holds nothing else) before raising, so the attempt is recorded although the
  login fails. The e-mail is stored lower-cased in `metadata.email`.
- **Booking activity** comes from the existing `BookingActionApplied` event: one row per
  transition or operation, so the admin sees all tenants' activity in one place. `booking_events`
  stays the booking's own history (D22); the two are written in the same transaction.

### 3.3 Catalogue

| Category | Action | Published by | Actor | Target | Metadata |
|---|---|---|---|---|---|
| `AUTH` | `auth.login_succeeded` | identity `LoginSucceeded` | the user | `USER` | — |
| `AUTH` | `auth.login_failed` | identity `LoginFailed` | — (`ANONYMOUS`) | — | `{email}` |
| `AUTH` | `auth.login_rate_limited` | identity `LoginRateLimited` | — (`ANONYMOUS`) | — | `{email}` |
| `AUTH` | `auth.logged_out` | identity `LoggedOut` (when the cookie or bearer names a user) | the user | `USER` | — |
| `AUTH` | `auth.owner_registered` | identity `OwnerRegistered` | the new user | `USER` | — |
| `USER` | `user.customer_created` | identity `CustomerAccountCreated` (booking wizard) | the new user (`CUSTOMER`) | `USER` | — |
| `USER` | `user.deactivated` / `user.reactivated` | identity `UserActiveChanged` | admin | `USER` | `{reason}` (deactivate) |
| `USER` | `user.platform_admin_granted` / `…_revoked` | identity `PlatformAdminChanged` | admin | `USER` | — |
| `SHOP` | `shop.created` | shops `ShopCreated` | the owner | `SHOP` | — |
| `SHOP` | `shop.updated` | shops `ShopUpdated` | the owner | `SHOP` | `{changes}` (only changed fields) |
| `SHOP` | `shop.working_hours_replaced` | shops `WorkingHoursReplaced` | the owner | `SHOP` | — |
| `SHOP` | `shop.suspended` / `shop.reactivated` | shops `ShopSuspensionChanged` | admin | `SHOP` | `{reason}` (suspend) |
| `MEMBERSHIP` | `membership.added` | shops `MembershipAdded` | the owner | `MEMBERSHIP` | `{role, member_email}` |
| `MEMBERSHIP` | `membership.role_changed` | shops `MembershipRoleChanged` | the owner | `MEMBERSHIP` | `{from, to}` |
| `MEMBERSHIP` | `membership.deactivated` / `…reactivated` | shops `MembershipActiveChanged` | the owner | `MEMBERSHIP` | — |
| `BOOKING` | `booking.<action slug>` (e.g. `booking.approve_estimate`) | bookings `BookingActionApplied` | the actor (or `SYSTEM`) | `BOOKING` (label = reference) | `{from_status, to_status, version}` (+ `note` when set) |
| `ADMIN` | `admin.user_viewed`, `admin.booking_viewed` | admin module (E-67, E-73) | admin | `USER` / `BOOKING` | — |
| `ADMIN` | `admin.audit_exported` | admin module (E-75) | admin | — | `{filters, rows}` |

## 4. API (E-61…E-75, tag `admin`, operation IDs `admin_*`)

All routes are under `/api/v1/admin`, behind `require_platform_admin` (401 when not logged in, 403
`FORBIDDEN` when the user is not a platform admin). Lists are `Page[T]` (spec 03 §1.6).

| ID | Method and path | Notes |
|---|---|---|
| E-61 | `GET /overview` | `PlatformOverviewRead`: shop counts (total, active, suspended, listed, new in 30 days); user counts (total, customers, staff, platform admins, inactive, new in 30 days); bookings (today, last 7 and 30 days, open, completed and cancelled in 30 days, open per `StatusPhase`); bookings per day for 14 days (shop time zone, D38); top 5 shops by bookings in 30 days; the 10 latest audit events |
| E-62 | `GET /shops` | Filters `q` (name, slug, city, owner e-mail), `status` (`ACTIVE`, `SUSPENDED`), `listed`, `city`; sort `-created_at` (default), `name`, `-bookings_30d`. Row: shop ref, city, created_at, is_listed, suspension, owners `[{name, email}]`, active members, bookings in 30 days |
| E-63 | `GET /shops/{shop_id}` | Profile, suspension (`at`, `reason`, `by`), members by role, booking counts by phase, the 10 latest bookings, the 10 latest audit events of the shop |
| E-64 | `POST /shops/{shop_id}/suspend` | Body `{reason}` (5–500). 409 when already suspended. Returns E-63's body |
| E-65 | `POST /shops/{shop_id}/reactivate` | 409 when not suspended. Returns E-63's body |
| E-66 | `GET /users` | Filters `q` (name, e-mail, phone), `kind` (`CUSTOMER` = no active membership, `STAFF`, `PLATFORM_ADMIN`), `status` (`ACTIVE`, `INACTIVE`); sort `-created_at` (default), `name`, `-last_login_at`. Row: id, name, e-mail, phone, is_active, is_platform_admin, created_at, last_login_at, memberships `[{shop ref, role, is_active}]` |
| E-67 | `GET /users/{user_id}` | Row + bookings as customer (count and 10 latest) + the 10 latest audit events by or about the user. Writes `admin.user_viewed` |
| E-68 | `POST /users/{user_id}/deactivate` | Body `{reason}` (5–500). Self → 403; last active admin → 409; already inactive → 409. The user's tokens stop working at their next request (D9) |
| E-69 | `POST /users/{user_id}/reactivate` | Already active → 409 |
| E-70 | `POST /users/{user_id}/grant-platform-admin` | Inactive account → 422; already admin → 409 |
| E-71 | `POST /users/{user_id}/revoke-platform-admin` | Self → 403; last active admin → 409; not an admin → 409 |
| E-72 | `GET /bookings` | All tenants. Filters `q` (reference, plate, customer name or e-mail), `shop_id`, `status` (repeatable), `date_from`/`date_to` (slot date in the shop's zone); sort `-slot_start` (default), `slot_start`, `-created_at` |
| E-73 | `GET /bookings/{booking_id}` | The staff projection (no `allowed_actions`: read-only) and its events. Writes `admin.booking_viewed` |
| E-74 | `GET /audit-events` | Filters `category` (repeatable), `action`, `actor_user_id`, `shop_id`, `target_type`, `target_id`, `from`, `to`, `q` (summary and target label); sort `-occurred_at` (default) |
| E-75 | `GET /audit-events/export` | `text/csv` (UTF-8, header row, RFC 4180 quoting, cells starting with `=+-@` prefixed with `'` against CSV injection), same filters, at most 10 000 rows (newest first). Writes `admin.audit_exported` |

`GET /api/v1/me` (E-04) adds `is_platform_admin`. New error code: `SHOP_SUSPENDED` (403, glossary §10).

## 5. Console (screens A-01…A-08, route group `(admin)`, path `/admin`)

Carbon product UI (DESIGN.md) with its own shell: a dark header "BayFlow · Platform admin" with the
user menu, and a side nav (Overview, Shops, Users, Bookings, Audit log). Only platform admins see
it; anyone else gets `ForbiddenState` ("This area is for BayFlow platform admins."). Logging in as a
platform admin without memberships lands on `/admin`; one with memberships gets "Platform admin" in
the account menu.

| ID | Route | Content |
|---|---|---|
| A-01 | `/admin` | KPI tiles (shops, users, bookings today, open bookings), bookings per day (14 days), open bookings by phase, top shops, suspended shops needing attention, latest audit events |
| A-02 | `/admin/shops` | Search and filters (status, listed, city); table with status badges; row → A-03 |
| A-03 | `/admin/shops/:shopId` | Profile, owners and team, booking counts by phase, latest bookings, shop audit trail; **Suspend** (dialog with a required reason and the consequences listed) / **Reactivate** |
| A-04 | `/admin/users` | Search and filters (kind, status); table with role chips; row → A-05 |
| A-05 | `/admin/users/:userId` | Profile, memberships, bookings as customer, the user's audit trail; **Deactivate** (reason, warns when the user is a shop's only active owner) / **Reactivate**; **Grant / Revoke platform admin**; self and last-admin cases disabled with the reason shown |
| A-06 | `/admin/bookings` | Search and filters (shop, status, dates); table; row → A-07 |
| A-07 | `/admin/bookings/:bookingId` | Read-only booking: status, customer, vehicle, services, estimate total, the full timeline |
| A-08 | `/admin/audit` | Filters (category, shop, actor, period, text), newest first, a detail sheet with the metadata, and **Export CSV** |

Every destructive action uses an `AlertDialog` with a reason field and a toast on success; every
list has loading skeletons, an empty state and an error state.

## 6. Module placement (spec 01, D97)

- `audit` (new): owns `audit_events`; `handlers.py` subscribes to the events in §3.3;
  `service.py` exposes list and count reads. It sits in the top layer with notifications and
  reporting: `notifications | reporting | audit`.
- `admin` (new): owns no table; its router serves E-61…E-75 and its service composes the read and
  write ports of identity, shops, bookings and audit. It is the new top layer, above everything.
- `MODULES` (D89) becomes `identity, shops, scheduling, inventory, qc, estimates, bookings,
  notifications, reporting, audit, admin, calls`.
- `app.shared.auth` gains `require_platform_admin` (`PlatformAdminDep`) and checks suspension in
  `require_shop_member` (shops read port `get_shop_suspension`).

## 7. Edge cases

| Case | Behaviour |
|---|---|
| An admin who is also an Owner | Uses `/admin` and the POS separately; suspending their own shop locks their POS too |
| Deactivating a shop's only active owner | Allowed; A-05 warns first. The shop keeps working for its other staff |
| Two admins act on the same shop at once | Each write locks the row (`FOR UPDATE`); the second gets 409 (already suspended / not suspended) |
| An admin is deactivated by another while signed in | Their next request is 401 (D9) and the console sends them to `/login?reason=expired` |
| Unknown IDs | 404 `NOT_FOUND` as everywhere |
| CSV with commas, quotes, newlines or formula prefixes | RFC 4180 quoting; formula prefixes neutralised |

## 8. Seed and demo (D52, spec 11)

The seed adds the platform admin **Areeba Hashmi**, `admin@bayflow.test`, password
`BayFlow@2026`, no memberships, listed with the other demo accounts on the login page and in the
README.

## 9. Tests (spec 12)

- Authorization: every E-61…E-75 route is 401 anonymous and 403 for each shop role and customers.
- Safeguards: self-revoke, self-deactivate, last-admin revoke and deactivate, double suspend and
  reactivate, grant to an inactive account.
- Suspension: every surface in §2, incl. customer `cancel` still allowed, and reactivation restoring
  access.
- Audit: one row per catalogue action in the same transaction (a rolled-back action leaves none);
  failed and rate-limited logins persist; the append-only trigger rejects `UPDATE` and `DELETE`;
  request context captured; no secrets in metadata.
- CSV export: quoting, formula neutralisation and the 10 000-row cap.
- Web: the console's guards, lists, dialogs and the mock data flows.

## Dependencies

17 (D94–D97), 01, 02, 03, 04, 10, 11, 12, 18.
