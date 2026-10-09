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
    <main id="main" tabIndex={-1} className="flex-1 outline-none py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Your Workshop Hub</h1>
            <p className="text-xs text-neutral-500 mt-1">Select a shop or create a new branch</p>
          </div>
          <Button asChild className="bg-[#1047FA] text-white text-xs">
            <Link href="/pos/shops/new">
              <Plus className="size-3.5 mr-1" />
              New Workshop
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {shops.map((shop) => (
            <Card
              key={shop.id}
              className="border-neutral-200 hover:border-[#1047FA] transition-all cursor-pointer shadow-sm"
              onClick={() => router.push(`/pos/shops/${shop.id}/overview`)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1047FA]">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900">{shop.name}</h2>
                    <p className="text-xs text-neutral-500">{shop.address}, {shop.city}</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-neutral-400" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
