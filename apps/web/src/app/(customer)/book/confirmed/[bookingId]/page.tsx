'use client'

import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FileCheck,
  MapPin,
  ShieldCheck,
  UserCheck,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
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
    <div className="min-h-screen bg-neutral-50/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto size-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="size-10" />
          </div>
          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Appointment Confirmed
          </span>
          <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
            Booking Received!
          </h1>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            We've sent your appointment to{' '}
            <strong className="text-neutral-900">{booking?.shopName || 'Lahore Auto Care'}</strong>.
            A Service Advisor will confirm your intake bay.
          </p>
        </div>

        {/* Reference Code Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center space-y-2">
          <span className="text-xs font-bold tracking-[0.32px] text-neutral-400">
            Your Booking Reference
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-3xl font-semibold text-[#1047FA] tracking-wide">
              {booking?.reference || 'BF-2026-948'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-neutral-200 p-2 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-colors"
              title="Copy reference code"
            >
              <Copy className="size-4" />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-emerald-600 font-semibold">Reference code copied to clipboard!</p>
          )}
          <p className="text-xs text-neutral-500">
            Keep this reference code handy when visiting or calling the workshop.
          </p>
        </div>

        {/* Booking Details Summary */}
        {booking && (
          <Card className="border-neutral-200 overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xs font-bold tracking-[0.32px] text-neutral-400">
                Appointment Summary
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-500">Scheduled Slot</span>
                  <p className="font-bold text-neutral-900 text-sm">
                    {booking.scheduledDate} at {booking.scheduledTime}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500">Vehicle</span>
                  <p className="font-mono font-bold text-neutral-900 text-sm">
                    {booking.licensePlate}
                  </p>
                  <p className="text-neutral-600">
                    {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs">
                <span className="text-neutral-500">Services Requested</span>
                <div className="flex flex-wrap gap-1.5">
                  {booking.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-800"
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
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#1047FA]" />
            What Happens Next
          </h2>

          <div className="space-y-3.5 text-xs text-neutral-600">
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#1047FA]">
                1
              </span>
              <div>
                <p className="font-bold text-neutral-900">1. Shop Confirms Bay Allocation</p>
                <p className="text-neutral-500">Service advisor checks slot availability and confirms the appointment.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#1047FA]">
                2
              </span>
              <div>
                <p className="font-bold text-neutral-900">2. Technician Physical Inspection</p>
                <p className="text-neutral-500">Your car is inspected on the hoist, OBD scan performed, and issues cataloged.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#1047FA]">
                3
              </span>
              <div>
                <p className="font-bold text-neutral-900">3. Online Estimate Approval</p>
                <p className="text-neutral-500">Review itemized parts and labor on your phone. Approve or reject before work begins.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#1047FA]">
                4
              </span>
              <div>
                <p className="font-bold text-neutral-900">4. Repair & Quality Check (QC)</p>
                <p className="text-neutral-500">Certified technician repairs your vehicle, verified by a 5-point QC inspector.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#1047FA]">
                5
              </span>
              <div>
                <p className="font-bold text-neutral-900">5. Vehicle Collection</p>
                <p className="text-neutral-500">Collect your vehicle once marked Ready for Pick-up, and confirm completion online.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            asChild
            className="flex-1 bg-[#1047FA] hover:bg-blue-700 text-white font-semibold h-11 rounded-full"
          >
            <Link href={`/bookings/${bookingId}`}>
              Track Live Booking Status
              <ChevronRight className="size-4 ml-1.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="sm:w-auto h-11 rounded-full font-semibold border-neutral-300"
          >
            <Link href="/bookings">Go to My Bookings</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
