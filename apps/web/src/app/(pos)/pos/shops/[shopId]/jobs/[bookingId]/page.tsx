import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Job details' }

/** T-02 Job details (spec 10). Access: Assigned TECHNICIAN; OWNER read-only. */
export default async function TechnicianJobDetailPage({
  params,
}: PageProps<'/pos/shops/[shopId]/jobs/[bookingId]'>) {
  const { bookingId } = await params

  return (
    <ScreenPlaceholder
      screenId="T-02"
      title="Job details"
      description="Inspect the car, build the estimate, repair and send the job to quality check."
      variant="pos"
    >
      <p className="text-sm text-muted-foreground">
        Booking ID: <span className="font-mono text-foreground">{bookingId}</span>
      </p>
    </ScreenPlaceholder>
  )
}
