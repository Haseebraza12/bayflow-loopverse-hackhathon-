'use client'

import {
  Bell,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileCheck,
  Menu,
  PackageSearch,
  Store,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useRef, useState, type FocusEvent } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { Logo } from './logo'

interface FeatureLink {
  title: string
  desc: string
  icon: LucideIcon
  color: string
  href: `/#${string}`
}

/**
 * The Features menu. Each entry jumps to its section of the landing page; the hrefs start with `/`
 * so they also work from the other pages that share this header.
 */
const FEATURE_LINKS: ReadonlyArray<FeatureLink> = [
  {
    title: 'Online booking',
    desc: 'Pick a garage, choose services and book a slot that still has space.',
    icon: CalendarCheck,
    color: 'bg-blue-50 text-blue-600',
    href: '/#booking',
  },
  {
    title: 'Estimate approval',
    desc: 'Itemised, versioned estimates the customer approves or rejects online.',
    icon: FileCheck,
    color: 'bg-rose-50 text-rose-600',
    href: '/#estimates',
  },
  {
    title: 'Status tracking',
    desc: 'A timeline of every step and an in-app notice when the car is ready.',
    icon: Bell,
    color: 'bg-indigo-50 text-indigo-600',
    href: '/#tracking',
  },
  {
    title: 'Parts and purchase orders',
    desc: 'Stock checked against each job; missing parts ordered and received.',
    icon: PackageSearch,
    color: 'bg-cyan-50 text-cyan-600',
    href: '/#parts',
  },
  {
    title: 'Quality control',
    desc: 'A checklist before hand-over; a failed check goes back with an issue.',
    icon: ClipboardCheck,
    color: 'bg-emerald-50 text-emerald-600',
    href: '/#qc',
  },
  {
    title: 'Role-based workspaces',
    desc: 'Service Advisor, Technician, Parts, QC and Owner each see their own work.',
    icon: Users,
    color: 'bg-amber-50 text-amber-600',
    href: '/#roles',
  },
  {
    title: 'Multi-shop',
    desc: 'Separate team, stock, slots and bookings per shop, one switcher for owners.',
    icon: Store,
    color: 'bg-teal-50 text-teal-600',
    href: '/#multi-shop',
  },
  {
    title: 'Booking lifecycle',
    desc: 'One responsible role per status, and every hand-off on the record.',
    icon: Workflow,
    color: 'bg-purple-50 text-purple-600',
    href: '/#lifecycle',
  },
]

const NAV_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'For garages', href: '/#for-garages' },
] as const

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2'

const NAV_ITEM = cn(
  'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold tracking-wider text-neutral-700 uppercase transition-colors hover:text-[#1047FA] xl:text-sm',
  FOCUS_RING,
)

/**
 * Customer-portal header (spec 09 §4.1): sticky, logo home link, main navigation, "Log in" and
 * "List your garage". Below `lg` the links fold into a menu. Anonymous state only for now: the
 * logged-in state needs `GET /api/v1/me`.
 */
export function PublicHeader() {
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const featuresPanelId = useId()
  const mobileMenuId = useId()
  const featuresRef = useRef<HTMLDivElement>(null)
  const featuresButtonRef = useRef<HTMLButtonElement>(null)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)

  // While a menu is open, Escape closes it and returns focus to its button, and a click outside
  // the Features menu closes that menu.
  useEffect(() => {
    if (!featuresOpen && !mobileMenuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (featuresOpen) {
        setFeaturesOpen(false)
        featuresButtonRef.current?.focus()
      }
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
        mobileButtonRef.current?.focus()
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [featuresOpen, mobileMenuOpen])

  // Keyboard users who tab out of the Features menu close it.
  function handleFeaturesBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setFeaturesOpen(false)
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="BayFlow home" className={cn('rounded-xl', FOCUS_RING)}>
          <Logo size="md" />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex xl:gap-2">
          <Link href="/book" className={NAV_ITEM}>
            Find a garage
          </Link>

          <div ref={featuresRef} className="relative" onBlur={handleFeaturesBlur}>
            <button
              ref={featuresButtonRef}
              type="button"
              aria-expanded={featuresOpen}
              aria-controls={featuresPanelId}
              onClick={() => setFeaturesOpen((open) => !open)}
              className={NAV_ITEM}
            >
              Features
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'size-4 transition-transform duration-200 motion-reduce:transition-none',
                  featuresOpen && 'rotate-180 text-[#1047FA]',
                )}
              />
            </button>

            <div
              id={featuresPanelId}
              hidden={!featuresOpen}
              className="absolute top-full left-1/2 z-50 mt-3 w-[640px] -translate-x-1/2 rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl xl:w-[720px]"
            >
              <ul className="grid grid-cols-2 gap-2 border-b border-neutral-100 pb-5">
                {FEATURE_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setFeaturesOpen(false)}
                      className={cn(
                        'group flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-neutral-50',
                        FOCUS_RING,
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-xl',
                          item.color,
                        )}
                      >
                        <item.icon aria-hidden="true" className="size-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-neutral-900 transition-colors group-hover:text-[#1047FA]">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-neutral-600">
                          {item.desc}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between px-2 pt-4 text-xs font-semibold">
                <Link
                  href="/#how-it-works"
                  onClick={() => setFeaturesOpen(false)}
                  className={cn(
                    'rounded-sm text-neutral-600 transition-colors hover:text-[#1047FA]',
                    FOCUS_RING,
                  )}
                >
                  How BayFlow works
                </Link>
                <Link
                  href="/book"
                  onClick={() => setFeaturesOpen(false)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-sm tracking-wider text-[#1047FA] uppercase hover:underline',
                    FOCUS_RING,
                  )}
                >
                  Find a garage
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_ITEM}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions ("List your garage" from xl: at lg the row would be too tight) */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/register"
            className={cn(
              'hidden rounded-full border border-neutral-900 bg-white px-5 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50 xl:inline-flex',
              FOCUS_RING,
            )}
          >
            List your garage
          </Link>
          {/* emerald-700: white text at 5.4 : 1 (the lighter emerald failed WCAG 1.4.3) */}
          <Button
            asChild
            className="h-10 rounded-full bg-emerald-700 px-6 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-800 hover:shadow-md"
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            asChild
            size="sm"
            className="rounded-full bg-emerald-700 px-4 text-xs font-semibold text-white hover:bg-emerald-800"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <button
            ref={mobileButtonRef}
            type="button"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={cn(
              'rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
              FOCUS_RING,
            )}
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" className="size-6" />
            ) : (
              <Menu aria-hidden="true" className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id={mobileMenuId}
        hidden={!mobileMenuOpen}
        className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-neutral-200 bg-white px-4 py-6 shadow-xl lg:hidden"
      >
        <nav aria-label="Main" className="flex flex-col gap-4">
          <ul className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
            <li>
              <Link
                href="/book"
                onClick={closeMobileMenu}
                className={cn('block rounded-lg py-1.5', FOCUS_RING)}
              >
                Find a garage
              </Link>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={cn('block rounded-lg py-1.5', FOCUS_RING)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="border-neutral-100" />

          <div>
            <p className="mb-2 text-xs font-bold tracking-wider text-neutral-600 uppercase">
              Features
            </p>
            <ul className="grid grid-cols-1 gap-1 pl-2">
              {FEATURE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'flex items-center gap-2 rounded-lg py-1.5 text-sm font-medium text-neutral-800',
                      FOCUS_RING,
                    )}
                  >
                    <item.icon aria-hidden="true" className="size-4 text-[#1047FA]" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Button
            asChild
            className="h-11 w-full rounded-full bg-[#1047FA] font-semibold text-white hover:bg-[#0935c7]"
          >
            <Link href="/register" onClick={closeMobileMenu}>
              List your garage
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
