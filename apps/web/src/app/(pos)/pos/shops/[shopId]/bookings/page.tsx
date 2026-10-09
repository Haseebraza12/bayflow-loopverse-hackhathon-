'use client'

import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  Search,
  UserCheck,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getBookings, type MockBooking } from '@/lib/mock-data'

export default function ServiceAdvisorBookingsPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'

  const allBookings = useMockStore(() => getBookings(shopId))

  const [filterPreset, setFilterPreset] = useState<'needs_sa' | 'in_progress' | 'all'>('needs_sa')
  const [search, setSearch] = useState('')

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  // Next step prompt helper
  const getNextStep = (b: MockBooking) => {
    switch (b.status) {
      case 'PENDING':
        return { label: 'Confirm Intake', urgent: true }
      case 'CONFIRMED':
        return { label: 'Assign Technician', urgent: true }
      case 'ESTIMATE_REVIEW':
        return { label: 'Review & Send Estimate', urgent: true }
      case 'AWAITING_CUSTOMER':
        return { label: 'Awaiting Customer', urgent: false }
      case 'ESTIMATE_REJECTED':
        return { label: 'Handle Rejection', urgent: true }
      case 'ESTIMATE_APPROVED':
        return { label: 'Assign Parts Person', urgent: true }
      case 'READY_FOR_PICKUP':
        return { label: 'Notify & Handover', urgent: true }
      default:
        return null
    }
  }

  const filteredBookings = allBookings.filter((b) => {
    // Filter preset
    if (filterPreset === 'needs_sa') {
      const isNeeds = [
        'PENDING',
        'CONFIRMED',
        'ESTIMATE_REVIEW',
        'AWAITING_CUSTOMER',
        'ESTIMATE_REJECTED',
        'ESTIMATE_APPROVED',
        'READY_FOR_PICKUP',
      ].includes(b.status)
      if (!isNeeds) return false
    } else if (filterPreset === 'in_progress') {
      const isInProg = [
        'ASSIGNED',
        'INSPECTING',
        'PARTS_PENDING',
        'PARTS_ORDERED',
        'PARTS_READY',
        'IN_REPAIR',
        'QC_PENDING',
        'QC_IN_PROGRESS',
      ].includes(b.status)
      if (!isInProg) return false
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      const match =
        b.reference.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.licensePlate.toLowerCase().includes(q) ||
        b.vehicleModel.toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1047FA]">
            Service Advisor Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
            Bookings & Work Orders Queue
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Confirm customer intakes, assign technicians, review estimates, and coordinate pick-ups.
          </p>
        </div>

        <Button asChild className="bg-[#1047FA] text-white text-xs font-semibold h-9 rounded-lg">
          <Link href="/book">
            <Plus className="size-3.5 mr-1" />
            New Walk-in Booking
          </Link>
        </Button>
      </div>

      {/* Preset Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterPreset('needs_sa')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              filterPreset === 'needs_sa'
                ? 'bg-[#1047FA] text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-blue-300'
            }`}
          >
            Needs SA Action
          </button>

          <button
            type="button"
            onClick={() => setFilterPreset('in_progress')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              filterPreset === 'in_progress'
                ? 'bg-[#1047FA] text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-blue-300'
            }`}
          >
            Workshop in Progress
          </button>

          <button
            type="button"
            onClick={() => setFilterPreset('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              filterPreset === 'all'
                ? 'bg-[#1047FA] text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-blue-300'
            }`}
          >
            All Bookings ({allBookings.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 size-4 text-neutral-400" />
          <Input
            placeholder="Search ref, plate, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-white"
          />
        </div>
      </div>

      {/* Bookings Queue Table */}
      <Card className="border-neutral-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <CalendarCheck className="mx-auto size-10 text-neutral-300" />
              <p className="text-sm font-bold text-neutral-900">All caught up!</p>
              <p className="text-xs text-neutral-500">
                No bookings match your current filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-[11px] font-bold uppercase text-neutral-400 border-b border-neutral-200">
                  <tr>
                    <th className="px-5 py-3">Reference / Slot</th>
                    <th className="px-4 py-3">Customer & Vehicle</th>
                    <th className="px-4 py-3">Services</th>
                    <th className="px-4 py-3">Live Status</th>
                    <th className="px-4 py-3">Assigned Staff</th>
                    <th className="px-4 py-3">Action Needed</th>
                    <th className="px-5 py-3 text-right">Open</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filteredBookings.map((b) => {
                    const nextStep = getNextStep(b)

                    return (
                      <tr key={b.id} className="hover:bg-neutral-50/70">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <Link
                            href={`${base}/bookings/${b.id}`}
                            className="font-mono font-bold text-[#1047FA] hover:underline"
                          >
                            {b.reference}
                          </Link>
                          <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-0.5">
                            <Clock className="size-3" />
                            <span>{b.scheduledTime} ({b.scheduledDate})</span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="font-bold text-neutral-900">{b.customerName}</p>
                          <p className="font-mono text-[11px] text-neutral-600">
                            {b.licensePlate} • {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                          </p>
                        </td>

                        <td className="px-4 py-3.5 max-w-xs">
                          <div className="truncate text-neutral-800 font-medium">
                            {b.services.join(', ')}
                          </div>
                          <span className="text-[11px] text-neutral-400">
                            Est: {formatPKR(b.estimateTotal)}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <StatusBadge status={b.status} audience="staff" size="sm" />
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {b.assignedTechnicianName ? (
                            <span className="flex items-center gap-1 text-neutral-800 font-medium">
                              <Wrench className="size-3 text-neutral-400" />
                              {b.assignedTechnicianName}
                            </span>
                          ) : (
                            <span className="text-neutral-400 italic">Unassigned</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {nextStep ? (
                            <span
                              className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                                nextStep.urgent
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {nextStep.label}
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">In progress</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs font-semibold border-neutral-200"
                          >
                            <Link href={`${base}/bookings/${b.id}`}>
                              Manage
                              <ChevronRight className="size-3 ml-1" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
