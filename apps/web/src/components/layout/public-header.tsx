'use client'

import {
  BarChart3,
  Bell,
  Box,
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Menu,
  PhoneCall,
  PlusCircle,
  ShoppingBag,
  Warehouse,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

import { Logo } from './logo'

export function PublicHeader() {
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false)
        setSolutionsOpen(false)
        setCompanyOpen(false)
        setResourcesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const featureItems = [
    {
      title: 'Workflow',
      desc: 'Assign tasks, schedule jobs, and track progress in real time. Keep your team aligned and your shop running like clockwork.',
      icon: BarChart3,
      color: 'bg-blue-50 text-blue-600',
      href: '#workflow',
    },
    {
      title: 'Estimates',
      desc: 'Send professional estimates in seconds. Get approvals faster and get to work sooner.',
      icon: PlusCircle,
      color: 'bg-rose-50 text-rose-600',
      href: '#estimates',
    },
    {
      title: 'Inventory',
      desc: "Know exactly what's in stock from parts to tires. Reduce delays and keep your jobs moving.",
      icon: Warehouse,
      color: 'bg-indigo-50 text-indigo-600',
      href: '#inventory',
    },
    {
      title: 'Vehicle Inspections',
      desc: 'Catch issues early and build trust. Create digital inspection reports your customers can see and understand instantly.',
      icon: ClipboardCheck,
      color: 'bg-emerald-50 text-emerald-600',
      href: '#inspections',
    },
    {
      title: 'Packaged Services',
      desc: 'Bundle common repairs and maintenance into convenient packages that deliver more value and more revenue.',
      icon: Box,
      color: 'bg-cyan-50 text-cyan-600',
      href: '#packages',
    },
    {
      title: 'Procurement',
      desc: 'Order the right parts, on time. Manage suppliers and restock with confidence without chasing paperwork.',
      icon: ShoppingBag,
      color: 'bg-amber-50 text-amber-600',
      href: '#procurement',
    },
    {
      title: 'Appointment Scheduling',
      desc: 'Notifications to prompt action for upcoming tasks or events.',
      icon: Calendar,
      color: 'bg-teal-50 text-teal-600',
      href: '#scheduling',
    },
    {
      title: 'Service Reminders',
      desc: 'Diagnose multiple systems with a single tool.',
      icon: Bell,
      color: 'bg-purple-50 text-purple-600',
      href: '#reminders',
    },
  ]

  return (
    <header className="marketing sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
      <div
        ref={navRef}
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        {/* Brand Logo */}
        <Link href="/" aria-label="GarageBox home" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* FEATURES DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setFeaturesOpen(!featuresOpen)
                setSolutionsOpen(false)
                setCompanyOpen(false)
                setResourcesOpen(false)
              }}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-normal uppercase tracking-wider text-neutral-700 hover:text-[#1047FA] transition-colors"
            >
              Features
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${featuresOpen ? 'rotate-180 text-[#1047FA]' : ''}`}
              />
            </button>

            {featuresOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[680px] xl:w-[760px] rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl transition-all duration-200 z-50">
                <div className="grid grid-cols-2 gap-4 pb-5 border-b border-neutral-100">
                  {featureItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setFeaturesOpen(false)}
                      className="group flex items-start gap-3.5 rounded-2xl p-3 hover:bg-neutral-50 transition-colors"
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                      >
                        <item.icon className="size-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#1047FA] transition-colors">
                          {item.title}
                        </h4>
                        <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 px-2 text-xs font-semibold">
                  <a
                    href="tel:+923125699996"
                    className="inline-flex items-center gap-2 text-neutral-600 hover:text-[#1047FA] transition-colors"
                  >
                    <PhoneCall className="size-3.5 text-[#1047FA]" />
                    <span>Contact Sales</span>
                  </a>
                  <Link
                    href="#features-all"
                    onClick={() => setFeaturesOpen(false)}
                    className="inline-flex items-center gap-1.5 text-[#1047FA] hover:underline"
                  >
                    <span>VIEW ALL FEATURES</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* SOLUTIONS DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSolutionsOpen(!solutionsOpen)
                setFeaturesOpen(false)
                setCompanyOpen(false)
                setResourcesOpen(false)
              }}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-normal uppercase tracking-wider text-neutral-700 hover:text-[#1047FA] transition-colors"
            >
              Solutions
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${solutionsOpen ? 'rotate-180 text-[#1047FA]' : ''}`}
              />
            </button>

            {solutionsOpen && (
              <div className="absolute left-0 top-full mt-3 w-72 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl z-50">
                <div className="space-y-1">
                  {[
                    'Built for Every Type of Shop',
                    'Scalable for Any Size',
                    'Win Trust. Keep Customers.',
                    'From Check-In to Checkout',
                    'Your Parts and Purchasing',
                    'Profit Starts with Clarity',
                  ].map((sol) => (
                    <Link
                      key={sol}
                      href="#solutions"
                      onClick={() => setSolutionsOpen(false)}
                      className="block rounded-lg px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#1047FA] transition-colors"
                    >
                      {sol}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COMPANY DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCompanyOpen(!companyOpen)
                setFeaturesOpen(false)
                setSolutionsOpen(false)
                setResourcesOpen(false)
              }}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-normal uppercase tracking-wider text-neutral-700 hover:text-[#1047FA] transition-colors"
            >
              Company
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${companyOpen ? 'rotate-180 text-[#1047FA]' : ''}`}
              />
            </button>

            {companyOpen && (
              <div className="absolute left-0 top-full mt-3 w-64 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl z-50">
                <div className="space-y-1">
                  {['Available Countries', 'About Us', 'Careers', 'Contact Us'].map((item) => (
                    <Link
                      key={item}
                      href="#offices"
                      onClick={() => setCompanyOpen(false)}
                      className="block rounded-lg px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#1047FA] transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RESOURCES DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setResourcesOpen(!resourcesOpen)
                setFeaturesOpen(false)
                setSolutionsOpen(false)
                setCompanyOpen(false)
              }}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-normal uppercase tracking-wider text-neutral-700 hover:text-[#1047FA] transition-colors"
            >
              Resources
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${resourcesOpen ? 'rotate-180 text-[#1047FA]' : ''}`}
              />
            </button>

            {resourcesOpen && (
              <div className="absolute left-0 top-full mt-3 w-64 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl z-50">
                <div className="space-y-1">
                  {['Pricing Guide', 'Customer Stories', 'Help Center', 'Blog & Updates'].map(
                    (res) => (
                      <Link
                        key={res}
                        href="#support"
                        onClick={() => setResourcesOpen(false)}
                        className="block rounded-lg px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#1047FA] transition-colors"
                      >
                        {res}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PRICING LINK */}
          <Link
            href="#pricing"
            className="px-3 py-2 text-xs xl:text-sm font-normal uppercase tracking-wider text-neutral-700 hover:text-[#1047FA] transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Right Actions: Sign In */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Emerald Sign In Button */}
          <Button
            asChild
            className="rounded-full bg-[#00c070] hover:bg-[#00a860] text-white font-semibold px-6 py-2 h-10 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            asChild
            size="sm"
            className="rounded-full bg-[#00c070] hover:bg-[#00a860] text-white font-semibold px-4 py-1.5 text-xs"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-6 shadow-xl lg:hidden">
          <div className="flex flex-col space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Features
              </p>
              <div className="grid grid-cols-1 gap-2 pl-2">
                {featureItems.slice(0, 4).map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-800"
                  >
                    <item.icon className="size-4 text-[#1047FA]" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <hr className="border-neutral-100" />

            <div className="flex flex-col space-y-2.5 text-sm font-normal text-neutral-800">
              <Link href="#solutions" onClick={() => setMobileMenuOpen(false)}>
                Solutions
              </Link>
              <Link href="#workflow" onClick={() => setMobileMenuOpen(false)}>
                Workflow
              </Link>
              <Link href="#support" onClick={() => setMobileMenuOpen(false)}>
                Support & Onboarding
              </Link>
              <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
            </div>

            <div className="pt-2">
              <Button asChild className="w-full rounded-full bg-[#1047FA] text-white font-semibold">
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  Book a Demo / Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
