import type { Metadata } from 'next'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Book a service' }

/** P-03 Booking wizard, step 1 "Shop" (spec 10 W1; D68: steps 2–5 live at /book/[slug]). */
export default function BookChooseShopPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <ScreenPlaceholder
        screenId="P-03"
        title="Book a service"
        description="Step 1 of 5 — choose the shop you want to book with."
      />
    </div>
  )
}
