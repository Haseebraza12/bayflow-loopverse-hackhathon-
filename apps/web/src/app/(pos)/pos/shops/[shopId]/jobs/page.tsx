'use client'

import { CheckCircle2, ChevronRight, Play, ScanSearch, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getBookings, saveBooking, type MockBooking } from '@/lib/mock-data'

export default function TechnicianJobsPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'

  const allBookings = useMockStore(() => getBookings(shopId))
  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  // Group technician jobs by stage
  const toInspect = allBookings.filter((b) => b.status === 'ASSIGNED')
  const inInspection = allBookings.filter((b) => b.status === 'INSPECTING')
  const inRepair = allBookings.filter((b) => b.status === 'IN_REPAIR')
  const completedJobs = allBookings.filter(
    (b) => b.status === 'READY_FOR_PICKUP' || b.status === 'COMPLETED',
  )

  const handleStartInspection = (booking: MockBooking) => {
    const updated: MockBooking = {
      ...booking,
      status: 'INSPECTING',
    }
    saveBooking(updated)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
          Technician Bay Floor
        </span>
        <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
          Assigned Workshop Jobs
        </h1>
        <p className="mt-0.5 text-xs text-helper">
          Execute physical vehicle inspections, prepare itemized estimates, and perform repair
          tasks.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Section 1: To Inspect (ASSIGNED) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <ScanSearch className="size-4 text-brand-blue-ink" />
              Awaiting Physical Inspection ({toInspect.length})
            </h2>
            <span className="text-xs text-subtle-foreground">Arrived at bay hoist</span>
          </div>

          {toInspect.length === 0 ? (
            <p className="text-xs text-subtle-foreground italic">
              No vehicles currently waiting for inspection.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {toInspect.map((b) => (
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
                    <div className="flex flex-wrap gap-1 text-xs text-helper">
                      {b.services.map((s, idx) => (
                        <span key={idx} className="rounded bg-secondary px-1.5 py-0.5 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-border-faint pt-2">
                      <span className="text-[11px] text-subtle-foreground">
                        Slot: {b.scheduledTime} ({b.scheduledDate})
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStartInspection(b)}
                          className="h-7 bg-brand-blue text-xs font-bold text-white hover:bg-blue-700"
                        >
                          <Play className="mr-1 size-3" />
                          Start Inspection
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-7 rounded-full text-xs"
                        >
                          <Link href={`${base}/jobs/${b.id}`}>Open</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Inspecting & In Repair */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Wrench className="size-4 text-brand-blue-ink" />
              Active Bay Diagnostics & Repairs ({inInspection.length + inRepair.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...inInspection, ...inRepair].map((b) => (
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
                    <p className="font-mono text-sm font-bold text-foreground">{b.licensePlate}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                    </p>
                  </div>
                  <div className="text-xs text-helper">
                    Services:{' '}
                    <span className="font-medium text-foreground">{b.services.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border-faint pt-2">
                    <span className="text-xs font-bold text-foreground">
                      Estimate: {formatPKR(b.estimateTotal)}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="h-7 rounded-full bg-brand-blue text-xs text-white"
                    >
                      <Link href={`${base}/jobs/${b.id}`}>
                        Manage Job
                        <ChevronRight className="ml-1 size-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 3: Completed / Handed Over */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              Passed QC & Completed Jobs ({completedJobs.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {completedJobs.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="space-y-1 rounded-xl border border-border bg-card p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">{b.reference}</span>
                  <StatusBadge status={b.status} audience="staff" size="sm" />
                </div>
                <p className="font-mono text-helper">{b.licensePlate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
