import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Purchase order' }

/** PP-05 Purchase order (spec 10). Access: PARTS_PERSON; OWNER read-only. */
export default async function PurchaseOrderDetailPage({
  params,
}: PageProps<'/pos/shops/[shopId]/purchase-orders/[poId]'>) {
  const { poId } = await params

  return (
    <ScreenPlaceholder
      screenId="PP-05"
      title="Purchase order"
      description="Ordered and received quantities, and receiving stock into inventory."
      variant="pos"
    >
      <p className="text-sm text-muted-foreground">
        Purchase order ID: <span className="font-mono text-foreground">{poId}</span>
      </p>
    </ScreenPlaceholder>
  )
}
