import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { AuthShowcase } from '@/components/auth/auth-showcase'
import { Logo } from '@/components/layout/logo'

/**
 * `(auth)` shell (spec 09 §2.3, spec 10 P-04): the navy brand panel on `lg`, and the form column
 * with a way back to the site.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <AuthShowcase />
      <main id="main" tabIndex={-1} className="flex min-w-0 flex-col bg-background outline-none">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
          <Link href="/" aria-label="Home" className="w-fit lg:hidden">
            <Logo size="sm" />
          </Link>
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-[70ms] ease-productive hover:text-foreground lg:inline-flex"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to website
          </Link>
        </div>
        <div className="flex flex-1 justify-center px-4 pt-6 pb-16 sm:px-8 lg:items-center lg:pt-0">
          <div className="w-full max-w-[460px]">{children}</div>
        </div>
      </main>
    </div>
  )
}
