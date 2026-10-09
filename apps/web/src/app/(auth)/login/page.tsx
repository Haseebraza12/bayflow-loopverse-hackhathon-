'use client'

import { ArrowRight, CircleAlert, Eye, EyeOff, Info, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useRef, useState, type FormEvent } from 'react'

import { DemoAccountsPanel } from '@/components/auth/demo-accounts-panel'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { DEMO_PASSWORD, type DemoAccount } from '@/content/demo-accounts'
import { isAccountActive, recordSignIn } from '@/lib/mock-admin'
import { homePathFor, resolveMockSession } from '@/lib/mock-auth'
import { setCurrentUser } from '@/lib/mock-data'
import { safeNextPath } from '@/lib/safe-next'

/** P-04 Login (spec 10): e-mail and password, the session-expired banner, and the demo accounts. */
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const expired = searchParams.get('reason') === 'expired'
  const next = safeNextPath(searchParams.get('next'))
  const submitRef = useRef<HTMLButtonElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const pickDemoAccount = (account: DemoAccount) => {
    setEmail(account.email)
    setPassword(DEMO_PASSWORD)
    setError(null)
    submitRef.current?.focus()
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (loading) return
    if (!email.trim() || !password) {
      setError('Enter your e-mail address and password.')
      return
    }
    // A deactivated account gets the same answer as a wrong password (D9: no account enumeration).
    if (!isAccountActive(email)) {
      recordSignIn(email, false)
      setError('E-mail or password is incorrect.')
      return
    }
    setError(null)
    setLoading(true)

    const session = resolveMockSession(email)
    recordSignIn(email, true)
    setCurrentUser(session)
    // The proxy only checks that a session cookie exists (spec 09 §2.8).
    document.cookie = `bf_session=active_${Date.now()}; path=/; max-age=86400; SameSite=Lax`
    window.setTimeout(() => router.push(next ?? homePathFor(session)), 350)
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight text-foreground">
          Log in to BayFlow
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Garage owners, service advisors, technicians and customers all sign in here.
        </p>
      </header>

      {expired && (
        <Alert variant="info">
          <Info aria-hidden="true" />
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <Mail aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@bayflow.test"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(error) && !email.trim()}
                aria-describedby={error ? 'login-error' : undefined}
                required
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <Lock aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(error) && !password}
                aria-describedby={error ? 'login-error' : undefined}
                maxLength={128}
                required
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((shown) => !shown)}
                >
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>

        {error && (
          <Alert variant="destructive" id="login-error">
            <CircleAlert aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          ref={submitRef}
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-hover active:bg-brand-blue-hover"
        >
          {loading ? (
            <>
              <Spinner aria-hidden="true" />
              Logging in…
            </>
          ) : (
            <>
              Log in
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      <div className="space-y-1.5 text-center text-sm text-muted-foreground">
        <p>
          Own a garage?{' '}
          <Link href="/register" className="font-semibold text-brand-blue-ink hover:underline">
            Register your shop
          </Link>
        </p>
        <p>
          New customer?{' '}
          <Link href="/book" className="font-semibold text-brand-blue-ink hover:underline">
            Book a service
          </Link>{' '}
          — your account is created as you book.
        </p>
      </div>

      <DemoAccountsPanel onPick={pickDemoAccount} selectedEmail={email.trim().toLowerCase()} />
    </div>
  )
}

function LoginSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading the login form">
      <div className="space-y-3">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-5">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}
