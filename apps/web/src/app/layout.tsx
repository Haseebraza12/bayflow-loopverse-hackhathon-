import type { Metadata, Viewport } from 'next'
import { Caveat, Inter, JetBrains_Mono } from 'next/font/google'

import { SkipLink } from '@/components/layout/skip-link'
import { cn } from '@/lib/utils'

import './globals.css'
import { Providers } from './providers'

// Self-hosted by next/font: the browser never calls Google (spec 09 §3.6). The CSS variables are
// mapped to `font-sans` / `font-mono` in globals.css.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})
// Handwritten accent words in the landing-page headings (`font-handwriting`).
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

// Wording from spec 10 P-01 (hero h1, subline and owner band); pages add "{Page} · BayFlow".
export const metadata: Metadata = {
  title: { default: 'BayFlow · Book trusted car repair in minutes', template: '%s · BayFlow' },
  description:
    'Pick a garage and a time, approve your estimate online and track your car live. Garages run bookings, estimates, parts and QC in one place.',
  applicationName: 'BayFlow',
}

export const viewport: Viewport = {
  themeColor: '#1047FA',
  colorScheme: 'light',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn(inter.variable, jetBrainsMono.variable, caveat.variable)}>
      <body className="flex min-h-dvh flex-col bg-white text-[#171c26] antialiased">
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
