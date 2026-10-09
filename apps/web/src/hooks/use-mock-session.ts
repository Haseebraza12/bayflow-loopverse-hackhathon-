'use client'

import { useSyncExternalStore } from 'react'

/**
 * Mock sign-in state: login sets a readable `bf_session` cookie (lib/mock-auth). The real session
 * cookie is httpOnly and set by the API (D8); `GET /api/v1/me` replaces this hook.
 */
const SESSION_COOKIE = 'bf_session'

function subscribe(callback: () => void) {
  window.addEventListener('bf:store-update', callback)
  window.addEventListener('focus', callback)
  return () => {
    window.removeEventListener('bf:store-update', callback)
    window.removeEventListener('focus', callback)
  }
}

const hasSession = () =>
  document.cookie.split('; ').some((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))

/** True when someone is signed in (false while the server renders). */
export function useHasMockSession(): boolean {
  return useSyncExternalStore(subscribe, hasSession, () => false)
}

/** Signs out of the mock session; subscribers update right away. */
export function endMockSession(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`
  window.dispatchEvent(new CustomEvent('bf:store-update', { detail: { key: 'session' } }))
}
