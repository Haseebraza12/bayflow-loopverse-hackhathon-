'use client'

import {
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
} from 'lucide-react'
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
    (b) => b.status === 'READY_FOR_PICKUP' || b.status === 'COMPLETED'
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
        <span className="text-xs font-bold tracking-[0.32px] text-[#1047FA]">
          Quality Assurance & Safety
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mt-1">
          QC Inspection Queue
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Independent 5-point safety and road-test verification before customer handover. First inspector to pick locks the job.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Waiting (QC_PENDING) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <ClipboardCheck className="size-4 text-amber-500" />
              Waiting for Inspection ({qcPending.length})
            </h2>
            <span className="text-xs text-neutral-400">Repairs completed by technician</span>
          </div>

          {qcPending.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No vehicles currently waiting in QC staging area.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qcPending.map((b) => (
                <Card key={b.id} className="border-neutral-200 bg-white hover:border-blue-400">
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
                      Repaired by: <strong className="text-neutral-800">{b.assignedTechnicianName || 'Imran'}</strong>
                    </div>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                        Ready for QC Hoist & Road Test
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePickJob(b)}
                          className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs h-7"
                        >
                          Pick Job
                        </Button>
                        <Button asChild variant="outline" size="sm" className="h-7 text-xs rounded-full">
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
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#1047FA]" />
              Inspection in Progress ({qcInProgress.length})
            </h2>
          </div>

          {qcInProgress.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No inspections currently in progress.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qcInProgress.map((b) => (
                <Card key={b.id} className="border-blue-200 bg-blue-50/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#1047FA] text-sm">{b.reference}</span>
                      <StatusBadge status={b.status} audience="staff" size="sm" />
                    </div>
                    <p className="font-bold text-neutral-900 font-mono text-sm">{b.licensePlate}</p>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-700">Inspector testing checklist</span>
                      <Button asChild size="sm" className="bg-[#1047FA] text-white text-xs h-7 rounded-full">
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
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600" />
            Verified & Certified ({passedQc.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {passedQc.slice(0, 3).map((b) => (
              <div key={b.id} className="p-3 rounded-xl border border-neutral-200 bg-white text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-neutral-900">{b.reference}</span>
                  <StatusBadge status={b.status} audience="staff" size="sm" />
                </div>
                <p className="text-neutral-500 font-mono">{b.licensePlate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
