import { ChartBarLineIcon, ShoppingCart01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react'
import {
  Bell,
  Boxes,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  Headset,
  KeyRound,
  LayoutDashboard,
  Package,
  Presentation,
  Search,
  ShieldCheck,
  Store,
  Truck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { CapabilityArt, type CapabilityKind } from '@/components/landing/capability-art'
import { PhoneFrame } from '@/components/landing/decor'
import { DemoRequestButton } from '@/components/landing/demo-request'
import { CustomerArt, TechnicianArt, WorkflowArt } from '@/components/landing/feature-art'
import { HeroShowcase } from '@/components/landing/hero-showcase'
import {
  LANDING_PHOTOS,
  LANDING_SCREENS,
  type LandingImage,
} from '@/components/landing/landing-media'
import { ScreenshotCarousel } from '@/components/landing/screenshot-carousel'

export const metadata: Metadata = {
  description:
    'BayFlow is garage management software for auto repair workshops in Pakistan: online booking, estimates customers approve from their phone, inventory and purchase orders, and quality control in one role-based workflow.',
}

/** Hugeicons (free stroke-rounded set) under the names this page already uses. */
type IconProps = Omit<HugeiconsIconProps, 'icon'>
const BarChart3 = (props: IconProps) => <HugeiconsIcon icon={ChartBarLineIcon} {...props} />
const ShoppingCart = (props: IconProps) => <HugeiconsIcon icon={ShoppingCart01Icon} {...props} />

const OUTLINE_CTA =
  'rounded-full border border-foreground bg-card px-7 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid active:scale-95 sm:px-8 sm:text-base'
const PRIMARY_CTA =
  'rounded-full bg-brand-blue px-7 py-3 text-center text-sm font-semibold text-white shadow-md shadow-brand-blue/20 transition-all duration-200 outline-none hover:bg-brand-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid active:scale-95 sm:px-9 sm:text-base'
const SECTION_CTA =
  'inline-block rounded-full bg-brand-blue px-9 py-3.5 text-sm font-semibold text-white shadow-md transition-all outline-none hover:bg-brand-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid sm:text-base'
const TEXT_LINK =
  'mt-auto self-start rounded-sm px-7 pt-4 text-sm font-semibold text-brand-blue-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid'

/** The five shop roles (glossary §2.1), where the star rating used to be. */
const SHOP_ROLES: ReadonlyArray<{ label: string; icon: LucideIcon }> = [
  { label: 'Owner', icon: Store },
  { label: 'Service advisor', icon: Headset },
  { label: 'Technician', icon: Wrench },
  { label: 'QC inspector', icon: ShieldCheck },
  { label: 'Parts person', icon: Package },
]

/** What BayFlow covers, where the review-site logos used to be. */
const COVERAGE: ReadonlyArray<{ label: string; icon: LucideIcon }> = [
  { label: 'Online booking', icon: CalendarCheck },
  { label: 'Estimates', icon: FileCheck2 },
  { label: 'Inventory', icon: Boxes },
  { label: 'Purchase orders', icon: Truck },
  { label: 'Quality control', icon: ShieldCheck },
  { label: 'Multi-shop', icon: Store },
]

/**
 * How each role works in BayFlow, told through the seeded demo cast of Lahore Auto Care (glossary
 * §14.1). These are demo personas, labelled as such, not customer reviews.
 */
const ROLE_STORIES: ReadonlyArray<{
  name: string
  role: string
  tint: 'blue' | 'green' | 'orange'
  photo: LandingImage
  story: string
  focus: string
  icon: LucideIcon
}> = [
  {
    name: 'Fatima Raza',
    role: 'Owner',
    tint: 'blue',
    photo: LANDING_PHOTOS.roleOwner,
    story:
      'Runs two shops from one login: bookings by status, team workload and stock for each, plus one summary across both.',
    focus: 'Shop overview · All-shops summary',
    icon: LayoutDashboard,
  },
  {
    name: 'Bilal',
    role: 'Service advisor',
    tint: 'green',
    photo: LANDING_PHOTOS.roleAdvisor,
    story:
      'Confirms new bookings, assigns a technician and sends the estimate. The customer approves it online, without a phone call.',
    focus: 'Bookings queue · Estimates',
    icon: ClipboardList,
  },
  {
    name: 'Imran',
    role: 'Technician',
    tint: 'orange',
    photo: LANDING_PHOTOS.roleTechnician,
    story:
      'Sees only his own jobs. Inspects the car, adds parts and labour to the estimate with live stock, then sends it to QC.',
    focus: 'My jobs · Inspection and estimate',
    icon: Wrench,
  },
  {
    name: 'Sara',
    role: 'QC inspector',
    tint: 'blue',
    photo: LANDING_PHOTOS.roleQc,
    story:
      'Picks the next car from the shared QC queue and runs the checklist. A failed check goes back to the technician as an issue.',
    focus: 'QC queue · Checklist',
    icon: ShieldCheck,
  },
  {
    name: 'Usman',
    role: 'Parts person',
    tint: 'green',
    photo: LANDING_PHOTOS.roleParts,
    story:
      "Sees every job's parts checked against stock, orders the shortages on a purchase order and allocates parts as they arrive.",
    focus: 'Parts queue · Purchase orders',
    icon: Package,
  },
]

const ROLE_TONES = {
  blue: { card: 'from-brand-blue/10 to-card', duo: 'bg-brand-blue', icon: 'text-brand-blue-ink' },
  green: {
    card: 'from-brand-green/10 to-card',
    duo: 'bg-brand-green-accent',
    icon: 'text-brand-green',
  },
  orange: { card: 'from-brand-orange/10 to-card', duo: 'bg-brand-orange', icon: 'text-cta' },
} as const

/** The "Garage management software" grid. Each card is an anchor the header and footer link to. */
const CAPABILITIES: ReadonlyArray<{
  id: string
  kind: CapabilityKind
  title: string
  desc: string
}> = [
  {
    id: 'lifecycle',
    kind: 'workflow',
    title: 'Workflow',
    desc: 'Every booking moves through one 15-step lifecycle, with one responsible role at each step, so nothing waits on a phone call.',
  },
  {
    id: 'estimates',
    kind: 'estimates',
    title: 'Estimates',
    desc: 'Technicians add parts and labour, the service advisor sends the estimate, and the customer approves or declines it online.',
  },
  {
    id: 'inventory',
    kind: 'inventory',
    title: 'Inventory',
    desc: "Know what's in stock in every shop. The parts a job needs are compared with stock automatically, so shortages show up early.",
  },
  {
    id: 'quality-control',
    kind: 'quality-control',
    title: 'Quality Control',
    desc: 'Inspectors pick jobs from a shared QC queue and work through a checklist. A failed check goes back to the technician as an issue.',
  },
  {
    id: 'services',
    kind: 'services',
    title: 'Service Catalogue',
    desc: 'List your services with a duration and a starting price. Customers choose them when they book; the estimate covers the rest.',
  },
  {
    id: 'purchase-orders',
    kind: 'purchase-orders',
    title: 'Purchase Orders',
    desc: 'Order missing parts from your supplier. Receiving a delivery adds the stock, even when it arrives in parts.',
  },
]

const DEMO_ACCOUNT_ROWS = [
  ['Owner', 'Fatima Raza'],
  ['Service advisor', 'Bilal'],
  ['Technician', 'Imran'],
] as const

/** The two outlined entry points under the hero (where the app-store badges used to be). */
const ENTRY =
  'inline-flex h-11 items-center gap-2 rounded-lg border border-foreground bg-card pr-3 pl-2.5 text-left text-foreground transition-colors outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid sm:gap-2.5 sm:pr-4 sm:pl-3'

function EntryContent({
  icon: Icon,
  eyebrow,
  label,
}: {
  icon: LucideIcon
  eyebrow: string
  label: string
}) {
  return (
    <>
      <Icon aria-hidden="true" className="size-5 shrink-0 sm:size-6" />
      <span className="leading-tight">
        <span className="block text-xs text-muted-foreground">{eyebrow}</span>
        <span className="block text-sm font-semibold sm:text-base">{label}</span>
      </span>
    </>
  )
}

export default function LandingPage() {
  return (
    <div className="marketing relative w-full overflow-hidden bg-card text-foreground">
      {/* ========================================================
          1. HERO
          ======================================================== */}
      <section className="bg-grid-pattern relative w-full pt-10 pb-16 md:pt-16 md:pb-24">
        {/* Soft radial backdrop */}
        <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_50%_15%] from-brand-blue-subtle/40 via-transparent to-transparent" />
        {/* Halo behind the headline: a faint blue glow, then a white wash that fades the grid out under the copy */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-6%] left-1/2 aspect-square w-[min(1100px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand-blue)_9%,transparent)_0%,color-mix(in_srgb,var(--brand-blue)_4%,transparent)_35%,transparent_68%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[2%] left-1/2 h-[min(560px,90vw)] w-[min(980px,130vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--background)_95%,transparent)_0%,color-mix(in_srgb,var(--background)_70%,transparent)_40%,transparent_70%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Heading & Copy */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl leading-[1.12] font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[68px]">
              Auto Repair Garage Management <br className="hidden sm:inline" />
              Software{' '}
              <span className="align-baseline font-handwriting text-5xl font-normal text-muted-foreground italic sm:text-6xl md:text-7xl lg:text-[76px]">
                in Pakistan
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed font-normal text-muted-foreground sm:text-lg">
              Take control of your auto repair business with BayFlow, garage management software
              built for Pakistani workshops. Simplify online booking, estimates and inventory
              control.
            </p>

            {/* CTAs: car owners book (spec 09 G1), garages get started (the one primary) */}
            <div className="mt-8 flex flex-row items-center justify-center gap-4">
              <Link href="/book" className={OUTLINE_CTA}>
                Book a Service
              </Link>
              <Link href="/register" className={PRIMARY_CTA}>
                Get Started
              </Link>
            </div>
          </div>

          {/* Two workshop photos and BayFlow's own booking screen, with true product facts */}
          <HeroShowcase />

          {/* ========================================================
              ROLES · ENTRY POINTS · WHAT BAYFLOW COVERS
              ======================================================== */}
          <div className="mt-12 flex flex-col items-center justify-center gap-6 text-center md:mt-16">
            {/* The five shop roles */}
            <p className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="flex items-center gap-1.5" aria-hidden="true">
                {SHOP_ROLES.map(({ label, icon: Icon }) => (
                  <Icon key={label} className="size-5 text-brand-blue-ink" />
                ))}
              </span>
              <span className="ml-2 text-sm font-bold text-foreground">
                One workflow for all 5 shop roles
              </span>
            </p>

            {/* Two ways for garages to look closer */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link href="/login" className={ENTRY}>
                <EntryContent icon={KeyRound} eyebrow="Garage teams" label="Try the demo shop" />
              </Link>
              <DemoRequestButton className={ENTRY}>
                <EntryContent icon={Presentation} eyebrow="Prefer a tour?" label="Book a demo" />
              </DemoRequestButton>
            </div>

            {/* What BayFlow covers */}
            <ul
              aria-label="What BayFlow covers"
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-10 md:gap-x-12"
            >
              {COVERAGE.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="inline-flex h-8 items-center gap-2 text-base font-semibold text-muted-foreground"
                >
                  <Icon aria-hidden="true" className="size-6 text-subtle-foreground" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================
          SCREENSHOTS
          ======================================================== */}
      <section
        id="screens"
        className="relative w-full overflow-hidden border-t border-border/70 bg-muted/50 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              <span className="font-handwriting text-4xl font-normal text-brand-blue-ink italic sm:text-5xl md:text-6xl">
                See BayFlow
              </span>{' '}
              in Action
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Swipe through real screens from the owner dashboard, the technician view and the
              customer portal.
            </p>
          </div>

          <ScreenshotCarousel />
        </div>
      </section>

      {/* ========================================================
          2. ROLES — story cards (text + duotone photo), demo personas
          ======================================================== */}
      <section
        id="roles"
        className="relative w-full overflow-hidden border-t border-border/70 bg-muted/50 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              How{' '}
              <span className="font-handwriting text-4xl font-normal text-brand-blue-ink italic sm:text-5xl md:text-6xl">
                each role
              </span>{' '}
              uses <span className="text-brand-green">BayFlow</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Meet the demo team at Lahore Auto Care, the sample shop you can sign in to. Each demo
              persona shows what one role does in BayFlow, from check-in to pick-up.
            </p>
          </div>
        </div>

        {/* Auto-scrolling marquee: list rendered twice, track slides -50% and loops. Pauses on hover. */}
        <div className="mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
          <div className="reviews-marquee flex w-max gap-6 py-6">
            {[...ROLE_STORIES, ...ROLE_STORIES].map((r, i) => {
              const tone = ROLE_TONES[r.tint]
              return (
                <article
                  key={`${r.name}-${i}`}
                  aria-hidden={i >= ROLE_STORIES.length || undefined}
                  aria-label={i < ROLE_STORIES.length ? `${r.role}: ${r.name}` : undefined}
                  className={`flex w-[88vw] max-w-[780px] shrink-0 flex-col-reverse gap-5 rounded-[28px] border border-card bg-gradient-to-br p-5 shadow-[0_10px_40px_-20px_rgba(17,24,39,0.25)] sm:flex-row sm:p-6 ${tone.card}`}
                >
                  <div className="flex flex-1 flex-col justify-between gap-8 p-2 sm:py-4">
                    <div>
                      <p className="text-2xl leading-tight font-semibold tracking-tight text-foreground md:text-[28px]">
                        {r.story}
                      </p>
                      <div className="mt-6 text-sm">
                        <p className="font-semibold text-foreground">{r.name}</p>
                        <p className="text-helper">{r.role} · Demo persona, Lahore Auto Care</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <r.icon aria-hidden="true" className={`size-4 ${tone.icon}`} />
                        {r.focus}
                      </span>
                    </div>
                  </div>

                  {/* Duotone photo: grayscale workshop scene screened with the brand tint */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] sm:w-[46%]">
                    <Image
                      src={r.photo.src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 360px, 88vw"
                      className="object-cover contrast-125 grayscale"
                    />
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 opacity-80 mix-blend-screen ${tone.duo}`}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FEATURE 1: STREAMLINE WORKFLOW
          ======================================================== */}
      <section id="workflow" className="relative w-full border-t border-border/60 bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Content */}
            <div className="space-y-8 lg:col-span-6">
              <div>
                <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  <span className="font-handwriting text-4xl font-normal text-foreground italic sm:text-5xl md:text-6xl">
                    Streamline
                  </span>{' '}
                  Workflow, and Control Inventory
                </h2>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <BarChart3
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 text-subtle-foreground"
                  />
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      Take Control of Your Day
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Bookings, inspections, estimates and approvals in one flow. Assign a
                      technician and see where every job stands.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ShoppingCart
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 text-subtle-foreground"
                  />
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      Spot Shortages Before They Stall a Job
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Each job&apos;s parts are checked against stock automatically. Order
                      what&apos;s missing on a purchase order; receiving it restocks the shelf.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <BarChart3
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 text-subtle-foreground"
                  />
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      See Every Shop at a Glance
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Bookings by status, team workload and low-stock parts for each shop, plus one
                      summary across all the shops you own.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/register" className={SECTION_CTA}>
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right Graphic */}
            <div className="flex justify-center lg:col-span-6">
              <div className="relative flex w-full max-w-[514px] justify-center">
                <WorkflowArt />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. FEATURE 2: CUSTOMER EXPERIENCE
          ======================================================== */}
      <section
        id="customers"
        className="relative w-full border-t border-border/60 bg-muted/50 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Graphic */}
            <div className="order-2 flex justify-center lg:order-1 lg:col-span-6">
              <div className="relative flex w-full max-w-[514px] justify-center">
                <CustomerArt />
              </div>
            </div>

            {/* Right Content */}
            <div className="order-1 space-y-8 lg:order-2 lg:col-span-6">
              <div>
                <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  <span className="font-handwriting text-4xl font-normal text-foreground italic sm:text-5xl md:text-6xl">
                    Deliver an
                  </span>{' '}
                  Unforgettable Customer Experience
                </h2>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 fill-current text-subtle-foreground"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      Estimates Approved Online
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Customers review the itemised estimate and approve or decline it from their
                      phone. Each approved version is locked with a timestamp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 fill-current text-subtle-foreground"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      Keep Customers in the Loop
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Customers follow every step of the job in their own portal, with a
                      notification when the estimate is ready and when the car is ready for pick-up.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 fill-current text-subtle-foreground"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      Book Online, No Calls Needed
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Customers choose a shop, the services they need and a free time slot. Only
                      open slots are shown, so a slot is never overbooked.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                <Link href="/register" className={SECTION_CTA}>
                  Get Started
                </Link>
                <Link
                  href="/book"
                  className="rounded-sm text-sm font-semibold text-brand-blue-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid sm:text-base"
                >
                  Need a repair? Find a workshop →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURE 3: TECHNICIANS ON THE BAY FLOOR
          ======================================================== */}
      <section id="technicians" className="relative w-full border-t border-border/60 bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Content */}
            <div className="space-y-8 lg:col-span-6">
              <div>
                <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  <span className="font-handwriting text-4xl font-normal text-foreground italic sm:text-5xl md:text-6xl">
                    Maximize
                  </span>{' '}
                  Shop Productivity on the Bay Floor
                </h2>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 fill-current text-subtle-foreground"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      Only Their Own Jobs
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Technicians see just the jobs assigned to them, with the customer&apos;s
                      concern and the booked services. Nothing else to dig through.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 fill-current text-subtle-foreground"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      Inspect, Estimate, Repair
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Log the inspection and build the estimate with parts and labour; every part
                      line shows live stock. Then repair and send the car to QC.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 fill-current text-subtle-foreground"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      Works on Any Phone or Tablet
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      BayFlow runs in the browser, so your technicians have no app to install or
                      update. They sign in on the phone or tablet they already use.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/register" className={SECTION_CTA}>
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right Graphic */}
            <div className="flex justify-center lg:col-span-6">
              <div className="relative flex w-full max-w-[514px] justify-center">
                <TechnicianArt />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. ALL-IN-ONE CAPABILITIES GRID
          ======================================================== */}
      <section
        id="features-all"
        className="relative w-full border-t border-border/60 bg-muted/50 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Garage Management Software
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              BayFlow helps you manage online bookings, inspections, estimates, inventory, purchase
              orders, quality control and customer updates in one garage management platform.
            </p>
          </div>

          {/* Two columns x three rows: copy left, product mock-up right (stacked while the
              columns are too narrow for both, md to lg) */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {CAPABILITIES.map((c) => (
              <div
                key={c.id}
                id={c.id}
                className="group flex flex-col-reverse overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg sm:min-h-[220px] sm:flex-row md:flex-col-reverse xl:flex-row"
              >
                <div className="flex flex-1 flex-col justify-center p-7">
                  <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-helper">{c.desc}</p>
                </div>
                <div className="h-52 bg-secondary sm:h-auto sm:w-[48%] md:h-52 md:w-auto xl:h-auto xl:w-[48%]">
                  <CapabilityArt kind={c.kind} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. GETTING STARTED
          ======================================================== */}
      <section
        id="support"
        className="bg-grid-pattern relative w-full border-t border-border/60 bg-card py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Built for{' '}
              <span className="font-handwriting text-4xl font-normal text-foreground italic sm:text-5xl md:text-6xl">
                Garages.
              </span>{' '}
              Easy to Start.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              From first setup to daily hand-offs, BayFlow keeps every job moving, and you can try
              all of it in the demo shop first.
            </p>
          </div>

          {/* Feature cards: mini product illustration on a grey panel, copy underneath */}
          <div className="mt-14 grid grid-cols-1 gap-10 sm:mx-auto sm:max-w-md lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {/* Card 1: Guided setup */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card pb-7 shadow-sm">
              <div
                aria-hidden="true"
                className="relative flex aspect-[16/11] flex-col items-center justify-center overflow-hidden bg-secondary p-6"
              >
                <p className="text-2xl font-semibold tracking-tight text-foreground">Your shop</p>
                {/* Connector tree */}
                <svg
                  viewBox="0 0 300 48"
                  className="mt-2 h-10 w-[78%] text-border-medium"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M150 0 V20 M30 48 V30 Q30 20 40 20 H260 Q270 20 270 30 V48 M150 20 V48" />
                </svg>
                <div className="flex w-[86%] justify-between">
                  {['Services', 'Team', 'Parts'].map((step) => (
                    <span
                      key={step}
                      className="flex size-16 items-center justify-center rounded-full bg-card text-xs font-semibold text-muted-foreground shadow-sm ring-1 ring-border"
                    >
                      {step}
                    </span>
                  ))}
                </div>
                <span className="mt-5 rounded-full border border-border bg-card/70 px-4 py-1 text-xs text-helper">
                  Hours · Time slots · Prices
                </span>
              </div>
              <h3 className="mt-6 px-7 text-lg font-semibold text-foreground">Guided Setup</h3>
              <p className="mt-2 px-7 text-sm leading-relaxed text-helper">
                Create your shop, then follow the setup checklist: add services, invite your team,
                add parts and list your shop for online booking.
              </p>
              <Link href="/register" className={TEXT_LINK}>
                Create your shop →
              </Link>
            </div>

            {/* Card 2: Built-in notifications */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card pb-7 shadow-sm">
              <div
                aria-hidden="true"
                className="relative flex aspect-[16/11] flex-col justify-center gap-3 overflow-hidden bg-secondary p-6"
              >
                <div className="max-w-[78%] self-end rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-xs text-background shadow-sm">
                  Estimate approved for LEA-1234
                </div>
                <div className="flex max-w-[86%] items-end gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-blue text-brand-blue-foreground">
                    <Bell className="size-3.5" />
                  </span>
                  <div className="rounded-2xl rounded-bl-md bg-card px-4 py-2.5 text-xs text-muted-foreground shadow-sm ring-1 ring-border">
                    Parts needed: LEA-1234 needs parts checked against stock.
                  </div>
                </div>
                <div className="ml-9 flex w-14 gap-1 rounded-full bg-card px-3 py-2 shadow-sm ring-1 ring-border">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-1.5 rounded-full bg-layer-selected" />
                  ))}
                </div>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card/70 px-4 py-1 text-xs whitespace-nowrap text-helper">
                  In-app bell · unread count
                </span>
              </div>
              <h3 className="mt-6 px-7 text-lg font-semibold text-foreground">
                Built-in Notifications
              </h3>
              <p className="mt-2 px-7 text-sm leading-relaxed text-helper">
                Each hand-off notifies the next person in BayFlow, with an unread count on the bell,
                so a job never waits on a phone call.
              </p>
              <Link href="/#roles" className={TEXT_LINK}>
                See every role →
              </Link>
            </div>

            {/* Card 3: Try the demo shop */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card pb-7 shadow-sm">
              <div
                aria-hidden="true"
                className="relative aspect-[16/11] overflow-hidden bg-secondary"
              >
                <div className="absolute inset-y-6 -right-6 left-6 rounded-xl bg-card shadow-sm ring-1 ring-border">
                  <div className="flex items-center gap-2 border-b border-border-faint px-4 py-3 text-xs text-helper">
                    <Search className="size-3.5" /> Pick a demo account…
                  </div>
                  {DEMO_ACCOUNT_ROWS.map(([role, name]) => (
                    <div
                      key={role}
                      className="flex items-center gap-3 border-b border-border-faint px-4 py-2.5 text-xs text-muted-foreground"
                    >
                      <span className="size-5 shrink-0 rounded-md bg-secondary" />
                      <span>
                        <span className="font-semibold text-foreground">{role}</span> · {name}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <span className="size-5 shrink-0 rounded-md bg-secondary" />
                    <span className="h-2 w-32 rounded-full bg-secondary" />
                  </div>
                </div>
              </div>
              <h3 className="mt-6 px-7 text-lg font-semibold text-foreground">Try the Demo Shop</h3>
              <p className="mt-2 px-7 text-sm leading-relaxed text-helper">
                Sign in as any role at Lahore Auto Care, a sample shop with bookings already in
                progress, and walk a job from booking to pick-up.
              </p>
              <Link href="/login" className={TEXT_LINK}>
                Open the demo accounts →
              </Link>
            </div>
          </div>

          <div className="mt-12 flex flex-row items-center justify-center gap-4">
            <DemoRequestButton className={OUTLINE_CTA}>Book a Demo</DemoRequestButton>
            <Link href="/register" className={PRIMARY_CTA}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. ON ANY PHONE BANNER
          ======================================================== */}
      <section className="relative w-full bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid overflow-hidden rounded-[32px] bg-secondary lg:grid-cols-12">
            {/* Left: headline, CTA pinned to the bottom */}
            <div className="flex flex-col justify-between gap-12 p-8 sm:p-12 lg:col-span-7 lg:min-h-[460px] lg:p-14">
              <div>
                <h2 className="max-w-xl text-4xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl">
                  Run your whole garage from your pocket.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                  Jobs, inspections, estimates and QC in the browser on any phone, with no app to
                  install, so your team can work from the bay floor.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/register"
                  className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 transition outline-none hover:bg-brand-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right: phone rises from the bottom edge and is cropped by the card */}
            <div className="relative flex h-[340px] justify-center lg:col-span-5 lg:h-auto">
              <PhoneFrame
                screen={LANDING_SCREENS.phoneTechnicianJobs}
                sizes="(max-width: 1024px) 240px, 300px"
                className="absolute top-8 w-[260px] shadow-2xl lg:top-20 lg:w-[320px]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
