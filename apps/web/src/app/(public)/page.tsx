'use client'

import {
  Cancel01Icon,
  ChartBarLineIcon,
  ShoppingCart01Icon,
  StarIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { CapabilityArt } from '@/components/landing/capability-art'
import { HeroCollage } from '@/components/landing/hero-collage'
import { Button } from '@/components/ui/button'

/** Hugeicons (free stroke-rounded set) under the names this page already uses. */
type IconProps = Omit<HugeiconsIconProps, 'icon'>
const BarChart3 = (props: IconProps) => <HugeiconsIcon icon={ChartBarLineIcon} {...props} />
const Check = (props: IconProps) => <HugeiconsIcon icon={Tick02Icon} {...props} />
const ShoppingCart = (props: IconProps) => <HugeiconsIcon icon={ShoppingCart01Icon} {...props} />
const Star = (props: IconProps) => <HugeiconsIcon icon={StarIcon} {...props} />
const X = (props: IconProps) => <HugeiconsIcon icon={Cancel01Icon} {...props} />

export default function LandingPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [demoSubmitted, setDemoSubmitted] = useState(false)
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    garageName: '',
    country: 'Pakistan',
  })

  const reviews = [
    {
      name: 'Kamran Sheikh',
      tint: 'blue' as const,
      role: 'Owner, two shops · Lahore',
      metric: '2 shops, 1 dashboard',
      photo: '/testimonials/mechanic-1.jpg',
      quote:
        'I run two shops from one login. Every bay, every job, every rupee: I see it live without calling anyone.',
      rating: 5,
    },
    {
      name: 'Bilal Ahmed',
      tint: 'green' as const,
      role: 'Service Advisor, Karachi',
      metric: 'Approvals in minutes',
      photo: '/testimonials/mechanic-2.jpg',
      quote:
        'Customers approve estimates from their phone now. No more waiting on WhatsApp replies before we can start work.',
      rating: 4.9,
    },
    {
      name: 'Imran Ali',
      tint: 'orange' as const,
      role: 'Technician, Islamabad',
      metric: 'No paper job cards',
      photo: '/testimonials/mechanic-3.jpg',
      quote:
        'My screen shows only my jobs. I log the inspection, add photos, and the parts counter already knows what I need.',
      rating: 4.8,
    },
    {
      name: 'Sara Malik',
      tint: 'blue' as const,
      role: 'QC Inspector, Lahore',
      metric: 'Zero missed checks',
      photo: '/testimonials/mechanic-4.jpg',
      quote:
        'Nothing leaves the bay until I sign it off. If a check fails it goes straight back to the technician, with notes.',
      rating: 5,
    },
    {
      name: 'Usman Tariq',
      tint: 'green' as const,
      role: 'Parts Manager, Faisalabad',
      metric: 'Parts ready on time',
      photo: '/testimonials/mechanic-5.jpg',
      quote:
        'Parts requests arrive with the job attached. I issue, track and restock without chasing anyone down the floor.',
      rating: 4.9,
    },
  ]

  const capabilities = [
    {
      title: 'Workflow' as const,
      desc: 'Assign tasks, schedule jobs, and track progress in real time. Keep your team aligned and your shop running like clockwork.',
    },
    {
      title: 'Estimates' as const,
      desc: 'Send professional estimates in seconds. Get approvals faster and get to work sooner.',
    },
    {
      title: 'Inventory' as const,
      desc: "Know exactly what's in stock from parts to tires. Reduce delays and keep your jobs moving.",
    },
    {
      title: 'Vehicle Inspections' as const,
      desc: 'Catch issues early and build trust. Create digital inspection reports your customers can see and understand instantly.',
    },
    {
      title: 'Packaged Services' as const,
      desc: 'Bundle common repairs and maintenance into convenient packages that deliver more value and more revenue.',
    },
    {
      title: 'Procurement' as const,
      desc: 'Order the right parts, on time. Manage suppliers and restock with confidence without chasing paperwork.',
    },
  ]

  return (
    <div className="marketing relative w-full overflow-hidden bg-white text-[#171c26]">
      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section className="bg-grid-pattern relative w-full pt-10 pb-16 md:pt-16 md:pb-24">
        {/* Soft radial backdrop */}
        <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_50%_15%] from-blue-50/40 via-transparent to-transparent" />
        {/* Halo behind the headline: a faint blue glow, then a white wash that fades the grid out under the copy */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-6%] left-1/2 aspect-square w-[min(1100px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,71,250,0.09)_0%,rgba(16,71,250,0.04)_35%,transparent_68%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[2%] left-1/2 h-[min(560px,90vw)] w-[min(980px,130vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.7)_40%,transparent_70%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Heading & Copy */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl leading-[1.12] font-extrabold tracking-tight text-[#111827] sm:text-5xl md:text-6xl lg:text-[68px]">
              Auto Repair Garage Management <br className="hidden sm:inline" />
              Software{' '}
              <span className="align-baseline font-handwriting text-5xl font-normal text-[#374151] italic sm:text-6xl md:text-7xl lg:text-[76px]">
                in Pakistan
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed font-normal text-neutral-600 sm:text-lg">
              Take control of your auto repair business with BayFlow garage management software.
              Simplify job scheduling, invoicing, and inventory control for maximum efficiency.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="rounded-full border border-neutral-900 bg-white px-7 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-all duration-200 hover:bg-neutral-50 active:scale-95 sm:px-8 sm:text-base"
              >
                Book a Demo
              </button>
              <Link
                href="/register"
                className="rounded-full bg-[#1047FA] px-7 py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#1047FA]/20 transition-all duration-200 hover:bg-[#0935c7] active:scale-95 sm:px-9 sm:text-base"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* ========================================================
              HERO COLLAGE: workshop photos with BayFlow highlights
              ======================================================== */}
          <div className="relative mx-auto mt-12 flex max-w-[1020px] justify-center md:mt-16">
            <HeroCollage />
          </div>

          {/* ========================================================
              DEMO ACCESS & BROWSER SUPPORT
              ======================================================== */}
          <div className="mt-12 flex flex-col items-center justify-center gap-6 text-center md:mt-16">
            {/* Live demo */}
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="text-sm font-bold text-neutral-800 underline-offset-4 hover:text-[#1047FA] hover:underline"
              >
                Live demo: sign in with the demo accounts
              </Link>
            </div>

            {/* Runs in the browser: no app to install */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="inline-flex h-11 items-center rounded-full border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 shadow-sm">
                Works in any browser
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. TESTIMONIALS SECTION — story cards (text + duotone portrait)
          ======================================================== */}
      <section className="relative w-full overflow-hidden border-t border-neutral-200/70 bg-neutral-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl">
              Trusted by{' '}
              <span className="font-handwriting text-4xl font-normal text-[#1047FA] italic sm:text-5xl md:text-6xl">
                Garages
              </span>
              , Proven by <span className="text-[#00c070]">Performance</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              Owners, service advisors, technicians, QC and parts teams run every job on BayFlow,
              from check-in to pick-up, on one shared workflow.
            </p>
            <p className="mt-4 inline-flex rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold text-neutral-600">
              Illustrative stories, not real customers
            </p>
          </div>
        </div>

        {/* Auto-scrolling marquee: list rendered twice, track slides -50% and loops. Pauses on hover. */}
        <div className="mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
          <div className="reviews-marquee flex w-max gap-6 py-6">
            {[...reviews, ...reviews].map((r, i) => {
              const tone = {
                blue: { card: 'from-[#eef2ff] to-white', duo: 'bg-[#1047FA]' },
                green: { card: 'from-[#e8f8f0] to-white', duo: 'bg-[#00c070]' },
                orange: { card: 'from-[#fff1e8] to-white', duo: 'bg-[#e8590c]' },
              }[r.tint]
              return (
                <article
                  key={`${r.name}-${i}`}
                  aria-hidden={i >= reviews.length || undefined}
                  className={`flex w-[88vw] max-w-[780px] shrink-0 flex-col-reverse gap-5 rounded-[28px] border border-white bg-gradient-to-br p-5 shadow-[0_10px_40px_-20px_rgba(17,24,39,0.25)] sm:flex-row sm:p-6 ${tone.card}`}
                >
                  <div className="flex flex-1 flex-col justify-between gap-8 p-2 sm:py-4">
                    <div>
                      <blockquote className="text-2xl leading-tight font-semibold tracking-tight text-[#111827] md:text-[28px]">
                        {r.quote}
                      </blockquote>
                      <div className="mt-6 text-sm">
                        <p className="font-semibold text-[#111827]">{r.name}</p>
                        <p className="text-neutral-500">{r.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111827]">
                        <Star className="size-4 fill-[#f59e0b] text-[#f59e0b]" />
                        {r.rating.toFixed(1)} · {r.metric}
                      </span>
                    </div>
                  </div>

                  {/* Duotone portrait: grayscale photo screened with brand tint */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] sm:w-[46%]">
                    <Image
                      src={r.photo}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 360px, 88vw"
                      className="object-cover contrast-125 grayscale"
                    />
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 opacity-80 mix-blend-screen ${tone.duo}`}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FEATURE 1: STREAMLINE WORKFLOW
          ======================================================== */}
      <section
        id="workflow"
        className="relative w-full border-t border-neutral-200/60 bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Content */}
            <div className="space-y-8 lg:col-span-6">
              <div>
                <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl">
                  <span className="font-handwriting text-4xl font-normal text-[#171c26] italic sm:text-5xl md:text-6xl">
                    Streamline
                  </span>{' '}
                  Workflow, and Control Inventory
                </h2>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <BarChart3 className="mt-0.5 size-6 shrink-0 text-neutral-400" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      Take Control of Your Day
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      Estimates, approvals, inspections and job cards in one flow. Assign tasks and
                      track labour in real time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ShoppingCart className="mt-0.5 size-6 shrink-0 text-neutral-400" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      Never Run Out, Never Overstock
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      Turn parts requests into purchase orders in seconds. Reserve, issue and track
                      every part.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <BarChart3 className="mt-0.5 size-6 shrink-0 text-neutral-400" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      See Where You Earn, and Where You Don&apos;t
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      Visual reports show profit leaks and labour time, so you can decide with data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-block rounded-full bg-[#1047FA] px-9 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0838c9] sm:text-base"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right Graphic: BayFlow bookings board */}
            <div className="flex justify-center lg:col-span-6">
              <div className="relative flex w-full max-w-[514px] justify-center">
                <Image
                  src="/landing/feature-workflow.webp"
                  alt="BayFlow bookings board: every booking with its live status"
                  width={514}
                  height={512}
                  className="h-auto w-full object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. FEATURE 2: DELIVER UNFORGETTABLE EXPERIENCE
          ======================================================== */}
      <section className="relative w-full border-t border-neutral-200/60 bg-neutral-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Graphic: BayFlow customer booking page */}
            <div className="order-2 flex justify-center lg:order-1 lg:col-span-6">
              <div className="relative flex w-full max-w-[514px] justify-center">
                <Image
                  src="/landing/feature-customer.webp"
                  alt="BayFlow customer booking page: approve the estimate, see each part and labour line, follow the repair"
                  width={514}
                  height={512}
                  className="h-auto w-full object-contain drop-shadow-md"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="order-1 space-y-8 lg:order-2 lg:col-span-6">
              <div>
                <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl">
                  <span className="font-handwriting text-4xl font-normal text-[#171c26] italic sm:text-5xl md:text-6xl">
                    Deliver an
                  </span>{' '}
                  Unforgettable Customer Experience
                </h2>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <svg
                    className="mt-0.5 size-6 shrink-0 fill-current text-neutral-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      Connect, Capture, Communicate
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      Keep customers engaged from first contact to final service. Send real-time
                      updates about appointments, vehicle inspections, and estimates via SMS, Email,
                      or WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg
                    className="mt-0.5 size-6 shrink-0 fill-current text-neutral-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      Never Miss a Beat with Smart Reminders
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      Automate service alerts and document renewal reminders. Help customers stay on
                      top of their maintenance without lifting a finger.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg
                    className="mt-0.5 size-6 shrink-0 fill-current text-neutral-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      Book Online in Seconds No Calls Needed
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      Let your website do the work. With online booking and custom web forms, your
                      customers can schedule services anytime, from anywhere.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-block rounded-full bg-[#1047FA] px-9 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0838c9] sm:text-base"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURE 3: MAXIMIZE SHOP PRODUCTIVITY
          ======================================================== */}
      <section className="relative w-full border-t border-neutral-200/60 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Content */}
            <div className="space-y-8 lg:col-span-6">
              <div>
                <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl">
                  <span className="font-handwriting text-4xl font-normal text-[#171c26] italic sm:text-5xl md:text-6xl">
                    Maximize
                  </span>{' '}
                  Shop Productivity with Technician App
                </h2>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <svg
                    className="mt-0.5 size-6 shrink-0 fill-current text-neutral-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      Track Time. Drive Results.
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      Stay on top of work hours with our intuitive Time Clock feature. Keep your
                      team motivated, accountable, and focused without micromanaging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg
                    className="mt-0.5 size-6 shrink-0 fill-current text-neutral-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      Bring Order to the Chaos
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      Simplify how your team works. With BayFlow, manage tasks, track deadlines, and
                      stay on top of progress all from a single, easy-to-use dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg
                    className="mt-0.5 size-6 shrink-0 fill-current text-neutral-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      Power Your Team on the Go
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      BayFlow runs in the phone&apos;s browser, so your technicians stay connected,
                      informed, and engaged wherever they are.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-block rounded-full bg-[#1047FA] px-9 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0838c9] sm:text-base"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right Graphic: BayFlow technician jobs */}
            <div className="flex justify-center lg:col-span-6">
              <div className="relative flex w-full max-w-[514px] justify-center">
                <Image
                  src="/landing/feature-technician.webp"
                  alt="BayFlow technician jobs page: the jobs assigned to one technician"
                  width={514}
                  height={512}
                  className="h-auto w-full object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. ALL-IN-ONE CAPABILITIES GRID
          ======================================================== */}
      <section
        id="features-all"
        className="relative w-full border-t border-neutral-200/60 bg-neutral-50/50 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl">
              Garage Management Software
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              BayFlow helps you manage service bookings, estimates, job cards, payments,
              inspections, inventory, customer communication, and labor tracking in an all-in-one
              garage management software.
            </p>
          </div>

          {/* Two columns x three rows: copy left, product mock-up right */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="group flex flex-col-reverse overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg sm:min-h-[220px] sm:flex-row"
              >
                <div className="flex flex-1 flex-col justify-center p-7">
                  <h3 className="text-lg font-semibold text-neutral-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{c.desc}</p>
                </div>
                <div className="h-48 bg-neutral-100 sm:h-auto sm:w-[48%]">
                  <CapabilityArt title={c.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. SUPPORT & ONBOARDING
          "Built for Garages. Backed by Humans."
          ======================================================== */}
      <section
        id="support"
        className="bg-grid-pattern relative w-full border-t border-neutral-200/60 bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl">
              Built for{' '}
              <span className="font-handwriting text-4xl font-normal text-[#171c26] italic sm:text-5xl md:text-6xl">
                Garages.
              </span>{' '}
              Backed by Humans.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              From setup to daily operations, we are here to keep your garage running smoothly every
              mile of the way.
            </p>
          </div>

          {/* Feature cards: mini product illustration on a grey panel, copy underneath */}
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {/* Card 1: Demo data */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white pb-7 shadow-sm">
              <div className="relative flex aspect-[16/11] flex-col items-center justify-center overflow-hidden bg-neutral-100 p-6">
                <p className="text-2xl font-semibold tracking-tight text-neutral-900">BayFlow</p>
                {/* Connector tree */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 48"
                  className="mt-2 h-10 w-[78%] text-neutral-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M150 0 V20 M30 48 V30 Q30 20 40 20 H260 Q270 20 270 30 V48 M150 20 V48" />
                </svg>
                <div className="flex w-[86%] justify-between">
                  {['Shops', 'Teams', 'Jobs'].map((src) => (
                    <span
                      key={src}
                      className="flex size-14 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-neutral-600 shadow-sm ring-1 ring-neutral-200"
                    >
                      {src}
                    </span>
                  ))}
                </div>
                <span className="mt-5 rounded-full border border-neutral-200 bg-white/70 px-4 py-1 text-xs text-neutral-500">
                  Seeded for every role
                </span>
              </div>
              <h3 className="mt-6 px-7 text-lg font-semibold text-neutral-900">
                Demo data included
              </h3>
              <p className="mt-2 px-7 text-sm leading-relaxed text-neutral-500">
                Six shops, a team for every role and sample bookings are ready, so you can try every
                step right away.
              </p>
              <Link
                href="/login"
                className="mt-auto self-start px-7 pt-4 text-sm font-semibold text-[#1047FA] hover:underline"
              >
                Try the demo →
              </Link>
            </div>

            {/* Card 2: Role workspaces */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white pb-7 shadow-sm">
              <div className="relative flex aspect-[16/11] flex-col justify-center gap-3 overflow-hidden bg-neutral-100 p-6">
                <div className="max-w-[78%] self-end rounded-2xl rounded-br-md bg-neutral-900 px-4 py-2.5 text-xs text-white shadow-sm">
                  Signed in as Technician
                </div>
                <div className="flex max-w-[86%] items-end gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1047FA] text-[10px] font-bold text-white">
                    BF
                  </span>
                  <div className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-xs text-neutral-700 shadow-sm ring-1 ring-neutral-200">
                    Showing your assigned jobs. Parts and QC each see their own queue.
                  </div>
                </div>
                <div
                  className="ml-9 flex w-14 gap-1 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-neutral-200"
                  aria-hidden="true"
                >
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-1.5 rounded-full bg-neutral-300" />
                  ))}
                </div>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-neutral-200 bg-white/70 px-4 py-1 text-xs whitespace-nowrap text-neutral-500">
                  Owner · SA · Tech · Parts · QC
                </span>
              </div>
              <h3 className="mt-6 px-7 text-lg font-semibold text-neutral-900">
                A workspace for every role
              </h3>
              <p className="mt-2 px-7 text-sm leading-relaxed text-neutral-500">
                Owner, Service Advisor, Technician, Parts and QC each get their own screens and only
                the actions their role allows.
              </p>
              <Link
                href="/login"
                className="mt-auto self-start px-7 pt-4 text-sm font-semibold text-[#1047FA] hover:underline"
              >
                Try a role →
              </Link>
            </div>

            {/* Card 3: Documented API */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white pb-7 shadow-sm">
              <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100">
                <div className="absolute inset-y-6 -right-6 left-6 rounded-xl bg-white shadow-sm ring-1 ring-neutral-200">
                  <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3 text-xs text-neutral-400">
                    <span aria-hidden="true">⌕</span> Search endpoints…
                  </div>
                  {[
                    'POST /api/v1/bookings',
                    'GET /api/v1/me/bookings',
                    'POST …/actions/approve-estimate',
                  ].map((g) => (
                    <div
                      key={g}
                      className="flex items-center gap-3 border-b border-neutral-100 px-4 py-2.5 text-xs text-neutral-700"
                    >
                      <span className="size-5 shrink-0 rounded-md bg-neutral-100" />
                      {g}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <span className="size-5 shrink-0 rounded-md bg-neutral-100" />
                    <span className="h-2 w-32 rounded-full bg-neutral-100" />
                  </div>
                </div>
              </div>
              <h3 className="mt-6 px-7 text-lg font-semibold text-neutral-900">Documented API</h3>
              <p className="mt-2 px-7 text-sm leading-relaxed text-neutral-500">
                Every endpoint is described in OpenAPI, with interactive Swagger docs on the API
                server.
              </p>
              <span className="mt-auto self-start px-7 pt-4 text-sm font-semibold text-neutral-500">
                Swagger UI at /docs on the API
              </span>
            </div>
          </div>

          <div className="mt-12 flex flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="rounded-full border border-neutral-900 bg-white px-7 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 sm:px-8 sm:text-base"
            >
              Book a Demo
            </button>
            <Link
              href="/register"
              className="rounded-full bg-[#1047FA] px-7 py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#1047FA]/20 transition-all hover:bg-[#0935c7] active:scale-95 sm:px-9 sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. EXPERIENCE MOBILE APP BANNER
          ======================================================== */}
      <section className="relative w-full bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid overflow-hidden rounded-[32px] bg-neutral-100 lg:grid-cols-12">
            {/* Left: headline, CTA pinned to the bottom */}
            <div className="flex flex-col justify-between gap-12 p-8 sm:p-12 lg:col-span-7 lg:min-h-[460px] lg:p-14">
              <div>
                <h2 className="max-w-xl text-4xl leading-[1.08] font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                  Run your garage from your phone&apos;s browser.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600">
                  Jobs, inspections, estimates and parts in one web app. Nothing to install, so your
                  team can work from the bay floor.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/register"
                  className="rounded-full bg-[#1047FA] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1047FA]/20 transition hover:bg-[#0935c7]"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right: phone rises from the bottom edge and is cropped by the card */}
            <div className="relative flex h-[340px] justify-center lg:col-span-5 lg:h-auto">
              <Image
                src="/landing/mobile-mockup.webp"
                alt="BayFlow in a phone browser: a technician's assigned jobs"
                width={350}
                height={596}
                sizes="(max-width: 1024px) 260px, 320px"
                className="absolute top-8 w-[260px] drop-shadow-2xl lg:top-20 lg:w-[320px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          BOOK A DEMO MODAL
          ======================================================== */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => {
                setDemoModalOpen(false)
                setDemoSubmitted(false)
              }}
              className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {demoSubmitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="size-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">This is a demo</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Nothing was sent.{' '}
                  <Link href="/login" className="font-semibold text-[#1047FA] hover:underline">
                    Sign in with a demo account
                  </Link>{' '}
                  to try BayFlow.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      setDemoModalOpen(false)
                      setDemoSubmitted(false)
                    }}
                    className="rounded-full bg-[#1047FA] px-8"
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold tracking-wider text-[#1047FA] uppercase">
                  Free Live Walkthrough
                </p>
                <h3 className="mt-1 text-2xl font-bold text-neutral-900">
                  Book a Personalized Demo
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  See how BayFlow helps auto garages schedule jobs and track parts.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setDemoSubmitted(true)
                  }}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="mb-1 block text-xs font-bold text-neutral-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#1047FA] focus:ring-1 focus:ring-[#1047FA]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-neutral-700">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 300 1234567"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#1047FA] focus:ring-1 focus:ring-[#1047FA]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-neutral-700">
                        Work Email
                      </label>
                      <input
                        type="email"
                        placeholder="tariq@garage.com"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#1047FA] focus:ring-1 focus:ring-[#1047FA]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-neutral-700">
                      Garage / Workshop Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Auto Care Lahore"
                      value={demoForm.garageName}
                      onChange={(e) => setDemoForm({ ...demoForm, garageName: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#1047FA] focus:ring-1 focus:ring-[#1047FA]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#1047FA] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0838c9]"
                    >
                      Confirm Demo Request
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
