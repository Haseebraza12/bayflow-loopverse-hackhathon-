'use client'

import { ArrowLeft, CheckCircle2, PackageCheck, PackageSearch, ShoppingCart } from 'lucide-react'
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
  type MockPurchaseOrder,
} from '@/lib/mock-data'

/**
 * A fresh id and number for a new mock purchase order. Impure on purpose (clock and random), so
 * it lives outside the component and only the "Confirm & Dispatch PO" click handler calls it.
 */
function newPurchaseOrderIdentity(): Pick<MockPurchaseOrder, 'id' | 'po_number'> {
  return {
    id: `po-${Date.now()}`,
    po_number: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
  }
}

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
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">Job not found</h1>
        <Button asChild className="rounded-full bg-brand-blue text-xs text-white">
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
        item.description.toLowerCase().includes(p.name.toLowerCase()),
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
      ...newPurchaseOrderIdentity(),
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
    setSuccessToast(
      `Purchase Order ${newPo.po_number} created with supplier. Status updated to Parts Ordered.`,
    )
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
    setSuccessToast(
      `Parts allocated and handed over to Technician ${booking.assignedTechnicianName || 'Imran'}! Vehicle is now in repair.`,
    )
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href={`${base}/parts`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-blue-ink"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Parts Queue</span>
        </Link>
      </div>

      {successToast && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Action Bar */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-semibold text-brand-blue-ink sm:text-2xl">
                {booking.reference}
              </span>
              <StatusBadge status={booking.status} audience="staff" size="md" />
            </div>
            <p className="font-mono text-sm font-bold text-foreground">
              {booking.licensePlate} • {booking.vehicleYear} {booking.vehicleMake}{' '}
              {booking.vehicleModel}
            </p>
            <p className="text-xs text-helper">
              Assigned Technician:{' '}
              <strong className="text-foreground">
                {booking.assignedTechnicianName || 'Imran'}
              </strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {anyShortage && booking.status === 'PARTS_PENDING' && (
              <Button
                onClick={() => setOrderDialogOpen(true)}
                className="h-9 bg-brand-blue px-4 text-xs font-bold text-white hover:bg-blue-700"
              >
                <ShoppingCart className="mr-1.5 size-3.5" />
                Order Missing Parts ({partRows.filter((r) => r.shortage > 0).length})
              </Button>
            )}

            {!anyShortage && booking.status === 'PARTS_PENDING' && (
              <Button
                onClick={handleMarkReady}
                className="h-9 rounded-full bg-brand-green px-4 text-xs font-bold text-white hover:bg-emerald-600"
              >
                <CheckCircle2 className="mr-1.5 size-3.5" />
                Mark Parts Ready
              </Button>
            )}

            {booking.status === 'PARTS_ORDERED' && (
              <Button
                onClick={handleMarkReady}
                className="h-9 rounded-full bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700"
              >
                Receive Shipment & Mark Ready
              </Button>
            )}

            {booking.status === 'PARTS_READY' && (
              <Button
                onClick={handleAllocateParts}
                className="h-9 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <PackageCheck className="mr-1.5 size-3.5" />
                Allocate Parts to Technician
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Parts Requirements vs Stock Table */}
      <Card className="overflow-hidden border-border">
        <CardHeader className="border-b border-border-faint bg-muted/80 p-4">
          <CardTitle className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-helper">
            <PackageSearch className="size-4 text-brand-blue-ink" />
            Required Parts vs Available Warehouse Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted text-[11px] font-bold text-subtle-foreground">
                <tr>
                  <th className="px-5 py-2.5">Part Name & SKU</th>
                  <th className="px-4 py-2.5 text-center">Required</th>
                  <th className="px-4 py-2.5 text-center">Warehouse Stock</th>
                  <th className="px-4 py-2.5 text-center">Shortage</th>
                  <th className="px-5 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-faint text-muted-foreground">
                {partRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-subtle-foreground">
                      No part components required — this is a labor-only service.
                    </td>
                  </tr>
                ) : (
                  partRows.map((r, idx) => (
                    <tr key={idx} className="hover:bg-muted/60">
                      <td className="px-5 py-3">
                        <p className="font-bold text-foreground">{r.description}</p>
                        <p className="font-mono text-[11px] text-subtle-foreground">{r.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">{r.required}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-bold ${r.onHand >= r.required ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}
                        >
                          {r.onHand} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        {r.shortage > 0 ? (
                          <span className="rounded bg-red-50 px-2 py-0.5 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                            Short {r.shortage}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">None</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {r.shortage > 0 ? (
                          <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-900/40 dark:text-red-200">
                            Order Required
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
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
            <DialogTitle className="text-base font-bold text-foreground">
              Create Supplier Purchase Order
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              A Purchase Order will be created for the shortage items and linked to this job.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">Supplier Name</Label>
              <Input
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1 rounded-lg border border-border-faint bg-muted p-3">
              <span className="font-bold text-foreground">Items to Order:</span>
              {partRows
                .filter((r) => r.shortage > 0)
                .map((r, i) => (
                  <p key={i} className="text-muted-foreground">
                    • {r.shortage} × {r.description} ({formatPKR(r.unitCost)} each)
                  </p>
                ))}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setOrderDialogOpen(false)}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePo}
              className="rounded-full bg-brand-blue text-xs font-bold text-white"
            >
              Confirm & Dispatch PO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
