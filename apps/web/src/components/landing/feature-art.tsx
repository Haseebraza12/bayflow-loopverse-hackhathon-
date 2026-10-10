/**
 * Illustrations for the three feature sections of the landing page: a workshop photo in a pastel
 * frame, with small BayFlow UI cards floating over it. The cards are HTML built from the real
 * components (status chips, badges) and the brief's worked example (2016 Honda Civic LEA-1234,
 * estimate Rs 16,100), so they stay sharp and on-brand. Purely illustrative: aria-hidden.
 */
import { Bell, Check, PackageCheck } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { PhoneFrame, Sparkle } from './decor'
import { LANDING_PHOTOS, LANDING_SCREENS, type LandingImage } from './landing-media'

/** Text inside the illustrations: 12px at the smallest, 14px at full size. */
const ART_TEXT = 'text-[length:clamp(12px,2.6cqw,14px)] leading-snug'
const CARD = 'rounded-[clamp(12px,2.8cqw,18px)] bg-card shadow-lg ring-1 ring-border-faint'
const PILL = 'inline-flex items-center rounded-full px-3 py-1 font-semibold whitespace-nowrap'

function ArtFrame({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="@container relative aspect-[514/512] w-full max-w-[514px] select-none"
    >
      <div className="absolute top-[12.3%] left-[12.8%] h-[87.7%] w-[87.2%] rounded-[clamp(24px,8.2cqw,42px)] bg-card/40 ring-1 ring-border-faint" />
      {children}
    </div>
  )
}

function PhotoPanel({
  image,
  className,
  imageClassName,
  frame,
}: {
  image: LandingImage
  className: string
  imageClassName?: string
  frame: string
}) {
  return (
    <div
      className={cn(
        'absolute rounded-[clamp(18px,6cqw,32px)] bg-linear-to-t p-[clamp(3px,0.8cqw,5px)] shadow-md',
        frame,
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[clamp(15px,5.2cqw,27px)] bg-muted">
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 330px, 62vw"
          className={cn('object-cover', imageClassName)}
        />
      </div>
    </div>
  )
}

function Sparkles() {
  return (
    <>
      <Sparkle
        outline
        className="absolute top-[9%] left-[84%] size-[9cqw] text-subtle-foreground/70"
      />
      <Sparkle
        outline
        className="absolute top-[24%] left-[76%] size-[5cqw] text-subtle-foreground/60"
      />
    </>
  )
}

/** "Streamline workflow, and control inventory": a job card with its parts reserved. */
export function WorkflowArt() {
  return (
    <ArtFrame>
      <PhotoPanel
        image={LANDING_PHOTOS.featureWorkflow}
        frame="from-danger-subtle via-brand-blue-subtle to-card/0"
        className="top-[17%] left-[31%] h-[77%] w-[63%]"
        imageClassName="object-[60%_50%]"
      />
      <Sparkles />
      <Badge
        variant="success"
        className="absolute top-[7.5%] left-[4%] h-[clamp(26px,6.4cqw,34px)] px-3 text-[length:clamp(12px,2.6cqw,14px)] shadow-sm"
      >
        <Check /> Estimate approved
      </Badge>
      <div
        className={cn(
          CARD,
          ART_TEXT,
          'absolute top-[17%] left-[3%] w-[54%] p-[clamp(10px,3cqw,16px)]',
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <span className="font-mono font-semibold text-brand-blue-ink">LEA-1234</span>
          <StatusBadge status="PARTS_READY" audience="staff" />
        </div>
        <p className="mt-1 font-semibold text-foreground">2016 Honda Civic</p>
        <ul className="mt-2 space-y-1 border-t border-border-faint pt-2">
          {['Ignition coil', 'Oil filter', 'Engine oil 4 L'].map((part) => (
            <li key={part} className="flex items-center justify-between gap-2">
              <span className="truncate text-muted-foreground">{part}</span>
              <span className="inline-flex shrink-0 items-center gap-1 font-medium text-success-ink">
                <Check className="size-3.5" /> Reserved
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-border-faint pt-2">
          <span className="text-helper">Estimate</span>
          <span className="font-bold text-foreground tabular-nums">Rs 16,100</span>
        </div>
      </div>
    </ArtFrame>
  )
}

/** "Deliver an unforgettable customer experience": the customer's phone and the estimate alert. */
export function CustomerArt() {
  return (
    <ArtFrame>
      <PhotoPanel
        image={LANDING_PHOTOS.featureCustomer}
        frame="from-attention-border/60 via-warning-subtle to-card/0"
        className="top-[15%] left-[33%] h-[79%] w-[61%]"
        imageClassName="object-[62%_50%]"
      />
      <Sparkles />
      <PhoneFrame
        screen={LANDING_SCREENS.phoneMyBookings}
        bezel="thin"
        sizes="180px"
        className="absolute top-[5%] left-[4%] w-[34%] shadow-xl"
      />
      <div
        className={cn(
          CARD,
          ART_TEXT,
          'absolute top-[62%] left-[24%] flex w-[60%] gap-[clamp(8px,2.2cqw,12px)] p-[clamp(10px,3cqw,16px)]',
        )}
      >
        <span className="flex size-[clamp(28px,7cqw,36px)] shrink-0 items-center justify-center rounded-[clamp(8px,2cqw,12px)] bg-brand-blue-subtle text-brand-blue-ink">
          <Bell className="size-[55%]" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">Your estimate is ready</p>
          <p className="text-helper">Review and approve Rs 16,100 for your Honda Civic.</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={cn(PILL, 'bg-brand-blue text-brand-blue-foreground')}>Approve</span>
            <span className={cn(PILL, 'bg-card text-foreground ring-1 ring-border-medium')}>
              Decline
            </span>
          </div>
        </div>
      </div>
    </ArtFrame>
  )
}

/** "Maximize shop productivity": the technician's own jobs, the parts alert, then Send to QC. */
export function TechnicianArt() {
  return (
    <ArtFrame>
      <PhotoPanel
        image={LANDING_PHOTOS.featureTechnician}
        frame="from-success-subtle via-info-subtle to-card/0"
        className="top-[13%] left-[31%] h-[81%] w-[63%]"
        imageClassName="object-[55%_50%]"
      />
      <Sparkles />
      <div
        className={cn(
          CARD,
          ART_TEXT,
          'absolute top-[5%] left-[3%] w-[50%] p-[clamp(10px,3cqw,16px)]',
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-foreground">My jobs</p>
          <Badge variant="secondary" className="tabular-nums">
            2
          </Badge>
        </div>
        <ul className="mt-1.5 divide-y divide-border-faint">
          {(
            [
              ['LEA-1234', 'Honda Civic', 'IN_REPAIR'],
              ['LEC-4521', 'Toyota Corolla', 'INSPECTING'],
            ] as const
          ).map(([plate, car, status]) => (
            <li key={plate} className="space-y-1 py-2 last:pb-0">
              <p className="truncate text-foreground">
                <span className="font-mono font-semibold text-brand-blue-ink">{plate}</span> · {car}
              </p>
              <StatusBadge status={status} audience="staff" />
            </li>
          ))}
        </ul>
      </div>
      <div
        className={cn(
          CARD,
          ART_TEXT,
          'absolute top-[80%] left-[8%] flex w-[66%] items-center justify-between gap-2 p-[clamp(10px,3cqw,16px)]',
        )}
      >
        <div className="min-w-0">
          <p className="font-semibold text-foreground">Repair finished</p>
          <p className="truncate text-helper">LEA-1234 · Honda Civic</p>
        </div>
        <span className={cn(PILL, 'bg-brand-blue py-1.5 text-brand-blue-foreground')}>
          Send to QC
        </span>
      </div>
      <div
        className={cn(
          CARD,
          ART_TEXT,
          'absolute top-[59%] left-[2%] flex w-[47%] items-center gap-[clamp(8px,2.2cqw,12px)] p-[clamp(8px,2.4cqw,12px)]',
        )}
      >
        <span className="flex size-[clamp(26px,6.4cqw,34px)] shrink-0 items-center justify-center rounded-[clamp(8px,2cqw,12px)] bg-success-subtle text-success-ink">
          <PackageCheck className="size-[55%]" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">Parts ready</p>
          <p className="truncate text-helper">Start the repair</p>
        </div>
      </div>
    </ArtFrame>
  )
}
