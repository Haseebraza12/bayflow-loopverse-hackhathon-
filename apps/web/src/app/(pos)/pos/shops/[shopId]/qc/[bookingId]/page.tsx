import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Inspection' }

/** QI-02 Inspection (spec 10). Access: QC_INSPECTOR; OWNER read-only. */
export default async function QcInspectionPage({
  params,
}: PageProps<'/pos/shops/[shopId]/qc/[bookingId]'>) {
  const { bookingId } = await params

  return (
    <ScreenPlaceholder
      screenId="QI-02"
      title="Inspection"
      description="The quality-check checklist: pass the job or raise an issue for the technician."
      variant="pos"
    >
      <p className="text-sm text-muted-foreground">
        Booking ID: <span className="font-mono text-foreground">{bookingId}</span>
      </p>
    </ScreenPlaceholder>
  )
}
