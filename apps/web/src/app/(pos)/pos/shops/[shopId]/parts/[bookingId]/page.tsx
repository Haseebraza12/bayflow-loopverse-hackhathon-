import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Parts job' }

/** PP-02 Parts job (spec 10). Access: Assigned PARTS_PERSON; OWNER read-only. */
export default async function PartsJobPage({
  params,
}: PageProps<'/pos/shops/[shopId]/parts/[bookingId]'>) {
  const { bookingId } = await params

  return (
    <ScreenPlaceholder
      screenId="PP-02"
      title="Parts job"
      description="Required parts compared with stock: order missing parts, mark ready or allocate."
      variant="pos"
    >
      <p className="text-sm text-muted-foreground">
        Booking ID: <span className="font-mono text-foreground">{bookingId}</span>
      </p>
    </ScreenPlaceholder>
  )
}
