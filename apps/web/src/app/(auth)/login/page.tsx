'use client'

import { AlertCircle, Eye, EyeOff, Info, Lock, Mail, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState, type FormEvent } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEMO_ACCOUNTS, DEMO_AHMED_NOTE, DEMO_PASSWORD } from '@/content/demo-accounts'
import { setCurrentUser, type CurrentUserSession } from '@/lib/mock-data'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')
  const next = searchParams.get('next')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleQuickFill = (accEmail: string) => {
    setEmail(accEmail)
    setPassword(DEMO_PASSWORD)
    setError(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email address and password.')
      setLoading(false)
      return
    }

    // Match demo accounts or default based on email
    let matchedRole: CurrentUserSession['role'] = 'OWNER'
    let matchedName = 'Fatima Raza'
    const matchedShop = 'shop-lahore-auto-care'
    const matchedShopName = 'Lahore Auto Care'

    const lowerEmail = email.toLowerCase().trim()
    if (lowerEmail.includes('owner') || lowerEmail.includes('fatima')) {
      matchedRole = 'OWNER'
      matchedName = 'Fatima Raza'
    } else if (
      lowerEmail.includes('sa') ||
      lowerEmail.includes('bilal') ||
      lowerEmail.includes('advisor')
    ) {
      matchedRole = 'SERVICE_ADVISOR'
      matchedName = 'Bilal'
    } else if (lowerEmail.includes('tech') || lowerEmail.includes('imran')) {
      matchedRole = 'TECHNICIAN'
      matchedName = 'Imran'
    } else if (lowerEmail.includes('hamza')) {
      matchedRole = 'TECHNICIAN'
      matchedName = 'Hamza'
    } else if (lowerEmail.includes('parts') || lowerEmail.includes('usman')) {
      matchedRole = 'PARTS_PERSON'
      matchedName = 'Usman'
    } else if (
      lowerEmail.includes('qc') ||
      lowerEmail.includes('sara') ||
      lowerEmail.includes('hina')
    ) {
      matchedRole = 'QC_INSPECTOR'
      matchedName = lowerEmail.includes('hina') ? 'Hina' : 'Sara'
    } else if (
      lowerEmail.includes('customer') ||
      lowerEmail.includes('ayesha') ||
      lowerEmail.includes('ahmed')
    ) {
      matchedRole = 'CUSTOMER'
      matchedName = 'Ayesha Khan'
    } else {
      matchedRole = 'OWNER'
      matchedName = email.split('@')[0] || 'User'
    }

    setCurrentUser({
      name: matchedName,
      email: lowerEmail,
      role: matchedRole,
      shopId: matchedShop,
      shopName: matchedShopName,
    })

    // Set cookie for proxy auth
    if (typeof document !== 'undefined') {
      document.cookie = `bf_session=active_${Date.now()}; path=/; max-age=86400`
    }

    setTimeout(() => {
      setLoading(false)
      if (next) {
        router.push(next)
        return
      }

      switch (matchedRole) {
        case 'OWNER':
          router.push(`/pos/shops/${matchedShop}/overview`)
          break
        case 'SERVICE_ADVISOR':
          router.push(`/pos/shops/${matchedShop}/bookings`)
          break
        case 'TECHNICIAN':
          router.push(`/pos/shops/${matchedShop}/jobs`)
          break
        case 'PARTS_PERSON':
          router.push(`/pos/shops/${matchedShop}/parts`)
          break
        case 'QC_INSPECTOR':
          router.push(`/pos/shops/${matchedShop}/qc`)
          break
        case 'CUSTOMER':
          router.push('/bookings')
          break
        default:
          router.push(`/pos/shops/${matchedShop}/overview`)
      }
    }, 350)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-foreground">Log in to BayFlow</CardTitle>
          <CardDescription className="text-sm text-helper">
            Garage owners, service advisors, technicians and customers all sign in here.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {reason === 'expired' && (
            <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100">
              <Info className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-xs">
                Your session has expired. Please log in again to continue.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 text-red-900 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-100"
            >
              <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute top-2.5 left-3 size-4 text-subtle-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@bayflow.test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                  Password
                </Label>
                <span className="font-mono text-[11px] text-subtle-foreground">
                  Demo: BayFlow@2026
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 size-4 text-subtle-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-9 pl-9 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-3 text-subtle-foreground hover:text-muted-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-full bg-brand-blue font-semibold text-white hover:bg-blue-700"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-helper">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-brand-blue-ink hover:underline">
              Register your shop
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Demo Credentials Quick-Select Panel */}
      <Card className="border-blue-100 bg-blue-50/40 dark:border-blue-900/50 dark:bg-blue-950/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Wrench className="size-4 text-brand-blue-ink" />
              Demo Accounts & Quick Fill
            </CardTitle>
            <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              1-Click Fill
            </span>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Click any account to prefill credentials and sign in directly:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickFill(acc.email)}
                className="group flex flex-col rounded-lg border border-border/80 bg-card p-2.5 text-left text-xs transition-all hover:border-blue-400 hover:bg-blue-50/60 dark:hover:border-blue-600 dark:hover:bg-blue-950/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground group-hover:text-brand-blue-ink">
                    {acc.name}
                  </span>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium tracking-[0.32px] text-helper">
                    {acc.role}
                  </span>
                </div>
                <span className="mt-0.5 truncate font-mono text-[11px] text-helper">
                  {acc.email}
                </span>
                {acc.note && (
                  <span className="mt-0.5 text-[10px] text-subtle-foreground italic">
                    {acc.note}
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="pt-1 text-[11px] text-helper italic">{DEMO_AHMED_NOTE}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-subtle-foreground">Loading login...</div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
