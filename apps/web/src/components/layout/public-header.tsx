import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { Logo } from './logo'

/**
 * Customer-portal header (spec 09 §4.1): white, 64 px, sticky. Anonymous state only for now —
 * the logged-in state ("My bookings", notification bell, user menu) needs `GET /api/v1/me` and
 * arrives with the auth feature. TODO: fold links into a Sheet menu below `md`.
 */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-background">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="BayFlow home" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link href="/#shops">Find a shop</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/register">Register your shop</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
