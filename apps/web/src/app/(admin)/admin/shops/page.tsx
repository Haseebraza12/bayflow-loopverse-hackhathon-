'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { AdminPageHeader, ShopStatusBadges, usePaged } from '@/components/admin/admin-ui'
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
import { formatDate } from '@/lib/format'
import { getAdminShops } from '@/lib/mock-admin'

/** A-02 Shops (spec 19 §5; E-62 once wired). */
export default function AdminShopsPage() {
  const tenants = useMockStore(getAdminShops)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL')
  const [city, setCity] = useState('ALL')
  const [listed, setListed] = useState<'ALL' | 'LISTED' | 'UNLISTED'>('ALL')

  const cities = useMemo(
    () => [...new Set(tenants.map((t) => t.shop.city))].sort((a, b) => a.localeCompare(b)),
    [tenants],
  )

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return tenants
      .filter((t) =>
        status === 'ALL' ? true : status === 'SUSPENDED' ? t.suspension : !t.suspension,
      )
      .filter((t) => city === 'ALL' || t.shop.city === city)
      .filter((t) => listed === 'ALL' || (listed === 'LISTED') === t.shop.is_listed)
      .filter(
        (t) =>
          !needle ||
          [t.shop.name, t.shop.slug, t.shop.city, ...t.owners.map((o) => o.email)]
            .join(' ')
            .toLowerCase()
            .includes(needle),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [tenants, q, status, city, listed])

  const { rows, pager, reset } = usePaged(filtered)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Shops"
        description="Every tenant on BayFlow. Open a shop to see its team and bookings, or to suspend it."
      />

      <div className="flex flex-col gap-3 bg-layer p-4 md:flex-row md:items-end">
        <InputGroup className="md:max-w-sm">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search shops"
            placeholder="Name, city or owner e-mail"
            value={q}
            onChange={(event) => {
              setQ(event.target.value)
              reset()
            }}
          />
        </InputGroup>
        <NativeSelect
          aria-label="Status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as typeof status)
            reset()
          }}
        >
          <NativeSelectOption value="ALL">All statuses</NativeSelectOption>
          <NativeSelectOption value="ACTIVE">Active</NativeSelectOption>
          <NativeSelectOption value="SUSPENDED">Suspended</NativeSelectOption>
        </NativeSelect>
        <NativeSelect
          aria-label="City"
          value={city}
          onChange={(event) => {
            setCity(event.target.value)
            reset()
          }}
        >
          <NativeSelectOption value="ALL">All cities</NativeSelectOption>
          {cities.map((c) => (
            <NativeSelectOption key={c} value={c}>
              {c}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Directory listing"
          value={listed}
          onChange={(event) => {
            setListed(event.target.value as typeof listed)
            reset()
          }}
        >
          <NativeSelectOption value="ALL">Listed and unlisted</NativeSelectOption>
          <NativeSelectOption value="LISTED">Listed</NativeSelectOption>
          <NativeSelectOption value="UNLISTED">Unlisted</NativeSelectOption>
        </NativeSelect>
      </div>

      <div className="bg-layer">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Members</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((t) => (
              <TableRow key={t.shop.id}>
                <TableCell>
                  <Link
                    href={`/admin/shops/${t.shop.id}`}
                    className="font-semibold text-brand-blue-ink hover:underline"
                  >
                    {t.shop.name}
                  </Link>
                  <span className="block text-xs text-muted-foreground">{t.shop.city}</span>
                </TableCell>
                <TableCell>
                  {t.owners.length ? (
                    t.owners.map((o) => (
                      <span key={o.email} className="block">
                        <span className="text-sm text-foreground">{o.name}</span>
                        <span className="block text-xs text-muted-foreground">{o.email}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-danger-ink">No active owner</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="flex flex-wrap gap-1">
                    <ShopStatusBadges tenant={t} />
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">{t.activeMembers}</TableCell>
                <TableCell className="text-right tabular-nums">{t.bookingsTotal}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(t.createdAt)}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No shops match these filters.
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
