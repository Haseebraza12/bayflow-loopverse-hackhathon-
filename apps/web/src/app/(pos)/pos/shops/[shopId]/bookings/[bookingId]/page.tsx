import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Booking details' }

/** SA-02 Booking details (spec 10). Access: SERVICE_ADVISOR, OWNER. */
export default async function ShopBookingDetailPage({
  params,
}: PageProps<'/pos/shops/[shopId]/bookings/[bookingId]'>) {
  const { bookingId } = await params

  return (
    <ScreenPlaceholder
      screenId="SA-02"
      title="Booking details"
      description="Confirm, assign, review and send the estimate, notify the customer and close the booking."
      variant="pos"
    >
      <p className="text-sm text-muted-foreground">
        Booking ID: <span className="font-mono text-foreground">{bookingId}</span>
      </p>
    </ScreenPlaceholder>
  )
}
