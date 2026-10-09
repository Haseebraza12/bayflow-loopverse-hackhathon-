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
import {
  getBookingById,
  getTeamMembers,
  saveBooking,
  type MockBooking,
} from '@/lib/mock-data'

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
      <div className="py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">Booking not found</h1>
        <Button asChild className="bg-[#1047FA] text-white text-xs">
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#1047FA]"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Bookings Queue</span>
        </Link>
      </div>

      {successToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Header & Action Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#1047FA]">
                {booking.reference}
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="rounded border border-neutral-200 p-1 text-neutral-400 hover:text-neutral-700"
              >
                <Copy className="size-3.5" />
              </button>
              {copied && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
              <StatusBadge status={booking.status} audience="staff" size="md" />
            </div>

            <p className="text-sm font-bold text-neutral-900">
              {booking.customerName} • <span className="font-mono text-neutral-700">{booking.licensePlate}</span> ({booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel})
            </p>
            <p className="text-xs text-neutral-500">
              Scheduled: {booking.scheduledDate} at {booking.scheduledTime}
            </p>
          </div>

          {/* Contextual Primary Action Button */}
          <div className="flex flex-wrap items-center gap-2">
            {booking.status === 'PENDING' && (
              <Button
                onClick={handleConfirmIntake}
                className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs h-9 px-4"
              >
                Confirm Booking Intake
              </Button>
            )}

            {booking.status === 'CONFIRMED' && (
              <Button
                onClick={() => setAssignTechOpen(true)}
                className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs h-9 px-4"
              >
                <UserCheck className="size-3.5 mr-1.5" />
                Assign Technician
              </Button>
            )}

            {booking.status === 'ESTIMATE_REVIEW' && (
              <Button
                onClick={handleSendEstimateToCustomer}
                className="bg-[#00c070] hover:bg-emerald-600 text-white font-bold text-xs h-9 px-4"
              >
                <Send className="size-3.5 mr-1.5" />
                Send Estimate to Customer
              </Button>
            )}

            {booking.status === 'ESTIMATE_APPROVED' && (
              <Button
                onClick={() => setAssignPartsOpen(true)}
                className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs h-9 px-4"
              >
                <PackageSearch className="size-3.5 mr-1.5" />
                Assign Parts Specialist
              </Button>
            )}

            {booking.status === 'READY_FOR_PICKUP' && (
              <>
                <Button
                  onClick={handleNotifyReady}
                  variant="outline"
                  className="text-xs font-semibold h-9"
                >
                  <Phone className="size-3.5 mr-1.5 text-[#1047FA]" />
                  Notify Customer Ready
                </Button>
                <Button
                  onClick={handleCompleteBooking}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4"
                >
                  Complete & Settle
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Estimate & Assignment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Estimate & Inspection Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estimate Table */}
          <Card className="border-neutral-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <FileText className="size-4 text-[#1047FA]" />
                Technician Inspection & Estimate ({booking.estimateItems.length} Items)
              </CardTitle>
              {booking.estimateApproved ? (
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                  Customer Approved
                </span>
              ) : (
                <span className="text-xs font-mono text-neutral-500 font-semibold">
                  Status: {booking.status}
                </span>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-[11px] font-bold uppercase text-neutral-400 border-b border-neutral-200">
                    <tr>
                      <th className="px-5 py-2.5">Line Description</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Unit Price</th>
                      <th className="px-5 py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {booking.estimateItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-5 py-3 font-semibold text-neutral-900">{item.description}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                              item.type === 'PART'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatPKR(item.unit_price)}</td>
                        <td className="px-5 py-3 text-right font-bold text-neutral-900">
                          {formatPKR(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-neutral-200 bg-neutral-50/60 font-bold">
                    <tr>
                      <td colSpan={4} className="px-5 py-3 text-right text-neutral-600">
                        Grand Total
                      </td>
                      <td className="px-5 py-3 text-right font-extrabold text-sm text-[#1047FA]">
                        {formatPKR(booking.estimateTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {booking.inspectionNotes && (
                <div className="p-4 border-t border-neutral-100 bg-blue-50/20 text-xs">
                  <span className="font-bold text-neutral-900">Technician Findings:</span>
                  <p className="mt-1 text-neutral-700 leading-relaxed italic">
                    &quot;{booking.inspectionNotes}&quot;
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer & Staff Assignment Card */}
        <div className="space-y-6">
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-neutral-100">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <User className="size-3.5 text-[#1047FA]" />
                Customer Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-3">
              <div>
                <p className="font-bold text-neutral-900 text-sm">{booking.customerName}</p>
                <div className="flex items-center gap-1.5 text-neutral-600 mt-1">
                  <Phone className="size-3.5 text-neutral-400" />
                  <a href={`tel:${booking.customerPhone}`} className="text-[#1047FA] hover:underline font-medium">
                    {booking.customerPhone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-500 mt-0.5">
                  <Mail className="size-3.5 text-neutral-400" />
                  <span>{booking.customerEmail}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Assigned Technician</span>
                <p className="font-bold text-neutral-900">
                  {booking.assignedTechnicianName || 'Not yet assigned'}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Vehicle</span>
                <p className="font-mono font-bold text-neutral-900">{booking.licensePlate}</p>
                <p className="text-neutral-500">
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
            <DialogTitle className="text-base font-bold text-neutral-900">
              Assign Workshop Technician
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Select a certified technician to inspect {booking.vehicleMake} {booking.vehicleModel} ({booking.licensePlate}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => setSelectedTech(tech.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs transition-colors ${
                  selectedTech === tech.id
                    ? 'border-[#1047FA] bg-blue-50/50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-blue-100 text-[#1047FA] font-bold flex items-center justify-center">
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{tech.name}</p>
                    <p className="text-[11px] text-neutral-500">{tech.email}</p>
                  </div>
                </div>
                {selectedTech === tech.id && <CheckCircle2 className="size-4 text-[#1047FA]" />}
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAssignTechOpen(false)} className="text-xs font-semibold">
              Cancel
            </Button>
            <Button onClick={handleAssignTechnician} className="bg-[#1047FA] text-white text-xs font-bold">
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Parts Person Dialog */}
      <Dialog open={assignPartsOpen} onOpenChange={setAssignPartsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              Assign Parts Specialist
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Route approved parts list to the inventory specialist to check availability or order stock.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {partsPeople.map((person) => (
              <div
                key={person.id}
                onClick={() => setSelectedPartsPerson(person.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs transition-colors ${
                  selectedPartsPerson === person.id
                    ? 'border-[#1047FA] bg-blue-50/50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-blue-100 text-[#1047FA] font-bold flex items-center justify-center">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{person.name}</p>
                    <p className="text-[11px] text-neutral-500">{person.email}</p>
                  </div>
                </div>
                {selectedPartsPerson === person.id && <CheckCircle2 className="size-4 text-[#1047FA]" />}
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAssignPartsOpen(false)} className="text-xs font-semibold">
              Cancel
            </Button>
            <Button onClick={handleAssignParts} className="bg-[#1047FA] text-white text-xs font-bold">
              Send to Parts Specialist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
