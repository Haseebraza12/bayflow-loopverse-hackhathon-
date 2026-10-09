import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

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

export const metadata: Metadata = {
  title: { default: 'BayFlow', template: '%s · BayFlow' },
  description:
    'Book trusted car repair in minutes, approve your estimate online and track your car live.',
  applicationName: 'BayFlow',
}

export const viewport: Viewport = {
  themeColor: '#14213D',
  colorScheme: 'light',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn(inter.variable, jetBrainsMono.variable)}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
