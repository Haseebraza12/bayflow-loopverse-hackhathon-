import { beforeEach, describe, expect, it } from 'vitest'

import {
  DEFAULT_USER,
  INITIAL_BOOKINGS,
  INITIAL_PARTS,
  adjustPartStock,
  getBookingById,
  getBookings,
  getCurrentUser,
  getInventory,
  getPurchaseOrders,
  getServices,
  getShopById,
  getShopBySlug,
  getShops,
  getTeamMembers,
  readSeedSnapshot,
  saveBooking,
  savePurchaseOrder,
  saveService,
  saveShop,
  saveTeamMember,
  setCurrentUser,
} from './mock-data'

const SHOP_ID = 'shop-lahore-auto-care'

/** Every read the screens hand to `useMockStore` as a useSyncExternalStore snapshot. */
const SNAPSHOT_READS: ReadonlyArray<[string, () => unknown]> = [
  ['getCurrentUser()', () => getCurrentUser()],
  ['getShops()', () => getShops()],
  ['getShopBySlug(slug)', () => getShopBySlug('lahore-auto-care')],
  ['getShopById(id)', () => getShopById(SHOP_ID)],
  ['getServices()', () => getServices()],
  ['getServices(shopId)', () => getServices(SHOP_ID)],
  ['getBookings()', () => getBookings()],
  ['getBookings(shopId)', () => getBookings(SHOP_ID)],
  ['getBookingById(id)', () => getBookingById('bk-001')],
  ['getInventory()', () => getInventory()],
  ['getInventory(shopId)', () => getInventory(SHOP_ID)],
  ['getPurchaseOrders()', () => getPurchaseOrders()],
  ['getPurchaseOrders(shopId)', () => getPurchaseOrders(SHOP_ID)],
  ['getTeamMembers()', () => getTeamMembers()],
  ['getTeamMembers(shopId)', () => getTeamMembers(SHOP_ID)],
]

/** One write per stored key, so every read above then comes from localStorage. */
function writeEveryKey() {
  saveShop({ ...getShopById(SHOP_ID)!, phone: '+92 42 0000000' })
  const service = getServices(SHOP_ID)[0]!
  saveService({ ...service, description: `${service.description} (edited)` })
  saveBooking({ ...getBookingById('bk-001')!, status: 'QC_PENDING' })
  adjustPartStock('part-of-01', 1)
  savePurchaseOrder({ ...getPurchaseOrders(SHOP_ID)[0]!, supplier: 'Test Supplier' })
  const member = getTeamMembers(SHOP_ID)[0]!
  saveTeamMember({ ...member, name: `${member.name} (edited)` })
  setCurrentUser({ ...DEFAULT_USER, name: 'Imran', role: 'TECHNICIAN' })
}

beforeEach(() => {
  localStorage.clear()
})

describe('mock store snapshots are referentially stable', () => {
  it.each(SNAPSHOT_READS)('%s: same reference on repeated seed reads', (_, read) => {
    expect(read()).toBeDefined()
    expect(Object.is(read(), read())).toBe(true)
  })

  it.each(SNAPSHOT_READS)('%s: same reference on repeated stored reads', (_, read) => {
    writeEveryKey()
    expect(read()).toBeDefined()
    expect(Object.is(read(), read())).toBe(true)
  })

  it.each(SNAPSHOT_READS)('%s: same reference on repeated server-snapshot reads', (_, read) => {
    writeEveryKey()
    expect(Object.is(readSeedSnapshot(read), readSeedSnapshot(read))).toBe(true)
  })
})

describe('mock store writes publish new snapshots', () => {
  /** `act(n)` writes data unique to round `n`; `changed(n)` checks the reads now show it. */
  const WRITES: ReadonlyArray<{
    write: string
    reads: ReadonlyArray<() => unknown>
    act: (n: number) => void
    changed: (n: number) => boolean
  }> = [
    {
      write: 'saveShop',
      reads: [getShops, () => getShopById(SHOP_ID), () => getShopBySlug('lahore-auto-care')],
      act: (n) => saveShop({ ...getShopById(SHOP_ID)!, phone: `+92 42 000000${n}` }),
      changed: (n) => getShopById(SHOP_ID)?.phone === `+92 42 000000${n}`,
    },
    {
      write: 'saveService',
      reads: [() => getServices(), () => getServices(SHOP_ID)],
      act: (n) => saveService({ ...getServices(SHOP_ID)[0]!, name: `Edited service ${n}` }),
      changed: (n) => getServices(SHOP_ID)[0]?.name === `Edited service ${n}`,
    },
    {
      write: 'saveBooking',
      reads: [() => getBookings(), () => getBookings(SHOP_ID), () => getBookingById('bk-001')],
      act: (n) => saveBooking({ ...getBookingById('bk-001')!, inspectionNotes: `Note ${n}` }),
      changed: (n) => getBookingById('bk-001')?.inspectionNotes === `Note ${n}`,
    },
    {
      write: 'adjustPartStock',
      reads: [() => getInventory(), () => getInventory(SHOP_ID)],
      act: () => adjustPartStock('part-of-01', 3),
      changed: (n) =>
        getInventory(SHOP_ID).find((p) => p.id === 'part-of-01')?.on_hand ===
        INITIAL_PARTS.find((p) => p.id === 'part-of-01')!.on_hand + 3 * n,
    },
    {
      write: 'savePurchaseOrder',
      reads: [() => getPurchaseOrders(), () => getPurchaseOrders(SHOP_ID)],
      act: (n) =>
        savePurchaseOrder({ ...getPurchaseOrders(SHOP_ID)[0]!, supplier: `Supplier ${n}` }),
      changed: (n) => getPurchaseOrders(SHOP_ID)[0]?.supplier === `Supplier ${n}`,
    },
    {
      write: 'saveTeamMember',
      reads: [() => getTeamMembers(), () => getTeamMembers(SHOP_ID)],
      act: (n) => saveTeamMember({ ...getTeamMembers(SHOP_ID)[0]!, name: `Member ${n}` }),
      changed: (n) => getTeamMembers(SHOP_ID)[0]?.name === `Member ${n}`,
    },
    {
      write: 'setCurrentUser',
      reads: [getCurrentUser],
      act: (n) => setCurrentUser({ ...DEFAULT_USER, name: `User ${n}` }),
      changed: (n) => getCurrentUser().name === `User ${n}`,
    },
  ]

  it.each(WRITES)('$write: reads return a new reference holding the new data', (entry) => {
    // Round 1 writes over the seed data, round 2 over data already stored by round 1.
    for (const n of [1, 2]) {
      const before = entry.reads.map((read) => read())
      entry.act(n)
      entry.reads.forEach((read, i) => expect(read(), `write ${n}, read #${i}`).not.toBe(before[i]))
      expect(entry.changed(n), `write ${n}`).toBe(true)
    }
  })

  it('never mutates the previous snapshot or the seed data', () => {
    const seedPart = INITIAL_PARTS.find((p) => p.id === 'part-of-01')!
    const onHand = seedPart.on_hand
    const before = getInventory(SHOP_ID)

    adjustPartStock('part-of-01', 5)
    saveBooking({ ...INITIAL_BOOKINGS[0]!, id: 'bk-new', reference: 'BF-NEW' })

    expect(before.find((p) => p.id === 'part-of-01')?.on_hand).toBe(onHand)
    expect(seedPart.on_hand).toBe(onHand)
    expect(getInventory(SHOP_ID).find((p) => p.id === 'part-of-01')?.on_hand).toBe(onHand + 5)
    expect(INITIAL_BOOKINGS.some((b) => b.id === 'bk-new')).toBe(false)
    expect(getBookingById('bk-new')?.reference).toBe('BF-NEW')
  })

  it('picks up a write made in another tab', () => {
    const before = getBookings(SHOP_ID)
    const changed = INITIAL_BOOKINGS.map((b) =>
      b.id === 'bk-004' ? { ...b, status: 'CANCELLED' as const } : b,
    )
    localStorage.setItem('bf:bookings', JSON.stringify(changed)) // what another tab's write leaves

    const after = getBookings(SHOP_ID)
    expect(after).not.toBe(before)
    expect(after.find((b) => b.id === 'bk-004')?.status).toBe('CANCELLED')
    expect(getBookings(SHOP_ID)).toBe(after)
  })

  it('serves seed data as the server snapshot, whatever is stored', () => {
    writeEveryKey()
    expect(readSeedSnapshot(getCurrentUser)).toBe(DEFAULT_USER)
    expect(readSeedSnapshot(() => getBookingById('bk-001'))).toBe(
      INITIAL_BOOKINGS.find((b) => b.id === 'bk-001'),
    )
    expect(getCurrentUser().role).toBe('TECHNICIAN')
  })
})
