import { readdirSync } from 'node:fs'
import path from 'node:path'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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
const COPIED_ASSET_DIR = new RegExp(`/${['garage', 'box'].join('')}/`)
const CONTACT_LINK = /^(tel:|mailto:)|wa\.me/
/** Rating-count claims such as "<n>+ reviews" or "5-Star Rated". */
const RATING_CLAIM = /\d+\s*\+?\s*reviews|star rated/i
/** Third-party review platforms and app stores: other companies' marks implying reviews or apps. */
const THIRD_PARTY_MARKS =
  /\b(Google|G2|Clutch|TrustRadius|Trustpilot|SoftwareSuggest)\b|app store|play store|google play/i

const hrefs = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('a[href]'), (link) => String(link.getAttribute('href')))

/** URL-decoded, so `/_next/image?url=%2Fdir%2Ffile` still reveals the asset path. */
const decode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/** Visible text plus the attributes that can carry copy or asset names. */
function pageCopy(container: HTMLElement) {
  const attributes = Array.from(
    container.querySelectorAll('[alt], [title], [src], [srcset]'),
    (el) =>
      ['alt', 'title', 'src', 'srcset']
        .map((name) => decode(el.getAttribute(name) ?? ''))
        .join(' '),
  )
  return [container.textContent ?? '', ...attributes].join('\n')
}

describe('landing page guard', () => {
  it('has exactly one h1 and carries the BayFlow name', () => {
    const { container } = render(<LandingPage />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(container.textContent).toContain('BayFlow')
  })

  it('shows no copied brand, copied assets, contact links, rating claims or third-party marks', () => {
    const { container } = render(<LandingPage />)
    const copy = pageCopy(container)
    expect(copy).not.toMatch(COPIED_BRAND)
    expect(copy).not.toContain(COPIED_PHONE)
    expect(copy).not.toMatch(COPIED_ASSET_DIR)
    expect(copy).not.toMatch(RATING_CLAIM)
    expect(copy).not.toMatch(THIRD_PARTY_MARKS)
    for (const href of hrefs(container)) expect(href).not.toMatch(CONTACT_LINK)
  })

  it('labels the testimonials as illustrative', () => {
    render(<LandingPage />)
    expect(screen.getByText('Illustrative stories, not real customers')).toBeVisible()
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

  it('sends nothing from the demo form and says so', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    render(<LandingPage />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Book a Demo' })[0]!)
    fireEvent.submit(screen.getByRole('button', { name: 'Confirm Demo Request' }).closest('form')!)

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'This is a demo' })).toBeVisible()
    expect(screen.getByText(/Nothing was sent/)).toBeVisible()
    expect(screen.getByRole('link', { name: 'Sign in with a demo account' })).toHaveAttribute(
      'href',
      '/login',
    )
    fetchSpy.mockRestore()
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
