'use client'

import { Eye } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { useAdminActor } from '@/components/admin/admin-shell'
import { AdminPageHeader, Tile } from '@/components/admin/admin-ui'
import { NotFoundPanel } from '@/components/admin/not-found-panel'
import { StatusBadge } from '@/components/status-badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatDateTime, formatPKR } from '@/lib/format'
import { getAdminUsers, recordAdminView } from '@/lib/mock-admin'
import { bookingHistory } from '@/lib/mock-booking-history'
import { getBookings } from '@/lib/mock-data'
import { statusLabel } from '@/lib/status'

const ROLE_NAME = {
  CUSTOMER: 'Customer',
  SERVICE_ADVISOR: 'Service Advisor',
  TECHNICIAN: 'Technician',
  PARTS_PERSON: 'Parts Person',
  QC_INSPECTOR: 'QC Inspector',
} as const

/** A-07 Booking detail, read-only (spec 19 §5; E-73 once wired). */
export default function AdminBookingPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const { user: me } = useAdminActor()
  const bookings = useMockStore(getBookings)
  const users = useMockStore(getAdminUsers)
  const booking = bookings.find((b) => b.id === bookingId)
  const actor = useMemo(() => ({ name: me.name, email: me.email }), [me.name, me.email])

  // E-73 records that an admin opened this booking (D95).
  const reference = booking?.reference
  const shopId = booking?.shopId
  const shopName = booking?.shopName
  const shopSlug = booking?.shopSlug
  useEffect(() => {
    if (!bookingId || !reference || !shopId || !shopName || !shopSlug) return
    recordAdminView(
      'booking',
      { id: bookingId, label: reference, shop: { id: shopId, name: shopName, slug: shopSlug } },
      actor,
    )
  }, [bookingId, reference, shopId, shopName, shopSlug, actor])

  if (!booking) return <NotFoundPanel backHref="/admin/bookings" backLabel="All bookings" />

  const customer = users.find((u) => u.email === booking.customerEmail.toLowerCase())
  const timeline = [...bookingHistory(booking)].reverse()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        back={{ href: '/admin/bookings', label: 'All bookings' }}
        title={booking.reference}
        badges={<StatusBadge status={booking.status} audience="staff" size="md" />}
        description={`${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel} · ${booking.licensePlate} · ${booking.scheduledDate} at ${booking.scheduledTime}`}
      />

      <Alert variant="info">
        <Eye aria-hidden="true" />
        <AlertDescription>
          Read-only view. The shop&apos;s staff act on this booking from their POS; opening it here
          is recorded in the audit log.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 xl:grid-cols-3">
        <Tile title="Booking">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-helper">Shop</dt>
              <dd>
                <Link
                  href={`/admin/shops/${booking.shopId}`}
                  className="text-brand-blue-ink hover:underline"
                >
                  {booking.shopName}
                </Link>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-helper">Customer</dt>
              <dd className="text-right">
                {customer ? (
                  <Link
                    href={`/admin/users/${customer.id}`}
                    className="text-brand-blue-ink hover:underline"
                  >
                    {booking.customerName}
                  </Link>
                ) : (
                  booking.customerName
                )}
                <span className="block text-xs text-muted-foreground">{booking.customerPhone}</span>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-helper">Technician</dt>
              <dd className="text-foreground">{booking.assignedTechnicianName ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-helper">Services</dt>
              <dd className="text-right text-foreground">{booking.services.join(', ')}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-helper">Created</dt>
              <dd className="text-foreground">{formatDateTime(booking.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-helper">Last update</dt>
              <dd className="text-foreground">{formatDateTime(booking.updatedAt)}</dd>
            </div>
          </dl>
          {(booking.inspectionNotes || booking.qcNotes) && (
            <div className="mt-4 space-y-2 border-t border-border-subtle pt-3 text-sm">
              {booking.inspectionNotes && (
                <p>
                  <span className="text-helper">Technician notes: </span>
                  {booking.inspectionNotes}
                </p>
              )}
              {booking.qcNotes && (
                <p>
                  <span className="text-helper">QC notes: </span>
                  {booking.qcNotes}
                </p>
              )}
            </div>
          )}
        </Tile>

        <Tile title="Estimate" className="xl:col-span-2" flush>
          {booking.estimateItems.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {booking.estimateItems.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="text-sm">{line.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {line.type === 'PART' ? 'Part' : 'Labour'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{line.quantity}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPKR(line.unit_price)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPKR(line.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatPKR(booking.estimateTotal)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          ) : (
            <p className="px-4 pb-6 text-sm text-muted-foreground">No estimate yet.</p>
          )}
        </Tile>
      </div>

      <Tile title="Timeline" description="Every step, newest first, with who did it">
        <ol className="relative space-y-4 border-l border-border-subtle pl-6">
          {timeline.map((step) => (
            <li key={`${step.status}-${step.at}`} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-brand-blue ring-4 ring-layer"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {statusLabel(step.status, 'staff')}
                </p>
                <time className="text-xs text-helper tabular-nums" dateTime={step.at}>
                  {formatDateTime(step.at)}
                </time>
              </div>
              <p className="text-xs text-muted-foreground">
                {step.actorName} · {ROLE_NAME[step.actorRole]} ·{' '}
                <span className="font-mono">{step.action}</span>
              </p>
            </li>
          ))}
        </ol>
      </Tile>
    </div>
  )
}
