'use client'

import { Check, Copy, CornerDownLeft } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DEMO_ACCOUNTS,
  DEMO_AHMED_NOTE,
  DEMO_PASSWORD,
  type DemoAccount,
} from '@/content/demo-accounts'
import { cn } from '@/lib/utils'

/** Each role wears the hue of the booking phase it works on (spec 09 §3.3). */
const ROLE_TONE: Record<string, string> = {
  Owner: 'bg-brand-blue text-brand-blue-foreground',
  'Service Advisor': 'bg-status-estimate-bg text-status-estimate-fg',
  Technician: 'bg-status-inspection-bg text-status-inspection-fg',
  'QC Inspector': 'bg-status-repair-qc-bg text-status-repair-qc-fg',
  'Parts Person': 'bg-status-parts-bg text-status-parts-fg',
  Customer: 'bg-status-handover-bg text-status-handover-fg',
  'Platform Admin': 'bg-foreground text-background',
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export interface DemoAccountsPanelProps {
  /** Fills the login form with the account's e-mail and the shared password (D52: no auto-login). */
  onPick: (account: DemoAccount) => void
  /** The e-mail currently in the form, to mark the matching account. */
  selectedEmail?: string
}

/** Demo credentials (spec 09 §4.12, D52): plain-text accounts; picking one only fills the form. */
export function DemoAccountsPanel({ onPick, selectedEmail }: DemoAccountsPanelProps) {
  const [copied, setCopied] = useState(false)

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_PASSWORD)
      setCopied(true)
      toast.success('Demo password copied')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(`Copy failed. The password is ${DEMO_PASSWORD}`)
    }
  }

  return (
    <section aria-labelledby="demo-accounts-title" className="border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-faint p-4">
        <div className="space-y-0.5">
          <h2 id="demo-accounts-title" className="text-sm font-semibold text-foreground">
            Demo accounts
          </h2>
          <p className="text-xs text-muted-foreground">
            Pick an account to fill the form, then log in.
          </p>
        </div>
        <button
          type="button"
          onClick={copyPassword}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-foreground transition-colors duration-[70ms] ease-productive hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={`Copy the demo password ${DEMO_PASSWORD}`}
        >
          {DEMO_PASSWORD}
          {copied ? (
            <Check className="size-3.5 text-success-ink" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5 text-helper" aria-hidden="true" />
          )}
        </button>
      </div>

      <ul className="grid gap-1 p-2 sm:grid-cols-2">
        {DEMO_ACCOUNTS.map((account) => {
          const selected = account.email === selectedEmail
          return (
            <li key={account.email}>
              <button
                type="button"
                onClick={() => onPick(account)}
                aria-pressed={selected}
                aria-label={`Use ${account.name}, ${account.role}`}
                className={cn(
                  'group flex w-full items-center gap-3 border p-2.5 text-left transition-colors duration-[70ms] ease-productive focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                  selected
                    ? 'border-brand-blue bg-brand-blue-subtle'
                    : 'border-transparent hover:bg-layer-hover',
                )}
              >
                <Avatar className="size-9 after:hidden">
                  <AvatarFallback
                    className={cn('text-xs font-semibold', ROLE_TONE[account.role] ?? '')}
                  >
                    {initials(account.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {account.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {account.role}
                  </span>
                  {account.note && (
                    <span className="mt-0.5 block text-[11px] leading-snug text-helper">
                      {account.note}
                    </span>
                  )}
                </span>
                <CornerDownLeft
                  aria-hidden="true"
                  className={cn(
                    'size-4 shrink-0 text-brand-blue-ink transition-opacity duration-[70ms]',
                    selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>

      <p className="border-t border-border-faint px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {DEMO_AHMED_NOTE}
      </p>
    </section>
  )
}
