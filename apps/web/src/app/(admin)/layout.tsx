import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AdminShell } from '@/components/admin/admin-shell'

export const metadata: Metadata = { title: 'Platform admin' }

/** `(admin)` shell (spec 19 §5): the platform admin console, separate from the POS. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
