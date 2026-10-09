'use client'

import { ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  getInventory,
  getPurchaseOrders,
  savePurchaseOrder,
  type MockPurchaseOrder,
} from '@/lib/mock-data'

export default function PurchaseOrdersPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'

  const pos = useMockStore(() => getPurchaseOrders(shopId))
  const inventory = useMockStore(() => getInventory(shopId))
  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  const [createOpen, setCreateOpen] = useState(false)
  const [supplier, setSupplier] = useState('Shell Lubricants Direct')
  const [partSku, setPartSku] = useState(inventory[0]?.sku || 'OIL-5W30-SYN')
  const [qty, setQty] = useState('10')
  const [price, setPrice] = useState('6500')

  const handleCreatePo = (e: FormEvent) => {
    e.preventDefault()
    const part = inventory.find((p) => p.sku === partSku) || inventory[0]
    const quantity = Number(qty) || 1
    const unitPrice = Number(price) || part?.unit_price || 3000

    const newPo: MockPurchaseOrder = {
      id: `po-${Date.now()}`,
      po_number: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      shopId,
      supplier: supplier.trim(),
      created_at: new Date().toISOString(),
      status: 'ORDERED',
      items: [
        {
          part_sku: part?.sku || 'SKU-GEN',
          part_name: part?.name || 'General Component',
          quantity,
          unit_price: unitPrice,
        },
      ],
      total_amount: quantity * unitPrice,
    }

    savePurchaseOrder(newPo)
    setCreateOpen(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
            Procurement & Suppliers
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            Purchase Orders
          </h1>
          <p className="mt-0.5 text-xs text-helper">
            Track wholesale orders, supplier shipments, and receive components into active stock.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="h-9 rounded-lg bg-brand-blue text-xs font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="mr-1 size-3.5" />
          Create Restock PO
        </Button>
      </div>

      {/* PO Table */}
      <Card className="overflow-hidden border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted text-[11px] font-bold text-subtle-foreground">
                <tr>
                  <th className="px-5 py-3">PO Number</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Items Summary</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total Amount</th>
                  <th className="px-5 py-3 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-faint text-muted-foreground">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-muted/60">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`${base}/purchase-orders/${po.id}`}
                        className="font-mono font-bold text-brand-blue-ink hover:underline"
                      >
                        {po.po_number}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-subtle-foreground">
                        {new Date(po.created_at).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-foreground">{po.supplier}</td>

                    <td className="px-4 py-3.5">
                      <p className="font-medium text-foreground">
                        {po.items.map((it) => `${it.quantity}× ${it.part_name}`).join(', ')}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.32px] ${
                          po.status === 'RECEIVED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                            : po.status === 'PARTIALLY_RECEIVED'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-bold text-foreground">
                      {formatPKR(po.total_amount)}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-full text-xs font-semibold"
                      >
                        <Link href={`${base}/purchase-orders/${po.id}`}>
                          {po.status === 'RECEIVED' ? 'View' : 'Receive'}
                          <ChevronRight className="ml-1 size-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create PO Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Create Restock Purchase Order
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              Dispatch an order to vendor for warehouse restocking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePo} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Supplier Name</Label>
              <Input
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Part SKU to Order
              </Label>
              <select
                value={partSku}
                onChange={(e) => setPartSku(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-xs font-medium"
              >
                {inventory.map((p) => (
                  <option key={p.id} value={p.sku}>
                    {p.name} ({p.sku}) — In Stock: {p.on_hand}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Quantity</Label>
                <Input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Unit Cost (PKR)
                </Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-brand-blue text-xs font-bold text-white"
              >
                Issue Purchase Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
