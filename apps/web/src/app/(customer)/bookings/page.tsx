'use client'

import { Calendar, Car, ChevronRight, FileCheck, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getBookings } from '@/lib/mock-data'

export default function CustomerBookingsPage() {
  const allBookings = useMockStore(() => getBookings())
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active')

  const activeBookings = allBookings.filter(
    (b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED',
  )
  const pastBookings = allBookings.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'CANCELLED',
  )

  const displayedBookings = activeTab === 'active' ? activeBookings : pastBookings

  return (
    <div className="min-h-screen bg-muted/70 pb-20">
      {/* Top Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
                Customer Dashboard
              </span>
              <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
                My Appointments & Repairs
              </h1>
              <p className="mt-1 text-xs text-helper sm:text-sm">
                Track live inspection reports, approve technician estimates, and monitor vehicle
                readiness.
              </p>
            </div>

            <Button
              asChild
              className="h-10 rounded-full bg-brand-blue px-5 font-semibold text-white hover:bg-blue-700"
            >
              <Link href="/book">
                <Plus className="mr-1.5 size-4" />
                Book New Service
              </Link>
            </Button>
          </div>

          {/* Active vs Past Tabs */}
          <div className="mt-6 flex items-center gap-2 border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-colors ${
                activeTab === 'active'
                  ? 'border-brand-blue text-brand-blue-ink'
                  : 'border-transparent text-helper hover:text-foreground'
              }`}
            >
              <span>Active Bookings</span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-brand-blue-ink dark:bg-blue-950/40">
                {activeBookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('past')}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-colors ${
                activeTab === 'past'
                  ? 'border-brand-blue text-brand-blue-ink'
                  : 'border-transparent text-helper hover:text-foreground'
              }`}
            >
              <span>Past & Completed</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {pastBookings.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="mx-auto max-w-5xl space-y-4 px-4 pt-8 sm:px-6 lg:px-8">
        {displayedBookings.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Car className="mx-auto size-12 text-border-medium" />
            <h2 className="mt-4 text-base font-bold text-foreground">
              {activeTab === 'active' ? 'No active bookings' : 'No past bookings yet'}
            </h2>
            <p className="mt-1 text-xs text-helper">
              {activeTab === 'active'
                ? 'You do not have any vehicle bookings currently in progress.'
                : 'Completed and closed repair jobs will appear here.'}
            </p>
            {activeTab === 'active' && (
              <Button asChild className="mt-5 rounded-full bg-brand-blue text-white">
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
                className="group overflow-hidden border-border bg-card transition-all hover:border-border-medium"
              >
                {/* Urgent Action Needed Banner */}
                {isAwaitingCustomer && (
                  <div className="flex items-center justify-between bg-amber-500 px-5 py-2.5 text-xs font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <FileCheck className="size-4" />
                      <span>Estimate awaiting your approval — {formatPKR(b.estimateTotal)}</span>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="h-7 rounded-full rounded-md bg-card text-xs font-bold text-amber-900 hover:bg-secondary dark:text-amber-100"
                    >
                      <Link href={`/bookings/${b.id}`}>Review Estimate</Link>
                    </Button>
                  </div>
                )}

                {isReadyForPickup && (
                  <div className="flex items-center justify-between bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4" />
                      <span>Your vehicle is ready for pickup! Confirm when collected.</span>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="h-7 rounded-full rounded-md bg-card text-xs font-bold text-emerald-900 hover:bg-secondary dark:text-emerald-100"
                    >
                      <Link href={`/bookings/${b.id}`}>View Handover</Link>
                    </Button>
                  </div>
                )}

                <CardContent className="space-y-4 p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-brand-blue-ink">
                          {b.reference}
                        </span>
                        <StatusBadge status={b.status} audience="customer" size="md" />
                      </div>
                      <h2 className="text-lg font-bold text-foreground">{b.shopName}</h2>
                    </div>

                    <div className="space-y-0.5 text-xs text-helper sm:text-right">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground sm:justify-end">
                        <Calendar className="size-3.5 text-subtle-foreground" />
                        <span>
                          {b.scheduledDate} at {b.scheduledTime}
                        </span>
                      </div>
                      <p>Shop local slot time</p>
                    </div>
                  </div>

                  {/* Vehicle & Services */}
                  <div className="grid grid-cols-1 gap-3 border-t border-border-faint pt-3 text-xs sm:grid-cols-2">
                    <div>
                      <span className="text-[10px] font-bold text-subtle-foreground">Vehicle</span>
                      <p className="mt-0.5 font-mono font-semibold text-foreground">
                        {b.licensePlate}
                      </p>
                      <p className="text-muted-foreground">
                        {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-subtle-foreground">
                        Services Requested
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {b.services.map((s, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-medium text-helper">
                      Estimate:{' '}
                      <strong className="text-foreground">{formatPKR(b.estimateTotal)}</strong>
                    </span>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full border-border text-xs font-semibold group-hover:border-brand-blue group-hover:text-brand-blue-ink"
                    >
                      <Link href={`/bookings/${b.id}`}>
                        View Details & Timeline
                        <ChevronRight className="ml-1 size-3.5" />
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
