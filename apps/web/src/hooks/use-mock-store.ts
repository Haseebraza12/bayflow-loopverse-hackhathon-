'use client'

import { useRef, useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('bf:store-update', callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener('bf:store-update', callback)
    window.removeEventListener('storage', callback)
  }
}

/**
 * Mock getters parse localStorage and filter, so each call returns a new object. React's
 * `useSyncExternalStore` requires a stable snapshot, so the last value is reused while its
 * contents are unchanged (otherwise the component re-renders forever).
 */
export function useMockStore<T>(getter: () => T): T {
  const last = useRef<{ key: string; value: T } | null>(null)
  const getSnapshot = () => {
    const value = getter()
    const key = JSON.stringify(value) ?? 'undefined'
    if (last.current && last.current.key === key) return last.current.value
    last.current = { key, value }
    return value
  }
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
