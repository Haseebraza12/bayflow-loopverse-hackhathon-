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
        <h1 className="text-2xl font-bold text-foreground">Booking Not Found</h1>
        <p className="mt-2 text-muted-foreground">We could not locate this booking reference.</p>
        <Button asChild className="mt-6 rounded-full bg-brand-blue text-white">
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
    setActionSuccess(
      'Estimate approved! The workshop is now preparing parts and commencing repairs.',
    )
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
    setActionSuccess(
      'Estimate declined. The Service Advisor will review your notes and contact you with options.',
    )
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
    <div className="min-h-screen bg-muted/70 pb-20">
      {/* Top Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-brand-blue-ink"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to My Bookings</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 pt-8 sm:px-6 lg:px-8">
        {actionSuccess && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-xs font-semibold">{actionSuccess}</AlertDescription>
          </Alert>
        )}

        {/* Booking Header Card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-semibold text-brand-blue-ink sm:text-2xl">
                  {booking.reference}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="rounded-full border border-border p-1 text-subtle-foreground hover:text-muted-foreground"
                  title="Copy Reference"
                >
                  <Copy className="size-3.5" />
                </button>
                {copied && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Copied!
                  </span>
                )}
                <StatusBadge status={booking.status} audience="customer" size="md" />
              </div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">{booking.shopName}</h1>
              <p className="text-xs text-helper">
                Scheduled for {booking.scheduledDate} at {booking.scheduledTime} (Workshop local
                time)
              </p>
            </div>

            {/* Quick Actions (Call shop / Cancel) */}
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full border-border-medium text-xs font-semibold"
              >
                <a href="tel:+924235789011">
                  <Phone className="mr-1 size-3.5 text-brand-blue-ink" />
                  Call Shop
                </a>
              </Button>

              {isCancellable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCancelDialogOpen(true)}
                  className="text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* DECISION CALLOUT: Awaiting Customer Estimate Approval */}
        {isAwaitingEstimate && (
          <div className="space-y-4 rounded-2xl border-2 border-amber-400 bg-amber-50/70 p-6 dark:border-amber-600 dark:bg-amber-950/30">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-amber-900 dark:text-amber-100">
                  <FileCheck className="size-4 text-amber-600 dark:text-amber-400" />
                  Action Required: Approve Estimate
                </span>
                <h2 className="text-lg font-bold text-foreground">
                  Technician Inspection Complete — Total {formatPKR(booking.estimateTotal)}
                </h2>
                <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
                  The assigned technician has inspected your car and prepared an itemized estimate.
                  Review the parts and labor below before approving.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                  onClick={handleApproveEstimate}
                  className="h-10 rounded-full bg-brand-green px-5 text-xs font-bold text-white hover:bg-emerald-600"
                >
                  <CheckCircle2 className="mr-1.5 size-4" />
                  Approve Estimate ({formatPKR(booking.estimateTotal)})
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setDeclineDialogOpen(true)}
                  className="h-10 border-border-medium bg-card text-xs font-semibold text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                >
                  <FileX className="mr-1.5 size-4 text-red-500 dark:text-red-400" />
                  Decline Estimate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* READY FOR PICKUP CALLOUT */}
        {isReadyForPickup && (
          <div className="space-y-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 p-6 dark:border-emerald-600 dark:bg-emerald-950/30">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-emerald-900 dark:text-emerald-100">
                  <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Ready for Collection
                </span>
                <h2 className="text-lg font-bold text-foreground">
                  Repairs & 5-Point Quality Check Completed!
                </h2>
                <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
                  Your vehicle has passed quality inspection and is parked in the customer handover
                  bay.
                </p>
              </div>

              <Button
                onClick={handleCollectVehicle}
                className="h-10 shrink-0 rounded-full bg-emerald-600 px-6 text-xs font-bold text-white hover:bg-emerald-700"
              >
                I Have Collected My Vehicle
              </Button>
            </div>
          </div>
        )}

        {/* Main Grid: Estimate & Timeline */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (2 spans): Itemized Estimate & Inspection Notes */}
          <div className="space-y-6 lg:col-span-2">
            {/* Estimate Table */}
            <Card className="overflow-hidden border-border">
              <CardHeader className="border-b border-border-faint bg-muted/80 pb-3.5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <FileCheck className="size-4 text-brand-blue-ink" />
                    Itemized Estimate & Work Order
                  </CardTitle>
                  {booking.estimateApproved ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                      Approved by You
                    </span>
                  ) : booking.status === 'ESTIMATE_REJECTED' ? (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-800 dark:bg-red-900/40 dark:text-red-200">
                      Declined by You
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-semibold text-helper">v1.0</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-muted text-[11px] font-bold text-subtle-foreground">
                      <tr>
                        <th className="px-5 py-2.5">Item / Description</th>
                        <th className="px-4 py-2.5">Type</th>
                        <th className="px-4 py-2.5 text-center">Qty</th>
                        <th className="px-4 py-2.5 text-right">Unit Price</th>
                        <th className="px-5 py-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-faint text-muted-foreground">
                      {booking.estimateItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/60">
                          <td className="px-5 py-3 font-medium text-foreground">
                            {item.description}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
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
                    <tfoot className="border-t border-border bg-muted/50">
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-3 text-right font-bold text-muted-foreground"
                        >
                          Total Estimate
                        </td>
                        <td className="px-5 py-3 text-right text-sm font-semibold text-brand-blue-ink">
                          {formatPKR(booking.estimateTotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {booking.inspectionNotes && (
                  <div className="border-t border-border-faint bg-blue-50/30 p-5 text-xs dark:bg-blue-950/30">
                    <span className="font-bold text-foreground">Technician Inspection Notes:</span>
                    <p className="mt-1 leading-relaxed text-muted-foreground italic">
                      &quot;{booking.inspectionNotes}&quot;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quality Check Results if available */}
            {booking.qcNotes && (
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                    Quality Check Certification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="size-4" />
                    <span>5-Point Safety & Road Test Passed by QC Inspector</span>
                  </div>
                  <p className="rounded-lg border border-border-faint bg-muted p-3 text-muted-foreground">
                    {booking.qcNotes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Status Timeline & Vehicle Info */}
          <div className="space-y-6">
            {/* Live Status Timeline */}
            <Card className="border-border">
              <CardHeader className="border-b border-border-faint pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Clock className="size-4 text-brand-blue-ink" />
                  Repair Progress Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                {[
                  { stage: 1, title: 'Booking Confirmed', desc: 'Shop received appointment' },
                  {
                    stage: 2,
                    title: 'Inspection & Diagnosis',
                    desc: 'OBD scan and mechanical check',
                  },
                  { stage: 3, title: 'Estimate Approval', desc: 'Review parts & labor estimate' },
                  {
                    stage: 4,
                    title: 'Parts Allocation & Repair',
                    desc: 'Technician bench work in progress',
                  },
                  {
                    stage: 5,
                    title: '5-Point QC Road Test',
                    desc: 'Safety and clearance inspection',
                  },
                  { stage: 6, title: 'Ready for Collection', desc: 'Handover bay release' },
                ].map((step, idx) => {
                  const isDone = currentStage > step.stage || booking.status === 'COMPLETED'
                  const isCurrent = currentStage === step.stage && booking.status !== 'COMPLETED'

                  return (
                    <div key={step.stage} className="relative flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                                ? 'bg-brand-blue text-white ring-4 ring-blue-100 dark:ring-blue-800/60'
                                : 'bg-secondary text-subtle-foreground'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="size-3.5" /> : step.stage}
                        </div>
                        {idx < 5 && (
                          <div
                            className={`mt-1 h-7 w-0.5 ${
                              isDone ? 'bg-emerald-500' : 'bg-layer-accent'
                            }`}
                          />
                        )}
                      </div>

                      <div className="space-y-0.5 pt-0.5">
                        <p
                          className={`font-bold ${
                            isCurrent
                              ? 'text-brand-blue-ink'
                              : isDone
                                ? 'text-foreground'
                                : 'text-subtle-foreground'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-[11px] text-helper">{step.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Vehicle Details Card */}
            <Card className="border-border">
              <CardHeader className="border-b border-border-faint pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Car className="size-4 text-brand-blue-ink" />
                  Vehicle & Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-subtle-foreground">
                    License Plate
                  </span>
                  <p className="mt-0.5 font-mono text-sm font-bold text-foreground">
                    {booking.licensePlate}
                  </p>
                  <p className="text-muted-foreground">
                    {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
                  </p>
                </div>

                <div className="border-t border-border-faint pt-2">
                  <span className="text-[10px] font-bold text-subtle-foreground">Customer</span>
                  <p className="mt-0.5 font-medium text-foreground">{booking.customerName}</p>
                  <p className="text-helper">{booking.customerPhone}</p>
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
            <DialogTitle className="text-base font-bold text-foreground">
              Decline Repair Estimate
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              Tell the Service Advisor why you are declining so they can adjust the work scope or
              parts selection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="decReason" className="text-xs font-semibold text-muted-foreground">
              Reason / Comments
            </Label>
            <Textarea
              id="decReason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Please skip the cabin filter for now, only replace the brake pads."
              className="h-24 text-xs"
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
              className="rounded-full bg-red-600 text-xs font-bold text-white hover:bg-red-700"
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
            <DialogTitle className="text-base font-bold text-foreground">
              Cancel Appointment
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              Are you sure you want to cancel this booking? Your allocated workshop slot will be
              released.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="cncReason" className="text-xs font-semibold text-muted-foreground">
              Reason (Optional)
            </Label>
            <Textarea
              id="cncReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Rescheduling for next week"
              className="h-20 text-xs"
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
              className="rounded-full bg-red-600 text-xs font-bold text-white hover:bg-red-700"
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
