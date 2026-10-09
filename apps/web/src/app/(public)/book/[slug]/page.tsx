'use client'

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar as CalendarIcon,
  Car,
  Check,
  ChevronRight,
  Clock,
  Info,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import {
  createBookingRecord,
  getCurrentUser,
  getServices,
  getShopBySlug,
  type MockBooking,
} from '@/lib/mock-data'

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

  const shop = useMockStore(() => getShopBySlug(slug))
  const services = useMockStore(() => getServices(shop?.id))
  const currentUser = useMockStore(() => getCurrentUser())

  // Wizard Step: 2 = Services, 3 = Time, 4 = Details, 5 = Review
  const [currentStep, setCurrentStep] = useState<number>(2)

  // Step 2 State
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [customerNotes, setCustomerNotes] = useState('')

  // Step 3 State
  const [scheduledDate, setScheduledDate] = useState('2026-10-12')
  const [scheduledTime, setScheduledTime] = useState('10:00 am')

  // Step 4 State: Customer & Vehicle
  const [customerName, setCustomerName] = useState(currentUser.name || 'Ahmed Raza')
  const [customerEmail, setCustomerEmail] = useState(
    currentUser.email || 'ahmed.customer@bayflow.test'
  )
  const [customerPhone, setCustomerPhone] = useState('+92 300 5544332')
  const [vehicleMake, setVehicleMake] = useState('Toyota')
  const [vehicleModel, setVehicleModel] = useState('Corolla GLi')
  const [vehicleYear, setVehicleYear] = useState('2020')
  const [licensePlate, setLicensePlate] = useState('LEA-20-4491')
  const [mileageKm, setMileageKm] = useState('45000')

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Preselect service if present in URL
  useEffect(() => {
    if (preselectedServiceId && services.some((s) => s.id === preselectedServiceId)) {
      setSelectedServiceIds([preselectedServiceId])
    } else if (services.length > 0 && selectedServiceIds.length === 0 && services[0]) {
      setSelectedServiceIds([services[0].id])
    }
  }, [preselectedServiceId, services])

  if (!shop) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Workshop Not Found</h1>
        <p className="mt-2 text-neutral-600">Please choose a valid workshop to book an appointment.</p>
        <Button asChild className="mt-6 bg-[#1047FA] text-white">
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
      setSelectedServiceIds(selectedServiceIds.filter((sid) => sid !== id))
    } else {
      setSelectedServiceIds([...selectedServiceIds, id])
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
    <div className="min-h-screen bg-neutral-50/70 pb-24">
      {/* Stepper Progress Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1047FA] mb-1">
                <span>Step {currentStep} of 5</span>
                <span>•</span>
                <span className="text-neutral-500 font-semibold">{shop.name}</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
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
                          ? 'bg-[#1047FA] text-white shadow-sm ring-2 ring-blue-200'
                          : isPassed
                            ? 'bg-emerald-600 text-white cursor-pointer'
                            : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {isPassed ? <Check className="size-3.5" /> : s.step}
                    </button>
                    {s.step < 5 && <div className="h-0.5 w-3 sm:w-6 bg-neutral-200" />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Wizard Area */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Step Form Content (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
                <AlertCircle className="size-4 text-red-600" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {/* STEP 2: Services */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Select services requested</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Select one or more services. You will approve the formal technician estimate before any physical work starts.
                  </p>
                </div>

                <div className="space-y-3">
                  {services.map((srv) => {
                    const isSelected = selectedServiceIds.includes(srv.id)
                    return (
                      <div
                        key={srv.id}
                        onClick={() => handleToggleService(srv.id)}
                        className={`flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#1047FA] bg-blue-50/40 shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleService(srv.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-neutral-900 text-sm">{srv.name}</h3>
                            <span className="text-xs font-bold text-neutral-900">
                              {srv.base_price ? formatPKR(srv.base_price) : 'Inspection needed'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed">
                            {srv.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 pt-0.5">
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
                  <Label htmlFor="notes" className="text-xs font-bold text-neutral-700">
                    Describe any symptoms, noises, or concerns (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="e.g. Check engine light illuminated yesterday, mild squeaking when braking above 50 km/h..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="text-xs h-24 bg-white"
                  />
                  <p className="text-[11px] text-neutral-400">
                    Our Service Advisor and assigned Technician read your notes before commencing inspection.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Time Slot */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Select Date & Preferred Slot</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Appointments are guaranteed on the workshop bay floor with allocated capacity.
                  </p>
                </div>

                {/* Date Picker Buttons */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-neutral-700">Choose Day</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                            ? 'border-[#1047FA] bg-[#1047FA] text-white shadow-sm'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-blue-300'
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
                    <Label className="text-xs font-bold text-neutral-700">Choose Arrival Slot</Label>
                    <span className="text-[11px] text-neutral-400">Shop timezone: {shop.timezone}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = scheduledTime === time
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setScheduledTime(time)}
                          className={`rounded-xl border p-3 text-center text-xs font-bold transition-all ${
                            isSelected
                              ? 'border-[#1047FA] bg-[#1047FA] text-white shadow-sm'
                              : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <Clock className={`size-3.5 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                            <span>{time}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex items-start gap-3">
                  <Info className="size-4 text-[#1047FA] shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Arriving at your scheduled slot guarantees that a Service Advisor and bay lift are pre-allocated for intake and computer diagnostics.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Contact & Vehicle Information</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    We use these details to contact you with your digital inspection report and estimate.
                  </p>
                </div>

                {/* Customer Details Box */}
                <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="cName" className="text-xs font-semibold text-neutral-700">
                        Full Name
                      </Label>
                      <Input
                        id="cName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ahmed Raza"
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cPhone" className="text-xs font-semibold text-neutral-700">
                        Phone Number
                      </Label>
                      <Input
                        id="cPhone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="cEmail" className="text-xs font-semibold text-neutral-700">
                        Email Address (for inspection reports)
                      </Label>
                      <Input
                        id="cEmail"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="name@example.test"
                        className="text-xs h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Details Box */}
                <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Car className="size-3.5 text-neutral-500" />
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="vMake" className="text-xs font-semibold text-neutral-700">
                        Make
                      </Label>
                      <Input
                        id="vMake"
                        value={vehicleMake}
                        onChange={(e) => setVehicleMake(e.target.value)}
                        placeholder="Toyota"
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="vModel" className="text-xs font-semibold text-neutral-700">
                        Model
                      </Label>
                      <Input
                        id="vModel"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="Corolla GLi"
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="vYear" className="text-xs font-semibold text-neutral-700">
                        Year
                      </Label>
                      <Input
                        id="vYear"
                        type="number"
                        value={vehicleYear}
                        onChange={(e) => setVehicleYear(e.target.value)}
                        placeholder="2020"
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="vPlate" className="text-xs font-semibold text-neutral-700">
                        Registration Plate
                      </Label>
                      <Input
                        id="vPlate"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                        placeholder="LEA-20-4491"
                        className="text-xs h-9 font-mono uppercase"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="vMileage" className="text-xs font-semibold text-neutral-700">
                        Mileage (km)
                      </Label>
                      <Input
                        id="vMileage"
                        value={mileageKm}
                        onChange={(e) => setMileageKm(e.target.value)}
                        placeholder="45000"
                        className="text-xs h-9"
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
                  <h2 className="text-base font-bold text-neutral-900">Review Booking Summary</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Please review your booking details before confirmation.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Shop & Slot */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 flex items-start justify-between">
                    <div className="space-y-1 text-xs">
                      <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                        Workshop & Time
                      </span>
                      <p className="font-bold text-neutral-900 text-sm">{shop.name}</p>
                      <p className="text-neutral-500">{shop.address}, {shop.city}</p>
                      <p className="font-semibold text-[#1047FA] pt-1">
                        {scheduledDate} at {scheduledTime}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[#1047FA]"
                    >
                      Edit
                    </Button>
                  </div>

                  {/* Services Selected */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 flex items-start justify-between">
                    <div className="space-y-2 text-xs flex-1">
                      <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                        Selected Services ({selectedServices.length})
                      </span>
                      <div className="space-y-1.5 pt-1">
                        {selectedServices.map((s) => (
                          <div key={s.id} className="flex items-center justify-between text-xs pr-4">
                            <span className="font-medium text-neutral-800">{s.name}</span>
                            <span className="font-semibold text-neutral-900">
                              {s.base_price ? formatPKR(s.base_price) : 'On inspection'}
                            </span>
                          </div>
                        ))}
                      </div>
                      {customerNotes && (
                        <div className="mt-2 rounded bg-neutral-50 p-2 text-[11px] text-neutral-600 italic">
                          &ldquo;{customerNotes}&rdquo;
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[#1047FA]"
                    >
                      Edit
                    </Button>
                  </div>

                  {/* Vehicle & Customer */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 flex items-start justify-between">
                    <div className="space-y-1 text-xs">
                      <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                        Customer & Vehicle
                      </span>
                      <p className="font-bold text-neutral-900">{customerName} • {customerPhone}</p>
                      <p className="text-neutral-500">{customerEmail}</p>
                      <p className="font-mono font-semibold text-neutral-800 pt-1">
                        {licensePlate} — {vehicleYear} {vehicleMake} {vehicleModel}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs text-[#1047FA]"
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-start gap-3">
                  <ShieldCheck className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    <strong>Zero hidden costs:</strong> You will receive an itemized estimate after inspection with parts and labor clearly distinguished. You approve or reject it before any repair work commences.
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
              {currentStep > 2 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="text-xs font-semibold"
                >
                  <ArrowLeft className="size-3.5 mr-1.5" />
                  Back
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="text-xs font-semibold"
                >
                  <Link href="/book">
                    <ArrowLeft className="size-3.5 mr-1.5" />
                    Change Workshop
                  </Link>
                </Button>
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-[#1047FA] hover:bg-blue-700 text-white font-semibold text-xs px-6"
                >
                  Continue
                  <ChevronRight className="size-3.5 ml-1.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="bg-[#00c070] hover:bg-emerald-600 text-white font-bold text-sm px-8 h-11 shadow-sm"
                >
                  {isSubmitting ? 'Confirming Appointment...' : 'Confirm Appointment'}
                </Button>
              )}
            </div>
          </div>

          {/* Right Sticky Order Summary */}
          <div className="space-y-4">
            <Card className="border-neutral-200 shadow-sm sticky top-20">
              <CardHeader className="pb-3 border-b border-neutral-100">
                <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <Building2 className="size-4 text-[#1047FA]" />
                  Booking Summary
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  {shop.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Location</span>
                  <p className="font-medium text-neutral-800">{shop.address}</p>
                  <p className="text-neutral-500">{shop.city}</p>
                </div>

                <div className="space-y-1 border-t border-neutral-100 pt-3">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Selected Slot</span>
                  <p className="font-semibold text-[#1047FA]">
                    {scheduledDate} at {scheduledTime}
                  </p>
                </div>

                <div className="space-y-2 border-t border-neutral-100 pt-3">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Services ({selectedServices.length})
                  </span>
                  <div className="space-y-1.5">
                    {selectedServices.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-neutral-700">
                        <span className="truncate pr-2">{s.name}</span>
                        <span className="font-medium text-neutral-900 shrink-0">
                          {s.base_price ? formatPKR(s.base_price) : 'Inspection'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {estimatedTotal > 0 && (
                  <div className="border-t border-neutral-100 pt-3 flex items-center justify-between font-bold text-neutral-900">
                    <span>Estimated Base</span>
                    <span className="text-[#1047FA] text-sm">{formatPKR(estimatedTotal)}</span>
                  </div>
                )}

                <div className="rounded-lg bg-neutral-50 p-2.5 text-[11px] text-neutral-500 leading-normal">
                  Final costs are verified with you once the vehicle is inspected on the workshop hoist.
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
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading booking appointment...</div>}>
      <BookingWizardContent />
    </Suspense>
  )
}
