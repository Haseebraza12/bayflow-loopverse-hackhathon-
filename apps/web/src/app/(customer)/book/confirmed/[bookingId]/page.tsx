import type { Metadata } from 'next'

import { BookingConfirmation } from '@/components/booking/booking-confirmation'
import { INITIAL_BOOKINGS } from '@/lib/mock-data'

type Props = PageProps<'/book/confirmed/[bookingId]'>

/** UX rule R3: the reference in the title, for every booking the server knows (the seeds). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookingId } = await params
  const booking = INITIAL_BOOKINGS.find((candidate) => candidate.id === bookingId)
  return { title: booking ? `${booking.reference} · Booking received` : 'Booking received' }
}

/**
 * `/book/confirmed/<bookingId>?new_account=1`: C-03, the wizard's success page (spec 10). The
 * server page reads the params; the client view finds the booking in this browser's store.
 */
export default async function BookingConfirmedPage({ params, searchParams }: Props) {
  const [{ bookingId }, query] = await Promise.all([params, searchParams])
  return <BookingConfirmation bookingId={bookingId} newAccount={query.new_account === '1'} />
}
