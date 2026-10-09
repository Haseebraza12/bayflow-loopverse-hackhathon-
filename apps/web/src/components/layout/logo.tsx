import { Wrench01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { cn } from '@/lib/utils'

export interface LogoProps {
  /** `light` = dark wordmark for white surfaces; `dark` = white wordmark for dark surfaces. */
  tone?: 'light' | 'dark'
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/** BayFlow brand logo with wrench mark and bold wordmark. */
export function Logo({ tone = 'light', className, showText = true, size = 'md' }: LogoProps) {
  const markSizes = {
    sm: 'h-7 w-8',
    md: 'h-9 w-[2.625rem]',
    lg: 'h-11 w-[3.25rem]',
  }
  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl font-black',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 tracking-tight select-none',
        tone === 'dark' ? 'text-white' : 'text-[#111827]',
        className,
      )}
    >
      {/* Uses `currentColor`, so it inverts on dark surfaces. */}
      <HugeiconsIcon
        icon={Wrench01Icon}
        aria-hidden="true"
        className={cn('shrink-0 transition-transform duration-200 hover:scale-105', markSizes[size])}
      />
      {showText && (
        <span className={cn('tracking-tight font-sans', textSizes[size])}>
          BayFlow
        </span>
      )}
    </span>
  )
}
