import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface DetailLayoutProps {
  /** The record's sections (concern, inspection, estimate, activity), stacked. */
  children: ReactNode
  /** The side cards: status + next action first, then customer, vehicle, totals. */
  aside: ReactNode
  /** The aside comes first on phones (status and next action before the details). Default true. */
  asideFirstOnMobile?: boolean
  className?: string
}

/**
 * Detail page body (DESIGN.md "Detail pages"): main column + a 360px side column that sticks
 * under the app bar on large screens.
 */
export function DetailLayout({
  children,
  aside,
  asideFirstOnMobile = true,
  className,
}: DetailLayoutProps) {
  return (
    <div
      className={cn(
        'grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] xl:gap-8',
        className,
      )}
    >
      <div className={cn('min-w-0 space-y-6', asideFirstOnMobile && 'order-2 lg:order-1')}>
        {children}
      </div>
      <aside
        className={cn(
          'min-w-0 space-y-6 lg:sticky lg:top-24',
          asideFirstOnMobile && 'order-1 lg:order-2',
        )}
      >
        {aside}
      </aside>
    </div>
  )
}

/**
 * Sticky action bar for phones (DESIGN.md "Sticky mobile actions"): pins the page's main actions
 * to the bottom of the screen below `md`; renders inline from `md` up.
 */
export function StickyActionBar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-20 -mx-4 flex items-center justify-end gap-2 border-t border-border-faint bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:-mx-6 sm:px-6 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none',
        className,
      )}
    >
      {children}
    </div>
  )
}
