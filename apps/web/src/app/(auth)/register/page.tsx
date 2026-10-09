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
    <Card className="border-neutral-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-neutral-900">
          Register your garage
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Create your Owner account. Next, you&apos;ll set up your shop, services, and invite your workshop team.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
            <AlertCircle className="size-4 text-red-600" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold text-neutral-700">
              Full name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 size-4 text-neutral-400" />
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
            <Label htmlFor="garageName" className="text-xs font-semibold text-neutral-700">
              Shop / Garage name
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 size-4 text-neutral-400" />
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
            <Label htmlFor="email" className="text-xs font-semibold text-neutral-700">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 size-4 text-neutral-400" />
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
            <Label htmlFor="phone" className="text-xs font-semibold text-neutral-700">
              Phone number (optional)
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 size-4 text-neutral-400" />
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
            <Label htmlFor="password" className="text-xs font-semibold text-neutral-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 size-4 text-neutral-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed pt-1">
            Note: Workshop staff (Service Advisors, Technicians, QC, Parts) are invited by you after setup. Staff do not need to self-register.
          </p>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1047FA] hover:bg-blue-700 text-white font-semibold h-10 mt-2 rounded-full"
          >
            {loading ? 'Creating account...' : 'Create Owner Account & Shop'}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-neutral-500 border-t border-neutral-100">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#1047FA] hover:underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
