#!/usr/bin/env bash
# BayFlow post-deploy smoke test (spec 07 "Post-deploy smoke test"; spec 12 DEP-01…DEP-03, D7, D61, D68, D70).
#
#   make smoke WEB_URL=https://<project>.vercel.app API_URL=https://<api>.up.railway.app
#   WEB_URL=http://localhost:3000 API_URL=http://localhost:4000 scripts/smoke.sh     # local stack
#
# Needs bash, curl and jq. Optional: SMOKE_SHOP_SLUG = the seeded shop to book at (default: the first
# listed shop that is not one of Fatima's demo shops, so Lahore Auto Care's data stays clean).
# Side effects: creates one throw-away customer (smoke+<epoch>@bayflow.test — a reserved .test address,
# never e-mailed, D26) and one booking at that shop, then cancels it (its Service Advisors get two
# notifications). Public routes use the shop slug and slots report `remaining` (D68); every response
# that goes through the web origin's /api rewrite must carry Cache-Control: no-store and must never be
# a Vercel cache HIT (D61). Field names follow spec 03 — update this script when spec 03 changes them.
set -euo pipefail

: "${WEB_URL:?set WEB_URL, e.g. WEB_URL=https://<project>.vercel.app}"
: "${API_URL:?set API_URL, e.g. API_URL=https://<api>.up.railway.app}"
WEB_URL="${WEB_URL%/}"
API_URL="${API_URL%/}"
for tool in curl jq; do
  command -v "$tool" >/dev/null 2>&1 || {
    printf 'FAIL: %s is required\n' "$tool" >&2
    exit 1
  }
done

DEMO_PASSWORD='BayFlow@2026' # every demo account (glossary §14)
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
JAR="$WORK/customer.jar"   # cookie session of the throw-away customer
SA_JAR="$WORK/bilal.jar"   # cookie session of Bilal (DEP-03)

step() { printf '\n== %s\n' "$*"; }
fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}
status() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
login() { # prints the access token of a demo account; extra args go to curl (e.g. -c jar)
  local email="$1"
  shift
  curl -fsS "$@" -X POST "$WEB_URL/api/v1/auth/login" -H 'Content-Type: application/json' \
    -d "$(jq -n --arg e "$email" --arg p "$DEMO_PASSWORD" '{email: $e, password: $p}')" | jq -r '.access_token // empty'
}
no_store() { # usage: no_store <label> <curl args…> — D61 on a response that went through the rewrite
  local what="$1" headers
  shift
  headers="$(curl -fsS -o /dev/null -D - "$@")" || fail "$what: request failed"
  grep -qiE '^cache-control:.*no-store' <<<"$headers" || fail "$what: Cache-Control: no-store missing (D61)"
  if grep -qiE '^x-vercel-cache: *HIT' <<<"$headers"; then
    fail "$what: served from Vercel's CDN cache (D61)"
  fi
}

step "1. Health (direct to the API)"
curl -fsS "$API_URL/health" | jq -e '.status == "ok"' >/dev/null || fail "$API_URL/health is not {\"status\": \"ok\"}"

step "2. Public shop directory through the web origin's /api rewrite (path + query forwarded, never cached)"
SHOPS="$(curl -fsS "$WEB_URL/api/v1/public/shops?limit=100")" || fail "GET /api/v1/public/shops"
jq -e '.total >= 3 and .limit == 100' <<<"$SHOPS" >/dev/null || fail "expected >= 3 listed shops and limit=100"
SHOP_A_ID="$(jq -r '.items[] | select(.slug == "lahore-auto-care") | .id' <<<"$SHOPS")"
if [[ -n "${SMOKE_SHOP_SLUG:-}" ]]; then
  SHOP_B_SLUG="$SMOKE_SHOP_SLUG"
else
  SHOP_B_SLUG="$(jq -r '([.items[] | select(.slug != "lahore-auto-care" and .slug != "raza-auto-works")][0]
                         // [.items[] | select(.slug != "lahore-auto-care")][0]) | .slug // empty' <<<"$SHOPS")"
fi
SHOP_B_ID="$(jq -r --arg b "$SHOP_B_SLUG" '.items[] | select(.slug == $b) | .id' <<<"$SHOPS")"
if [[ -z "$SHOP_A_ID" || -z "$SHOP_B_ID" || "$SHOP_A_ID" == "$SHOP_B_ID" ]]; then
  fail "could not pick Shop A (lahore-auto-care) and a second listed shop (got '${SHOP_B_SLUG:-none}')"
fi
printf 'Shop A: lahore-auto-care (%s)   Shop B: %s (%s)\n' "$SHOP_A_ID" "$SHOP_B_SLUG" "$SHOP_B_ID"
no_store "public shop list (1st request)" "$WEB_URL/api/v1/public/shops?limit=1"
no_store "public shop list (repeat, must not be a cache HIT)" "$WEB_URL/api/v1/public/shops?limit=1"

step "3. Every demo account logs in with $DEMO_PASSWORD; Bilal's Bearer token works on his own shop"
for who in fatima.owner bilal.sa imran.tech hamza.tech sara.qc hina.qc usman.parts ayesha.customer; do
  token="$(login "$who@bayflow.test")" || fail "login $who@bayflow.test"
  if [[ -z "$token" || "$token" == null ]]; then
    fail "login $who@bayflow.test returned no access_token"
  fi
done
SA_TOKEN="$(login bilal.sa@bayflow.test -c "$SA_JAR")" || fail "login bilal.sa@bayflow.test"
[[ "$(status -H "Authorization: Bearer $SA_TOKEN" "$WEB_URL/api/v1/shops/$SHOP_A_ID/bookings?limit=1")" == 200 ]] ||
  fail "Bilal cannot list Lahore Auto Care bookings"
no_store "staff booking list" -H "Authorization: Bearer $SA_TOKEN" "$WEB_URL/api/v1/shops/$SHOP_A_ID/bookings?limit=1"
grep -q bf_session "$SA_JAR" || fail "login did not set the bf_session cookie through the rewrite (D7)"
curl -fsS -b "$SA_JAR" "$WEB_URL/api/v1/me" | jq -e '(.user.email // .email) == "bilal.sa@bayflow.test"' >/dev/null ||
  fail "GET /api/v1/me with the bf_session cookie does not return Bilal (DEP-03)"
curl -fsS -H "Authorization: Bearer $SA_TOKEN" "$WEB_URL/api/v1/realtime/ticket" |
  jq -e '.expires_in == 60 and (.ticket | length > 0)' >/dev/null || fail "WebSocket ticket (D70)"

step "4. A new customer books at $SHOP_B_SLUG through the wizard (public routes by slug, D68; cookie session)"
SERVICE_ID="$(curl -fsS "$WEB_URL/api/v1/public/shops/$SHOP_B_SLUG" | jq -r '.services[0].id // empty')"
[[ -n "$SERVICE_ID" ]] || fail "$SHOP_B_SLUG shows no active service"
SLOT=""
for d in 1 2 3 4 5 6 7; do
  DAY="$(date -u -d "+$d day" +%F 2>/dev/null || date -u -v+"$d"d +%F)"
  SLOT="$(curl -fsS "$WEB_URL/api/v1/public/shops/$SHOP_B_SLUG/availability?date=$DAY" |
    jq -r '[.slots[] | select(.remaining > 0)][0].start // empty')"
  [[ -n "$SLOT" ]] && break
done
[[ -n "$SLOT" ]] || fail "no slot with remaining places at $SHOP_B_SLUG in the next 7 days"
BODY="$(jq -n --arg shop "$SHOP_B_ID" --arg svc "$SERVICE_ID" --arg slot "$SLOT" \
  --arg email "smoke+$(date +%s)@bayflow.test" '{
    shop_id: $shop, service_ids: [$svc], slot_start: $slot, customer_notes: "smoke test",
    customer: {full_name: "Smoke Test", email: $email, password: "Smoke-Test@2026"},
    vehicle: {registration_number: "SMK-0001", make: "Toyota", model: "Corolla", year: 2018}}')"
BOOKING="$(curl -fsS -c "$JAR" -X POST "$WEB_URL/api/v1/bookings" -H 'Content-Type: application/json' -d "$BODY")" ||
  fail "POST /api/v1/bookings"
BOOKING_ID="$(jq -r '(.booking // .) | .id // empty' <<<"$BOOKING")"
[[ -n "$BOOKING_ID" ]] || fail "the booking response has no id"
jq -e '(.booking // .) | .status == "PENDING"' <<<"$BOOKING" >/dev/null || fail "new booking is not PENDING"
grep -q bf_session "$JAR" || fail "Set-Cookie bf_session did not pass through the rewrite (D7)"
printf 'Booked %s at %s\n' "$BOOKING_ID" "$SLOT"

step "5. Tenant isolation: a Shop A staff token on a Shop B booking -> 404"
[[ "$(status -H "Authorization: Bearer $SA_TOKEN" "$WEB_URL/api/v1/shops/$SHOP_B_ID/bookings/$BOOKING_ID")" == 404 ]] ||
  fail "Shop B route must be 404 for Shop A staff"
[[ "$(status -H "Authorization: Bearer $SA_TOKEN" "$WEB_URL/api/v1/shops/$SHOP_A_ID/bookings/$BOOKING_ID")" == 404 ]] ||
  fail "Shop A route must not reveal a Shop B booking"

step "6. Clean up: the customer cancels the smoke booking (frees the slot)"
curl -fsS -b "$JAR" -X POST "$WEB_URL/api/v1/me/bookings/$BOOKING_ID/actions/cancel" \
  -H 'Content-Type: application/json' -d '{"reason": "smoke test"}' |
  jq -e '(.booking // .) | .status == "CANCELLED"' >/dev/null || fail "cancel"

printf '\nSMOKE TEST PASSED\n'
