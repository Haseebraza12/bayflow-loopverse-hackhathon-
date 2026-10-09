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
  const [slotDuration, setSlotDuration] = useState(shop?.slot_duration_minutes?.toString() || '60')
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
    ],
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
      }),
    )
  }

  const handleHoursChange = (idx: number, hours: string) => {
    setWorkingHours((prev) => prev.map((wh, i) => (i === idx ? { ...wh, hours } : wh)))
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
            Workshop Configuration
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            Shop Settings & Scheduling
          </h1>
          <p className="mt-0.5 text-xs text-helper">
            Configure workshop profile, bay scheduling, capacity, and weekly opening hours.
          </p>
        </div>

        {shop && (
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border-medium text-xs font-semibold"
          >
            <Link href={`/shops/${shop.slug}`} target="_blank">
              <Globe className="mr-1.5 size-3.5 text-brand-blue-ink" />
              View Public Page
              <ExternalLink className="ml-1 size-3 text-subtle-foreground" />
            </Link>
          </Button>
        )}
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Workshop settings successfully saved!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="border-border">
          <CardHeader className="border-b border-border-faint pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Building2 className="size-4 text-brand-blue-ink" />
              Workshop Profile
            </CardTitle>
            <CardDescription className="text-xs text-helper">
              Details displayed to public customers and printed on repair invoices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sName" className="text-xs font-semibold text-muted-foreground">
                  Workshop Name
                </Label>
                <Input
                  id="sName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sCity" className="text-xs font-semibold text-muted-foreground">
                  City
                </Label>
                <Input
                  id="sCity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sPhone" className="text-xs font-semibold text-muted-foreground">
                  Workshop Phone
                </Label>
                <Input
                  id="sPhone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sAddr" className="text-xs font-semibold text-muted-foreground">
                  Physical Address
                </Label>
                <Input
                  id="sAddr"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduling & Directory Card */}
        <Card className="border-border">
          <CardHeader className="border-b border-border-faint pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Clock className="size-4 text-brand-blue-ink" />
              Bay Slots & Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="sDur" className="text-xs font-semibold text-muted-foreground">
                  Slot Duration (min)
                </Label>
                <Input
                  id="sDur"
                  type="number"
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sCap" className="text-xs font-semibold text-muted-foreground">
                  Simultaneous Bay Capacity
                </Label>
                <Input
                  id="sCap"
                  type="number"
                  value={slotCapacity}
                  onChange={(e) => setSlotCapacity(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Workshop Timezone
                </Label>
                <Input
                  value="Asia/Karachi (PKT, UTC+5)"
                  disabled
                  className="h-9 bg-secondary font-mono text-xs text-helper"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground">List on Public Directory</span>
                <p className="text-[11px] text-helper">
                  Visible on the landing page and search directory for customer bookings.
                </p>
              </div>
              <Switch checked={isListed} onCheckedChange={setIsListed} />
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Working Hours Card */}
        <Card className="border-border">
          <CardHeader className="border-b border-border-faint pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <CalendarCheck className="size-4 text-brand-blue-ink" />
              Weekly Operating Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            <div className="divide-y divide-border-faint text-xs">
              {workingHours.map((wh, idx) => (
                <div
                  key={wh.day}
                  className="flex items-center justify-between rounded px-2 py-2.5 hover:bg-muted"
                >
                  <div className="flex w-32 items-center gap-3 font-bold text-foreground">
                    <Switch
                      checked={!wh.is_closed}
                      onCheckedChange={() => handleToggleDay(idx)}
                      aria-label={`Open status for ${wh.day}`}
                    />
                    <span>{wh.day}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {wh.is_closed ? (
                      <span className="rounded bg-secondary px-2 py-1 text-xs font-semibold text-subtle-foreground">
                        Closed
                      </span>
                    ) : (
                      <Input
                        value={wh.hours}
                        onChange={(e) => handleHoursChange(idx, e.target.value)}
                        className="h-8 w-44 font-mono text-xs"
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
          className="h-10 rounded-full bg-brand-blue px-6 text-xs font-bold text-white hover:bg-blue-700"
        >
          <Save className="mr-1.5 size-4" />
          Save All Settings
        </Button>
      </form>
    </div>
  )
}
