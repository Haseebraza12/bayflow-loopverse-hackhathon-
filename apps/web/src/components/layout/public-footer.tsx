import Link from 'next/link'

import { Logo } from './logo'

interface FooterColumn {
  title: string
  links: ReadonlyArray<{ label: string; href: string }>
}

/**
 * Only routes that exist and sections of the landing page (`/#…`). Spec 10 P-01 asks for at least
 * "Find a shop · Register your shop · Staff log in".
 */
const FOOTER_COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    title: 'For car owners',
    links: [
      { label: 'Find a garage', href: '/book' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'My bookings', href: '/bookings' },
    ],
  },
  {
    title: 'For garages',
    links: [
      { label: 'List your garage', href: '/register' },
      { label: 'Getting started', href: '/#get-started' },
      { label: 'Staff log in', href: '/login' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Booking lifecycle', href: '/#lifecycle' },
      { label: 'Estimate approval', href: '/#estimates' },
      { label: 'Parts and QC', href: '/#parts' },
      { label: 'Multi-shop', href: '/#multi-shop' },
    ],
  },
]

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2'

/** Customer-portal footer: brand blurb, link columns and the copyright line. */
export function PublicFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <Link
              href="/"
              aria-label="BayFlow home"
              className={`inline-block rounded-xl ${FOCUS_RING}`}
            >
              <Logo size="md" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
              Bookings, estimates, parts and quality checks for independent garages, in one place.
              Customers book, approve and follow their repair online.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h2 className="mb-4 text-base font-bold text-neutral-900">{column.title}</h2>
                <ul className="space-y-3 text-sm font-medium text-neutral-600">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`rounded-sm transition-colors hover:text-[#1047FA] ${FOCUS_RING}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-neutral-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-600 sm:px-6 md:flex-row lg:px-8">
          <p>Auto repair, without the phone calls.</p>
          <div className="flex items-center gap-2">
            <Logo size="sm" showText={false} />
            <p>© 2026 BayFlow</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
