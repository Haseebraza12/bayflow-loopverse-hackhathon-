'use client'

import { CheckCircle2, Plus, Users } from 'lucide-react'
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
import { getBookings, getTeamMembers, saveTeamMember, type MockTeamMember } from '@/lib/mock-data'

export default function TeamManagementPage() {
  const params = useParams()
  const shopId = typeof params?.shopId === 'string' ? params.shopId : 'shop-lahore-auto-care'

  const team = useMockStore(() => getTeamMembers(shopId))
  const bookings = useMockStore(() => getBookings(shopId))

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MockTeamMember['role']>('TECHNICIAN')
  const [password, setPassword] = useState('BayFlow@2026')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleAddMember = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    const newMember: MockTeamMember = {
      id: `usr-${Date.now()}`,
      shopId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      is_active: true,
    }

    saveTeamMember(newMember)
    setAddDialogOpen(false)
    setName('')
    setEmail('')
    setSuccessMsg(
      `${newMember.name} has been added to your workshop team as ${role.replace('_', ' ')}.`,
    )
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const handleToggleActive = (member: MockTeamMember) => {
    if (member.role === 'OWNER') return
    const updated = { ...member, is_active: !member.is_active }
    saveTeamMember(updated)
  }

  const handleRoleChange = (member: MockTeamMember, newRole: MockTeamMember['role']) => {
    if (member.role === 'OWNER') return
    const updated = { ...member, role: newRole }
    saveTeamMember(updated)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-brand-blue-ink">
            Shop Administration
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            Workshop Team & Staff Roles
          </h1>
          <p className="mt-0.5 text-xs text-helper">
            Manage Service Advisors, Technicians, QC Inspectors, and Parts Specialists.
          </p>
        </div>

        <Button
          onClick={() => setAddDialogOpen(true)}
          className="h-9 rounded-lg bg-brand-blue px-4 text-xs font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="mr-1.5 size-4" />
          Add Team Member
        </Button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Staff Members Table Card */}
      <Card className="overflow-hidden border-border">
        <CardHeader className="border-b border-border-faint bg-muted/80 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-xs font-bold tracking-[0.32px] text-helper">
              <Users className="size-4 text-brand-blue-ink" />
              Active Team Roster ({team.length})
            </CardTitle>
            <span className="text-xs text-subtle-foreground">
              Owner Fatima Raza and workshop staff
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted text-[11px] font-bold text-subtle-foreground">
                <tr>
                  <th className="px-5 py-3">Team Member</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Account Status</th>
                  <th className="px-4 py-3">Open Assigned Work</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-faint text-muted-foreground">
                {team.map((member) => {
                  const isOwner = member.role === 'OWNER'
                  // Count active assigned jobs
                  const openJobsCount = bookings.filter(
                    (b) =>
                      b.status !== 'COMPLETED' &&
                      b.status !== 'CANCELLED' &&
                      (b.assignedTechnicianId === member.id ||
                        b.assignedTechnicianName?.toLowerCase() === member.name.toLowerCase() ||
                        b.qcInspectorId === member.id),
                  ).length

                  return (
                    <tr key={member.id} className="hover:bg-muted/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-xs font-bold text-brand-blue-ink dark:border-blue-800/60 dark:bg-blue-950/40">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{member.name}</p>
                            <p className="font-mono text-[11px] text-subtle-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.32px] ${
                            member.role === 'OWNER'
                              ? 'border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300'
                              : member.role === 'SERVICE_ADVISOR'
                                ? 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300'
                                : member.role === 'TECHNICIAN'
                                  ? 'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300'
                                  : member.role === 'QC_INSPECTOR'
                                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : 'border border-border bg-secondary text-muted-foreground'
                          }`}
                        >
                          {member.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {member.is_active ? (
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[11px] font-medium text-subtle-foreground">
                            <span className="size-1.5 rounded-full bg-layer-selected" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-foreground">
                          {openJobsCount} active bookings
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        {!isOwner ? (
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={member.role}
                              onChange={(e) =>
                                handleRoleChange(member, e.target.value as MockTeamMember['role'])
                              }
                              className="rounded border border-border bg-card px-2 py-1 text-[11px] font-semibold text-muted-foreground"
                            >
                              <option value="SERVICE_ADVISOR">Service Advisor</option>
                              <option value="TECHNICIAN">Technician</option>
                              <option value="PARTS_PERSON">Parts Person</option>
                              <option value="QC_INSPECTOR">QC Inspector</option>
                            </select>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(member)}
                              className={`h-7 px-2 text-[11px] font-semibold ${
                                member.is_active
                                  ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
                                  : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
                              }`}
                            >
                              {member.is_active ? 'Deactivate' : 'Reactivate'}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-subtle-foreground">
                            Owner account
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Team Member Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Invite Workshop Staff Member
            </DialogTitle>
            <DialogDescription className="text-xs text-helper">
              Assign an operational role to grant access to workshop queues and actions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="memName" className="text-xs font-semibold text-muted-foreground">
                Full Name
              </Label>
              <Input
                id="memName"
                placeholder="e.g. Kamran Abbasi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="memEmail" className="text-xs font-semibold text-muted-foreground">
                Email Address
              </Label>
              <Input
                id="memEmail"
                type="email"
                placeholder="kamran.tech@bayflow.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="memRole" className="text-xs font-semibold text-muted-foreground">
                Workshop Role
              </Label>
              <select
                id="memRole"
                value={role}
                onChange={(e) => setRole(e.target.value as MockTeamMember['role'])}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground"
              >
                <option value="SERVICE_ADVISOR">
                  Service Advisor (Intake, Estimates & Handover)
                </option>
                <option value="TECHNICIAN">Technician (Inspections & Repairs)</option>
                <option value="PARTS_PERSON">Parts Specialist (Inventory & Orders)</option>
                <option value="QC_INSPECTOR">QC Inspector (Safety & Road Test Validation)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="memPass" className="text-xs font-semibold text-muted-foreground">
                Initial Password
              </Label>
              <Input
                id="memPass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 font-mono text-xs"
              />
              <p className="text-[10px] text-subtle-foreground">
                Default for all demo accounts: BayFlow@2026
              </p>
            </div>

            <DialogFooter className="gap-2 pt-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-brand-blue text-xs font-bold text-white hover:bg-blue-700"
              >
                Add Staff Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
