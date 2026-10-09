import { Info } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DemoCredentialsPanel } from '@/features/auth/components/demo-credentials-panel'

export const metadata: Metadata = { title: 'Log in' }

/**
 * P-04 Login (spec 10) at `/login?next=&reason=`. One login for owners, staff and customers.
 * The form (E-01 login → refetch `me` → `resolveHome`) arrives with the auth feature.
 */
export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { reason } = await searchParams
  const sessionExpired = reason === 'expired'

  return (
    <div className="space-y-6">
      <ScreenPlaceholder
        screenId="P-04"
        title="Log in to BayFlow"
        description="Owners, staff and customers all log in here."
      >
        {sessionExpired ? (
          <Alert className="border-info-ink/30 bg-info-subtle text-info-ink">
            <Info aria-hidden="true" />
            <AlertDescription className="text-info-ink">
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>
        ) : null}
      </ScreenPlaceholder>
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li>
          New customer?{' '}
          <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
            Book a service
          </Link>{' '}
          — your account is created during booking.
        </li>
        <li>
          Own a garage?{' '}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Register your shop
          </Link>
        </li>
      </ul>
      <DemoCredentialsPanel />
    </div>
  )
}
