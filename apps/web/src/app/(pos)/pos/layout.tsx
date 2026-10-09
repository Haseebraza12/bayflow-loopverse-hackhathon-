import type { ReactNode } from 'react'

import { PosHeader } from '@/components/layout/pos-header'

/**
 * POS shell (spec 09 §2.3, spec 10 S-01): navy PosHeader over a muted page. `proxy.ts` guards
 * `/pos/**` by cookie presence. TODO(auth): client `RequireSession`.
 * Each child renders its own `<main id="main">` (the shop layout uses the sidebar inset).
 */
export default function PosLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PosHeader />
      <div className="flex flex-1 flex-col bg-muted">{children}</div>
    </>
  )
}
