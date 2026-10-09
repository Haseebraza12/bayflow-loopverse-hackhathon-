'use client'

import {
  CheckCircle2,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Badge } from '@/components/ui/badge'
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
import {
  getBookings,
  getTeamMembers,
  saveTeamMember,
  type MockTeamMember,
} from '@/lib/mock-data'

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
    setSuccessMsg(`${newMember.name} has been added to your workshop team as ${role.replace('_', ' ')}.`)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.32px] text-[#1047FA]">
            Shop Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mt-1">
            Workshop Team & Staff Roles
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage Service Advisors, Technicians, QC Inspectors, and Parts Specialists.
          </p>
        </div>

        <Button
          onClick={() => setAddDialogOpen(true)}
          className="bg-[#1047FA] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg px-4 h-9"
        >
          <Plus className="size-4 mr-1.5" />
          Add Team Member
        </Button>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Staff Members Table Card */}
      <Card className="border-neutral-200 overflow-hidden">
        <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold tracking-[0.32px] text-neutral-500 flex items-center gap-1.5">
              <Users className="size-4 text-[#1047FA]" />
              Active Team Roster ({team.length})
            </CardTitle>
            <span className="text-xs text-neutral-400">Owner Fatima Raza and workshop staff</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-[11px] font-bold text-neutral-400 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3">Team Member</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Account Status</th>
                  <th className="px-4 py-3">Open Assigned Work</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {team.map((member) => {
                  const isOwner = member.role === 'OWNER'
                  // Count active assigned jobs
                  const openJobsCount = bookings.filter(
                    (b) =>
                      b.status !== 'COMPLETED' &&
                      b.status !== 'CANCELLED' &&
                      (b.assignedTechnicianId === member.id ||
                        b.assignedTechnicianName?.toLowerCase() === member.name.toLowerCase() ||
                        b.qcInspectorId === member.id)
                  ).length

                  return (
                    <tr key={member.id} className="hover:bg-neutral-50/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-blue-50 border border-blue-200 text-[#1047FA] font-bold flex items-center justify-center text-xs">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900">{member.name}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">{member.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.32px] ${
                            member.role === 'OWNER'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : member.role === 'SERVICE_ADVISOR'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : member.role === 'TECHNICIAN'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : member.role === 'QC_INSPECTOR'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                          }`}
                        >
                          {member.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {member.is_active ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-neutral-400 font-medium text-[11px]">
                            <span className="size-1.5 rounded-full bg-neutral-300" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-neutral-900">
                          {openJobsCount} active bookings
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        {!isOwner ? (
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={member.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  member,
                                  e.target.value as MockTeamMember['role']
                                )
                              }
                              className="text-[11px] font-semibold rounded border border-neutral-200 bg-white px-2 py-1 text-neutral-700"
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
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {member.is_active ? 'Deactivate' : 'Reactivate'}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-medium">Owner account</span>
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
            <DialogTitle className="text-base font-bold text-neutral-900">
              Invite Workshop Staff Member
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Assign an operational role to grant access to workshop queues and actions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="memName" className="text-xs font-semibold text-neutral-700">
                Full Name
              </Label>
              <Input
                id="memName"
                placeholder="e.g. Kamran Abbasi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="memEmail" className="text-xs font-semibold text-neutral-700">
                Email Address
              </Label>
              <Input
                id="memEmail"
                type="email"
                placeholder="kamran.tech@bayflow.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="memRole" className="text-xs font-semibold text-neutral-700">
                Workshop Role
              </Label>
              <select
                id="memRole"
                value={role}
                onChange={(e) => setRole(e.target.value as MockTeamMember['role'])}
                className="w-full text-xs font-semibold rounded-md border border-neutral-200 bg-white px-3 py-2 text-neutral-800"
              >
                <option value="SERVICE_ADVISOR">Service Advisor (Intake, Estimates & Handover)</option>
                <option value="TECHNICIAN">Technician (Inspections & Repairs)</option>
                <option value="PARTS_PERSON">Parts Specialist (Inventory & Orders)</option>
                <option value="QC_INSPECTOR">QC Inspector (Safety & Road Test Validation)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="memPass" className="text-xs font-semibold text-neutral-700">
                Initial Password
              </Label>
              <Input
                id="memPass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-xs h-9 font-mono"
              />
              <p className="text-[10px] text-neutral-400">Default for all demo accounts: BayFlow@2026</p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
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
                className="bg-[#1047FA] hover:bg-blue-700 text-white font-bold text-xs rounded-full"
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
