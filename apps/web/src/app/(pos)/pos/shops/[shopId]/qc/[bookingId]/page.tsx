'use client'

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/status-badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMockStore } from '@/hooks/use-mock-store'
import { getBookingById, saveBooking, type MockBooking } from '@/lib/mock-data'

interface ChecklistItem {
  key: string
  title: string
  desc: string
  passed: boolean
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    key: 'BRAKES_AND_SAFETY',
    title: '1. Brakes & Hydraulic Safety',
    desc: 'Verify caliper torques, pad seating, pedal firmness and zero fluid sweating on lines.',
    passed: true,
  },
  {
    key: 'FLUIDS_AND_LEAKS',
    title: '2. Fluid Levels & Leak Inspection',
    desc: 'Check motor oil, radiator coolant, brake reservoir level and inspect engine belly tray for leaks.',
    passed: true,
  },
  {
    key: 'ELECTRICAL_AND_LIGHTS',
    title: '3. Electrical, Lights & Wipers',
    desc: 'High/low beams, indicators, reverse lights, horn, washer jets and 12V battery terminal snugness.',
    passed: true,
  },
  {
    key: 'DIAGNOSTIC_CLEAR',
    title: '4. Computer Diagnostic Scan',
    desc: 'OBD-II scanner plug-in: zero active DTC fault codes and instrument cluster MIL off.',
    passed: true,
  },
  {
    key: 'ROAD_TEST_AND_ALIGNMENT',
    title: '5. Road Test & Wheel Alignment',
    desc: 'Dynamic 3-5 km drive: straight tracking, zero steering vibration at 60 km/h, suspension quiet.',
    passed: true,
  },
]

export default function QcInspectionPage() {
  const router = useRouter()
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'
  const bookingId = typeof params?.bookingId === 'string' ? params.bookingId : ''

  const booking = useMockStore(() => getBookingById(bookingId))

  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST)
  const [inspectorNotes, setInspectorNotes] = useState(
    'All safety checks verified. Road test completed on main boulevard.'
  )
  const [failDialogOpen, setFailDialogOpen] = useState(false)
  const [issueTitle, setIssueTitle] = useState('Minor fluid seep detected at oil drain plug')
  const [issueDesc, setIssueDesc] = useState(
    'Re-torque crush washer to factory specification and re-clean engine undershield.'
  )
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  if (!booking) {
    return (
      <div className="py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">Job not found</h1>
        <Button asChild className="bg-[#1047FA] text-white text-xs rounded-full">
          <Link href={`${base}/qc`}>Back to QC Queue</Link>
        </Button>
      </div>
    )
  }

  const handleToggleChecklist = (key: string, passed: boolean) => {
    setChecklist((prev) =>
      prev.map((item) => (item.key === key ? { ...item, passed } : item))
    )
  }

  const allPassed = checklist.every((item) => item.passed)

  // Pass QC
  const handlePassQc = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'READY_FOR_PICKUP',
      qcPassed: true,
      qcNotes: inspectorNotes,
    }
    saveBooking(updated)
    setToastMsg(`QC passed successfully! ${booking.reference} is now marked READY FOR PICK-UP.`)
    setTimeout(() => {
      router.push(`${base}/qc`)
    }, 1500)
  }

  // Fail QC (returns to Technician)
  const handleConfirmFailQc = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'IN_REPAIR',
      qcPassed: false,
      qcNotes: `QC Issue: ${issueTitle} — ${issueDesc}`,
    }
    saveBooking(updated)
    setFailDialogOpen(false)
    setToastMsg(`Job returned to Technician ${booking.assignedTechnicianName || 'Imran'} with noted issue.`)
    setTimeout(() => {
      router.push(`${base}/qc`)
    }, 1500)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href={`${base}/qc`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#1047FA]"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to QC Queue</span>
        </Link>
      </div>

      {toastMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Status Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-semibold text-[#1047FA]">
                {booking.licensePlate}
              </span>
              <StatusBadge status={booking.status} audience="staff" size="md" />
              <span className="text-xs font-mono text-neutral-400">{booking.reference}</span>
            </div>
            <p className="text-sm font-bold text-neutral-900">
              {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
            </p>
            <p className="text-xs text-neutral-500">
              Repair Technician: <strong className="text-neutral-800">{booking.assignedTechnicianName || 'Imran'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePassQc}
              disabled={!allPassed}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-5 rounded-full"
            >
              <CheckCircle2 className="size-4 mr-1.5" />
              Pass QC & Authorize Handover
            </Button>

            <Button
              variant="outline"
              onClick={() => setFailDialogOpen(true)}
              className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold h-9 px-4"
            >
              <XCircle className="size-4 mr-1.5" />
              Fail QC & Return to Tech
            </Button>
          </div>
        </div>
      </div>

      {/* 5-Point QC Checklist */}
      <Card className="border-neutral-200 overflow-hidden">
        <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 p-4">
          <CardTitle className="text-xs font-bold tracking-[0.32px] text-neutral-500 flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-[#1047FA]" />
            Mandatory 5-Point Vehicle Inspection Protocol
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-neutral-100">
          {checklist.map((item) => (
            <div
              key={item.key}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                item.passed ? 'bg-white' : 'bg-red-50/30'
              }`}
            >
              <div className="space-y-1 max-w-xl">
                <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
              </div>

              {/* Pass / Fail Toggle */}
              <div className="flex items-center gap-1.5 self-start sm:self-center bg-neutral-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleToggleChecklist(item.key, true)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                    item.passed
                      ? 'bg-emerald-600 text-white'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Pass
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleChecklist(item.key, false)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                    !item.passed
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Fail
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Inspector Notes */}
      <Card className="border-neutral-200">
        <CardHeader className="pb-3 border-b border-neutral-100">
          <CardTitle className="text-xs font-bold tracking-[0.32px] text-neutral-500">
            Inspector Certification Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <Textarea
            value={inspectorNotes}
            onChange={(e) => setInspectorNotes(e.target.value)}
            placeholder="Record tyre pressure readings, brake test comments, diagnostic scanner notes..."
            className="text-xs h-24"
          />
          <p className="text-[11px] text-neutral-400">
            This certification note is stored on the customer booking record and confirms road-worthiness.
          </p>
        </CardContent>
      </Card>

      {/* Fail QC Modal */}
      <Dialog open={failDialogOpen} onOpenChange={setFailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-950 flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-600" />
              Fail QC & Return Job to Bay
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              The booking will be placed back into IN_REPAIR. Specify the issue found so Technician {booking.assignedTechnicianName || 'Imran'} can rectify it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-neutral-700">Issue Title</Label>
              <Input
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-neutral-700">Detailed Defect Description</Label>
              <Textarea
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                className="text-xs h-24"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setFailDialogOpen(false)} className="text-xs font-semibold">
              Cancel
            </Button>
            <Button onClick={handleConfirmFailQc} className="bg-red-600 text-white text-xs font-bold rounded-full">
              Confirm Return to Technician
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
