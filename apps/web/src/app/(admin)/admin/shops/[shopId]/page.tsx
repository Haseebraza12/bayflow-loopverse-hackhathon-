'use client'

import { Ban, CircleAlert, ExternalLink, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { ConfirmDialog, ReasonDialog } from '@/components/admin/action-dialogs'
import { useAdminActor } from '@/components/admin/admin-shell'
import {
  AdminPageHeader,
  ROLE_LABEL,
  ShopStatusBadges,
  Tile,
  UserStatusBadge,
} from '@/components/admin/admin-ui'
import { AuditEventList } from '@/components/admin/audit-events'
import { NotFoundPanel } from '@/components/admin/not-found-panel'
import { StatusBadge } from '@/components/status-badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useMockStore } from '@/hooks/use-mock-store'
import { formatDate, formatDateTime } from '@/lib/format'
import {
  getAdminShops,
  getAdminUsers,
  getAuditEvents,
  reactivateShop,
  suspendShop,
} from '@/lib/mock-admin'
import { getBookings } from '@/lib/mock-data'
import { STATUS_PHASES, STATUS_PHASE_LABELS, statusPhase } from '@/lib/status'

/** A-03 Shop detail (spec 19 §5; E-63…E-65 once wired). */
export default function AdminShopPage() {
  const { shopId } = useParams<{ shopId: string }>()
  const { user } = useAdminActor()
  const tenants = useMockStore(getAdminShops)
  const users = useMockStore(getAdminUsers)
  const bookings = useMockStore(getBookings)
  const audit = useMockStore(getAuditEvents)

  const tenant = tenants.find((t) => t.shop.id === shopId)
  const team = useMemo(
    () =>
      users.flatMap((u) =>
        u.memberships.filter((m) => m.shopId === shopId).map((m) => ({ user: u, membership: m })),
      ),
    [users, shopId],
  )
  const shopBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.shopId === shopId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [bookings, shopId],
  )
  const shopAudit = useMemo(() => audit.filter((e) => e.shop?.id === shopId), [audit, shopId])

  if (!tenant) return <NotFoundPanel backHref="/admin/shops" backLabel="All shops" />

  const actor = { name: user.name, email: user.email }
  const { shop, suspension } = tenant

  return (
    <div className="space-y-6">
      <AdminPageHeader
        back={{ href: '/admin/shops', label: 'All shops' }}
        title={shop.name}
        badges={<ShopStatusBadges tenant={tenant} />}
        description={`${shop.address}, ${shop.city} · joined ${formatDate(tenant.createdAt)}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={`/shops/${shop.slug}`} target="_blank" rel="noreferrer">
                Public page
                <ExternalLink data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
            {suspension ? (
              <ConfirmDialog
                trigger={
                  <Button className="bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-hover">
                    <RotateCcw data-icon="inline-start" aria-hidden="true" />
                    Reactivate shop
                  </Button>
                }
                title={`Reactivate ${shop.name}?`}
                description="The shop reappears in the directory, takes bookings again and its staff can sign in to the POS."
                confirmLabel="Reactivate"
                success={`${shop.name} is active again`}
                onConfirm={() => reactivateShop(shop.id, actor)}
              />
            ) : (
              <ReasonDialog
                trigger={
                  <Button variant="destructive">
                    <Ban data-icon="inline-start" aria-hidden="true" />
                    Suspend shop
                  </Button>
                }
                title={`Suspend ${shop.name}?`}
                description="Suspension is reversible and keeps every record."
                consequences={[
                  'The shop disappears from the public directory and takes no new bookings.',
                  'Every member, the owner included, is locked out of its POS.',
                  'Customers can still see their bookings and cancel them.',
                ]}
                confirmLabel="Suspend shop"
                success={`${shop.name} is suspended`}
                onConfirm={(reason) => suspendShop(shop.id, reason, actor)}
              />
            )}
          </>
        }
      />

      {suspension && (
        <Alert variant="destructive" className="bg-danger-subtle">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>
            Suspended {formatDateTime(suspension.at)} by {suspension.byName}
          </AlertTitle>
          <AlertDescription>{suspension.reason}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <Tile title="Team" description={`${tenant.activeMembers} active members`} flush>
          <ul className="divide-y divide-border-subtle">
            {team.map(({ user: member, membership }) => (
              <li key={member.id}>
                <Link
                  href={`/admin/users/${member.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-layer-hover"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {member.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {ROLE_LABEL[membership.role]}
                      {!membership.isActive && ' (inactive)'}
                    </span>
                    {!member.isActive && <UserStatusBadge user={member} />}
                  </span>
                </Link>
              </li>
            ))}
            {team.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">No members.</li>
            )}
          </ul>
        </Tile>

        <Tile title="Bookings by phase" description={`${shopBookings.length} in total`}>
          <ul className="space-y-2">
            {STATUS_PHASES.map((phase) => (
              <li key={phase} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{STATUS_PHASE_LABELS[phase]}</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {shopBookings.filter((b) => statusPhase(b.status) === phase).length}
                </span>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile title="Latest bookings" flush>
          <ul className="divide-y divide-border-subtle">
            {shopBookings.slice(0, 6).map((b) => (
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
                      {b.customerName} · {b.scheduledDate}
                    </span>
                  </span>
                  <StatusBadge status={b.status} audience="staff" />
                </Link>
              </li>
            ))}
            {shopBookings.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">No bookings yet.</li>
            )}
          </ul>
        </Tile>
      </div>

      <Tile title="Audit trail" description="Everything recorded for this shop" flush>
        <AuditEventList
          events={shopAudit.slice(0, 25)}
          showShop={false}
          empty="Nothing recorded yet."
        />
      </Tile>
    </div>
  )
}
