'use client'

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleAlert,
  PackageX,
  Timer,
  CarFront,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { ForbiddenState } from '@/components/feedback/forbidden-state'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMockStore, useMockStoreReady } from '@/hooks/use-mock-store'
import { shopDateKey } from '@/lib/format'
import { IN_PROGRESS_STATUSES, SA_ACTION_STATUSES, isLowStock } from '@/lib/kpis'
import { homePathFor } from '@/lib/mock-auth'
import {
  getBookings,
  getCurrentUser,
  getInventory,
  getShops,
  getTeamMembers,
  setCurrentUser,
  type MockShop,
} from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ShopRow {
  shop: MockShop
  today: number
  needsAction: number
  inProgress: number
  ready: number
  lowStock: number
}

type Metric = Exclude<keyof ShopRow, 'shop'>

const METRICS: ReadonlyArray<{ key: Metric; label: string; icon: LucideIcon; hint: string }> = [
  {
    key: 'today',
    label: "Today's bookings",
    icon: CalendarDays,
    hint: 'Slots today, not cancelled',
  },
  {
    key: 'needsAction',
    label: 'Needs action',
    icon: CircleAlert,
    hint: 'Waiting on a service advisor',
  },
  { key: 'inProgress', label: 'In progress', icon: Timer, hint: 'With technicians, parts or QC' },
  { key: 'ready', label: 'Ready for pick-up', icon: CarFront, hint: 'Passed QC' },
  { key: 'lowStock', label: 'Low stock', icon: PackageX, hint: 'Parts at or below reorder level' },
]

/** O-07 Multi-shop summary (spec 10, P1): one row per owned shop, linking to its overview. */
export default function ShopsSummaryPage() {
  const router = useRouter()
  const ready = useMockStoreReady()
  const user = useMockStore(getCurrentUser)
  const shops = useMockStore(getShops)
  const team = useMockStore(getTeamMembers)
  const bookings = useMockStore(getBookings)
  const parts = useMockStore(getInventory)

  const ownedIds = useMemo(
    () =>
      new Set(
        team
          .filter((m) => m.role === 'OWNER' && m.is_active && m.email === user.email)
          .map((m) => m.shopId),
      ),
    [team, user.email],
  )

  const rows = useMemo<ShopRow[]>(() => {
    // "Today" in the shop's time zone, read only on the client (the rows render after hydration).
    const today = ready ? shopDateKey(new Date()) : ''
    return shops
      .filter((shop) => ownedIds.has(shop.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((shop) => {
        const own = bookings.filter((b) => b.shopId === shop.id)
        return {
          shop,
          today: own.filter((b) => b.scheduledDate === today && b.status !== 'CANCELLED').length,
          needsAction: own.filter((b) => SA_ACTION_STATUSES.has(b.status)).length,
          inProgress: own.filter((b) => IN_PROGRESS_STATUSES.has(b.status)).length,
          ready: own.filter((b) => b.status === 'READY_FOR_PICKUP').length,
          lowStock: parts.filter((p) => p.shopId === shop.id && isLowStock(p)).length,
        }
      })
  }, [shops, ownedIds, bookings, parts, ready])

  const totals = useMemo(() => {
    const sum = (key: Metric) => rows.reduce((total, row) => total + row[key], 0)
    return Object.fromEntries(METRICS.map(({ key }) => [key, sum(key)])) as Record<Metric, number>
  }, [rows])

  const openShop = (shop: MockShop) => {
    setCurrentUser({ ...user, shopId: shop.id, shopName: shop.name })
    router.push(`/pos/shops/${shop.id}/overview`)
  }

  const allowed = user.role === 'OWNER' && ownedIds.size >= 2

  return (
    <main id="main" tabIndex={-1} className="flex-1 bg-canvas outline-none">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-8">
        <Link
          href="/pos"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Workshop hub
        </Link>

        {!ready ? (
          <SummarySkeleton />
        ) : !allowed ? (
          <ForbiddenState
            message="The all-shops summary is for owners of two or more shops."
            homeHref={homePathFor(user)}
          />
        ) : (
          <>
            <PageHeader
              variant="pos"
              title="All shops"
              description="Today across the shops you own, at a glance. Open a shop to act on it."
            />

            <ul className="grid gap-px bg-border-subtle sm:grid-cols-2 xl:grid-cols-5">
              {METRICS.map(({ key, label, icon: Icon, hint }) => (
                <li key={key} className="bg-layer p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {label}
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <p
                    className={cn(
                      'mt-3 font-heading text-4xl leading-none font-bold',
                      key === 'needsAction' && totals[key] > 0 ? 'text-cta' : 'text-foreground',
                    )}
                  >
                    {totals[key]}
                  </p>
                  <p className="mt-2 text-xs text-helper">{hint}</p>
                </li>
              ))}
            </ul>

            <section aria-labelledby="per-shop" className="mt-8">
              <h2 id="per-shop" className="mb-3 type-heading-compact-02 text-foreground">
                By shop
              </h2>

              {/* Phones: one card per shop */}
              <ul className="grid gap-3 md:hidden">
                {rows.map((row) => (
                  <li key={row.shop.id} className="bg-layer p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{row.shop.name}</p>
                        <p className="text-xs text-muted-foreground">{row.shop.city}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => openShop(row.shop)}>
                        Open
                        <ArrowRight data-icon="inline-end" aria-hidden="true" />
                      </Button>
                    </div>
                    <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                      {METRICS.map(({ key, label }) => (
                        <div key={key}>
                          <dt className="text-xs text-helper">{label}</dt>
                          <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
                            {row[key]}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>

              {/* Tablet and up: a data table */}
              <div className="hidden bg-layer md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shop</TableHead>
                      {METRICS.map(({ key, label }) => (
                        <TableHead key={key} className="text-right">
                          {label}
                        </TableHead>
                      ))}
                      <TableHead className="w-0">
                        <span className="sr-only">Open</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.shop.id}>
                        <TableCell>
                          <span className="block font-semibold text-foreground">
                            {row.shop.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {row.shop.city}
                          </span>
                        </TableCell>
                        {METRICS.map(({ key }) => (
                          <TableCell key={key} className="text-right tabular-nums">
                            {key === 'needsAction' && row[key] > 0 ? (
                              <span className="inline-flex min-w-7 justify-center rounded-full border border-attention-border bg-attention px-2 py-0.5 text-xs font-semibold text-cta">
                                {row[key]}
                              </span>
                            ) : (
                              row[key]
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openShop(row.shop)}
                            aria-label={`Open ${row.shop.name}`}
                            className="text-brand-blue-ink hover:text-brand-blue-ink"
                          >
                            Open
                            <ArrowRight data-icon="inline-end" aria-hidden="true" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-semibold">All shops</TableCell>
                      {METRICS.map(({ key }) => (
                        <TableCell key={key} className="text-right font-semibold tabular-nums">
                          {totals[key]}
                        </TableCell>
                      ))}
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

function SummarySkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading the summary">
      <Skeleton className="h-9 w-48" />
      <div className="grid gap-px sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-48" />
    </div>
  )
}
