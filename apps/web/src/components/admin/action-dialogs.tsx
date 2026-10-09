'use client'

import { CircleAlert } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { AdminActionError } from '@/lib/mock-admin'

const REASON_MIN = 5
const REASON_MAX = 500

/** Runs an admin action and turns the API's refusals into the dialog's error (spec 19 §1). */
function attempt(run: () => void, success: string): string | null {
  try {
    run()
    toast.success(success)
    return null
  } catch (error) {
    if (error instanceof AdminActionError) return error.message
    throw error
  }
}

/**
 * A restricting action that needs a written reason (suspend a shop, deactivate an account): the
 * consequences are listed before the reason field, and the dialog stays open until it succeeds.
 */
export function ReasonDialog({
  trigger,
  title,
  description,
  consequences,
  warning,
  confirmLabel,
  success,
  onConfirm,
}: {
  trigger: ReactNode
  title: string
  description: string
  consequences: ReadonlyArray<string>
  warning?: string | null
  confirmLabel: string
  success: string
  onConfirm: (reason: string) => void
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const length = reason.trim().length
  const tooShort = length < REASON_MIN

  const confirm = () => {
    if (tooShort || length > REASON_MAX) {
      setError(`Give a reason of ${REASON_MIN} to ${REASON_MAX} characters.`)
      return
    }
    const refused = attempt(() => onConfirm(reason), success)
    if (refused) {
      setError(refused)
      return
    }
    setOpen(false)
    setReason('')
    setError(null)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setError(null)
      }}
    >
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {consequences.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {warning && (
          <Alert variant="warning">
            <CircleAlert aria-hidden="true" />
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}
        <Field data-invalid={Boolean(error)}>
          <FieldLabel htmlFor={`${id}-reason`}>Reason</FieldLabel>
          <Textarea
            id={`${id}-reason`}
            value={reason}
            onChange={(event) => {
              setReason(event.target.value)
              setError(null)
            }}
            maxLength={REASON_MAX}
            rows={3}
            placeholder="Recorded in the audit log and shown to other admins"
            aria-invalid={Boolean(error)}
            aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`}
          />
          <FieldDescription id={`${id}-help`}>
            {REASON_MIN} to {REASON_MAX} characters · {length}/{REASON_MAX}
          </FieldDescription>
          {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={confirm}>
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** A reversible action that needs only a confirmation (reactivate, grant or revoke admin). */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  success,
  destructive = false,
  onConfirm,
}: {
  trigger: ReactNode
  title: string
  description: string
  confirmLabel: string
  success: string
  destructive?: boolean
  onConfirm: () => void
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const confirm = () => {
    const refused = attempt(onConfirm, success)
    if (refused) {
      setError(refused)
      return
    }
    setOpen(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setError(null)
      }}
    >
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            className={
              destructive
                ? undefined
                : 'bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-hover'
            }
            onClick={confirm}
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
