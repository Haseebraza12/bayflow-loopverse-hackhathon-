import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * The header band of the public booking pages, in the landing page's language: grid paper, a soft
 * blue glow, an extra-bold heading with one handwritten word, and room for the step indicator.
 */
export function BookingHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'bg-grid-pattern relative overflow-hidden border-b border-border/60 bg-card',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/2 left-1/2 aspect-square w-[min(1000px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,71,250,0.10)_0%,rgba(16,71,250,0.04)_38%,transparent_68%)] blur-2xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-8 sm:px-6 md:pt-14 lg:px-8">
        {eyebrow && <div className="mb-4">{eyebrow}</div>}
        <h1
          tabIndex={-1}
          className="max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight text-foreground outline-none sm:text-5xl"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}

/** The handwritten accent word used in headings, as on the landing page. */
export function Handwritten({ children }: { children: ReactNode }) {
  return (
    <span className="pr-[0.18em] font-handwriting text-[1.15em] font-normal text-brand-blue-ink italic">
      {children}
    </span>
  )
}

/** A small pill above a heading. */
export function Eyebrow({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/15 bg-brand-blue-subtle px-3 py-1 text-xs font-semibold text-brand-blue-ink [&_svg]:size-3.5">
      {icon}
      {children}
    </span>
  )
}
