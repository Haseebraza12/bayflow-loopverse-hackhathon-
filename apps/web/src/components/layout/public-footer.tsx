import { KeyRound, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

import { CONTACT_EMAIL, CONTACT_PHONE } from '@/components/landing/site-contact'

import { Logo } from './logo'

const LINK =
  'rounded-sm outline-none transition-colors hover:text-brand-blue-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid'

/** True features, each linking to the landing section that explains it. */
const FEATURE_LINKS = [
  { label: 'Online booking', href: '/#customers' },
  { label: 'Workflow', href: '/#lifecycle' },
  { label: 'Estimates', href: '/#estimates' },
  { label: 'Inventory', href: '/#inventory' },
  { label: 'Purchase orders', href: '/#purchase-orders' },
  { label: 'Quality control', href: '/#quality-control' },
  { label: 'Service catalogue', href: '/#services' },
  { label: 'Technician jobs', href: '/#technicians' },
  { label: 'Customer portal', href: '/#customers' },
  { label: 'In-app notifications', href: '/#support' },
  { label: 'Team and roles', href: '/#roles' },
  { label: 'Multi-shop summary', href: '/#workflow' },
]

const SOLUTION_LINKS = [
  { label: 'For workshop owners', href: '/#workflow' },
  { label: 'For multi-shop owners', href: '/#workflow' },
  { label: 'For service advisors', href: '/#roles' },
  { label: 'For technicians', href: '/#technicians' },
  { label: 'For QC inspectors', href: '/#quality-control' },
  { label: 'For parts teams', href: '/#inventory' },
  { label: 'For car owners', href: '/#customers' },
  { label: 'Getting started', href: '/#support' },
]

/**
 * Public footer (landing, booking flow, customer area). Headings start at h2 so the outline stays in
 * order on any page that has an h1, however short it is.
 */
export function PublicFooter() {
  return (
    <footer className="marketing border-t border-border bg-card">
      {/* Upper Footer: Links & Contact */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Col 1: Brand & Need Help? */}
          <div id="contact" className="space-y-6 lg:col-span-4">
            <Link href="/" aria-label="BayFlow home" className={`inline-block ${LINK}`}>
              <Logo size="md" />
            </Link>

            <div className="pt-2">
              <h2 className="text-xl font-bold text-foreground">Need Help?</h2>
              <p className="mt-1 text-sm text-helper">Contact us with any questions</p>
            </div>

            <ul className="space-y-4">
              {/* Call Us */}
              <li>
                <a
                  href={CONTACT_PHONE.href}
                  className={`group flex items-center gap-3 text-foreground ${LINK}`}
                >
                  <span className="flex shrink-0 items-center justify-center text-helper transition-colors group-hover:text-brand-blue-ink">
                    <Phone aria-hidden="true" className="size-4" />
                  </span>
                  <span>
                    <span className="block text-xs text-helper">Call us</span>
                    <span className="text-sm font-bold">{CONTACT_PHONE.display}</span>
                  </span>
                </a>
              </li>

              {/* Email Us */}
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={`group flex items-center gap-3 text-foreground ${LINK}`}
                >
                  <span className="flex shrink-0 items-center justify-center text-helper transition-colors group-hover:text-brand-blue-ink">
                    <Mail aria-hidden="true" className="size-4" />
                  </span>
                  <span>
                    <span className="block text-xs text-helper">E-mail us</span>
                    <span className="text-sm font-bold">{CONTACT_EMAIL}</span>
                  </span>
                </a>
              </li>

              {/* Try the demo */}
              <li>
                <Link
                  href="/login"
                  className={`group flex items-center gap-3 text-foreground ${LINK}`}
                >
                  <span className="flex shrink-0 items-center justify-center text-helper transition-colors group-hover:text-brand-blue-ink">
                    <KeyRound aria-hidden="true" className="size-4" />
                  </span>
                  <span>
                    <span className="block text-xs text-helper">Try the demo</span>
                    <span className="text-sm font-bold">Demo accounts for every role</span>
                  </span>
                </Link>
              </li>
            </ul>

            {/* Follow Us */}
            <div className="pt-2">
              <h3 className="mb-3 text-sm font-bold text-foreground">Follow us</h3>
              <div className="-ml-2.5 flex items-center gap-1">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={`flex size-9 items-center justify-center text-muted-foreground ${LINK}`}
                >
                  <svg aria-hidden="true" className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.32a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={`flex size-9 items-center justify-center text-muted-foreground ${LINK}`}
                >
                  <svg
                    aria-hidden="true"
                    className="size-4 fill-none stroke-current stroke-2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={`flex size-9 items-center justify-center text-muted-foreground ${LINK}`}
                >
                  <svg aria-hidden="true" className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (formerly Twitter)"
                  className={`flex size-9 items-center justify-center text-muted-foreground ${LINK}`}
                >
                  <svg aria-hidden="true" className="size-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Features */}
          <div className="sm:col-span-3 lg:col-span-4">
            <h2 className="mb-4 text-base font-bold text-foreground">Features</h2>
            <ul className="space-y-2.5 text-sm font-medium text-muted-foreground">
              {FEATURE_LINKS.map((f) => (
                <li key={f.label}>
                  <Link href={f.href} className={LINK}>
                    {f.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="sm:col-span-3 lg:col-span-4">
            <h2 className="mb-4 text-base font-bold text-foreground">Solutions</h2>
            <ul className="space-y-2.5 text-sm font-medium text-muted-foreground">
              {SOLUTION_LINKS.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className={LINK}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-border bg-card py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-helper sm:px-6 md:flex-row lg:px-8">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
              <li>
                <Link href="/book" className={LINK}>
                  Book a service
                </Link>
              </li>
              <li>
                <Link href="/register" className={LINK}>
                  Register your shop
                </Link>
              </li>
              <li>
                <Link href="/login" className={LINK}>
                  Staff log in
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Logo size="sm" showText={false} />
            <p>© 2026 BayFlow. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
