import type { Metadata } from 'next'
import Link from 'next/link'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Shop' }

/** P-02 Shop detail (spec 10). Data: E-08 `GET /api/v1/public/shops/{shop_slug}` (D68). */
export default async function ShopDetailPage({ params }: PageProps<'/shops/[slug]'>) {
  const { slug } = await params

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <ScreenPlaceholder
        screenId="P-02"
        title="Shop details"
        description="Services, prices, opening hours and contact details for one shop."
        actions={
          <Button asChild variant="cta">
            <Link href={`/book/${encodeURIComponent(slug)}`}>Book a service</Link>
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          Shop: <span className="font-mono text-foreground">{slug}</span>
        </p>
      </ScreenPlaceholder>
    </div>
  )
}
