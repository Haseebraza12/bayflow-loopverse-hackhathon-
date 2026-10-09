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
import { getShopSuspensions } from '@/lib/mock-admin'
import { getServices, getShopBySlug } from '@/lib/mock-data'

export default function ShopDetailPage() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : ''

  const found = useMockStore(() => getShopBySlug(slug))
  const suspensions = useMockStore(getShopSuspensions)
  // A suspended shop is treated exactly like an unlisted one: not found (D96).
  const shop = found && !suspensions[found.id] ? found : undefined
  const services = useMockStore(() => getServices(shop?.id))

  if (!shop) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Shop Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The shop you&apos;re looking for does not exist or has moved.
        </p>
        <Button asChild className="mt-6 rounded-full bg-brand-blue text-white">
          <Link href="/book">Browse All Verified Shops</Link>
        </Button>
      </div>
    )
  }

  const activeServices = services.filter((s) => s.is_active)
  const currentDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())

  return (
    <div className="min-h-screen bg-muted/60 pb-16">
      {/* Top Banner & Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-brand-blue-ink"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Shops</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 pt-8 sm:px-6 lg:px-8">
        {/* Shop Header Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand-blue-ink dark:bg-blue-950/40">
                  <ShieldCheck className="size-3.5" />
                  Verified Workshop
                </span>
                {shop.rating ? (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {shop.rating} rating
                  </span>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    New on BayFlow
                  </Badge>
                )}
                <span className="text-xs font-medium text-subtle-foreground">
                  Slot length: {shop.slot_duration_minutes} min
                </span>
              </div>

              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{shop.name}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-subtle-foreground" />
                  <span>
                    {shop.address}, {shop.city}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="size-4 text-subtle-foreground" />
                  <a
                    href={`tel:${shop.phone}`}
                    className="font-medium text-brand-blue-ink hover:underline"
                  >
                    {shop.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-brand-blue px-7 font-semibold text-white hover:bg-blue-700"
              >
                <Link href={`/book/${shop.slug}`}>Book an Appointment</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Columns: Services on Left, Opening Hours & Details on Right */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Services Column (2 spans) */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Available Services & Packages</h2>
                <p className="mt-0.5 text-xs text-helper">
                  Select any service to pre-fill your booking inspection
                </p>
              </div>
              <span className="text-xs font-semibold text-subtle-foreground">
                {activeServices.length} active services
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activeServices.map((srv) => (
                <div
                  key={srv.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-blue-400 sm:flex-row sm:items-center dark:hover:border-blue-600"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Wrench className="size-4 text-brand-blue-ink" />
                      <h3 className="text-base font-bold text-foreground">{srv.name}</h3>
                    </div>
                    <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
                      {srv.description}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-xs text-helper">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-subtle-foreground" />
                        Est. {srv.estimated_duration_minutes} minutes
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-foreground">
                        {srv.base_price
                          ? `From ${formatPKR(srv.base_price)}`
                          : 'Price after physical inspection'}
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="shrink-0 rounded-full border-border-medium font-semibold hover:border-brand-blue hover:bg-blue-50 hover:text-brand-blue-ink dark:hover:bg-blue-950/40"
                  >
                    <Link href={`/book/${shop.slug}?service=${srv.id}`}>Book Service</Link>
                  </Button>
                </div>
              ))}
            </div>

            {/* Quality Guarantee Card */}
            <div className="flex items-start gap-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-800/60 dark:bg-emerald-950/30">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                  BayFlow Transparent Repair Guarantee
                </h4>
                <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-200">
                  No work begins without your digital approval. You receive a verified digital
                  inspection report with parts & labor broken down, live status updates, and a
                  post-repair QC certification.
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Hours & Contact */}
          <div className="space-y-6">
            {/* Opening Hours */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                  <Clock className="size-4 text-brand-blue-ink" />
                  Workshop Hours
                </CardTitle>
                <CardDescription className="text-xs text-helper">
                  Times in shop local timezone ({shop.timezone})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="divide-y divide-border-faint text-xs">
                  {shop.working_hours.map((wh) => {
                    const isToday = wh.day.toLowerCase() === currentDayName.toLowerCase()
                    return (
                      <div
                        key={wh.day}
                        className={`flex items-center justify-between rounded px-2 py-2.5 ${
                          isToday
                            ? 'bg-blue-50/80 font-bold text-brand-blue-ink dark:bg-blue-950/30'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {wh.day}
                          {isToday && (
                            <span className="py-0.2 rounded-full bg-brand-blue px-1.5 text-[10px] tracking-[0.32px] text-white">
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
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                  <Building2 className="size-4 text-brand-blue-ink" />
                  Workshop Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">{shop.name}</p>
                <p>{shop.address}</p>
                <p className="font-medium text-muted-foreground">{shop.city}, Pakistan</p>
                <div className="border-t border-border-faint pt-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${shop.name} ${shop.address} ${shop.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-brand-blue-ink hover:underline"
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
