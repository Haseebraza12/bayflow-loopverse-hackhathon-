import { Skeleton } from '@/components/ui/skeleton'

function HeaderSkeleton({ back = false }: { back?: boolean }) {
  return (
    <div className="space-y-3 pb-2">
      {back ? <Skeleton className="h-5 w-24 rounded-full" /> : null}
      <Skeleton className="h-4 w-28 rounded-full" />
      <Skeleton className="h-10 w-64 max-w-full" />
      <Skeleton className="h-5 w-full max-w-xl" />
    </div>
  )
}

/** Loading state shaped like the QC queue (DESIGN.md §6.9): header, the two queue cards, history. */
export function QcQueueSkeleton() {
  return (
    <div className="@container/qc space-y-6" aria-busy="true">
      <HeaderSkeleton />
      <div className="grid items-start gap-6 @4xl/qc:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
      <Skeleton className="h-24 rounded-2xl" />
      <span className="sr-only">Loading the QC queue…</span>
    </div>
  )
}

/** Loading state shaped like an inspection: header, the checklist beside the decision and job. */
export function QcInspectionSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <HeaderSkeleton back />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] xl:gap-8">
        <div className="space-y-6">
          <Skeleton className="h-[34rem] rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="hidden h-72 rounded-2xl lg:block" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
      <span className="sr-only">Loading the inspection…</span>
    </div>
  )
}
