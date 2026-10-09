'use client'

import { ChartBarLineIcon, ShoppingCart01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react'
import Link from 'next/link'

import { CapabilityArt } from '@/components/landing/capability-art'

/** Hugeicons (free stroke-rounded set) under the names this page already uses. */
type IconProps = Omit<HugeiconsIconProps, 'icon'>
const BarChart3 = (props: IconProps) => <HugeiconsIcon icon={ChartBarLineIcon} {...props} />
const ShoppingCart = (props: IconProps) => <HugeiconsIcon icon={ShoppingCart01Icon} {...props} />

export default function LandingPage() {
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
              Take control of your auto repair business with BayFlow. Simplify job scheduling,
              invoicing, and inventory control for maximum efficiency.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="rounded-full bg-[#1047FA] px-7 py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#1047FA]/20 transition-all duration-200 hover:bg-[#0935c7] active:scale-95 sm:px-9 sm:text-base"
              >
                Get Started
              </Link>
            </div>
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

            {/* Right Graphic */}
            <div className="flex justify-center lg:col-span-6">
              <div className="relative flex w-full max-w-[514px] justify-center">
                <div className="aspect-video w-full rounded-3xl bg-neutral-100">
                  <CapabilityArt title="Workflow" />
                </div>
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

          <div className="mt-12 flex flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#1047FA] px-7 py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#1047FA]/20 transition-all hover:bg-[#0935c7] active:scale-95 sm:px-9 sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
