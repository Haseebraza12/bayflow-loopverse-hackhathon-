import { Check, History, Smartphone, UsersRound } from 'lucide-react'
import Link from 'next/link'

import { Logo } from '@/components/layout/logo'
import { cn } from '@/lib/utils'

/**
 * Auth brand panel (spec 10 P-04): navy in both themes. The `dark` class scopes the dark tokens to
 * the panel, so it uses the same status hues as the app's dark theme. A sample booking's hand-offs
 * show what "every hand-off, on the record" means: each stage, who did it and when.
 */

type Phase = 'intake' | 'inspection' | 'estimate' | 'parts' | 'repair-qc' | 'handover'

const PHASE_DOT: Record<Phase, string> = {
  intake: 'bg-status-intake-fg',
  inspection: 'bg-status-inspection-fg',
  estimate: 'bg-status-estimate-fg',
  parts: 'bg-status-parts-fg',
  'repair-qc': 'bg-status-repair-qc-fg',
  handover: 'bg-status-handover-fg',
}

const HANDOFFS: ReadonlyArray<{
  phase: Phase
  label: string
  who: string
  time: string
  state: 'done' | 'current' | 'next'
}> = [
  {
    phase: 'intake',
    label: 'Booked online',
    who: 'Customer · Ayesha',
    time: '09:12',
    state: 'done',
  },
  {
    phase: 'inspection',
    label: 'Inspection done',
    who: 'Technician · Imran',
    time: '10:05',
    state: 'done',
  },
  {
    phase: 'estimate',
    label: 'Estimate approved',
    who: 'Customer · from her phone',
    time: '10:31',
    state: 'done',
  },
  { phase: 'parts', label: 'Parts ready', who: 'Parts · Usman', time: '11:02', state: 'done' },
  {
    phase: 'repair-qc',
    label: 'Quality check',
    who: 'QC inspector · Sara',
    time: 'Now',
    state: 'current',
  },
  {
    phase: 'handover',
    label: 'Ready for pick-up',
    who: 'Customer gets notified',
    time: '',
    state: 'next',
  },
]

const FEATURES = [
  {
    icon: UsersRound,
    title: 'Role workspaces',
    body: 'Owner, advisor, technician, parts and QC each get their own queue.',
  },
  {
    icon: Smartphone,
    title: 'Online approvals',
    body: 'Customers approve estimates from their phone before work starts.',
  },
  {
    icon: History,
    title: 'Full history',
    body: 'Every status change records who did it and when.',
  },
] as const

export function AuthShowcase() {
  return (
    <aside
      aria-label="About BayFlow"
      className="dark relative hidden overflow-hidden bg-brand-navy text-foreground lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:self-start"
    >
      {/* Decoration: a faint grid fading out from the top left, and two soft brand glows */}
      <div
        aria-hidden="true"
        className="bg-grid-pattern pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -right-40 size-[560px] rounded-full bg-brand-blue/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-32 size-[480px] rounded-full bg-brand-orange/15 blur-3xl"
      />

      <div className="relative flex flex-1 flex-col justify-between gap-8 p-10 xl:px-14 xl:py-12">
        <Link href="/" aria-label="Home" className="w-fit">
          <Logo tone="dark" />
        </Link>

        <div className="space-y-8">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.32px] text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-green" />
              Built for independent garages
            </p>
            <p className="font-heading text-5xl leading-[1.02] font-bold text-white xl:text-[58px]">
              Every hand-off,
              <br />
              on the record.
            </p>
            <div aria-hidden="true" className="h-1 w-16 rounded-full bg-brand-orange" />
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Bookings, estimates, parts and quality checks for independent garages — in one place.
            </p>
          </div>

          <HandoffCard />
        </div>

        <ul className="hidden gap-6 xl:grid-cols-3 [@media(min-height:980px)]:grid">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3 xl:flex-col">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-orange-on-dark">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="space-y-1">
                <span className="block text-sm font-semibold text-white">{title}</span>
                <span className="block text-xs leading-relaxed text-muted-foreground">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

/** A sample booking moving through the workshop, phase by phase (illustrative data). */
function HandoffCard() {
  return (
    <figure className="w-full max-w-md border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur-sm">
      <figcaption className="flex items-start justify-between gap-4">
        <span>
          <span className="block font-mono text-sm text-brand-blue-ink">BF-2026-001</span>
          <span className="mt-0.5 block text-sm text-foreground">
            2022 Honda Civic · Lahore Auto Care
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success-subtle px-2.5 py-1 text-xs text-success-ink">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-success-ink opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-success-ink" />
          </span>
          Live
        </span>
      </figcaption>

      <ol className="mt-5" aria-label="Sample booking timeline">
        {HANDOFFS.map((step, index) => (
          <li key={step.label} className="relative flex gap-3 pb-3.5 last:pb-0">
            {index < HANDOFFS.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-6 bottom-0 left-[9px] w-px',
                  step.state === 'done' ? 'bg-white/20' : 'bg-white/10',
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                'relative mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full',
                step.state === 'next' ? 'border border-white/25' : PHASE_DOT[step.phase],
              )}
            >
              {step.state === 'done' && (
                <Check className="size-3 text-brand-navy" strokeWidth={3} />
              )}
              {step.state === 'current' && (
                <span className="absolute inset-0 rounded-full bg-inherit opacity-50 motion-safe:animate-ping" />
              )}
            </span>
            <span className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
              <span className="min-w-0">
                <span
                  className={cn(
                    'block text-sm',
                    step.state === 'next' ? 'text-muted-foreground' : 'font-medium text-foreground',
                  )}
                >
                  {step.label}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{step.who}</span>
              </span>
              {step.time && (
                <span
                  className={cn(
                    'shrink-0 font-mono text-xs',
                    step.state === 'current'
                      ? 'text-status-repair-qc-fg'
                      : 'text-subtle-foreground',
                  )}
                >
                  {step.time}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
