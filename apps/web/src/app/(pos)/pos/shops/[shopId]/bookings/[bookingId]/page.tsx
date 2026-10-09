'use client'

import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  FileText,
  Mail,
  PackageSearch,
  Phone,
  Send,
  User,
  UserCheck,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getBookingById, getTeamMembers, saveBooking, type MockBooking } from '@/lib/mock-data'

export default function ServiceAdvisorBookingDetailPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'
  const bookingId = typeof params?.bookingId === 'string' ? params.bookingId : ''

  const booking = useMockStore(() => getBookingById(bookingId))
  const team = useMockStore(() => getTeamMembers(shopId))

  const [copied, setCopied] = useState(false)
  const [assignTechOpen, setAssignTechOpen] = useState(false)
  const [assignPartsOpen, setAssignPartsOpen] = useState(false)
  const [selectedTech, setSelectedTech] = useState('usr-imran')
  const [selectedPartsPerson, setSelectedPartsPerson] = useState('usr-usman')
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  if (!booking) {
    return (
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">Booking not found</h1>
        <Button asChild className="rounded-full bg-brand-blue text-xs text-white">
          <Link href={`${base}/bookings`}>Back to Bookings Queue</Link>
        </Button>
      </div>
    )
  }

  const technicians = team.filter((m) => m.role === 'TECHNICIAN' && m.is_active)
  const partsPeople = team.filter((m) => m.role === 'PARTS_PERSON' && m.is_active)

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.reference)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // SA Actions
  const handleConfirmIntake = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'CONFIRMED',
    }
    saveBooking(updated)
    setSuccessToast(`Intake confirmed for ${booking.reference}. Ready for technician assignment.`)
  }

  const handleAssignTechnician = () => {
    const tech = technicians.find((t) => t.id === selectedTech) || technicians[0]
    const updated: MockBooking = {
      ...booking,
      status: 'ASSIGNED',
      assignedTechnicianId: tech?.id || 'usr-imran',
      assignedTechnicianName: tech?.name || 'Imran',
    }
    saveBooking(updated)
    setAssignTechOpen(false)
    setSuccessToast(`Assigned ${tech?.name || 'Technician'} to ${booking.reference}.`)
  }

  const handleSendEstimateToCustomer = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'AWAITING_CUSTOMER',
    }
    saveBooking(updated)
    setSuccessToast(`Inspection estimate sent to customer (${booking.customerEmail}).`)
  }

  const handleAssignParts = () => {
    const partsPerson = partsPeople.find((p) => p.id === selectedPartsPerson) || partsPeople[0]
    const updated: MockBooking = {
      ...booking,
      status: 'PARTS_PENDING',
      assignedPartsPersonId: partsPerson?.id || 'usr-usman',
    }
    saveBooking(updated)
    setAssignPartsOpen(false)
    setSuccessToast(`Estimate approved! Job sent to Parts Specialist (${partsPerson?.name}).`)
  }

  const handleNotifyReady = () => {
    setSuccessToast(`Notification dispatched: Vehicle is ready for customer handover!`)
  }

  const handleCompleteBooking = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'COMPLETED',
      paidAmount: booking.estimateTotal,
    }
    saveBooking(updated)
    setSuccessToast(`Booking ${booking.reference} marked COMPLETED and closed.`)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href={`${base}/bookings`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-blue-ink"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Bookings Queue</span>
        </Link>
      </div>

      {successToast && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Header & Action Bar */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-semibold text-brand-blue-ink sm:text-2xl">
                {booking.reference}
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="rounded-full border border-border p-1 text-subtle-foreground hover:text-muted-foreground"
              >
                <Copy className="size-3.5" />
              </button>
              {copied && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Copied!
                </span>
              )}
              <StatusBadge status={booking.status} audience="staff" size="md" />
            </div>

            <p className="text-sm font-bold text-foreground">
              {booking.customerName} •{' '}
              <span className="font-mono text-muted-foreground">{booking.licensePlate}</span> (
              {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel})
            </p>
            <p className="text-xs text-helper">
              Scheduled: {booking.scheduledDate} at {booking.scheduledTime}
            </p>
          </div>

          {/* Contextual Primary Action Button */}
          <div className="flex flex-wrap items-center gap-2">
            {booking.status === 'PENDING' && (
              <Button
                onClick={handleConfirmIntake}
                className="h-9 rounded-full bg-brand-blue px-4 text-xs font-bold text-white hover:bg-blue-700"
              >
                Confirm Booking Intake
              </Button>
            )}

            {booking.status === 'CONFIRMED' && (
              <Button
                onClick={() => setAssignTechOpen(true)}
                className="h-9 bg-brand-blue px-4 text-xs font-bold text-white hover:bg-blue-700"
              >
                <UserCheck className="mr-1.5 size-3.5" />
                Assign Technician
              </Button>
            )}

            {booking.status === 'ESTIMATE_REVIEW' && (
              <Button
                onClick={handleSendEstimateToCustomer}
                className="h-9 rounded-full bg-brand-green px-4 text-xs font-bold text-white hover:bg-emerald-600"
              >
                <Send className="mr-1.5 size-3.5" />
                Send Estimate to Customer
              </Button>
            )}

            {booking.status === 'ESTIMATE_APPROVED' && (
              <Button
                onClick={() => setAssignPartsOpen(true)}
                className="h-9 bg-brand-blue px-4 text-xs font-bold text-white hover:bg-blue-700"
              >
                <PackageSearch className="mr-1.5 size-3.5" />
                Assign Parts Specialist
              </Button>
            )}

            {booking.status === 'READY_FOR_PICKUP' && (
              <>
                <Button
                  onClick={handleNotifyReady}
                  variant="outline"
                  className="h-9 rounded-full text-xs font-semibold"
                >
                  <Phone className="mr-1.5 size-3.5 text-brand-blue-ink" />
                  Notify Customer Ready
                </Button>
                <Button
                  onClick={handleCompleteBooking}
                  className="h-9 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Complete & Settle
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Estimate & Assignment Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 spans): Estimate & Inspection Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Estimate Table */}
          <Card className="overflow-hidden border-border">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border-faint bg-muted/80 p-4">
              <CardTitle className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-helper">
                <FileText className="size-4 text-brand-blue-ink" />
                Technician Inspection & Estimate ({booking.estimateItems.length} Items)
              </CardTitle>
              {booking.estimateApproved ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                  Customer Approved
                </span>
              ) : (
                <span className="font-mono text-xs font-semibold text-helper">
                  Status: {booking.status}
                </span>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted text-[11px] font-bold text-subtle-foreground">
                    <tr>
                      <th className="px-5 py-2.5">Line Description</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Unit Price</th>
                      <th className="px-5 py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-faint text-muted-foreground">
                    {booking.estimateItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-5 py-3 font-semibold text-foreground">
                          {item.description}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`py-0.2 rounded px-1.5 text-[10px] font-bold ${
                              item.type === 'PART'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatPKR(item.unit_price)}</td>
                        <td className="px-5 py-3 text-right font-bold text-foreground">
                          {formatPKR(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-border bg-muted/60 font-bold">
                    <tr>
                      <td colSpan={4} className="px-5 py-3 text-right text-muted-foreground">
                        Grand Total
                      </td>
                      <td className="px-5 py-3 text-right text-sm font-semibold text-brand-blue-ink">
                        {formatPKR(booking.estimateTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {booking.inspectionNotes && (
                <div className="border-t border-border-faint bg-blue-50/20 p-4 text-xs dark:bg-blue-950/30">
                  <span className="font-bold text-foreground">Technician Findings:</span>
                  <p className="mt-1 leading-relaxed text-muted-foreground italic">
                    &quot;{booking.inspectionNotes}&quot;
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer & Staff Assignment Card */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="border-b border-border-faint pb-3">
              <CardTitle className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-helper">
                <User className="size-3.5 text-brand-blue-ink" />
                Customer Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div>
                <p className="text-sm font-bold text-foreground">{booking.customerName}</p>
                <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="size-3.5 text-subtle-foreground" />
                  <a
                    href={`tel:${booking.customerPhone}`}
                    className="font-medium text-brand-blue-ink hover:underline"
                  >
                    {booking.customerPhone}
                  </a>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-helper">
                  <Mail className="size-3.5 text-subtle-foreground" />
                  <span>{booking.customerEmail}</span>
                </div>
              </div>

              <div className="space-y-1 border-t border-border-faint pt-3">
                <span className="text-[10px] font-bold text-subtle-foreground">
                  Assigned Technician
                </span>
                <p className="font-bold text-foreground">
                  {booking.assignedTechnicianName || 'Not yet assigned'}
                </p>
              </div>

              <div className="space-y-1 border-t border-border-faint pt-2">
                <span className="text-[10px] font-bold text-subtle-foreground">Vehicle</span>
                <p className="font-mono font-bold text-foreground">{booking.licensePlate}</p>
                <p className="text-helper">
                  {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Technician Dialog */}
      <Dialog open={assignTechOpen} onOpenChange={setAssignTechOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Assign Workshop Technician
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              Select a certified technician to inspect {booking.vehicleMake} {booking.vehicleModel}{' '}
              ({booking.licensePlate}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => setSelectedTech(tech.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-colors ${
                  selectedTech === tech.id
                    ? 'border-brand-blue bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-border hover:border-border-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 font-bold text-brand-blue-ink dark:bg-blue-900/40">
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{tech.name}</p>
                    <p className="text-[11px] text-helper">{tech.email}</p>
                  </div>
                </div>
                {selectedTech === tech.id && (
                  <CheckCircle2 className="size-4 text-brand-blue-ink" />
                )}
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setAssignTechOpen(false)}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignTechnician}
              className="rounded-full bg-brand-blue text-xs font-bold text-white"
            >
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Parts Person Dialog */}
      <Dialog open={assignPartsOpen} onOpenChange={setAssignPartsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Assign Parts Specialist
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              Route approved parts list to the inventory specialist to check availability or order
              stock.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {partsPeople.map((person) => (
              <div
                key={person.id}
                onClick={() => setSelectedPartsPerson(person.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-colors ${
                  selectedPartsPerson === person.id
                    ? 'border-brand-blue bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-border hover:border-border-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 font-bold text-brand-blue-ink dark:bg-blue-900/40">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{person.name}</p>
                    <p className="text-[11px] text-helper">{person.email}</p>
                  </div>
                </div>
                {selectedPartsPerson === person.id && (
                  <CheckCircle2 className="size-4 text-brand-blue-ink" />
                )}
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setAssignPartsOpen(false)}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignParts}
              className="rounded-full bg-brand-blue text-xs font-bold text-white"
            >
              Send to Parts Specialist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
