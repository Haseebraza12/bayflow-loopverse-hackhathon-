'use client'

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  Play,
  ScanSearch,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  const awaitingParts = allBookings.filter(
    (b) => b.status === 'PARTS_PENDING' || b.status === 'PARTS_ORDERED' || b.status === 'PARTS_READY'
  )
  const completedJobs = allBookings.filter(
    (b) => b.status === 'READY_FOR_PICKUP' || b.status === 'COMPLETED'
  )

  const handleStartInspection = (booking: MockBooking) => {
    const updated: MockBooking = {
      ...booking,
      status: 'INSPECTING',
    }
    saveBooking(updated)
  }

  const handleStartRepair = (booking: MockBooking) => {
    const updated: MockBooking = {
      ...booking,
      status: 'IN_REPAIR',
    }
    saveBooking(updated)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#1047FA]">
          Technician Bay Floor
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
          Assigned Workshop Jobs
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Execute physical vehicle inspections, prepare itemized estimates, and perform repair tasks.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Section 1: To Inspect (ASSIGNED) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <ScanSearch className="size-4 text-[#1047FA]" />
              Awaiting Physical Inspection ({toInspect.length})
            </h2>
            <span className="text-xs text-neutral-400">Arrived at bay hoist</span>
          </div>

          {toInspect.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No vehicles currently waiting for inspection.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toInspect.map((b) => (
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
                    <div className="text-xs text-neutral-500 flex flex-wrap gap-1">
                      {b.services.map((s, idx) => (
                        <span key={idx} className="rounded bg-neutral-100 px-1.5 py-0.5 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">
                        Slot: {b.scheduledTime} ({b.scheduledDate})
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStartInspection(b)}
                          className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs h-7"
                        >
                          <Play className="size-3 mr-1" />
                          Start Inspection
                        </Button>
                        <Button asChild variant="outline" size="sm" className="h-7 text-xs">
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
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Wrench className="size-4 text-[#1047FA]" />
              Active Bay Diagnostics & Repairs ({inInspection.length + inRepair.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...inInspection, ...inRepair].map((b) => (
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
                    Services: <span className="font-medium text-neutral-800">{b.services.join(', ')}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">
                      Estimate: {formatPKR(b.estimateTotal)}
                    </span>
                    <Button asChild size="sm" className="bg-[#1047FA] text-white text-xs h-7">
                      <Link href={`${base}/jobs/${b.id}`}>
                        Manage Job
                        <ChevronRight className="size-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 3: Completed / Handed Over */}
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              Passed QC & Completed Jobs ({completedJobs.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {completedJobs.slice(0, 3).map((b) => (
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
