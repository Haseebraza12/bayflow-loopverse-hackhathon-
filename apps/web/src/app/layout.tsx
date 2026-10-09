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
    default: 'BayFlow · Auto Repair Garage Management Software',
    template: '%s · BayFlow',
  },
  description:
    'Take control of your auto repair business with BayFlow. Simplify job scheduling, invoicing, and inventory control.',
  applicationName: 'BayFlow',
}

export const viewport: Viewport = {
  themeColor: '#1047FA',
  colorScheme: 'light',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn(
        archivo.variable,
        pragatiNarrow.variable,
        jetBrainsMono.variable,
        caveat.variable,
      )}
    >
      <body className="flex min-h-dvh flex-col bg-white text-[#171c26] antialiased">
        <SkipLink />
        <Providers>{children}</Providers>
        {/* Design review helper, never shipped to production */}
        {process.env.NODE_ENV !== 'production' && <ScreenNavigator />}
      </body>
    </html>
  )
}
