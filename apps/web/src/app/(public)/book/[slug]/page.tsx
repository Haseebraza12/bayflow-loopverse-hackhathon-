import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Book a service' }

/** Wizard steps after the shop is chosen (spec 10 P-03 W2–W5); W1 is /book. */
const STEPS = [
  { key: 'services', label: 'Services' },
  { key: 'time', label: 'Time' },
  { key: 'details', label: 'Details' },
  { key: 'review', label: 'Review' },
] as const

type StepKey = (typeof STEPS)[number]['key']

function toStep(value: string | string[] | undefined): StepKey {
  const candidate = Array.isArray(value) ? value[0] : value
  return STEPS.find((step) => step.key === candidate)?.key ?? 'services'
}

/** P-03 Booking wizard, steps 2–5 at `/book/[slug]?step=…&service=…` (D68). */
export default async function BookShopPage({ params, searchParams }: PageProps<'/book/[slug]'>) {
  const { slug } = await params
  const step = toStep((await searchParams).step)
  const current = STEPS.findIndex((candidate) => candidate.key === step)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <ScreenPlaceholder
        screenId="P-03"
        title="Book a service"
        description="Choose services, pick a free time, add your details and confirm."
      >
        <p className="text-sm text-muted-foreground">
          Shop: <span className="font-mono text-foreground">{slug}</span>
        </p>
        <nav aria-label="Booking steps">
          <ol className="flex flex-wrap gap-2 text-sm">
            <li className="rounded-full border px-3 py-1 text-muted-foreground">1. Shop</li>
            {STEPS.map((item, index) => (
              <li
                key={item.key}
                aria-current={index === current ? 'step' : undefined}
                className={cn(
                  'rounded-full border px-3 py-1',
                  index === current
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {index + 2}. {item.label}
              </li>
            ))}
          </ol>
        </nav>
      </ScreenPlaceholder>
    </div>
  )
}
