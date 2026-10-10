'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'

import { cn } from '@/lib/utils'

import { LANDING_SCREENS, type LandingImage } from './landing-media'

interface Slide {
  image: LandingImage
  caption: string
}

const SLIDES: ReadonlyArray<Slide> = [
  { image: LANDING_SCREENS.ownerOverview, caption: 'Owner overview' },
  { image: LANDING_SCREENS.bookingWizard, caption: 'Customer booking wizard' },
  { image: LANDING_SCREENS.technicianJob, caption: "Technician's job and estimate" },
  { image: LANDING_SCREENS.estimateApproval, caption: 'Estimate approval in the customer portal' },
  { image: LANDING_SCREENS.qcChecklist, caption: 'Quality check before pick-up' },
]

/** Smallest horizontal swipe, in px, that changes the slide. */
const SWIPE_MIN = 40

/**
 * "See BayFlow in action" (landing): real screenshots of BayFlow's own screens. Previous / next
 * buttons, a dot per slide, left and right arrow keys, and swipe on touch screens. No autoplay.
 */
export function ScreenshotCarousel() {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const count = SLIDES.length
  const current = SLIDES[index]!

  function show(next: number) {
    setIndex((next + count) % count)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      show(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      show(index + 1)
    }
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStartX.current
    touchStartX.current = null
    const end = event.changedTouches[0]?.clientX
    if (start === null || end === undefined) return
    const distance = end - start
    if (Math.abs(distance) >= SWIPE_MIN) show(distance < 0 ? index + 1 : index - 1)
  }

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="BayFlow screenshots"
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="relative aspect-[16/9] w-full">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.image.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${slide.caption}`}
              aria-hidden={i !== index}
              inert={i !== index}
              className={cn(
                'absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none',
                i === index ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1216px"
                className="object-cover object-top"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-card/80 px-1.5 shadow-sm backdrop-blur-sm sm:bottom-6">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.image.src}
              type="button"
              onClick={() => show(i)}
              aria-label={`Show screenshot ${i + 1}: ${slide.caption}`}
              aria-current={i === index ? 'true' : undefined}
              className="flex size-6 items-center justify-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring focus-visible:outline-solid"
            >
              <span
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none',
                  i === index ? 'w-7 bg-brand-blue' : 'w-2.5 bg-border-strong hover:bg-helper',
                )}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => show(index - 1)}
          className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-lg transition-colors outline-none hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid md:left-6"
          aria-label="Previous screenshot"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => show(index + 1)}
          className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-lg transition-colors outline-none hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid md:right-6"
          aria-label="Next screenshot"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground" aria-live="polite">
        <span className="font-semibold text-foreground">{current.caption}</span>
        <span className="text-helper">
          {' '}
          · {index + 1} of {count}
        </span>
      </p>
    </div>
  )
}
