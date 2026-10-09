'use client'

import {
  PackageCheck,
  PackageSearch,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
import { getBookings } from '@/lib/mock-data'

export default function PartsQueuePage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'

  const allBookings = useMockStore(() => getBookings(shopId))
  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  const partsPending = allBookings.filter((b) => b.status === 'PARTS_PENDING')
  const partsOrdered = allBookings.filter((b) => b.status === 'PARTS_ORDERED')
  const partsReady = allBookings.filter((b) => b.status === 'PARTS_READY')

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1047FA]">
            Parts Department
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
            Jobs Awaiting Parts & Allocation
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cross-check estimate requirements against warehouse inventory and release kits to technicians.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="text-xs font-semibold">
            <Link href={`${base}/purchase-orders`}>Purchase Orders</Link>
          </Button>
          <Button asChild className="bg-[#1047FA] text-white text-xs font-semibold">
            <Link href={`${base}/inventory`}>Inventory Stock</Link>
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* 1. To Check (PARTS_PENDING) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <PackageSearch className="size-4 text-amber-500" />
              To Check Against Warehouse Stock ({partsPending.length})
            </h2>
            <span className="text-xs text-neutral-400">Newly approved by customer</span>
          </div>

          {partsPending.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No new jobs awaiting stock verification.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partsPending.map((b) => (
                <Card key={b.id} className="border-neutral-200 bg-white shadow-sm hover:border-blue-400">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#1047FA] text-sm">{b.reference}</span>
                      <StatusBadge status={b.status} audience="staff" size="sm" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 font-mono text-sm">{b.licensePlate}</p>
                      <p className="text-xs text-neutral-600">
                        {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                      </p>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Tech: <span className="font-medium text-neutral-800">{b.assignedTechnicianName || 'Imran'}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Requires Parts Check
                      </span>
                      <Button asChild size="sm" className="bg-[#1047FA] text-white text-xs h-7">
                        <Link href={`${base}/parts/${b.id}`}>Check Stock</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 2. On Order (PARTS_ORDERED) */}
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Truck className="size-4 text-blue-500" />
              Parts on Supplier Order ({partsOrdered.length})
            </h2>
          </div>

          {partsOrdered.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No supplier purchase orders currently pending delivery.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partsOrdered.map((b) => (
                <Card key={b.id} className="border-neutral-200 bg-white shadow-sm hover:border-blue-400">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#1047FA] text-sm">{b.reference}</span>
                      <StatusBadge status={b.status} audience="staff" size="sm" />
                    </div>
                    <p className="font-bold text-neutral-900 font-mono text-sm">{b.licensePlate}</p>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs text-blue-700 font-medium">Awaiting supplier shipment</span>
                      <Button asChild size="sm" variant="outline" className="text-xs h-7">
                        <Link href={`${base}/parts/${b.id}`}>View PO</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 3. Ready to Allocate (PARTS_READY) */}
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <PackageCheck className="size-4 text-emerald-600" />
              All Parts in Stock — Ready to Allocate ({partsReady.length})
            </h2>
          </div>

          {partsReady.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No jobs currently staged in parts holding bin.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partsReady.map((b) => (
                <Card key={b.id} className="border-emerald-200 bg-emerald-50/20 shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#1047FA] text-sm">{b.reference}</span>
                      <StatusBadge status={b.status} audience="staff" size="sm" />
                    </div>
                    <p className="font-bold text-neutral-900 font-mono text-sm">{b.licensePlate}</p>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs text-emerald-700 font-bold">Parts Kit Prepared</span>
                      <Button asChild size="sm" className="bg-emerald-600 text-white text-xs h-7">
                        <Link href={`${base}/parts/${b.id}`}>Allocate to Bay</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
