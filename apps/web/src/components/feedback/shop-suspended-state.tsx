import { Ban } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty'

/** 403 `SHOP_SUSPENDED` (D96): the shop is suspended by BayFlow, for every member alike. */
export function ShopSuspendedState() {
  return (
    <Empty className="border border-border-subtle bg-layer py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Ban aria-hidden="true" />
        </EmptyMedia>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          This shop is suspended
        </h1>
        <EmptyDescription>
          BayFlow has suspended this shop, so its workspace is closed for now. Your records are
          kept. Contact BayFlow support to have it reactivated.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline">
          <Link href="/">Back to the website</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
