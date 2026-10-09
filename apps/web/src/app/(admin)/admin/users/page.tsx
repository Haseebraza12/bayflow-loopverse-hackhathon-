'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import {
  AdminPageHeader,
  KindBadge,
  ROLE_LABEL,
  UserStatusBadge,
  usePaged,
} from '@/components/admin/admin-ui'
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
import { useNowMinute } from '@/hooks/use-now'
import { formatDate, formatRelative } from '@/lib/format'
import { getAdminUsers, type AdminUserKind } from '@/lib/mock-admin'

/** A-04 Users (spec 19 §5; E-66 once wired). */
export default function AdminUsersPage() {
  const users = useMockStore(getAdminUsers)
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<'ALL' | AdminUserKind>('ALL')
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return users
      .filter((u) => kind === 'ALL' || u.kind === kind)
      .filter((u) => status === 'ALL' || (status === 'ACTIVE' ? u.isActive : !u.isActive))
      .filter(
        (u) => !needle || [u.name, u.email, u.phone ?? ''].join(' ').toLowerCase().includes(needle),
      )
  }, [users, q, kind, status])

  const { rows, pager, reset } = usePaged(filtered)
  const nowIso = useNowMinute()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="Every account: customers, shop staff and platform admins."
      />

      <div className="flex flex-col gap-3 bg-layer p-4 md:flex-row md:items-end">
        <InputGroup className="md:max-w-sm">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search users"
            placeholder="Name, e-mail or phone"
            value={q}
            onChange={(event) => {
              setQ(event.target.value)
              reset()
            }}
          />
        </InputGroup>
        <NativeSelect
          aria-label="Kind"
          value={kind}
          onChange={(event) => {
            setKind(event.target.value as typeof kind)
            reset()
          }}
        >
          <NativeSelectOption value="ALL">All kinds</NativeSelectOption>
          <NativeSelectOption value="CUSTOMER">Customers</NativeSelectOption>
          <NativeSelectOption value="STAFF">Shop staff</NativeSelectOption>
          <NativeSelectOption value="PLATFORM_ADMIN">Platform admins</NativeSelectOption>
        </NativeSelect>
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
          <NativeSelectOption value="INACTIVE">Deactivated</NativeSelectOption>
        </NativeSelect>
      </div>

      <div className="bg-layer">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead>Memberships</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last sign-in</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="font-semibold text-brand-blue-ink hover:underline"
                  >
                    {u.name}
                  </Link>
                  <span className="block text-xs text-muted-foreground">{u.email}</span>
                </TableCell>
                <TableCell>
                  <KindBadge kind={u.kind} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {u.memberships.length
                    ? u.memberships.map((m) => (
                        <span key={m.shopId} className="block">
                          {ROLE_LABEL[m.role]} · {m.shopName}
                        </span>
                      ))
                    : '—'}
                </TableCell>
                <TableCell>
                  <UserStatusBadge user={u} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {u.lastLoginAt
                    ? nowIso
                      ? formatRelative(u.lastLoginAt, new Date(nowIso))
                      : ''
                    : 'Never'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(u.createdAt)}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No accounts match these filters.
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
