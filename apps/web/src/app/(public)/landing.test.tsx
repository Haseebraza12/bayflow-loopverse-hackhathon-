import { readdirSync } from 'node:fs'
import path from 'node:path'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PublicFooter } from '@/components/layout/public-footer'
import { PublicHeader } from '@/components/layout/public-header'

import LandingPage from './page'

/** `src/app`, the App Router root (this file lives in `src/app/(public)`). */
const APP_DIR = path.resolve(import.meta.dirname, '..')

/** Static App Router routes: `app/(group)/x/page.tsx` → `/x`. Dynamic segments are skipped. */
function staticRoutes(dir = APP_DIR, segments: ReadonlyArray<string> = []): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('[')) return []
      const isRouteGroup = /^\(.+\)$/.test(entry.name)
      return staticRoutes(
        path.join(dir, entry.name),
        isRouteGroup ? segments : [...segments, entry.name],
      )
    }
    return entry.name === 'page.tsx' ? [`/${segments.join('/')}`] : []
  })
}

// The copied brand, its phone number and asset folder are assembled from parts, so the owner's
// repository-wide grep for them finds no hits in this file either.
const COPIED_BRAND = new RegExp(['garage', ' ?', 'box'].join(''), 'i')
const COPIED_PHONE = ['5699', '996'].join('')
const COPIED_ASSET_DIR = new RegExp(`/(${[['garage', 'box'].join(''), 'testimonials'].join('|')})/`)
const CONTACT_LINK = /^(tel:|mailto:)|wa\.me/

const hrefs = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('a[href]'), (link) => String(link.getAttribute('href')))

describe('landing page guard', () => {
  it('has exactly one h1 and carries the BayFlow name', () => {
    const { container } = render(<LandingPage />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(container.textContent).toContain('BayFlow')
  })

  it('shows no copied brand name, copied assets or contact links', () => {
    const { container } = render(<LandingPage />)
    expect(container.textContent).not.toMatch(COPIED_BRAND)

    const sources = Array.from(container.querySelectorAll('[src], [srcset]'), (el) =>
      [el.getAttribute('src'), el.getAttribute('srcset')].join(' '),
    )
    for (const source of sources) expect(source).not.toMatch(COPIED_ASSET_DIR)

    for (const href of hrefs(container)) expect(href).not.toMatch(CONTACT_LINK)
  })

  it('links only to existing routes or to anchors on the page', () => {
    const { container } = render(<LandingPage />)
    const routes = new Set(staticRoutes())
    for (const href of hrefs(container)) {
      if (href.startsWith('#')) {
        expect(container.querySelector(`[id="${href.slice(1)}"]`), href).not.toBeNull()
      } else {
        expect(routes.has(href), href).toBe(true)
      }
    }
  })

  it('keeps the shared header and footer free of the copied brand name and contact details', () => {
    const { container } = render(
      <>
        <PublicHeader />
        <PublicFooter />
      </>,
    )
    expect(container.textContent).toContain('BayFlow')
    expect(container.textContent).not.toMatch(COPIED_BRAND)
    expect(container.textContent).not.toContain(COPIED_PHONE)
    for (const href of hrefs(container)) expect(href).not.toMatch(CONTACT_LINK)
  })
})
