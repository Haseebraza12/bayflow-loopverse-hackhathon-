import Image from 'next/image'

import { cn } from '@/lib/utils'

import type { LandingImage } from './landing-media'

const SPARKLE_PATH =
  'M12 0C12.6 6.6 17.4 11.4 24 12C17.4 12.6 12.6 17.4 12 24C11.4 17.4 6.6 12.6 0 12C6.6 11.4 11.4 6.6 12 0Z'

/** A four-point sparkle for the landing illustrations: filled, or a thin outline. Decorative. */
export function Sparkle({ className, outline = false }: { className?: string; outline?: boolean }) {
  return (
    <svg
      viewBox="-1 -1 26 26"
      aria-hidden="true"
      focusable="false"
      className={cn('pointer-events-none', className)}
    >
      <path
        d={SPARKLE_PATH}
        fill={outline ? 'none' : 'currentColor'}
        stroke={outline ? 'currentColor' : 'none'}
        strokeWidth={outline ? 0.6 : 0}
      />
    </svg>
  )
}

/**
 * A phone drawn in CSS around a real BayFlow screenshot (390 × 844 viewport). The screen keeps
 * the capture's aspect ratio; the caller positions and sizes the frame.
 */
export function PhoneFrame({
  screen,
  sizes,
  className,
  bezel = 'thick',
}: {
  screen: LandingImage
  sizes: string
  className?: string
  /** `thin` for small phones inside illustrations. */
  bezel?: 'thick' | 'thin'
}) {
  const thick = bezel === 'thick'
  return (
    <div
      className={cn(
        'relative border-foreground bg-foreground',
        thick ? 'rounded-[44px] border-[10px]' : 'rounded-[24px] border-[5px]',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-foreground',
          thick ? 'top-2 h-5 w-[30%]' : 'top-1 h-2.5 w-[28%]',
        )}
      />
      {/* The screen: a status-bar strip under the notch, then the capture from its top edge */}
      <div
        className={cn(
          'relative flex aspect-[390/844] flex-col overflow-hidden bg-card',
          thick ? 'rounded-[34px] pt-8' : 'rounded-[19px] pt-3.5',
        )}
      >
        <div className="relative min-h-0 flex-1">
          <Image
            src={screen.src}
            alt={screen.alt}
            fill
            sizes={sizes}
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  )
}
