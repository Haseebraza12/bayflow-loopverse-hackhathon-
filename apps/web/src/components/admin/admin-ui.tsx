'use client'

import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AdminShop, AdminUser, AdminUserKind, StaffRole } from '@/lib/mock-admin'
import { cn } from '@/lib/utils'

/** Page title row of the console (Carbon `heading-04`, spec 19 §5). */
export function AdminPageHeader({
  title,
  description,
  back,
  actions,
  badges,
}: {
  title: string
  description?: ReactNode
  back?: { href: string; label: string }
  actions?: ReactNode
  badges?: ReactNode
}) {
  return (
    <div className="space-y-3 pb-6">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="type-heading-04 text-foreground">{title}</h1>
            {badges}
          </div>
          {description && (
            <p className="max-w-prose type-body-01 text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  )
}

/** A Carbon tile with a title row. */
export function Tile({
  title,
  description,
  actions,
  children,
  className,
  flush = false,
}: {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  /** No inner padding (tables and lists run edge to edge). */
  flush?: boolean
}) {
  return (
    <section className={cn('bg-layer', className)}>
      {title && (
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
          <div>
            <h2 className="type-heading-compact-02 text-foreground">{title}</h2>
            {description && <p className="mt-0.5 type-helper-01">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={flush ? undefined : 'px-4 pb-4'}>{children}</div>
    </section>
  )
}

export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default',
}: {
  label: string
  value: number | string
  hint?: string
  icon: LucideIcon
  tone?: 'default' | 'attention' | 'danger'
}) {
  return (
    <div className="bg-layer p-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <p
        className={cn(
          'mt-3 font-heading text-4xl leading-none font-bold tabular-nums',
          tone === 'attention' && 'text-cta',
          tone === 'danger' && 'text-danger-ink',
          tone === 'default' && 'text-foreground',
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-helper">{hint}</p>}
    </div>
  )
}

/** Client-side paging over an already filtered list (E-6x lists page server-side once wired). */
export function usePaged<T>(items: ReadonlyArray<T>, pageSize = 20) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(page, pages - 1)
  return {
    rows: items.slice(current * pageSize, (current + 1) * pageSize),
    pager: (
      <Pager
        page={current}
        pages={pages}
        total={items.length}
        pageSize={pageSize}
        onPage={setPage}
      />
    ),
    reset: () => setPage(0),
  }
}

function Pager({
  page,
  pages,
  total,
  pageSize,
  onPage,
}: {
  page: number
  pages: number
  total: number
  pageSize: number
  onPage: (page: number) => void
}) {
  if (total === 0) return null
  const from = page * pageSize + 1
  const to = Math.min(total, (page + 1) * pageSize)
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-3 border-t border-border-subtle px-4 py-2 text-sm text-muted-foreground"
    >
      <span className="tabular-nums">
        {from}–{to} of {total}
      </span>
      <span className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous page"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <span className="tabular-nums">
          {page + 1} / {pages}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next page"
          disabled={page >= pages - 1}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </span>
    </nav>
  )
}

export function ShopStatusBadges({ tenant }: { tenant: AdminShop }) {
  return (
    <>
      {tenant.suspension ? (
        <Badge className="border-danger-ink/30 bg-danger-subtle text-danger-ink">Suspended</Badge>
      ) : (
        <Badge className="border-success-ink/30 bg-success-subtle text-success-ink">Active</Badge>
      )}
      {!tenant.shop.is_listed && (
        <Badge className="border-border bg-secondary text-muted-foreground">Unlisted</Badge>
      )}
    </>
  )
}

export function UserStatusBadge({ user }: { user: Pick<AdminUser, 'isActive'> }) {
  return user.isActive ? (
    <Badge className="border-success-ink/30 bg-success-subtle text-success-ink">Active</Badge>
  ) : (
    <Badge className="border-danger-ink/30 bg-danger-subtle text-danger-ink">Deactivated</Badge>
  )
}

const KIND_LABEL: Record<AdminUserKind, string> = {
  CUSTOMER: 'Customer',
  STAFF: 'Staff',
  PLATFORM_ADMIN: 'Platform admin',
}

export function KindBadge({ kind }: { kind: AdminUserKind }) {
  return (
    <Badge
      className={cn(
        kind === 'PLATFORM_ADMIN' && 'border-brand-orange/40 bg-attention text-cta',
        kind === 'STAFF' && 'border-brand-blue/30 bg-brand-blue-subtle text-brand-blue-ink',
        kind === 'CUSTOMER' && 'border-border bg-secondary text-muted-foreground',
      )}
    >
      {KIND_LABEL[kind]}
    </Badge>
  )
}

export const ROLE_LABEL: Record<StaffRole, string> = {
  OWNER: 'Owner',
  SERVICE_ADVISOR: 'Service Advisor',
  TECHNICIAN: 'Technician',
  PARTS_PERSON: 'Parts Person',
  QC_INSPECTOR: 'QC Inspector',
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
