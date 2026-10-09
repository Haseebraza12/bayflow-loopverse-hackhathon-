import { Wrench } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface LogoProps {
  /** `light` = dark wordmark for white surfaces; `dark` = white wordmark for dark surfaces. */
  tone?: 'light' | 'dark'
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/** GarageBox brand logo with vivid royal-blue wrench badge and bold wordmark. */
export function Logo({ tone = 'light', className, showText = true, size = 'md' }: LogoProps) {
  const badgeSizes = {
    sm: 'size-7 rounded-lg',
    md: 'size-9 rounded-xl',
    lg: 'size-11 rounded-2xl',
  }
  const iconSizes = {
    sm: 'size-3.5',
    md: 'size-4.5',
    lg: 'size-6',
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
      <span
        aria-hidden="true"
        className={cn(
          'flex items-center justify-center bg-[#1047FA] text-white shadow-sm shadow-[#1047fa]/30 transition-transform duration-200 hover:scale-105',
          badgeSizes[size],
        )}
      >
        <Wrench className={cn(iconSizes[size], 'stroke-[2.5]')} />
      </span>
      {showText && (
        <span className={cn('tracking-tight font-sans', textSizes[size])}>
          Garage<span className="text-[#1047FA]">Box</span>
        </span>
      )}
    </span>
  )
}
