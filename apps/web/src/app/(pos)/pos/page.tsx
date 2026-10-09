import type { Metadata } from 'next'
import Link from 'next/link'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Shop POS' }

/**
 * S-02 POS hub (spec 10). TODO(auth): client redirect from `me.memberships` — 0 → /pos/shops/new,
 * 1 → that shop, several → `bf:lastShopId`, else the first OWNER membership (spec 09 §2.8).
 */
export default function PosHubPage() {
  return (
    <main id="main" tabIndex={-1} className="flex-1 outline-none">
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <ScreenPlaceholder
          screenId="S-02"
          title="Shop POS"
          description="Opens your shop: the one you used last, or your first shop."
          variant="pos"
          actions={
            <Button asChild>
              <Link href="/pos/shops/new">Create a new shop</Link>
            </Button>
          }
        />
      </div>
    </main>
  )
}
