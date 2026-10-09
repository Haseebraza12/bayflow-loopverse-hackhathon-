'use client'

import { CircleAlert } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export interface RouteErrorProps {
  error: Error & { digest?: string }
  /** Next 16.3+ `retry()`: re-fetches and re-renders the failed segment. */
  retry: () => void
  homeHref?: string
}

/** Body of every `error.tsx` boundary (spec 10 X-05): human message, Try again, Go home. */
export function RouteError({ error, retry, homeHref = '/' }: RouteErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
      <CircleAlert aria-hidden="true" className="size-10 text-danger-ink" />
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground">
        Please try again. If it keeps happening, go back to the start.
      </p>
      {error.digest ? (
        <p className="text-xs text-muted-foreground">
          Reference: <span className="font-mono">{error.digest}</span>
        </p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => retry()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href={homeHref}>Go home</Link>
        </Button>
      </div>
    </div>
  )
}
