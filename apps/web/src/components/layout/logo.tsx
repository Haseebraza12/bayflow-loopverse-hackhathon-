import { Wrench } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface LogoProps {
  /** `light` = dark wordmark for white surfaces; `dark` = white wordmark for dark surfaces. */
  tone?: 'light' | 'dark'
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const BADGE_SIZES = {
  sm: 'size-7 rounded-lg',
  md: 'size-9 rounded-xl',
  lg: 'size-11 rounded-2xl',
} as const

const ICON_SIZES = {
  sm: 'size-3.5',
  md: 'size-4.5',
  lg: 'size-6',
} as const

const TEXT_SIZES = {
  sm: 'text-base font-bold',
  md: 'text-xl font-extrabold',
  lg: 'text-2xl font-black',
} as const

/**
 * BayFlow logo: a blue wrench badge and the wordmark. The badge is decorative; wrap the logo in a
 * link with its own accessible name (e.g. `aria-label="BayFlow home"`).
 */
export function Logo({ tone = 'light', className, showText = true, size = 'md' }: LogoProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 tracking-tight select-none',
        tone === 'dark' ? 'text-white' : 'text-[#111827]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex items-center justify-center bg-[#1047FA] text-white shadow-sm shadow-[#1047fa]/30 transition-transform duration-200 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100',
          BADGE_SIZES[size],
        )}
      >
        <Wrench className={cn(ICON_SIZES[size], 'stroke-[2.5]')} />
      </span>
      {showText && (
        <span className={cn('font-sans tracking-tight', TEXT_SIZES[size])}>
          Bay<span className={tone === 'dark' ? 'text-blue-300' : 'text-[#1047FA]'}>Flow</span>
        </span>
      )}
    </span>
  )
}
