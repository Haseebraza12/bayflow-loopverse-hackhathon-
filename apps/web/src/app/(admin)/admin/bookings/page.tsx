'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { AdminPageHeader, usePaged } from '@/components/admin/admin-ui'
import { StatusBadge } from '@/components/status-badge'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getBookings, getShops } from '@/lib/mock-data'
import { slotSortKey } from '@/lib/slot'
import { STATUS_PHASES, STATUS_PHASE_LABELS, statusPhase, type StatusPhase } from '@/lib/status'

/** A-06 Bookings across every shop (spec 19 §5; E-72 once wired). Read-only. */
export default function AdminBookingsPage() {
  const bookings = useMockStore(getBookings)
  const shops = useMockStore(getShops)
  const [q, setQ] = useState('')
  const [shopId, setShopId] = useState('ALL')
  const [phase, setPhase] = useState<'ALL' | StatusPhase>('ALL')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (
      bookings
        .filter((b) => shopId === 'ALL' || b.shopId === shopId)
        .filter((b) => phase === 'ALL' || statusPhase(b.status) === phase)
        // Slot dates are shop-local YYYY-MM-DD strings, so they compare as text (E-72 date_from/date_to).
        .filter((b) => (!from || b.scheduledDate >= from) && (!to || b.scheduledDate <= to))
        .filter(
          (b) =>
            !needle ||
            [b.reference, b.licensePlate, b.customerName, b.customerEmail]
              .join(' ')
              .toLowerCase()
              .includes(needle),
        )
        .sort((a, b) => slotSortKey(b).localeCompare(slotSortKey(a)))
    )
  }, [bookings, q, shopId, phase, from, to])

  const { rows, pager, reset } = usePaged(filtered)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bookings"
        description="Every booking in every shop, read-only. Shops act on their own bookings."
      />

      <div className="flex flex-col gap-3 bg-layer p-4 md:flex-row md:items-end">
        <InputGroup className="md:max-w-sm">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search bookings"
            placeholder="Reference, plate or customer"
            value={q}
            onChange={(event) => {
              setQ(event.target.value)
              reset()
            }}
          />
        </InputGroup>
        <NativeSelect
          aria-label="Shop"
          value={shopId}
          onChange={(event) => {
            setShopId(event.target.value)
            reset()
          }}
        >
          <NativeSelectOption value="ALL">All shops</NativeSelectOption>
          {shops.map((s) => (
            <NativeSelectOption key={s.id} value={s.id}>
              {s.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Phase"
          value={phase}
          onChange={(event) => {
            setPhase(event.target.value as typeof phase)
            reset()
          }}
        >
          <NativeSelectOption value="ALL">All phases</NativeSelectOption>
          {STATUS_PHASES.map((p) => (
            <NativeSelectOption key={p} value={p}>
              {STATUS_PHASE_LABELS[p]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <label className="flex flex-col gap-1 text-xs text-helper">
          Slot from
          <Input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(event) => {
              setFrom(event.target.value)
              reset()
            }}
            className="w-40"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-helper">
          Slot to
          <Input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(event) => {
              setTo(event.target.value)
              reset()
            }}
            className="w-40"
          />
        </label>
      </div>

      <div className="bg-layer">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Estimate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <Link
                    href={`/admin/bookings/${b.id}`}
                    className="font-mono font-semibold text-brand-blue-ink hover:underline"
                  >
                    {b.reference}
                  </Link>
                </TableCell>
                <TableCell className="text-sm">
                  <Link href={`/admin/shops/${b.shopId}`} className="hover:underline">
                    {b.shopName}
                  </Link>
                </TableCell>
                <TableCell className="text-sm">
                  {b.customerName}
                  <span className="block text-xs text-muted-foreground">{b.customerEmail}</span>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="font-mono">{b.licensePlate}</span>
                  <span className="block text-xs text-muted-foreground">
                    {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {b.scheduledDate} · {b.scheduledTime}
                </TableCell>
                <TableCell>
                  <StatusBadge status={b.status} audience="staff" />
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {b.estimateTotal ? formatPKR(b.estimateTotal) : '—'}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No bookings match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {pager}
      </div>
    </div>
  )
}
