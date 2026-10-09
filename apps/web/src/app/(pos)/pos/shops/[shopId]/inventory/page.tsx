'use client'

import { CheckCircle2, Plus, Search, SlidersHorizontal } from 'lucide-react'
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
import { adjustPartStock, getInventory, savePart, type MockPart } from '@/lib/mock-data'

export default function InventoryManagementPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'

  const inventory = useMockStore(() => getInventory(shopId))

  const [search, setSearch] = useState('')
  const [filterState, setFilterState] = useState<'ALL' | 'LOW' | 'OUT'>('ALL')

  // Add Part Modal
  const [addPartOpen, setAddPartOpen] = useState(false)
  const [newSku, setNewSku] = useState('')
  const [newName, setNewName] = useState('')
  const [newCategory] = useState('Brakes & Suspension')
  const [newReorder, setNewReorder] = useState('5')
  const [newPrice, setNewPrice] = useState('3500')

  // Adjust Stock Modal
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState<MockPart | null>(null)
  const [adjustDelta, setAdjustDelta] = useState('5')
  const [adjustReason, setAdjustReason] = useState('New shipment physical intake')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const filteredParts = inventory.filter((p) => {
    if (filterState === 'LOW' && (p.on_hand > p.reorder_level || p.on_hand === 0)) return false
    if (filterState === 'OUT' && p.on_hand > 0) return false

    if (search.trim()) {
      const q = search.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    }
    return true
  })

  const handleAddPart = (e: FormEvent) => {
    e.preventDefault()
    if (!newSku.trim() || !newName.trim()) return

    const part: MockPart = {
      id: `prt-${Date.now()}`,
      shopId,
      sku: newSku.trim().toUpperCase(),
      name: newName.trim(),
      category: newCategory,
      on_hand: 0,
      reserved: 0,
      reorder_level: Number(newReorder) || 5,
      unit_price: Number(newPrice) || 3000,
    }

    savePart(part)
    setAddPartOpen(false)
    setNewSku('')
    setNewName('')
    setToastMsg(`Added part "${part.name}" to inventory. Set opening stock using "Adjust".`)
    setTimeout(() => setToastMsg(null), 3500)
  }

  const handleAdjustStock = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedPart) return

    const delta = Number(adjustDelta) || 0
    adjustPartStock(selectedPart.id, delta)
    setAdjustOpen(false)
    setToastMsg(
      `Stock for ${selectedPart.name} updated by ${delta > 0 ? `+${delta}` : delta} units.`,
    )
    setTimeout(() => setToastMsg(null), 3500)
  }

  const openAdjust = (part: MockPart) => {
    setSelectedPart(part)
    setAdjustDelta('5')
    setAdjustReason('Physical stock intake / recount')
    setAdjustOpen(true)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
            Warehouse & Store
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            Parts & Lubricants Inventory
          </h1>
          <p className="mt-0.5 text-xs text-helper">
            Monitor on-hand inventory levels, reorder thresholds, and record stock adjustments.
          </p>
        </div>

        <Button
          onClick={() => setAddPartOpen(true)}
          className="h-9 rounded-lg bg-brand-blue text-xs font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="mr-1 size-3.5" />
          Add New Part SKU
        </Button>
      </div>

      {toastMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterState('ALL')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              filterState === 'ALL'
                ? 'bg-brand-blue text-white'
                : 'border border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700/70'
            }`}
          >
            All Parts ({inventory.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterState('LOW')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              filterState === 'LOW'
                ? 'bg-amber-600 text-white'
                : 'border border-border bg-card text-muted-foreground hover:border-amber-300 dark:hover:border-amber-700/70'
            }`}
          >
            Low Stock (
            {inventory.filter((p) => p.on_hand <= p.reorder_level && p.on_hand > 0).length})
          </button>

          <button
            type="button"
            onClick={() => setFilterState('OUT')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              filterState === 'OUT'
                ? 'bg-red-600 text-white'
                : 'border border-border bg-card text-muted-foreground hover:border-red-300 dark:hover:border-red-700/70'
            }`}
          >
            Out of Stock ({inventory.filter((p) => p.on_hand === 0).length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-3 size-4 text-subtle-foreground" />
          <Input
            placeholder="Search by SKU or part name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 bg-card pl-9 text-xs"
          />
        </div>
      </div>

      {/* Inventory Table Card */}
      <Card className="overflow-hidden border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted text-[11px] font-bold text-subtle-foreground">
                <tr>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-4 py-3">Part Name & Category</th>
                  <th className="px-4 py-3 text-center">On Hand</th>
                  <th className="px-4 py-3 text-center">Reorder Level</th>
                  <th className="px-4 py-3 text-right">Unit Cost</th>
                  <th className="px-4 py-3 text-center">Stock Status</th>
                  <th className="px-5 py-3 text-right">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-faint text-muted-foreground">
                {filteredParts.map((part) => {
                  const isOut = part.on_hand === 0
                  const isLow = part.on_hand <= part.reorder_level && !isOut

                  return (
                    <tr key={part.id} className="hover:bg-muted/60">
                      <td className="px-5 py-3.5 font-mono font-bold text-foreground">
                        {part.sku}
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-bold text-foreground">{part.name}</p>
                        <p className="text-[11px] text-subtle-foreground">{part.category}</p>
                      </td>

                      <td className="px-4 py-3.5 text-center text-sm font-bold">{part.on_hand}</td>

                      <td className="px-4 py-3.5 text-center font-medium text-helper">
                        {part.reorder_level}
                      </td>

                      <td className="px-4 py-3.5 text-right font-medium text-foreground">
                        {formatPKR(part.unit_price)}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        {isOut ? (
                          <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-900/40 dark:text-red-200">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                            In Stock
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAdjust(part)}
                          className="h-7 border-border-medium text-xs font-semibold hover:border-brand-blue hover:text-brand-blue-ink"
                        >
                          <SlidersHorizontal className="mr-1 size-3" />
                          Adjust
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Part Modal */}
      <Dialog open={addPartOpen} onOpenChange={setAddPartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Create New Inventory Part SKU
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              New parts start at 0 quantity. Set initial physical stock using the Adjust tool.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddPart} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">SKU Code</Label>
              <Input
                placeholder="e.g. BRK-PAD-042"
                value={newSku}
                onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                className="h-9 font-mono text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Part Description
              </Label>
              <Input
                placeholder="Front Ceramic Brake Pads Set"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Unit Price (PKR)
                </Label>
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Reorder Threshold
                </Label>
                <Input
                  type="number"
                  value={newReorder}
                  onChange={(e) => setNewReorder(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddPartOpen(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-brand-blue text-xs font-bold text-white"
              >
                Create SKU
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Modal */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Adjust Stock: {selectedPart?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              Current on-hand: <strong className="text-foreground">{selectedPart?.on_hand}</strong>{' '}
              units.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdjustStock} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Quantity Delta (+ to increase, - to decrease)
              </Label>
              <Input
                type="number"
                value={adjustDelta}
                onChange={(e) => setAdjustDelta(e.target.value)}
                className="h-9 text-xs font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Adjustment Reason
              </Label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Supplier delivery, stock recount, damaged packaging"
                className="h-9 text-xs"
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdjustOpen(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-brand-blue text-xs font-bold text-white"
              >
                Apply Stock Adjustment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
