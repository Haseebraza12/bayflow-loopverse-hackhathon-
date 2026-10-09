import type { CurrentUserSession } from '@/lib/mock-data'

/**
 * Stand-in for `POST /api/v1/auth/login` while the screens run on mock data: any password is
 * accepted and the e-mail's local part picks the persona. Tokens are matched whole (`sara.qc`
 * is QC, not Service Advisor because it contains "sa"), and named people win over role words
 * (`hamza.tech` is Hamza, not Imran). Replaced by the real API client (spec 09 §2.8).
 */

type Role = CurrentUserSession['role']

const DEMO_SHOP = { shopId: 'shop-lahore-auto-care', shopName: 'Lahore Auto Care' }

const RULES: ReadonlyArray<{ tokens: ReadonlyArray<string>; role: Role; name?: string }> = [
  { tokens: ['fatima', 'owner'], role: 'OWNER', name: 'Fatima Raza' },
  { tokens: ['hamza'], role: 'TECHNICIAN', name: 'Hamza' },
  { tokens: ['imran', 'tech', 'technician'], role: 'TECHNICIAN', name: 'Imran' },
  { tokens: ['hina'], role: 'QC_INSPECTOR', name: 'Hina' },
  { tokens: ['sara', 'qc'], role: 'QC_INSPECTOR', name: 'Sara' },
  { tokens: ['usman', 'parts'], role: 'PARTS_PERSON', name: 'Usman' },
  { tokens: ['bilal', 'sa', 'advisor'], role: 'SERVICE_ADVISOR', name: 'Bilal' },
  { tokens: ['ayesha'], role: 'CUSTOMER', name: 'Ayesha Khan' },
  { tokens: ['ahmed', 'customer'], role: 'CUSTOMER' },
]

function capitalise(word: string) {
  return word ? word[0]!.toUpperCase() + word.slice(1) : word
}

export function resolveMockSession(rawEmail: string): CurrentUserSession {
  const email = rawEmail.trim().toLowerCase()
  const local = email.split('@')[0] ?? ''
  const tokens = local.split(/[._+-]+/).filter(Boolean)
  const rule = RULES.find((r) => r.tokens.some((t) => tokens.includes(t)))
  const fallbackName = capitalise(tokens[0] ?? 'User')
  return {
    email,
    role: rule?.role ?? 'OWNER',
    name: rule?.name ?? fallbackName,
    ...DEMO_SHOP,
  }
}

/** Where each persona lands after login (spec 10 S-04 role homes; customers go to C-01). */
export function homePathFor(session: Pick<CurrentUserSession, 'role' | 'shopId'>): string {
  const shop = `/pos/shops/${session.shopId}`
  switch (session.role) {
    case 'OWNER':
      return `${shop}/overview`
    case 'SERVICE_ADVISOR':
      return `${shop}/bookings`
    case 'TECHNICIAN':
      return `${shop}/jobs`
    case 'PARTS_PERSON':
      return `${shop}/parts`
    case 'QC_INSPECTOR':
      return `${shop}/qc`
    case 'CUSTOMER':
      return '/bookings'
  }
}
