'use client'

import {
  CheckCircle2,
  Clock,
  Edit2,
  Plus,
  Tags,
  Wrench,
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatPKR } from '@/lib/format'
import { getServices, saveService, type MockService } from '@/lib/mock-data'

export default function ServicesCataloguePage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'

  const services = useMockStore(() => getServices(shopId))

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<MockService | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('60')
  const [price, setPrice] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleOpenAdd = () => {
    setEditingService(null)
    setName('')
    setDescription('')
    setDuration('60')
    setPrice('')
    setIsActive(true)
    setDialogOpen(true)
  }

  const handleOpenEdit = (srv: MockService) => {
    setEditingService(srv)
    setName(srv.name)
    setDescription(srv.description)
    setDuration(srv.estimated_duration_minutes.toString())
    setPrice(srv.base_price ? srv.base_price.toString() : '')
    setIsActive(srv.is_active)
    setDialogOpen(true)
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const srv: MockService = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      shopId,
      name: name.trim(),
      description: description.trim(),
      estimated_duration_minutes: Number(duration) || 60,
      base_price: price.trim() ? Number(price) : null,
      is_active: isActive,
    }

    saveService(srv)
    setDialogOpen(false)
    setSuccessMsg(
      editingService
        ? `Updated service "${srv.name}".`
        : `Added new service "${srv.name}" to the catalogue.`
    )
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const handleToggleActive = (srv: MockService) => {
    const updated = { ...srv, is_active: !srv.is_active }
    saveService(updated)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1047FA]">
            Workshop Menu
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
            Services & Maintenance Packages
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure services displayed on your public booking page and technician estimate builder.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-[#1047FA] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg px-4 h-9 shadow-sm"
        >
          <Plus className="size-4 mr-1.5" />
          Add Service Package
        </Button>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Services Table Card */}
      <Card className="border-neutral-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Tags className="size-4 text-[#1047FA]" />
              Active Catalogue ({services.length} Packages)
            </CardTitle>
            <span className="text-xs text-neutral-400">Syncs with Online Booking Wizard</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-[11px] font-bold uppercase text-neutral-400 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3">Service Name & Description</th>
                  <th className="px-4 py-3">Est. Duration</th>
                  <th className="px-4 py-3">Base Price</th>
                  <th className="px-4 py-3 text-center">Active Listing</th>
                  <th className="px-5 py-3 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-neutral-50/60">
                    <td className="px-5 py-3.5 max-w-md">
                      <div className="flex items-start gap-2.5">
                        <div className="size-7 rounded-lg bg-blue-50 border border-blue-200 text-[#1047FA] flex items-center justify-center shrink-0 mt-0.5">
                          <Wrench className="size-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-sm">{srv.name}</p>
                          <p className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">
                            {srv.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700">
                        <Clock className="size-3 text-neutral-400" />
                        {srv.estimated_duration_minutes} min
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {srv.base_price ? (
                        <span className="font-bold text-neutral-900">{formatPKR(srv.base_price)}</span>
                      ) : (
                        <span className="text-neutral-400 italic">Price after inspection</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <Switch
                        checked={srv.is_active}
                        onCheckedChange={() => handleToggleActive(srv)}
                        aria-label={`Toggle active for ${srv.name}`}
                      />
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(srv)}
                        className="h-8 px-2 text-neutral-600 hover:text-[#1047FA]"
                      >
                        <Edit2 className="size-3.5 mr-1" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              {editingService ? 'Edit Service Package' : 'Create New Service Package'}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Set service name, scope, duration on bay hoist, and base package pricing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="srvName" className="text-xs font-semibold text-neutral-700">
                Service Name
              </Label>
              <Input
                id="srvName"
                placeholder="e.g. Brake Caliper Overhaul & Fluid Bleed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="srvDesc" className="text-xs font-semibold text-neutral-700">
                Description / Scope
              </Label>
              <Textarea
                id="srvDesc"
                placeholder="Includes caliper pin lubrication, pad replacement, hydraulic fluid flush, and pressure test."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="srvDur" className="text-xs font-semibold text-neutral-700">
                  Est. Duration (minutes)
                </Label>
                <Input
                  id="srvDur"
                  type="number"
                  placeholder="60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="srvPrice" className="text-xs font-semibold text-neutral-700">
                  Base Price (PKR)
                </Label>
                <Input
                  id="srvPrice"
                  type="number"
                  placeholder="Leave blank for inspect"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-neutral-800">Active & Bookable Online</span>
                <p className="text-[11px] text-neutral-400">Show on public customer booking portal</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs"
              >
                {editingService ? 'Save Changes' : 'Create Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
