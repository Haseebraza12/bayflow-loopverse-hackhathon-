'use client'

import {
  AlertCircle,
  Calendar,
  Car,
  ChevronRight,
  Clock,
  FileCheck,
  MapPin,
  Plus,
  Sparkles,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getBookings } from '@/lib/mock-data'

export default function CustomerBookingsPage() {
  const allBookings = useMockStore(() => getBookings())
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active')

  const activeBookings = allBookings.filter(
    (b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED'
  )
  const pastBookings = allBookings.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'CANCELLED'
  )

  const displayedBookings = activeTab === 'active' ? activeBookings : pastBookings

  return (
    <div className="min-h-screen bg-neutral-50/70 pb-20">
      {/* Top Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1047FA]">
                Customer Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
                My Appointments & Repairs
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Track live inspection reports, approve technician estimates, and monitor vehicle readiness.
              </p>
            </div>

            <Button
              asChild
              className="bg-[#1047FA] hover:bg-blue-700 text-white font-semibold rounded-xl px-5 h-10 shadow-sm"
            >
              <Link href="/book">
                <Plus className="size-4 mr-1.5" />
                Book New Service
              </Link>
            </Button>
          </div>

          {/* Active vs Past Tabs */}
          <div className="mt-6 flex items-center gap-2 border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'border-[#1047FA] text-[#1047FA]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span>Active Bookings</span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-[#1047FA]">
                {activeBookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('past')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'past'
                  ? 'border-[#1047FA] text-[#1047FA]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span>Past & Completed</span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                {pastBookings.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8 space-y-4">
        {displayedBookings.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
            <Car className="mx-auto size-12 text-neutral-300" />
            <h2 className="mt-4 text-base font-bold text-neutral-900">
              {activeTab === 'active' ? 'No active bookings' : 'No past bookings yet'}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              {activeTab === 'active'
                ? 'You do not have any vehicle bookings currently in progress.'
                : 'Completed and closed repair jobs will appear here.'}
            </p>
            {activeTab === 'active' && (
              <Button asChild className="mt-5 bg-[#1047FA] text-white">
                <Link href="/book">Find a Certified Workshop</Link>
              </Button>
            )}
          </div>
        ) : (
          displayedBookings.map((b) => {
            const isAwaitingCustomer = b.status === 'AWAITING_CUSTOMER'
            const isReadyForPickup = b.status === 'READY_FOR_PICKUP'

            return (
              <Card
                key={b.id}
                className="overflow-hidden border-neutral-200 bg-white hover:border-neutral-300 transition-all shadow-sm group"
              >
                {/* Urgent Action Needed Banner */}
                {isAwaitingCustomer && (
                  <div className="bg-amber-500 text-white px-5 py-2.5 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <FileCheck className="size-4" />
                      <span>Estimate awaiting your approval — {formatPKR(b.estimateTotal)}</span>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="bg-white text-amber-900 hover:bg-neutral-100 text-xs font-bold h-7 rounded-md"
                    >
                      <Link href={`/bookings/${b.id}`}>Review Estimate</Link>
                    </Button>
                  </div>
                )}

                {isReadyForPickup && (
                  <div className="bg-emerald-600 text-white px-5 py-2.5 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4" />
                      <span>Your vehicle is ready for pickup! Confirm when collected.</span>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="bg-white text-emerald-900 hover:bg-neutral-100 text-xs font-bold h-7 rounded-md"
                    >
                      <Link href={`/bookings/${b.id}`}>View Handover</Link>
                    </Button>
                  </div>
                )}

                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-[#1047FA]">
                          {b.reference}
                        </span>
                        <StatusBadge status={b.status} audience="customer" size="md" />
                      </div>
                      <h2 className="text-lg font-bold text-neutral-900">{b.shopName}</h2>
                    </div>

                    <div className="text-xs sm:text-right space-y-0.5 text-neutral-500">
                      <div className="flex sm:justify-end items-center gap-1.5 font-semibold text-neutral-800">
                        <Calendar className="size-3.5 text-neutral-400" />
                        <span>{b.scheduledDate} at {b.scheduledTime}</span>
                      </div>
                      <p>Shop local slot time</p>
                    </div>
                  </div>

                  {/* Vehicle & Services */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Vehicle</span>
                      <p className="font-semibold text-neutral-900 font-mono mt-0.5">
                        {b.licensePlate}
                      </p>
                      <p className="text-neutral-600">
                        {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">
                        Services Requested
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {b.services.map((s, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500">
                      Estimate: <strong className="text-neutral-900">{formatPKR(b.estimateTotal)}</strong>
                    </span>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-neutral-200 text-xs font-semibold group-hover:border-[#1047FA] group-hover:text-[#1047FA]"
                    >
                      <Link href={`/bookings/${b.id}`}>
                        View Details & Timeline
                        <ChevronRight className="size-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
