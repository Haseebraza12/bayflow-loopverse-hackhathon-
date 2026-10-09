'use client'

import {
  Building2,
  CalendarCheck,
  Check,
  ChevronDown,
  Globe,
  LogOut,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useMockStore } from '@/hooks/use-mock-store'
import { getCurrentUser, getShops, setCurrentUser, type CurrentUserSession } from '@/lib/mock-data'

import { Logo } from './logo'

const ROLES: { role: CurrentUserSession['role']; label: string; path: string }[] = [
  { role: 'OWNER', label: 'Owner (Fatima)', path: 'overview' },
  { role: 'SERVICE_ADVISOR', label: 'Service Advisor (Bilal)', path: 'bookings' },
  { role: 'TECHNICIAN', label: 'Technician (Imran)', path: 'jobs' },
  { role: 'PARTS_PERSON', label: 'Parts Person (Usman)', path: 'parts' },
  { role: 'QC_INSPECTOR', label: 'QC Inspector (Sara)', path: 'qc' },
]

export function PosHeader() {
  const router = useRouter()
  const user = useMockStore(() => getCurrentUser())
  const shops = useMockStore(() => getShops())

  const [shopMenuOpen, setShopMenuOpen] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)

  const activeShop = shops.find((s) => s.id === user.shopId) || shops[0]

  const handleSwitchShop = (shopId: string, shopName: string) => {
    setCurrentUser({
      ...user,
      shopId,
      shopName,
    })
    setShopMenuOpen(false)
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
    setRoleMenuOpen(false)
    router.push(`/pos/shops/${user.shopId || 'shop-lahore-auto-care'}/${path}`)
  }

  // Carbon UI shell header (DESIGN.md §Shell): 48px bar, product name, full-height square header
  // items, and square header panels that drop flush from the bar.
  const item =
    'flex h-12 items-center gap-2 px-4 text-sm tracking-[0.16px] text-neutral-300 transition-colors duration-[110ms] ease-productive hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white aria-expanded:bg-white/10 aria-expanded:text-white'
  const panel =
    'absolute top-full z-50 w-64 border-t border-white/10 bg-[#1e293b] py-2 shadow-float'
  const panelLabel = 'px-4 pt-2 pb-1 text-xs tracking-[0.32px] text-neutral-400'
  const panelItem =
    'flex min-h-10 w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm tracking-[0.16px] text-neutral-200 transition-colors duration-[70ms] ease-productive hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white'

  return (
    <header className="sticky top-0 z-40 h-12 border-b border-white/10 bg-[#111827] text-white">
      <div className="flex h-full items-stretch justify-between">
        {/* Left: product name & shop switcher */}
        <div className="flex items-stretch">
          <Link
            href="/pos"
            aria-label="BayFlow Shop POS home"
            className="flex items-center gap-2 pr-4 pl-4 text-sm tracking-[0.16px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
          >
            <Logo tone="dark" size="sm" />
            <span className="hidden font-semibold text-neutral-300 sm:inline">POS</span>
          </Link>

          <div className="my-3 hidden w-px bg-white/15 sm:block" />

          {/* Shop switcher */}
          <div className="relative flex">
            <button
              type="button"
              aria-expanded={shopMenuOpen}
              aria-haspopup="menu"
              onClick={() => {
                setShopMenuOpen(!shopMenuOpen)
                setRoleMenuOpen(false)
              }}
              className={item}
            >
              <Building2 className="size-4 text-neutral-400" aria-hidden="true" />
              <span className="max-w-[130px] truncate sm:max-w-none">
                {activeShop?.name ?? 'Select Shop'}
              </span>
              <ChevronDown className="size-4 text-neutral-400" aria-hidden="true" />
            </button>

            {shopMenuOpen && (
              <div className={`${panel} left-0`} role="menu">
                <div className={panelLabel}>Switch shop</div>
                {shops.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSwitchShop(s.id, s.name)}
                    className={panelItem}
                  >
                    <span className="truncate">{s.name}</span>
                    {s.id === user.shopId && (
                      <Check className="size-4 text-white" aria-hidden="true" />
                    )}
                  </button>
                ))}
                <div className="my-2 border-t border-white/10" />
                <Link
                  href="/pos/shops/new"
                  role="menuitem"
                  onClick={() => setShopMenuOpen(false)}
                  className={panelItem}
                >
                  <span>Create new shop</span>
                  <Plus className="size-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: role switcher & global actions */}
        <div className="flex items-stretch">
          {/* Role switcher for rapid testing */}
          <div className="relative flex">
            <button
              type="button"
              aria-expanded={roleMenuOpen}
              aria-haspopup="menu"
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen)
                setShopMenuOpen(false)
              }}
              className={item}
            >
              <ShieldCheck className="size-4 text-neutral-400" aria-hidden="true" />
              <span className="capitalize">{user.role.replace('_', ' ').toLowerCase()}</span>
              <ChevronDown className="size-4 text-neutral-400" aria-hidden="true" />
            </button>

            {roleMenuOpen && (
              <div className={`${panel} right-0`} role="menu">
                <div className={panelLabel}>Switch active role</div>
                {ROLES.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSwitchRole(r.role, r.path)}
                    className={panelItem}
                  >
                    <span>{r.label}</span>
                    {r.role === user.role && (
                      <Check className="size-4 text-white" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/bookings" className={`${item} hidden md:flex`} title="Customer view">
            <CalendarCheck className="size-4" aria-hidden="true" />
            <span>My bookings</span>
          </Link>

          <Link href="/" className={`${item} hidden md:flex`} title="Visit public website">
            <Globe className="size-4" aria-hidden="true" />
            <span>Website</span>
          </Link>

          <div className="flex items-center px-1">
            <ThemeToggle tone="nav" className="rounded-none" />
          </div>

          <Link href="/login" className={item} title="Sign out">
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Sign out</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
