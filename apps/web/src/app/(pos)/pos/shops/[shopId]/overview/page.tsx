'use client'

import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Sparkles,
  Tags,
  Users,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IN_PROGRESS_STATUSES, SA_ACTION_STATUSES, isLowStock } from '@/lib/kpis'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import {
  getBookings,
  getInventory,
  getServices,
  getShopById,
  getTeamMembers,
} from '@/lib/mock-data'

function ShopOverviewContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === '1'

  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'
  const shop = useMockStore(() => getShopById(shopId))
  const bookings = useMockStore(() => getBookings(shopId))
  const team = useMockStore(() => getTeamMembers(shopId))
  const inventory = useMockStore(() => getInventory(shopId))
  const services = useMockStore(() => getServices(shopId))

  // KPI tiles: the API's status groups (lib/kpis.ts), so they match the owner summary.
  const needsSaAction = bookings.filter((b) => SA_ACTION_STATUSES.has(b.status)).length
  const inProgress = bookings.filter((b) => IN_PROGRESS_STATUSES.has(b.status)).length

  const readyForPickup = bookings.filter((b) => b.status === 'READY_FOR_PICKUP').length
  const completedToday = bookings.filter((b) => b.status === 'COMPLETED').length

  const lowStockParts = inventory.filter(isLowStock)
  const totalStockValue = inventory.reduce((sum, p) => sum + p.on_hand * p.unit_price, 0)

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
            Workshop Operations Hub
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            {shop?.name || 'Lahore Auto Care'}
          </h1>
          <p className="mt-0.5 text-xs text-helper">
            {shop?.address}, {shop?.city} • Slot duration: {shop?.slot_duration_minutes || 60}m
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border-medium text-xs font-semibold"
          >
            <Link href={`${base}/settings`}>Workshop Settings</Link>
          </Button>

          <Button
            asChild
            className="rounded-full bg-brand-blue px-4 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Link href={`${base}/bookings`}>
              Open Bookings Queue
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Onboarding Checklist when welcome=1 or services/team need setup */}
      {isWelcome && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800/60 dark:bg-blue-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-blue-950 dark:text-blue-100">
              <Sparkles className="size-4 text-brand-blue-ink" />
              Quick Setup Checklist for {shop?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href={`${base}/services`}
                className="rounded-full border border-blue-200 bg-card p-3 transition-colors hover:border-brand-blue dark:border-blue-800/60"
              >
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Tags className="size-4 text-brand-blue-ink" />
                  <span>1. Configure Services ({services.length})</span>
                </div>
                <p className="mt-1 text-[11px] text-helper">Add pricing and labor durations</p>
              </Link>

              <Link
                href={`${base}/team`}
                className="rounded-full border border-blue-200 bg-card p-3 transition-colors hover:border-brand-blue dark:border-blue-800/60"
              >
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Users className="size-4 text-brand-blue-ink" />
                  <span>2. Add Staff Members ({team.length})</span>
                </div>
                <p className="mt-1 text-[11px] text-helper">
                  Invite advisors, techs, and inspectors
                </p>
              </Link>

              <Link
                href={`${base}/inventory`}
                className="rounded-full border border-blue-200 bg-card p-3 transition-colors hover:border-brand-blue dark:border-blue-800/60"
              >
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Boxes className="size-4 text-brand-blue-ink" />
                  <span>3. Stock Inventory ({inventory.length})</span>
                </div>
                <p className="mt-1 text-[11px] text-helper">
                  Enter opening parts & lubricants count
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4 Primary KPI Tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Link href={`${base}/bookings?filter=needs_action`}>
          <Card className="cursor-pointer border-border transition-all hover:border-brand-blue">
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center justify-between text-xs font-bold text-helper">
                <span>Needs SA Action</span>
                <Clock className="size-4 text-amber-500 dark:text-amber-400" />
              </div>
              <div className="text-3xl font-semibold text-foreground">{needsSaAction}</div>
              <p className="text-[11px] text-subtle-foreground">Intake, estimates & pickup calls</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`${base}/jobs`}>
          <Card className="cursor-pointer border-border transition-all hover:border-brand-blue">
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center justify-between text-xs font-bold text-helper">
                <span>In Progress</span>
                <Wrench className="size-4 text-brand-blue-ink" />
              </div>
              <div className="text-3xl font-semibold text-brand-blue-ink">{inProgress}</div>
              <p className="text-[11px] text-subtle-foreground">Diagnosis, repairs & QC queue</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`${base}/bookings?filter=ready`}>
          <Card className="cursor-pointer border-border transition-all hover:border-brand-blue">
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center justify-between text-xs font-bold text-helper">
                <span>Ready for Pickup</span>
                <Sparkles className="size-4 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
                {readyForPickup}
              </div>
              <p className="text-[11px] text-subtle-foreground">Passed QC, awaiting customer</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`${base}/bookings?filter=completed`}>
          <Card className="cursor-pointer border-border transition-all hover:border-brand-blue">
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center justify-between text-xs font-bold text-helper">
                <span>Completed Jobs</span>
                <CheckCircle2 className="size-4 text-subtle-foreground" />
              </div>
              <div className="text-3xl font-semibold text-foreground">{completedToday}</div>
              <p className="text-[11px] text-subtle-foreground">Settled and handed over</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Grid: Live Jobs Table & Sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 spans): Recent Bookings & Statuses */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Bookings Card */}
          <Card className="overflow-hidden border-border">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border-faint p-5">
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  Active Workshop Bookings
                </CardTitle>
                <p className="mt-0.5 text-xs text-helper">
                  Live jobs on bay floor and upcoming intakes
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full text-xs font-semibold text-brand-blue-ink"
              >
                <Link href={`${base}/bookings`}>View All ({bookings.length})</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border-faint text-xs">
                {bookings.slice(0, 6).map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-brand-blue-ink">
                          {b.reference}
                        </span>
                        <StatusBadge status={b.status} audience="staff" size="sm" />
                      </div>
                      <p className="font-bold text-foreground">
                        {b.customerName} •{' '}
                        <span className="font-mono text-muted-foreground">{b.licensePlate}</span>
                      </p>
                      <p className="text-[11px] text-helper">
                        {b.vehicleYear} {b.vehicleMake} {b.vehicleModel} — {b.services.join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-1 sm:flex-col sm:items-end">
                      <span className="font-semibold text-foreground">
                        {b.scheduledTime} ({b.scheduledDate})
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-full border-border text-[11px] font-semibold"
                      >
                        <Link href={`${base}/bookings/${b.id}`}>Manage</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Workshop Team & Inventory Snapshot */}
        <div className="space-y-6">
          {/* Workshop Staff Card */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border-faint p-4">
              <CardTitle className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-muted-foreground">
                <Users className="size-3.5 text-brand-blue-ink" />
                Workshop Team ({team.length})
              </CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-6 rounded-full text-[11px] text-brand-blue-ink"
              >
                <Link href={`${base}/team`}>Manage</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 p-3 text-xs">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg bg-muted p-2"
                >
                  <div>
                    <p className="font-bold text-foreground">{member.name}</p>
                    <p className="font-mono text-[10px] text-subtle-foreground">{member.email}</p>
                  </div>
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-brand-blue-ink dark:bg-blue-950/40">
                    {member.role.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Low Stock Alerts Card */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border-faint p-4">
              <CardTitle className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-muted-foreground">
                <Boxes className="size-3.5 text-amber-500 dark:text-amber-400" />
                Inventory ({inventory.length} SKUs)
              </CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-6 rounded-full text-[11px] text-brand-blue-ink"
              >
                <Link href={`${base}/inventory`}>Inventory</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 p-3 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span className="text-helper">Total Stock Value</span>
                <span className="font-bold text-foreground">{formatPKR(totalStockValue)}</span>
              </div>

              {lowStockParts.length > 0 ? (
                <div className="space-y-2 border-t border-border-faint pt-2">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="size-3 text-amber-600 dark:text-amber-400" />
                    Low Stock Warnings ({lowStockParts.length})
                  </span>
                  {lowStockParts.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded bg-amber-50/60 p-2 text-xs dark:bg-amber-950/30"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <p className="font-mono text-[10px] text-helper">SKU: {p.sku}</p>
                      </div>
                      <span className="font-bold text-amber-800 dark:text-amber-200">
                        {p.on_hand} left (min {p.reorder_level})
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-subtle-foreground">
                  All parts within healthy reorder levels.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ShopOverviewPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-xs text-subtle-foreground">Loading shop overview...</div>}
    >
      <ShopOverviewContent />
    </Suspense>
  )
}
