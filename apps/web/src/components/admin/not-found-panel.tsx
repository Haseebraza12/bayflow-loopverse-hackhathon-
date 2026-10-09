import { SearchX } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty'

/** An unknown ID in the console (spec 03: the same 404 everywhere). */
export function NotFoundPanel({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  return (
    <Empty className="border border-border-subtle bg-layer py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX aria-hidden="true" />
        </EmptyMedia>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          We couldn&apos;t find that.
        </h1>
        <EmptyDescription>It may have been mistyped, or it never existed.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
