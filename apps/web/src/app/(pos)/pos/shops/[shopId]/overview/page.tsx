import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Shop overview' }

/** O-01 Shop overview (spec 10). Access: OWNER. */
export default function ShopOverviewPage() {
  return (
    <ScreenPlaceholder
      screenId="O-01"
      title="Shop overview"
      description="Bookings by status, today’s work, the team and the inventory summary at a glance."
      variant="pos"
    />
  )
}
