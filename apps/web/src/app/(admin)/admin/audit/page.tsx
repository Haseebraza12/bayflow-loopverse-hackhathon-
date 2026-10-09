'use client'

import { Download, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useAdminActor } from '@/components/admin/admin-shell'
import { AdminPageHeader, usePaged } from '@/components/admin/admin-ui'
import { AuditEventList, CATEGORY_LABEL } from '@/components/admin/audit-events'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useMockStore } from '@/hooks/use-mock-store'
import { useNowMinute } from '@/hooks/use-now'
import {
  AUDIT_EXPORT_LIMIT,
  auditCsv,
  getAuditEvents,
  recordAuditExport,
  type AuditCategory,
} from '@/lib/mock-admin'
import { getShops } from '@/lib/mock-data'

const PERIODS = {
  '24h': { label: 'Last 24 hours', ms: 24 * 36e5 },
  '7d': { label: 'Last 7 days', ms: 7 * 24 * 36e5 },
  '30d': { label: 'Last 30 days', ms: 30 * 24 * 36e5 },
  all: { label: 'All time', ms: Number.POSITIVE_INFINITY },
} as const

type Period = keyof typeof PERIODS

/** A-08 Audit log (spec 19 §5; E-74 and E-75 once wired). */
export default function AdminAuditPage() {
  const { user } = useAdminActor()
  const events = useMockStore(getAuditEvents)
  const shops = useMockStore(getShops)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<'ALL' | AuditCategory>('ALL')
  const [shopId, setShopId] = useState('ALL')
  const [period, setPeriod] = useState<Period>('30d')

  const nowIso = useNowMinute()
  const filtered = useMemo(() => {
    const now = nowIso ? Date.parse(nowIso) : Number.POSITIVE_INFINITY
    const needle = q.trim().toLowerCase()
    return events
      .filter((e) => category === 'ALL' || e.category === category)
      .filter((e) => shopId === 'ALL' || e.shop?.id === shopId)
      .filter((e) => now - Date.parse(e.occurredAt) <= PERIODS[period].ms)
      .filter(
        (e) =>
          !needle ||
          [
            e.summary,
            e.action,
            e.actor?.name ?? '',
            e.actor?.email ?? '',
            e.target?.label ?? '',
            e.ip ?? '',
          ]
            .join(' ')
            .toLowerCase()
            .includes(needle),
      )
  }, [events, q, category, shopId, period, nowIso])

  const { rows, pager, reset } = usePaged(filtered, 25)

  const exportCsv = () => {
    const csv = auditCsv(filtered)
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bayflow-audit-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    const rowsExported = Math.min(filtered.length, AUDIT_EXPORT_LIMIT)
    recordAuditExport({ q: q || null, category, shop_id: shopId, period }, rowsExported, {
      name: user.name,
      email: user.email,
    })
    toast.success(`Exported ${rowsExported} ${rowsExported === 1 ? 'event' : 'events'}`)
  }

  const change =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value)
      reset()
    }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit log"
        description="Who did what, where and when, across every shop. Entries can't be edited or deleted."
        actions={
          <Button
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-hover"
          >
            <Download data-icon="inline-start" aria-hidden="true" />
            Export CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-3 bg-layer p-4 lg:flex-row lg:items-end">
        <InputGroup className="lg:max-w-sm">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search the audit log"
            placeholder="Person, reference, action or IP"
            value={q}
            onChange={(event) => change(setQ)(event.target.value)}
          />
        </InputGroup>
        <NativeSelect
          aria-label="Category"
          value={category}
          onChange={(event) => change(setCategory)(event.target.value as typeof category)}
        >
          <NativeSelectOption value="ALL">All categories</NativeSelectOption>
          {(Object.keys(CATEGORY_LABEL) as AuditCategory[]).map((c) => (
            <NativeSelectOption key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Shop"
          value={shopId}
          onChange={(event) => change(setShopId)(event.target.value)}
        >
          <NativeSelectOption value="ALL">All shops</NativeSelectOption>
          {shops.map((s) => (
            <NativeSelectOption key={s.id} value={s.id}>
              {s.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Period"
          value={period}
          onChange={(event) => change(setPeriod)(event.target.value as Period)}
        >
          {(Object.keys(PERIODS) as Period[]).map((p) => (
            <NativeSelectOption key={p} value={p}>
              {PERIODS[p].label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="bg-layer">
        <p className="border-b border-border-subtle px-4 py-2.5 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
        </p>
        <AuditEventList events={rows} empty="No events match these filters." />
        {pager}
      </div>
    </div>
  )
}
