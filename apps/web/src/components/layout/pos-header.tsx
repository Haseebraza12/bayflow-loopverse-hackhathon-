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

import { useMockStore } from '@/hooks/use-mock-store'
import {
  getCurrentUser,
  getShops,
  setCurrentUser,
  type CurrentUserSession,
} from '@/lib/mock-data'

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

  return (
    <header className="sticky top-0 z-40 h-14 bg-[#111827] text-white border-b border-neutral-800">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Shop Switcher */}
        <div className="flex items-center gap-4">
          <Link href="/pos" aria-label="BayFlow Shop POS home" className="flex items-center gap-2">
            <Logo tone="dark" className="text-base" />
            <span className="hidden sm:inline-block rounded bg-[#1047FA] px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
              POS
            </span>
          </Link>

          <div className="h-4 w-px bg-neutral-700 hidden sm:block" />

          {/* Shop Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShopMenuOpen(!shopMenuOpen)
                setRoleMenuOpen(false)
              }}
              className="flex items-center gap-2 rounded-lg bg-neutral-800/80 px-2.5 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Building2 className="size-3.5 text-[#1047FA]" />
              <span className="max-w-[130px] truncate sm:max-w-none">{activeShop?.name ?? 'Select Shop'}</span>
              <ChevronDown className="size-3 text-neutral-400" />
            </button>

            {shopMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-56 rounded-xl border border-neutral-700 bg-[#1e293b] p-1.5 shadow-xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Switch Shop
                </div>
                {shops.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSwitchShop(s.id, s.name)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium text-neutral-200 hover:bg-neutral-700/60 hover:text-white transition-colors"
                  >
                    <span className="truncate">{s.name}</span>
                    {s.id === user.shopId && <Check className="size-3.5 text-[#1047FA]" />}
                  </button>
                ))}
                <div className="my-1 border-t border-neutral-700" />
                <Link
                  href="/pos/shops/new"
                  onClick={() => setShopMenuOpen(false)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#1047FA] hover:bg-neutral-700/60 hover:text-blue-400"
                >
                  <Plus className="size-3.5" />
                  <span>Create new shop</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Role Switcher & Nav Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher Pill for rapid testing */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen)
                setShopMenuOpen(false)
              }}
              className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition-all"
            >
              <ShieldCheck className="size-3.5" />
              <span>{user.role.replace('_', ' ')}</span>
              <ChevronDown className="size-3 text-blue-400/80" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl border border-neutral-700 bg-[#1e293b] p-1.5 shadow-xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Switch Active Role
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleSwitchRole(r.role, r.path)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium text-neutral-200 hover:bg-neutral-700/60 hover:text-white transition-colors"
                  >
                    <span>{r.label}</span>
                    {r.role === user.role && <Check className="size-3.5 text-[#1047FA]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick links to Customer View and Public Website */}
          <Link
            href="/bookings"
            className="hidden md:flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white px-2 py-1 rounded hover:bg-neutral-800 transition-colors"
            title="Customer View"
          >
            <CalendarCheck className="size-3.5 text-emerald-400" />
            <span>My Bookings</span>
          </Link>

          <Link
            href="/"
            className="hidden md:flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white px-2 py-1 rounded hover:bg-neutral-800 transition-colors"
            title="Visit public website"
          >
            <Globe className="size-3.5 text-blue-400" />
            <span>Website</span>
          </Link>

          {/* Sign Out */}
          <Link
            href="/login"
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white px-2 py-1 rounded hover:bg-neutral-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
