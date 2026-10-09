import type { Metadata } from 'next'
import Link from 'next/link'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Shop home' }

/** Role homes (spec 09 §2.8, spec 10 S-04). */
const ROLE_HOMES = [
  { role: 'Owner', segment: 'overview', label: 'Shop overview' },
  { role: 'Service Advisor', segment: 'bookings', label: 'Bookings' },
  { role: 'Technician', segment: 'jobs', label: 'My jobs' },
  { role: 'Parts Person', segment: 'parts', label: 'Parts queue' },
  { role: 'QC Inspector', segment: 'qc', label: 'QC queue' },
] as const

/**
 * S-04 Role-home redirect (spec 10). TODO(ShopScope): redirect to the membership role's home
 * once `GET /api/v1/me` is wired; until then, link to every role home.
 */
export default async function ShopHomePage({ params }: PageProps<'/pos/shops/[shopId]'>) {
  const { shopId } = await params
  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  return (
    <ScreenPlaceholder
      screenId="S-04"
      title="Shop home"
      description="Each role starts on its own home screen in this shop."
      variant="pos"
    >
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {ROLE_HOMES.map((home) => (
          <li key={home.segment}>
            <Link
              href={`${base}/${home.segment}`}
              className="block rounded-lg border bg-background px-4 py-3 hover:bg-accent"
            >
              <span className="block text-xs font-medium text-muted-foreground">{home.role}</span>
              <span className="font-medium">{home.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </ScreenPlaceholder>
  )
}
