import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CustomerBookingDetailPage from '@/app/(customer)/bookings/[bookingId]/page'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  DEFAULT_USER,
  INITIAL_BOOKINGS,
  setCurrentUser,
  setStoredData,
  type MockBooking,
} from '@/lib/mock-data'

vi.mock('next/navigation', () => ({
  useParams: () => ({ bookingId: 'bk-001' }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/bookings/bk-001',
}))

/** The seed bookings, with Ayesha's bk-001 changed, as this browser's stored data. */
function stage(changes: Partial<MockBooking>) {
  setStoredData(
    'bookings',
    INITIAL_BOOKINGS.map((booking) =>
      booking.id === 'bk-001'
        ? {
            ...booking,
            customerName: 'Ayesha Khan',
            customerEmail: 'ayesha.customer@bayflow.test',
            ...changes,
          }
        : booking,
    ),
  )
}

/** The page as the app renders it (the copy button's tooltip needs the provider). */
function renderPage() {
  return render(
    <TooltipProvider>
      <CustomerBookingDetailPage />
    </TooltipProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  setCurrentUser({
    ...DEFAULT_USER,
    name: 'Ayesha Khan',
    email: 'ayesha.customer@bayflow.test',
    role: 'CUSTOMER',
  })
})

describe('C-02 booking detail: the quality check', () => {
  it('never shows a failed QC round to the customer (D92)', () => {
    stage({
      status: 'IN_REPAIR',
      qcPassed: false,
      qcNotes: 'QC Issue: Oil leak at the drain plug — Re-torque the crush washer.',
    })
    renderPage()

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Quality check' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Oil leak at the drain plug/)).not.toBeInTheDocument()
    expect(screen.queryByText('Passed')).not.toBeInTheDocument()
  })

  it('shows the inspector’s notes under "Passed" once the car passed', () => {
    stage({
      status: 'READY_FOR_PICKUP',
      qcPassed: true,
      qcNotes: 'Brakes bedded in and road tested. No leaks.',
    })
    renderPage()

    expect(screen.getByRole('heading', { name: 'Quality check' })).toBeInTheDocument()
    expect(screen.getByText('Passed')).toBeInTheDocument()
    expect(screen.getByText('Brakes bedded in and road tested. No leaks.')).toBeInTheDocument()
  })
})
