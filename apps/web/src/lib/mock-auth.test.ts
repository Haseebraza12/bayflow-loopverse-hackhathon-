import { describe, expect, it } from 'vitest'

import { DEMO_ACCOUNTS } from '@/content/demo-accounts'

import { homePathFor, resolveMockSession } from './mock-auth'

const ROLE_OF: Record<string, string> = {
  Owner: 'OWNER',
  'Service Advisor': 'SERVICE_ADVISOR',
  Technician: 'TECHNICIAN',
  'QC Inspector': 'QC_INSPECTOR',
  'Parts Person': 'PARTS_PERSON',
  Customer: 'CUSTOMER',
  'Platform Admin': 'PLATFORM_ADMIN',
}

describe('resolveMockSession', () => {
  it.each(DEMO_ACCOUNTS.map((a) => [a.email, a]))(
    'signs %s in as the listed person and role',
    (email, account) => {
      const session = resolveMockSession(email)
      expect(session.role).toBe(ROLE_OF[account.role])
      expect(session.name).toBe(account.name)
      expect(session.email).toBe(email)
    },
  )

  it('matches whole tokens, so a name containing "sa" is not a Service Advisor', () => {
    expect(resolveMockSession('sara.qc@bayflow.test').role).toBe('QC_INSPECTOR')
    expect(resolveMockSession('Hamza.Tech@BayFlow.test').name).toBe('Hamza')
  })

  it('normalises the e-mail and falls back to an owner named after it', () => {
    const session = resolveMockSession('  Zain.Malik@Example.pk ')
    expect(session).toMatchObject({ email: 'zain.malik@example.pk', role: 'OWNER', name: 'Zain' })
  })
})

describe('homePathFor', () => {
  it('sends each role to its home', () => {
    const shopId = 'shop-x'
    expect(homePathFor({ role: 'OWNER', shopId })).toBe('/pos/shops/shop-x/overview')
    expect(homePathFor({ role: 'SERVICE_ADVISOR', shopId })).toBe('/pos/shops/shop-x/bookings')
    expect(homePathFor({ role: 'TECHNICIAN', shopId })).toBe('/pos/shops/shop-x/jobs')
    expect(homePathFor({ role: 'PARTS_PERSON', shopId })).toBe('/pos/shops/shop-x/parts')
    expect(homePathFor({ role: 'QC_INSPECTOR', shopId })).toBe('/pos/shops/shop-x/qc')
    expect(homePathFor({ role: 'CUSTOMER', shopId })).toBe('/bookings')
    expect(homePathFor({ role: 'PLATFORM_ADMIN', shopId })).toBe('/admin')
  })
})
