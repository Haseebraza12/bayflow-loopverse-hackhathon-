import { SearchX } from 'lucide-react'
import Link from 'next/link'

import { EmptyState } from '@/components/layout/empty-state'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

/** DESIGN.md §6.9: a skeleton shaped like SA-02 while this browser's data loads. */
export function BookingDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-3 pb-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] xl:gap-8">
        <div className="order-2 space-y-6 lg:order-1">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <div className="order-1 space-y-6 lg:order-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
      <span className="sr-only">Loading the booking…</span>
    </div>
  )
}

/** Spec 10 SA-02 edge state: an unknown booking, or one of another shop (E-35 answers 404). */
export function BookingNotFound({ backHref }: { backHref: string }) {
  return (
    <div className="space-y-6">
      <PageHeader back={{ href: backHref, label: 'Bookings' }} title="Booking not found" />
      <EmptyState
        icon={SearchX}
        title="We couldn't find that booking"
        description="It may belong to another shop, or the link is out of date."
        action={
          <Button asChild>
            <Link href={backHref}>Back to bookings</Link>
          </Button>
        }
      />
    </div>
  )
}
