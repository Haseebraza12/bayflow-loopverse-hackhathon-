import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Parts queue' }

/** PP-01 Parts queue (spec 10). Access: PARTS_PERSON; OWNER read-only. */
export default function PartsQueuePage() {
  return (
    <ScreenPlaceholder
      screenId="PP-01"
      title="Parts queue"
      description="Jobs waiting for parts: to check, on order and ready to allocate."
      variant="pos"
    />
  )
}
