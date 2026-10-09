'use client'

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getServices, getShopBySlug } from '@/lib/mock-data'

export default function ShopDetailPage() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : ''

  const shop = useMockStore(() => getShopBySlug(slug))
  const services = useMockStore(() => getServices(shop?.id))

  if (!shop) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Shop Not Found</h1>
        <p className="mt-2 text-neutral-600">The shop you&apos;re looking for does not exist or has moved.</p>
        <Button asChild className="mt-6 bg-[#1047FA] text-white">
          <Link href="/book">Browse All Verified Shops</Link>
        </Button>
      </div>
    )
  }

  const activeServices = services.filter((s) => s.is_active)
  const currentDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-16">
      {/* Top Banner & Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#1047FA] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Shops</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {/* Shop Header Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1047FA] flex items-center gap-1">
                  <ShieldCheck className="size-3.5" />
                  Verified Workshop
                </span>
                {shop.rating ? (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {shop.rating} rating
                  </span>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    New on BayFlow
                  </Badge>
                )}
                <span className="text-xs text-neutral-400 font-medium">Slot length: {shop.slot_duration_minutes} min</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
                {shop.name}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-neutral-400" />
                  <span>{shop.address}, {shop.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="size-4 text-neutral-400" />
                  <a href={`tel:${shop.phone}`} className="text-[#1047FA] font-medium hover:underline">
                    {shop.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#1047FA] hover:bg-blue-700 text-white font-semibold rounded-xl px-7 shadow-sm"
              >
                <Link href={`/book/${shop.slug}`}>
                  Book an Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Columns: Services on Left, Opening Hours & Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services Column (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Available Services & Packages</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Select any service to pre-fill your booking inspection
                </p>
              </div>
              <span className="text-xs font-semibold text-neutral-400">
                {activeServices.length} active services
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activeServices.map((srv) => (
                <div
                  key={srv.id}
                  className="rounded-xl border border-neutral-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Wrench className="size-4 text-[#1047FA]" />
                      <h3 className="font-bold text-neutral-900 text-base">{srv.name}</h3>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
                      {srv.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-neutral-400" />
                        Est. {srv.estimated_duration_minutes} minutes
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-neutral-900">
                        {srv.base_price ? `From ${formatPKR(srv.base_price)}` : 'Price after physical inspection'}
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="border-neutral-300 hover:border-[#1047FA] hover:text-[#1047FA] hover:bg-blue-50 font-semibold rounded-lg shrink-0"
                  >
                    <Link href={`/book/${shop.slug}?service=${srv.id}`}>
                      Book Service
                    </Link>
                  </Button>
                </div>
              ))}
            </div>

            {/* Quality Guarantee Card */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 flex items-start gap-3.5">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-950">
                  BayFlow Transparent Repair Guarantee
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  No work begins without your digital approval. You receive a verified digital inspection report with parts & labor broken down, live status updates, and a post-repair QC certification.
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Hours & Contact */}
          <div className="space-y-6">
            {/* Opening Hours */}
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Clock className="size-4 text-[#1047FA]" />
                  Workshop Hours
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Times in shop local timezone ({shop.timezone})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="divide-y divide-neutral-100 text-xs">
                  {shop.working_hours.map((wh) => {
                    const isToday = wh.day.toLowerCase() === currentDayName.toLowerCase()
                    return (
                      <div
                        key={wh.day}
                        className={`flex items-center justify-between py-2.5 px-2 rounded ${
                          isToday ? 'bg-blue-50/80 font-bold text-[#1047FA]' : 'text-neutral-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {wh.day}
                          {isToday && (
                            <span className="text-[10px] bg-[#1047FA] text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                              Today
                            </span>
                          )}
                        </span>
                        <span>{wh.is_closed ? 'Closed' : wh.hours}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Direct Contact & Location */}
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Building2 className="size-4 text-[#1047FA]" />
                  Workshop Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs text-neutral-600">
                <p className="font-medium text-neutral-900">{shop.name}</p>
                <p>{shop.address}</p>
                <p className="font-medium text-neutral-700">{shop.city}, Pakistan</p>
                <div className="pt-2 border-t border-neutral-100">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${shop.name} ${shop.address} ${shop.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#1047FA] font-semibold hover:underline"
                  >
                    <MapPin className="size-3.5" />
                    Open in Google Maps
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
