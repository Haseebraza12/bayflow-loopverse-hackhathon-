'use client'

import {
  Boxes,
  CalendarCheck,
  ClipboardCheck,
  LayoutDashboard,
  PackageSearch,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
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

  useEffect(() => {
    if (user?.role) {
      let target = 'overview'
      if (user.role === 'SERVICE_ADVISOR') target = 'bookings'
      else if (user.role === 'TECHNICIAN') target = 'jobs'
      else if (user.role === 'PARTS_PERSON') target = 'parts'
      else if (user.role === 'QC_INSPECTOR') target = 'qc'

      router.replace(`/pos/shops/${shopId}/${target}`)
    }
  }, [user, shopId, router])

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  return (
    <div className="py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Role Workspaces</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Select a role workspace to launch your workshop tools:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLE_HOMES.map((home) => (
          <Link key={home.segment} href={`${base}/${home.segment}`}>
            <Card className="border-neutral-200 hover:border-[#1047FA] transition-all cursor-pointer shadow-sm hover:shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1047FA]">
                  <home.icon className="size-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    {home.role}
                  </span>
                  <h2 className="text-sm font-bold text-neutral-900">{home.label}</h2>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
