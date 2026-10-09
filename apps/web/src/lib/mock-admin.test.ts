import { beforeEach, describe, expect, it } from 'vitest'

import {
  AdminActionError,
  PLATFORM_ADMIN_ACCOUNT,
  auditCsv,
  csvCell,
  getAdminShops,
  getAdminUsers,
  getAuditEvents,
  getShopSuspension,
  isAccountActive,
  isPlatformAdminEmail,
  reactivateShop,
  recordAdminView,
  recordSignIn,
  setPlatformAdmin,
  setUserActive,
  suspendShop,
  type AuditEvent,
} from './mock-admin'
import { INITIAL_BOOKINGS } from './mock-data'

const zainab = { name: PLATFORM_ADMIN_ACCOUNT.name, email: PLATFORM_ADMIN_ACCOUNT.email }
const userByEmail = (email: string) => getAdminUsers().find((u) => u.email === email)!

function expectRefusal(action: () => void, code: AdminActionError['code']) {
  try {
    action()
  } catch (error) {
    expect(error).toBeInstanceOf(AdminActionError)
    expect((error as AdminActionError).code).toBe(code)
    return
  }
  throw new Error('expected the action to be refused')
}

beforeEach(() => {
  localStorage.clear()
})

describe('directory', () => {
  it('lists each person once, with all their memberships', () => {
    const users = getAdminUsers()
    expect(new Set(users.map((u) => u.email)).size).toBe(users.length)
    const fatima = userByEmail('fatima.owner@bayflow.test')
    expect(fatima.memberships.map((m) => m.shopId).sort()).toEqual([
      'shop-lahore-auto-care',
      'shop-raza-auto-works',
    ])
    expect(fatima.kind).toBe('STAFF')
  })

  it('knows the platform admin, the staff and the customers', () => {
    expect(userByEmail('admin@bayflow.test')).toMatchObject({
      kind: 'PLATFORM_ADMIN',
      isPlatformAdmin: true,
      memberships: [],
    })
    expect(userByEmail('bilal.sa@bayflow.test').kind).toBe('STAFF')
    expect(userByEmail('ayesha.customer@bayflow.test').kind).toBe('CUSTOMER')
    expect(userByEmail('tariq.jamil@example.test').kind).toBe('CUSTOMER')
  })

  it('gives every shop at least one owner', () => {
    for (const tenant of getAdminShops())
      expect(tenant.owners.length, tenant.shop.name).toBeGreaterThan(0)
  })
})

describe('shop suspension (D96)', () => {
  it('suspends with a reason, refuses to do it twice, and reactivates', () => {
    expectRefusal(() => suspendShop('shop-raza-auto-works', 'no', zainab), 'VALIDATION_ERROR')
    suspendShop('shop-raza-auto-works', 'Unpaid subscription for September', zainab)
    expect(getShopSuspension('shop-raza-auto-works')).toMatchObject({
      reason: 'Unpaid subscription for September',
      byEmail: zainab.email,
    })
    expectRefusal(
      () => suspendShop('shop-raza-auto-works', 'Again, for testing', zainab),
      'CONFLICT',
    )
    reactivateShop('shop-raza-auto-works', zainab)
    expect(getShopSuspension('shop-raza-auto-works')).toBeNull()
    expectRefusal(() => reactivateShop('shop-raza-auto-works', zainab), 'CONFLICT')
  })

  it('records both actions in the audit log with the reason', () => {
    suspendShop('shop-lyallpur-motors', 'Reported for fake reviews', zainab)
    reactivateShop('shop-lyallpur-motors', zainab)
    // Seeded sample events may be timestamped later today, so compare this browser's events only.
    const [latest, previous] = getAuditEvents().filter((e) => e.id.startsWith('live:'))
    expect(latest).toMatchObject({ action: 'shop.reactivated', category: 'SHOP' })
    expect(previous).toMatchObject({
      action: 'shop.suspended',
      metadata: { reason: 'Reported for fake reviews' },
      actor: { role: 'PLATFORM_ADMIN', email: zainab.email },
    })
  })
})

describe('account safeguards (spec 19 §1)', () => {
  it('refuses self-deactivation and self-revocation', () => {
    const me = userByEmail(zainab.email)
    expectRefusal(() => setUserActive(me.id, false, 'Leaving the company', zainab), 'FORBIDDEN')
    const bilal = userByEmail('bilal.sa@bayflow.test')
    setPlatformAdmin(bilal.id, true, zainab)
    expectRefusal(() => setPlatformAdmin(me.id, false, zainab), 'FORBIDDEN')
  })

  it('keeps at least one active platform admin', () => {
    const bilal = userByEmail('bilal.sa@bayflow.test')
    setPlatformAdmin(bilal.id, true, zainab)
    const asBilal = { name: 'Bilal', email: 'bilal.sa@bayflow.test' }
    setPlatformAdmin(userByEmail(zainab.email).id, false, asBilal)
    // Bilal is now the only admin: nobody can remove or deactivate him.
    expectRefusal(() => setPlatformAdmin(bilal.id, false, zainab), 'CONFLICT')
    expectRefusal(() => setUserActive(bilal.id, false, 'Testing the guard', zainab), 'CONFLICT')
  })

  it('needs a reason to deactivate, refuses no-op changes and inactive grants', () => {
    const tariq = userByEmail('tariq.jamil@example.test')
    expectRefusal(() => setUserActive(tariq.id, false, '', zainab), 'VALIDATION_ERROR')
    setUserActive(tariq.id, false, 'Chargeback fraud reported by the shop', zainab)
    expect(userByEmail('tariq.jamil@example.test').isActive).toBe(false)
    expect(isAccountActive('Tariq.Jamil@example.test')).toBe(false)
    expectRefusal(
      () => setUserActive(tariq.id, false, 'Twice for good measure', zainab),
      'CONFLICT',
    )
    expectRefusal(() => setPlatformAdmin(tariq.id, true, zainab), 'VALIDATION_ERROR')
    setUserActive(tariq.id, true, null, zainab)
    expect(isAccountActive('tariq.jamil@example.test')).toBe(true)
  })

  it('grants and revokes platform admin', () => {
    const sara = userByEmail('sara.qc@bayflow.test')
    expect(isPlatformAdminEmail(sara.email)).toBe(false)
    setPlatformAdmin(sara.id, true, zainab)
    expect(isPlatformAdminEmail(sara.email)).toBe(true)
    expect(userByEmail(sara.email).kind).toBe('PLATFORM_ADMIN')
    expectRefusal(() => setPlatformAdmin(sara.id, true, zainab), 'CONFLICT')
    setPlatformAdmin(sara.id, false, zainab)
    expect(isPlatformAdminEmail(sara.email)).toBe(false)
  })
})

describe('audit log (D95)', () => {
  it('records every booking action of the mock bookings, newest first', () => {
    const events = getAuditEvents()
    const times = events.map((e) => e.occurredAt)
    expect([...times].sort().reverse()).toEqual(times)
    for (const booking of INITIAL_BOOKINGS) {
      expect(
        events.some((e) => e.target?.label === booking.reference && e.action === 'booking.create'),
        booking.reference,
      ).toBe(true)
    }
    expect(new Set(events.map((e) => e.id)).size).toBe(events.length)
  })

  it('records sign-ins, failed sign-ins and audited admin reads', () => {
    recordSignIn('Bilal.SA@bayflow.test', true)
    recordSignIn('nobody@bayflow.test', false)
    recordAdminView('user', { id: 'usr-bilal', label: 'bilal.sa@bayflow.test' }, zainab)
    recordAdminView('user', { id: 'usr-bilal', label: 'bilal.sa@bayflow.test' }, zainab)
    const live = getAuditEvents().filter((e) => e.id.startsWith('live:'))
    expect(live.map((e) => e.action).sort()).toEqual([
      'admin.user_viewed',
      'auth.login_failed',
      'auth.login_succeeded',
    ])
    expect(live.find((e) => e.action === 'auth.login_failed')!.metadata).toEqual({
      email: 'nobody@bayflow.test',
    })
    expect(userByEmail('bilal.sa@bayflow.test').lastLoginAt).toBe(
      live.find((e) => e.action === 'auth.login_succeeded')!.occurredAt,
    )
  })

  it('never puts a password or token in an event', () => {
    const text = JSON.stringify(getAuditEvents())
    expect(text).not.toMatch(/BayFlow@2026|password|token|hash/i)
  })
})

describe('CSV export (E-75)', () => {
  it('quotes per RFC 4180 and neutralises formulas', () => {
    expect(csvCell('plain')).toBe('plain')
    expect(csvCell('a, b')).toBe('"a, b"')
    expect(csvCell('say "hi"')).toBe('"say ""hi"""')
    expect(csvCell('line\nbreak')).toBe('"line\nbreak"')
    expect(csvCell('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`)
    expect(csvCell('+92 300 1234567')).toBe("'+92 300 1234567")
    expect(csvCell('-1')).toBe("'-1")
    expect(csvCell('@user')).toBe("'@user")
    expect(csvCell(null)).toBe('')
  })

  it('writes a header and one CRLF line per event', () => {
    const events = getAuditEvents().slice(0, 3)
    const csv = auditCsv(events)
    const lines = csv.split('\r\n')
    expect(lines[0]).toMatch(/^occurred_at,category,action,summary,/)
    expect(lines).toHaveLength(events.length + 2) // header + rows + trailing empty
  })

  it('caps the export at 10 000 rows', () => {
    const one = getAuditEvents()[0]!
    const many: AuditEvent[] = Array.from({ length: 10_005 }, (_, i) => ({ ...one, id: `x${i}` }))
    expect(auditCsv(many).split('\r\n')).toHaveLength(10_000 + 2)
  })
})
