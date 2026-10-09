'use client'

import { CheckCircle2, ChevronRight, Copy, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
import { getBookingById } from '@/lib/mock-data'

export default function BookingConfirmedPage() {
  const params = useParams()
  const bookingId = typeof params?.bookingId === 'string' ? params.bookingId : ''

  const booking = useMockStore(() => getBookingById(bookingId))
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (booking?.reference) {
      navigator.clipboard.writeText(booking.reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-muted/70 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Success Header */}
        <div className="space-y-3 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <CheckCircle2 className="size-10" />
          </div>
          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            Appointment Confirmed
          </span>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Booking Received!</h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            We&apos;ve sent your appointment to{' '}
            <strong className="text-foreground">{booking?.shopName || 'Lahore Auto Care'}</strong>.
            A Service Advisor will confirm your intake bay.
          </p>
        </div>

        {/* Reference Code Card */}
        <div className="space-y-2 rounded-2xl border border-border bg-card p-6 text-center">
          <span className="text-xs font-bold tracking-[0.32px] text-subtle-foreground">
            Your Booking Reference
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-3xl font-semibold tracking-wide text-brand-blue-ink">
              {booking?.reference || 'BF-2026-948'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-border p-2 text-helper transition-colors hover:border-border-medium hover:text-foreground"
              title="Copy reference code"
            >
              <Copy className="size-4" />
            </button>
          </div>
          {copied && (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Reference code copied to clipboard!
            </p>
          )}
          <p className="text-xs text-helper">
            Keep this reference code handy when visiting or calling the workshop.
          </p>
        </div>

        {/* Booking Details Summary */}
        {booking && (
          <Card className="overflow-hidden border-border">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xs font-bold tracking-[0.32px] text-subtle-foreground">
                Appointment Summary
              </h2>

              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-helper">Scheduled Slot</span>
                  <p className="text-sm font-bold text-foreground">
                    {booking.scheduledDate} at {booking.scheduledTime}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-helper">Vehicle</span>
                  <p className="font-mono text-sm font-bold text-foreground">
                    {booking.licensePlate}
                  </p>
                  <p className="text-muted-foreground">
                    {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-border-faint pt-4 text-xs">
                <span className="text-helper">Services Requested</span>
                <div className="flex flex-wrap gap-1.5">
                  {booking.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 5-Step Roadmap: What Happens Next */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <ShieldCheck className="size-4 text-brand-blue-ink" />
            What Happens Next
          </h2>

          <div className="space-y-3.5 text-xs text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-brand-blue-ink dark:bg-blue-950/40">
                1
              </span>
              <div>
                <p className="font-bold text-foreground">1. Shop Confirms Bay Allocation</p>
                <p className="text-helper">
                  Service advisor checks slot availability and confirms the appointment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-brand-blue-ink dark:bg-blue-950/40">
                2
              </span>
              <div>
                <p className="font-bold text-foreground">2. Technician Physical Inspection</p>
                <p className="text-helper">
                  Your car is inspected on the hoist, OBD scan performed, and issues cataloged.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-brand-blue-ink dark:bg-blue-950/40">
                3
              </span>
              <div>
                <p className="font-bold text-foreground">3. Online Estimate Approval</p>
                <p className="text-helper">
                  Review itemized parts and labor on your phone. Approve or reject before work
                  begins.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-brand-blue-ink dark:bg-blue-950/40">
                4
              </span>
              <div>
                <p className="font-bold text-foreground">4. Repair & Quality Check (QC)</p>
                <p className="text-helper">
                  Certified technician repairs your vehicle, verified by a 5-point QC inspector.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-brand-blue-ink dark:bg-blue-950/40">
                5
              </span>
              <div>
                <p className="font-bold text-foreground">5. Vehicle Collection</p>
                <p className="text-helper">
                  Collect your vehicle once marked Ready for Pick-up, and confirm completion online.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button
            asChild
            className="h-11 flex-1 rounded-full bg-brand-blue font-semibold text-white hover:bg-blue-700"
          >
            <Link href={`/bookings/${bookingId}`}>
              Track Live Booking Status
              <ChevronRight className="ml-1.5 size-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full border-border-medium font-semibold sm:w-auto"
          >
            <Link href="/bookings">Go to My Bookings</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
