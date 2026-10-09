/**
 * Domain mock data store providing persistent, reactive state across all screens
 * following the specifications in .claude/specs/ (02-data-model, 08-booking-state-machine, 10-screens, 11-seed-data).
 */

import { BookingStatus } from './status'

export interface MockShop {
  id: string
  slug: string
  name: string
  city: string
  address: string
  phone: string
  rating: number | null
  slot_duration_minutes: number
  slot_capacity: number
  timezone: string
  is_listed: boolean
  working_hours: { day: string; hours: string; is_closed?: boolean }[]
}

export interface MockService {
  id: string
  shopId: string
  name: string
  description: string
  estimated_duration_minutes: number
  base_price: number | null
  is_active: boolean
}

export interface MockPart {
  id: string
  shopId: string
  sku: string
  name: string
  category: string
  on_hand: number
  reserved: number
  reorder_level: number
  unit_price: number
}

export interface MockPurchaseOrder {
  id: string
  po_number: string
  shopId: string
  supplier: string
  created_at: string
  status: 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED'
  items: { part_sku: string; part_name: string; quantity: number; unit_price: number }[]
  total_amount: number
}

export interface MockTeamMember {
  id: string
  shopId: string
  name: string
  email: string
  role: 'OWNER' | 'SERVICE_ADVISOR' | 'TECHNICIAN' | 'PARTS_PERSON' | 'QC_INSPECTOR'
  is_active: boolean
}

export interface MockEstimateItem {
  id: string
  description: string
  type: 'PART' | 'LABOR'
  quantity: number
  unit_price: number
  total: number
}

export interface MockBooking {
  id: string
  reference: string
  shopId: string
  shopSlug: string
  shopName: string
  customerName: string
  customerPhone: string
  customerEmail: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  licensePlate: string
  services: string[]
  scheduledDate: string
  scheduledTime: string
  status: BookingStatus
  assignedTechnicianId?: string
  assignedTechnicianName?: string
  assignedPartsPersonId?: string
  qcInspectorId?: string
  qcNotes?: string
  qcPassed?: boolean
  inspectionNotes?: string
  estimateItems: MockEstimateItem[]
  estimateTotal: number
  estimateApproved?: boolean
  paidAmount: number
  createdAt: string
  updatedAt: string
}

export const INITIAL_SHOPS: MockShop[] = [
  {
    id: 'shop-lahore-auto-care',
    slug: 'lahore-auto-care',
    name: 'Lahore Auto Care',
    city: 'Lahore',
    address: 'Plot 12, Main Boulevard, Gulberg III',
    phone: '+92 42 35789011',
    rating: 4.7,
    slot_duration_minutes: 60,
    slot_capacity: 2,
    timezone: 'Asia/Karachi',
    is_listed: true,
    working_hours: [
      { day: 'Monday', hours: '09:00 - 18:00' },
      { day: 'Tuesday', hours: '09:00 - 18:00' },
      { day: 'Wednesday', hours: '09:00 - 18:00' },
      { day: 'Thursday', hours: '09:00 - 18:00' },
      { day: 'Friday', hours: '09:00 - 18:00' },
      { day: 'Saturday', hours: '09:00 - 18:00' },
      { day: 'Sunday', hours: 'Closed', is_closed: true },
    ],
  },
  {
    id: 'shop-raza-auto-works',
    slug: 'raza-auto-works',
    name: 'Raza Auto Works',
    city: 'Lahore',
    address: 'Plot 8, Commercial Area, DHA Phase 6',
    phone: '+92 42 35891102',
    rating: null,
    slot_duration_minutes: 60,
    slot_capacity: 2,
    timezone: 'Asia/Karachi',
    is_listed: true,
    working_hours: [
      { day: 'Monday', hours: '10:00 - 19:00' },
      { day: 'Tuesday', hours: '10:00 - 19:00' },
      { day: 'Wednesday', hours: '10:00 - 19:00' },
      { day: 'Thursday', hours: '10:00 - 19:00' },
      { day: 'Friday', hours: '10:00 - 19:00' },
      { day: 'Saturday', hours: '10:00 - 19:00' },
      { day: 'Sunday', hours: 'Closed', is_closed: true },
    ],
  },
  {
    id: 'shop-clifton-car-clinic',
    slug: 'clifton-car-clinic',
    name: 'Clifton Car Clinic',
    city: 'Karachi',
    address: 'Shop 3, Block 5, Clifton',
    phone: '+92 21 35832011',
    rating: 4.5,
    slot_duration_minutes: 60,
    slot_capacity: 2,
    timezone: 'Asia/Karachi',
    is_listed: true,
    working_hours: [
      { day: 'Monday', hours: '10:00 - 19:00' },
      { day: 'Tuesday', hours: '10:00 - 19:00' },
      { day: 'Wednesday', hours: '10:00 - 19:00' },
      { day: 'Thursday', hours: '10:00 - 19:00' },
      { day: 'Friday', hours: '10:00 - 19:00' },
      { day: 'Saturday', hours: '10:00 - 19:00' },
      { day: 'Sunday', hours: 'Closed', is_closed: true },
    ],
  },
  {
    id: 'shop-margalla-motor-works',
    slug: 'margalla-motor-works',
    name: 'Margalla Motor Works',
    city: 'Islamabad',
    address: 'Plot 21, I-9 Markaz',
    phone: '+92 51 4432010',
    rating: 4.6,
    slot_duration_minutes: 60,
    slot_capacity: 2,
    timezone: 'Asia/Karachi',
    is_listed: true,
    working_hours: [
      { day: 'Monday', hours: '09:00 - 18:00' },
      { day: 'Tuesday', hours: '09:00 - 18:00' },
      { day: 'Wednesday', hours: '09:00 - 18:00' },
      { day: 'Thursday', hours: '09:00 - 18:00' },
      { day: 'Friday', hours: '09:00 - 18:00' },
      { day: 'Saturday', hours: '09:00 - 18:00' },
      { day: 'Sunday', hours: 'Closed', is_closed: true },
    ],
  },
  {
    id: 'shop-pindi-auto-garage',
    slug: 'pindi-auto-garage',
    name: 'Pindi Auto Garage',
    city: 'Rawalpindi',
    address: 'Shop 14, Murree Road, Satellite Town',
    phone: '+92 51 4851022',
    rating: 4.2,
    slot_duration_minutes: 60,
    slot_capacity: 2,
    timezone: 'Asia/Karachi',
    is_listed: true,
    working_hours: [
      { day: 'Monday', hours: '09:00 - 18:00' },
      { day: 'Tuesday', hours: '09:00 - 18:00' },
      { day: 'Wednesday', hours: '09:00 - 18:00' },
      { day: 'Thursday', hours: '09:00 - 18:00' },
      { day: 'Friday', hours: '09:00 - 18:00' },
      { day: 'Saturday', hours: '09:00 - 18:00' },
      { day: 'Sunday', hours: '10:00 - 14:00' },
    ],
  },
  {
    id: 'shop-lyallpur-motors',
    slug: 'lyallpur-motors',
    name: 'Lyallpur Motors',
    city: 'Faisalabad',
    address: 'Plot 5, Susan Road, Madina Town',
    phone: '+92 41 8541201',
    rating: 4.4,
    slot_duration_minutes: 60,
    slot_capacity: 2,
    timezone: 'Asia/Karachi',
    is_listed: true,
    working_hours: [
      { day: 'Monday', hours: '09:00 - 18:00' },
      { day: 'Tuesday', hours: '09:00 - 18:00' },
      { day: 'Wednesday', hours: '09:00 - 18:00' },
      { day: 'Thursday', hours: '09:00 - 18:00' },
      { day: 'Friday', hours: '09:00 - 18:00' },
      { day: 'Saturday', hours: '09:00 - 18:00' },
      { day: 'Sunday', hours: 'Closed', is_closed: true },
    ],
  },
]

export const INITIAL_SERVICES: MockService[] = [
  {
    id: 'srv-oil-change',
    shopId: 'shop-lahore-auto-care',
    name: 'Periodic Oil & Filter Service',
    description: 'Includes full synthetic 5W-30 motor oil change, genuine oil filter replacement, and 24-point safety check.',
    estimated_duration_minutes: 60,
    base_price: 4500,
    is_active: true,
  },
  {
    id: 'srv-brake-pads',
    shopId: 'shop-lahore-auto-care',
    name: 'Front Brake Pads Replacement',
    description: 'Inspection and replacement of front brake pads, caliper lubrication, and rotor surface inspection.',
    estimated_duration_minutes: 90,
    base_price: 8500,
    is_active: true,
  },
  {
    id: 'srv-computer-scan',
    shopId: 'shop-lahore-auto-care',
    name: 'Computer Diagnostic & OBD Scan',
    description: 'Full ECU health scan, reading check engine fault codes, sensor live data evaluation and diagnostic report.',
    estimated_duration_minutes: 45,
    base_price: 3000,
    is_active: true,
  },
  {
    id: 'srv-ac-service',
    shopId: 'shop-lahore-auto-care',
    name: 'AC Gas Top-up & Leak Inspection',
    description: 'Refrigerant pressure check, vacuum leak test, compressor performance evaluation, and evaporator cleaning.',
    estimated_duration_minutes: 60,
    base_price: 6000,
    is_active: true,
  },
  {
    id: 'srv-alignment',
    shopId: 'shop-lahore-auto-care',
    name: 'Wheel Alignment & Balancing',
    description: '4-wheel computerized laser alignment and dynamic tire balancing for smooth steering.',
    estimated_duration_minutes: 45,
    base_price: 2500,
    is_active: true,
  },
  {
    id: 'srv-tune-up',
    shopId: 'shop-lahore-auto-care',
    name: 'Engine Tune-Up & Spark Plugs',
    description: 'Throttle body cleaning, spark plug inspection/replacement, air filter clean, fuel injector treatment.',
    estimated_duration_minutes: 90,
    base_price: 7500,
    is_active: true,
  },
]

export const INITIAL_PARTS: MockPart[] = [
  {
    id: 'part-of-01',
    shopId: 'shop-lahore-auto-care',
    sku: 'OF-TY-01',
    name: 'Oil Filter Cartridge (Toyota/Honda)',
    category: 'Filters',
    on_hand: 10,
    reserved: 0,
    reorder_level: 5,
    unit_price: 1500,
  },
  {
    id: 'part-oil-01',
    shopId: 'shop-lahore-auto-care',
    sku: 'OIL-SYN-4L',
    name: 'Engine Oil 5W-30 Full Synthetic 4L',
    category: 'Fluids',
    on_hand: 8,
    reserved: 0,
    reorder_level: 4,
    unit_price: 6800,
  },
  {
    id: 'part-bp-01',
    shopId: 'shop-lahore-auto-care',
    sku: 'BP-FR-02',
    name: 'Semi-Metallic Front Brake Pads Set',
    category: 'Brakes',
    on_hand: 4,
    reserved: 1,
    reorder_level: 2,
    unit_price: 5500,
  },
  {
    id: 'part-br-01',
    shopId: 'shop-lahore-auto-care',
    sku: 'BR-VENT-01',
    name: 'Vented Brake Rotors Pair (Civic/Corolla)',
    category: 'Brakes',
    on_hand: 2,
    reserved: 0,
    reorder_level: 1,
    unit_price: 12000,
  },
  {
    id: 'part-sp-01',
    shopId: 'shop-lahore-auto-care',
    sku: 'SP-IRID-04',
    name: 'Iridium Spark Plugs Set of 4',
    category: 'Ignition',
    on_hand: 6,
    reserved: 0,
    reorder_level: 3,
    unit_price: 4200,
  },
  {
    id: 'part-af-01',
    shopId: 'shop-lahore-auto-care',
    sku: 'AF-CAB-01',
    name: 'Cabin Air Filter Anti-Bacterial',
    category: 'Filters',
    on_hand: 7,
    reserved: 0,
    reorder_level: 3,
    unit_price: 1800,
  },
]

export const INITIAL_PURCHASE_ORDERS: MockPurchaseOrder[] = [
  {
    id: 'po-1001',
    po_number: 'PO-2026-001',
    shopId: 'shop-lahore-auto-care',
    supplier: 'Pak Auto Spares Distributors',
    created_at: '2026-10-05T09:00:00Z',
    status: 'RECEIVED',
    items: [
      { part_sku: 'OF-TY-01', part_name: 'Oil Filter Cartridge', quantity: 15, unit_price: 1200 },
      { part_sku: 'BP-FR-02', part_name: 'Semi-Metallic Front Brake Pads Set', quantity: 6, unit_price: 4500 },
    ],
    total_amount: 45000,
  },
  {
    id: 'po-1002',
    po_number: 'PO-2026-002',
    shopId: 'shop-lahore-auto-care',
    supplier: 'Atlas Automotive Imports',
    created_at: '2026-10-08T14:30:00Z',
    status: 'ORDERED',
    items: [
      { part_sku: 'BR-VENT-01', part_name: 'Vented Brake Rotors Pair', quantity: 4, unit_price: 10500 },
      { part_sku: 'SP-IRID-04', part_name: 'Iridium Spark Plugs Set of 4', quantity: 8, unit_price: 3600 },
    ],
    total_amount: 70800,
  },
]

export const INITIAL_TEAM: MockTeamMember[] = [
  { id: 'usr-fatima', shopId: 'shop-lahore-auto-care', name: 'Fatima Raza', email: 'fatima.owner@bayflow.test', role: 'OWNER', is_active: true },
  { id: 'usr-bilal', shopId: 'shop-lahore-auto-care', name: 'Bilal', email: 'bilal.sa@bayflow.test', role: 'SERVICE_ADVISOR', is_active: true },
  { id: 'usr-imran', shopId: 'shop-lahore-auto-care', name: 'Imran', email: 'imran.tech@bayflow.test', role: 'TECHNICIAN', is_active: true },
  { id: 'usr-hamza', shopId: 'shop-lahore-auto-care', name: 'Hamza', email: 'hamza.tech@bayflow.test', role: 'TECHNICIAN', is_active: true },
  { id: 'usr-sara', shopId: 'shop-lahore-auto-care', name: 'Sara', email: 'sara.qc@bayflow.test', role: 'QC_INSPECTOR', is_active: true },
  { id: 'usr-hina', shopId: 'shop-lahore-auto-care', name: 'Hina', email: 'hina.qc@bayflow.test', role: 'QC_INSPECTOR', is_active: true },
  { id: 'usr-usman', shopId: 'shop-lahore-auto-care', name: 'Usman', email: 'usman.parts@bayflow.test', role: 'PARTS_PERSON', is_active: true },
]

export const INITIAL_BOOKINGS: MockBooking[] = [
  {
    id: 'bk-001',
    reference: 'BF-2026-001',
    shopId: 'shop-lahore-auto-care',
    shopSlug: 'lahore-auto-care',
    shopName: 'Lahore Auto Care',
    customerName: 'Ayesha Khan',
    customerPhone: '+92 300 9876543',
    customerEmail: 'ayesha.customer@bayflow.test',
    vehicleMake: 'Honda',
    vehicleModel: 'Civic Oriel',
    vehicleYear: 2022,
    licensePlate: 'LEA-22-4589',
    services: ['Periodic Oil & Filter Service', 'Front Brake Pads Replacement'],
    scheduledDate: '2026-10-09',
    scheduledTime: '10:00 am',
    status: 'IN_REPAIR',
    assignedTechnicianId: 'usr-imran',
    assignedTechnicianName: 'Imran',
    inspectionNotes: 'Brake pads worn to 2mm. Disc rotor surface has minor grooves. Oil level low by 0.5L.',
    estimateItems: [
      { id: 'est-1', description: 'Periodic Oil & Filter Service (Labor)', type: 'LABOR', quantity: 1, unit_price: 1500, total: 1500 },
      { id: 'est-2', description: 'Engine Oil 5W-30 Full Synthetic 4L', type: 'PART', quantity: 1, unit_price: 6800, total: 6800 },
      { id: 'est-3', description: 'Oil Filter Cartridge', type: 'PART', quantity: 1, unit_price: 1500, total: 1500 },
      { id: 'est-4', description: 'Front Brake Pads Set', type: 'PART', quantity: 1, unit_price: 5500, total: 5500 },
      { id: 'est-5', description: 'Brake Pads Installation & Bleeding', type: 'LABOR', quantity: 1, unit_price: 2000, total: 2000 },
    ],
    estimateTotal: 17300,
    estimateApproved: true,
    paidAmount: 0,
    createdAt: '2026-10-09T04:00:00Z',
    updatedAt: '2026-10-09T05:30:00Z',
  },
  {
    id: 'bk-002',
    reference: 'BF-2026-002',
    shopId: 'shop-lahore-auto-care',
    shopSlug: 'lahore-auto-care',
    shopName: 'Lahore Auto Care',
    customerName: 'Tariq Jamil',
    customerPhone: '+92 321 4455667',
    customerEmail: 'tariq.jamil@example.test',
    vehicleMake: 'Toyota',
    vehicleModel: 'Corolla Altis Grande',
    vehicleYear: 2021,
    licensePlate: 'LEE-21-9988',
    services: ['AC Gas Top-up & Leak Inspection', 'Computer Diagnostic & OBD Scan'],
    scheduledDate: '2026-10-09',
    scheduledTime: '11:00 am',
    status: 'AWAITING_CUSTOMER',
    assignedTechnicianId: 'usr-hamza',
    assignedTechnicianName: 'Hamza',
    inspectionNotes: 'AC condenser has minor dirt blockage. Refrigerant low. Fault code P0134 cleared.',
    estimateItems: [
      { id: 'est-6', description: 'AC Gas Top-up & Vacuum Test', type: 'LABOR', quantity: 1, unit_price: 6000, total: 6000 },
      { id: 'est-7', description: 'Cabin Filter Replacement', type: 'PART', quantity: 1, unit_price: 1800, total: 1800 },
      { id: 'est-8', description: 'Computer Diagnostic OBD Scan', type: 'LABOR', quantity: 1, unit_price: 3000, total: 3000 },
    ],
    estimateTotal: 10800,
    estimateApproved: false,
    paidAmount: 0,
    createdAt: '2026-10-09T05:00:00Z',
    updatedAt: '2026-10-09T06:15:00Z',
  },
  {
    id: 'bk-003',
    reference: 'BF-2026-003',
    shopId: 'shop-lahore-auto-care',
    shopSlug: 'lahore-auto-care',
    shopName: 'Lahore Auto Care',
    customerName: 'Zeeshan Ali',
    customerPhone: '+92 333 7788990',
    customerEmail: 'zeeshan.ali@example.test',
    vehicleMake: 'Kia',
    vehicleModel: 'Sportage AWD',
    vehicleYear: 2023,
    licensePlate: 'ICT-23-1022',
    services: ['Front Brake Pads Replacement'],
    scheduledDate: '2026-10-08',
    scheduledTime: '02:00 pm',
    status: 'QC_PENDING',
    assignedTechnicianId: 'usr-imran',
    assignedTechnicianName: 'Imran',
    inspectionNotes: 'Repair completed. Test drove vehicle. Brakes bedding in nicely.',
    estimateItems: [
      { id: 'est-9', description: 'Front Brake Pads Set', type: 'PART', quantity: 1, unit_price: 5500, total: 5500 },
      { id: 'est-10', description: 'Installation & Rotor Dressing', type: 'LABOR', quantity: 1, unit_price: 2500, total: 2500 },
    ],
    estimateTotal: 8000,
    estimateApproved: true,
    paidAmount: 0,
    createdAt: '2026-10-08T09:00:00Z',
    updatedAt: '2026-10-08T15:00:00Z',
  },
  {
    id: 'bk-004',
    reference: 'BF-2026-004',
    shopId: 'shop-lahore-auto-care',
    shopSlug: 'lahore-auto-care',
    shopName: 'Lahore Auto Care',
    customerName: 'Maria Saeed',
    customerPhone: '+92 312 6677889',
    customerEmail: 'maria.saeed@example.test',
    vehicleMake: 'Hyundai',
    vehicleModel: 'Tucson GLS',
    vehicleYear: 2022,
    licensePlate: 'LHE-22-3131',
    services: ['Periodic Oil & Filter Service'],
    scheduledDate: '2026-10-10',
    scheduledTime: '09:00 am',
    status: 'CONFIRMED',
    estimateItems: [],
    estimateTotal: 4500,
    paidAmount: 0,
    createdAt: '2026-10-09T02:00:00Z',
    updatedAt: '2026-10-09T03:00:00Z',
  },
  {
    id: 'bk-005',
    reference: 'BF-2026-005',
    shopId: 'shop-lahore-auto-care',
    shopSlug: 'lahore-auto-care',
    shopName: 'Lahore Auto Care',
    customerName: 'Usman Qureshi',
    customerPhone: '+92 301 2233445',
    customerEmail: 'usman.q@example.test',
    vehicleMake: 'Suzuki',
    vehicleModel: 'Swift GLX',
    vehicleYear: 2020,
    licensePlate: 'LEB-20-8800',
    services: ['Wheel Alignment & Balancing'],
    scheduledDate: '2026-10-08',
    scheduledTime: '10:00 am',
    status: 'READY_FOR_PICKUP',
    assignedTechnicianId: 'usr-hamza',
    assignedTechnicianName: 'Hamza',
    qcInspectorId: 'usr-sara',
    qcPassed: true,
    qcNotes: 'Laser alignment checked within factory camber/caster tolerance. Tire pressures calibrated to 32 PSI.',
    estimateItems: [
      { id: 'est-11', description: 'Laser Alignment & 4-Wheel Balancing', type: 'LABOR', quantity: 1, unit_price: 2500, total: 2500 },
    ],
    estimateTotal: 2500,
    estimateApproved: true,
    paidAmount: 0,
    createdAt: '2026-10-08T04:00:00Z',
    updatedAt: '2026-10-08T12:00:00Z',
  },
  {
    id: 'bk-006',
    reference: 'BF-2026-006',
    shopId: 'shop-lahore-auto-care',
    shopSlug: 'lahore-auto-care',
    shopName: 'Lahore Auto Care',
    customerName: 'Ayesha Khan',
    customerPhone: '+92 300 9876543',
    customerEmail: 'ayesha.customer@bayflow.test',
    vehicleMake: 'Toyota',
    vehicleModel: 'Yaris ATIV',
    vehicleYear: 2021,
    licensePlate: 'LEA-21-1234',
    services: ['Periodic Oil & Filter Service', 'Engine Tune-Up & Spark Plugs'],
    scheduledDate: '2026-10-06',
    scheduledTime: '01:00 pm',
    status: 'COMPLETED',
    assignedTechnicianId: 'usr-imran',
    assignedTechnicianName: 'Imran',
    qcInspectorId: 'usr-sara',
    qcPassed: true,
    qcNotes: 'Spark plugs torqued to spec. Engine runs smoothly. Oil pressure normal.',
    estimateItems: [
      { id: 'est-12', description: 'Engine Oil 5W-30 Full Synthetic 4L', type: 'PART', quantity: 1, unit_price: 6800, total: 6800 },
      { id: 'est-13', description: 'Oil Filter Cartridge', type: 'PART', quantity: 1, unit_price: 1500, total: 1500 },
      { id: 'est-14', description: 'Iridium Spark Plugs Set of 4', type: 'PART', quantity: 1, unit_price: 4200, total: 4200 },
      { id: 'est-15', description: 'Oil Change & Tune-up Labor', type: 'LABOR', quantity: 1, unit_price: 4000, total: 4000 },
    ],
    estimateTotal: 16500,
    estimateApproved: true,
    paidAmount: 16500,
    createdAt: '2026-10-06T08:00:00Z',
    updatedAt: '2026-10-06T16:00:00Z',
  },
]

// State Manager supporting browser persistence
export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(`bf:${key}`)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`bf:${key}`, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('bf:store-update', { detail: { key } }))
  } catch {
    // ignore
  }
}

// Data Accessors & Operations
export function getShops(): MockShop[] {
  return getStoredData('shops', INITIAL_SHOPS)
}

export function getShopBySlug(slug: string): MockShop | undefined {
  const shops = getShops()
  return shops.find((s) => s.slug === slug || s.id === slug)
}

export function getShopById(id: string): MockShop | undefined {
  const shops = getShops()
  return shops.find((s) => s.id === id || s.slug === id)
}

export function saveShop(updated: MockShop): void {
  const shops = getShops()
  const idx = shops.findIndex((s) => s.id === updated.id)
  if (idx >= 0) {
    shops[idx] = updated
  } else {
    shops.push(updated)
  }
  setStoredData('shops', shops)
}

export function getServices(shopId?: string): MockService[] {
  const services = getStoredData('services', INITIAL_SERVICES)
  if (shopId) {
    return services.filter((s) => s.shopId === shopId || s.shopId === 'shop-lahore-auto-care')
  }
  return services
}

export function saveService(service: MockService): void {
  const services = getServices()
  const idx = services.findIndex((s) => s.id === service.id)
  if (idx >= 0) {
    services[idx] = service
  } else {
    services.push(service)
  }
  setStoredData('services', services)
}

export function getBookings(shopId?: string): MockBooking[] {
  const bookings = getStoredData('bookings', INITIAL_BOOKINGS)
  if (shopId) {
    return bookings.filter((b) => b.shopId === shopId || b.shopSlug === shopId)
  }
  return bookings
}

export function getBookingById(id: string): MockBooking | undefined {
  const bookings = getBookings()
  return bookings.find((b) => b.id === id || b.reference === id)
}

export function saveBooking(booking: MockBooking): void {
  const bookings = getBookings()
  const idx = bookings.findIndex((b) => b.id === booking.id)
  booking.updatedAt = new Date().toISOString()
  if (idx >= 0) {
    bookings[idx] = booking
  } else {
    bookings.unshift(booking)
  }
  setStoredData('bookings', bookings)
}

export function getInventory(shopId?: string): MockPart[] {
  const parts = getStoredData('inventory', INITIAL_PARTS)
  if (shopId) {
    return parts.filter((p) => p.shopId === shopId || p.shopId === 'shop-lahore-auto-care')
  }
  return parts
}

export function savePart(part: MockPart): void {
  const parts = getInventory()
  const idx = parts.findIndex((p) => p.id === part.id || p.sku === part.sku)
  if (idx >= 0) {
    parts[idx] = part
  } else {
    parts.push(part)
  }
  setStoredData('inventory', parts)
}

export function adjustPartStock(partId: string, quantityDelta: number): MockPart | undefined {
  const parts = getInventory()
  const part = parts.find((p) => p.id === partId || p.sku === partId)
  if (part) {
    part.on_hand = Math.max(0, part.on_hand + quantityDelta)
    setStoredData('inventory', parts)
  }
  return part
}

export function getPurchaseOrders(shopId?: string): MockPurchaseOrder[] {
  const pos = getStoredData('purchase_orders', INITIAL_PURCHASE_ORDERS)
  if (shopId) {
    return pos.filter((p) => p.shopId === shopId || p.shopId === 'shop-lahore-auto-care')
  }
  return pos
}

export function savePurchaseOrder(po: MockPurchaseOrder): void {
  const pos = getPurchaseOrders()
  const idx = pos.findIndex((p) => p.id === po.id || p.po_number === po.po_number)
  if (idx >= 0) {
    pos[idx] = po
  } else {
    pos.unshift(po)
  }
  setStoredData('purchase_orders', pos)
}

export function getTeamMembers(shopId?: string): MockTeamMember[] {
  const team = getStoredData('team', INITIAL_TEAM)
  if (shopId) {
    return team.filter((t) => t.shopId === shopId || t.shopId === 'shop-lahore-auto-care')
  }
  return team
}

export function saveTeamMember(member: MockTeamMember): void {
  const team = getTeamMembers()
  const idx = team.findIndex((t) => t.id === member.id)
  if (idx >= 0) {
    team[idx] = member
  } else {
    team.push(member)
  }
  setStoredData('team', team)
}

export interface CurrentUserSession {
  name: string
  email: string
  role: 'OWNER' | 'SERVICE_ADVISOR' | 'TECHNICIAN' | 'PARTS_PERSON' | 'QC_INSPECTOR' | 'CUSTOMER'
  shopId: string
  shopName: string
}

export const DEFAULT_USER: CurrentUserSession = {
  name: 'Fatima Raza',
  email: 'fatima.owner@bayflow.test',
  role: 'OWNER',
  shopId: 'shop-lahore-auto-care',
  shopName: 'Lahore Auto Care',
}

export function getCurrentUser(): CurrentUserSession {
  return getStoredData('current_user', DEFAULT_USER)
}

export function setCurrentUser(user: CurrentUserSession): void {
  setStoredData('current_user', user)
  if (typeof document !== 'undefined') {
    document.cookie = `bf_session=active_${Date.now()}; path=/; max-age=86400`
  }
}

export function createBookingRecord(
  data: Omit<MockBooking, 'id' | 'reference' | 'createdAt' | 'updatedAt'>
): MockBooking {
  const randNum = Math.floor(100 + Math.random() * 900)
  const id = `bk-${Date.now()}`
  const reference = `BF-2026-${randNum}`

  const newBooking: MockBooking = {
    ...data,
    id,
    reference,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  saveBooking(newBooking)
  setCurrentUser({
    name: data.customerName,
    email: data.customerEmail,
    role: 'CUSTOMER',
    shopId: data.shopId,
    shopName: data.shopName,
  })

  return newBooking
}

