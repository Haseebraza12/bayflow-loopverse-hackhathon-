'use client'

import { CalendarCheck, ChevronRight, Clock, Plus, Search, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/status-badge'
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
            Service Advisor Workspace
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            Bookings & Work Orders Queue
          </h1>
          <p className="mt-0.5 text-xs text-helper">
            Confirm customer intakes, assign technicians, review estimates, and coordinate pick-ups.
          </p>
        </div>

        <Button
          asChild
          className="h-9 rounded-full rounded-lg bg-brand-blue text-xs font-semibold text-white"
        >
          <Link href="/book">
            <Plus className="mr-1 size-3.5" />
            New Walk-in Booking
          </Link>
        </Button>
      </div>

      {/* Preset Filter Tabs & Search Bar */}
      <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterPreset('needs_sa')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              filterPreset === 'needs_sa'
                ? 'bg-brand-blue text-white'
                : 'border border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700/70'
            }`}
          >
            Needs SA Action
          </button>

          <button
            type="button"
            onClick={() => setFilterPreset('in_progress')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              filterPreset === 'in_progress'
                ? 'bg-brand-blue text-white'
                : 'border border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700/70'
            }`}
          >
            Workshop in Progress
          </button>

          <button
            type="button"
            onClick={() => setFilterPreset('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              filterPreset === 'all'
                ? 'bg-brand-blue text-white'
                : 'border border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700/70'
            }`}
          >
            All Bookings ({allBookings.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-3 size-4 text-subtle-foreground" />
          <Input
            placeholder="Search ref, plate, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 bg-card pl-9 text-xs"
          />
        </div>
      </div>

      {/* Bookings Queue Table */}
      <Card className="overflow-hidden border-border">
        <CardContent className="p-0">
          {filteredBookings.length === 0 ? (
            <div className="space-y-2 p-12 text-center">
              <CalendarCheck className="mx-auto size-10 text-border-medium" />
              <p className="text-sm font-bold text-foreground">All caught up!</p>
              <p className="text-xs text-helper">No bookings match your current filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted text-[11px] font-bold text-subtle-foreground">
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
                <tbody className="divide-y divide-border-faint text-muted-foreground">
                  {filteredBookings.map((b) => {
                    const nextStep = getNextStep(b)

                    return (
                      <tr key={b.id} className="hover:bg-muted/70">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <Link
                            href={`${base}/bookings/${b.id}`}
                            className="font-mono font-bold text-brand-blue-ink hover:underline"
                          >
                            {b.reference}
                          </Link>
                          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-subtle-foreground">
                            <Clock className="size-3" />
                            <span>
                              {b.scheduledTime} ({b.scheduledDate})
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="font-bold text-foreground">{b.customerName}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {b.licensePlate} • {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                          </p>
                        </td>

                        <td className="max-w-xs px-4 py-3.5">
                          <div className="truncate font-medium text-foreground">
                            {b.services.join(', ')}
                          </div>
                          <span className="text-[11px] text-subtle-foreground">
                            Est: {formatPKR(b.estimateTotal)}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <StatusBadge status={b.status} audience="staff" size="sm" />
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {b.assignedTechnicianName ? (
                            <span className="flex items-center gap-1 font-medium text-foreground">
                              <Wrench className="size-3 text-subtle-foreground" />
                              {b.assignedTechnicianName}
                            </span>
                          ) : (
                            <span className="text-subtle-foreground italic">Unassigned</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {nextStep ? (
                            <span
                              className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                                nextStep.urgent
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                                  : 'bg-secondary text-muted-foreground'
                              }`}
                            >
                              {nextStep.label}
                            </span>
                          ) : (
                            <span className="text-[11px] text-subtle-foreground">In progress</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-7 rounded-full border-border text-xs font-semibold"
                          >
                            <Link href={`${base}/bookings/${b.id}`}>
                              Manage
                              <ChevronRight className="ml-1 size-3" />
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
