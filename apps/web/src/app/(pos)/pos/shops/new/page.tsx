'use client'

import { ArrowLeft, Building2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { saveShop, setCurrentUser, getCurrentUser, type MockShop } from '@/lib/mock-data'

export default function CreateShopPage() {
  const router = useRouter()
  const user = getCurrentUser()

  const [name, setName] = useState('')
  const [city, setCity] = useState('Lahore')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [slotDuration, setSlotDuration] = useState('60')
  const [slotCapacity, setSlotCapacity] = useState('2')
  const [isListed, setIsListed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `shop-${Date.now()}`
    const id = `shop-${slug}`

    const newShop: MockShop = {
      id,
      slug,
      name: name.trim(),
      city: city.trim(),
      address: address.trim() || 'Main Workshop Boulevard',
      phone: phone.trim() || '+92 42 35001122',
      rating: null,
      slot_duration_minutes: Number(slotDuration) || 60,
      slot_capacity: Number(slotCapacity) || 2,
      timezone: 'Asia/Karachi',
      is_listed: isListed,
      working_hours: [
        { day: 'Monday', hours: '09:00 - 18:00' },
        { day: 'Tuesday', hours: '09:00 - 18:00' },
        { day: 'Wednesday', hours: '09:00 - 18:00' },
        { day: 'Thursday', hours: '09:00 - 18:00' },
        { day: 'Friday', hours: '09:00 - 18:00' },
        { day: 'Saturday', hours: '09:00 - 18:00' },
        { day: 'Sunday', hours: 'Closed', is_closed: true },
      ],
    }

    saveShop(newShop)

    // Update active user shop
    setCurrentUser({
      ...user,
      shopId: id,
      shopName: newShop.name,
      role: 'OWNER',
    })

    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/pos/shops/${id}/overview?welcome=1`)
    }, 400)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <Link
        href="/pos"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-blue-ink"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back to POS Hub</span>
      </Link>

      <Card className="border-border">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
            <Building2 className="size-4" />
            Shop Setup & Onboarding
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Create a New Auto Repair Workshop
          </CardTitle>
          <CardDescription className="text-xs text-helper">
            Set up workshop bays, appointment duration, opening schedule and public listing.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Profile */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-[0.32px] text-subtle-foreground">
                1. Workshop Identity
              </h3>

              <div className="space-y-1.5">
                <Label htmlFor="shopName" className="text-xs font-semibold text-muted-foreground">
                  Shop Name
                </Label>
                <Input
                  id="shopName"
                  placeholder="e.g. Apex Precision Motors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold text-muted-foreground">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Lahore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+92 42 35789011"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address" className="text-xs font-semibold text-muted-foreground">
                    Street Address & Area
                  </Label>
                  <Input
                    id="address"
                    placeholder="Plot 14, Main Commercial Boulevard, Phase 5"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bay Capacity & Scheduling */}
            <div className="space-y-4 border-t border-border-faint pt-4">
              <h3 className="text-xs font-bold tracking-[0.32px] text-subtle-foreground">
                2. Scheduling & Bay Allocation
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="slotDur" className="text-xs font-semibold text-muted-foreground">
                    Default Slot Duration (minutes)
                  </Label>
                  <Input
                    id="slotDur"
                    type="number"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-[11px] text-subtle-foreground">
                    Recommended: 60 minutes for diagnostics & intake.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="slotCap" className="text-xs font-semibold text-muted-foreground">
                    Simultaneous Bay Capacity
                  </Label>
                  <Input
                    id="slotCap"
                    type="number"
                    value={slotCapacity}
                    onChange={(e) => setSlotCapacity(e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-[11px] text-subtle-foreground">
                    Number of cars accepted in each time slot.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">
                    Show on Public Directory
                  </span>
                  <p className="text-[11px] text-helper">
                    Allow online customers to discover your shop and book services.
                  </p>
                </div>
                <Switch checked={isListed} onCheckedChange={setIsListed} />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full bg-brand-blue text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isSubmitting ? 'Configuring Workshop...' : 'Create Workshop & Open Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
