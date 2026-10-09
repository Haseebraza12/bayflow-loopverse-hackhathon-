'use client'

import {
  ArrowLeft,
  CheckCircle2,
  PackageCheck,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import {
  adjustPartStock,
  getPurchaseOrders,
  savePurchaseOrder,
  type MockPurchaseOrder,
} from '@/lib/mock-data'

export default function PurchaseOrderDetailPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'
  const poId = typeof params?.poId === 'string' ? params.poId : ''

  const pos = useMockStore(() => getPurchaseOrders(shopId))
  const po = pos.find((p) => p.id === poId || p.po_number === poId)

  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  if (!po) {
    return (
      <div className="py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">Purchase order not found</h1>
        <Button asChild className="bg-[#1047FA] text-white text-xs">
          <Link href={`${base}/purchase-orders`}>Back to Orders</Link>
        </Button>
      </div>
    )
  }

  const handleReceiveAll = () => {
    // Increase stock for each item in inventory
    po.items.forEach((it) => {
      adjustPartStock(it.part_sku, it.quantity)
    })

    const updated: MockPurchaseOrder = {
      ...po,
      status: 'RECEIVED',
    }
    savePurchaseOrder(updated)
    setToastMsg(`Items received into warehouse! Inventory stock balances have been updated.`)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href={`${base}/purchase-orders`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#1047FA]"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Purchase Orders</span>
        </Link>
      </div>

      {toastMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Status Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-extrabold text-[#1047FA]">
                {po.po_number}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  po.status === 'RECEIVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {po.status}
              </span>
            </div>
            <p className="text-sm font-bold text-neutral-900">Supplier: {po.supplier}</p>
            <p className="text-xs text-neutral-500">
              Ordered on {new Date(po.created_at).toLocaleDateString()}
            </p>
          </div>

          {po.status !== 'RECEIVED' && (
            <Button
              onClick={handleReceiveAll}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-5 shadow-sm"
            >
              <PackageCheck className="size-4 mr-1.5" />
              Receive Shipment into Stock
            </Button>
          )}
        </div>
      </div>

      {/* Items Card */}
      <Card className="border-neutral-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 p-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <Truck className="size-4 text-[#1047FA]" />
            Ordered Line Items ({po.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-[11px] font-bold uppercase text-neutral-400 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3">Part Description</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3 text-center">Ordered Qty</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-5 py-3 text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {po.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-5 py-3 font-semibold text-neutral-900">{item.part_name}</td>
                    <td className="px-4 py-3 font-mono text-neutral-500">{item.part_sku}</td>
                    <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatPKR(item.unit_price)}</td>
                    <td className="px-5 py-3 text-right font-bold text-neutral-900">
                      {formatPKR(item.quantity * item.unit_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-neutral-200 bg-neutral-50/60 font-bold">
                <tr>
                  <td colSpan={4} className="px-5 py-3 text-right text-neutral-600">
                    Total Order Value
                  </td>
                  <td className="px-5 py-3 text-right font-extrabold text-sm text-[#1047FA]">
                    {formatPKR(po.total_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
