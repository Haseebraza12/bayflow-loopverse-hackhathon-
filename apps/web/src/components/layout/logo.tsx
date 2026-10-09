import { Wrench } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface LogoProps {
  /** `light` = navy wordmark for white surfaces; `dark` = white wordmark for navy surfaces. */
  tone?: 'light' | 'dark'
  className?: string
}

/** BayFlow wordmark. Decorative mark + text; wrap it in a link with its own accessible name. */
export function Logo({ tone = 'light', className }: LogoProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-lg font-semibold tracking-tight',
        tone === 'dark' ? 'text-nav-foreground' : 'text-brand-navy',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-8 items-center justify-center rounded-lg',
          tone === 'dark' ? 'bg-nav-hover' : 'bg-brand-navy',
        )}
      >
        <Wrench className="size-4 text-brand-orange-on-dark" strokeWidth={2.25} />
      </span>
      BayFlow
    </span>
  )
}
