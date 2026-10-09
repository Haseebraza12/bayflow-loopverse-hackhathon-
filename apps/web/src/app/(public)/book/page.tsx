'use client'

import {
  Building2,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useMockStore } from '@/hooks/use-mock-store'
import { getServices, getShops } from '@/lib/mock-data'

export default function BookChooseShopPage() {
  const shops = useMockStore(() => getShops())
  const services = useMockStore(() => getServices())

  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState('ALL')

  const cities = ['ALL', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad']

  const filteredShops = shops.filter((shop) => {
    if (!shop.is_listed) return false
    const matchCity = selectedCity === 'ALL' || shop.city.toLowerCase() === selectedCity.toLowerCase()
    const matchSearch =
      search.trim() === '' ||
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.city.toLowerCase().includes(search.toLowerCase()) ||
      shop.address.toLowerCase().includes(search.toLowerCase())
    return matchCity && matchSearch
  })

  return (
    <div className="min-h-screen bg-neutral-50/70 pb-20">
      {/* Wizard Step Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1047FA] mb-1">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#1047FA] text-white text-[10px]">
                  1
                </span>
                Step 1 of 5
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                Choose a Certified Workshop
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Select your preferred garage to book an inspection, service or repair.
              </p>
            </div>

            {/* Stepper Navigation Indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-neutral-400">
              <span className="font-bold text-[#1047FA]">1. Shop</span>
              <ChevronRight className="size-3 text-neutral-300" />
              <span>2. Services</span>
              <ChevronRight className="size-3 text-neutral-300" />
              <span>3. Time</span>
              <ChevronRight className="size-3 text-neutral-300" />
              <span>4. Details</span>
              <ChevronRight className="size-3 text-neutral-300" />
              <span>5. Confirm</span>
            </div>
          </div>

          {/* Search & City Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 size-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search by shop name, area, or street..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 bg-white text-sm"
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
                      ? 'bg-[#1047FA] text-white shadow-sm'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:border-blue-400'
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
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Available Workshops ({filteredShops.length})
          </p>
          <span className="text-xs text-neutral-400">All workshops verified by BayFlow QA</span>
        </div>

        {filteredShops.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto size-12 text-neutral-300" />
            <h3 className="mt-4 text-base font-bold text-neutral-900">No workshops match your search</h3>
            <p className="mt-1 text-xs text-neutral-500">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShops.map((shop) => {
              const shopServices = services.filter((s) => s.shopId === shop.id && s.is_active)
              const displayServices = shopServices.length > 0 ? shopServices : services.slice(0, 3)

              return (
                <Card
                  key={shop.id}
                  className="overflow-hidden border-neutral-200/90 bg-white hover:border-[#1047FA]/60 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#1047FA]">
                            <ShieldCheck className="size-3.5" />
                            Verified
                          </span>
                          {shop.rating ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              {shop.rating}
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.2 rounded">
                              New
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg font-bold text-neutral-900 group-hover:text-[#1047FA] transition-colors">
                          {shop.name}
                        </h2>

                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                          <MapPin className="size-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate">{shop.address}, {shop.city}</span>
                        </div>
                      </div>

                      <div className="size-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Wrench className="size-5 text-[#1047FA]" />
                      </div>
                    </div>

                    {/* Services Chips Preview */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Popular Services
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {displayServices.slice(0, 3).map((srv) => (
                          <span
                            key={srv.id}
                            className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                          >
                            {srv.name}
                          </span>
                        ))}
                        {displayServices.length > 3 && (
                          <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-400">
                            +{displayServices.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Working Hours Snapshot & Action Buttons */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
                      <span className="text-xs text-neutral-500">
                        Open Mon-Sat • {shop.slot_duration_minutes}m slots
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-xs font-semibold text-neutral-600 hover:text-[#1047FA]"
                        >
                          <Link href={`/shops/${shop.slug}`}>Details</Link>
                        </Button>

                        <Button
                          asChild
                          size="sm"
                          className="bg-[#1047FA] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg px-4"
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
