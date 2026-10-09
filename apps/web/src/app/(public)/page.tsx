import {
  ArrowRight,
  Bell,
  CalendarCheck,
  Car,
  CarFront,
  Check,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileCheck,
  Inbox,
  LayoutDashboard,
  Monitor,
  PackageSearch,
  ScanSearch,
  ScrollText,
  ShieldCheck,
  Smartphone,
  Store,
  Tablet,
  Truck,
  UserPlus,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Logo } from '@/components/layout/logo'
import { StatusBadge } from '@/components/status-badge'
import { formatPKR } from '@/lib/format'
import {
  STATUS_PHASE_LABELS,
  statusesInPhase,
  statusLabel,
  type BookingStatus,
  type StatusPhase,
} from '@/lib/status'
import { cn } from '@/lib/utils'

/*
 * P-01 Landing (spec 10). A Server Component: nothing here is interactive, so the page ships no
 * JavaScript of its own. Every sentence describes BayFlow as specified (brief §3–§7, specs 06, 08,
 * 09, 10). The illustrations are drawn in JSX from the brief's worked example (§6), are marked
 * "Example" and use the app's real status labels and money format. There are no third-party
 * images, logos, ratings or testimonials.
 */

// ---------------------------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------------------------

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2'

const PRIMARY_PILL = cn(
  'inline-flex items-center justify-center rounded-full bg-[#1047FA] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#1047FA]/20 transition-all duration-200 hover:bg-[#0935c7] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 sm:px-9 sm:text-base',
  FOCUS_RING,
)

const SECONDARY_PILL = cn(
  'inline-flex items-center justify-center rounded-full border border-neutral-900 bg-white px-8 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-all duration-200 hover:bg-neutral-50 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 sm:text-base',
  FOCUS_RING,
)

const TEXT_LINK = cn('rounded-sm font-bold text-[#1047FA] hover:underline', FOCUS_RING)

const EYEBROW = 'text-xs font-extrabold tracking-widest text-[#1047FA] uppercase md:text-sm'

const SECTION_TITLE =
  'mt-3 text-3xl font-extrabold tracking-tight text-balance text-[#111827] sm:text-4xl md:text-5xl'

// Handwritten accent word. Caveat has no italic face, so the browser slants it and the last letter
// leans over the next space; the right padding is the italic correction. `nowrap` keeps "pick-up,"
// from breaking at its hyphen.
const HANDWRITING =
  'font-handwriting pr-[0.15em] text-4xl font-normal whitespace-nowrap italic sm:text-5xl md:text-6xl'

// ---------------------------------------------------------------------------------------------
// Content (brief §5–§6, glossary §3 and §14, spec 10)
// ---------------------------------------------------------------------------------------------

/** The worked example's booking (brief §6): Lahore Auto Care, a 2016 Honda Civic, LEA-1234. */
const EXAMPLE = {
  shop: 'Lahore Auto Care',
  otherShop: 'Raza Auto Works',
  vehicle: 'Honda Civic 2016 · LEA-1234',
  reference: 'BF-7K2M4Q',
  purchaseOrder: 'PO-4H8K2M',
  slot: 'Fri 16 Oct · 10:00 am',
  services: 'Check engine light, Oil change',
} as const

/** Estimate v2 from the worked example: the Service Advisor cut labour to 3,500 (total 16,100). */
const ESTIMATE_LINES: ReadonlyArray<{ label: string; amount: number }> = [
  { label: 'Ignition coil × 1', amount: 6500 },
  { label: 'Oil filter × 1', amount: 900 },
  { label: 'Engine oil 4 L × 1', amount: 5200 },
  { label: 'Labour', amount: 3500 },
]

const ESTIMATE_TOTAL = ESTIMATE_LINES.reduce((sum, line) => sum + line.amount, 0)

const ROLES: ReadonlyArray<{ label: string; icon: LucideIcon }> = [
  { label: 'Customer', icon: Car },
  { label: 'Service Advisor', icon: CalendarCheck },
  { label: 'Technician', icon: Wrench },
  { label: 'Parts Person', icon: PackageSearch },
  { label: 'QC Inspector', icon: ClipboardCheck },
  { label: 'Owner', icon: LayoutDashboard },
]

const STEPS: ReadonlyArray<{
  title: string
  body: string
  icon: LucideIcon
  status: BookingStatus | null
}> = [
  {
    title: 'Choose a garage',
    body: 'Search the garages by name or city, then open one to see its services and opening hours.',
    icon: Store,
    status: null,
  },
  {
    title: 'Pick a time',
    body: 'Choose your services, describe the problem and pick a free slot. Your account is created as you book.',
    icon: CalendarCheck,
    status: 'PENDING',
  },
  {
    title: 'Approve the estimate',
    body: 'After the inspection you get an itemised estimate for parts and labour. Approve it online, or reject it and the garage follows up.',
    icon: FileCheck,
    status: 'AWAITING_CUSTOMER',
  },
  {
    title: 'Track and pick up',
    body: 'Follow every step on your booking page. Once the car passes its quality check, the garage lets you know it is ready.',
    icon: CarFront,
    status: 'READY_FOR_PICKUP',
  },
]

interface FeatureBullet {
  /** Target of the header's Features menu (`/#id`). */
  id?: string
  title: string
  body: string
  icon: LucideIcon
}

const CUSTOMER_FEATURES: ReadonlyArray<FeatureBullet> = [
  {
    id: 'booking',
    title: 'Live slot availability',
    body: 'Pick a garage, your services and a time. You only see slots that still have space, and a slot can never be booked beyond its capacity.',
    icon: CalendarCheck,
  },
  {
    id: 'estimates',
    title: 'Estimates you approve',
    body: 'Your estimate lists every part and the labour, with its version number. Approve or reject it online, and your decision is saved with the time you made it.',
    icon: FileCheck,
  },
  {
    id: 'tracking',
    title: 'Ready-for-pick-up notice',
    body: 'A status timeline shows where your car is at every step, and the garage lets you know in the app when it is ready to collect.',
    icon: Bell,
  },
]

const WORKSHOP_FEATURES: ReadonlyArray<FeatureBullet> = [
  {
    title: 'From inspection to estimate',
    body: 'The technician records the parts and labour the car needs. The Service Advisor reviews it, saves any changes as a new version and sends it to the customer.',
    icon: ClipboardList,
  },
  {
    id: 'parts',
    title: 'Parts reserved, shortages ordered',
    body: 'Required parts are checked against the shop’s stock. What is in stock is reserved for the job, shortages go on a purchase order, and receiving it updates the stock.',
    icon: PackageSearch,
  },
  {
    id: 'qc',
    title: 'Quality control with a fail loop',
    body: 'A QC Inspector picks the job from the shop’s shared queue and works through a checklist. A failed check records an issue and sends the car back to the technician until it passes.',
    icon: ClipboardCheck,
  },
]

const TEAM_FEATURES: ReadonlyArray<FeatureBullet> = [
  {
    id: 'roles',
    title: 'Role-based workspaces',
    body: 'Service Advisor, Technician, Parts Person, QC Inspector and Owner each start on their own screen and only see the actions their role can take.',
    icon: Users,
  },
  {
    id: 'multi-shop',
    title: 'Multi-shop, kept separate',
    body: 'Each shop has its own team, services, slots, stock and bookings. Staff of one shop can never open another shop’s records, and owners switch shops in one click.',
    icon: Store,
  },
  {
    title: 'Every hand-off on the record',
    body: 'Each status change is logged with who made it, in which role, when and with what note. Owners can look into every role’s view to support the team.',
    icon: ScrollText,
  },
]

/** The six working phases of a booking (spec 09 §3.3); statuses come from `lib/status`. */
const PHASES: ReadonlyArray<{
  phase: StatusPhase
  icon: LucideIcon
  responsible: string
  body: string
}> = [
  {
    phase: 'INTAKE',
    icon: Inbox,
    responsible: 'Service Advisor',
    body: 'A new booking reaches the Service Advisor, who confirms or declines it and assigns a technician.',
  },
  {
    phase: 'INSPECTION',
    icon: ScanSearch,
    responsible: 'Technician',
    body: 'The assigned technician inspects the car and adds the parts, labour and total cost it needs.',
  },
  {
    phase: 'ESTIMATE',
    icon: ClipboardList,
    responsible: 'Service Advisor, then the customer',
    body: 'The Service Advisor reviews and sends the estimate. The customer approves or rejects it online.',
  },
  {
    phase: 'PARTS',
    icon: PackageSearch,
    responsible: 'Parts Person',
    body: 'Stock is checked against the job. Missing parts are ordered, received into stock and allocated to the booking.',
  },
  {
    phase: 'REPAIR_QC',
    icon: Wrench,
    responsible: 'Technician, then a QC Inspector',
    body: 'The technician repairs the car and sends it to QC. A failed check returns it to the technician with a recorded issue.',
  },
  {
    phase: 'HANDOVER',
    icon: CarFront,
    responsible: 'Service Advisor and customer',
    body: 'The Service Advisor tells the customer the car is ready, and the booking is completed at pick-up.',
  },
]

const ONBOARDING: ReadonlyArray<{
  title: string
  body: string
  icon: LucideIcon
  tags?: ReadonlyArray<string>
}> = [
  {
    title: 'Register as the owner',
    body: 'Create your owner account with your name, e-mail and a password.',
    icon: UserPlus,
  },
  {
    title: 'Set up your shop',
    body: 'Add your address, working hours, slot length and capacity, and the services customers can book.',
    icon: Store,
    tags: ['Working hours', 'Slots', 'Services'],
  },
  {
    title: 'Add your team',
    body: 'Create an account for each person and give them a role. Staff never sign up on their own.',
    icon: Users,
    tags: ['SA', 'Tech', 'Parts', 'QC'],
  },
]

const DEVICES: ReadonlyArray<{ label: string; icon: LucideIcon }> = [
  { label: 'Phone', icon: Smartphone },
  { label: 'Tablet', icon: Tablet },
  { label: 'Desktop', icon: Monitor },
]

// ---------------------------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------------------------

export default function LandingPage() {
  return (
    <div className="relative w-full overflow-x-clip bg-white text-[#171c26]">
      {/* 1. Hero */}
      <section className="bg-grid-pattern relative w-full pt-10 pb-16 md:pt-16 md:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-radial-[circle_at_50%_15%] from-blue-50/40 via-transparent to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1047FA] uppercase md:text-sm">
              Auto repair, without the phone calls
            </p>

            <h1 className="text-4xl leading-[1.12] font-extrabold tracking-tight text-balance text-[#111827] sm:text-5xl md:text-6xl lg:text-[68px]">
              Book trusted car repair{' '}
              <span className="align-baseline font-handwriting text-5xl font-normal whitespace-nowrap text-[#374151] italic sm:text-6xl md:text-7xl lg:text-[76px]">
                in minutes
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-neutral-600 sm:text-lg">
              Find a garage, pick a free slot, approve your estimate online and follow every step
              until your car is ready. For garages, BayFlow runs bookings, estimates, parts, quality
              checks and the team in one system, kept separate for every shop.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link href="/book" className={PRIMARY_PILL}>
                Find a garage
              </Link>
              <Link href="/register" className={SECONDARY_PILL}>
                List your garage
              </Link>
            </div>
          </div>

          <HeroPreview />

          <div className="mt-12 flex flex-col items-center gap-4 text-center md:mt-16">
            <p id="roles-strip-title" className="text-sm font-bold text-neutral-800">
              One booking, shared by everyone involved
            </p>
            <ul
              aria-labelledby="roles-strip-title"
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            >
              {ROLES.map((role) => (
                <li
                  key={role.label}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm sm:text-sm"
                >
                  <role.icon aria-hidden="true" className="size-4 text-[#1047FA]" />
                  {role.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. How it works (for car owners) */}
      <section
        id="how-it-works"
        className="relative w-full border-t border-neutral-200/70 bg-neutral-50/50 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className={EYEBROW}>How it works</p>
            <h2 className={SECTION_TITLE}>
              From booking to <span className={cn(HANDWRITING, 'text-[#1047FA]')}>pick-up,</span> in
              four steps
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              No phone calls needed: your booking page shows the status, the estimate and the
              pick-up notice.
            </p>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg motion-reduce:transition-none"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <step.icon aria-hidden="true" className="size-5 text-[#1047FA]" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-neutral-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.body}</p>
                </div>

                <div className="mt-6 flex min-h-8 flex-wrap items-center gap-x-2 gap-y-1 border-t border-neutral-100 pt-4 text-xs">
                  {step.status ? (
                    <>
                      <span className="text-neutral-600">You’ll see</span>
                      <StatusBadge status={step.status} audience="customer" />
                    </>
                  ) : (
                    <Link href="/book" className={cn(TEXT_LINK, 'inline-flex items-center gap-1')}>
                      Browse garages
                      <ArrowRight aria-hidden="true" className="size-3.5" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3–5. Feature sections */}
      <FeatureSection
        id="for-car-owners"
        eyebrow="For car owners"
        title={
          <>
            <span className={cn(HANDWRITING, 'text-[#171c26]')}>Book,</span> approve and track your
            repair online
          </>
        }
        features={CUSTOMER_FEATURES}
        iconTone="bg-blue-50 text-[#1047FA]"
        cta={{ label: 'Find a garage', href: '/book' }}
        visual={<SlotPickerPreview />}
      />

      <FeatureSection
        id="for-garages"
        eyebrow="For garages"
        title={
          <>
            <span className={cn(HANDWRITING, 'text-[#171c26]')}>Every</span> hand-off, on the record
          </>
        }
        features={WORKSHOP_FEATURES}
        iconTone="bg-emerald-50 text-emerald-600"
        cta={{ label: 'List your garage', href: '/register' }}
        visual={<PartsAndQcPreview />}
        reverse
        muted
      />

      <FeatureSection
        id="for-owners"
        eyebrow="For owners and teams"
        title={
          <>
            <span className={cn(HANDWRITING, 'text-[#171c26]')}>One</span> workspace per role,
            separate for every shop
          </>
        }
        features={TEAM_FEATURES}
        iconTone="bg-amber-50 text-amber-600"
        cta={{ label: 'Log in', href: '/login' }}
        visual={<WorkspacesPreview />}
      />

      {/* 6. The booking lifecycle */}
      <section
        id="lifecycle"
        className="relative w-full border-t border-neutral-200/60 bg-neutral-50/50 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className={EYEBROW}>The booking lifecycle</p>
            <h2 className={SECTION_TITLE}>One booking, six phases, a clear role for every step</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              Every booking follows the same status flow. Each status has one responsible role,
              BayFlow only offers the actions that role can take next, and every change is recorded
              with who made it and when.
            </p>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {PHASES.map((item, index) => {
              const phaseLabel = STATUS_PHASE_LABELS[item.phase]
              return (
                <li
                  key={item.phase}
                  className="rounded-3xl border border-neutral-200/90 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#1047FA] text-white shadow-md">
                      <item.icon aria-hidden="true" className="size-6 stroke-[2.2]" />
                    </span>
                    <span className="text-xs font-bold text-neutral-600">
                      Phase {index + 1} of {PHASES.length}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-neutral-900">{phaseLabel}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.body}</p>
                  <p className="mt-4 text-xs font-semibold text-neutral-800">
                    Responsible:{' '}
                    <span className="font-normal text-neutral-600">{item.responsible}</span>
                  </p>
                  <ul aria-label={`${phaseLabel} statuses`} className="mt-4 flex flex-wrap gap-1.5">
                    {statusesInPhase(item.phase).map((status) => (
                      <li key={status}>
                        <StatusBadge status={status} audience="staff" />
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-neutral-600">
            A rejected estimate goes back to the Service Advisor to revise or cancel. A booking can
            be cancelled before the repair starts, and any reserved parts go back into stock.
          </p>
        </div>
      </section>

      {/* 7. Getting started (for garage owners) */}
      <section
        id="get-started"
        className="bg-grid-pattern relative w-full border-t border-neutral-200/60 bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className={EYEBROW}>For garage owners</p>
            <h2 className={SECTION_TITLE}>
              Set up your <span className={cn(HANDWRITING, 'text-[#171c26]')}>garage</span> in three
              steps
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              BayFlow is built for independent garages. Run one shop or several, each with its own
              team, stock and bookings.
            </p>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {ONBOARDING.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-8 shadow-md transition-shadow hover:shadow-xl motion-reduce:transition-none"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1047FA]">
                      <step.icon aria-hidden="true" className="size-6" />
                    </span>
                    <span className="text-xs font-bold text-neutral-600">Step {index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-neutral-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{step.body}</p>
                </div>
                <div className="mt-8">
                  {step.tags ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {step.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Link
                      href="/register"
                      className={cn(TEXT_LINK, 'inline-flex items-center gap-1 text-sm')}
                    >
                      Create your account
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/register" className={PRIMARY_PILL}>
              List your garage
            </Link>
            <Link href="/login" className={SECONDARY_PILL}>
              Log in
            </Link>
          </div>
          <p className="mt-6 text-center text-sm text-neutral-600">
            Exploring the demo? The{' '}
            <Link href="/login" className={cn(TEXT_LINK, 'underline')}>
              log-in page
            </Link>{' '}
            lists a demo account for every role.
          </p>
        </div>
      </section>

      {/* 8. Closing band */}
      <section className="relative w-full bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-grid-pattern relative overflow-hidden rounded-[40px] border border-neutral-200/90 bg-white p-6 shadow-lg sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-balance text-[#111827] sm:text-4xl md:text-5xl">
                  <span className={cn(HANDWRITING, 'text-[#171c26]')}>Repairs,</span> without the
                  phone calls
                </h2>

                <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                  Customers book, approve and follow their repair online. Garages run every job from
                  one shared record, from the first booking to the hand-over.
                </p>

                <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <Link href="/book" className={PRIMARY_PILL}>
                    Find a garage
                  </Link>
                  <Link href="/register" className={SECONDARY_PILL}>
                    List your garage
                  </Link>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <p id="devices-title" className="mb-3 text-xs font-bold text-neutral-700">
                    Runs in your browser. Nothing to install.
                  </p>
                  <ul aria-labelledby="devices-title" className="flex flex-wrap items-center gap-3">
                    {DEVICES.map((device) => (
                      <li
                        key={device.label}
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700"
                      >
                        <device.icon aria-hidden="true" className="size-4 text-[#1047FA]" />
                        {device.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-center lg:col-span-5">
                <PhonePreview />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------------------------

interface FeatureSectionProps {
  id: string
  eyebrow: string
  title: ReactNode
  features: ReadonlyArray<FeatureBullet>
  /** Background and ink of the bullet icon tiles. */
  iconTone: string
  cta: { label: string; href: string }
  visual: ReactNode
  /** Visual on the left from `lg` up (text always comes first in reading order). */
  reverse?: boolean
  /** Light grey band instead of white. */
  muted?: boolean
}

function FeatureSection({
  id,
  eyebrow,
  title,
  features,
  iconTone,
  cta,
  visual,
  reverse = false,
  muted = false,
}: FeatureSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative w-full border-t border-neutral-200/60 py-20',
        muted ? 'bg-neutral-50/50' : 'bg-white',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className={cn('space-y-8 lg:col-span-6', reverse && 'lg:order-2')}>
            <div>
              <p className={EYEBROW}>{eyebrow}</p>
              <h2 className={cn(SECTION_TITLE, 'leading-tight')}>{title}</h2>
            </div>

            <ul className="space-y-6">
              {features.map((feature) => (
                <li key={feature.title} id={feature.id} className="flex items-start gap-4">
                  <span
                    className={cn(
                      'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl',
                      iconTone,
                    )}
                  >
                    <feature.icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">{feature.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link href={cta.href} className={PRIMARY_PILL}>
                {cta.label}
              </Link>
            </div>
          </div>

          <div className={cn('flex justify-center lg:col-span-6', reverse && 'lg:order-1')}>
            {visual}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// Illustrations: self-made, decorative product previews. Each is one `role="img"` with a label,
// so screen readers hear a single description instead of the example data.
// ---------------------------------------------------------------------------------------------

function ExampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#1047FA] uppercase',
        className,
      )}
    >
      Example
    </span>
  )
}

function Chip({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        className,
      )}
    >
      {children}
    </span>
  )
}

const HERO_TIMELINE: ReadonlyArray<{ label: string; state: 'done' | 'current' | 'next' }> = [
  { label: statusLabel('PENDING', 'customer'), state: 'done' },
  { label: statusLabel('CONFIRMED', 'customer'), state: 'done' },
  { label: statusLabel('INSPECTING', 'customer'), state: 'done' },
  { label: statusLabel('AWAITING_CUSTOMER', 'customer'), state: 'current' },
  { label: 'Parts, repair and quality check', state: 'next' },
  { label: statusLabel('READY_FOR_PICKUP', 'customer'), state: 'next' },
]

/** Hero: the customer's booking page with its timeline and the estimate waiting for approval. */
function HeroPreview() {
  return (
    <div className="relative mx-auto mt-12 max-w-[1020px] md:mt-16">
      <div
        role="img"
        aria-label={`Example booking ${EXAMPLE.reference} at ${EXAMPLE.shop} for a 2016 Honda Civic. Its timeline has reached “${statusLabel('AWAITING_CUSTOMER', 'customer')}”, and estimate version 2 totals ${formatPKR(ESTIMATE_TOTAL)}, with Approve and Reject buttons.`}
        className="rounded-3xl border border-neutral-200 bg-white p-2 text-left shadow-2xl shadow-[#1047FA]/10 sm:p-3"
      >
        <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-3">
          <span className="size-2.5 shrink-0 rounded-full bg-rose-300" />
          <span className="size-2.5 shrink-0 rounded-full bg-amber-300" />
          <span className="size-2.5 shrink-0 rounded-full bg-emerald-300" />
          <span className="ml-2 min-w-0 truncate text-xs font-semibold text-neutral-600">
            My bookings / {EXAMPLE.reference}
          </span>
          <ExampleTag className="ml-auto" />
        </div>

        <div className="grid gap-3 p-2 pt-3 sm:gap-4 sm:p-3 md:grid-cols-12">
          {/* Booking */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:col-span-7">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1047FA] text-sm font-bold text-white">
                LA
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-900">{EXAMPLE.shop}</p>
                <p className="truncate text-xs text-neutral-600">{EXAMPLE.vehicle}</p>
              </div>
              <span className="hidden shrink-0 font-mono text-[11px] font-semibold tracking-wide text-neutral-600 sm:inline">
                {EXAMPLE.reference}
              </span>
            </div>

            <div className="mt-3">
              <StatusBadge status="AWAITING_CUSTOMER" audience="customer" size="md" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-xl bg-neutral-50 p-2.5">
                <p className="text-neutral-600">Appointment</p>
                <p className="mt-0.5 font-semibold text-neutral-900">{EXAMPLE.slot}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-2.5">
                <p className="text-neutral-600">Services</p>
                <p className="mt-0.5 font-semibold text-neutral-900">{EXAMPLE.services}</p>
              </div>
            </div>

            <ol className="mt-4 hidden space-y-2.5 sm:block">
              {HERO_TIMELINE.map((step) => (
                <li key={step.label} className="flex items-center gap-2.5 text-xs">
                  {step.state === 'done' && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                  {step.state === 'current' && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1047FA] ring-4 ring-blue-100">
                      <span className="size-1.5 rounded-full bg-white" />
                    </span>
                  )}
                  {step.state === 'next' && (
                    <span className="size-5 shrink-0 rounded-full border-2 border-dashed border-neutral-300" />
                  )}
                  <span
                    className={
                      step.state === 'next' ? 'text-neutral-600' : 'font-semibold text-neutral-900'
                    }
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Estimate */}
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:col-span-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-neutral-900">Estimate</p>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#1047FA]">
                Version 2
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-600">Parts and labour, sent by the garage</p>

            <ul className="mt-3 divide-y divide-neutral-100 text-xs">
              {ESTIMATE_LINES.map((line) => (
                <li key={line.label} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0 truncate text-neutral-700">{line.label}</span>
                  <span className="shrink-0 font-semibold text-neutral-900 tabular-nums">
                    {formatPKR(line.amount)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-1 flex items-center justify-between border-t border-neutral-200 pt-3">
              <span className="text-sm font-bold text-neutral-900">Total</span>
              <span className="text-lg font-extrabold text-neutral-900 tabular-nums">
                {formatPKR(ESTIMATE_TOTAL)}
              </span>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
              <span className="rounded-full bg-[#1047FA] py-2 text-center text-xs font-semibold text-white">
                Approve
              </span>
              <span className="rounded-full border border-neutral-300 bg-white py-2 text-center text-xs font-semibold text-neutral-800">
                Reject
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ExampleDay {
  day: string
  date: string
  selected?: boolean
}

interface ExampleSlot {
  time: string
  selected?: boolean
  /** Shown when only one place is left in the slot (spec 10 W3). */
  hint?: string
}

const SLOT_DAYS: ReadonlyArray<ExampleDay> = [
  { day: 'Wed', date: '14' },
  { day: 'Thu', date: '15' },
  { day: 'Fri', date: '16', selected: true },
  { day: 'Sat', date: '17' },
  { day: 'Mon', date: '19' },
]

const SLOT_TIMES: ReadonlyArray<ExampleSlot> = [
  { time: '9:00 am' },
  { time: '10:00 am', selected: true },
  { time: '11:00 am', hint: '1 left' },
  { time: '12:00 pm' },
  { time: '2:00 pm', hint: '1 left' },
  { time: '4:00 pm' },
]

/** For car owners: the wizard's time step, which lists only slots with space left. */
function SlotPickerPreview() {
  return (
    <div
      role="img"
      aria-label={`Example: choosing a time at ${EXAMPLE.shop}. Friday 16 October is selected and only times with space left are listed; 10:00 am is chosen, and 11:00 am and 2:00 pm have one place left.`}
      className="w-full max-w-[514px] rounded-3xl border border-neutral-200 bg-white p-5 text-left shadow-xl shadow-neutral-900/5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-wider text-[#1047FA] uppercase">
            Step 3 of 5 · Time
          </p>
          <p className="mt-1 truncate text-base font-bold text-neutral-900">{EXAMPLE.shop}</p>
          <p className="truncate text-xs text-neutral-600">{EXAMPLE.services}</p>
        </div>
        <ExampleTag />
      </div>

      <p className="mt-5 text-xs font-semibold text-neutral-800">October 2026</p>
      <ul className="mt-2 grid grid-cols-5 gap-2">
        {SLOT_DAYS.map((day) => (
          <li
            key={day.date}
            className={cn(
              'flex flex-col items-center rounded-2xl border py-2',
              day.selected
                ? 'border-[#1047FA] bg-[#1047FA] text-white'
                : 'border-neutral-200 text-neutral-800',
            )}
          >
            <span
              className={cn('text-[11px]', day.selected ? 'text-blue-100' : 'text-neutral-600')}
            >
              {day.day}
            </span>
            <span className="text-sm font-bold">{day.date}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-4 grid grid-cols-3 gap-2">
        {SLOT_TIMES.map((slot) => (
          <li
            key={slot.time}
            className={cn(
              'flex min-h-12 flex-col items-center justify-center rounded-xl border px-1 py-1.5 text-center',
              slot.selected
                ? 'border-[#1047FA] bg-blue-50 text-[#1047FA] ring-1 ring-[#1047FA]'
                : 'border-neutral-200 text-neutral-800',
            )}
          >
            <span className="text-xs font-semibold">{slot.time}</span>
            {slot.hint && (
              <span className="text-[10px] font-semibold text-status-estimate-fg">{slot.hint}</span>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-neutral-600">
        <Clock className="size-3.5 shrink-0" />
        Shop local time (Asia/Karachi). Full slots are not shown.
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-neutral-50 p-3">
        <p className="min-w-0 truncate text-xs font-bold text-neutral-900">{EXAMPLE.slot}</p>
        <span className="shrink-0 rounded-full bg-[#1047FA] px-4 py-2 text-xs font-semibold text-white">
          Continue
        </span>
      </div>
    </div>
  )
}

const PARTS_CHECK: ReadonlyArray<{ part: string; inStock: boolean }> = [
  { part: 'Engine oil 4 L', inStock: true },
  { part: 'Oil filter', inStock: true },
  { part: 'Ignition coil', inStock: false },
]

/** The default QC checklist (D46, spec 03 §3.6 labels). */
const QC_CHECKLIST = [
  'Road test',
  'No warning lights',
  'No leaks',
  'Fluid levels OK',
  'Customer complaint resolved',
] as const

/** For garages: the parts check with a purchase order, then a QC round that passed. */
function PartsAndQcPreview() {
  return (
    <div
      role="img"
      aria-label={`Example: the parts check for job ${EXAMPLE.reference} shows engine oil and the oil filter in stock, and the ignition coil out of stock and on purchase order ${EXAMPLE.purchaseOrder}. Below it, QC round 2 passes all five checklist items after round 1 failed with an oil leak at the filter.`}
      className="w-full max-w-[514px] space-y-4 text-left"
    >
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-900/5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-wider text-[#1047FA] uppercase">
              Parts check
            </p>
            <p className="mt-1 truncate text-base font-bold text-neutral-900">
              Job {EXAMPLE.reference}
            </p>
          </div>
          <ExampleTag />
        </div>

        <ul className="mt-4 divide-y divide-neutral-100 text-xs">
          {PARTS_CHECK.map((row) => (
            <li key={row.part} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <span className="font-semibold text-neutral-800">
                {row.part} <span className="font-normal text-neutral-600">× 1</span>
              </span>
              {row.inStock ? (
                <Chip className="border-status-handover-border bg-success-subtle text-success-ink">
                  In stock
                </Chip>
              ) : (
                <span className="flex flex-wrap items-center gap-1.5">
                  <Chip className="border-status-estimate-rejected-border bg-danger-subtle text-danger-ink">
                    Out
                  </Chip>
                  <Chip className="border-status-intake-border bg-info-subtle text-info-ink">
                    <Truck className="size-3" />
                    {EXAMPLE.purchaseOrder} · Ordered
                  </Chip>
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-700">
            <span>Parts ready</span>
            <span>2 of 3</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-neutral-100">
            <div className="h-2 w-2/3 rounded-full bg-[#1047FA]" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-900/5 sm:ml-10 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-wider text-[#1047FA] uppercase">
              QC inspection
            </p>
            <p className="mt-1 text-base font-bold text-neutral-900">Round 2</p>
          </div>
          <Chip className="border-status-handover-border bg-success-subtle text-success-ink">
            <Check className="size-3" strokeWidth={3} />
            Passed
          </Chip>
        </div>

        <ul className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
          {QC_CHECKLIST.map((item) => (
            <li key={item} className="flex items-center gap-2 text-neutral-800">
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="size-2.5" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-danger-subtle p-3 text-[11px] leading-snug text-danger-ink">
          <CircleAlert className="mt-px size-3.5 shrink-0" />
          Round 1 failed: oil leak at the filter. The job went back to the technician with this
          issue.
        </p>
      </div>
    </div>
  )
}

/** Spec 10 S-04: the screen each membership role lands on. */
const ROLE_HOMES: ReadonlyArray<{ role: string; home: string; icon: LucideIcon }> = [
  { role: 'Service Advisor', home: 'Bookings', icon: CalendarCheck },
  { role: 'Technician', home: 'My jobs', icon: Wrench },
  { role: 'Parts Person', home: 'Jobs awaiting parts', icon: PackageSearch },
  { role: 'QC Inspector', home: 'QC queue', icon: ClipboardCheck },
  { role: 'Owner', home: 'Shop overview', icon: LayoutDashboard },
]

/** For owners and teams: the shop switcher and where each role starts. */
function WorkspacesPreview() {
  return (
    <div
      role="img"
      aria-label={`Example: an owner's shop switcher with ${EXAMPLE.shop} selected and ${EXAMPLE.otherShop} listed, and the screen each role starts on: Bookings for the Service Advisor, My jobs for the Technician, Jobs awaiting parts for the Parts Person, the QC queue for the QC Inspector and the shop overview for the Owner.`}
      className="w-full max-w-[514px] overflow-hidden rounded-3xl border border-neutral-200 bg-white text-left shadow-xl shadow-neutral-900/5"
    >
      <div className="flex items-center gap-3 bg-[#111827] px-5 py-4 text-white">
        <Logo tone="dark" size="sm" showText={false} />
        <span className="min-w-0 truncate text-sm font-bold">{EXAMPLE.shop}</span>
        <ChevronDown className="size-4 shrink-0 text-neutral-300" />
        <span className="ml-auto shrink-0 rounded bg-white/15 px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase">
          Owner
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold tracking-wider text-neutral-600 uppercase">
            Your shops
          </p>
          <ExampleTag />
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/60 px-3 py-2.5">
            <span className="min-w-0 truncate font-semibold text-neutral-900">{EXAMPLE.shop}</span>
            <Check className="size-4 shrink-0 text-[#1047FA]" />
          </li>
          <li className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3 py-2.5">
            <span className="min-w-0 truncate font-semibold text-neutral-700">
              {EXAMPLE.otherShop}
            </span>
            <span className="shrink-0 text-[11px] text-neutral-600">Owner</span>
          </li>
        </ul>

        <p className="mt-6 text-[11px] font-bold tracking-wider text-neutral-600 uppercase">
          Where each role starts
        </p>
        <ul className="mt-3 grid gap-2">
          {ROLE_HOMES.map((item) => (
            <li
              key={item.role}
              className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5 text-xs"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#1047FA] shadow-sm">
                <item.icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1 truncate font-semibold text-neutral-900">
                {item.role}
              </span>
              <span className="shrink-0 text-neutral-600">{item.home}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 flex items-start gap-2 rounded-xl border border-neutral-200 p-3 text-[11px] leading-snug text-neutral-700">
          <ShieldCheck className="mt-px size-3.5 shrink-0 text-emerald-600" />
          {EXAMPLE.shop}’s staff can’t open {EXAMPLE.otherShop}’ bookings, stock or team.
        </p>
      </div>
    </div>
  )
}

/** A booking reference never breaks at its hyphen. */
const REFERENCE = <span className="whitespace-nowrap">{EXAMPLE.reference}</span>

/** Customer notifications, worded as in the notifications spec (titles and bodies). */
const PHONE_NOTIFICATIONS: ReadonlyArray<{
  id: string
  title: ReactNode
  body: ReactNode
  icon: LucideIcon
  unread: boolean
}> = [
  {
    id: 'vehicle-ready',
    title: 'Your vehicle is ready for pick-up',
    body: (
      <>
        Booking {REFERENCE} at {EXAMPLE.shop} is ready for pick-up.
      </>
    ),
    icon: CarFront,
    unread: true,
  },
  {
    id: 'estimate-sent',
    title: <>Your estimate is ready — {REFERENCE}</>,
    body: `${EXAMPLE.shop} sent estimate v2: ${formatPKR(ESTIMATE_TOTAL)}. Review and approve it in BayFlow.`,
    icon: FileCheck,
    unread: false,
  },
  {
    id: 'booking-confirmed',
    title: <>Booking confirmed — {REFERENCE}</>,
    body: `${EXAMPLE.shop} confirmed your booking.`,
    icon: CalendarCheck,
    unread: false,
  },
]

/** Closing band: BayFlow in a phone browser, with the ready-for-pick-up notification. */
function PhonePreview() {
  return (
    <div
      role="img"
      aria-label={`Example: BayFlow open in a phone browser. One unread notification says your vehicle is ready for pick-up at ${EXAMPLE.shop}; older ones show the estimate and the booking confirmation.`}
      className="w-full max-w-[300px] rounded-[2.5rem] border-[10px] border-neutral-900 bg-white text-left shadow-xl"
    >
      <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-neutral-200" />

      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <Logo size="sm" />
        <span className="relative text-neutral-700">
          <Bell className="size-5" />
          <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-[#1047FA] text-[9px] font-bold text-white">
            1
          </span>
        </span>
      </div>

      <div className="space-y-2 p-3">
        <p className="px-1 text-[11px] font-bold tracking-wider text-neutral-600 uppercase">
          Notifications
        </p>
        <ul className="space-y-2">
          {PHONE_NOTIFICATIONS.map((notification) => (
            <li
              key={notification.id}
              className={cn(
                'flex gap-2.5 rounded-2xl border p-3',
                notification.unread ? 'border-blue-200 bg-blue-50/60' : 'border-neutral-100',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
                  notification.unread
                    ? 'bg-[#1047FA] text-white'
                    : 'bg-neutral-100 text-neutral-600',
                )}
              >
                <notification.icon className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900">{notification.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-neutral-600">
                  {notification.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-3 mb-5 rounded-2xl border border-neutral-200 p-3">
        <StatusBadge status="READY_FOR_PICKUP" audience="customer" size="md" />
        <p className="mt-2 text-xs font-semibold text-neutral-900">{EXAMPLE.vehicle}</p>
        <p className="text-[11px] text-neutral-600">
          {EXAMPLE.shop} · {EXAMPLE.reference}
        </p>
      </div>
    </div>
  )
}
