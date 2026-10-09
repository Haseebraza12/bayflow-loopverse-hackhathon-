'use client'

import { PackageCheck, PackageSearch, Truck } from 'lucide-react'
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
            Parts Department
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            Jobs Awaiting Parts & Allocation
          </h1>
          <p className="mt-0.5 text-xs text-helper">
            Cross-check estimate requirements against warehouse inventory and release kits to
            technicians.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-full text-xs font-semibold">
            <Link href={`${base}/purchase-orders`}>Purchase Orders</Link>
          </Button>
          <Button asChild className="rounded-full bg-brand-blue text-xs font-semibold text-white">
            <Link href={`${base}/inventory`}>Inventory Stock</Link>
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* 1. To Check (PARTS_PENDING) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <PackageSearch className="size-4 text-amber-500 dark:text-amber-400" />
              To Check Against Warehouse Stock ({partsPending.length})
            </h2>
            <span className="text-xs text-subtle-foreground">Newly approved by customer</span>
          </div>

          {partsPending.length === 0 ? (
            <p className="text-xs text-subtle-foreground italic">
              No new jobs awaiting stock verification.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {partsPending.map((b) => (
                <Card
                  key={b.id}
                  className="border-border bg-card hover:border-blue-400 dark:hover:border-blue-600"
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-brand-blue-ink">
                        {b.reference}
                      </span>
                      <StatusBadge status={b.status} audience="staff" size="sm" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">
                        {b.licensePlate}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                      </p>
                    </div>
                    <div className="text-xs text-helper">
                      Tech:{' '}
                      <span className="font-medium text-foreground">
                        {b.assignedTechnicianName || 'Imran'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border-faint pt-2">
                      <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        Requires Parts Check
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="h-7 rounded-full bg-brand-blue text-xs text-white"
                      >
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
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Truck className="size-4 text-blue-500 dark:text-blue-400" />
              Parts on Supplier Order ({partsOrdered.length})
            </h2>
          </div>

          {partsOrdered.length === 0 ? (
            <p className="text-xs text-subtle-foreground italic">
              No supplier purchase orders currently pending delivery.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {partsOrdered.map((b) => (
                <Card
                  key={b.id}
                  className="border-border bg-card hover:border-blue-400 dark:hover:border-blue-600"
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-brand-blue-ink">
                        {b.reference}
                      </span>
                      <StatusBadge status={b.status} audience="staff" size="sm" />
                    </div>
                    <p className="font-mono text-sm font-bold text-foreground">{b.licensePlate}</p>
                    <div className="flex items-center justify-between border-t border-border-faint pt-2">
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        Awaiting supplier shipment
                      </span>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full text-xs"
                      >
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
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <PackageCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              All Parts in Stock — Ready to Allocate ({partsReady.length})
            </h2>
          </div>

          {partsReady.length === 0 ? (
            <p className="text-xs text-subtle-foreground italic">
              No jobs currently staged in parts holding bin.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {partsReady.map((b) => (
                <Card
                  key={b.id}
                  className="border-emerald-200 bg-emerald-50/20 dark:border-emerald-800/60 dark:bg-emerald-950/30"
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-brand-blue-ink">
                        {b.reference}
                      </span>
                      <StatusBadge status={b.status} audience="staff" size="sm" />
                    </div>
                    <p className="font-mono text-sm font-bold text-foreground">{b.licensePlate}</p>
                    <div className="flex items-center justify-between border-t border-border-faint pt-2">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        Parts Kit Prepared
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="h-7 rounded-full bg-emerald-600 text-xs text-white"
                      >
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
