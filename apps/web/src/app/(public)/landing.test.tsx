import { readdirSync } from 'node:fs'
import path from 'node:path'

import { fireEvent, render, screen } from '@testing-library/react'
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

function renderPublicShell() {
  return render(
    <>
      <PublicHeader />
      <main>
        <LandingPage />
      </main>
      <PublicFooter />
    </>,
  )
}

describe('landing page with the public header and footer', () => {
  it('has one h1 and never skips a heading level', () => {
    const { container } = renderPublicShell()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    const levels = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'), (heading) =>
      Number(heading.tagName.slice(1)),
    )
    levels.reduce((previous, level) => {
      expect(level).toBeLessThanOrEqual(previous + 1)
      return level
    }, 0)
  })

  it('links only to routes that exist or to sections of the landing page', () => {
    const { container } = renderPublicShell()
    const routes = new Set(staticRoutes())
    const hrefs = Array.from(container.querySelectorAll('a[href]'), (link) =>
      String(link.getAttribute('href')),
    )

    expect(hrefs.length).toBeGreaterThan(0)
    for (const href of hrefs) {
      if (href.startsWith('/#')) {
        expect(container.querySelector(`[id="${href.slice(2)}"]`), href).not.toBeNull()
      } else {
        expect(routes.has(href), href).toBe(true)
      }
    }
  })

  it('sends car owners to the booking wizard and garages to owner sign-up', () => {
    render(<LandingPage />)
    for (const link of screen.getAllByRole('link', { name: 'Find a garage' })) {
      expect(link).toHaveAttribute('href', '/book')
    }
    for (const link of screen.getAllByRole('link', { name: 'List your garage' })) {
      expect(link).toHaveAttribute('href', '/register')
    }
  })

  it('carries only the BayFlow brand and no image assets', () => {
    const { container } = renderPublicShell()
    expect(container.textContent).not.toMatch(/garage ?box/i)
    expect(container.querySelectorAll('img')).toHaveLength(0)
    expect(screen.getByText('© 2026 BayFlow')).toBeInTheDocument()
  })
})

describe('PublicHeader Features menu', () => {
  it('opens on click, and Escape closes it and returns focus to its button', () => {
    render(<PublicHeader />)
    const button = screen.getByRole('button', { name: 'Features' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: /^Online booking/ })).toBeVisible()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveFocus()
  })
})
