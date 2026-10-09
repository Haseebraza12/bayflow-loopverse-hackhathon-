/**
 * Small decorative product mock-ups for the landing page "Garage Management Software" cards.
 * Purely illustrative: everything is aria-hidden and the data is sample data.
 */

const panel = 'rounded-xl bg-white shadow-sm ring-1 ring-neutral-200'

function Workflow() {
  const cols = [
    { name: 'Inspecting', jobs: ['Civic · Brakes', 'Corolla · AC'] },
    { name: 'In repair', jobs: ['Alto · Clutch'] },
    { name: 'Ready', jobs: ['City · Service'] },
  ]
  return (
    <div className="flex w-full gap-2">
      {cols.map((c) => (
        <div key={c.name} className="flex-1 rounded-lg bg-white/70 p-1.5 ring-1 ring-neutral-200">
          <p className="px-1 pb-1.5 text-[9px] font-semibold tracking-wide text-neutral-400 uppercase">
            {c.name}
          </p>
          <div className="space-y-1.5">
            {c.jobs.map((j) => (
              <div
                key={j}
                className="rounded-md bg-white px-1.5 py-1.5 text-[10px] text-neutral-700 shadow-sm ring-1 ring-neutral-200"
              >
                {j}
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
    <div className={`${panel} w-full max-w-[220px] p-3`}>
      <p className="text-[10px] font-semibold text-neutral-400">EST-2041 · Honda Civic</p>
      {[
        ['Brake pads (front)', '8,500'],
        ['Labour · 1.5 h', '3,000'],
      ].map(([item, price]) => (
        <div key={item} className="mt-2 flex justify-between text-[11px] text-neutral-700">
          <span>{item}</span>
          <span className="tabular-nums">{price}</span>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 text-[11px] font-semibold text-neutral-900">
        <span>Total</span>
        <span className="tabular-nums">Rs 11,500</span>
      </div>
      <div className="mt-3 rounded-md bg-neutral-900 py-1.5 text-center text-[11px] font-semibold text-white">
        Approve estimate
      </div>
    </div>
  )
}

function Inventory() {
  const items = [
    { name: 'Oil filter', stock: 82, low: false },
    { name: 'Brake pads', stock: 18, low: true },
    { name: 'Spark plugs', stock: 64, low: false },
  ]
  return (
    <div className={`${panel} w-full max-w-[230px] space-y-2.5 p-3`}>
      {items.map((i) => (
        <div key={i.name}>
          <div className="flex justify-between text-[10px] text-neutral-600">
            <span>{i.name}</span>
            <span className={i.low ? 'font-semibold text-[#e8590c]' : 'text-neutral-400'}>
              {i.low ? 'Low' : `${i.stock}%`}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-neutral-100">
            <div
              className={`h-full rounded-full ${i.low ? 'bg-[#e8590c]' : 'bg-neutral-800'}`}
              style={{ width: `${i.stock}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Inspections() {
  const checks = [
    { name: 'Tyres', state: 'Good', dot: 'bg-[#00c070]' },
    { name: 'Brake pads', state: 'Replace', dot: 'bg-red-500' },
    { name: 'Battery', state: 'Watch', dot: 'bg-amber-400' },
  ]
  return (
    <div className={`${panel} w-full max-w-[220px] p-1.5`}>
      {checks.map((c) => (
        <div
          key={c.name}
          className="flex items-center gap-2 border-b border-neutral-100 px-2 py-2 text-[11px] last:border-0"
        >
          <span className={`size-2 rounded-full ${c.dot}`} />
          <span className="flex-1 text-neutral-700">{c.name}</span>
          <span className="text-neutral-400">{c.state}</span>
        </div>
      ))}
    </div>
  )
}

function Packages() {
  return (
    <div className="relative h-[120px] w-full max-w-[220px]">
      <div className={`${panel} absolute inset-x-6 top-0 h-16 opacity-60`} />
      <div className={`${panel} absolute inset-x-3 top-3 h-16 opacity-80`} />
      <div className={`${panel} absolute inset-x-0 top-6 p-3`}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-neutral-900">Full Service</p>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-700">
            Rs 9,999
          </span>
        </div>
        <p className="mt-1.5 text-[10px] text-neutral-400">Oil · Filters · 30-point check</p>
      </div>
    </div>
  )
}

function Procurement() {
  const orders = [
    { po: 'PO-118', vendor: 'Atlas Parts', status: 'Received', tone: 'text-[#00c070]' },
    { po: 'PO-119', vendor: 'Lahore Spares', status: 'Ordered', tone: 'text-[#1047FA]' },
    { po: 'PO-120', vendor: 'AutoHub', status: 'Draft', tone: 'text-neutral-400' },
  ]
  return (
    <div className={`${panel} w-full max-w-[230px] p-1.5`}>
      {orders.map((o) => (
        <div
          key={o.po}
          className="flex items-center gap-2 border-b border-neutral-100 px-2 py-2 text-[11px] last:border-0"
        >
          <span className="font-semibold text-neutral-900">{o.po}</span>
          <span className="flex-1 truncate text-neutral-500">{o.vendor}</span>
          <span className={`font-semibold ${o.tone}`}>{o.status}</span>
        </div>
      ))}
    </div>
  )
}

const ART = {
  Workflow,
  Estimates,
  Inventory,
  'Vehicle Inspections': Inspections,
  'Packaged Services': Packages,
  Procurement,
} as const

export type CapabilityTitle = keyof typeof ART

export function CapabilityArt({ title }: { title: CapabilityTitle }) {
  const Art = ART[title]
  return (
    <div aria-hidden="true" className="flex h-full w-full items-center justify-center p-5">
      <Art />
    </div>
  )
}
