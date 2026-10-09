'use client'

import { RotateCcw, ShieldCheck, ShieldOff, UserX } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { ConfirmDialog, ReasonDialog } from '@/components/admin/action-dialogs'
import { useAdminActor } from '@/components/admin/admin-shell'
import {
  AdminPageHeader,
  KindBadge,
  ROLE_LABEL,
  Tile,
  UserStatusBadge,
  initials,
} from '@/components/admin/admin-ui'
import { AuditEventList } from '@/components/admin/audit-events'
import { NotFoundPanel } from '@/components/admin/not-found-panel'
import { StatusBadge } from '@/components/status-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatDate, formatDateTime } from '@/lib/format'
import {
  accountActionBlock,
  getAdminShops,
  getAdminUsers,
  getAuditEvents,
  recordAdminView,
  setPlatformAdmin,
  setUserActive,
} from '@/lib/mock-admin'
import { getBookings } from '@/lib/mock-data'

/** A disabled action keeps its reason visible on hover and focus (spec 19 §5 A-05). */
function Blocked({ reason, children }: { reason: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex rounded-full">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  )
}

/** A-05 User detail (spec 19 §5; E-67…E-71 once wired). */
export default function AdminUserPage() {
  const { userId } = useParams<{ userId: string }>()
  const { user: me } = useAdminActor()
  const users = useMockStore(getAdminUsers)
  const tenants = useMockStore(getAdminShops)
  const bookings = useMockStore(getBookings)
  const audit = useMockStore(getAuditEvents)

  const person = users.find((u) => u.id === userId)
  const actor = useMemo(() => ({ name: me.name, email: me.email }), [me.name, me.email])

  // E-67 records that an admin looked at this person's details (D95).
  const personId = person?.id
  const personEmail = person?.email
  useEffect(() => {
    if (personId && personEmail)
      recordAdminView('user', { id: personId, label: personEmail }, actor)
  }, [personId, personEmail, actor])

  const ownBookings = useMemo(
    () =>
      person
        ? bookings
            .filter((b) => b.customerEmail.toLowerCase() === person.email)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : [],
    [bookings, person],
  )
  const trail = useMemo(
    () =>
      person
        ? audit.filter((e) => e.actor?.email === person.email || e.target?.id === person.id)
        : [],
    [audit, person],
  )

  if (!person) return <NotFoundPanel backHref="/admin/users" backLabel="All users" />

  const soleOwnerOf = tenants.filter(
    (t) => t.owners.length === 1 && t.owners[0]!.email === person.email,
  )
  const deactivateBlock = accountActionBlock(person, 'deactivate', actor)
  const revokeBlock = accountActionBlock(person, 'revoke', actor)

  const deactivate = (
    <ReasonDialog
      trigger={
        <Button variant="destructive" disabled={Boolean(deactivateBlock)}>
          <UserX data-icon="inline-start" aria-hidden="true" />
          Deactivate account
        </Button>
      }
      title={`Deactivate ${person.name}?`}
      description="Deactivation is reversible and keeps every record."
      consequences={[
        'They are signed out at their next request and cannot sign in.',
        'Their memberships and bookings stay as they are.',
      ]}
      warning={
        soleOwnerOf.length
          ? `${person.name} is the only active owner of ${soleOwnerOf.map((t) => t.shop.name).join(', ')}. Those shops keep running, but nobody can manage them until the owner is back.`
          : null
      }
      confirmLabel="Deactivate"
      success={`${person.name} is deactivated`}
      onConfirm={(reason) => setUserActive(person.id, false, reason, actor)}
    />
  )

  const revoke = (
    <ConfirmDialog
      trigger={
        <Button variant="outline" disabled={Boolean(revokeBlock)}>
          <ShieldOff data-icon="inline-start" aria-hidden="true" />
          Remove admin access
        </Button>
      }
      title={`Remove platform admin access from ${person.name}?`}
      description="They keep their account and memberships but lose the admin console."
      confirmLabel="Remove access"
      success={`${person.name} is no longer a platform admin`}
      destructive
      onConfirm={() => setPlatformAdmin(person.id, false, actor)}
    />
  )

  return (
    <div className="space-y-6">
      <AdminPageHeader
        back={{ href: '/admin/users', label: 'All users' }}
        title={person.name}
        badges={
          <>
            <KindBadge kind={person.kind} />
            <UserStatusBadge user={person} />
          </>
        }
        description={`${person.email}${person.phone ? ` · ${person.phone}` : ''} · joined ${formatDate(person.createdAt)}`}
        actions={
          <>
            {person.isPlatformAdmin ? (
              revokeBlock ? (
                <Blocked reason={revokeBlock}>{revoke}</Blocked>
              ) : (
                revoke
              )
            ) : (
              <ConfirmDialog
                trigger={
                  <Button variant="outline" disabled={!person.isActive}>
                    <ShieldCheck data-icon="inline-start" aria-hidden="true" />
                    Make platform admin
                  </Button>
                }
                title={`Make ${person.name} a platform admin?`}
                description="Platform admins see every shop, account and booking, can suspend shops and deactivate accounts. Everything they do is recorded in the audit log."
                confirmLabel="Grant access"
                success={`${person.name} is now a platform admin`}
                onConfirm={() => setPlatformAdmin(person.id, true, actor)}
              />
            )}
            {person.isActive ? (
              deactivateBlock ? (
                <Blocked reason={deactivateBlock}>{deactivate}</Blocked>
              ) : (
                deactivate
              )
            ) : (
              <ConfirmDialog
                trigger={
                  <Button className="bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-hover">
                    <RotateCcw data-icon="inline-start" aria-hidden="true" />
                    Reactivate account
                  </Button>
                }
                title={`Reactivate ${person.name}?`}
                description="They can sign in again with their existing password and memberships."
                confirmLabel="Reactivate"
                success={`${person.name} is active again`}
                onConfirm={() => setUserActive(person.id, true, null, actor)}
              />
            )}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Tile title="Profile">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 after:hidden">
              <AvatarFallback className="bg-brand-blue text-sm font-semibold text-brand-blue-foreground">
                {initials(person.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{person.name}</p>
              <p className="truncate text-sm text-muted-foreground">{person.email}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-helper">Last sign-in</dt>
              <dd className="text-foreground">
                {person.lastLoginAt ? formatDateTime(person.lastLoginAt) : 'Never'}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-helper">Platform admin</dt>
              <dd className="text-foreground">{person.isPlatformAdmin ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-helper">Account ID</dt>
              <dd className="font-mono text-xs text-foreground">{person.id}</dd>
            </div>
          </dl>
        </Tile>

        <Tile title="Memberships" description="Shops and roles" flush>
          <ul className="divide-y divide-border-subtle">
            {person.memberships.map((m) => (
              <li key={m.shopId}>
                <Link
                  href={`/admin/shops/${m.shopId}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-layer-hover"
                >
                  <span className="text-sm font-medium text-foreground">{m.shopName}</span>
                  <span className="text-xs text-muted-foreground">
                    {ROLE_LABEL[m.role]}
                    {!m.isActive && ' (inactive)'}
                  </span>
                </Link>
              </li>
            ))}
            {person.memberships.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">No shop memberships.</li>
            )}
          </ul>
        </Tile>

        <Tile title="Bookings as a customer" description={`${ownBookings.length} in total`} flush>
          <ul className="divide-y divide-border-subtle">
            {ownBookings.slice(0, 6).map((b) => (
              <li key={b.id}>
                <Link
                  href={`/admin/bookings/${b.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-layer-hover"
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-sm text-brand-blue-ink">
                      {b.reference}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {b.shopName} · {b.scheduledDate}
                    </span>
                  </span>
                  <StatusBadge status={b.status} audience="staff" />
                </Link>
              </li>
            ))}
            {ownBookings.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">No bookings.</li>
            )}
          </ul>
        </Tile>
      </div>

      <Tile
        title="Audit trail"
        description="What this person did, and what was done to their account"
        flush
      >
        <AuditEventList events={trail.slice(0, 25)} empty="Nothing recorded yet." />
      </Tile>
    </div>
  )
}
