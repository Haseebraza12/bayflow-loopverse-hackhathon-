'use client'

import {
  BarChart3,
  Box,
  Check,
  FileText,
  HelpCircle,
  PlusCircle,
  ShoppingCart,
  Star,
  Warehouse,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

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
      initial: 'G',
      name: 'Ganesh Gaikwad',
      role: 'Director @GadiRepair.com',
      title: 'Double Engine Software for Garages Growth',
      stars: 5,
      quote:
        'Service Packages, Jobs Approvals, Tally Level Accounting, Checklists integrated with Parts & Services enlisting, Detailed Business Analysis...',
      flag: '🇮🇳',
      country: 'India',
    },
    {
      initial: 'E',
      name: 'Emeline Rose',
      role: 'Operations Head @AutoVolt.me',
      title: 'GarageBox is a smart investment for modernizing your operations...',
      stars: 4.5,
      quote:
        'All-in-one garage management platform is designed to streamline operations, boost team productivity & Seamless workflow.',
      flag: '🇧🇭',
      country: 'Bahrain',
    },
    {
      initial: 'S',
      name: 'Sifaudeen Sirajudeen',
      role: 'Manager @AutoIndustriesFabrication.me',
      title: 'GarageBox is the digital toolbox every modern garage needs!',
      stars: 5,
      quote:
        'GarageBox has completely transformed how we manage our garage operations. From job card creation to real-time updates for customers, it keeps everything transparent.',
      flag: '🇦🇪',
      country: 'UAE',
    },
    {
      initial: 'R',
      name: 'Ratan G.',
      role: 'Director @IndWheelzAuto',
      title: 'Easy to Use and Helpful',
      stars: 5,
      quote:
        'We started using GarageBox and honestly it has made our work smoother. Earlier we used to rely on paper job cards and manual billing, but now everything is digitized.',
      flag: '🇮🇳',
      country: 'India',
    },
  ]

  const capabilities = [
    {
      title: 'Workflow',
      desc: 'Assign tasks, schedule jobs, and track progress in real time. Keep your team aligned and your shop running like clockwork.',
      icon: BarChart3,
      color: 'bg-[#1047FA]',
    },
    {
      title: 'Estimates',
      desc: 'Send professional estimates in seconds. Get approvals faster and get to work sooner.',
      icon: PlusCircle,
      color: 'bg-rose-500',
    },
    {
      title: 'Inventory',
      desc: "Know exactly what's in stock from parts to tires. Reduce delays and keep your jobs moving.",
      icon: Warehouse,
      color: 'bg-[#1047FA]',
    },
    {
      title: 'Vehicle Inspections',
      desc: 'Catch issues early and build trust. Create digital inspection reports your customers can see and understand instantly.',
      icon: FileText,
      color: 'bg-[#1047FA]',
    },
    {
      title: 'Packaged Services',
      desc: 'Bundle common repairs and maintenance into convenient packages that deliver more value and more revenue.',
      icon: Box,
      color: 'bg-[#1047FA]',
    },
    {
      title: 'Procurement',
      desc: 'Order the right parts, on time. Manage suppliers and restock with confidence without chasing paperwork.',
      icon: ShoppingCart,
      color: 'bg-[#1047FA]',
    },
  ]

  return (
    <div className="relative w-full overflow-hidden bg-white text-[#171c26]">
      {/* ========================================================
          1. HERO SECTION (100% PIXEL PERFECT TO GARAGEBOX.IO)
          ======================================================== */}
      <section className="relative w-full pt-10 pb-16 md:pt-16 md:pb-24 bg-grid-pattern">
        {/* Soft radial backdrop */}
        <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_50%_15%] from-blue-50/40 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Eyebrow, Heading & Copy */}
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#1047FA] mb-3">
              GARAGE SOFTWARE IN PAKISTAN
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#111827] leading-[1.12]">
              Auto Repair Garage Management <br className="hidden sm:inline" />
              Software{' '}
              <span className="font-handwriting font-normal italic text-[#374151] text-5xl sm:text-6xl md:text-7xl lg:text-[76px] align-baseline">
                in Pakistan
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Take control of your auto repair business with GarageBox, Pakistan&apos;s leading
              garage management software. Simplify job scheduling, invoicing, and inventory control
              for maximum efficiency.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="rounded-full border border-neutral-900 bg-white px-7 sm:px-8 py-3 text-sm sm:text-base font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 transition-all duration-200 active:scale-95"
              >
                Book a Demo
              </button>
              <Link
                href="/register"
                className="rounded-full bg-[#1047FA] px-7 sm:px-9 py-3 text-sm sm:text-base font-semibold text-white shadow-md shadow-[#1047FA]/20 hover:bg-[#0935c7] transition-all duration-200 active:scale-95 text-center"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* ========================================================
              EXACT HERO IMAGE ASSET (From garagebox.io)
              ======================================================== */}
          <div className="relative mx-auto mt-12 md:mt-16 max-w-[1020px] flex justify-center">
            {/* Desktop Hero Image */}
            <div className="hidden md:block w-full">
              <Image
                src="/garagebox/hero-desktop.webp"
                alt="Auto Repair Garage Management Software in Pakistan"
                width={1020}
                height={580}
                priority
                sizes="(min-width: 1280px) 1020px, (min-width: 768px) 90vw, 100vw"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-md"
              />
            </div>

            {/* Mobile Hero Image */}
            <div className="block md:hidden w-full max-w-[480px]">
              <Image
                src="/garagebox/hero-mobile.webp"
                alt="Auto Repair Garage Management Software"
                width={480}
                height={480}
                priority
                sizes="(max-width: 640px) 100vw, 480px"
                className="w-full h-auto object-contain select-none pointer-events-none"
              />
            </div>
          </div>

          {/* ========================================================
              RATING & APP STORES & PLATFORM LOGOS
              ======================================================== */}
          <div className="mt-12 md:mt-16 flex flex-col items-center justify-center gap-6 text-center">
            {/* 5-Star Rating */}
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-5 fill-[#f59e0b] text-[#f59e0b]" />
              ))}
              <span className="ml-2 text-sm font-bold text-neutral-800">
                5-Star Rated based on 200+ reviews
              </span>
            </div>

            {/* App Store Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#google-play"
                className="hover:opacity-90 transition-opacity"
                title="Google Play Store"
              >
                <Image
                  src="/garagebox/play-store.svg"
                  alt="Google Play Store"
                  width={165}
                  height={50}
                  className="h-11 w-auto"
                />
              </a>
              <a
                href="#app-store"
                className="hover:opacity-90 transition-opacity"
                title="Apple App Store"
              >
                <Image
                  src="/garagebox/app-store.svg"
                  alt="Apple App Store"
                  width={155}
                  height={50}
                  className="h-11 w-auto"
                />
              </a>
            </div>

            {/* Platform Review Logos Banner */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 opacity-85 hover:opacity-100 transition-opacity">
              <Image
                src="/garagebox/review-google.svg"
                alt="Google Reviews"
                width={41}
                height={36}
                className="h-8 w-auto object-contain"
              />
              <Image
                src="/garagebox/review-g2.svg"
                alt="G2 Reviews"
                width={41}
                height={36}
                className="h-8 w-auto object-contain"
              />
              <Image
                src="/garagebox/review-clutch.svg"
                alt="Clutch Reviews"
                width={100}
                height={36}
                className="h-8 w-auto object-contain"
              />
              <Image
                src="/garagebox/review-trustradius.svg"
                alt="TrustRadius Reviews"
                width={50}
                height={36}
                className="h-8 w-auto object-contain"
              />
              <Image
                src="/garagebox/review-trustpilot.svg"
                alt="Trustpilot Reviews"
                width={146}
                height={36}
                className="h-8 w-auto object-contain"
              />
              <Image
                src="/garagebox/review-softwaresuggest.svg"
                alt="SoftwareSuggest Reviews"
                width={120}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. TESTIMONIALS SECTION
          "Trusted by Garages, Proven by Performance"
          ======================================================== */}
      <section className="relative w-full py-20 bg-neutral-50/50 border-t border-neutral-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#1047FA]">
              TOP RATED GARAGE MANAGEMENT SOFTWARE OF 2026
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827]">
              Trusted by{' '}
              <span className="font-handwriting font-normal italic text-[#1047FA] text-4xl sm:text-5xl md:text-6xl">
                Garages
              </span>
              , Proven by <span className="text-[#00c070]">Performance</span>
            </h2>
            <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
              From small to large, auto repair shops rely on GarageBox to power their daily
              operations, maximise efficiency, and stay in control every day.
            </p>
          </div>

          {/* Review Cards Grid */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <div
                key={r.name}
                className="flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white font-bold text-sm">
                      {r.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{r.name}</h4>
                      <p className="text-[11px] text-neutral-500 font-medium">{r.role}</p>
                    </div>
                  </div>

                  <h5 className="mt-4 text-xs font-bold text-neutral-900 leading-snug">
                    {r.title}
                  </h5>

                  <div className="mt-2 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < Math.floor(r.stars)
                            ? 'fill-[#f59e0b] text-[#f59e0b]'
                            : 'fill-neutral-200 text-neutral-200'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-[11px] font-bold text-neutral-700">{r.stars}/5</span>
                  </div>

                  <p className="mt-3 text-xs text-neutral-600 leading-relaxed font-normal">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                    <span>{r.flag}</span>
                    <span>{r.country}</span>
                  </span>
                  <a
                    href="#g2-reviews"
                    className="font-bold text-[#1047FA] hover:underline flex items-center gap-0.5"
                  >
                    <span>Read more on G2</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FEATURE 1: STREAMLINE WORKFLOW (Exact SVG)
          ======================================================== */}
      <section
        id="workflow"
        className="relative w-full py-20 bg-white border-t border-neutral-200/60"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#1047FA]">
                  GARAGE MANAGEMENT SOFTWARE (GMS)
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827] leading-tight">
                  <span className="font-handwriting font-normal italic text-4xl sm:text-5xl md:text-6xl text-[#171c26]">
                    Streamline
                  </span>{' '}
                  Workflow, and Control Inventory
                </h2>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1047FA] mt-0.5">
                    <BarChart3 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Take Control of Your Day
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      From Estimates to Digital Authorisations, Inspections to Job Cards. GarageBox
                      keeps your entire workflow flowing smoothly. Assign technician tasks, monitor
                      labor, and track productivity in real time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1047FA] mt-0.5">
                    <ShoppingCart className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Never Run Out, Never Overstock
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      Turn parts requisitions into purchase orders in seconds. Reserve, Issue, and
                      Track Stock precisely so every part is where it needs to be, when it needs to
                      be.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1047FA] mt-0.5">
                    <BarChart3 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      See Where You Earn. For Where You Don&apos;t
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      Our visual reports highlight what&apos;s working and what&apos;s not, helping
                      you spot profit leaks, track labor time, and make data-driven decisions that
                      drive growth.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-block rounded-full bg-[#1047FA] px-9 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#0838c9] transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right Graphic: Exact SVG from GarageBox */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[514px] flex justify-center">
                <Image
                  src="/garagebox/feature-workflow.svg"
                  alt="Streamline Workflow, and Control Inventory"
                  width={514}
                  height={512}
                  className="w-full h-auto object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. FEATURE 2: DELIVER UNFORGETTABLE EXPERIENCE (Exact SVG)
          ======================================================== */}
      <section className="relative w-full py-20 bg-neutral-50/50 border-t border-neutral-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Graphic: Exact SVG from GarageBox */}
            <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-[514px] flex justify-center">
                <Image
                  src="/garagebox/feature-crm.svg"
                  alt="Deliver an Unforgettable Customer Experience"
                  width={514}
                  height={512}
                  className="w-full h-auto object-contain drop-shadow-md"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-8 order-1 lg:order-2">
              <div>
                <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#1047FA]">
                  GARAGE CRM SOFTWARE
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827] leading-tight">
                  <span className="font-handwriting font-normal italic text-4xl sm:text-5xl md:text-6xl text-[#171c26]">
                    Deliver an
                  </span>{' '}
                  Unforgettable Customer Experience
                </h2>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                    <svg className="size-5 fill-current" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Connect, Capture, Communicate
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      Keep customers engaged from first contact to final service. Send real-time
                      updates about appointments, vehicle inspections, and estimates via SMS,
                      Email, or WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                    <svg className="size-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Never Miss a Beat with Smart Reminders
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      Automate service alerts and document renewal reminders. Help customers stay on
                      top of their maintenance without lifting a finger.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                    <svg className="size-5 fill-current" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Book Online in Seconds No Calls Needed
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      Let your website do the work. With online booking and custom web forms, your
                      customers can schedule services anytime, from anywhere.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-block rounded-full bg-[#1047FA] px-9 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#0838c9] transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURE 3: MAXIMIZE SHOP PRODUCTIVITY (Exact SVG)
          ======================================================== */}
      <section className="relative w-full py-20 bg-white border-t border-neutral-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#1047FA]">
                  TIME TRACKING SOFTWARE FOR MECHANICS
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827] leading-tight">
                  <span className="font-handwriting font-normal italic text-4xl sm:text-5xl md:text-6xl text-[#171c26]">
                    Maximize
                  </span>{' '}
                  Shop Productivity with Technician App
                </h2>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mt-0.5">
                    <svg className="size-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Track Time. Drive Results.
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      Stay on top of work hours with our intuitive Time Clock feature. Keep your team
                      motivated, accountable, and focused without micromanaging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mt-0.5">
                    <svg className="size-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Bring Order to the Chaos
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      Simplify how your team works. With GarageBox, manage tasks, track deadlines,
                      and stay on top of progress all from a single, easy-to-use dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mt-0.5">
                    <svg className="size-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Power Your Team on the Go
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      With the GarageBox for Techs mobile app (iOS & Android), your technicians stay
                      connected, informed, and engaged wherever they are.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-block rounded-full bg-[#1047FA] px-9 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#0838c9] transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right Graphic: Exact SVG from GarageBox */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[514px] flex justify-center">
                <Image
                  src="/garagebox/feature-technician.svg"
                  alt="Maximize Shop Productivity with Technician App"
                  width={514}
                  height={512}
                  className="w-full h-auto object-contain drop-shadow-md"
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
        className="relative w-full py-20 bg-neutral-50/50 border-t border-neutral-200/60"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#1047FA]">
              ALL-IN-ONE GARAGE MANAGEMENT SOFTWARE
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827]">
              Garage Management Software
            </h2>
            <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
              GarageBox helps you manage service bookings, estimates, job cards, payments,
              inspections, inventory, customer communication, and labor tracking in an all-in-one
              garage management software.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="group rounded-3xl border border-neutral-200/90 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl ${c.color} text-white shadow-md`}
                >
                  <c.icon className="size-6 stroke-[2.2]" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900 group-hover:text-[#1047FA] transition-colors">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-normal">
                  {c.desc}
                </p>
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
        className="relative w-full py-20 bg-white border-t border-neutral-200/60 bg-grid-pattern"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#1047FA]">
              FREE ONBOARDING & TRAINING
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827]">
              Built for{' '}
              <span className="font-handwriting font-normal italic text-4xl sm:text-5xl md:text-6xl text-[#171c26]">
                Garages.
              </span>{' '}
              Backed by Humans.
            </h2>
            <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
              From setup to daily operations, we are here to keep your garage running smoothly every
              mile of the way.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Data Migration */}
            <div className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-8 shadow-md hover:shadow-xl transition-all">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1047FA]">
                  <Box className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">Data Migration</h3>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  Leave no data behind - we&apos;ll seamlessly transition your customer info,
                  invoices, and more to GarageBox.
                </p>
              </div>
              <div className="mt-8 text-right">
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="text-sm font-bold text-[#1047FA] hover:underline"
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Card 2: Live Support */}
            <div className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-8 shadow-md hover:shadow-xl transition-all">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1047FA]">
                  <HelpCircle className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">Live Support</h3>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  Get live support from our Customer Support team, available Monday to Friday, 10 am
                  to 7 pm IST
                </p>
              </div>
              <div className="mt-8 text-right">
                <a
                  href="https://wa.me/923125699996"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-[#1047FA] hover:underline"
                >
                  Chat With Us
                </a>
              </div>
            </div>

            {/* Card 3: Help Center */}
            <div className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-8 shadow-md hover:shadow-xl transition-all">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1047FA]">
                  <FileText className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">Help Center</h3>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  Guide to help you get started smoothly and improve your understanding of all
                  features
                </p>
              </div>
              <div className="mt-8 text-right">
                <a href="#help-center" className="text-sm font-bold text-[#1047FA] hover:underline">
                  How to Use
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="rounded-full border border-neutral-900 bg-white px-7 sm:px-8 py-3 text-sm sm:text-base font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 transition-all active:scale-95"
            >
              Book a Demo
            </button>
            <Link
              href="/register"
              className="rounded-full bg-[#1047FA] px-7 sm:px-9 py-3 text-sm sm:text-base font-semibold text-white shadow-md shadow-[#1047FA]/20 hover:bg-[#0935c7] transition-all active:scale-95 text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. EXPERIENCE MOBILE APP BANNER
          ======================================================== */}
      <section className="relative w-full py-16 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[40px] border border-neutral-200/90 bg-white p-8 sm:p-12 lg:p-16 shadow-lg overflow-hidden bg-grid-pattern">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column Content */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827] leading-tight">
                  <span className="font-handwriting font-normal italic text-4xl sm:text-5xl md:text-6xl text-[#171c26]">
                    Experience the
                  </span>{' '}
                  #1 All-in-One Garage Management Software
                </h2>

                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                  Start managing Customers, Vehicles, Jobs, Digital Vehicle Inspections (DVI), and
                  Invoicing all in one platform. Automate daily tasks, track labor, digital estimate
                  authorisation to eliminate manual works, and increase your shop profits today.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/register"
                    className="rounded-full bg-[#1047FA] px-8 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#0838c9] transition-all"
                  >
                    Get Started
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(true)}
                    className="rounded-full border border-neutral-900 bg-white px-8 py-3 text-sm sm:text-base font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 transition-all"
                  >
                    Book a Demo
                  </button>
                </div>

                <div className="pt-6 border-t border-neutral-100">
                  <p className="text-xs font-bold text-neutral-700 mb-3">
                    Download GarageBox app from
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="#google-play"
                      className="hover:opacity-90 transition-opacity"
                      title="Google Play Store"
                    >
                      <Image
                        src="/garagebox/play-store.svg"
                        alt="Google Play Store"
                        width={165}
                        height={50}
                        className="h-10 w-auto"
                      />
                    </a>
                    <a
                      href="#app-store"
                      className="hover:opacity-90 transition-opacity"
                      title="Apple App Store"
                    >
                      <Image
                        src="/garagebox/app-store.svg"
                        alt="Apple App Store"
                        width={155}
                        height={50}
                        className="h-10 w-auto"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Exact Mobile Mockup from GarageBox */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[350px] flex justify-center">
                  <Image
                    src="/garagebox/mobile-mockup.png"
                    alt="GarageBox mobile application"
                    width={350}
                    height={596}
                    sizes="(max-width: 1024px) 300px, 350px"
                    className="w-full h-auto object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          BOOK A DEMO MODAL
          ======================================================== */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              type="button"
              onClick={() => {
                setDemoModalOpen(false)
                setDemoSubmitted(false)
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {demoSubmitted ? (
              <div className="text-center py-6">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <Check className="size-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">Demo Request Received!</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Thank you! Our garage software specialist will reach out to you within 2 business
                  hours on WhatsApp/Phone.
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
                <p className="text-xs font-bold uppercase tracking-wider text-[#1047FA]">
                  Free Live Walkthrough
                </p>
                <h3 className="text-2xl font-bold text-neutral-900 mt-1">
                  Book a Personalized Demo
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  See how GarageBox helps auto garages schedule jobs, track parts, and increase
                  profit by 40%.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setDemoSubmitted(true)
                  }}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm focus:border-[#1047FA] focus:ring-1 focus:ring-[#1047FA] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 300 1234567"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm focus:border-[#1047FA] focus:ring-1 focus:ring-[#1047FA] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        placeholder="tariq@garage.com"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm focus:border-[#1047FA] focus:ring-1 focus:ring-[#1047FA] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Garage / Workshop Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Auto Care Lahore"
                      value={demoForm.garageName}
                      onChange={(e) => setDemoForm({ ...demoForm, garageName: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm focus:border-[#1047FA] focus:ring-1 focus:ring-[#1047FA] outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#1047FA] py-3 text-sm font-bold text-white shadow-md hover:bg-[#0838c9] transition-all"
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
