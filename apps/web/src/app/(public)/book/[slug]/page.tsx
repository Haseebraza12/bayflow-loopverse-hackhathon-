'use client'

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Car,
  Check,
  ChevronRight,
  Clock,
  Info,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getShopSuspensions } from '@/lib/mock-admin'
import { createBookingRecord, getCurrentUser, getServices, getShopBySlug } from '@/lib/mock-data'

const TIME_SLOTS = [
  '09:00 am',
  '10:00 am',
  '11:00 am',
  '12:00 pm',
  '02:00 pm',
  '03:00 pm',
  '04:00 pm',
  '05:00 pm',
]

function BookingWizardContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const preselectedServiceId = searchParams.get('service')

  const found = useMockStore(() => getShopBySlug(slug))
  const suspensions = useMockStore(getShopSuspensions)
  // A suspended shop takes no bookings and is treated as not found (D96).
  const shop = found && !suspensions[found.id] ? found : undefined
  const services = useMockStore(() => getServices(shop?.id))
  const currentUser = useMockStore(() => getCurrentUser())

  // Wizard Step: 2 = Services, 3 = Time, 4 = Details, 5 = Review
  const [currentStep, setCurrentStep] = useState<number>(2)

  // Step 2 State: the services the customer picked; null until they change the selection
  const [pickedServiceIds, setPickedServiceIds] = useState<string[] | null>(null)
  const [customerNotes, setCustomerNotes] = useState('')

  // Step 3 State
  const [scheduledDate, setScheduledDate] = useState('2026-10-12')
  const [scheduledTime, setScheduledTime] = useState('10:00 am')

  // Step 4 State: Customer & Vehicle
  const [customerName, setCustomerName] = useState(currentUser.name || 'Ahmed Raza')
  const [customerEmail, setCustomerEmail] = useState(
    currentUser.email || 'ahmed.customer@bayflow.test',
  )
  const [customerPhone, setCustomerPhone] = useState('+92 300 5544332')
  const [vehicleMake, setVehicleMake] = useState('Toyota')
  const [vehicleModel, setVehicleModel] = useState('Corolla GLi')
  const [vehicleYear, setVehicleYear] = useState('2020')
  const [licensePlate, setLicensePlate] = useState('LEA-20-4491')
  const [mileageKm, setMileageKm] = useState('45000')

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Preselect service if present in URL: until the customer changes the selection it is the
  // `?service=` service (when this shop offers it), otherwise the shop's first service.
  // Derived during render rather than copied into state by an effect.
  const defaultServiceIds =
    preselectedServiceId && services.some((s) => s.id === preselectedServiceId)
      ? [preselectedServiceId]
      : services[0]
        ? [services[0].id]
        : []
  const selectedServiceIds = pickedServiceIds ?? defaultServiceIds

  if (!shop) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Workshop Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          Please choose a valid workshop to book an appointment.
        </p>
        <Button asChild className="mt-6 rounded-full bg-brand-blue text-white">
          <Link href="/book">Choose a Workshop</Link>
        </Button>
      </div>
    )
  }

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id))
  const estimatedTotal = selectedServices.reduce((sum, s) => sum + (s.base_price || 0), 0)

  const handleToggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length === 1) {
        setError('Please choose at least one service.')
        return
      }
      setPickedServiceIds(selectedServiceIds.filter((sid) => sid !== id))
    } else {
      setPickedServiceIds([...selectedServiceIds, id])
    }
    setError(null)
  }

  const validateStep = (step: number): boolean => {
    setError(null)
    if (step === 2) {
      if (selectedServiceIds.length === 0) {
        setError('Please choose at least one service.')
        return false
      }
    } else if (step === 3) {
      if (!scheduledDate || !scheduledTime) {
        setError('Please select both an appointment date and a time slot.')
        return false
      }
    } else if (step === 4) {
      if (!customerName.trim()) {
        setError('Please enter your full name.')
        return false
      }
      if (!customerEmail.trim()) {
        setError('Please enter a valid email address.')
        return false
      }
      if (!vehicleMake.trim() || !vehicleModel.trim() || !licensePlate.trim()) {
        setError('Please enter the vehicle make, model, and registration plate.')
        return false
      }
    }
    return true
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    setError(null)
    setCurrentStep((prev) => Math.max(prev - 1, 2))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirmBooking = () => {
    setIsSubmitting(true)

    const newBooking = createBookingRecord({
      shopId: shop.id,
      shopSlug: shop.slug,
      shopName: shop.name,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      vehicleMake: vehicleMake.trim(),
      vehicleModel: vehicleModel.trim(),
      vehicleYear: Number(vehicleYear) || 2020,
      licensePlate: licensePlate.trim().toUpperCase(),
      services: selectedServices.map((s) => s.name),
      scheduledDate,
      scheduledTime,
      status: 'CONFIRMED',
      estimateItems: selectedServices.map((s, idx) => ({
        id: `est-item-${idx + 1}`,
        description: s.name,
        type: 'LABOR',
        quantity: 1,
        unit_price: s.base_price || 3000,
        total: s.base_price || 3000,
      })),
      estimateTotal: estimatedTotal || 3500,
      estimateApproved: false,
      paidAmount: 0,
    })

    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/book/confirmed/${newBooking.id}`)
    }, 400)
  }

  return (
    <div className="min-h-screen bg-muted/70 pb-24">
      {/* Stepper Progress Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
                <span>Step {currentStep} of 5</span>
                <span>•</span>
                <span className="font-semibold text-helper">{shop.name}</span>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                {currentStep === 2 && 'Choose Services & Describe Issue'}
                {currentStep === 3 && 'Pick an Appointment Time'}
                {currentStep === 4 && 'Your Vehicle & Contact Details'}
                {currentStep === 5 && 'Review & Confirm Booking'}
              </h1>
            </div>

            {/* Stepper visual bar */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[
                { step: 1, label: 'Shop', href: '/book' },
                { step: 2, label: 'Services' },
                { step: 3, label: 'Time' },
                { step: 4, label: 'Details' },
                { step: 5, label: 'Review' },
              ].map((s) => {
                const isPassed = s.step < currentStep
                const isCurrent = s.step === currentStep
                return (
                  <div key={s.step} className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={s.step > currentStep}
                      onClick={() => {
                        if (s.step === 1) router.push('/book')
                        else if (s.step < currentStep) setCurrentStep(s.step)
                      }}
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-brand-blue text-white ring-2 ring-blue-200 dark:ring-blue-800/60'
                          : isPassed
                            ? 'cursor-pointer bg-emerald-600 text-white'
                            : 'bg-secondary text-subtle-foreground'
                      }`}
                    >
                      {isPassed ? <Check className="size-3.5" /> : s.step}
                    </button>
                    {s.step < 5 && <div className="h-0.5 w-3 bg-layer-accent sm:w-6" />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Wizard Area */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Step Form Content (2 spans) */}
          <div className="space-y-6 lg:col-span-2">
            {error && (
              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50 text-red-900 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-100"
              >
                <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {/* STEP 2: Services */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-foreground">Select services requested</h2>
                  <p className="mt-0.5 text-xs text-helper">
                    Select one or more services. You will approve the formal technician estimate
                    before any physical work starts.
                  </p>
                </div>

                <div className="space-y-3">
                  {services.map((srv) => {
                    const isSelected = selectedServiceIds.includes(srv.id)
                    return (
                      <div
                        key={srv.id}
                        onClick={() => handleToggleService(srv.id)}
                        className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all ${
                          isSelected
                            ? 'border-brand-blue bg-blue-50/40 dark:bg-blue-950/30'
                            : 'border-border bg-card hover:border-border-medium'
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleService(srv.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-foreground">{srv.name}</h3>
                            <span className="text-xs font-bold text-foreground">
                              {srv.base_price ? formatPKR(srv.base_price) : 'Inspection needed'}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-helper">{srv.description}</p>
                          <div className="flex items-center gap-1.5 pt-0.5 text-[11px] text-subtle-foreground">
                            <Clock className="size-3" />
                            <span>Approx. {srv.estimated_duration_minutes} minutes</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Additional notes textarea */}
                <div className="space-y-2 pt-2">
                  <Label htmlFor="notes" className="text-xs font-bold text-muted-foreground">
                    Describe any symptoms, noises, or concerns (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="e.g. Check engine light illuminated yesterday, mild squeaking when braking above 50 km/h..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="h-24 bg-card text-xs"
                  />
                  <p className="text-[11px] text-subtle-foreground">
                    Our Service Advisor and assigned Technician read your notes before commencing
                    inspection.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Time Slot */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Select Date & Preferred Slot
                  </h2>
                  <p className="mt-0.5 text-xs text-helper">
                    Appointments are guaranteed on the workshop bay floor with allocated capacity.
                  </p>
                </div>

                {/* Date Picker Buttons */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">Choose Day</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { date: '2026-10-12', label: 'Mon, Oct 12' },
                      { date: '2026-10-13', label: 'Tue, Oct 13' },
                      { date: '2026-10-14', label: 'Wed, Oct 14' },
                      { date: '2026-10-15', label: 'Thu, Oct 15' },
                      { date: '2026-10-16', label: 'Fri, Oct 16' },
                      { date: '2026-10-17', label: 'Sat, Oct 17' },
                    ].map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setScheduledDate(d.date)}
                        className={`rounded-xl border p-3 text-center text-xs font-semibold transition-all ${
                          scheduledDate === d.date
                            ? 'border-brand-blue bg-brand-blue text-white'
                            : 'border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700/70'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Chips */}
                <div className="space-y-2 pt-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground">
                      Choose Arrival Slot
                    </Label>
                    <span className="text-[11px] text-subtle-foreground">
                      Shop timezone: {shop.timezone}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = scheduledTime === time
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setScheduledTime(time)}
                          className={`rounded-xl border p-3 text-center text-xs font-bold transition-all ${
                            isSelected
                              ? 'border-brand-blue bg-brand-blue text-white'
                              : 'border-border bg-card text-foreground hover:border-border-medium'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <Clock
                              className={`size-3.5 ${isSelected ? 'text-white' : 'text-subtle-foreground'}`}
                            />
                            <span>{time}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                  <Info className="mt-0.5 size-4 shrink-0 text-brand-blue-ink" />
                  <p className="text-xs leading-relaxed text-blue-900 dark:text-blue-100">
                    Arriving at your scheduled slot guarantees that a Service Advisor and bay lift
                    are pre-allocated for intake and computer diagnostics.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Contact & Vehicle Information
                  </h2>
                  <p className="mt-0.5 text-xs text-helper">
                    We use these details to contact you with your digital inspection report and
                    estimate.
                  </p>
                </div>

                {/* Customer Details Box */}
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-bold tracking-[0.32px] text-subtle-foreground">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="cName"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="cName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ahmed Raza"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="cPhone"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="cPhone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label
                        htmlFor="cEmail"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Email Address (for inspection reports)
                      </Label>
                      <Input
                        id="cEmail"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="name@example.test"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Details Box */}
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-subtle-foreground">
                    <Car className="size-3.5 text-helper" />
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vMake"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Make
                      </Label>
                      <Input
                        id="vMake"
                        value={vehicleMake}
                        onChange={(e) => setVehicleMake(e.target.value)}
                        placeholder="Toyota"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vModel"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Model
                      </Label>
                      <Input
                        id="vModel"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="Corolla GLi"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vYear"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Year
                      </Label>
                      <Input
                        id="vYear"
                        type="number"
                        value={vehicleYear}
                        onChange={(e) => setVehicleYear(e.target.value)}
                        placeholder="2020"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label
                        htmlFor="vPlate"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Registration Plate
                      </Label>
                      <Input
                        id="vPlate"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                        placeholder="LEA-20-4491"
                        className="h-9 font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vMileage"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Mileage (km)
                      </Label>
                      <Input
                        id="vMileage"
                        value={mileageKm}
                        onChange={(e) => setMileageKm(e.target.value)}
                        placeholder="45000"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Confirm */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-foreground">Review Booking Summary</h2>
                  <p className="mt-0.5 text-xs text-helper">
                    Please review your booking details before confirmation.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Shop & Slot */}
                  <div className="flex items-start justify-between rounded-xl border border-border bg-card p-4">
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold tracking-[0.32px] text-subtle-foreground">
                        Workshop & Time
                      </span>
                      <p className="text-sm font-bold text-foreground">{shop.name}</p>
                      <p className="text-helper">
                        {shop.address}, {shop.city}
                      </p>
                      <p className="pt-1 font-semibold text-brand-blue-ink">
                        {scheduledDate} at {scheduledTime}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-brand-blue-ink"
                    >
                      Edit
                    </Button>
                  </div>

                  {/* Services Selected */}
                  <div className="flex items-start justify-between rounded-xl border border-border bg-card p-4">
                    <div className="flex-1 space-y-2 text-xs">
                      <span className="text-[10px] font-bold tracking-[0.32px] text-subtle-foreground">
                        Selected Services ({selectedServices.length})
                      </span>
                      <div className="space-y-1.5 pt-1">
                        {selectedServices.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between pr-4 text-xs"
                          >
                            <span className="font-medium text-foreground">{s.name}</span>
                            <span className="font-semibold text-foreground">
                              {s.base_price ? formatPKR(s.base_price) : 'On inspection'}
                            </span>
                          </div>
                        ))}
                      </div>
                      {customerNotes && (
                        <div className="mt-2 rounded bg-muted p-2 text-[11px] text-muted-foreground italic">
                          &ldquo;{customerNotes}&rdquo;
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-brand-blue-ink"
                    >
                      Edit
                    </Button>
                  </div>

                  {/* Vehicle & Customer */}
                  <div className="flex items-start justify-between rounded-xl border border-border bg-card p-4">
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold tracking-[0.32px] text-subtle-foreground">
                        Customer & Vehicle
                      </span>
                      <p className="font-bold text-foreground">
                        {customerName} • {customerPhone}
                      </p>
                      <p className="text-helper">{customerEmail}</p>
                      <p className="pt-1 font-mono font-semibold text-foreground">
                        {licensePlate} — {vehicleYear} {vehicleMake} {vehicleModel}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs text-brand-blue-ink"
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/30">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs leading-relaxed text-emerald-950 dark:text-emerald-100">
                    <strong>Zero hidden costs:</strong> You will receive an itemized estimate after
                    inspection with parts and labor clearly distinguished. You approve or reject it
                    before any repair work commences.
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              {currentStep > 2 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="rounded-full text-xs font-semibold"
                >
                  <ArrowLeft className="mr-1.5 size-3.5" />
                  Back
                </Button>
              ) : (
                <Button asChild variant="outline" className="rounded-full text-xs font-semibold">
                  <Link href="/book">
                    <ArrowLeft className="mr-1.5 size-3.5" />
                    Change Workshop
                  </Link>
                </Button>
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-full bg-brand-blue px-6 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Continue
                  <ChevronRight className="ml-1.5 size-3.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="h-11 rounded-full bg-brand-green px-8 text-sm font-bold text-white hover:bg-emerald-600"
                >
                  {isSubmitting ? 'Confirming Appointment...' : 'Confirm Appointment'}
                </Button>
              )}
            </div>
          </div>

          {/* Right Sticky Order Summary */}
          <div className="space-y-4">
            <Card className="sticky top-20 border-border">
              <CardHeader className="border-b border-border-faint pb-3">
                <CardTitle className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <Building2 className="size-4 text-brand-blue-ink" />
                  Booking Summary
                </CardTitle>
                <CardDescription className="text-xs text-helper">{shop.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-subtle-foreground">Location</span>
                  <p className="font-medium text-foreground">{shop.address}</p>
                  <p className="text-helper">{shop.city}</p>
                </div>

                <div className="space-y-1 border-t border-border-faint pt-3">
                  <span className="text-[10px] font-bold text-subtle-foreground">
                    Selected Slot
                  </span>
                  <p className="font-semibold text-brand-blue-ink">
                    {scheduledDate} at {scheduledTime}
                  </p>
                </div>

                <div className="space-y-2 border-t border-border-faint pt-3">
                  <span className="text-[10px] font-bold text-subtle-foreground">
                    Services ({selectedServices.length})
                  </span>
                  <div className="space-y-1.5">
                    {selectedServices.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between text-muted-foreground"
                      >
                        <span className="truncate pr-2">{s.name}</span>
                        <span className="shrink-0 font-medium text-foreground">
                          {s.base_price ? formatPKR(s.base_price) : 'Inspection'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {estimatedTotal > 0 && (
                  <div className="flex items-center justify-between border-t border-border-faint pt-3 font-bold text-foreground">
                    <span>Estimated Base</span>
                    <span className="text-sm text-brand-blue-ink">{formatPKR(estimatedTotal)}</span>
                  </div>
                )}

                <div className="rounded-lg bg-muted p-2.5 text-[11px] leading-normal text-helper">
                  Final costs are verified with you once the vehicle is inspected on the workshop
                  hoist.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-subtle-foreground">
          Loading booking appointment...
        </div>
      }
    >
      <BookingWizardContent />
    </Suspense>
  )
}
