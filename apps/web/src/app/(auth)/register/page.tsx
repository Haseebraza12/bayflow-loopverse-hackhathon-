import type { Metadata } from 'next'
import Link from 'next/link'

import { ScreenPlaceholder } from '@/components/feedback/screen-placeholder'

export const metadata: Metadata = { title: 'Register your shop' }

/** P-05 Owner registration (spec 10; D17). The form (E-03 register-owner) arrives with auth. */
export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <ScreenPlaceholder
        screenId="P-05"
        title="Register your shop on BayFlow"
        description="Create your owner account. Next you'll set up your shop and add your team."
      />
      <p className="text-sm text-muted-foreground">
        Staff accounts are created by the shop owner — ask your owner for your login.
      </p>
      <p className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
