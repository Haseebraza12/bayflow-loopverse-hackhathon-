import type { ReactNode } from 'react'

import { PublicFooter } from '@/components/layout/public-footer'
import { PublicHeader } from '@/components/layout/public-header'

/**
 * `(customer)` shell (spec 09 §2.3): PublicHeader + content column. `proxy.ts` sends visitors
 * without a session cookie to /login. TODO(auth): client `RequireSession` (redirect when
 * `GET /api/v1/me` resolves to null).
 */
export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
      <PublicFooter />
    </>
  )
}
