'use client'

import {
  BarChart3,
  Box,
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Menu,
  PhoneCall,
  PlusCircle,
  ShoppingBag,
  Store,
  Warehouse,
  X,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { CONTACT_PHONE } from '@/components/landing/site-contact'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { Logo } from './logo'
import { SessionActions } from './session-actions'

type MenuId = 'features' | 'solutions' | 'company' | 'resources'

interface FeatureItem {
  title: string
  desc: string
  icon: LucideIcon
  /** Icon tile colours: theme tokens, one hue per feature. */
  tone: string
  href: string
}

/** Every entry points at a real section of the landing page (or a real page), from any page. */
const FEATURE_ITEMS: ReadonlyArray<FeatureItem> = [
  {
    title: 'Online booking',
    desc: 'Customers pick a shop, the services they need and a free time slot, without a phone call.',
    icon: Calendar,
    tone: 'bg-status-intake-bg text-status-intake-fg',
    href: '/#customers',
  },
  {
    title: 'Workflow',
    desc: 'A 15-step job lifecycle with one responsible role at every step, from check-in to pick-up.',
    icon: BarChart3,
    tone: 'bg-brand-blue-subtle text-brand-blue-ink',
    href: '/#lifecycle',
  },
  {
    title: 'Estimates',
    desc: 'Parts and labour estimates that customers approve or decline online.',
    icon: PlusCircle,
    tone: 'bg-status-estimate-bg text-status-estimate-fg',
    href: '/#estimates',
  },
  {
    title: 'Inventory',
    desc: 'Live stock for every shop, with shortages flagged before they stall a job.',
    icon: Warehouse,
    tone: 'bg-status-parts-bg text-status-parts-fg',
    href: '/#inventory',
  },
  {
    title: 'Quality control',
    desc: 'A shared QC queue and checklist. Failed checks go back to the technician.',
    icon: ClipboardCheck,
    tone: 'bg-status-repair-qc-bg text-status-repair-qc-fg',
    href: '/#quality-control',
  },
  {
    title: 'Service catalogue',
    desc: 'Services with a duration and a starting price, ready for online booking.',
    icon: Box,
    tone: 'bg-status-inspection-bg text-status-inspection-fg',
    href: '/#services',
  },
  {
    title: 'Purchase orders',
    desc: 'Order missing parts and receive them, even when a delivery arrives in parts.',
    icon: ShoppingBag,
    tone: 'bg-attention text-cta',
    href: '/#purchase-orders',
  },
  {
    title: 'Multi-shop owners',
    desc: 'Each shop has its own team and stock; owners get one summary across all of them.',
    icon: Store,
    tone: 'bg-success-subtle text-success-ink',
    href: '/#workflow',
  },
]

const SIMPLE_MENUS: ReadonlyArray<{
  id: Exclude<MenuId, 'features'>
  label: string
  width: string
  items: ReadonlyArray<{ label: string; href: string }>
}> = [
  {
    id: 'solutions',
    label: 'Solutions',
    width: 'w-72',
    items: [
      { label: 'For workshop owners', href: '/#workflow' },
      { label: 'For service advisors', href: '/#roles' },
      { label: 'For technicians', href: '/#technicians' },
      { label: 'For QC inspectors', href: '/#quality-control' },
      { label: 'For parts teams', href: '/#inventory' },
      { label: 'For car owners', href: '/#customers' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    width: 'w-64',
    items: [
      { label: 'About BayFlow', href: '/#features-all' },
      { label: 'Contact us', href: '/#contact' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    width: 'w-64',
    items: [
      { label: 'Find a shop', href: '/book' },
      { label: 'Demo accounts', href: '/login' },
      { label: 'Register your shop', href: '/register' },
    ],
  },
]

const TRIGGER =
  'inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-brand-blue-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid aria-expanded:text-brand-blue-ink'
const MENU_LINK =
  'block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-brand-blue-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid'

export function PublicHeader() {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggle(menu: MenuId) {
    setOpenMenu((current) => (current === menu ? null : menu))
  }

  /** Escape closes an open dropdown and puts focus back on its trigger. */
  function onNavKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Escape' || !openMenu) return
    event.preventDefault()
    document.getElementById(`public-nav-${openMenu}-trigger`)?.focus()
    setOpenMenu(null)
  }

  function triggerProps(menu: MenuId) {
    return {
      id: `public-nav-${menu}-trigger`,
      type: 'button' as const,
      'aria-expanded': openMenu === menu,
      'aria-controls': `public-nav-${menu}`,
      onClick: () => toggle(menu),
    }
  }

  return (
    <header className="marketing sticky top-0 z-50 w-full border-b border-border/80 bg-card/95 backdrop-blur-md">
      <div
        ref={navRef}
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        {/* Brand Logo */}
        <Link href="/" aria-label="BayFlow home" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Main"
          onKeyDown={onNavKeyDown}
          className="hidden items-center gap-1 lg:flex xl:gap-2"
        >
          {/* FEATURES DROPDOWN */}
          <div className="relative">
            <button {...triggerProps('features')} className={TRIGGER}>
              Features
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'size-4 transition-transform duration-200',
                  openMenu === 'features' && 'rotate-180 text-brand-blue-ink',
                )}
              />
            </button>

            {openMenu === 'features' && (
              <div
                id="public-nav-features"
                className="absolute top-full left-1/2 z-50 mt-3 w-[680px] -translate-x-1/2 rounded-3xl border border-border bg-card p-6 shadow-2xl transition-all duration-200 xl:w-[760px]"
              >
                <ul className="grid grid-cols-2 gap-4 border-b border-border-faint pb-5">
                  {FEATURE_ITEMS.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        onClick={() => setOpenMenu(null)}
                        className="group flex items-start gap-3.5 rounded-2xl p-3 transition-colors outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
                      >
                        <span
                          className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-xl',
                            item.tone,
                          )}
                        >
                          <item.icon aria-hidden="true" className="size-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-foreground transition-colors group-hover:text-brand-blue-ink">
                            {item.title}
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-helper">
                            {item.desc}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between px-2 pt-4 text-sm font-semibold">
                  <a
                    href={CONTACT_PHONE.href}
                    className="inline-flex items-center gap-2 rounded-sm text-muted-foreground transition-colors outline-none hover:text-brand-blue-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
                  >
                    <PhoneCall aria-hidden="true" className="size-4 text-brand-blue-ink" />
                    <span>Contact sales</span>
                  </a>
                  <Link
                    href="/#features-all"
                    onClick={() => setOpenMenu(null)}
                    className="inline-flex items-center gap-1.5 rounded-sm text-brand-blue-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
                  >
                    <span>View all features</span>
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* SOLUTIONS, COMPANY AND RESOURCES DROPDOWNS */}
          {SIMPLE_MENUS.map((menu) => (
            <div key={menu.id} className="relative">
              <button {...triggerProps(menu.id)} className={TRIGGER}>
                {menu.label}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'size-4 transition-transform duration-200',
                    openMenu === menu.id && 'rotate-180 text-brand-blue-ink',
                  )}
                />
              </button>

              {openMenu === menu.id && (
                <div
                  id={`public-nav-${menu.id}`}
                  className={cn(
                    'absolute top-full left-0 z-50 mt-3 rounded-2xl border border-border bg-card p-3 shadow-xl',
                    menu.width,
                  )}
                >
                  <ul className="space-y-1">
                    {menu.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className={MENU_LINK}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* The customer path (spec 09 G1): the shop directory, one click from every public page */}
          <Link href="/book" className={TRIGGER}>
            Book a service
          </Link>
        </nav>

        {/* Right Actions: emerald Sign In, or the bell and account menu once signed in */}
        <div className="hidden items-center gap-4 lg:flex">
          <SessionActions />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <SessionActions compact />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="public-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" className="size-6" />
            ) : (
              <Menu aria-hidden="true" className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav
          id="public-mobile-menu"
          aria-label="Main"
          className="border-t border-border bg-card px-4 py-6 shadow-xl lg:hidden"
        >
          <div className="flex flex-col space-y-4">
            <Button asChild variant="outline" className="w-full font-semibold">
              <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                <Calendar aria-hidden="true" /> Book a service
              </Link>
            </Button>

            <div>
              <p className="mb-2 text-sm font-semibold text-helper">Features</p>
              <ul className="grid grid-cols-1 gap-1 pl-2">
                {FEATURE_ITEMS.slice(0, 4).map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
                    >
                      <item.icon aria-hidden="true" className="size-4 text-brand-blue-ink" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-border-faint" />

            <ul className="flex flex-col text-sm font-normal text-foreground">
              {[
                { label: 'Solutions', href: '/#roles' },
                { label: 'See it in action', href: '/#screens' },
                { label: 'Getting started', href: '/#support' },
                { label: 'Contact us', href: '/#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-10 items-center rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Button
                asChild
                className="w-full rounded-full bg-brand-blue font-semibold text-brand-blue-foreground"
              >
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
