'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { ForbiddenState } from '@/components/feedback/forbidden-state'
import { useMockStore, useMockStoreReady } from '@/hooks/use-mock-store'
import { homePathFor } from '@/lib/mock-auth'
import { getCurrentUser } from '@/lib/mock-data'
import { sectionAccess, sectionAudience, sectionOf } from '@/lib/pos-access'

/**
 * Shop-section gate (spec 10 S-01, X-03): another role's section shows `ForbiddenState` instead
 * of its content. Waits for this browser's stored user, so the seed user never decides.
 */
export function SectionGate({ shopId, children }: { shopId: string; children: ReactNode }) {
  const pathname = usePathname()
  const user = useMockStore(getCurrentUser)
  const ready = useMockStoreReady()
  const section = sectionOf(pathname)

  if (!ready || !section || sectionAccess(user.role, section)) return children

  return (
    <ForbiddenState
      message={sectionAudience(section)}
      homeHref={homePathFor({ role: user.role, shopId })}
    />
  )
}
