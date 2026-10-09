'use client'

import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useNowMinute } from '@/hooks/use-now'
import { formatDateTime, formatRelative } from '@/lib/format'
import type { AuditCategory, AuditEvent } from '@/lib/mock-admin'
import { cn } from '@/lib/utils'

export const CATEGORY_LABEL: Record<AuditCategory, string> = {
  AUTH: 'Sign-in',
  USER: 'Account',
  SHOP: 'Shop',
  MEMBERSHIP: 'Team',
  BOOKING: 'Booking',
  ADMIN: 'Admin',
}

const CATEGORY_TONE: Record<AuditCategory, string> = {
  AUTH: 'border-info-ink/25 bg-info-subtle text-info-ink',
  USER: 'border-status-inspection-border bg-status-inspection-bg text-status-inspection-fg',
  SHOP: 'border-status-handover-border bg-status-handover-bg text-status-handover-fg',
  MEMBERSHIP: 'border-status-parts-border bg-status-parts-bg text-status-parts-fg',
  BOOKING: 'border-status-estimate-border bg-status-estimate-bg text-status-estimate-fg',
  ADMIN: 'border-attention-border bg-attention text-cta',
}

const ROLE_NAME: Record<string, string> = {
  PLATFORM_ADMIN: 'Platform admin',
  OWNER: 'Owner',
  SERVICE_ADVISOR: 'Service Advisor',
  TECHNICIAN: 'Technician',
  PARTS_PERSON: 'Parts Person',
  QC_INSPECTOR: 'QC Inspector',
  CUSTOMER: 'Customer',
  SYSTEM: 'System',
  ANONYMOUS: 'Anonymous',
}

/** Security-relevant events get a red marker in lists. */
export const isAlert = (event: AuditEvent) =>
  event.action === 'auth.login_failed' ||
  event.action === 'auth.login_rate_limited' ||
  event.action === 'shop.suspended' ||
  event.action === 'user.deactivated'

export function CategoryBadge({ category }: { category: AuditCategory }) {
  return <Badge className={CATEGORY_TONE[category]}>{CATEGORY_LABEL[category]}</Badge>
}

/** Audit events, newest first; a row opens the detail sheet. */
export function AuditEventList({
  events,
  empty = 'No events yet.',
  showShop = true,
}: {
  events: ReadonlyArray<AuditEvent>
  empty?: string
  showShop?: boolean
}) {
  const [open, setOpen] = useState<AuditEvent | null>(null)
  const nowIso = useNowMinute()

  if (events.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-muted-foreground">{empty}</p>
  }

  return (
    <>
      <ul className="divide-y divide-border-subtle">
        {events.map((event) => (
          <li key={event.id}>
            <button
              type="button"
              onClick={() => setOpen(event)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-[70ms] ease-productive hover:bg-layer-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <span className="w-24 shrink-0 pt-0.5 text-xs text-helper tabular-nums sm:w-28">
                {nowIso ? formatRelative(event.occurredAt, new Date(nowIso)) : ''}
              </span>
              <span className="min-w-0 flex-1 space-y-1">
                <span className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={event.category} />
                  {isAlert(event) && (
                    <ShieldAlert className="size-3.5 text-danger-ink" aria-label="Security event" />
                  )}
                  <span className="text-sm text-foreground">{event.summary}</span>
                </span>
                <span className="block truncate font-mono text-[11px] text-helper">
                  {event.action}
                  {showShop && event.shop ? ` · ${event.shop.name}` : ''}
                  {event.ip ? ` · ${event.ip}` : ''}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <AuditEventSheet event={open} onClose={() => setOpen(null)} />
    </>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3 border-b border-border-faint py-2.5 text-sm last:border-0">
      <dt className="text-helper">{label}</dt>
      <dd className="min-w-0 break-words text-foreground">{children}</dd>
    </div>
  )
}

function targetHref(event: AuditEvent): string | null {
  if (!event.target) return null
  switch (event.target.type) {
    case 'USER':
      return `/admin/users/${event.target.id}`
    case 'SHOP':
      return `/admin/shops/${event.target.id}`
    case 'BOOKING':
      return `/admin/bookings/${event.target.id}`
    case 'MEMBERSHIP':
      return event.shop ? `/admin/shops/${event.shop.id}` : null
  }
}

export function AuditEventSheet({
  event,
  onClose,
}: {
  event: AuditEvent | null
  onClose: () => void
}) {
  const href = event ? targetHref(event) : null
  return (
    <Sheet open={event !== null} onOpenChange={(next) => !next && onClose()}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {event && (
          <>
            <SheetHeader className="border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <CategoryBadge category={event.category} />
                <span className="font-mono text-xs text-helper">{event.action}</span>
              </div>
              <SheetTitle className="pr-8">{event.summary}</SheetTitle>
              <SheetDescription>{formatDateTime(event.occurredAt)} (Asia/Karachi)</SheetDescription>
            </SheetHeader>
            <dl className="px-4 py-2">
              <Row label="Actor">
                {event.actor ? (
                  <>
                    {event.actor.name}
                    <span className="block text-xs text-muted-foreground">
                      {[event.actor.email, ROLE_NAME[event.actor.role] ?? event.actor.role]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Anonymous</span>
                )}
              </Row>
              <Row label="Shop">
                {event.shop?.name ?? <span className="text-muted-foreground">—</span>}
              </Row>
              <Row label="Target">
                {event.target ? (
                  href ? (
                    <Link
                      href={href}
                      onClick={onClose}
                      className="text-brand-blue-ink hover:underline"
                    >
                      {event.target.label}
                    </Link>
                  ) : (
                    event.target.label
                  )
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
                {event.target && (
                  <span className="block text-xs text-muted-foreground">{event.target.type}</span>
                )}
              </Row>
              <Row label="IP address">
                <span className="font-mono text-xs">{event.ip ?? '—'}</span>
              </Row>
              <Row label="Device">{event.userAgent ?? '—'}</Row>
              <Row label="Request ID">
                <span className="font-mono text-xs">{event.requestId ?? '—'}</span>
              </Row>
              <Row label="Event ID">
                <span className="font-mono text-xs">{event.id}</span>
              </Row>
            </dl>
            <div className="px-4 pb-6">
              <p className="mb-2 text-sm text-helper">Details</p>
              <pre
                className={cn(
                  'max-h-72 overflow-auto bg-field p-3 font-mono text-xs leading-relaxed text-foreground',
                )}
              >
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
