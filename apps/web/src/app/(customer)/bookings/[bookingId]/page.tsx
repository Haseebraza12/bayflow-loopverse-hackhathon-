'use client'

import {
  ArrowLeft,
  Car,
  CheckCircle2,
  Clock,
  Copy,
  FileCheck,
  FileX,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/status-badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getBookingById, saveBooking, type MockBooking } from '@/lib/mock-data'

export default function CustomerBookingDetailPage() {
  const params = useParams()
  const bookingId = typeof params?.bookingId === 'string' ? params.bookingId : ''

  const booking = useMockStore(() => getBookingById(bookingId))

  const [copied, setCopied] = useState(false)
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  if (!booking) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Booking Not Found</h1>
        <p className="mt-2 text-neutral-600">We could not locate this booking reference.</p>
        <Button asChild className="mt-6 bg-[#1047FA] text-white">
          <Link href="/bookings">Go to My Bookings</Link>
        </Button>
      </div>
    )
  }

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.reference)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Customer Actions: Approve Estimate
  const handleApproveEstimate = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'ESTIMATE_APPROVED',
      estimateApproved: true,
    }
    saveBooking(updated)
    setActionSuccess('Estimate approved! The workshop is now preparing parts and commencing repairs.')
  }

  // Customer Actions: Decline Estimate
  const handleDeclineEstimate = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'ESTIMATE_REJECTED',
      estimateApproved: false,
    }
    saveBooking(updated)
    setDeclineDialogOpen(false)
    setActionSuccess('Estimate declined. The Service Advisor will review your notes and contact you with options.')
  }

  // Customer Actions: Collected Vehicle
  const handleCollectVehicle = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'COMPLETED',
      paidAmount: booking.estimateTotal,
    }
    saveBooking(updated)
    setActionSuccess('Vehicle collection confirmed! Thank you for choosing our workshop.')
  }

  // Customer Actions: Cancel Booking
  const handleCancelBooking = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'CANCELLED',
    }
    saveBooking(updated)
    setCancelDialogOpen(false)
    setActionSuccess('Your appointment has been cancelled.')
  }

  const isAwaitingEstimate = booking.status === 'AWAITING_CUSTOMER'
  const isReadyForPickup = booking.status === 'READY_FOR_PICKUP'
  const isCancellable =
    booking.status === 'PENDING' ||
    booking.status === 'CONFIRMED' ||
    booking.status === 'ASSIGNED' ||
    booking.status === 'AWAITING_CUSTOMER'

  // Timeline stage active indicator
  const getTimelineStage = (status: MockBooking['status']) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 1
      case 'ASSIGNED':
      case 'INSPECTING':
        return 2
      case 'ESTIMATE_REVIEW':
      case 'AWAITING_CUSTOMER':
      case 'ESTIMATE_REJECTED':
        return 3
      case 'ESTIMATE_APPROVED':
      case 'PARTS_PENDING':
      case 'PARTS_ORDERED':
      case 'PARTS_READY':
      case 'IN_REPAIR':
        return 4
      case 'QC_PENDING':
      case 'QC_IN_PROGRESS':
        return 5
      case 'READY_FOR_PICKUP':
      case 'COMPLETED':
        return 6
      default:
        return 1
    }
  }

  const currentStage = getTimelineStage(booking.status)

  return (
    <div className="min-h-screen bg-neutral-50/70 pb-20">
      {/* Top Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#1047FA] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to My Bookings</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6">
        {actionSuccess && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <AlertDescription className="text-xs font-semibold">
              {actionSuccess}
            </AlertDescription>
          </Alert>
        )}

        {/* Booking Header Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#1047FA]">
                  {booking.reference}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="rounded-md border border-neutral-200 p-1 text-neutral-400 hover:text-neutral-700"
                  title="Copy Reference"
                >
                  <Copy className="size-3.5" />
                </button>
                {copied && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                <StatusBadge status={booking.status} audience="customer" size="md" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">{booking.shopName}</h1>
              <p className="text-xs text-neutral-500">
                Scheduled for {booking.scheduledDate} at {booking.scheduledTime} (Workshop local time)
              </p>
            </div>

            {/* Quick Actions (Call shop / Cancel) */}
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs font-semibold border-neutral-300"
              >
                <a href="tel:+924235789011">
                  <Phone className="size-3.5 mr-1 text-[#1047FA]" />
                  Call Shop
                </a>
              </Button>

              {isCancellable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCancelDialogOpen(true)}
                  className="text-xs text-red-600 hover:bg-red-50"
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* DECISION CALLOUT: Awaiting Customer Estimate Approval */}
        {isAwaitingEstimate && (
          <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/70 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
                  <FileCheck className="size-4 text-amber-600" />
                  Action Required: Approve Estimate
                </span>
                <h2 className="text-lg font-bold text-neutral-900">
                  Technician Inspection Complete — Total {formatPKR(booking.estimateTotal)}
                </h2>
                <p className="text-xs text-neutral-700 max-w-2xl leading-relaxed">
                  The assigned technician has inspected your car and prepared an itemized estimate. Review the parts and labor below before approving.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Button
                  onClick={handleApproveEstimate}
                  className="bg-[#00c070] hover:bg-emerald-600 text-white font-bold text-xs px-5 h-10 shadow-sm"
                >
                  <CheckCircle2 className="size-4 mr-1.5" />
                  Approve Estimate ({formatPKR(booking.estimateTotal)})
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setDeclineDialogOpen(true)}
                  className="border-neutral-300 bg-white text-neutral-700 hover:text-red-600 text-xs font-semibold h-10"
                >
                  <FileX className="size-4 mr-1.5 text-red-500" />
                  Decline Estimate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* READY FOR PICKUP CALLOUT */}
        {isReadyForPickup && (
          <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
                  <Sparkles className="size-4 text-emerald-600" />
                  Ready for Collection
                </span>
                <h2 className="text-lg font-bold text-neutral-900">
                  Repairs & 5-Point Quality Check Completed!
                </h2>
                <p className="text-xs text-neutral-700 max-w-2xl leading-relaxed">
                  Your vehicle has passed quality inspection and is parked in the customer handover bay.
                </p>
              </div>

              <Button
                onClick={handleCollectVehicle}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 h-10 shadow-sm shrink-0"
              >
                I Have Collected My Vehicle
              </Button>
            </div>
          </div>
        )}

        {/* Main Grid: Estimate & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Itemized Estimate & Inspection Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estimate Table */}
            <Card className="border-neutral-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 pb-3.5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <FileCheck className="size-4 text-[#1047FA]" />
                    Itemized Estimate & Work Order
                  </CardTitle>
                  {booking.estimateApproved ? (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">
                      Approved by You
                    </span>
                  ) : booking.status === 'ESTIMATE_REJECTED' ? (
                    <span className="rounded-full bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5">
                      Declined by You
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-semibold text-neutral-500">v1.0</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 text-[11px] font-bold uppercase text-neutral-400 border-b border-neutral-200">
                      <tr>
                        <th className="px-5 py-2.5">Item / Description</th>
                        <th className="px-4 py-2.5">Type</th>
                        <th className="px-4 py-2.5 text-center">Qty</th>
                        <th className="px-4 py-2.5 text-right">Unit Price</th>
                        <th className="px-5 py-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-700">
                      {booking.estimateItems.map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-50/60">
                          <td className="px-5 py-3 font-medium text-neutral-900">{item.description}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
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
                    <tfoot className="border-t border-neutral-200 bg-neutral-50/50">
                      <tr>
                        <td colSpan={4} className="px-5 py-3 text-right font-bold text-neutral-700">
                          Total Estimate
                        </td>
                        <td className="px-5 py-3 text-right font-extrabold text-sm text-[#1047FA]">
                          {formatPKR(booking.estimateTotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {booking.inspectionNotes && (
                  <div className="p-5 border-t border-neutral-100 bg-blue-50/30 text-xs">
                    <span className="font-bold text-neutral-900">Technician Inspection Notes:</span>
                    <p className="mt-1 text-neutral-700 leading-relaxed italic">
                      &quot;{booking.inspectionNotes}&quot;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quality Check Results if available */}
            {booking.qcNotes && (
              <Card className="border-neutral-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    Quality Check Certification
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="size-4" />
                    <span>5-Point Safety & Road Test Passed by QC Inspector</span>
                  </div>
                  <p className="text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    {booking.qcNotes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Status Timeline & Vehicle Info */}
          <div className="space-y-6">
            {/* Live Status Timeline */}
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-neutral-100">
                <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Clock className="size-4 text-[#1047FA]" />
                  Repair Progress Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-xs space-y-4">
                {[
                  { stage: 1, title: 'Booking Confirmed', desc: 'Shop received appointment' },
                  { stage: 2, title: 'Inspection & Diagnosis', desc: 'OBD scan and mechanical check' },
                  { stage: 3, title: 'Estimate Approval', desc: 'Review parts & labor estimate' },
                  { stage: 4, title: 'Parts Allocation & Repair', desc: 'Technician bench work in progress' },
                  { stage: 5, title: '5-Point QC Road Test', desc: 'Safety and clearance inspection' },
                  { stage: 6, title: 'Ready for Collection', desc: 'Handover bay release' },
                ].map((step, idx) => {
                  const isDone = currentStage > step.stage || booking.status === 'COMPLETED'
                  const isCurrent = currentStage === step.stage && booking.status !== 'COMPLETED'

                  return (
                    <div key={step.stage} className="flex items-start gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div
                          className={`size-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                                ? 'bg-[#1047FA] text-white ring-4 ring-blue-100'
                                : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="size-3.5" /> : step.stage}
                        </div>
                        {idx < 5 && (
                          <div
                            className={`w-0.5 h-7 mt-1 ${
                              isDone ? 'bg-emerald-500' : 'bg-neutral-200'
                            }`}
                          />
                        )}
                      </div>

                      <div className="space-y-0.5 pt-0.5">
                        <p
                          className={`font-bold ${
                            isCurrent
                              ? 'text-[#1047FA]'
                              : isDone
                                ? 'text-neutral-900'
                                : 'text-neutral-400'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-[11px] text-neutral-500">{step.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Vehicle Details Card */}
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-neutral-100">
                <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Car className="size-4 text-[#1047FA]" />
                  Vehicle & Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-xs space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">License Plate</span>
                  <p className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                    {booking.licensePlate}
                  </p>
                  <p className="text-neutral-600">
                    {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Customer</span>
                  <p className="font-medium text-neutral-900 mt-0.5">{booking.customerName}</p>
                  <p className="text-neutral-500">{booking.customerPhone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Decline Estimate Dialog */}
      <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              Decline Repair Estimate
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Tell the Service Advisor why you are declining so they can adjust the work scope or parts selection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="decReason" className="text-xs font-semibold text-neutral-700">
              Reason / Comments
            </Label>
            <Textarea
              id="decReason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Please skip the cabin filter for now, only replace the brake pads."
              className="text-xs h-24"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeclineDialogOpen(false)}
              className="text-xs font-semibold"
            >
              Go Back
            </Button>
            <Button
              onClick={handleDeclineEstimate}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
            >
              Confirm Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              Cancel Appointment
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Are you sure you want to cancel this booking? Your allocated workshop slot will be released.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="cncReason" className="text-xs font-semibold text-neutral-700">
              Reason (Optional)
            </Label>
            <Textarea
              id="cncReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Rescheduling for next week"
              className="text-xs h-20"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="text-xs font-semibold"
            >
              Keep Appointment
            </Button>
            <Button
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
