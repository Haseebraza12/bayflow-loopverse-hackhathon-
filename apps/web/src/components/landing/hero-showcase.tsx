import { CalendarCheck, FileCheck2, Smartphone } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Sparkle } from './decor'
import { LANDING_PHOTOS, LANDING_SCREENS, type LandingImage } from './landing-media'

/**
 * The 15 numbered steps of the booking lifecycle (glossary §3: PENDING … COMPLETED); the other two
 * statuses, ESTIMATE_REJECTED and CANCELLED, are side branches.
 */
const LIFECYCLE_STEPS = 15

/** Pastel frames around the panels (decorative; tokens only). */
const FRAMES = {
  blue: 'from-brand-blue/35 via-info-subtle to-danger-subtle',
  yellow: 'from-attention-border/70 via-warning-subtle to-info-subtle',
  green: 'from-brand-green-accent/45 via-success-subtle to-success-subtle',
} as const

function Panel({
  image,
  frame,
  className,
  imageClassName,
}: {
  image: LandingImage
  frame: keyof typeof FRAMES
  className: string
  imageClassName?: string
}) {
  return (
    <div
      className={cn(
        'absolute rounded-[clamp(14px,2.6cqw,28px)] bg-linear-to-b p-[clamp(3px,0.55cqw,6px)] shadow-md',
        FRAMES[frame],
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[clamp(11px,2.1cqw,23px)] bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          loading="eager"
          sizes="(min-width: 768px) 290px, 34vw"
          className={cn('object-cover', imageClassName)}
        />
      </div>
    </div>
  )
}

function Stat({ children, className }: { children: ReactNode; className: string }) {
  return <li className={cn('absolute', className)}>{children}</li>
}

/**
 * Hero composite (desktop and phone in one): two workshop photos and BayFlow's own "Book a
 * service" screen in pastel frames, with true product facts as HTML chips around them. It sizes
 * itself from its own width (container units), so it scales with the column.
 */
export function HeroShowcase() {
  return (
    <div className="@container relative mx-auto mt-12 aspect-[1440/951] w-full max-w-[480px] select-none md:mt-16 md:aspect-[1440/885] md:max-w-[1020px]">
      <Panel
        image={LANDING_PHOTOS.heroTechnician}
        frame="blue"
        className="top-[5%] left-[11.8%] h-[77%] w-[27.5%]"
        imageClassName="object-[30%_50%]"
      />
      <Panel
        image={LANDING_SCREENS.phoneBookAService}
        frame="yellow"
        className="top-[3.5%] left-[40.4%] h-[89%] w-[27.6%]"
        imageClassName="object-top"
      />
      <Panel
        image={LANDING_PHOTOS.heroInspection}
        frame="green"
        className="top-[4.5%] left-[69.2%] h-[67.5%] w-[27.7%]"
        imageClassName="object-[40%_50%]"
      />

      <Sparkle className="absolute top-[30%] left-[9.4%] size-[5.2cqw] text-brand-blue/40" />
      <Sparkle className="absolute top-[24%] left-[38.4%] size-[3.4cqw] text-brand-green-accent/70" />
      <Sparkle className="absolute top-[52%] left-[65.6%] size-[3.6cqw] text-foreground/25" />
      <Sparkle className="absolute top-[34%] left-[94.6%] size-[4.4cqw] text-brand-orange/55" />

      <ul aria-label="BayFlow at a glance" className="absolute inset-0">
        {/* Top-left chip: the five shop roles */}
        <Stat className="top-[0.6%] left-[0.4%]">
          <span className="flex items-center gap-[clamp(6px,1.4cqw,16px)] rounded-[clamp(12px,2.2cqw,24px)] bg-linear-to-r from-info-subtle via-brand-blue-subtle to-danger-subtle px-[clamp(10px,2.2cqw,24px)] py-[clamp(6px,1.2cqw,13px)] shadow-md ring-2 ring-card">
            <span className="text-[length:clamp(24px,5.4cqw,56px)] leading-none font-extrabold tracking-tight text-foreground">
              5
            </span>
            <span className="text-[length:clamp(12px,1.75cqw,18px)] leading-tight font-medium text-foreground">
              roles,
              <br /> one workflow
            </span>
          </span>
        </Stat>

        {/* Top-right circle: the job lifecycle (from md; a card at the bottom right below md) */}
        <Stat className="top-[0.4%] left-[82.6%] hidden size-[16.6cqw] md:block">
          <span className="flex size-full flex-col items-center justify-center rounded-full bg-success-subtle text-center shadow-md ring-[clamp(3px,0.5cqw,5px)] ring-card">
            <span className="text-[length:clamp(28px,4.9cqw,50px)] leading-none font-extrabold tracking-tight text-foreground">
              {LIFECYCLE_STEPS}
            </span>
            <span className="mt-[0.4cqw] text-[length:clamp(12px,1.45cqw,15px)] leading-tight font-medium text-foreground">
              step job
              <br /> lifecycle
            </span>
          </span>
        </Stat>
        <Stat className="top-[63%] right-0 w-[27%] md:hidden">
          <span className="block rounded-[14px] bg-success-subtle px-2.5 py-2 shadow-md ring-2 ring-card">
            <span className="block text-[length:clamp(18px,5.2cqw,24px)] leading-none font-extrabold tracking-tight text-foreground">
              {LIFECYCLE_STEPS}
            </span>
            <span className="mt-1 block text-xs leading-tight font-medium text-foreground">
              step job lifecycle
            </span>
          </span>
        </Stat>

        {/* Bottom-middle card: estimates approved online */}
        <Stat className="top-[75%] left-[41%] w-[31%] md:top-[64%] md:left-[47%] md:w-[23.5%]">
          <span className="block rounded-[clamp(14px,2.4cqw,26px)] bg-linear-to-br from-attention-border/70 via-warning-subtle to-brand-blue/25 p-[clamp(2px,0.4cqw,4px)] shadow-lg">
            <span className="flex items-center gap-[clamp(6px,1.2cqw,14px)] rounded-[clamp(12px,2cqw,22px)] bg-card px-[clamp(8px,1.8cqw,20px)] py-[clamp(6px,1.5cqw,16px)]">
              <span className="hidden size-[clamp(28px,4.4cqw,46px)] shrink-0 items-center justify-center rounded-[clamp(8px,1.2cqw,14px)] bg-brand-blue-subtle text-brand-blue-ink sm:flex">
                <FileCheck2 aria-hidden="true" className="size-[60%]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[length:clamp(14px,2.2cqw,24px)] leading-tight font-bold tracking-tight text-foreground">
                  Estimates
                </span>
                <span className="block text-[length:clamp(12px,1.6cqw,17px)] leading-tight font-medium text-muted-foreground">
                  approved online
                </span>
              </span>
            </span>
          </span>
        </Stat>
      </ul>

      {/* Icon tiles: online booking, and any phone */}
      <span
        aria-hidden="true"
        className="absolute top-[71%] left-[6.6%] flex size-[clamp(30px,7.2cqw,72px)] items-center justify-center rounded-[clamp(10px,1.8cqw,20px)] bg-card text-brand-blue-ink shadow-md ring-[clamp(2px,0.4cqw,4px)] ring-danger-subtle"
      >
        <CalendarCheck className="size-[52%]" />
      </span>
      <span
        aria-hidden="true"
        className="absolute top-[63%] left-[88.4%] hidden size-[6.4cqw] items-center justify-center rounded-full bg-danger-subtle text-danger-ink shadow-md ring-[0.45cqw] ring-card md:flex"
      >
        <Smartphone className="size-[50%]" />
      </span>
    </div>
  )
}
