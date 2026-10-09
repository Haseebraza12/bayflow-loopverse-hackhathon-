import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Shop settings' }

/** O-04 Shop settings (spec 10). Access: OWNER (shop.manage). */
export default function ShopSettingsPage() {
  return (
    <ScreenPlaceholder
      screenId="O-04"
      title="Shop settings"
      description="Shop profile, directory listing, slot length and capacity, and working hours."
      variant="pos"
    />
  )
}
