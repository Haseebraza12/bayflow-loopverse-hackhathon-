'use client'

import { Building2, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockStore, useMockStoreReady } from '@/hooks/use-mock-store'
import { getCurrentUser, getShops } from '@/lib/mock-data'

export default function PosHubPage() {
  const router = useRouter()
  const user = useMockStore(() => getCurrentUser())
  const shops = useMockStore(() => getShops())
  const storeReady = useMockStoreReady()

  useEffect(() => {
    // If user has an active shop, redirect immediately to their role home
    if (storeReady && user?.shopId) {
      let targetSegment = 'overview'
      if (user.role === 'SERVICE_ADVISOR') targetSegment = 'bookings'
      else if (user.role === 'TECHNICIAN') targetSegment = 'jobs'
      else if (user.role === 'PARTS_PERSON') targetSegment = 'parts'
      else if (user.role === 'QC_INSPECTOR') targetSegment = 'qc'

      router.replace(`/pos/shops/${user.shopId}/${targetSegment}`)
    }
  }, [storeReady, user, router])

  return (
    <main id="main" tabIndex={-1} className="flex-1 px-4 py-12 outline-none sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Workshop Hub</h1>
            <p className="mt-1 text-xs text-helper">Select a shop or create a new branch</p>
          </div>
          <Button asChild className="rounded-full bg-brand-blue text-xs text-white">
            <Link href="/pos/shops/new">
              <Plus className="mr-1 size-3.5" />
              New Workshop
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {shops.map((shop) => (
            <Card
              key={shop.id}
              className="cursor-pointer border-border transition-all hover:border-brand-blue"
              onClick={() => router.push(`/pos/shops/${shop.id}/overview`)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-brand-blue-ink dark:border-blue-900/50 dark:bg-blue-950/40">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">{shop.name}</h2>
                    <p className="text-xs text-helper">
                      {shop.address}, {shop.city}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-subtle-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
