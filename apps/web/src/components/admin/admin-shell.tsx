'use client'

import {
  CalendarCheck,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  ScrollText,
  Store,
  Users,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

import { ForbiddenState } from '@/components/feedback/forbidden-state'
import { Logo } from '@/components/layout/logo'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { endMockSession } from '@/hooks/use-mock-session'
import { useMockStore, useMockStoreReady } from '@/hooks/use-mock-store'
import { getAdminUsers } from '@/lib/mock-admin'
import { homePathFor } from '@/lib/mock-auth'
import { getCurrentUser } from '@/lib/mock-data'

const NAV: ReadonlyArray<{ href: string; label: string; icon: LucideIcon; exact?: boolean }> = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/shops', label: 'Shops', icon: Store },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/audit', label: 'Audit log', icon: ScrollText },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** The signed-in platform admin, or `null` while loading or when the user is not one (D94). */
export function useAdminActor() {
  const ready = useMockStoreReady()
  const user = useMockStore(getCurrentUser)
  const users = useMockStore(getAdminUsers)
  const account = users.find((u) => u.email === user.email.toLowerCase())
  const isAdmin = Boolean(account?.isPlatformAdmin && account.isActive)
  return { ready, user, account, isAdmin }
}

/**
 * Platform admin console shell (spec 19 §5): a navy header, the admin side nav and the gate. The
 * pages render only for an active platform admin, after this browser's stored data is in use, so
 * nothing time- or session-dependent is rendered on the server.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { ready, user, account, isAdmin } = useAdminActor()
  const hasMemberships = Boolean(account?.memberships.some((m) => m.isActive))

  const signOut = () => {
    endMockSession()
    router.push('/login')
  }

  return (
    <SidebarProvider className="min-h-dvh flex-col">
      {/* Navy in both themes: the `dark` class scopes the dark tokens to the header. */}
      <header className="dark sticky top-0 z-40 flex h-12 shrink-0 items-stretch justify-between border-b border-white/10 bg-brand-navy text-foreground">
        <div className="flex items-stretch">
          <SidebarTrigger
            className="h-12 w-12 rounded-none text-nav-foreground hover:bg-white/10 md:hidden"
            aria-label="Open admin navigation"
          />
          <Link
            href="/admin"
            aria-label="Platform admin home"
            className="flex items-center gap-2.5 px-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
          >
            <Logo tone="dark" size="sm" />
            <span className="rounded-full border border-brand-orange-on-dark/40 bg-brand-orange/15 px-2 py-0.5 text-[11px] font-semibold tracking-[0.32px] text-brand-orange-on-dark">
              Platform admin
            </span>
          </Link>
        </div>
        <div className="flex items-stretch">
          <Link
            href="/"
            className="hidden items-center gap-2 px-4 text-sm text-nav-muted hover:bg-white/10 hover:text-nav-foreground md:flex"
          >
            <Globe className="size-4" aria-hidden="true" />
            Website
          </Link>
          {ready && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-12 gap-2 rounded-none px-3 text-nav-foreground hover:bg-white/10 hover:text-nav-foreground aria-expanded:bg-white/10"
                  aria-label={`Account: ${user.name}`}
                >
                  <Avatar className="size-7 after:hidden">
                    <AvatarFallback className="bg-brand-orange text-[11px] font-semibold text-white">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="space-y-0.5">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {user.email} · Platform admin
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hasMemberships && (
                  <DropdownMenuItem asChild>
                    <Link href={homePathFor(user)}>
                      <LayoutGrid aria-hidden="true" />
                      Workshop POS
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={signOut}>
                  <LogOut aria-hidden="true" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar className="top-12 h-[calc(100svh-3rem)]! border-r border-border-subtle [&_[data-slot=sidebar-inner]]:bg-layer">
          <SidebarContent>
            <nav aria-label="Platform admin navigation">
              <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {NAV.map(({ href, label, icon: Icon, exact }) => {
                      const active = exact
                        ? pathname === href
                        : pathname === href || pathname.startsWith(`${href}/`)
                      return (
                        <SidebarMenuItem key={href}>
                          <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={label}
                            className="data-[active=true]:shadow-[inset_3px_0_0_var(--brand-orange)]"
                          >
                            <Link href={href} aria-current={active ? 'page' : undefined}>
                              <Icon aria-hidden="true" />
                              <span>{label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </nav>
          </SidebarContent>
        </Sidebar>

        <SidebarInset id="main" tabIndex={-1} className="min-w-0 bg-canvas outline-none">
          <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-8">
            {!ready ? (
              <ConsoleSkeleton />
            ) : isAdmin ? (
              children
            ) : (
              <ForbiddenState
                message="This area is for BayFlow platform admins."
                homeHref={homePathFor(user)}
              />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function ConsoleSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-9 w-56" />
      <div className="grid gap-px sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-72" />
    </div>
  )
}
