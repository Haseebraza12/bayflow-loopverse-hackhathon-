'use client'

import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('bf:store-update', callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener('bf:store-update', callback)
    window.removeEventListener('storage', callback)
  }
}

export function useMockStore<T>(getter: () => T): T {
  return useSyncExternalStore(subscribe, getter, getter)
}
