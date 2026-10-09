import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Booking details' }

/** C-02 Booking detail, customer view (spec 10). Data: E-12 `GET /api/v1/me/bookings/{id}`. */
export default async function MyBookingDetailPage({ params }: PageProps<'/bookings/[bookingId]'>) {
  const { bookingId } = await params

  return (
    <ScreenPlaceholder
      screenId="C-02"
      title="Booking details"
      description="Live status, your estimate to approve or decline, and pick-up details."
    >
      <p className="text-sm text-muted-foreground">
        Booking ID: <span className="font-mono text-foreground">{bookingId}</span>
      </p>
    </ScreenPlaceholder>
  )
}
