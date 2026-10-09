'use client'

import { AlertCircle, Building2, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { setCurrentUser } from '@/lib/mock-data'

export default function RegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [garageName, setGarageName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in your name, email, and password.')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      setLoading(false)
      return
    }

    setCurrentUser({
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: 'OWNER',
      shopId: 'shop-lahore-auto-care',
      shopName: garageName.trim() || 'My Auto Repair Shop',
    })

    if (typeof document !== 'undefined') {
      document.cookie = `bf_session=active_${Date.now()}; path=/; max-age=86400`
    }

    setTimeout(() => {
      setLoading(false)
      router.push('/pos/shops/new')
    }, 400)
  }

  return (
    <Card className="border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-foreground">Register your garage</CardTitle>
        <CardDescription className="text-sm text-helper">
          Create your Owner account. Next, you&apos;ll set up your shop, services, and invite your
          workshop team.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert
            variant="destructive"
            className="border-red-200 bg-red-50 text-red-900 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-100"
          >
            <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold text-muted-foreground">
              Full name
            </Label>
            <div className="relative">
              <User className="absolute top-2.5 left-3 size-4 text-subtle-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Tariq Mehmood"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="garageName" className="text-xs font-semibold text-muted-foreground">
              Shop / Garage name
            </Label>
            <div className="relative">
              <Building2 className="absolute top-2.5 left-3 size-4 text-subtle-foreground" />
              <Input
                id="garageName"
                type="text"
                placeholder="Falcon Auto Works"
                value={garageName}
                onChange={(e) => setGarageName(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute top-2.5 left-3 size-4 text-subtle-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tariq@falconauto.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">
              Phone number (optional)
            </Label>
            <div className="relative">
              <Phone className="absolute top-2.5 left-3 size-4 text-subtle-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute top-2.5 left-3 size-4 text-subtle-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
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

          <p className="pt-1 text-[11px] leading-relaxed text-helper">
            Note: Workshop staff (Service Advisors, Technicians, QC, Parts) are invited by you after
            setup. Staff do not need to self-register.
          </p>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 w-full rounded-full bg-brand-blue font-semibold text-white hover:bg-blue-700"
          >
            {loading ? 'Creating account...' : 'Create Owner Account & Shop'}
          </Button>
        </form>

        <div className="border-t border-border-faint pt-2 text-center text-xs text-helper">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-blue-ink hover:underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
