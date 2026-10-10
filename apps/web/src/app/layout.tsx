import type { Metadata, Viewport } from 'next'
import { Edu_NSW_ACT_Foundation, Fira_Sans, JetBrains_Mono } from 'next/font/google'

import { ScreenNavigator } from '@/components/dev/screen-navigator'
import { SkipLink } from '@/components/layout/skip-link'
import { cn } from '@/lib/utils'

import './globals.css'
import { Providers } from './providers'

// Self-hosted by next/font: the browser never calls Google (spec 09 §3.6). The CSS variables are
// mapped to `font-sans` / `font-heading` / `font-handwriting` / `font-mono` in globals.css.
// Fira Sans is body and headings (DESIGN.md "Type"): 400 body, 500/600 labels and card titles,
// 700 sub-headings, 800 page titles, 900 the landing hero. Not variable, so each weight is listed.
const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-fira-sans',
  display: 'swap',
})
// The handwritten accent word (at most one per page, in a hero or greeting). Variable 400–700.
const eduNswActFoundation = Edu_NSW_ACT_Foundation({
  subsets: ['latin'],
  variable: '--font-edu-nsw-act',
  display: 'swap',
})
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'BayFlow · Multi-Tenant Auto Repair Shop Management Platform',
    template: '%s · BayFlow',
  },
  description:
    'BayFlow runs an auto repair shop on one shared workflow: online booking, inspection estimates customers approve from their phone, parts, repair and quality checks, with every role on the same live job.',
  applicationName: 'BayFlow',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#002CF1' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // next-themes sets `class="dark"` and `color-scheme` on <html> before React hydrates (D93).
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(firaSans.variable, eduNswActFoundation.variable, jetBrainsMono.variable)}
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
