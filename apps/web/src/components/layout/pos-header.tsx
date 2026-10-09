'use client'

import { Check, ChevronDown, LayoutGrid, Plus, ShieldCheck, Store } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { NotificationBell } from '@/components/notifications/notification-bell'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useMockStore } from '@/hooks/use-mock-store'
import {
  getCurrentUser,
  getShops,
  getTeamMembers,
  setCurrentUser,
  type CurrentUserSession,
} from '@/lib/mock-data'

import { AccountMenu, ROLE_NAME } from './account-menu'
import { Logo } from './logo'

const ROLES: { role: CurrentUserSession['role']; label: string; path: string }[] = [
  { role: 'OWNER', label: 'Owner (Fatima)', path: 'overview' },
  { role: 'SERVICE_ADVISOR', label: 'Service Advisor (Bilal)', path: 'bookings' },
  { role: 'TECHNICIAN', label: 'Technician (Imran)', path: 'jobs' },
  { role: 'PARTS_PERSON', label: 'Parts Person (Usman)', path: 'parts' },
  { role: 'QC_INSPECTOR', label: 'QC Inspector (Sara)', path: 'qc' },
]

/** A shop's own pages (where the shop sidebar is shown), not `/pos/shops/new`. */
function inShopScope(pathname: string) {
  const [, pos, shops, shopId] = pathname.split('/')
  return pos === 'pos' && shops === 'shops' && Boolean(shopId) && shopId !== 'new'
}

const PILL =
  'inline-flex h-9 min-w-0 items-center gap-2 rounded-full border text-sm font-medium transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:shrink-0'

/**
 * POS app bar (spec 09 §4.1, spec 10 S-01; DESIGN.md "App shell"): a light, translucent 64px bar
 * like the landing header. Left: sidebar toggle (shop pages), logo, shop switcher pill.
 * Right: role pill (switches the demo role), notifications, account menu.
 */
export function PosHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useMockStore(() => getCurrentUser())
  const shops = useMockStore(() => getShops())
  const team = useMockStore(() => getTeamMembers())
  // O-07 is for owners of two or more shops (spec 10 S-01 "All shops summary").
  const ownedShops = team.filter(
    (m) => m.role === 'OWNER' && m.is_active && m.email === user.email,
  ).length

  const activeShop = shops.find((s) => s.id === user.shopId) || shops[0]
  const showSidebarToggle = inShopScope(pathname)

  const handleSwitchShop = (shopId: string, shopName: string) => {
    setCurrentUser({
      ...user,
      shopId,
      shopName,
    })
    router.push(`/pos/shops/${shopId}/overview`)
  }

  const handleSwitchRole = (role: CurrentUserSession['role'], path: string) => {
    let name = user.name
    let email = user.email

    if (role === 'OWNER') {
      name = 'Fatima Raza'
      email = 'fatima.owner@bayflow.test'
    } else if (role === 'SERVICE_ADVISOR') {
      name = 'Bilal'
      email = 'bilal.sa@bayflow.test'
    } else if (role === 'TECHNICIAN') {
      name = 'Imran'
      email = 'imran.tech@bayflow.test'
    } else if (role === 'PARTS_PERSON') {
      name = 'Usman'
      email = 'usman.parts@bayflow.test'
    } else if (role === 'QC_INSPECTOR') {
      name = 'Sara'
      email = 'sara.qc@bayflow.test'
    }

    setCurrentUser({
      ...user,
      role,
      name,
      email,
    })
    router.push(`/pos/shops/${user.shopId || 'shop-lahore-auto-care'}/${path}`)
  }

  return (
    <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-border-faint bg-card/90 backdrop-blur-md">
      <div className="flex h-full items-center gap-1.5 px-3 sm:gap-3 sm:px-4 lg:px-6">
        {showSidebarToggle && (
          <SidebarTrigger
            aria-label="Toggle shop navigation"
            className="size-10 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
          />
        )}

        <Link
          href="/pos"
          aria-label="BayFlow Shop POS home"
          className="flex shrink-0 items-center gap-2 rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
        >
          <Logo size="sm" showText={false} className="sm:hidden" />
          <Logo size="sm" className="hidden sm:inline-flex" />
          <span className="hidden rounded-md bg-secondary px-1.5 py-0.5 text-xs font-semibold text-muted-foreground lg:inline">
            POS
          </span>
        </Link>

        <span aria-hidden="true" className="mx-1 hidden h-6 w-px bg-border sm:block" />

        {/* Shop switcher: All shops first, the shops, Create shop last (spec 10 S-01) */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`${PILL} border-border-medium bg-card py-1 pr-2.5 pl-3 text-foreground shadow-xs hover:bg-secondary aria-expanded:bg-secondary sm:pl-1`}
          >
            <span className="hidden size-7 items-center justify-center rounded-full bg-brand-blue text-brand-blue-foreground sm:flex">
              <Store className="size-3.5" aria-hidden="true" />
            </span>
            <span className="max-w-[6.5rem] truncate min-[400px]:max-w-[8rem] sm:max-w-[16rem]">
              {activeShop?.name ?? 'Select shop'}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            {user.role === 'OWNER' && ownedShops >= 2 && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/pos/summary">
                    <LayoutGrid aria-hidden="true" />
                    All shops summary
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuLabel>Switch shop</DropdownMenuLabel>
            <DropdownMenuGroup>
              {shops.map((s) => (
                <DropdownMenuItem key={s.id} onSelect={() => handleSwitchShop(s.id, s.name)}>
                  <Store aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{s.name}</span>
                  {s.id === user.shopId && (
                    <Check className="text-brand-blue-ink" aria-label="Current shop" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/pos/shops/new">
                <Plus aria-hidden="true" />
                Create new shop
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Role switcher for rapid testing of the role views */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`${PILL} w-9 shrink-0 justify-center border-brand-blue/20 bg-brand-blue-subtle text-brand-blue-ink hover:border-brand-blue/40 aria-expanded:border-brand-blue/40 sm:w-auto sm:px-3`}
            >
              <ShieldCheck className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{ROLE_NAME[user.role]}</span>
              <span className="sr-only sm:hidden">Role: {ROLE_NAME[user.role]}</span>
              <ChevronDown className="hidden size-4 sm:block" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Switch active role</DropdownMenuLabel>
              {ROLES.map((r) => (
                <DropdownMenuItem key={r.role} onSelect={() => handleSwitchRole(r.role, r.path)}>
                  <span className="min-w-0 flex-1">{r.label}</span>
                  {r.role === user.role && (
                    <Check className="text-brand-blue-ink" aria-label="Current role" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <NotificationBell />
          <AccountMenu context="pos" />
        </div>
      </div>
    </header>
  )
}
