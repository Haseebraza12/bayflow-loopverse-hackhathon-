'use client'

import {
  AlertTriangle,
  ArrowUpDown,
  Boxes,
  CheckCircle2,
  PackagePlus,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

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
  adjustPartStock,
  getInventory,
  savePart,
  type MockPart,
} from '@/lib/mock-data'

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
  const [newCategory, setNewCategory] = useState('Brakes & Suspension')
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
    setToastMsg(`Stock for ${selectedPart.name} updated by ${delta > 0 ? `+${delta}` : delta} units.`)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-[#1047FA]">
            Warehouse & Store
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mt-1">
            Parts & Lubricants Inventory
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor on-hand inventory levels, reorder thresholds, and record stock adjustments.
          </p>
        </div>

        <Button
          onClick={() => setAddPartOpen(true)}
          className="bg-[#1047FA] hover:bg-blue-700 text-white font-semibold text-xs h-9 rounded-lg"
        >
          <Plus className="size-3.5 mr-1" />
          Add New Part SKU
        </Button>
      </div>

      {toastMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterState('ALL')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              filterState === 'ALL'
                ? 'bg-[#1047FA] text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-blue-300'
            }`}
          >
            All Parts ({inventory.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterState('LOW')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              filterState === 'LOW'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-amber-300'
            }`}
          >
            Low Stock ({inventory.filter((p) => p.on_hand <= p.reorder_level && p.on_hand > 0).length})
          </button>

          <button
            type="button"
            onClick={() => setFilterState('OUT')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              filterState === 'OUT'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-red-300'
            }`}
          >
            Out of Stock ({inventory.filter((p) => p.on_hand === 0).length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 size-4 text-neutral-400" />
          <Input
            placeholder="Search by SKU or part name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-white"
          />
        </div>
      </div>

      {/* Inventory Table Card */}
      <Card className="border-neutral-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-[11px] font-bold text-neutral-400 border-b border-neutral-200">
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
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {filteredParts.map((part) => {
                  const isOut = part.on_hand === 0
                  const isLow = part.on_hand <= part.reorder_level && !isOut

                  return (
                    <tr key={part.id} className="hover:bg-neutral-50/60">
                      <td className="px-5 py-3.5 font-mono font-bold text-neutral-900">
                        {part.sku}
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-bold text-neutral-900">{part.name}</p>
                        <p className="text-[11px] text-neutral-400">{part.category}</p>
                      </td>

                      <td className="px-4 py-3.5 text-center font-bold text-sm">
                        {part.on_hand}
                      </td>

                      <td className="px-4 py-3.5 text-center font-medium text-neutral-500">
                        {part.reorder_level}
                      </td>

                      <td className="px-4 py-3.5 text-right font-medium text-neutral-900">
                        {formatPKR(part.unit_price)}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        {isOut ? (
                          <span className="rounded bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                            In Stock
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAdjust(part)}
                          className="h-7 text-xs font-semibold border-neutral-300 hover:border-[#1047FA] hover:text-[#1047FA]"
                        >
                          <SlidersHorizontal className="size-3 mr-1" />
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
            <DialogTitle className="text-base font-bold text-neutral-900">
              Create New Inventory Part SKU
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              New parts start at 0 quantity. Set initial physical stock using the Adjust tool.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddPart} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">SKU Code</Label>
              <Input
                placeholder="e.g. BRK-PAD-042"
                value={newSku}
                onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                className="text-xs h-9 font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Part Description</Label>
              <Input
                placeholder="Front Ceramic Brake Pads Set"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Unit Price (PKR)</Label>
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Reorder Threshold</Label>
                <Input
                  type="number"
                  value={newReorder}
                  onChange={(e) => setNewReorder(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => setAddPartOpen(false)} className="text-xs font-semibold">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1047FA] text-white font-bold text-xs rounded-full">
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
            <DialogTitle className="text-base font-bold text-neutral-900">
              Adjust Stock: {selectedPart?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Current on-hand: <strong className="text-neutral-900">{selectedPart?.on_hand}</strong> units.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdjustStock} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">
                Quantity Delta (+ to increase, - to decrease)
              </Label>
              <Input
                type="number"
                value={adjustDelta}
                onChange={(e) => setAdjustDelta(e.target.value)}
                className="text-xs h-9 font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Adjustment Reason</Label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Supplier delivery, stock recount, damaged packaging"
                className="text-xs h-9"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => setAdjustOpen(false)} className="text-xs font-semibold">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1047FA] text-white font-bold text-xs rounded-full">
                Apply Stock Adjustment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
