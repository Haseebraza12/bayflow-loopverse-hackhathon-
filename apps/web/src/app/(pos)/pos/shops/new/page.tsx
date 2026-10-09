import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Create a new shop' }

/** S-03 Create shop / first-run onboarding (spec 10; D17: any logged-in user may create a shop). */
export default function CreateShopPage() {
  return (
    <main id="main" tabIndex={-1} className="flex-1 outline-none">
      <div className="mx-auto w-full max-w-2xl p-4 sm:p-6 lg:p-8">
        <ScreenPlaceholder
          screenId="S-03"
          title="Create a new shop"
          description="Each shop has its own team, services, slots and inventory."
          variant="pos"
        />
      </div>
    </main>
  )
}
