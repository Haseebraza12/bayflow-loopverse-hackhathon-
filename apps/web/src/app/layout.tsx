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
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'GarageBox · Auto Repair Garage Management Software', template: '%s · GarageBox' },
  description:
    'Take control of your auto repair business with GarageBox, the leading garage management software. Simplify job scheduling, invoicing, and inventory control.',
  applicationName: 'GarageBox',
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
