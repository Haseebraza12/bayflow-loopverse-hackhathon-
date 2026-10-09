'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export const WIZARD_STEPS = ['shop', 'services', 'time', 'details', 'review'] as const
export type WizardStep = (typeof WIZARD_STEPS)[number]

const LABEL: Record<WizardStep, string> = {
  shop: 'Workshop',
  services: 'Services',
  time: 'Date & time',
  details: 'Your details',
  review: 'Review',
}

/**
 * The wizard's progress (spec 10 P-03 "Shell"): an ordered list in a labelled nav, the current
 * step marked with `aria-current="step"`, completed steps clickable. Labels collapse to numbers on
 * small screens except for the current step.
 */
export function BookingSteps({
  current,
  hrefFor,
}: {
  current: WizardStep
  /** Where a completed step links to; the shop step always goes back to the directory. */
  hrefFor?: (step: WizardStep) => string
}) {
  const currentIndex = WIZARD_STEPS.indexOf(current)
  return (
    <nav aria-label="Booking steps">
      <ol className="flex items-center gap-2 sm:gap-3">
        {WIZARD_STEPS.map((step, index) => {
          const done = index < currentIndex
          const isCurrent = index === currentIndex
          const href = done ? (step === 'shop' ? '/book' : hrefFor?.(step)) : undefined
          const marker = (
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                done && 'border-brand-green bg-brand-green text-white',
                isCurrent &&
                  'border-brand-blue bg-brand-blue text-white shadow-md ring-4 shadow-brand-blue/25 ring-brand-blue/15',
                !done && !isCurrent && 'border-border bg-card text-muted-foreground',
              )}
            >
              {done ? <Check className="size-4" aria-hidden /> : index + 1}
            </span>
          )
          const label = (
            <span
              className={cn(
                'text-sm font-semibold whitespace-nowrap',
                isCurrent ? 'text-foreground' : 'hidden text-muted-foreground md:inline',
              )}
            >
              {LABEL[step]}
              {done && <span className="sr-only"> (done)</span>}
            </span>
          )
          return (
            <li
              key={step}
              aria-current={isCurrent ? 'step' : undefined}
              className="flex min-w-0 items-center gap-2 sm:gap-3"
            >
              {href ? (
                <Link
                  href={href}
                  className="flex items-center gap-2 rounded-full outline-offset-4 hover:[&>span:last-child]:text-foreground"
                >
                  {marker}
                  {label}
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  {marker}
                  {label}
                </span>
              )}
              {index < WIZARD_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    'h-0.5 w-4 rounded-full sm:w-8 lg:w-12',
                    done ? 'bg-brand-green' : 'bg-border',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
