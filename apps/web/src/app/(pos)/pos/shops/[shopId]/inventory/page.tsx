import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Inventory' }

/** PP-03 Inventory (spec 10). Access: PARTS_PERSON; OWNER (catalogue only). */
export default function InventoryPage() {
  return (
    <ScreenPlaceholder
      screenId="PP-03"
      title="Inventory"
      description="The parts catalogue with stock on hand, reserved, available and reorder levels."
      variant="pos"
    />
  )
}
