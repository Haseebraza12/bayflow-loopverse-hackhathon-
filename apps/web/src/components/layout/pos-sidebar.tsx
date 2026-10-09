'use client'

import {
  Boxes,
  CalendarCheck,
  ClipboardCheck,
  LayoutDashboard,
  PackageSearch,
  Settings,
  Tags,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useMockStore } from '@/hooks/use-mock-store'
import { getCurrentUser, type CurrentUserSession } from '@/lib/mock-data'
import { sectionAccess } from '@/lib/pos-access'

interface NavItem {
  segment: string
  label: string
  icon: LucideIcon
}

interface NavGroup {
  label: string
  items: NavItem[]
}

// Sections and icons per spec 10 §4 and spec 09 §3.9.
const ITEMS: Record<string, NavItem> = {
  overview: { segment: 'overview', label: 'Overview', icon: LayoutDashboard },
  bookings: { segment: 'bookings', label: 'Bookings', icon: CalendarCheck },
  team: { segment: 'team', label: 'Team', icon: Users },
  services: { segment: 'services', label: 'Services', icon: Tags },
  settings: { segment: 'settings', label: 'Settings', icon: Settings },
  jobs: { segment: 'jobs', label: 'Jobs', icon: Wrench },
  parts: { segment: 'parts', label: 'Parts queue', icon: PackageSearch },
  inventory: { segment: 'inventory', label: 'Inventory', icon: Boxes },
  'purchase-orders': { segment: 'purchase-orders', label: 'Purchase orders', icon: Truck },
  qc: { segment: 'qc', label: 'QC queue', icon: ClipboardCheck },
}

const ORDER = [
  'overview',
  'bookings',
  'jobs',
  'parts',
  'inventory',
  'purchase-orders',
  'qc',
  'team',
  'services',
  'settings',
]

/**
 * Items per role (spec 10 S-01 matrix): the Owner gets "Manage" plus read-only "Role views";
 * every other role sees its own queue only. Navigation scope only — the API enforces permissions.
 */
function navGroups(role: CurrentUserSession['role']): NavGroup[] {
  const visible = ORDER.filter((segment) => sectionAccess(role, segment))
  const pick = (segments: string[]) => segments.map((segment) => ITEMS[segment]!)
  if (role === 'OWNER') {
    return [
      { label: 'Manage', items: pick(visible.filter((s) => sectionAccess(role, s) === 'manage')) },
      {
        label: 'Role views (read-only)',
        items: pick(visible.filter((s) => sectionAccess(role, s) === 'read')),
      },
    ]
  }
  return [{ label: 'Your work', items: pick(visible) }]
}

export interface PosSidebarProps {
  shopId: string
}

export function PosSidebar({ shopId }: PosSidebarProps) {
  const pathname = usePathname()
  const user = useMockStore(getCurrentUser)
  const groups = navGroups(user.role)
  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  return (
    // Carbon UI shell side nav, 256px, below the 48 px sticky PosHeader (shadcn "sticky site header" sidebar pattern).
    <Sidebar className="top-12 h-[calc(100svh-3rem)]! border-r border-border-subtle [&_[data-slot=sidebar-inner]]:bg-layer">
      <SidebarContent>
        <nav aria-label="Shop navigation">
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const href = `${base}/${item.segment}`
                    const active = pathname === href || pathname.startsWith(`${href}/`)
                    return (
                      <SidebarMenuItem key={item.segment}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          // Active item: selected layer plus a 3 px brand-orange bar (spec 09 §4.1, Carbon side nav).
                          className="data-[active=true]:shadow-[inset_3px_0_0_var(--brand-orange)]"
                        >
                          <Link href={href} aria-current={active ? 'page' : undefined}>
                            <item.icon aria-hidden="true" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}
