import type { Metadata, Viewport } from 'next'
import { Archivo, Caveat, JetBrains_Mono, Pragati_Narrow } from 'next/font/google'

import { ScreenNavigator } from '@/components/dev/screen-navigator'
import { SkipLink } from '@/components/layout/skip-link'
import { cn } from '@/lib/utils'

import './globals.css'
import { Providers } from './providers'

// Self-hosted by next/font: the browser never calls Google (spec 09 §3.6). The CSS variables are
// mapped to `font-sans` / `font-heading` / `font-mono` in globals.css.
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' })
const pragatiNarrow = Pragati_Narrow({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pragati-narrow',
  display: 'swap',
})
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
  title: {
    default: 'GarageBox · Auto Repair Garage Management Software',
    template: '%s · GarageBox',
  },
  description:
    'Take control of your auto repair business with GarageBox, the leading garage management software. Simplify job scheduling, invoicing, and inventory control.',
  applicationName: 'GarageBox',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1047FA' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1c' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // next-themes sets `class="dark"` and `color-scheme` on <html> before React hydrates (D93).
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        archivo.variable,
        pragatiNarrow.variable,
        jetBrainsMono.variable,
        caveat.variable,
      )}
    >
      {/* Browser extensions (e.g. Grammarly's data-gr-ext-installed) add attributes to <body> before
          React hydrates; this accepts the DOM's attributes for this one element only. */}
      <body
        suppressHydrationWarning
        className="flex min-h-dvh flex-col bg-background text-foreground antialiased"
      >
        <SkipLink />
        <Providers>{children}</Providers>
        {/* Design review helper, never shipped to production */}
        {process.env.NODE_ENV !== 'production' && <ScreenNavigator />}
      </body>
    </html>
  )
}
