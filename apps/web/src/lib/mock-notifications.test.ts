import { describe, expect, it } from 'vitest'

import { resolveMockSession } from './mock-auth'
import { INITIAL_BOOKINGS, INITIAL_TEAM, type MockBooking } from './mock-data'
import { deriveNotifications } from './mock-notifications'

const forEmail = (email: string, bookings: ReadonlyArray<MockBooking> = INITIAL_BOOKINGS) =>
  deriveNotifications(resolveMockSession(email), bookings, INITIAL_TEAM)

const types = (email: string) => forEmail(email).map((n) => n.type)

describe('deriveNotifications (glossary §6 recipients, D67 links)', () => {
  it('gives the Service Advisor the hand-offs addressed to "SAs of the shop"', () => {
    const items = forEmail('bilal.sa@bayflow.test')
    expect(items.length).toBeGreaterThan(0)
    const saTypes = [
      'BOOKING_CREATED',
      'ESTIMATE_SUBMITTED',
      'ESTIMATE_APPROVED',
      'ESTIMATE_REJECTED',
      'QC_PASSED',
    ]
    for (const n of items) {
      expect(saTypes).toContain(n.type)
      expect(n.link).toMatch(/^\/pos\/shops\/[^/]+\/bookings\/[^/]+$/)
    }
  })

  it('sends the Owner nothing while the shop has a Service Advisor (D26)', () => {
    expect(forEmail('fatima.owner@bayflow.test')).toEqual([])
  })

  it('falls back to the Owner when the shop has no Service Advisor', () => {
    const owner = resolveMockSession('fatima.owner@bayflow.test')
    const noSa = INITIAL_TEAM.filter((m) => m.role !== 'SERVICE_ADVISOR')
    expect(deriveNotifications(owner, INITIAL_BOOKINGS, noSa).length).toBeGreaterThan(0)
  })

  it('gives each workshop role only its own hand-offs, linked to its own screen', () => {
    for (const n of forEmail('imran.tech@bayflow.test')) {
      expect(['TECHNICIAN_ASSIGNED', 'PARTS_READY', 'QC_FAILED']).toContain(n.type)
      expect(n.link).toMatch(/\/jobs\//)
    }
    for (const n of forEmail('usman.parts@bayflow.test')) {
      expect(n.type).toBe('PARTS_NEEDED')
      expect(n.link).toMatch(/\/parts\//)
    }
    for (const n of forEmail('sara.qc@bayflow.test')) {
      expect(n.type).toBe('QC_REQUESTED')
      expect(n.link).toMatch(/\/qc\//)
    }
    expect(types('sara.qc@bayflow.test')).toContain('QC_REQUESTED')
  })

  it("gives a customer only their own bookings' updates, linked to the customer view", () => {
    const items = forEmail('ayesha.customer@bayflow.test')
    expect(items.length).toBeGreaterThan(0)
    const ayeshaBookings = new Set(
      INITIAL_BOOKINGS.filter((b) => b.customerName === 'Ayesha Khan').map((b) => b.reference),
    )
    for (const n of items) {
      expect(ayeshaBookings.has(n.reference)).toBe(true)
      expect(n.link).toMatch(/^\/bookings\/[^/]+$/)
    }
  })

  it('lists newest first, with one stable id per hand-off', () => {
    const items = forEmail('bilal.sa@bayflow.test')
    const times = items.map((n) => n.createdAt)
    expect([...times].sort().reverse()).toEqual(times)
    expect(new Set(items.map((n) => n.id)).size).toBe(items.length)
  })

  it('adds the confirmation once a pending booking is confirmed', () => {
    const pending = {
      ...INITIAL_BOOKINGS[0]!,
      customerName: 'Ayesha Khan',
      status: 'PENDING' as const,
    }
    const before = forEmail('ayesha.customer@bayflow.test', [pending])
    const after = forEmail('ayesha.customer@bayflow.test', [{ ...pending, status: 'CONFIRMED' }])
    expect(before.map((n) => n.type)).not.toContain('BOOKING_CONFIRMED')
    expect(after.map((n) => n.type)).toContain('BOOKING_CONFIRMED')
  })
})
