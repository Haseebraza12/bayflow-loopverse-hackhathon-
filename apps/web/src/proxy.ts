import { NextResponse, type NextRequest } from 'next/server'

/** httpOnly session cookie set by the API (D8). The web app only checks that it exists. */
const SESSION_COOKIE = 'bf_session'

/**
 * Optimistic auth gate (Next 16 `proxy` convention, spec 09 §2.8; spec 04 "UX shortcut").
 * It checks cookie *presence* only and never verifies the JWT (the web app has no
 * `JWT_SECRET`); the API re-checks every request (D9) and `RequireSession` covers stale cookies.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next()

  const login = new URL('/login', request.url)
  login.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(login)
}

// Matchers must be static literals (analysed at build time). Protected areas per spec 09 §2.3:
// the POS and the customer area (`/bookings`, `/book/confirmed/:bookingId`).
export const config = {
  matcher: ['/pos/:path*', '/bookings/:path*', '/book/confirmed/:path*'],
}
