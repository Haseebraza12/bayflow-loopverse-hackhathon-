import type { Metadata } from 'next'
import Link from 'next/link'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Booking received' }

const NEXT_STEPS = [
  'The shop confirms your booking',
  'A technician inspects your car',
  'You approve the estimate online',
  'Repair and quality check',
  'Pick up your car',
] as const

/** C-03 Booking confirmed — the wizard's success step (spec 10). Data: E-12. */
export default async function BookingConfirmedPage({
  params,
}: PageProps<'/book/confirmed/[bookingId]'>) {
  const { bookingId } = await params
  const trackHref = `/bookings/${encodeURIComponent(bookingId)}`

  return (
    <ScreenPlaceholder
      screenId="C-03"
      title="Booking received"
      description="Your booking reference and what happens next."
      actions={
        <>
          <Button asChild variant="cta">
            <Link href={trackHref}>Track this booking</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/bookings">Go to my bookings</Link>
          </Button>
        </>
      }
    >
      <section aria-labelledby="what-next" className="space-y-3">
        <h2 id="what-next" className="text-xl font-semibold">
          What happens next
        </h2>
        <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
          {NEXT_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </ScreenPlaceholder>
  )
}
