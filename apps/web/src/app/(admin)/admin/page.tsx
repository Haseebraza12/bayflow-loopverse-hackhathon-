'use client'

import { ArrowRight, CalendarCheck, ShieldAlert, Store, Timer, Users } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { AdminPageHeader, StatTile, Tile } from '@/components/admin/admin-ui'
import { AuditEventList } from '@/components/admin/audit-events'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useMockStore } from '@/hooks/use-mock-store'
import { useNowMinute } from '@/hooks/use-now'
import { shopDateKey } from '@/lib/format'
import { getAdminShops, getAdminUsers, getAuditEvents } from '@/lib/mock-admin'
import { getBookings } from '@/lib/mock-data'
import { STATUS_PHASES, STATUS_PHASE_LABELS, statusPhase, type StatusPhase } from '@/lib/status'
import { cn } from '@/lib/utils'

const OPEN_PHASES = STATUS_PHASES.filter((p) => p !== 'CLOSED')

const PHASE_FILL: Record<StatusPhase, string> = {
  INTAKE: 'bg-status-intake-fg',
  INSPECTION: 'bg-status-inspection-fg',
  ESTIMATE: 'bg-status-estimate-fg',
  PARTS: 'bg-status-parts-fg',
  REPAIR_QC: 'bg-status-repair-qc-fg',
  HANDOVER: 'bg-status-handover-fg',
  CLOSED: 'bg-status-closed-fg',
}

const DAY_MS = 24 * 60 * 60 * 1000

/** A-01 Platform overview (spec 19 §5; E-61 once wired). */
export default function AdminOverviewPage() {
  const users = useMockStore(getAdminUsers)
  const tenants = useMockStore(getAdminShops)
  const bookings = useMockStore(getBookings)
  const audit = useMockStore(getAuditEvents)

  const nowIso = useNowMinute()
  const stats = useMemo(() => {
    const now = nowIso ? new Date(nowIso) : new Date(0)
    const today = shopDateKey(now)
    const open = bookings.filter((b) => statusPhase(b.status) !== 'CLOSED')
    const days = Array.from({ length: 14 }, (_, i) =>
      shopDateKey(new Date(now.getTime() - (13 - i) * DAY_MS)),
    )
    const activity = days.map((day) => ({
      day,
      events: audit.filter((e) => shopDateKey(e.occurredAt) === day).length,
      bookings: bookings.filter((b) => shopDateKey(b.createdAt) === day).length,
    }))
    const failedLogins24h = audit.filter(
      (e) => e.action === 'auth.login_failed' && now.getTime() - Date.parse(e.occurredAt) < DAY_MS,
    ).length
    return {
      shops: tenants.length,
      suspended: tenants.filter((t) => t.suspension),
      users: users.length,
      customers: users.filter((u) => u.kind === 'CUSTOMER').length,
      staff: users.filter((u) => u.kind === 'STAFF').length,
      admins: users.filter((u) => u.isPlatformAdmin && u.isActive).length,
      bookingsToday: bookings.filter((b) => b.scheduledDate === today && b.status !== 'CANCELLED')
        .length,
      open: open.length,
      byPhase: OPEN_PHASES.map((phase) => ({
        phase,
        count: open.filter((b) => statusPhase(b.status) === phase).length,
      })),
      activity,
      failedLogins24h,
      topShops: [...tenants].sort((a, b) => b.bookingsTotal - a.bookingsTotal).slice(0, 5),
    }
  }, [users, tenants, bookings, audit, nowIso])

  const [series, setSeries] = useState<'bookings' | 'events'>('bookings')
  const valueOf = (d: (typeof stats.activity)[number]) =>
    series === 'bookings' ? d.bookings : d.events
  const maxValue = Math.max(1, ...stats.activity.map(valueOf))

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Platform overview"
        description="Every tenant, account and booking on BayFlow, and what changed recently."
      />

      <ul className="grid gap-px bg-border-subtle sm:grid-cols-2 xl:grid-cols-5">
        <li>
          <StatTile
            label="Shops"
            value={stats.shops}
            hint={`${stats.shops - stats.suspended.length} active · ${stats.suspended.length} suspended`}
            icon={Store}
          />
        </li>
        <li>
          <StatTile
            label="Accounts"
            value={stats.users}
            hint={`${stats.customers} customers · ${stats.staff} staff · ${stats.admins} admins`}
            icon={Users}
          />
        </li>
        <li>
          <StatTile
            label="Bookings today"
            value={stats.bookingsToday}
            hint="Slots today, not cancelled"
            icon={CalendarCheck}
          />
        </li>
        <li>
          <StatTile
            label="Open bookings"
            value={stats.open}
            hint="Not completed or cancelled"
            icon={Timer}
          />
        </li>
        <li>
          <StatTile
            label="Failed sign-ins"
            value={stats.failedLogins24h}
            hint="Last 24 hours"
            icon={ShieldAlert}
            tone={stats.failedLogins24h > 0 ? 'danger' : 'default'}
          />
        </li>
      </ul>

      <div className="grid gap-6 xl:grid-cols-3">
        <Tile
          title={series === 'bookings' ? 'Bookings, last 14 days' : 'Activity, last 14 days'}
          description={
            series === 'bookings'
              ? 'New bookings per day across all shops (Asia/Karachi)'
              : 'Audit events per day (Asia/Karachi)'
          }
          className="xl:col-span-2"
          actions={
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              spacing={0}
              value={series}
              onValueChange={(value) => value && setSeries(value as typeof series)}
              aria-label="Chart series"
            >
              <ToggleGroupItem value="bookings">Bookings</ToggleGroupItem>
              <ToggleGroupItem value="events">Activity</ToggleGroupItem>
            </ToggleGroup>
          }
        >
          <div className="flex h-44 items-end gap-1.5" aria-hidden="true">
            {stats.activity.map((d) => (
              <div key={d.day} className="flex h-full flex-1 flex-col justify-end gap-1">
                <div
                  className="w-full bg-brand-blue/85 transition-[height] duration-[240ms] ease-productive"
                  style={{
                    height: `${(valueOf(d) / maxValue) * 100}%`,
                    minHeight: valueOf(d) ? 2 : 0,
                  }}
                  title={`${d.day}: ${d.events} events, ${d.bookings} new bookings`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-helper tabular-nums">
            <span>{stats.activity[0]?.day}</span>
            <span>{stats.activity.at(-1)?.day}</span>
          </div>
          <table className="sr-only">
            <caption>Audit events and new bookings per day</caption>
            <thead>
              <tr>
                <th>Day</th>
                <th>Events</th>
                <th>New bookings</th>
              </tr>
            </thead>
            <tbody>
              {stats.activity.map((d) => (
                <tr key={d.day}>
                  <td>{d.day}</td>
                  <td>{d.events}</td>
                  <td>{d.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tile>

        <Tile title="Open bookings by phase" description={`${stats.open} across all shops`}>
          <div className="flex h-3 w-full overflow-hidden bg-layer-accent" aria-hidden="true">
            {stats.byPhase.map(({ phase, count }) =>
              count ? (
                <span
                  key={phase}
                  className={PHASE_FILL[phase]}
                  style={{ width: `${(count / Math.max(1, stats.open)) * 100}%` }}
                />
              ) : null,
            )}
          </div>
          <ul className="mt-4 space-y-2">
            {stats.byPhase.map(({ phase, count }) => (
              <li key={phase} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className={cn('size-2.5 rounded-full', PHASE_FILL[phase])}
                  />
                  {STATUS_PHASE_LABELS[phase]}
                </span>
                <span className="font-semibold text-foreground tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </Tile>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Tile title="Busiest shops" description="By bookings" flush>
          <ol className="divide-y divide-border-subtle">
            {stats.topShops.map((t, index) => (
              <li key={t.shop.id}>
                <Link
                  href={`/admin/shops/${t.shop.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-layer-hover"
                >
                  <span className="w-5 text-sm text-helper tabular-nums">{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {t.shop.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">{t.shop.city}</span>
                  </span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {t.bookingsTotal}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Tile>

        <Tile
          title="Recent activity"
          description="Newest audit events"
          className="xl:col-span-2"
          flush
          actions={
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-brand-blue-ink hover:text-brand-blue-ink"
            >
              <Link href="/admin/audit">
                Audit log
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          }
        >
          <AuditEventList events={audit.slice(0, 8)} />
        </Tile>
      </div>

      {stats.suspended.length > 0 && (
        <Tile
          title="Suspended shops"
          description="Hidden from customers and closed to their staff"
          flush
        >
          <ul className="divide-y divide-border-subtle">
            {stats.suspended.map((t) => (
              <li key={t.shop.id}>
                <Link
                  href={`/admin/shops/${t.shop.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-layer-hover"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{t.shop.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {t.suspension?.reason}
                    </span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-subtle-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Tile>
      )}
    </div>
  )
}
