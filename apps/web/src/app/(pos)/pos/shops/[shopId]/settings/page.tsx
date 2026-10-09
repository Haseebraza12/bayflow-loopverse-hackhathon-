'use client'

import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Save,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useMockStore } from '@/hooks/use-mock-store'
import { getShopById, saveShop, type MockShop } from '@/lib/mock-data'

export default function ShopSettingsPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'

  const shop = useMockStore(() => getShopById(shopId))

  const [name, setName] = useState(shop?.name || 'Lahore Auto Care')
  const [city, setCity] = useState(shop?.city || 'Lahore')
  const [address, setAddress] = useState(shop?.address || 'Plot 12, Main Boulevard, Gulberg III')
  const [phone, setPhone] = useState(shop?.phone || '+92 42 35789011')
  const [slotDuration, setSlotDuration] = useState(
    shop?.slot_duration_minutes?.toString() || '60'
  )
  const [slotCapacity, setSlotCapacity] = useState(shop?.slot_capacity?.toString() || '2')
  const [isListed, setIsListed] = useState(shop?.is_listed ?? true)
  const [workingHours, setWorkingHours] = useState(
    shop?.working_hours || [
      { day: 'Monday', hours: '09:00 - 18:00' },
      { day: 'Tuesday', hours: '09:00 - 18:00' },
      { day: 'Wednesday', hours: '09:00 - 18:00' },
      { day: 'Thursday', hours: '09:00 - 18:00' },
      { day: 'Friday', hours: '09:00 - 18:00' },
      { day: 'Saturday', hours: '09:00 - 18:00' },
      { day: 'Sunday', hours: 'Closed', is_closed: true },
    ]
  )
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    if (!shop) return

    const updated: MockShop = {
      ...shop,
      name: name.trim(),
      city: city.trim(),
      address: address.trim(),
      phone: phone.trim(),
      slot_duration_minutes: Number(slotDuration) || 60,
      slot_capacity: Number(slotCapacity) || 2,
      is_listed: isListed,
      working_hours: workingHours,
    }

    saveShop(updated)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleToggleDay = (idx: number) => {
    setWorkingHours((prev) =>
      prev.map((wh, i) => {
        if (i !== idx) return wh
        return {
          day: wh.day,
          is_closed: !wh.is_closed,
          hours: wh.is_closed ? '09:00 - 18:00' : 'Closed',
        }
      })
    )
  }

  const handleHoursChange = (idx: number, hours: string) => {
    setWorkingHours((prev) =>
      prev.map((wh, i) => (i === idx ? { ...wh, hours } : wh))
    )
  }

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-[#1047FA]">
            Workshop Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mt-1">
            Shop Settings & Scheduling
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure workshop profile, bay scheduling, capacity, and weekly opening hours.
          </p>
        </div>

        {shop && (
          <Button
            asChild
            variant="outline"
            className="text-xs font-semibold border-neutral-300 rounded-full"
          >
            <Link href={`/shops/${shop.slug}`} target="_blank">
              <Globe className="size-3.5 mr-1.5 text-[#1047FA]" />
              View Public Page
              <ExternalLink className="size-3 ml-1 text-neutral-400" />
            </Link>
          </Button>
        )}
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>Workshop settings successfully saved!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="border-neutral-200">
          <CardHeader className="pb-3 border-b border-neutral-100">
            <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Building2 className="size-4 text-[#1047FA]" />
              Workshop Profile
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500">
              Details displayed to public customers and printed on repair invoices.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sName" className="text-xs font-semibold text-neutral-700">
                  Workshop Name
                </Label>
                <Input
                  id="sName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sCity" className="text-xs font-semibold text-neutral-700">
                  City
                </Label>
                <Input
                  id="sCity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sPhone" className="text-xs font-semibold text-neutral-700">
                  Workshop Phone
                </Label>
                <Input
                  id="sPhone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sAddr" className="text-xs font-semibold text-neutral-700">
                  Physical Address
                </Label>
                <Input
                  id="sAddr"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduling & Directory Card */}
        <Card className="border-neutral-200">
          <CardHeader className="pb-3 border-b border-neutral-100">
            <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Clock className="size-4 text-[#1047FA]" />
              Bay Slots & Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sDur" className="text-xs font-semibold text-neutral-700">
                  Slot Duration (min)
                </Label>
                <Input
                  id="sDur"
                  type="number"
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sCap" className="text-xs font-semibold text-neutral-700">
                  Simultaneous Bay Capacity
                </Label>
                <Input
                  id="sCap"
                  type="number"
                  value={slotCapacity}
                  onChange={(e) => setSlotCapacity(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Workshop Timezone</Label>
                <Input
                  value="Asia/Karachi (PKT, UTC+5)"
                  disabled
                  className="text-xs h-9 bg-neutral-100 text-neutral-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-neutral-900">List on Public Directory</span>
                <p className="text-[11px] text-neutral-500">
                  Visible on the landing page and search directory for customer bookings.
                </p>
              </div>
              <Switch checked={isListed} onCheckedChange={setIsListed} />
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Working Hours Card */}
        <Card className="border-neutral-200">
          <CardHeader className="pb-3 border-b border-neutral-100">
            <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <CalendarCheck className="size-4 text-[#1047FA]" />
              Weekly Operating Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <div className="divide-y divide-neutral-100 text-xs">
              {workingHours.map((wh, idx) => (
                <div
                  key={wh.day}
                  className="flex items-center justify-between py-2.5 px-2 hover:bg-neutral-50 rounded"
                >
                  <div className="flex items-center gap-3 w-32 font-bold text-neutral-800">
                    <Switch
                      checked={!wh.is_closed}
                      onCheckedChange={() => handleToggleDay(idx)}
                      aria-label={`Open status for ${wh.day}`}
                    />
                    <span>{wh.day}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {wh.is_closed ? (
                      <span className="text-neutral-400 font-semibold px-2 py-1 rounded bg-neutral-100 text-xs">
                        Closed
                      </span>
                    ) : (
                      <Input
                        value={wh.hours}
                        onChange={(e) => handleHoursChange(idx, e.target.value)}
                        className="h-8 w-44 text-xs font-mono"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 rounded-full"
        >
          <Save className="size-4 mr-1.5" />
          Save All Settings
        </Button>
      </form>
    </div>
  )
}
