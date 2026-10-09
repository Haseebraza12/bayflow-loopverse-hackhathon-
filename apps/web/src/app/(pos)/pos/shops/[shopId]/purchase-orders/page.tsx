import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Purchase orders' }

/** PP-04 Purchase orders (spec 10). Access: PARTS_PERSON; OWNER read-only. */
export default function PurchaseOrdersPage() {
  return (
    <ScreenPlaceholder
      screenId="PP-04"
      title="Purchase orders"
      description="Orders to suppliers and their status: ordered, partially received or received."
      variant="pos"
    />
  )
}
