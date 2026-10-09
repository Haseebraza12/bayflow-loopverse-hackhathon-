'use client'

import { CalendarCheck, ClipboardCheck, LayoutDashboard, PackageSearch, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { useMockStore, useMockStoreReady } from '@/hooks/use-mock-store'
import { getCurrentUser } from '@/lib/mock-data'

const ROLE_HOMES = [
  { role: 'Owner', segment: 'overview', label: 'Shop Overview', icon: LayoutDashboard },
  { role: 'Service Advisor', segment: 'bookings', label: 'Bookings List', icon: CalendarCheck },
  { role: 'Technician', segment: 'jobs', label: 'Assigned Jobs', icon: Wrench },
  { role: 'Parts Person', segment: 'parts', label: 'Parts Queue', icon: PackageSearch },
  { role: 'QC Inspector', segment: 'qc', label: 'QC Inspection Queue', icon: ClipboardCheck },
]

export default function ShopHomePage() {
  const router = useRouter()
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'
  const user = useMockStore(() => getCurrentUser())
  const storeReady = useMockStoreReady()

  useEffect(() => {
    if (storeReady && user?.role) {
      let target = 'overview'
      if (user.role === 'SERVICE_ADVISOR') target = 'bookings'
      else if (user.role === 'TECHNICIAN') target = 'jobs'
      else if (user.role === 'PARTS_PERSON') target = 'parts'
      else if (user.role === 'QC_INSPECTOR') target = 'qc'

      router.replace(`/pos/shops/${shopId}/${target}`)
    }
  }, [storeReady, user, shopId, router])

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  return (
    <div className="space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Role Workspaces</h1>
        <p className="mt-1 text-xs text-helper">
          Select a role workspace to launch your workshop tools:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLE_HOMES.map((home) => (
          <Link key={home.segment} href={`${base}/${home.segment}`}>
            <Card className="cursor-pointer border-border transition-all hover:border-brand-blue hover:shadow">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-brand-blue-ink dark:border-blue-900/50 dark:bg-blue-950/40">
                  <home.icon className="size-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-[0.32px] text-subtle-foreground">
                    {home.role}
                  </span>
                  <h2 className="text-sm font-bold text-foreground">{home.label}</h2>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
