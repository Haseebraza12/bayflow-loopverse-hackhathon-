'use client'

import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Play,
  Plus,
  Send,
  Trash2,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import {
  getBookingById,
  saveBooking,
  type MockBooking,
  type MockEstimateItem,
} from '@/lib/mock-data'

export default function TechnicianJobDetailPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'
  const bookingId = typeof params?.bookingId === 'string' ? params.bookingId : ''

  const booking = useMockStore(() => getBookingById(bookingId))

  const [notes, setNotes] = useState(booking?.inspectionNotes || '')
  const [items, setItems] = useState<MockEstimateItem[]>(booking?.estimateItems || [])
  const [newLineDesc, setNewLineDesc] = useState('')
  const [newLineType, setNewLineType] = useState<'PART' | 'LABOR'>('PART')
  const [newLineQty, setNewLineQty] = useState('1')
  const [newLinePrice, setNewLinePrice] = useState('2500')
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  if (!booking) {
    return (
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">Job not found</h1>
        <Button asChild className="rounded-full bg-brand-blue text-xs text-white">
          <Link href={`${base}/jobs`}>Back to My Jobs</Link>
        </Button>
      </div>
    )
  }

  const handleAddLineItem = () => {
    if (!newLineDesc.trim()) return
    const qty = Number(newLineQty) || 1
    const price = Number(newLinePrice) || 0
    const newItem: MockEstimateItem = {
      id: `est-${Date.now()}`,
      description: newLineDesc.trim(),
      type: newLineType,
      quantity: qty,
      unit_price: price,
      total: qty * price,
    }
    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    setNewLineDesc('')

    // Auto save to booking
    const total = updatedItems.reduce((sum, it) => sum + it.total, 0)
    saveBooking({
      ...booking,
      estimateItems: updatedItems,
      estimateTotal: total,
    })
  }

  const handleDeleteLineItem = (id: string) => {
    const updatedItems = items.filter((it) => it.id !== id)
    setItems(updatedItems)
    const total = updatedItems.reduce((sum, it) => sum + it.total, 0)
    saveBooking({
      ...booking,
      estimateItems: updatedItems,
      estimateTotal: total,
    })
  }

  const handleStartInspection = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'INSPECTING',
    }
    saveBooking(updated)
    setSuccessToast('Started physical inspection on bay hoist.')
  }

  const handleSubmitEstimate = () => {
    const total = items.reduce((sum, it) => sum + it.total, 0)
    const updated: MockBooking = {
      ...booking,
      status: 'ESTIMATE_REVIEW',
      inspectionNotes: notes,
      estimateItems: items,
      estimateTotal: total,
    }
    saveBooking(updated)
    setSuccessToast('Estimate submitted to Service Advisor for pricing review and customer send.')
  }

  const handleStartRepair = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'IN_REPAIR',
    }
    saveBooking(updated)
    setSuccessToast('Repair work commenced on vehicle.')
  }

  const handleSendToQc = () => {
    const updated: MockBooking = {
      ...booking,
      status: 'QC_PENDING',
    }
    saveBooking(updated)
    setSuccessToast('Repair complete! Job sent to QC Inspector queue for 5-point verification.')
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href={`${base}/jobs`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-blue-ink"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Assigned Jobs</span>
        </Link>
      </div>

      {successToast && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Vehicle Header & Action Bar */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-semibold text-brand-blue-ink sm:text-2xl">
                {booking.licensePlate}
              </span>
              <StatusBadge status={booking.status} audience="staff" size="md" />
              <span className="font-mono text-xs text-subtle-foreground">
                Ref: {booking.reference}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
            </p>
            <p className="text-xs text-helper">
              Assigned slot: {booking.scheduledDate} at {booking.scheduledTime}
            </p>
          </div>

          {/* Context Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {booking.status === 'ASSIGNED' && (
              <Button
                onClick={handleStartInspection}
                className="h-9 rounded-full bg-brand-blue px-4 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Play className="mr-1 size-3.5" />
                Start Inspection
              </Button>
            )}

            {booking.status === 'INSPECTING' && (
              <Button
                onClick={handleSubmitEstimate}
                className="h-9 rounded-full bg-brand-green px-4 text-xs font-bold text-white hover:bg-emerald-600"
              >
                <Send className="mr-1.5 size-3.5" />
                Submit Estimate to SA
              </Button>
            )}

            {booking.status === 'PARTS_READY' && (
              <Button
                onClick={handleStartRepair}
                className="h-9 rounded-full bg-brand-blue px-4 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Wrench className="mr-1 size-3.5" />
                Start Repair
              </Button>
            )}

            {booking.status === 'IN_REPAIR' && (
              <Button
                onClick={handleSendToQc}
                className="h-9 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <ClipboardCheck className="mr-1.5 size-3.5" />
                Finish Repair & Send to QC
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Estimate Lines Builder & Inspection Notes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 spans): Estimate Items Builder */}
        <div className="space-y-6 lg:col-span-2">
          {/* Estimate Builder Card */}
          <Card className="overflow-hidden border-border">
            <CardHeader className="border-b border-border-faint bg-muted/80 p-4">
              <CardTitle className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-helper">
                <FileText className="size-4 text-brand-blue-ink" />
                Estimate Line Items (Parts & Labor)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted text-[11px] font-bold text-subtle-foreground">
                    <tr>
                      <th className="px-5 py-2.5">Description</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Unit Cost</th>
                      <th className="px-5 py-2.5 text-right">Total</th>
                      <th className="px-3 py-2.5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-faint text-muted-foreground">
                    {items.map((it) => (
                      <tr key={it.id}>
                        <td className="px-5 py-3 font-semibold text-foreground">
                          {it.description}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`py-0.2 rounded px-1.5 text-[10px] font-bold ${
                              it.type === 'PART'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            {it.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">{it.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatPKR(it.unit_price)}</td>
                        <td className="px-5 py-3 text-right font-bold text-foreground">
                          {formatPKR(it.total)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteLineItem(it.id)}
                            className="rounded p-1 text-subtle-foreground hover:text-red-600 dark:hover:text-red-400"
                            title="Remove item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-border bg-muted/60 font-bold">
                    <tr>
                      <td colSpan={4} className="px-5 py-3 text-right text-muted-foreground">
                        Total Estimate
                      </td>
                      <td className="px-5 py-3 text-right text-sm font-semibold text-brand-blue-ink">
                        {formatPKR(items.reduce((sum, it) => sum + it.total, 0))}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Add New Line Item Form */}
              <div className="space-y-3 border-t border-border bg-muted/40 p-4">
                <span className="text-[11px] font-bold tracking-[0.32px] text-helper">
                  Add Item or Labor Operation
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-12">
                  <Input
                    placeholder="Item description (e.g. Front Brake Pad Set)"
                    value={newLineDesc}
                    onChange={(e) => setNewLineDesc(e.target.value)}
                    className="h-8 bg-card text-xs sm:col-span-5"
                  />
                  <select
                    value={newLineType}
                    onChange={(e) => setNewLineType(e.target.value as 'PART' | 'LABOR')}
                    className="h-8 rounded-md border border-border bg-card px-2 text-xs sm:col-span-2"
                  >
                    <option value="PART">Part</option>
                    <option value="LABOR">Labor</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newLineQty}
                    onChange={(e) => setNewLineQty(e.target.value)}
                    className="h-8 bg-card text-center text-xs sm:col-span-2"
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={newLinePrice}
                    onChange={(e) => setNewLinePrice(e.target.value)}
                    className="h-8 bg-card text-right text-xs sm:col-span-2"
                  />
                  <Button
                    type="button"
                    onClick={handleAddLineItem}
                    size="sm"
                    className="h-8 rounded-full bg-brand-blue p-0 text-white sm:col-span-1"
                    title="Add line"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspection Notes */}
          <Card className="border-border">
            <CardHeader className="border-b border-border-faint pb-3">
              <CardTitle className="text-xs font-bold tracking-[0.32px] text-helper">
                Diagnostic & Inspection Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <Textarea
                placeholder="Detail fault codes (OBD-II), measured pad thickness, visual leak findings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-28 text-xs"
              />
              <p className="text-[11px] text-subtle-foreground">
                These notes will be reviewed by the Service Advisor and shared on the
                customer&apos;s digital report.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer Complaint & Job Context */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="border-b border-border-faint pb-3">
              <CardTitle className="text-xs font-bold tracking-[0.32px] text-helper">
                Customer Complaint & Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-subtle-foreground">Requested Work</span>
                <div className="mt-1 space-y-1">
                  {booking.services.map((s, idx) => (
                    <div key={idx} className="font-semibold text-foreground">
                      • {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border-faint pt-3">
                <span className="text-[10px] font-bold text-subtle-foreground">Customer Notes</span>
                <p className="mt-1 rounded-lg border border-border-faint bg-muted p-3 text-muted-foreground italic">
                  &quot;{booking.customerName} reported: Routine scheduled service.&quot;
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
