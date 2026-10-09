import type { Metadata } from 'next'
import Link from 'next/link'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'My bookings' }

/** C-01 My bookings (spec 10). Data: E-11 `GET /api/v1/me/bookings` (live). */
export default function MyBookingsPage() {
  return (
    <ScreenPlaceholder
      screenId="C-01"
      title="My bookings"
      description="Your active and past bookings, with anything that needs your action first."
      actions={
        <Button asChild variant="cta">
          <Link href="/">Book a service</Link>
        </Button>
      }
    />
  )
}
