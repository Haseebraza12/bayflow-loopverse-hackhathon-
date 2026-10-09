import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Team' }

/** O-02 Team (spec 10). Access: OWNER (team.manage). */
export default function TeamPage() {
  return (
    <ScreenPlaceholder
      screenId="O-02"
      title="Team"
      description="Add team members with a role, change roles, and deactivate or reactivate them."
      variant="pos"
    />
  )
}
