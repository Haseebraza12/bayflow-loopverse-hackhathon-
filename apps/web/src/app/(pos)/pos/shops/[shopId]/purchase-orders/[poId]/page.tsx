'use client'

import { ArrowLeft, CheckCircle2, PackageCheck, Truck } from 'lucide-react'
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
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">Purchase order not found</h1>
        <Button asChild className="rounded-full bg-brand-blue text-xs text-white">
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-blue-ink"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Purchase Orders</span>
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
              <span className="font-mono text-2xl font-semibold text-brand-blue-ink">
                {po.po_number}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.32px] ${
                  po.status === 'RECEIVED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                }`}
              >
                {po.status}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">Supplier: {po.supplier}</p>
            <p className="text-xs text-helper">
              Ordered on {new Date(po.created_at).toLocaleDateString()}
            </p>
          </div>

          {po.status !== 'RECEIVED' && (
            <Button
              onClick={handleReceiveAll}
              className="h-9 rounded-full bg-emerald-600 px-5 text-xs font-bold text-white hover:bg-emerald-700"
            >
              <PackageCheck className="mr-1.5 size-4" />
              Receive Shipment into Stock
            </Button>
          )}
        </div>
      </div>

      {/* Items Card */}
      <Card className="overflow-hidden border-border">
        <CardHeader className="border-b border-border-faint bg-muted/80 p-4">
          <CardTitle className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-helper">
            <Truck className="size-4 text-brand-blue-ink" />
            Ordered Line Items ({po.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted text-[11px] font-bold text-subtle-foreground">
                <tr>
                  <th className="px-5 py-3">Part Description</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3 text-center">Ordered Qty</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-5 py-3 text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-faint text-muted-foreground">
                {po.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-5 py-3 font-semibold text-foreground">{item.part_name}</td>
                    <td className="px-4 py-3 font-mono text-helper">{item.part_sku}</td>
                    <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatPKR(item.unit_price)}</td>
                    <td className="px-5 py-3 text-right font-bold text-foreground">
                      {formatPKR(item.quantity * item.unit_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-border bg-muted/60 font-bold">
                <tr>
                  <td colSpan={4} className="px-5 py-3 text-right text-muted-foreground">
                    Total Order Value
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-brand-blue-ink">
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
