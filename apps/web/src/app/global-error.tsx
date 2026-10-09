'use client'

import { RouteError } from '@/components/feedback/route-error'

import './globals.css'

/**
 * Last-resort boundary for errors in the root layout (spec 10 X-05). It replaces the root layout,
 * so it renders its own <html>/<body> and imports the global styles itself.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <title>Something went wrong · BayFlow</title>
        <main id="main" tabIndex={-1}>
          <RouteError error={error} retry={retry} />
        </main>
      </body>
    </html>
  )
}
