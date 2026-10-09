import {
  Calendar03Icon,
  FavouriteIcon,
  SecurityCheckIcon,
  SmileIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { type CSSProperties, useId } from 'react'

import { cn } from '@/lib/utils'

/**
 * Landing hero: three photo cards with floating highlight badges, laid out on a 1440 × 900 design
 * canvas that scales as one picture (positions in %, type in `cqw`). Every badge states something
 * the product enforces: five staff roles (`MembershipRole`), pick-up only after a QC pass
 * (`PASS_QC` is the only way to `READY_FOR_PICKUP`) and online booking for customers.
 */

const CANVAS_W = 1440
const CANVAS_H = 900

/** Canvas pixels to a percentage box. */
const at = (x: number, y: number, w: number, h?: number): CSSProperties => ({
  left: `${(x / CANVAS_W) * 100}%`,
  top: `${(y / CANVAS_H) * 100}%`,
  width: `${(w / CANVAS_W) * 100}%`,
  ...(h === undefined ? {} : { height: `${(h / CANVAS_H) * 100}%` }),
})

/** Container-width units for a canvas length: 1440 canvas px = 100cqw. */
const cq = (px: number) => `${(px / CANVAS_W) * 100}cqw`

const PHOTO_SIZES = '(min-width: 1280px) 280px, (min-width: 768px) 27vw, 130px'

function PhotoCard({
  src,
  box,
  plate,
  plateOffset,
  focus,
}: {
  src: string
  box: CSSProperties
  /** Pastel plate peeking out from behind the photo. */
  plate: string
  plateOffset: [number, number]
  /** `object-position` that keeps the person in frame. */
  focus: string
}) {
  return (
    <div className="absolute" style={box}>
      <div
        className={cn('absolute inset-0 rounded-[2.2cqw]', plate)}
        style={{ transform: `translate(${cq(plateOffset[0])}, ${cq(plateOffset[1])})` }}
      />
      <div className="relative size-full overflow-hidden rounded-[2.2cqw] bg-neutral-200">
        <Image
          src={src}
          alt=""
          fill
          loading="eager"
          sizes={PHOTO_SIZES}
          className="object-cover"
          style={{ objectPosition: focus }}
        />
      </div>
    </div>
  )
}

/** Four-point sparkle. */
function Sparkle({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute drop-shadow-[0_0_0.5cqw_rgba(255,255,255,0.9)]"
      style={at(x - size / 2, y - size / 2, size, size)}
    >
      <path
        d="M12 1C12.7 7.3 16.7 11.3 23 12C16.7 12.7 12.7 16.7 12 23C11.3 16.7 7.3 12.7 1 12C7.3 11.3 11.3 7.3 12 1Z"
        fill={color}
        stroke="white"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Desktop pentagon badge: a rounded white-edged pentagon with a soft gradient. */
function PentagonBadge() {
  const gradient = `${useId()}-pentagon`
  return (
    <div
      className="absolute hidden drop-shadow-[0_0.6cqw_1.2cqw_rgba(15,23,42,0.08)] md:block"
      style={at(688, 552, 352, 340)}
    >
      <svg viewBox="0 0 352 340" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde8a4" />
            <stop offset="1" stopColor="#f1d2f1" />
          </linearGradient>
        </defs>
        <path
          d="M176 12L340 132L276 328L76 328L12 132Z"
          fill={`url(#${gradient})`}
          stroke="white"
          strokeWidth="12"
          strokeLinejoin="round"
        />
      </svg>
      <div className="relative flex size-full flex-col items-center pt-[4.6cqw] text-center font-heading text-[#0f172a]">
        <HugeiconsIcon icon={SecurityCheckIcon} strokeWidth={2} className="size-[4.2cqw]" />
        <p className="mt-[0.7cqw] text-[2cqw] leading-[1.1]">
          Jobs QC-checked
          <br />
          before pick-up
        </p>
        <p className="mt-[0.2cqw] text-[6.4cqw] leading-none font-bold">100%</p>
      </div>
    </div>
  )
}

export function HeroCollage() {
  return (
    <div
      role="img"
      aria-label="Workshop photos with BayFlow highlights: five team roles on one workflow, every job QC-checked before pick-up, and online booking for customers around the clock"
      className="@container pointer-events-none relative mx-auto w-full max-w-[480px] select-none md:max-w-[1020px]"
    >
      <div className="relative aspect-[1440/900] w-full">
        {/* Photo cards */}
        <PhotoCard
          src="/testimonials/mechanic-1.jpg"
          box={at(165, 48, 392, 700)}
          plate="bg-linear-to-b from-[#cddcff] to-[#f8d0e3]"
          plateOffset={[18, 18]}
          focus="38% 30%"
        />
        <PhotoCard
          src="/testimonials/mechanic-2.jpg"
          box={at(580, 52, 380, 790)}
          plate="bg-linear-to-b from-[#fde68a] via-[#fdf0c4] to-[#e6d6fb]"
          plateOffset={[16, -18]}
          focus="74% 40%"
        />
        <PhotoCard
          src="/testimonials/mechanic-3.jpg"
          box={at(985, 52, 392, 588)}
          plate="bg-linear-to-b from-[#b7f0cf] to-[#ddf7c4]"
          plateOffset={[16, -18]}
          focus="62% 35%"
        />

        {/* Sparkles */}
        <Sparkle x={150} y={268} size={38} color="#c4b5fd" />
        <Sparkle x={165} y={330} size={76} color="#a78bfa" />
        <Sparkle x={586} y={186} size={30} color="#6ee7b7" />
        <Sparkle x={568} y={240} size={62} color="#6366f1" />
        <Sparkle x={982} y={478} size={38} color="#9ca3af" />
        <Sparkle x={962} y={532} size={76} color="#6b7280" />
        <Sparkle x={1398} y={272} size={36} color="#fcd34d" />
        <Sparkle x={1378} y={330} size={76} color="#f59e0b" />

        {/* Team roles badge: desktop gradient ticket, mobile pill */}
        <div
          className="absolute hidden items-center gap-[1.6cqw] rounded-[2.2cqw] rounded-tr-[5cqw] border-[0.4cqw] border-white bg-linear-to-r from-[#c9dafe] to-[#f9d3e2] px-[3.2cqw] font-heading text-[#0f172a] shadow-sm md:flex"
          style={at(6, 6, 395, 142)}
        >
          <span className="text-[6.6cqw] leading-none font-bold">5</span>
          <span className="text-[2cqw] leading-[1.1]">
            Team roles,
            <br />
            one workflow
          </span>
        </div>
        <div
          className="absolute flex items-center gap-[2.4cqw] rounded-[4cqw] border-[0.5cqw] border-white bg-[#c4eefa] px-[3cqw] font-heading text-[#0f172a] md:hidden"
          style={at(6, 6, 470, 150)}
        >
          <span className="text-[8cqw] leading-none font-bold">5</span>
          <span className="text-[2.7cqw] leading-[1.1]">
            Team roles,
            <br />
            one workflow
          </span>
        </div>

        {/* Calendar tile */}
        <div
          className="absolute rounded-[2cqw] bg-linear-to-br from-[#f9c6dc] to-[#c7d2fe] p-[0.4cqw] shadow-sm"
          style={at(110, 640, 128, 136)}
        >
          <div className="flex size-full items-center justify-center rounded-[1.7cqw] bg-white text-[#0f172a]">
            <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-[4.6cqw]" />
          </div>
        </div>

        {/* Hand-drawn arrow under the first card */}
        <svg
          viewBox="0 0 165 118"
          fill="none"
          className="absolute text-neutral-300"
          style={at(392, 748, 165, 118)}
        >
          <path
            d="M10 8C10 66 58 100 140 92M122 76L142 92L120 106"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* QC badge: desktop pentagon, mobile card */}
        <PentagonBadge />
        <div
          className="absolute flex flex-col justify-center rounded-[3cqw] border-[0.5cqw] border-white bg-[#fdefc0] px-[2.6cqw] font-heading text-[#0f172a] md:hidden"
          style={at(584, 686, 396, 206)}
        >
          <p className="text-[2.7cqw] leading-[1.1]">
            Jobs QC-checked
            <br />
            before pick-up
          </p>
          <div className="mt-[0.6cqw] flex items-center justify-between">
            <span className="text-[7cqw] leading-none font-bold">100%</span>
            <HugeiconsIcon icon={SecurityCheckIcon} strokeWidth={2} className="size-[6cqw]" />
          </div>
        </div>

        {/* Online booking badge: desktop circle, mobile card */}
        <div
          className="absolute hidden aspect-square flex-col items-center justify-center rounded-full border-[0.4cqw] border-white bg-linear-to-b from-[#a9efc9] to-[#dcf7c3] text-center font-heading text-[#0f172a] shadow-sm md:flex"
          style={at(1190, 6, 244)}
        >
          <span className="text-[5.4cqw] leading-none font-bold">24/7</span>
          <span className="mt-[0.4cqw] text-[1.75cqw] leading-[1.1]">
            Online booking
            <br />
            for customers
          </span>
          <span className="mt-[0.8cqw] h-[2cqw] w-[7.4cqw] rounded-t-[0.6cqw] rounded-b-full bg-white" />
        </div>
        <div
          className="absolute flex flex-col justify-center rounded-[3cqw] border-[0.5cqw] border-white bg-[#c8f3dc] px-[2.6cqw] font-heading text-[#0f172a] md:hidden"
          style={at(1052, 596, 384, 222)}
        >
          <p className="text-[2.7cqw] leading-[1.1]">
            Online booking
            <br />
            for customers
          </p>
          <div className="mt-[0.6cqw] flex items-center justify-between">
            <span className="text-[7cqw] leading-none font-bold">24/7</span>
            <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-[6cqw]" />
          </div>
        </div>

        {/* Customer card accents: desktop heart tile, mobile smiley */}
        <div
          className="absolute hidden aspect-square items-center justify-center rounded-[2.2cqw] border-[0.4cqw] border-white bg-radial from-[#ff7fbf] to-[#ffd3e8] text-white shadow-sm md:flex"
          style={at(1288, 556, 132)}
        >
          <HugeiconsIcon
            icon={FavouriteIcon}
            strokeWidth={2}
            className="size-[4.4cqw] fill-white"
          />
        </div>
        <div
          className="absolute flex aspect-square items-center justify-center rounded-full border-[0.5cqw] border-white bg-[#2fd18b] text-white md:hidden"
          style={at(1262, 6, 130)}
        >
          <HugeiconsIcon icon={SmileIcon} strokeWidth={2} className="size-[5.6cqw]" />
        </div>
      </div>
    </div>
  )
}
