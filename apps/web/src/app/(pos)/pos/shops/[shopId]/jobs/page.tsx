import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'My jobs' }

/** T-01 My jobs (spec 10). Access: TECHNICIAN; OWNER read-only. */
export default function TechnicianJobsPage() {
  return (
    <ScreenPlaceholder
      screenId="T-01"
      title="My jobs"
      description="Jobs assigned to you, with the work that needs you first."
      variant="pos"
    />
  )
}
