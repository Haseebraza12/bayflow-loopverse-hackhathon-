import Link from 'next/link'
import type { ReactNode } from 'react'

import { Logo } from '@/components/layout/logo'

/** `(auth)` shell (spec 09 §2.3, spec 10 P-04): navy brand panel on `lg`, centred card column. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-brand-navy p-10 text-nav-foreground lg:flex">
        <Link href="/" aria-label="BayFlow home" className="w-fit rounded-md">
          <Logo tone="dark" />
        </Link>
        <div className="space-y-4">
          <p className="text-3xl font-semibold">Every hand-off, on the record.</p>
          <div aria-hidden="true" className="h-1 w-16 rounded-full bg-brand-orange" />
          <p className="max-w-sm text-nav-muted">
            Bookings, estimates, parts and quality checks for independent garages — in one place.
          </p>
        </div>
        <p className="text-sm text-nav-muted">BayFlow</p>
      </aside>
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-col items-center px-4 py-10 outline-none sm:justify-center sm:px-6"
      >
        <div className="w-full max-w-md space-y-6">
          <Link href="/" aria-label="BayFlow home" className="block w-fit rounded-md lg:hidden">
            <Logo />
          </Link>
          {children}
        </div>
      </main>
    </div>
  )
}
