'use client'

import { Building2, ChevronRight, MapPin, Search, ShieldCheck, Star, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useMockStore } from '@/hooks/use-mock-store'
import { getShopSuspensions } from '@/lib/mock-admin'
import { getServices, getShops } from '@/lib/mock-data'

export default function BookChooseShopPage() {
  const shops = useMockStore(() => getShops())
  const suspensions = useMockStore(getShopSuspensions)
  const services = useMockStore(() => getServices())

  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState('ALL')

  const cities = ['ALL', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad']

  const filteredShops = shops.filter((shop) => {
    // A suspended shop is treated exactly like an unlisted one (D96).
    if (!shop.is_listed || suspensions[shop.id]) return false
    const matchCity =
      selectedCity === 'ALL' || shop.city.toLowerCase() === selectedCity.toLowerCase()
    const matchSearch =
      search.trim() === '' ||
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.city.toLowerCase().includes(search.toLowerCase()) ||
      shop.address.toLowerCase().includes(search.toLowerCase())
    return matchCity && matchSearch
  })

  return (
    <div className="min-h-screen bg-muted/70 pb-20">
      {/* Wizard Step Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
                <span className="flex size-5 items-center justify-center rounded-full bg-brand-blue text-[10px] text-white">
                  1
                </span>
                Step 1 of 5
              </div>
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                Choose a Certified Workshop
              </h1>
              <p className="mt-1 text-xs text-helper sm:text-sm">
                Select your preferred garage to book an inspection, service or repair.
              </p>
            </div>

            {/* Stepper Navigation Indicator */}
            <div className="hidden items-center gap-2 text-xs font-medium text-subtle-foreground md:flex">
              <span className="font-bold text-brand-blue-ink">1. Shop</span>
              <ChevronRight className="size-3 text-border-medium" />
              <span>2. Services</span>
              <ChevronRight className="size-3 text-border-medium" />
              <span>3. Time</span>
              <ChevronRight className="size-3 text-border-medium" />
              <span>4. Details</span>
              <ChevronRight className="size-3 text-border-medium" />
              <span>5. Confirm</span>
            </div>
          </div>

          {/* Search & City Filter Bar */}
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3.5 size-4 text-subtle-foreground" />
              <Input
                type="text"
                placeholder="Search by shop name, area, or street..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 bg-card pl-10 text-sm"
              />
            </div>

            {/* City Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {cities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCity === city
                      ? 'bg-brand-blue text-white'
                      : 'border border-border bg-card text-muted-foreground hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  {city === 'ALL' ? 'All Cities' : city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shop Cards Grid */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold tracking-[0.32px] text-helper">
            Available Workshops ({filteredShops.length})
          </p>
          <span className="text-xs text-subtle-foreground">
            All workshops verified by BayFlow QA
          </span>
        </div>

        {filteredShops.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Building2 className="mx-auto size-12 text-border-medium" />
            <h3 className="mt-4 text-base font-bold text-foreground">
              No workshops match your search
            </h3>
            <p className="mt-1 text-xs text-helper">
              Try searching for a different area or select &ldquo;All Cities&rdquo;.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setSelectedCity('ALL')
              }}
              className="mt-4 text-xs font-semibold"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredShops.map((shop) => {
              const shopServices = services.filter((s) => s.shopId === shop.id && s.is_active)
              const displayServices = shopServices.length > 0 ? shopServices : services.slice(0, 3)

              return (
                <Card
                  key={shop.id}
                  className="group flex flex-col justify-between overflow-hidden border-border/90 bg-card transition-all hover:border-brand-blue/60"
                >
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="mb-1 flex items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-brand-blue-ink">
                            <ShieldCheck className="size-3.5" />
                            Verified
                          </span>
                          {shop.rating ? (
                            <span className="py-0.2 flex items-center gap-1 rounded bg-amber-50 px-1.5 text-[11px] font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              {shop.rating}
                            </span>
                          ) : (
                            <span className="py-0.2 rounded bg-secondary px-1.5 text-[10px] text-subtle-foreground">
                              New
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg font-bold text-foreground transition-colors group-hover:text-brand-blue-ink">
                          {shop.name}
                        </h2>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-helper">
                          <MapPin className="size-3.5 shrink-0 text-subtle-foreground" />
                          <span className="truncate">
                            {shop.address}, {shop.city}
                          </span>
                        </div>
                      </div>

                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/40">
                        <Wrench className="size-5 text-brand-blue-ink" />
                      </div>
                    </div>

                    {/* Services Chips Preview */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold tracking-[0.32px] text-subtle-foreground">
                        Popular Services
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {displayServices.slice(0, 3).map((srv) => (
                          <span
                            key={srv.id}
                            className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {srv.name}
                          </span>
                        ))}
                        {displayServices.length > 3 && (
                          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-subtle-foreground">
                            +{displayServices.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Working Hours Snapshot & Action Buttons */}
                    <div className="flex items-center justify-between gap-3 border-t border-border-faint pt-3">
                      <span className="text-xs text-helper">
                        Open Mon-Sat • {shop.slot_duration_minutes}m slots
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-xs font-semibold text-muted-foreground hover:text-brand-blue-ink"
                        >
                          <Link href={`/shops/${shop.slug}`}>Details</Link>
                        </Button>

                        <Button
                          asChild
                          size="sm"
                          className="rounded-full bg-brand-blue px-4 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          <Link href={`/book/${shop.slug}`}>Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
