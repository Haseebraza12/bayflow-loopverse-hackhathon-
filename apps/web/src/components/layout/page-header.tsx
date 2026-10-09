import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  /** The page's only `<h1>` (UX rule R8). */
  title: string
  description?: ReactNode
  /** Header actions, e.g. one primary button (UX rule R7). */
  actions?: ReactNode
  /** Carbon page header: portal h1 = heading-05 (32px), POS h1 = heading-04 (28px). */
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
      className={cn('flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="space-y-2">
        <h1
          className={cn(
            'text-foreground',
            variant === 'portal' ? 'type-heading-05' : 'type-heading-04',
          )}
        >
          {title}
        </h1>
        {description ? <p className="max-w-prose type-body-01 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}
