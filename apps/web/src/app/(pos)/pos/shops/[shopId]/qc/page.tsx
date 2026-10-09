import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'QC queue' }

/** QI-01 QC queue (spec 10). Access: QC_INSPECTOR; OWNER read-only. */
export default function QcQueuePage() {
  return (
    <ScreenPlaceholder
      screenId="QI-01"
      title="QC queue"
      description="Cars waiting for a quality check. The first inspector to pick a job gets it."
      variant="pos"
    />
  )
}
