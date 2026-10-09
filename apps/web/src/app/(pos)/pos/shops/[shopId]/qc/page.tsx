'use client'

import { CheckCircle2, ClipboardCheck, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
import { getBookings, saveBooking, type MockBooking } from '@/lib/mock-data'

export default function QcQueuePage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'

  const allBookings = useMockStore(() => getBookings(shopId))
  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  const qcPending = allBookings.filter((b) => b.status === 'QC_PENDING')
  const qcInProgress = allBookings.filter((b) => b.status === 'QC_IN_PROGRESS')
  const passedQc = allBookings.filter(
    (b) => b.status === 'READY_FOR_PICKUP' || b.status === 'COMPLETED',
  )

  const handlePickJob = (booking: MockBooking) => {
    const updated: MockBooking = {
      ...booking,
      status: 'QC_IN_PROGRESS',
      qcInspectorId: 'usr-sara',
    }
    saveBooking(updated)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
          Quality Assurance & Safety
        </span>
        <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
          QC Inspection Queue
        </h1>
        <p className="mt-0.5 text-xs text-helper">
          Independent 5-point safety and road-test verification before customer handover. First
          inspector to pick locks the job.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Waiting (QC_PENDING) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <ClipboardCheck className="size-4 text-amber-500 dark:text-amber-400" />
              Waiting for Inspection ({qcPending.length})
            </h2>
            <span className="text-xs text-subtle-foreground">Repairs completed by technician</span>
          </div>

          {qcPending.length === 0 ? (
            <p className="text-xs text-subtle-foreground italic">
              No vehicles currently waiting in QC staging area.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {qcPending.map((b) => (
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
                      Repaired by:{' '}
                      <strong className="text-foreground">
                        {b.assignedTechnicianName || 'Imran'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between border-t border-border-faint pt-2">
                      <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        Ready for QC Hoist & Road Test
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePickJob(b)}
                          className="h-7 bg-brand-blue text-xs font-bold text-white hover:bg-blue-700"
                        >
                          Pick Job
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-7 rounded-full text-xs"
                        >
                          <Link href={`${base}/qc/${b.id}`}>Inspect</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* In Progress (QC_IN_PROGRESS) */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <ShieldCheck className="size-4 text-brand-blue-ink" />
              Inspection in Progress ({qcInProgress.length})
            </h2>
          </div>

          {qcInProgress.length === 0 ? (
            <p className="text-xs text-subtle-foreground italic">
              No inspections currently in progress.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {qcInProgress.map((b) => (
                <Card
                  key={b.id}
                  className="border-blue-200 bg-blue-50/20 dark:border-blue-800/60 dark:bg-blue-950/30"
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
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                        Inspector testing checklist
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="h-7 rounded-full bg-brand-blue text-xs text-white"
                      >
                        <Link href={`${base}/qc/${b.id}`}>Continue Checklist</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recently Passed */}
        <div className="space-y-3 border-t border-border pt-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            Verified & Certified ({passedQc.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {passedQc.slice(0, 3).map((b) => (
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
