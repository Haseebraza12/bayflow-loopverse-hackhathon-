'use client'

import { CalendarCheck, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { NotificationBell } from '@/components/notifications/notification-bell'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { endMockSession, useHasMockSession } from '@/hooks/use-mock-session'
import { useMockStore } from '@/hooks/use-mock-store'
import { getAdminUsers } from '@/lib/mock-admin'
import { homePathFor } from '@/lib/mock-auth'
import { getCurrentUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const ROLE_NAME = {
  OWNER: 'Owner',
  SERVICE_ADVISOR: 'Service Advisor',
  TECHNICIAN: 'Technician',
  PARTS_PERSON: 'Parts Person',
  QC_INSPECTOR: 'QC Inspector',
  CUSTOMER: 'Customer',
  PLATFORM_ADMIN: 'Platform admin',
} as const

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Right side of the public header (spec 10 X-01, S-01 UserMenu): Sign In when signed out; the
 * notification bell and the account menu when signed in.
 */
export function SessionActions({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const signedIn = useHasMockSession()
  const user = useMockStore(getCurrentUser)
  const users = useMockStore(getAdminUsers)
  const account = users.find((u) => u.email === user.email.toLowerCase())
  const isPlatformAdmin = Boolean(account?.isPlatformAdmin && account.isActive)

  if (!signedIn) {
    return (
      <Button
        asChild
        size={compact ? 'sm' : 'default'}
        className={cn(
          'rounded-full bg-brand-green font-semibold text-white hover:bg-brand-green-hover',
          compact
            ? 'px-4 py-1.5 text-xs'
            : 'h-10 px-6 py-2 shadow-sm transition-all duration-200 hover:shadow-md',
        )}
      >
        <Link href="/login">Sign In</Link>
      </Button>
    )
  }

  const signOut = () => {
    endMockSession()
    router.push('/login')
  }

  return (
    <div className="flex items-center gap-1">
      <NotificationBell />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Account: ${user.name}`}>
            <Avatar className="size-8 after:hidden">
              <AvatarFallback className="bg-brand-blue text-xs font-semibold text-brand-blue-foreground">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="space-y-0.5">
            <span className="block truncate text-sm font-semibold text-foreground">
              {user.name}
            </span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {user.email} · {ROLE_NAME[user.role]}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/bookings">
              <CalendarCheck aria-hidden="true" />
              My bookings
            </Link>
          </DropdownMenuItem>
          {isPlatformAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <ShieldCheck aria-hidden="true" />
                Platform admin
              </Link>
            </DropdownMenuItem>
          )}
          {user.role !== 'CUSTOMER' && user.role !== 'PLATFORM_ADMIN' && (
            <DropdownMenuItem asChild>
              <Link href={homePathFor(user)}>
                <LayoutDashboard aria-hidden="true" />
                Workshop POS
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={signOut}>
            <LogOut aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
