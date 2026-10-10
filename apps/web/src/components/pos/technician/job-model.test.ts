import { describe, expect, it } from 'vitest'

import { INITIAL_BOOKINGS, type MockBooking } from '@/lib/mock-data'
import { BOOKING_STATUSES } from '@/lib/status'

import {
  cardNextStep,
  estimateNote,
  estimateTotals,
  groupJobs,
  jobGroup,
  nextStep,
  parseQcIssue,
  slotLabel,
  technicianAction,
} from './job-model'

const base = INITIAL_BOOKINGS[0]!

function booking(overrides: Partial<MockBooking>): MockBooking {
  return { ...base, ...overrides }
}

describe('jobGroup (spec 10 T-01 groups)', () => {
  it('puts a job QC sent back first, apart from the other repairs', () => {
    expect(jobGroup({ status: 'IN_REPAIR', qcPassed: false })).toBe('qc-returned')
    expect(jobGroup({ status: 'IN_REPAIR' })).toBe('repair')
    expect(jobGroup({ status: 'IN_REPAIR', qcPassed: true })).toBe('repair')
  })

  it('maps every status to its group, or to none outside the technician’s work', () => {
    expect(jobGroup({ status: 'ASSIGNED' })).toBe('to-inspect')
    expect(jobGroup({ status: 'INSPECTING' })).toBe('inspecting')
    expect(jobGroup({ status: 'PARTS_READY' })).toBe('repair')
    for (const status of [
      'ESTIMATE_REVIEW',
      'AWAITING_CUSTOMER',
      'ESTIMATE_APPROVED',
      'ESTIMATE_REJECTED',
      'PARTS_PENDING',
      'PARTS_ORDERED',
      'QC_PENDING',
      'QC_IN_PROGRESS',
    ] as const) {
      expect(jobGroup({ status })).toBe('waiting')
    }
    expect(jobGroup({ status: 'READY_FOR_PICKUP' })).toBe('done')
    expect(jobGroup({ status: 'COMPLETED' })).toBe('done')
    expect(jobGroup({ status: 'PENDING' })).toBeNull()
    expect(jobGroup({ status: 'CONFIRMED' })).toBeNull()
    expect(jobGroup({ status: 'CANCELLED' })).toBeNull()
  })
})

describe('groupJobs', () => {
  it('orders open jobs by slot (12-hour times) and finished jobs newest first', () => {
    const late = booking({
      id: 'a',
      status: 'ASSIGNED',
      scheduledDate: '2026-10-10',
      scheduledTime: '02:00 pm',
    })
    const early = booking({
      id: 'b',
      status: 'ASSIGNED',
      scheduledDate: '2026-10-10',
      scheduledTime: '11:00 am',
    })
    const noon = booking({
      id: 'c',
      status: 'ASSIGNED',
      scheduledDate: '2026-10-10',
      scheduledTime: '12:00 pm',
    })
    const dayBefore = booking({
      id: 'd',
      status: 'ASSIGNED',
      scheduledDate: '2026-10-09',
      scheduledTime: '05:00 pm',
    })
    const oldDone = booking({ id: 'e', status: 'COMPLETED', updatedAt: '2026-10-06T16:00:00Z' })
    const newDone = booking({
      id: 'f',
      status: 'READY_FOR_PICKUP',
      updatedAt: '2026-10-08T12:00:00Z',
    })
    const cancelled = booking({ id: 'g', status: 'CANCELLED' })

    const groups = groupJobs([late, early, oldDone, noon, cancelled, dayBefore, newDone])

    expect(groups['to-inspect'].map((b) => b.id)).toEqual(['d', 'b', 'c', 'a'])
    expect(groups.done.map((b) => b.id)).toEqual(['f', 'e'])
    expect(
      Object.values(groups)
        .flat()
        .map((b) => b.id),
    ).not.toContain('g')
  })

  it('groups the seed jobs without losing any technician job', () => {
    const groups = groupJobs(INITIAL_BOOKINGS)
    expect(groups.repair.map((b) => b.id)).toEqual(['bk-001'])
    expect(groups.waiting.map((b) => b.id).sort()).toEqual(['bk-002', 'bk-003'])
    expect(groups.done.map((b) => b.id)).toEqual(['bk-005', 'bk-006'])
  })
})

describe('technician actions', () => {
  it('offers exactly the actions the pages perform', () => {
    const offered = Object.fromEntries(
      BOOKING_STATUSES.map((status) => [status, technicianAction(status)]).filter(([, a]) => a),
    )
    expect(offered).toEqual({
      ASSIGNED: 'start-inspection',
      INSPECTING: 'submit-estimate',
      PARTS_READY: 'start-repair',
      IN_REPAIR: 'send-to-qc',
    })
  })

  it('keeps the inline card actions to the ones that need no input', () => {
    expect(cardNextStep(booking({ status: 'ASSIGNED' }))?.kind).toBe('start-inspection')
    expect(cardNextStep(booking({ status: 'PARTS_READY' }))?.kind).toBe('start-repair')
    expect(cardNextStep(booking({ status: 'INSPECTING' }))?.kind).toBe('open')
    expect(cardNextStep(booking({ status: 'IN_REPAIR' }))?.kind).toBe('open')
    expect(cardNextStep(booking({ status: 'IN_REPAIR', qcPassed: false }))?.cta).toBe(
      'Fix QC issue',
    )
    expect(cardNextStep(booking({ status: 'QC_PENDING' }))).toBeNull()
  })

  it('explains every status on the job page', () => {
    for (const status of BOOKING_STATUSES) {
      expect(nextStep({ status }).title).not.toBe('')
    }
    expect(nextStep({ status: 'IN_REPAIR', qcPassed: false }).tone).toBe('danger')
  })
})

describe('parseQcIssue', () => {
  it('reads the title and description the QC page writes', () => {
    expect(
      parseQcIssue('QC Issue: Minor fluid seep at drain plug — Re-torque the crush washer.'),
    ).toEqual({ title: 'Minor fluid seep at drain plug', detail: 'Re-torque the crush washer.' })
  })

  it('keeps notes in another shape whole, and ignores empty ones', () => {
    expect(parseQcIssue('Brake pedal feels soft')).toEqual({ title: 'Brake pedal feels soft' })
    expect(parseQcIssue('')).toBeNull()
    expect(parseQcIssue(undefined)).toBeNull()
  })
})

describe('estimate helpers', () => {
  it('splits parts and labour and keeps the saved total', () => {
    const totals = estimateTotals(base.estimateItems)
    expect(totals).toEqual({
      parts: 13800,
      labour: 3500,
      total: 17300,
      partLines: 3,
      labourLines: 2,
    })
    expect(totals.total).toBe(base.estimateTotal)
  })

  it('describes the estimate for the technician and for the Owner’s read-only view', () => {
    expect(estimateNote({ status: 'INSPECTING' }, 0)).toMatch(/saved as you add it/)
    expect(estimateNote({ status: 'INSPECTING' }, 2, true)).toBe(
      'The technician is building this estimate.',
    )
    expect(estimateNote({ status: 'IN_REPAIR', estimateApproved: true }, 5)).toBe(
      'Approved by the customer.',
    )
    expect(estimateNote({ status: 'IN_REPAIR', estimateApproved: true }, 0)).toBe(
      'No estimate lines.',
    )
  })

  it('formats slots, and leaves a date that is not a day key as it is', () => {
    expect(slotLabel({ scheduledDate: '2026-10-09', scheduledTime: '10:00 am' })).toBe(
      'Fri 9 Oct · 10:00 am',
    )
    expect(slotLabel({ scheduledDate: 'Tomorrow', scheduledTime: '10:00 am' })).toBe(
      'Tomorrow · 10:00 am',
    )
  })
})
