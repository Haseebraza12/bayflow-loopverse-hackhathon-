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

interface NavItem {
  segment: string
  label: string
  icon: LucideIcon
}

interface NavGroup {
  label: string
  items: NavItem[]
}

// Sections and icons per spec 10 §4 and spec 09 §3.9. TODO(ShopScope): show only the sections of
// the caller's membership role (spec 10 §4 matrix) once `GET /api/v1/me` is wired; until then
// every section is listed. Navigation scope is never permission — the API enforces every rule.
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Shop',
    items: [
      { segment: 'overview', label: 'Overview', icon: LayoutDashboard },
      { segment: 'bookings', label: 'Bookings', icon: CalendarCheck },
      { segment: 'team', label: 'Team', icon: Users },
      { segment: 'services', label: 'Services', icon: Tags },
      { segment: 'settings', label: 'Settings', icon: Settings },
    ],
  },
  {
    label: 'Workshop',
    items: [
      { segment: 'jobs', label: 'Jobs', icon: Wrench },
      { segment: 'parts', label: 'Parts queue', icon: PackageSearch },
      { segment: 'inventory', label: 'Inventory', icon: Boxes },
      { segment: 'purchase-orders', label: 'Purchase orders', icon: Truck },
      { segment: 'qc', label: 'QC queue', icon: ClipboardCheck },
    ],
  },
]

export interface PosSidebarProps {
  shopId: string
}

export function PosSidebar({ shopId }: PosSidebarProps) {
  const pathname = usePathname()
  const base = `/pos/shops/${encodeURIComponent(shopId)}`

  return (
    // Sits below the 56 px sticky PosHeader (shadcn "sticky site header" sidebar pattern).
    <Sidebar className="top-14 h-[calc(100svh-3.5rem)]!">
      <SidebarContent>
        <nav aria-label="Shop navigation">
          {NAV_GROUPS.map((group) => (
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
                          // Active item: accent surface plus a 3 px brand-orange bar (spec 09 §4.1).
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
