import { SearchX } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Page not found' }

/**
 * X-02 (spec 10): unknown URLs. Never says whether a resource exists elsewhere (D20, D21).
 * TODO(auth): link to the user's home via `resolveHome` once `GET /api/v1/me` is wired.
 */
export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center"
    >
      <Link href="/" aria-label="BayFlow home" className="rounded-md">
        <Logo />
      </Link>
      <SearchX aria-hidden="true" className="size-10 text-muted-foreground" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">We couldn&apos;t find that.</h1>
        <p className="max-w-prose text-muted-foreground">
          The page may have moved, or you may not have access to it.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </main>
  )
}
