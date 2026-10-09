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
      <div className="py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">Job not found</h1>
        <Button asChild className="bg-[#1047FA] text-white text-xs">
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#1047FA]"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Assigned Jobs</span>
        </Link>
      </div>

      {successToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Vehicle Header & Action Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#1047FA]">
                {booking.licensePlate}
              </span>
              <StatusBadge status={booking.status} audience="staff" size="md" />
              <span className="text-xs font-mono text-neutral-400">Ref: {booking.reference}</span>
            </div>
            <p className="text-sm font-bold text-neutral-900">
              {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
            </p>
            <p className="text-xs text-neutral-500">
              Assigned slot: {booking.scheduledDate} at {booking.scheduledTime}
            </p>
          </div>

          {/* Context Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {booking.status === 'ASSIGNED' && (
              <Button
                onClick={handleStartInspection}
                className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs h-9 px-4"
              >
                <Play className="size-3.5 mr-1" />
                Start Inspection
              </Button>
            )}

            {booking.status === 'INSPECTING' && (
              <Button
                onClick={handleSubmitEstimate}
                className="bg-[#00c070] hover:bg-emerald-600 text-white font-bold text-xs h-9 px-4"
              >
                <Send className="size-3.5 mr-1.5" />
                Submit Estimate to SA
              </Button>
            )}

            {booking.status === 'PARTS_READY' && (
              <Button
                onClick={handleStartRepair}
                className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs h-9 px-4"
              >
                <Wrench className="size-3.5 mr-1" />
                Start Repair
              </Button>
            )}

            {booking.status === 'IN_REPAIR' && (
              <Button
                onClick={handleSendToQc}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4"
              >
                <ClipboardCheck className="size-3.5 mr-1.5" />
                Finish Repair & Send to QC
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Estimate Lines Builder & Inspection Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Estimate Items Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estimate Builder Card */}
          <Card className="border-neutral-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 p-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <FileText className="size-4 text-[#1047FA]" />
                Estimate Line Items (Parts & Labor)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-[11px] font-bold uppercase text-neutral-400 border-b border-neutral-200">
                    <tr>
                      <th className="px-5 py-2.5">Description</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Unit Cost</th>
                      <th className="px-5 py-2.5 text-right">Total</th>
                      <th className="px-3 py-2.5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {items.map((it) => (
                      <tr key={it.id}>
                        <td className="px-5 py-3 font-semibold text-neutral-900">{it.description}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                              it.type === 'PART'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {it.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">{it.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatPKR(it.unit_price)}</td>
                        <td className="px-5 py-3 text-right font-bold text-neutral-900">
                          {formatPKR(it.total)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteLineItem(it.id)}
                            className="text-neutral-400 hover:text-red-600 p-1 rounded"
                            title="Remove item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-neutral-200 bg-neutral-50/60 font-bold">
                    <tr>
                      <td colSpan={4} className="px-5 py-3 text-right text-neutral-600">
                        Total Estimate
                      </td>
                      <td className="px-5 py-3 text-right font-extrabold text-sm text-[#1047FA]">
                        {formatPKR(items.reduce((sum, it) => sum + it.total, 0))}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Add New Line Item Form */}
              <div className="p-4 bg-neutral-50/40 border-t border-neutral-200 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Add Item or Labor Operation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  <Input
                    placeholder="Item description (e.g. Front Brake Pad Set)"
                    value={newLineDesc}
                    onChange={(e) => setNewLineDesc(e.target.value)}
                    className="sm:col-span-5 h-8 text-xs bg-white"
                  />
                  <select
                    value={newLineType}
                    onChange={(e) => setNewLineType(e.target.value as 'PART' | 'LABOR')}
                    className="sm:col-span-2 h-8 rounded-md border border-neutral-200 bg-white px-2 text-xs"
                  >
                    <option value="PART">Part</option>
                    <option value="LABOR">Labor</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newLineQty}
                    onChange={(e) => setNewLineQty(e.target.value)}
                    className="sm:col-span-2 h-8 text-xs bg-white text-center"
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={newLinePrice}
                    onChange={(e) => setNewLinePrice(e.target.value)}
                    className="sm:col-span-2 h-8 text-xs bg-white text-right"
                  />
                  <Button
                    type="button"
                    onClick={handleAddLineItem}
                    size="sm"
                    className="sm:col-span-1 h-8 bg-[#1047FA] text-white p-0"
                    title="Add line"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspection Notes */}
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-neutral-100">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Diagnostic & Inspection Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Textarea
                placeholder="Detail fault codes (OBD-II), measured pad thickness, visual leak findings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs h-28"
              />
              <p className="text-[11px] text-neutral-400">
                These notes will be reviewed by the Service Advisor and shared on the customer&apos;s digital report.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer Complaint & Job Context */}
        <div className="space-y-6">
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-neutral-100">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Customer Complaint & Services
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Requested Work</span>
                <div className="space-y-1 mt-1">
                  {booking.services.map((s, idx) => (
                    <div key={idx} className="font-semibold text-neutral-900">
                      • {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Customer Notes</span>
                <p className="mt-1 text-neutral-700 italic bg-neutral-50 p-3 rounded-lg border border-neutral-100">
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
