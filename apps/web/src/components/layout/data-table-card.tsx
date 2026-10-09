'use client'

import { Search, X } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

export interface DataTableCardProps {
  /** Card title (an `<h2>`); leave out when the page header already names the list. */
  title?: ReactNode
  description?: ReactNode
  /** Buttons on the right of the title row. */
  actions?: ReactNode
  /** The toolbar row under the title: `TableSearch`, filter pills, a result count. */
  toolbar?: ReactNode
  /** The pager row ("1–20 of 312" and the arrows). */
  footer?: ReactNode
  /** The `<Table>` (flush to the card edges), or the stacked mobile list, or an `EmptyState`. */
  children: ReactNode
  className?: string
}

/**
 * Data table card (DESIGN.md "Data tables"): a white rounded card that clips the table to its
 * corners, with an optional title row, toolbar and pager footer.
 */
export function DataTableCard({
  title,
  description,
  actions,
  toolbar,
  footer,
  children,
  className,
}: DataTableCardProps) {
  const hasHeader = Boolean(title || description || actions)
  return (
    <section
      className={cn(
        'overflow-clip rounded-2xl border border-border bg-card text-sm shadow-xs',
        className,
      )}
    >
      {hasHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div className="min-w-0 space-y-0.5">
            {title ? (
              <h2 className="text-lg leading-7 font-semibold text-foreground">{title}</h2>
            ) : null}
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {toolbar ? (
        <div
          className={cn(
            'flex flex-col gap-3 border-b border-border-faint px-5 py-3 max-sm:*:data-[slot=button]:self-start sm:flex-row sm:flex-wrap sm:items-center',
            hasHeader && 'border-t',
          )}
        >
          {toolbar}
        </div>
      ) : null}
      {children}
      {footer ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-faint px-5 py-3 text-sm text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </section>
  )
}

export interface TableSearchProps {
  value: string
  onValueChange: (value: string) => void
  /** Accessible name, e.g. "Search bookings". */
  label: string
  placeholder?: string
  className?: string
}

/** The toolbar's search field: a pill with a search icon and a clear button. */
export function TableSearch({
  value,
  onValueChange,
  label,
  placeholder,
  className,
}: TableSearchProps) {
  return (
    <InputGroup className={cn('h-9 rounded-full sm:w-72', className)}>
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      {value ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            onClick={() => onValueChange('')}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
