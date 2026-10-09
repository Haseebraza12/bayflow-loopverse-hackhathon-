'use client'

import { AlertTriangle, ArrowLeft, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/status-badge'
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
    'All safety checks verified. Road test completed on main boulevard.',
  )
  const [failDialogOpen, setFailDialogOpen] = useState(false)
  const [issueTitle, setIssueTitle] = useState('Minor fluid seep detected at oil drain plug')
  const [issueDesc, setIssueDesc] = useState(
    'Re-torque crush washer to factory specification and re-clean engine undershield.',
  )
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  if (!booking) {
    return (
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">Job not found</h1>
        <Button asChild className="rounded-full bg-brand-blue text-xs text-white">
          <Link href={`${base}/qc`}>Back to QC Queue</Link>
        </Button>
      </div>
    )
  }

  const handleToggleChecklist = (key: string, passed: boolean) => {
    setChecklist((prev) => prev.map((item) => (item.key === key ? { ...item, passed } : item)))
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
    setToastMsg(
      `Job returned to Technician ${booking.assignedTechnicianName || 'Imran'} with noted issue.`,
    )
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-blue-ink"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to QC Queue</span>
        </Link>
      </div>

      {toastMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Status Card */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-semibold text-brand-blue-ink sm:text-2xl">
                {booking.licensePlate}
              </span>
              <StatusBadge status={booking.status} audience="staff" size="md" />
              <span className="font-mono text-xs text-subtle-foreground">{booking.reference}</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
            </p>
            <p className="text-xs text-helper">
              Repair Technician:{' '}
              <strong className="text-foreground">
                {booking.assignedTechnicianName || 'Imran'}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePassQc}
              disabled={!allPassed}
              className="h-9 rounded-full bg-emerald-600 px-5 text-xs font-bold text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="mr-1.5 size-4" />
              Pass QC & Authorize Handover
            </Button>

            <Button
              variant="outline"
              onClick={() => setFailDialogOpen(true)}
              className="h-9 border-red-200 px-4 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-800/60 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <XCircle className="mr-1.5 size-4" />
              Fail QC & Return to Tech
            </Button>
          </div>
        </div>
      </div>

      {/* 5-Point QC Checklist */}
      <Card className="overflow-hidden border-border">
        <CardHeader className="border-b border-border-faint bg-muted/80 p-4">
          <CardTitle className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-helper">
            <ShieldCheck className="size-4 text-brand-blue-ink" />
            Mandatory 5-Point Vehicle Inspection Protocol
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border-faint p-0">
          {checklist.map((item) => (
            <div
              key={item.key}
              className={`flex flex-col justify-between gap-4 p-4 transition-colors sm:flex-row sm:items-center sm:p-5 ${
                item.passed ? 'bg-card' : 'bg-red-50/30 dark:bg-red-950/30'
              }`}
            >
              <div className="max-w-xl space-y-1">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>

              {/* Pass / Fail Toggle */}
              <div className="flex items-center gap-1.5 self-start rounded-xl bg-secondary p-1 sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleChecklist(item.key, true)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                    item.passed
                      ? 'bg-emerald-600 text-white'
                      : 'text-muted-foreground hover:text-foreground'
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
                      : 'text-muted-foreground hover:text-foreground'
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
      <Card className="border-border">
        <CardHeader className="border-b border-border-faint pb-3">
          <CardTitle className="text-xs font-bold tracking-[0.32px] text-helper">
            Inspector Certification Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <Textarea
            value={inspectorNotes}
            onChange={(e) => setInspectorNotes(e.target.value)}
            placeholder="Record tyre pressure readings, brake test comments, diagnostic scanner notes..."
            className="h-24 text-xs"
          />
          <p className="text-[11px] text-subtle-foreground">
            This certification note is stored on the customer booking record and confirms
            road-worthiness.
          </p>
        </CardContent>
      </Card>

      {/* Fail QC Modal */}
      <Dialog open={failDialogOpen} onOpenChange={setFailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-red-950 dark:text-red-100">
              <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
              Fail QC & Return Job to Bay
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              The booking will be placed back into IN_REPAIR. Specify the issue found so Technician{' '}
              {booking.assignedTechnicianName || 'Imran'} can rectify it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">Issue Title</Label>
              <Input
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">
                Detailed Defect Description
              </Label>
              <Textarea
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                className="h-24 text-xs"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setFailDialogOpen(false)}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmFailQc}
              className="rounded-full bg-red-600 text-xs font-bold text-white"
            >
              Confirm Return to Technician
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
