'use client'

import {
  ChevronRight,
  Plus,
} from 'lucide-react'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1047FA]">
            Procurement & Suppliers
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
            Purchase Orders
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Track wholesale orders, supplier shipments, and receive components into active stock.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-[#1047FA] hover:bg-blue-700 text-white font-semibold text-xs h-9 rounded-lg"
        >
          <Plus className="size-3.5 mr-1" />
          Create Restock PO
        </Button>
      </div>

      {/* PO Table */}
      <Card className="border-neutral-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-[11px] font-bold uppercase text-neutral-400 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3">PO Number</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Items Summary</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total Amount</th>
                  <th className="px-5 py-3 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-neutral-50/60">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`${base}/purchase-orders/${po.id}`}
                        className="font-mono font-bold text-[#1047FA] hover:underline"
                      >
                        {po.po_number}
                      </Link>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {new Date(po.created_at).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-neutral-900">{po.supplier}</td>

                    <td className="px-4 py-3.5">
                      <p className="font-medium text-neutral-800">
                        {po.items.map((it) => `${it.quantity}× ${it.part_name}`).join(', ')}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          po.status === 'RECEIVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : po.status === 'PARTIALLY_RECEIVED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-bold text-neutral-900">
                      {formatPKR(po.total_amount)}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs font-semibold"
                      >
                        <Link href={`${base}/purchase-orders/${po.id}`}>
                          {po.status === 'RECEIVED' ? 'View' : 'Receive'}
                          <ChevronRight className="size-3 ml-1" />
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
            <DialogTitle className="text-base font-bold text-neutral-900">
              Create Restock Purchase Order
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Dispatch an order to vendor for warehouse restocking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePo} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Supplier Name</Label>
              <Input
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Part SKU to Order</Label>
              <select
                value={partSku}
                onChange={(e) => setPartSku(e.target.value)}
                className="w-full text-xs font-medium rounded-md border border-neutral-200 bg-white px-3 py-2"
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
                <Label className="text-xs font-semibold text-neutral-700">Quantity</Label>
                <Input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Unit Cost (PKR)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="text-xs font-semibold">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1047FA] text-white font-bold text-xs">
                Issue Purchase Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
