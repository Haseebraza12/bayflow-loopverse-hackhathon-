'use client'

import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Info,
  Lock,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent, type ReactNode } from 'react'

import { PASSWORD_MAX, PASSWORD_MIN, PasswordStrength } from '@/components/auth/password-strength'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { setCurrentUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type FieldName = 'fullName' | 'email' | 'phone' | 'password'
type Errors = Partial<Record<FieldName, string>>

/** Spec 10 P-05 field rules (D10 passwords, D62 `.test` e-mails accepted). */
function validate(values: { fullName: string; email: string; phone: string; password: string }) {
  const errors: Errors = {}
  const name = values.fullName.trim()
  if (!name) errors.fullName = 'Enter your full name.'
  else if (name.length > 120) errors.fullName = 'Use 120 characters or fewer.'

  const email = values.email.trim()
  if (!email) errors.email = 'Enter your e-mail address.'
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Enter a valid e-mail address, like name@example.com.'

  const phone = values.phone.trim()
  if (phone && !/^\+?[0-9 -]{7,20}$/.test(phone))
    errors.phone = 'Use 7 to 20 digits, spaces or hyphens, with an optional leading +.'

  if (values.password.length < PASSWORD_MIN || values.password.length > PASSWORD_MAX)
    errors.password = `Use ${PASSWORD_MIN} to ${PASSWORD_MAX} characters.`
  return errors
}

const STEPS = ['Your account', 'Your shop', 'Your team'] as const

/** Owner onboarding (spec 10 S-03, O-02): register, then create the shop, then add the team. */
function OnboardingSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Setup steps">
      {STEPS.map((label, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'next'
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              aria-current={state === 'current' ? 'step' : undefined}
              className="flex items-center gap-2 text-xs whitespace-nowrap"
            >
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full border text-[11px] font-semibold',
                  state === 'current' &&
                    'border-brand-blue bg-brand-blue text-brand-blue-foreground',
                  state === 'done' && 'border-success-ink bg-success-subtle text-success-ink',
                  state === 'next' && 'border-border text-helper',
                )}
              >
                {state === 'done' ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={state === 'current' ? 'font-semibold text-foreground' : 'text-helper'}
              >
                {label}
              </span>
            </span>
            {index < STEPS.length - 1 && (
              <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-border" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

function FormField({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-helper">(optional)</span>}
      </FieldLabel>
      {children}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  )
}

/** P-05 Owner registration (spec 10). Staff never self-register (brief §4). */
export default function RegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [garageName, setGarageName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  const describe = (field: FieldName, extra?: string) =>
    [errors[field] ? `${field}-error` : null, extra].filter(Boolean).join(' ') || undefined

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return
    const found = validate({ fullName, email, phone, password })
    setErrors(found)
    const first = (['fullName', 'email', 'phone', 'password'] as const).find((f) => found[f])
    if (first) {
      event.currentTarget.querySelector<HTMLInputElement>(`#${first}`)?.focus()
      return
    }

    setLoading(true)
    setCurrentUser({
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: 'OWNER',
      shopId: 'shop-lahore-auto-care',
      shopName: garageName.trim() || 'My Auto Repair Shop',
    })
    // The proxy only checks that a session cookie exists (spec 09 §2.8).
    document.cookie = `bf_session=active_${Date.now()}; path=/; max-age=86400; SameSite=Lax`
    window.setTimeout(() => router.replace('/pos/shops/new'), 400)
  }

  return (
    <div className="space-y-8">
      <header className="space-y-5">
        <OnboardingSteps current={0} />
        <div className="space-y-2">
          <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight text-foreground">
            Register your shop
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Create your owner account. Next you&apos;ll set up your shop and add your team.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FieldGroup className="gap-5">
          <FormField id="fullName" label="Full name" error={errors.fullName}>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <UserRound aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="fullName"
                name="name"
                autoComplete="name"
                placeholder="Tariq Mehmood"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={describe('fullName')}
                maxLength={120}
                required
              />
            </InputGroup>
          </FormField>

          <FormField id="garageName" label="Shop or garage name" optional>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <Building2 aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="garageName"
                name="organization"
                autoComplete="organization"
                placeholder="Falcon Auto Works"
                value={garageName}
                onChange={(event) => setGarageName(event.target.value)}
                maxLength={120}
              />
            </InputGroup>
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="email" label="E-mail" error={errors.email}>
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
                  placeholder="tariq@falconauto.pk"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describe('email')}
                  maxLength={254}
                  required
                />
              </InputGroup>
            </FormField>

            <FormField id="phone" label="Phone" optional error={errors.phone}>
              <InputGroup className="h-11">
                <InputGroupAddon>
                  <Phone aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  id="phone"
                  name="tel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describe('phone')}
                  maxLength={21}
                />
              </InputGroup>
            </FormField>
          </div>

          <FormField id="password" label="Password" error={errors.password}>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <Lock aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                name="new-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder={`At least ${PASSWORD_MIN} characters`}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={describe('password', 'password-strength')}
                maxLength={PASSWORD_MAX}
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
            <PasswordStrength id="password-strength" password={password} />
          </FormField>
        </FieldGroup>

        <Alert variant="info">
          <Info aria-hidden="true" />
          <AlertDescription>
            Staff accounts are created by the shop owner. Work in a garage? Ask your owner for your
            login.
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-hover active:bg-brand-blue-hover"
        >
          {loading ? (
            <>
              <Spinner aria-hidden="true" />
              Creating your account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-brand-blue-ink hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
