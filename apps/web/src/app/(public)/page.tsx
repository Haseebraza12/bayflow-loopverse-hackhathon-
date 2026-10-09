import { CalendarCheck, CarFront, Store, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

const HOW_IT_WORKS: ReadonlyArray<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Store, title: 'Choose a shop', text: 'Compare services, prices and opening hours.' },
  {
    icon: CalendarCheck,
    title: 'Pick a time',
    text: 'Only free slots are shown — no phone calls.',
  },
  {
    icon: CarFront,
    title: 'Track and approve',
    text: 'Approve the estimate online and follow your car live.',
  },
]

/** P-01 Landing (spec 10). The shop directory (E-06, E-07) arrives with the public-shops feature. */
export default function LandingPage() {
  return (
    <>
      <section className="border-b-4 border-brand-orange bg-brand-navy text-nav-foreground">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-brand-orange-on-dark uppercase">
            Auto repair, without the phone calls
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Book trusted car repair in minutes
          </h1>
          <p className="max-w-2xl text-lg text-nav-muted">
            Pick a shop and a time, approve your estimate online and track your car live.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="cta" size="lg" className="h-11 px-5">
              <Link href="/book">Book a service</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 border-nav-muted bg-transparent px-5 text-nav-foreground hover:bg-nav-hover hover:text-nav-foreground"
            >
              <Link href="#shops">Find a shop</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="how-it-works"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2 id="how-it-works" className="text-xl font-semibold">
          How it works
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <step.icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="font-semibold">
                  {index + 1}. {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="shops"
        aria-labelledby="all-shops"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-12 sm:px-6 lg:px-8"
      >
        <h2 id="all-shops" className="text-xl font-semibold">
          All shops
        </h2>
        <Empty className="mt-6 border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Store aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>The shop directory is coming soon</EmptyTitle>
            <EmptyDescription>
              Listed shops, their cities, ratings and services will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>

      <section className="bg-muted">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-lg font-semibold text-brand-navy">
            Own a garage? Run bookings, estimates, parts and QC in one place.
          </p>
          <Button asChild variant="outline">
            <Link href="/register">Register your shop</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
