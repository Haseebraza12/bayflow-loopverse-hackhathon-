import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Services' }

/** O-03 Services (spec 10). Access: OWNER (services.manage). */
export default function ServicesPage() {
  return (
    <ScreenPlaceholder
      screenId="O-03"
      title="Services"
      description="The service catalogue customers book from: name, duration and optional base price."
      variant="pos"
    />
  )
}
