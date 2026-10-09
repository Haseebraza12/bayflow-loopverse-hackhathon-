'use client'

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  PackageCheck,
  PackageSearch,
  ShoppingCart,
  Truck,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import {
  getBookingById,
  getInventory,
  saveBooking,
  savePurchaseOrder,
  type MockBooking,
  type MockPurchaseOrder,
} from '@/lib/mock-data'

export default function PartsJobDetailPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'
  const bookingId = typeof params?.bookingId === 'string' ? params.bookingId : ''

  const booking = useMockStore(() => getBookingById(bookingId))
  const inventory = useMockStore(() => getInventory(shopId))

  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [supplierName, setSupplierName] = useState('Toyota Genuine Parts Wholesale')
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  if (!booking) {
    return (
      <div className="py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">Job not found</h1>
        <Button asChild className="bg-[#1047FA] text-white text-xs rounded-full">
          <Link href={`${base}/parts`}>Back to Parts Queue</Link>
        </Button>
      </div>
    )
  }

  // Filter part items from estimate
  const partItems = booking.estimateItems.filter((i) => i.type === 'PART')

  // Calculate stock availability per required part
  const partRows = partItems.map((item) => {
    const match = inventory.find(
      (p) =>
        p.name.toLowerCase().includes(item.description.toLowerCase()) ||
        item.description.toLowerCase().includes(p.name.toLowerCase())
    )
    const onHand = match ? match.on_hand : 0
    const required = item.quantity
    const shortage = Math.max(0, required - onHand)

    return {
      description: item.description,
      sku: match ? match.sku : 'PRT-GEN',
      unitCost: item.unit_price,
      required,
      onHand,
      shortage,
    }
  })

  const anyShortage = partRows.some((r) => r.shortage > 0)

  // Actions
  const handleCreatePo = () => {
    const shortRows = partRows.filter((r) => r.shortage > 0)
    const newPo: MockPurchaseOrder = {
      id: `po-${Date.now()}`,
      po_number: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      shopId,
      supplier: supplierName.trim(),
      created_at: new Date().toISOString(),
      status: 'ORDERED',
      items: shortRows.map((r) => ({
        part_sku: r.sku,
        part_name: r.description,
        quantity: r.shortage,
        unit_price: r.unitCost,
      })),
      total_amount: shortRows.reduce((sum, r) => sum + r.shortage * r.unitCost, 0),
    }

    savePurchaseOrder(newPo)

    // Update booking status to PARTS_ORDERED
    saveBooking({
      ...booking,
      status: 'PARTS_ORDERED',
    })

    setOrderDialogOpen(false)
    setSuccessToast(`Purchase Order ${newPo.po_number} created with supplier. Status updated to Parts Ordered.`)
  }

  const handleMarkReady = () => {
    saveBooking({
      ...booking,
      status: 'PARTS_READY',
    })
    setSuccessToast(`All parts verified in stock! Marked PARTS_READY for bay release.`)
  }

  const handleAllocateParts = () => {
    saveBooking({
      ...booking,
      status: 'IN_REPAIR',
    })
    setSuccessToast(`Parts allocated and handed over to Technician ${booking.assignedTechnicianName || 'Imran'}! Vehicle is now in repair.`)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href={`${base}/parts`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#1047FA]"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Parts Queue</span>
        </Link>
      </div>

      {successToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Action Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-semibold text-[#1047FA]">
                {booking.reference}
              </span>
              <StatusBadge status={booking.status} audience="staff" size="md" />
            </div>
            <p className="text-sm font-bold text-neutral-900 font-mono">
              {booking.licensePlate} • {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
            </p>
            <p className="text-xs text-neutral-500">
              Assigned Technician: <strong className="text-neutral-800">{booking.assignedTechnicianName || 'Imran'}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {anyShortage && booking.status === 'PARTS_PENDING' && (
              <Button
                onClick={() => setOrderDialogOpen(true)}
                className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs h-9 px-4"
              >
                <ShoppingCart className="size-3.5 mr-1.5" />
                Order Missing Parts ({partRows.filter((r) => r.shortage > 0).length})
              </Button>
            )}

            {!anyShortage && booking.status === 'PARTS_PENDING' && (
              <Button
                onClick={handleMarkReady}
                className="bg-[#00c070] hover:bg-emerald-600 text-white font-bold text-xs h-9 px-4 rounded-full"
              >
                <CheckCircle2 className="size-3.5 mr-1.5" />
                Mark Parts Ready
              </Button>
            )}

            {booking.status === 'PARTS_ORDERED' && (
              <Button
                onClick={handleMarkReady}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 rounded-full"
              >
                Receive Shipment & Mark Ready
              </Button>
            )}

            {booking.status === 'PARTS_READY' && (
              <Button
                onClick={handleAllocateParts}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 rounded-full"
              >
                <PackageCheck className="size-3.5 mr-1.5" />
                Allocate Parts to Technician
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Parts Requirements vs Stock Table */}
      <Card className="border-neutral-200 overflow-hidden">
        <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 p-4">
          <CardTitle className="text-xs font-bold tracking-[0.32px] text-neutral-500 flex items-center gap-1.5">
            <PackageSearch className="size-4 text-[#1047FA]" />
            Required Parts vs Available Warehouse Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-[11px] font-bold text-neutral-400 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-2.5">Part Name & SKU</th>
                  <th className="px-4 py-2.5 text-center">Required</th>
                  <th className="px-4 py-2.5 text-center">Warehouse Stock</th>
                  <th className="px-4 py-2.5 text-center">Shortage</th>
                  <th className="px-5 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {partRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-neutral-400">
                      No part components required — this is a labor-only service.
                    </td>
                  </tr>
                ) : (
                  partRows.map((r, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/60">
                      <td className="px-5 py-3">
                        <p className="font-bold text-neutral-900">{r.description}</p>
                        <p className="text-[11px] font-mono text-neutral-400">{r.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">{r.required}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-bold ${r.onHand >= r.required ? 'text-emerald-700' : 'text-amber-700'}`}
                        >
                          {r.onHand} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        {r.shortage > 0 ? (
                          <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">
                            Short {r.shortage}
                          </span>
                        ) : (
                          <span className="text-emerald-600">None</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {r.shortage > 0 ? (
                          <span className="rounded bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5">
                            Order Required
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                            Available in Bin
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              Create Supplier Purchase Order
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              A Purchase Order will be created for the shortage items and linked to this job.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-neutral-700">Supplier Name</Label>
              <Input
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="rounded-lg bg-neutral-50 p-3 space-y-1 border border-neutral-100">
              <span className="font-bold text-neutral-900">Items to Order:</span>
              {partRows
                .filter((r) => r.shortage > 0)
                .map((r, i) => (
                  <p key={i} className="text-neutral-600">
                    • {r.shortage} × {r.description} ({formatPKR(r.unitCost)} each)
                  </p>
                ))}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOrderDialogOpen(false)} className="text-xs font-semibold">
              Cancel
            </Button>
            <Button onClick={handleCreatePo} className="bg-[#1047FA] text-white text-xs font-bold rounded-full">
              Confirm & Dispatch PO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
