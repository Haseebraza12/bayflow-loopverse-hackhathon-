import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Bookings' }

/** SA-01 Bookings (spec 10). Access: SERVICE_ADVISOR, OWNER. */
export default function ShopBookingsPage() {
  return (
    <ScreenPlaceholder
      screenId="SA-01"
      title="Bookings"
      description="Every booking of the shop with status filters and the next step for the service advisor."
      variant="pos"
    />
  )
}
