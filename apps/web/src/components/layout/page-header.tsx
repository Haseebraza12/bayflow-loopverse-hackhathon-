import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  /** The page's only `<h1>` (UX rule R8). */
  title: string
  description?: ReactNode
  /** Header actions, e.g. one primary button (UX rule R7). */
  actions?: ReactNode
  /** Portal h1 = text-3xl/700, POS h1 = text-2xl/600 (spec 09 §3.6). */
  variant?: 'portal' | 'pos'
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  variant = 'portal',
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="space-y-1">
        <h1
          className={cn(
            'tracking-tight text-foreground',
            variant === 'portal' ? 'text-3xl font-bold' : 'text-2xl font-semibold',
          )}
        >
          {title}
        </h1>
        {description ? <p className="max-w-prose text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}
