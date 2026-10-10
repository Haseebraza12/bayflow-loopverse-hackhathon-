/**
 * Small product mock-ups for the landing page's "Garage management software" cards. Purely
 * illustrative (everything is aria-hidden) and drawn from the seed data: the brief's worked
 * example, Lahore Auto Care's service catalogue and the seeded purchase orders (spec 11).
 * Text is 12px at the smallest; colours are tokens.
 */

const panel = 'rounded-xl bg-card shadow-sm ring-1 ring-border'

function Workflow() {
  const cols = [
    {
      name: 'Inspecting',
      jobs: [
        ['Civic', 'Brakes'],
        ['Corolla', 'AC'],
      ],
    },
    { name: 'In repair', jobs: [['Cultus', 'Oil']] },
    { name: 'Ready', jobs: [['City', 'Tires']] },
  ]
  return (
    <div className="flex w-full max-w-[280px] gap-1.5">
      {cols.map((c) => (
        <div key={c.name} className="min-w-0 flex-1 rounded-lg bg-card/70 p-1 ring-1 ring-border">
          <p className="truncate px-1 pt-0.5 pb-1 text-xs font-semibold text-helper">{c.name}</p>
          <div className="space-y-1.5">
            {c.jobs.map(([car, job]) => (
              <div
                key={car}
                className="rounded-md bg-card px-1.5 py-1 text-xs leading-snug shadow-sm ring-1 ring-border"
              >
                <p className="truncate font-medium text-foreground">{car}</p>
                <p className="truncate text-helper">{job}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Estimates() {
  return (
    <div className={`${panel} w-full max-w-[230px] p-3 text-xs`}>
      <p className="font-medium text-helper">Estimate · Honda Civic</p>
      {[
        ['Brake pads (front)', '8,500'],
        ['Labour', '3,000'],
      ].map(([item, price]) => (
        <div key={item} className="mt-1.5 flex justify-between gap-2 text-muted-foreground">
          <span className="truncate">{item}</span>
          <span className="tabular-nums">{price}</span>
        </div>
      ))}
      <div className="mt-1.5 flex justify-between border-t border-border-faint pt-1.5 font-semibold text-foreground">
        <span>Total</span>
        <span className="tabular-nums">Rs 11,500</span>
      </div>
      <div className="mt-2 rounded-full bg-brand-blue py-1 text-center font-semibold text-brand-blue-foreground">
        Approve estimate
      </div>
    </div>
  )
}

function Inventory() {
  const items = [
    { name: 'Oil filter', label: '10 in stock', fill: 'w-4/5', low: false },
    { name: 'Front brake pads', label: 'Low', fill: 'w-1/5', low: true },
    { name: 'Engine oil 4 L', label: '8 in stock', fill: 'w-3/5', low: false },
  ]
  return (
    <div className={`${panel} w-full max-w-[240px] space-y-2 p-3 text-xs`}>
      {items.map((i) => (
        <div key={i.name}>
          <div className="flex justify-between gap-2 text-muted-foreground">
            <span className="truncate">{i.name}</span>
            <span className={i.low ? 'font-semibold text-cta' : 'text-helper'}>{i.label}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-secondary">
            <div
              className={`h-full rounded-full ${i.fill} ${i.low ? 'bg-brand-orange' : 'bg-foreground/80'}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function QualityControl() {
  const checks = [
    { name: 'Road test', state: 'Pass', dot: 'bg-brand-green-accent', ink: 'text-success-ink' },
    {
      name: 'No warning lights',
      state: 'Pass',
      dot: 'bg-brand-green-accent',
      ink: 'text-success-ink',
    },
    { name: 'No leaks', state: 'Fail', dot: 'bg-destructive', ink: 'text-danger-ink' },
  ]
  return (
    <div className={`${panel} w-full max-w-[230px] p-1.5 text-xs`}>
      {checks.map((c) => (
        <div
          key={c.name}
          className="flex items-center gap-2 border-b border-border-faint px-2 py-1.5 last:border-0"
        >
          <span className={`size-2 shrink-0 rounded-full ${c.dot}`} />
          <span className="flex-1 truncate text-muted-foreground">{c.name}</span>
          <span className={`font-medium ${c.ink}`}>{c.state}</span>
        </div>
      ))}
    </div>
  )
}

function ServiceCatalogue() {
  return (
    <div className="relative h-[112px] w-full max-w-[230px]">
      <div className={`${panel} absolute inset-x-6 top-0 h-16 opacity-60`} />
      <div className={`${panel} absolute inset-x-3 top-3 h-16 opacity-80`} />
      <div className={`${panel} absolute inset-x-0 top-6 p-3 text-xs`}>
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-foreground">Oil change</p>
          <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold whitespace-nowrap text-muted-foreground">
            from Rs 1,000
          </span>
        </div>
        <p className="mt-1.5 text-helper">≈ 45 min · parts on the estimate</p>
      </div>
    </div>
  )
}

function PurchaseOrders() {
  const orders = [
    { po: 'PO-SEED01', status: 'Received', tone: 'text-success-ink' },
    { po: 'PO-SEED02', status: 'Partly received', tone: 'text-warning-ink' },
    { po: 'PO-7KQ2MX', status: 'Ordered', tone: 'text-brand-blue-ink' },
  ]
  return (
    <div className={`${panel} w-full max-w-[230px] p-1.5 text-xs`}>
      <p className="px-2 pt-1 pb-1.5 font-medium text-helper">City Auto Parts</p>
      {orders.map((o) => (
        <div
          key={o.po}
          className="flex items-center justify-between gap-2 border-t border-border-faint px-2 py-1.5"
        >
          <span className="font-mono font-semibold text-foreground">{o.po}</span>
          <span className={`font-semibold ${o.tone}`}>{o.status}</span>
        </div>
      ))}
    </div>
  )
}

const ART = {
  workflow: Workflow,
  estimates: Estimates,
  inventory: Inventory,
  'quality-control': QualityControl,
  services: ServiceCatalogue,
  'purchase-orders': PurchaseOrders,
} as const

export type CapabilityKind = keyof typeof ART

export function CapabilityArt({ kind }: { kind: CapabilityKind }) {
  const Art = ART[kind]
  return (
    <div aria-hidden="true" className="flex h-full w-full items-center justify-center p-4">
      <Art />
    </div>
  )
}
