'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useState, type FormEvent, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const EMPTY_FORM = { name: '', phone: '', email: '', garageName: '' }

/**
 * "Book a demo" on the landing page: the button that opens the demo-request dialog. Front-end
 * only for now; nothing is sent anywhere (there is no demo-request endpoint in the API).
 */
export function DemoRequestButton({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setSubmitted(false)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className={className}>
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:p-8">
        {submitted ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success-subtle text-success-ink">
              <Check aria-hidden="true" className="size-8" strokeWidth={3} />
            </div>
            <DialogHeader className="items-center pr-0 text-center">
              <DialogTitle className="text-2xl">Thanks for your request</DialogTitle>
              <DialogDescription className="text-center">
                We&apos;ll be in touch about a walkthrough for{' '}
                {form.garageName.trim() || 'your garage'}. In the meantime, you can explore the demo
                shop as any role.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex flex-col-reverse justify-center gap-2 sm:flex-row">
              <Button asChild variant="outline">
                <Link href="/login">Explore the demo shop</Link>
              </Button>
              <DialogClose asChild>
                <Button className="px-8">Done</Button>
              </DialogClose>
            </div>
          </div>
        ) : (
          <div>
            <DialogHeader>
              <p className="text-sm font-semibold text-brand-blue-ink">Book a demo</p>
              <DialogTitle className="text-2xl">See BayFlow with your garage in mind</DialogTitle>
              <DialogDescription>
                A walkthrough of online booking, estimates, parts and quality control, set up around
                how your workshop runs.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="mt-6">
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="demo-name">Full name</FieldLabel>
                  <Input
                    id="demo-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="e.g. Tariq Mehmood"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="demo-phone">Phone</FieldLabel>
                    <Input
                      id="demo-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+92 300 0000000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="demo-email">
                      Work e-mail <span className="font-normal text-helper">(optional)</span>
                    </FieldLabel>
                    <Input
                      id="demo-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="demo-garage">Garage or workshop name</FieldLabel>
                  <Input
                    id="demo-garage"
                    name="garageName"
                    required
                    autoComplete="organization"
                    placeholder="e.g. Lahore Auto Care"
                    value={form.garageName}
                    onChange={(e) => setForm({ ...form, garageName: e.target.value })}
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" size="lg" className="mt-6 w-full">
                Request a demo
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
