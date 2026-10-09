'use client'

import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  PackageSearch,
  Plus,
  ShieldCheck,
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

  // KPI Calculations
  const needsSaAction = bookings.filter((b) =>
    ['PENDING', 'CONFIRMED', 'ESTIMATE_REVIEW', 'AWAITING_CUSTOMER', 'ESTIMATE_REJECTED', 'READY_FOR_PICKUP'].includes(b.status)
  ).length

  const inProgress = bookings.filter((b) =>
    ['ASSIGNED', 'INSPECTING', 'ESTIMATE_APPROVED', 'PARTS_PENDING', 'PARTS_ORDERED', 'PARTS_READY', 'IN_REPAIR', 'QC_PENDING', 'QC_IN_PROGRESS'].includes(b.status)
  ).length

  const readyForPickup = bookings.filter((b) => b.status === 'READY_FOR_PICKUP').length
  const completedToday = bookings.filter((b) => b.status === 'COMPLETED').length

  const lowStockParts = inventory.filter((p) => p.on_hand <= p.reorder_level)
  const totalStockValue = inventory.reduce((sum, p) => sum + p.on_hand * p.unit_price, 0)

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1047FA]">
            Workshop Operations Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
            {shop?.name || 'Lahore Auto Care'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {shop?.address}, {shop?.city} • Slot duration: {shop?.slot_duration_minutes || 60}m
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="text-xs font-semibold border-neutral-300"
          >
            <Link href={`${base}/settings`}>Workshop Settings</Link>
          </Button>

          <Button
            asChild
            className="bg-[#1047FA] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg px-4"
          >
            <Link href={`${base}/bookings`}>
              Open Bookings Queue
              <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Onboarding Checklist when welcome=1 or services/team need setup */}
      {isWelcome && (
        <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Sparkles className="size-4 text-[#1047FA]" />
              Quick Setup Checklist for {shop?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href={`${base}/services`}
                className="rounded-lg border border-blue-200 bg-white p-3 hover:border-[#1047FA] transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <Tags className="size-4 text-[#1047FA]" />
                  <span>1. Configure Services ({services.length})</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Add pricing and labor durations</p>
              </Link>

              <Link
                href={`${base}/team`}
                className="rounded-lg border border-blue-200 bg-white p-3 hover:border-[#1047FA] transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <Users className="size-4 text-[#1047FA]" />
                  <span>2. Add Staff Members ({team.length})</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Invite advisors, techs, and inspectors</p>
              </Link>

              <Link
                href={`${base}/inventory`}
                className="rounded-lg border border-blue-200 bg-white p-3 hover:border-[#1047FA] transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <Boxes className="size-4 text-[#1047FA]" />
                  <span>3. Stock Inventory ({inventory.length})</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Enter opening parts & lubricants count</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4 Primary KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href={`${base}/bookings?filter=needs_action`}>
          <Card className="border-neutral-200 hover:border-[#1047FA] transition-all cursor-pointer shadow-sm">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
                <span>Needs SA Action</span>
                <Clock className="size-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-neutral-900">{needsSaAction}</div>
              <p className="text-[11px] text-neutral-400">Intake, estimates & pickup calls</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`${base}/jobs`}>
          <Card className="border-neutral-200 hover:border-[#1047FA] transition-all cursor-pointer shadow-sm">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
                <span>In Progress</span>
                <Wrench className="size-4 text-[#1047FA]" />
              </div>
              <div className="text-3xl font-extrabold text-[#1047FA]">{inProgress}</div>
              <p className="text-[11px] text-neutral-400">Diagnosis, repairs & QC queue</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`${base}/bookings?filter=ready`}>
          <Card className="border-neutral-200 hover:border-[#1047FA] transition-all cursor-pointer shadow-sm">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
                <span>Ready for Pickup</span>
                <Sparkles className="size-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-600">{readyForPickup}</div>
              <p className="text-[11px] text-neutral-400">Passed QC, awaiting customer</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`${base}/bookings?filter=completed`}>
          <Card className="border-neutral-200 hover:border-[#1047FA] transition-all cursor-pointer shadow-sm">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
                <span>Completed Jobs</span>
                <CheckCircle2 className="size-4 text-neutral-400" />
              </div>
              <div className="text-3xl font-extrabold text-neutral-900">{completedToday}</div>
              <p className="text-[11px] text-neutral-400">Settled and handed over</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Grid: Live Jobs Table & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Bookings & Statuses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Bookings Card */}
          <Card className="border-neutral-200 shadow-sm overflow-hidden">
            <CardHeader className="p-5 border-b border-neutral-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-neutral-900">
                  Active Workshop Bookings
                </CardTitle>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Live jobs on bay floor and upcoming intakes
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-[#1047FA]"
              >
                <Link href={`${base}/bookings`}>View All ({bookings.length})</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-100 text-xs">
                {bookings.slice(0, 6).map((b) => (
                  <div
                    key={b.id}
                    className="p-4 hover:bg-neutral-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-[#1047FA]">
                          {b.reference}
                        </span>
                        <StatusBadge status={b.status} audience="staff" size="sm" />
                      </div>
                      <p className="font-bold text-neutral-900">
                        {b.customerName} • <span className="font-mono text-neutral-600">{b.licensePlate}</span>
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {b.vehicleYear} {b.vehicleMake} {b.vehicleModel} — {b.services.join(', ')}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                      <span className="font-semibold text-neutral-800">
                        {b.scheduledTime} ({b.scheduledDate})
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] font-semibold border-neutral-200"
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
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="p-4 border-b border-neutral-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <Users className="size-3.5 text-[#1047FA]" />
                Workshop Team ({team.length})
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="h-6 text-[11px] text-[#1047FA]">
                <Link href={`${base}/team`}>Manage</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-50"
                >
                  <div>
                    <p className="font-bold text-neutral-900">{member.name}</p>
                    <p className="text-[10px] text-neutral-400 font-mono">{member.email}</p>
                  </div>
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#1047FA]">
                    {member.role.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Low Stock Alerts Card */}
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="p-4 border-b border-neutral-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <Boxes className="size-3.5 text-amber-500" />
                Inventory ({inventory.length} SKUs)
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="h-6 text-[11px] text-[#1047FA]">
                <Link href={`${base}/inventory`}>Inventory</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-3 space-y-3 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span className="text-neutral-500">Total Stock Value</span>
                <span className="font-bold text-neutral-900">{formatPKR(totalStockValue)}</span>
              </div>

              {lowStockParts.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="size-3 text-amber-600" />
                    Low Stock Warnings ({lowStockParts.length})
                  </span>
                  {lowStockParts.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded bg-amber-50/60 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-neutral-900">{p.name}</p>
                        <p className="text-[10px] font-mono text-neutral-500">SKU: {p.sku}</p>
                      </div>
                      <span className="font-bold text-amber-800">
                        {p.on_hand} left (min {p.reorder_level})
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400 text-[11px]">All parts within healthy reorder levels.</p>
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
    <Suspense fallback={<div className="p-8 text-xs text-neutral-400">Loading shop overview...</div>}>
      <ShopOverviewContent />
    </Suspense>
  )
}
