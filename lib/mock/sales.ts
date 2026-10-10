// lib/mock/sales.ts
// ~180 realistic sales over April–October 2026 for Mittal Communication CRM demo

import { MOCK_PRODUCTS } from './products'
import { MOCK_CUSTOMERS } from './customers'

// ─── Types ────────────────────────────────────────────────────────────────────

export type MockSaleItem = {
  product_id: string
  product_name: string
  brand: string
  category: string
  variant: string | null // '8GB/256GB, Black' for phones
  quantity: number
  price_before_gst: number
  discount_amount: number
  gst_rate: number
  taxable_value: number // (price - discount) * qty
  gst_amount: number // taxable_value * gst_rate/100
  line_total: number // taxable_value + gst_amount
  imeis: string[] // only for phones
}

export type MockPayment = {
  method: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Finance' | 'Other'
  amount: number
}

export type MockSale = {
  id: string // SALE-000001
  invoice_number: string // MC/26-27/00001
  customer_id: string | null
  customer_name: string | null // null for walk-ins
  customer_phone: string | null
  salesperson_id: string
  salesperson_name: string
  items: MockSaleItem[]
  payments: MockPayment[]
  taxable_value: number
  cgst: number
  sgst: number
  round_off: number
  total: number
  status: 'completed' | 'cancelled'
  cancellation_reason: string | null
  created_at: string // IST timestamp
  is_paper_bill: boolean
  paper_bill_number: string | null
}

// ─── Seed helpers ─────────────────────────────────────────────────────────────

let _imeiSeq = 355000000000000

function nextImei(): string {
  _imeiSeq += Math.floor(Math.random() * 7 + 1)
  return String(_imeiSeq)
}

function makeItem(
  productId: string,
  qty: number,
  discountAmount: number,
  variantOverride?: string,
): MockSaleItem {
  const p = MOCK_PRODUCTS.find((x) => x.id === productId)!
  const basePrice = p.default_price ?? 0
  const taxableValue = (basePrice - discountAmount) * qty
  const gstAmount = Math.round(taxableValue * (p.gst_rate / 100))
  const lineTotal = taxableValue + gstAmount

  const phoneVariants = [
    '6GB/128GB, Starlight White',
    '8GB/128GB, Midnight Black',
    '8GB/256GB, Titanium Grey',
    '12GB/256GB, Deep Purple',
    '8GB/256GB, Champagne Gold',
    '12GB/512GB, Pearl White',
    '6GB/128GB, Sky Blue',
  ]

  const variant =
    variantOverride ?? (p.requires_imei ? phoneVariants[Math.floor(Math.random() * phoneVariants.length)] : null)

  const imeis: string[] = []
  if (p.requires_imei) {
    for (let i = 0; i < qty; i++) {
      imeis.push(nextImei())
    }
  }

  return {
    product_id: p.id,
    product_name: p.name,
    brand: p.brand,
    category: p.category,
    variant,
    quantity: qty,
    price_before_gst: basePrice,
    discount_amount: discountAmount,
    gst_rate: p.gst_rate,
    taxable_value: taxableValue,
    gst_amount: gstAmount,
    line_total: lineTotal,
    imeis,
  }
}

function makePayments(total: number, methods: Array<{ method: MockPayment['method']; fraction: number }>): MockPayment[] {
  let remaining = total
  const payments: MockPayment[] = []
  for (let i = 0; i < methods.length; i++) {
    const isLast = i === methods.length - 1
    const amount = isLast ? remaining : Math.round(total * methods[i].fraction)
    remaining -= amount
    if (amount > 0) {
      payments.push({ method: methods[i].method, amount })
    }
  }
  return payments
}

function summarize(items: MockSaleItem[]): {
  taxable_value: number
  cgst: number
  sgst: number
  round_off: number
  total: number
} {
  const taxable_value = items.reduce((s, i) => s + i.taxable_value, 0)
  const gst_total = items.reduce((s, i) => s + i.gst_amount, 0)
  const cgst = Math.round(gst_total / 2)
  const sgst = gst_total - cgst
  const rawTotal = taxable_value + gst_total
  const total = Math.round(rawTotal)
  const round_off = parseFloat((total - rawTotal).toFixed(2))
  return { taxable_value, cgst, sgst, round_off, total }
}

// ─── Salesperson pool ─────────────────────────────────────────────────────────
const SAKSHAM = { id: 'demo-admin-001', name: 'Saksham Sharma' }
const RAHUL = { id: 'sp-002', name: 'Rahul Verma' }

// ─── Raw sale definitions ─────────────────────────────────────────────────────
// Format: [invoiceSeq, isoDate, custId|null, salesperson, items[], paymentMethods[], status, isPaper]

interface RawSaleDef {
  seq: number
  date: string
  custId: string | null
  sp: { id: string; name: string }
  itemDefs: Array<{ pid: string; qty: number; disc: number; variant?: string }>
  payDef: Array<{ method: MockPayment['method']; fraction: number }>
  status: 'completed' | 'cancelled'
  cancelReason?: string
  isPaper: boolean
  paperNum?: string
}

const RAW_SALES: RawSaleDef[] = [
  // ── April 2026 ──────────────────────────────────────────────────────────────
  { seq: 1, date: '2026-04-01T10:15:00+05:30', custId: 'cust-b001', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 2, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 2, date: '2026-04-01T12:30:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 200 }, { pid: 'prod-cg-001', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-001' },
  { seq: 3, date: '2026-04-02T09:45:00+05:30', custId: 'cust-b004', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-003', qty: 3, disc: 700 }], payDef: [{ method: 'UPI', fraction: 0.5 }, { method: 'Bank Transfer', fraction: 0.5 }], status: 'completed', isPaper: false },
  { seq: 4, date: '2026-04-02T14:00:00+05:30', custId: 'cust-001', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 5, date: '2026-04-03T11:00:00+05:30', custId: 'cust-b010', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-007', qty: 4, disc: 600 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 6, date: '2026-04-03T15:30:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ch-002', qty: 1, disc: 0 }, { pid: 'prod-ep-001', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-002' },
  { seq: 7, date: '2026-04-04T10:00:00+05:30', custId: 'cust-021', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-005', qty: 1, disc: 1500, variant: '8GB/256GB, Midnight Black' }], payDef: [{ method: 'Card', fraction: 0.5 }, { method: 'UPI', fraction: 0.5 }], status: 'completed', isPaper: false },
  { seq: 8, date: '2026-04-05T13:00:00+05:30', custId: 'cust-005', sp: RAHUL, itemDefs: [{ pid: 'prod-ch-004', qty: 2, disc: 0 }, { pid: 'prod-ca-001', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-003' },
  { seq: 9, date: '2026-04-05T17:00:00+05:30', custId: 'cust-b002', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-008', qty: 2, disc: 800 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 10, date: '2026-04-06T11:30:00+05:30', custId: 'cust-040', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-008', qty: 1, disc: 600 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 11, date: '2026-04-07T10:00:00+05:30', custId: 'cust-009', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-004', qty: 1, disc: 300 }, { pid: 'prod-ep-002', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 12, date: '2026-04-08T15:00:00+05:30', custId: 'cust-019', sp: RAHUL, itemDefs: [{ pid: 'prod-ch-001', qty: 1, disc: 0 }, { pid: 'prod-cg-003', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-004' },
  { seq: 13, date: '2026-04-09T09:30:00+05:30', custId: 'cust-b010', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 5, disc: 300 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 14, date: '2026-04-10T14:00:00+05:30', custId: 'cust-002', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-005', qty: 1, disc: 2000, variant: '8GB/256GB, Desert Titanium' }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 15, date: '2026-04-11T16:30:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 400 }, { pid: 'prod-cg-001', qty: 2, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-005' },
  { seq: 16, date: '2026-04-12T11:00:00+05:30', custId: 'cust-046', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 1, disc: 500 }, { pid: 'prod-ch-007', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 17, date: '2026-04-14T13:00:00+05:30', custId: 'cust-b001', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-002', qty: 5, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 18, date: '2026-04-15T10:30:00+05:30', custId: 'cust-003', sp: RAHUL, itemDefs: [{ pid: 'prod-ch-005', qty: 2, disc: 0 }, { pid: 'prod-ca-002', qty: 2, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 19, date: '2026-04-16T14:00:00+05:30', custId: 'cust-017', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 20, date: '2026-04-17T09:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-012', qty: 1, disc: 300 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-006' },
  { seq: 21, date: '2026-04-18T11:30:00+05:30', custId: 'cust-017', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-007', qty: 1, disc: 300 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 22, date: '2026-04-18T16:00:00+05:30', custId: 'cust-b004', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-006', qty: 2, disc: 600 }, { pid: 'prod-cg-002', qty: 2, disc: 0 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 23, date: '2026-04-19T10:00:00+05:30', custId: 'cust-029', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-011', qty: 1, disc: 500 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 24, date: '2026-04-20T13:30:00+05:30', custId: 'cust-004', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 1, disc: 200 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'cancelled', cancelReason: 'Customer changed mind — opted for OnePlus instead', isPaper: false },
  { seq: 25, date: '2026-04-20T15:00:00+05:30', custId: 'cust-004', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-004', qty: 1, disc: 200 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 26, date: '2026-04-21T11:00:00+05:30', custId: 'cust-b003', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 2, disc: 700 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 27, date: '2026-04-22T14:00:00+05:30', custId: 'cust-009', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-003', qty: 1, disc: 600 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 28, date: '2026-04-24T09:30:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ep-003', qty: 1, disc: 0 }, { pid: 'prod-cg-004', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-007' },
  { seq: 29, date: '2026-04-25T12:00:00+05:30', custId: 'cust-b005', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 8, disc: 200 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 30, date: '2026-04-26T17:00:00+05:30', custId: 'cust-007', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 200 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 31, date: '2026-04-27T10:30:00+05:30', custId: 'cust-044', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 32, date: '2026-04-28T13:00:00+05:30', custId: 'cust-b010', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-001', qty: 3, disc: 500 }, { pid: 'prod-ch-007', qty: 3, disc: 0 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 33, date: '2026-04-29T15:30:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 400 }, { pid: 'prod-cg-002', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 0.5 }, { method: 'UPI', fraction: 0.5 }], status: 'completed', isPaper: true, paperNum: 'PB-008' },
  { seq: 34, date: '2026-04-30T11:00:00+05:30', custId: 'cust-021', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-004', qty: 1, disc: 300 }, { pid: 'prod-ep-002', qty: 1, disc: 0 }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  // ── May 2026 ────────────────────────────────────────────────────────────────
  { seq: 35, date: '2026-05-01T10:00:00+05:30', custId: 'cust-b006', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-005', qty: 5, disc: 1500, variant: '8GB/256GB, Midnight Black' }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 36, date: '2026-05-02T13:30:00+05:30', custId: 'cust-006', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-001', qty: 1, disc: 600 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 37, date: '2026-05-03T16:00:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ch-003', qty: 1, disc: 0 }, { pid: 'prod-ch-006', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-009' },
  { seq: 38, date: '2026-05-04T11:00:00+05:30', custId: 'cust-016', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-005', qty: 1, disc: 2000, variant: '8GB/256GB, White Titanium' }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 39, date: '2026-05-05T14:30:00+05:30', custId: 'cust-b004', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-003', qty: 4, disc: 700 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 40, date: '2026-05-06T10:00:00+05:30', custId: 'cust-011', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-003', qty: 1, disc: 500 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 41, date: '2026-05-07T09:00:00+05:30', custId: 'cust-030', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 3, disc: 400 }], payDef: [{ method: 'Bank Transfer', fraction: 0.6 }, { method: 'Cash', fraction: 0.4 }], status: 'completed', isPaper: false },
  { seq: 42, date: '2026-05-07T15:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ep-004', qty: 1, disc: 200 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-010' },
  { seq: 43, date: '2026-05-08T10:30:00+05:30', custId: 'cust-b007', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 6, disc: 200 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 44, date: '2026-05-09T13:00:00+05:30', custId: 'cust-023', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 2, disc: 400 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 45, date: '2026-05-10T16:30:00+05:30', custId: 'cust-027', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 1, disc: 500 }, { pid: 'prod-ep-002', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 46, date: '2026-05-11T11:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-012', qty: 1, disc: 200 }, { pid: 'prod-cg-001', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'cancelled', cancelReason: 'Payment failed — UPI transaction error', isPaper: false },
  { seq: 47, date: '2026-05-12T10:00:00+05:30', custId: 'cust-b010', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-006', qty: 5, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 48, date: '2026-05-13T14:00:00+05:30', custId: 'cust-020', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-005', qty: 1, disc: 1800, variant: '8GB/256GB, Midnight Black' }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 49, date: '2026-05-14T09:30:00+05:30', custId: 'cust-032', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 50, date: '2026-05-15T17:00:00+05:30', custId: 'cust-b001', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-002', qty: 3, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 51, date: '2026-05-16T12:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ch-005', qty: 1, disc: 0 }, { pid: 'prod-ca-001', qty: 2, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-011' },
  { seq: 52, date: '2026-05-17T10:00:00+05:30', custId: 'cust-018', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-002', qty: 3, disc: 400 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 53, date: '2026-05-18T14:30:00+05:30', custId: 'cust-030', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 2, disc: 400 }], payDef: [{ method: 'UPI', fraction: 0.5 }, { method: 'Cash', fraction: 0.5 }], status: 'completed', isPaper: false },
  { seq: 54, date: '2026-05-19T11:30:00+05:30', custId: 'cust-039', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-005', qty: 1, disc: 2000, variant: '8GB/256GB, Desert Titanium' }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 55, date: '2026-05-20T09:00:00+05:30', custId: 'cust-008', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-003', qty: 2, disc: 600 }, { pid: 'prod-ch-004', qty: 2, disc: 0 }], payDef: [{ method: 'Bank Transfer', fraction: 0.7 }, { method: 'UPI', fraction: 0.3 }], status: 'completed', isPaper: false },
  { seq: 56, date: '2026-05-21T14:00:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ep-001', qty: 2, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-012' },
  { seq: 57, date: '2026-05-22T10:30:00+05:30', custId: 'cust-050', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 58, date: '2026-05-23T16:00:00+05:30', custId: 'cust-b002', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-008', qty: 3, disc: 800 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 59, date: '2026-05-24T11:00:00+05:30', custId: 'cust-013', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-011', qty: 1, disc: 600 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 60, date: '2026-05-25T14:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-013' },
  { seq: 61, date: '2026-05-26T10:00:00+05:30', custId: 'cust-b003', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 1, disc: 500 }, { pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 62, date: '2026-05-27T13:30:00+05:30', custId: 'cust-035', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 63, date: '2026-05-28T09:00:00+05:30', custId: 'cust-023', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }, { pid: 'prod-ep-003', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 64, date: '2026-05-29T15:00:00+05:30', custId: 'cust-b004', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 5, disc: 600 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 65, date: '2026-05-30T11:30:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-cg-003', qty: 1, disc: 0 }, { pid: 'prod-cg-001', qty: 2, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-014' },
  { seq: 66, date: '2026-05-31T17:00:00+05:30', custId: 'cust-021', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-004', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'cancelled', cancelReason: 'Wrong variant ordered — customer will revisit', isPaper: false },
  // ── June 2026 ───────────────────────────────────────────────────────────────
  { seq: 67, date: '2026-06-01T10:00:00+05:30', custId: 'cust-b006', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-008', qty: 3, disc: 800 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 68, date: '2026-06-02T13:00:00+05:30', custId: 'cust-001', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 69, date: '2026-06-03T11:30:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 300 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-015' },
  { seq: 70, date: '2026-06-04T14:00:00+05:30', custId: 'cust-b010', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-003', qty: 4, disc: 700 }, { pid: 'prod-ch-004', qty: 4, disc: 0 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 71, date: '2026-06-05T09:00:00+05:30', custId: 'cust-022', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-011', qty: 1, disc: 500 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 72, date: '2026-06-06T17:00:00+05:30', custId: 'cust-047', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 2, disc: 100 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 73, date: '2026-06-07T10:30:00+05:30', custId: 'cust-010', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-012', qty: 1, disc: 200 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 74, date: '2026-06-08T14:00:00+05:30', custId: 'cust-032', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 2, disc: 400 }, { pid: 'prod-ep-001', qty: 2, disc: 0 }], payDef: [{ method: 'UPI', fraction: 0.5 }, { method: 'Cash', fraction: 0.5 }], status: 'completed', isPaper: false },
  { seq: 75, date: '2026-06-09T11:00:00+05:30', custId: 'cust-b002', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-005', qty: 2, disc: 2000, variant: '8GB/256GB, White Titanium' }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 76, date: '2026-06-10T15:30:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ep-002', qty: 1, disc: 100 }, { pid: 'prod-cg-001', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-016' },
  { seq: 77, date: '2026-06-11T09:00:00+05:30', custId: 'cust-009', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-004', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 78, date: '2026-06-12T12:00:00+05:30', custId: 'cust-042', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 79, date: '2026-06-13T14:30:00+05:30', custId: 'cust-b007', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 5, disc: 200 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 80, date: '2026-06-14T16:00:00+05:30', custId: 'cust-045', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 81, date: '2026-06-15T10:00:00+05:30', custId: 'cust-012', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ep-001', qty: 1, disc: 0 }, { pid: 'prod-cg-002', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 82, date: '2026-06-16T13:30:00+05:30', custId: 'cust-b004', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-001', qty: 3, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 83, date: '2026-06-17T11:00:00+05:30', custId: 'cust-036', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-007', qty: 1, disc: 200 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 84, date: '2026-06-18T15:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 400 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'cancelled', cancelReason: 'Stock issue — phone colour not available', isPaper: false },
  { seq: 85, date: '2026-06-18T17:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 400 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-017' },
  { seq: 86, date: '2026-06-19T09:30:00+05:30', custId: 'cust-011', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-008', qty: 1, disc: 700 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 87, date: '2026-06-20T14:00:00+05:30', custId: 'cust-028', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 400 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 88, date: '2026-06-21T10:30:00+05:30', custId: 'cust-b001', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-002', qty: 4, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 89, date: '2026-06-22T16:00:00+05:30', custId: 'cust-048', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 3, disc: 100 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 90, date: '2026-06-23T11:00:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ch-001', qty: 2, disc: 0 }, { pid: 'prod-ca-001', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-018' },
  { seq: 91, date: '2026-06-24T14:30:00+05:30', custId: 'cust-b008', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-005', qty: 2, disc: 2000, variant: '8GB/256GB, Desert Titanium' }, { pid: 'prod-ph-001', qty: 1, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 92, date: '2026-06-25T09:30:00+05:30', custId: 'cust-018', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 93, date: '2026-06-26T12:00:00+05:30', custId: 'cust-037', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 2, disc: 100 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 94, date: '2026-06-27T17:30:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 1, disc: 200 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-019' },
  { seq: 95, date: '2026-06-28T10:00:00+05:30', custId: 'cust-b010', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 4, disc: 600 }, { pid: 'prod-ch-007', qty: 4, disc: 0 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 96, date: '2026-06-29T13:00:00+05:30', custId: 'cust-016', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-005', qty: 1, disc: 2000, variant: '8GB/256GB, White Titanium' }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 97, date: '2026-06-30T16:00:00+05:30', custId: 'cust-b006', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-008', qty: 5, disc: 900 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  // ── July 2026 ───────────────────────────────────────────────────────────────
  { seq: 98, date: '2026-07-01T10:00:00+05:30', custId: 'cust-024', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 99, date: '2026-07-02T13:30:00+05:30', custId: 'cust-b004', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-003', qty: 5, disc: 700 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 100, date: '2026-07-03T11:00:00+05:30', custId: 'cust-041', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }, { pid: 'prod-ep-003', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 101, date: '2026-07-04T17:00:00+05:30', custId: 'cust-013', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-011', qty: 1, disc: 600 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 102, date: '2026-07-05T10:30:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ep-004', qty: 1, disc: 200 }, { pid: 'prod-ca-002', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-020' },
  { seq: 103, date: '2026-07-06T14:00:00+05:30', custId: 'cust-b001', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 3, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 104, date: '2026-07-07T09:00:00+05:30', custId: 'cust-043', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 105, date: '2026-07-08T16:30:00+05:30', custId: 'cust-033', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-003', qty: 1, disc: 600 }, { pid: 'prod-cg-001', qty: 2, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 106, date: '2026-07-09T11:00:00+05:30', custId: 'cust-b010', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 4, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 107, date: '2026-07-10T13:30:00+05:30', custId: 'cust-015', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 108, date: '2026-07-11T17:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 300 }], payDef: [{ method: 'Cash', fraction: 0.4 }, { method: 'UPI', fraction: 0.6 }], status: 'completed', isPaper: true, paperNum: 'PB-021' },
  { seq: 109, date: '2026-07-12T10:00:00+05:30', custId: 'cust-014', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 400 }, { pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 110, date: '2026-07-13T14:00:00+05:30', custId: 'cust-b002', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-008', qty: 2, disc: 800 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 111, date: '2026-07-14T11:30:00+05:30', custId: 'cust-048', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 2, disc: 100 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 112, date: '2026-07-15T09:00:00+05:30', custId: 'cust-025', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-011', qty: 1, disc: 600 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 113, date: '2026-07-16T16:00:00+05:30', custId: 'cust-037', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 114, date: '2026-07-17T12:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ch-003', qty: 2, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-022' },
  { seq: 115, date: '2026-07-18T15:30:00+05:30', custId: 'cust-b004', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 4, disc: 600 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 116, date: '2026-07-19T10:00:00+05:30', custId: 'cust-044', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 117, date: '2026-07-20T13:00:00+05:30', custId: 'cust-015', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 118, date: '2026-07-21T17:00:00+05:30', custId: 'cust-b010', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-003', qty: 3, disc: 700 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 119, date: '2026-07-22T11:30:00+05:30', custId: 'cust-006', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }], payDef: [{ method: 'Card', fraction: 1 }], status: 'cancelled', cancelReason: 'Returned — manufacturing defect reported within 24h', isPaper: false },
  { seq: 120, date: '2026-07-22T14:00:00+05:30', custId: 'cust-006', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 121, date: '2026-07-23T09:00:00+05:30', custId: 'cust-021', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-004', qty: 1, disc: 300 }, { pid: 'prod-ep-002', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 122, date: '2026-07-24T16:00:00+05:30', custId: 'cust-b001', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-007', qty: 3, disc: 400 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 123, date: '2026-07-25T11:00:00+05:30', custId: 'cust-026', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }, { pid: 'prod-ch-004', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 124, date: '2026-07-26T13:30:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ep-003', qty: 1, disc: 100 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-023' },
  { seq: 125, date: '2026-07-27T10:00:00+05:30', custId: 'cust-b003', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-001', qty: 2, disc: 600 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 126, date: '2026-07-28T15:00:00+05:30', custId: 'cust-043', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 1, disc: 600 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 127, date: '2026-07-29T09:00:00+05:30', custId: 'cust-b007', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 3, disc: 100 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 128, date: '2026-07-30T17:00:00+05:30', custId: 'cust-038', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 129, date: '2026-07-31T12:00:00+05:30', custId: 'cust-b008', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-008', qty: 1, disc: 800 }, { pid: 'prod-ph-001', qty: 1, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  // ── August 2026 ─────────────────────────────────────────────────────────────
  { seq: 130, date: '2026-08-01T11:00:00+05:30', custId: 'cust-031', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 131, date: '2026-08-02T14:30:00+05:30', custId: 'cust-b010', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 5, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 132, date: '2026-08-03T10:00:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 300 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-024' },
  { seq: 133, date: '2026-08-04T13:00:00+05:30', custId: 'cust-033', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 400 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 134, date: '2026-08-05T09:30:00+05:30', custId: 'cust-b001', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-003', qty: 3, disc: 700 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 135, date: '2026-08-06T15:00:00+05:30', custId: 'cust-019', sp: RAHUL, itemDefs: [{ pid: 'prod-ch-006', qty: 1, disc: 0 }, { pid: 'prod-cg-004', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 136, date: '2026-08-07T11:30:00+05:30', custId: 'cust-029', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 1, disc: 500 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 137, date: '2026-08-08T17:00:00+05:30', custId: 'cust-b004', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-002', qty: 4, disc: 500 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 138, date: '2026-08-09T10:00:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-012', qty: 1, disc: 200 }, { pid: 'prod-ep-001', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-025' },
  { seq: 139, date: '2026-08-10T13:30:00+05:30', custId: 'cust-004', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 1, disc: 200 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 140, date: '2026-08-11T11:00:00+05:30', custId: 'cust-b009', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 1, disc: 500 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 141, date: '2026-08-12T16:30:00+05:30', custId: 'cust-048', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 2, disc: 100 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 142, date: '2026-08-13T09:00:00+05:30', custId: 'cust-b010', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-003', qty: 3, disc: 700 }, { pid: 'prod-ch-004', qty: 3, disc: 0 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 143, date: '2026-08-14T14:00:00+05:30', custId: 'cust-016', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-005', qty: 1, disc: 2000, variant: '8GB/256GB, Desert Titanium' }], payDef: [{ method: 'Card', fraction: 1 }], status: 'cancelled', cancelReason: 'Customer requested refund — model found cheaper elsewhere', isPaper: false },
  { seq: 144, date: '2026-08-15T10:00:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 400 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-026' },
  { seq: 145, date: '2026-08-15T14:00:00+05:30', custId: 'cust-021', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 146, date: '2026-08-16T17:00:00+05:30', custId: 'cust-027', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-008', qty: 1, disc: 800 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 147, date: '2026-08-17T11:30:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ep-002', qty: 2, disc: 100 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-027' },
  { seq: 148, date: '2026-08-18T09:00:00+05:30', custId: 'cust-b002', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 4, disc: 600 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 149, date: '2026-08-19T13:00:00+05:30', custId: 'cust-040', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-011', qty: 1, disc: 600 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 150, date: '2026-08-20T15:30:00+05:30', custId: 'cust-b005', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-009', qty: 4, disc: 300 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 151, date: '2026-08-21T10:00:00+05:30', custId: 'cust-045', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 400 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 152, date: '2026-08-22T16:00:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-007', qty: 1, disc: 200 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-028' },
  { seq: 153, date: '2026-08-23T11:00:00+05:30', custId: 'cust-034', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 154, date: '2026-08-24T14:00:00+05:30', custId: 'cust-b004', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-003', qty: 3, disc: 700 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 155, date: '2026-08-25T09:30:00+05:30', custId: 'cust-007', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 1, disc: 100 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  // ── September 2026 ──────────────────────────────────────────────────────────
  { seq: 156, date: '2026-09-01T10:00:00+05:30', custId: 'cust-b010', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 5, disc: 600 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 157, date: '2026-09-02T13:30:00+05:30', custId: 'cust-005', sp: RAHUL, itemDefs: [{ pid: 'prod-ch-001', qty: 1, disc: 0 }, { pid: 'prod-cg-003', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 158, date: '2026-09-03T11:00:00+05:30', custId: 'cust-001', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 159, date: '2026-09-04T15:00:00+05:30', custId: 'cust-b001', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 3, disc: 400 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 160, date: '2026-09-05T09:00:00+05:30', custId: 'cust-020', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-005', qty: 1, disc: 2000, variant: '8GB/256GB, Midnight Black' }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 161, date: '2026-09-06T17:00:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 300 }, { pid: 'prod-cg-002', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-029' },
  { seq: 162, date: '2026-09-07T11:30:00+05:30', custId: 'cust-b009', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 163, date: '2026-09-08T14:00:00+05:30', custId: 'cust-035', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-008', qty: 1, disc: 700 }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 164, date: '2026-09-09T10:30:00+05:30', custId: 'cust-017', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-003', qty: 1, disc: 600 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 165, date: '2026-09-10T13:00:00+05:30', custId: 'cust-011', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 166, date: '2026-09-11T16:00:00+05:30', custId: 'cust-b004', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 4, disc: 600 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 167, date: '2026-09-12T09:30:00+05:30', custId: 'cust-009', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 168, date: '2026-09-13T12:00:00+05:30', custId: null, sp: SAKSHAM, itemDefs: [{ pid: 'prod-ep-004', qty: 1, disc: 300 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-030' },
  { seq: 169, date: '2026-09-14T17:30:00+05:30', custId: 'cust-001', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-002', qty: 1, disc: 400 }, { pid: 'prod-ep-003', qty: 1, disc: 0 }], payDef: [{ method: 'Card', fraction: 0.7 }, { method: 'Cash', fraction: 0.3 }], status: 'completed', isPaper: false },
  { seq: 170, date: '2026-09-15T10:00:00+05:30', custId: 'cust-018', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 171, date: '2026-09-18T09:00:00+05:30', custId: 'cust-b010', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-003', qty: 4, disc: 700 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 172, date: '2026-09-20T15:00:00+05:30', custId: 'cust-003', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-004', qty: 1, disc: 300 }, { pid: 'prod-ca-002', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 173, date: '2026-09-22T11:00:00+05:30', custId: 'cust-050', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 1, disc: 200 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 174, date: '2026-09-24T14:00:00+05:30', custId: 'cust-b002', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 2, disc: 600 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 175, date: '2026-09-26T17:00:00+05:30', custId: 'cust-046', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-006', qty: 1, disc: 300 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: false },
  // ── October 2026 ────────────────────────────────────────────────────────────
  { seq: 176, date: '2026-10-01T10:00:00+05:30', custId: 'cust-b010', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 4, disc: 600 }, { pid: 'prod-ch-007', qty: 4, disc: 0 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 177, date: '2026-10-02T13:00:00+05:30', custId: 'cust-b009', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 178, date: '2026-10-03T11:00:00+05:30', custId: 'cust-013', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-011', qty: 1, disc: 600 }], payDef: [{ method: 'Finance', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 179, date: '2026-10-04T16:00:00+05:30', custId: 'cust-025', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-003', qty: 1, disc: 600 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 180, date: '2026-10-05T12:00:00+05:30', custId: 'cust-016', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-005', qty: 1, disc: 2000, variant: '8GB/256GB, White Titanium' }], payDef: [{ method: 'Card', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 181, date: '2026-10-06T09:30:00+05:30', custId: 'cust-b007', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 2, disc: 100 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 182, date: '2026-10-07T14:00:00+05:30', custId: 'cust-021', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-004', qty: 1, disc: 300 }, { pid: 'prod-ep-002', qty: 1, disc: 0 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 183, date: '2026-10-08T11:00:00+05:30', custId: 'cust-049', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-009', qty: 1, disc: 300 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  // "today" sales (2026-10-10) — simulated current day
  { seq: 184, date: '2026-10-10T09:20:00+05:30', custId: 'cust-b004', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-003', qty: 2, disc: 700 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 185, date: '2026-10-10T11:05:00+05:30', custId: null, sp: RAHUL, itemDefs: [{ pid: 'prod-ph-007', qty: 1, disc: 200 }, { pid: 'prod-cg-001', qty: 1, disc: 0 }], payDef: [{ method: 'Cash', fraction: 1 }], status: 'completed', isPaper: true, paperNum: 'PB-031' },
  { seq: 186, date: '2026-10-10T13:40:00+05:30', custId: 'cust-032', sp: SAKSHAM, itemDefs: [{ pid: 'prod-ph-001', qty: 1, disc: 500 }], payDef: [{ method: 'UPI', fraction: 1 }], status: 'completed', isPaper: false },
  { seq: 187, date: '2026-10-10T15:10:00+05:30', custId: 'cust-b010', sp: RAHUL, itemDefs: [{ pid: 'prod-ph-010', qty: 3, disc: 100 }], payDef: [{ method: 'Bank Transfer', fraction: 1 }], status: 'completed', isPaper: false },
]

// ─── Build MOCK_SALES ─────────────────────────────────────────────────────────

function buildSales(): MockSale[] {
  return RAW_SALES.map((raw) => {
    const paddedSeq = String(raw.seq).padStart(5, '0')
    const id = `SALE-${paddedSeq}`
    const invoice_number = `MC/26-27/${paddedSeq}`

    const customer = raw.custId ? MOCK_CUSTOMERS.find((c) => c.id === raw.custId) ?? null : null

    const items: MockSaleItem[] = raw.itemDefs.map((def) =>
      makeItem(def.pid, def.qty, def.disc, def.variant),
    )

    const { taxable_value, cgst, sgst, round_off, total } = summarize(items)

    const payments = raw.status === 'cancelled' ? [] : makePayments(total, raw.payDef)

    return {
      id,
      invoice_number,
      customer_id: raw.custId,
      customer_name: customer?.name ?? null,
      customer_phone: customer?.phone_display ?? null,
      salesperson_id: raw.sp.id,
      salesperson_name: raw.sp.name,
      items,
      payments,
      taxable_value,
      cgst,
      sgst,
      round_off,
      total,
      status: raw.status,
      cancellation_reason: raw.cancelReason ?? null,
      created_at: raw.date,
      is_paper_bill: raw.isPaper,
      paper_bill_number: raw.paperNum ?? null,
    }
  })
}

export const MOCK_SALES: MockSale[] = buildSales()
