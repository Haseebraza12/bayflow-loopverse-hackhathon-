import { Construction } from 'lucide-react'
import type { ReactNode } from 'react'

import { PageHeader } from '@/components/layout/page-header'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

export interface ScreenPlaceholderProps {
  /** Screen ID from spec 10 (e.g. `SA-01`). */
  screenId: string
  /** The page `<h1>`. */
  title: string
  /** What the screen is for (spec 10 "Purpose"). */
  description: string
  variant?: 'portal' | 'pos'
  actions?: ReactNode
  /** Route facts worth showing (e.g. the booking ID from the URL). Never fake data. */
  children?: ReactNode
}

/**
 * Route-skeleton placeholder: the right shell, a real `<h1>`, and an honest "not built yet"
 * state. Feature work replaces it with the screen defined in spec 10.
 */
export function ScreenPlaceholder({
  screenId,
  title,
  description,
  variant = 'portal',
  actions,
  children,
}: ScreenPlaceholderProps) {
  return (
    <div className={variant === 'portal' ? 'space-y-8' : 'space-y-6'}>
      <PageHeader title={title} description={description} actions={actions} variant={variant} />
      {children}
      <Empty className="border border-dashed bg-background" data-screen={screenId}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Construction aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Coming soon</EmptyTitle>
          <EmptyDescription>
            This screen ({screenId}) is part of the next build phase.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
