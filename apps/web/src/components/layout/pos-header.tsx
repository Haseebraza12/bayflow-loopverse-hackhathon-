import Link from 'next/link'

import { Logo } from './logo'

/**
 * POS header (spec 09 §4.1): navy, 56 px, sticky. Shop switcher, role chip, realtime indicator,
 * notification bell and user menu need `GET /api/v1/me` and arrive with the auth feature.
 */
export function PosHeader() {
  return (
    <header className="sticky top-0 z-40 h-14 bg-nav text-nav-foreground">
      <div className="flex h-full items-center gap-4 px-4 sm:px-6">
        <Link href="/pos" aria-label="BayFlow Shop POS home" className="rounded-md">
          <Logo tone="dark" className="text-base" />
        </Link>
        <span className="text-sm font-medium text-nav-muted">Shop POS</span>
      </div>
    </header>
  )
}
