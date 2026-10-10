'use client'

import { useState, useId, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  SearchIcon,
  PlusIcon,
  Trash2Icon,
  CheckCircle2Icon,
  AlertCircleIcon,
  CheckIcon,
  PrinterIcon,
  DownloadIcon,
  ArrowRightIcon,
  Building2Icon,
  UserIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_PRODUCTS, type MockProduct } from '@/lib/mock/products'
import { MOCK_CUSTOMERS, type MockCustomer } from '@/lib/mock/customers'
import { formatINR } from '@/lib/mock/analytics'

// Helper for Luhn algorithm 15-digit IMEI verification
function isValidIMEI(imei: string): boolean {
  if (!/^\d{15}$/.test(imei)) return false
  let sum = 0
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(imei[i], 10)
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

interface SaleCartItem {
  id: string
  product: MockProduct
  variant: string
  quantity: number
  priceBeforeGst: number
  discountValue: number
  discountType: 'amount' | 'percent'
  imeis: string[]
}

interface PaymentRow {
  method: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Finance' | 'Other'
  amount: number
}

export function NewSaleForm() {
  const router = useRouter()
  const submissionKey = useId()

  // ── Paper bill mode toggle ──
  const [isPaperBill, setIsPaperBill] = useState(false)
  const [paperBillNumber, setPaperBillNumber] = useState('')
  const [paperBillDate, setPaperBillDate] = useState('2026-10-10')

  // ── Customer state ──
  const [phone, setPhone] = useState('')
  const [isWalkIn, setIsWalkIn] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [isBusiness, setIsBusiness] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [gstin, setGstin] = useState('')
  const [matchedCustomer, setMatchedCustomer] = useState<MockCustomer | null>(null)

  // ── Product search state ──
  const [productSearch, setProductSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  // ── Cart Items ──
  const [cart, setCart] = useState<SaleCartItem[]>([
    {
      id: 'item-1',
      product: MOCK_PRODUCTS[0], // vivo V40 5G
      variant: '8GB/256GB, Titanium Black',
      quantity: 1,
      priceBeforeGst: 29999,
      discountValue: 1000,
      discountType: 'amount',
      imeis: ['355000000000086'],
    },
  ])

  // ── Payments ──
  const [payments, setPayments] = useState<PaymentRow[]>([
    { method: 'UPI', amount: 34219 },
  ])

  // ── Submission & Modal states ──
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedSale, setConfirmedSale] = useState<{
    invoiceNumber: string
    total: number
    date: string
  } | null>(null)

  // Check if any phone item exists
  const hasPhoneItem = cart.some((i) => i.product.requires_imei)

  // Phone lookup
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 10)
    setPhone(raw)
    setIsWalkIn(false)

    if (raw.length === 10) {
      const found = MOCK_CUSTOMERS.find((c) => c.phone.replace(/\D/g, '').endsWith(raw))
      if (found) {
        setMatchedCustomer(found)
        setCustomerName(found.name)
        if (found.is_business) {
          setIsBusiness(true)
          setBusinessName(found.business_name || '')
          setGstin(found.gstin || '')
        }
      } else {
        setMatchedCustomer(null)
      }
    } else {
      setMatchedCustomer(null)
    }
  }

  // Add product to cart
  const addProductToCart = (p: MockProduct) => {
    const newItem: SaleCartItem = {
      id: `item-${Date.now()}`,
      product: p,
      variant: p.requires_imei ? 'Default Variant' : '',
      quantity: 1,
      priceBeforeGst: p.default_price || (p.requires_imei ? 15000 : 999),
      discountValue: 0,
      discountType: 'amount',
      imeis: p.requires_imei ? [''] : [],
    }
    setCart((prev) => [...prev, newItem])
    setProductSearch('')
    setSearchFocused(false)
  }

  // Remove cart item
  const removeCartItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  // Financial calculations
  const { taxableTotal, cgstTotal, sgstTotal, grandTotal, roundOff } = useMemo(() => {
    let taxable = 0
    let cgst = 0
    let sgst = 0

    cart.forEach((item) => {
      let unitDiscount = 0
      if (item.discountType === 'percent') {
        unitDiscount = (item.priceBeforeGst * item.discountValue) / 100
      } else {
        unitDiscount = item.discountValue
      }
      const unitTaxable = Math.max(0, item.priceBeforeGst - unitDiscount)
      const lineTaxable = unitTaxable * item.quantity
      const gstRate = item.product.gst_rate // e.g. 18
      const halfRate = gstRate / 2 // 9%

      const lineCgst = (lineTaxable * halfRate) / 100
      const lineSgst = (lineTaxable * halfRate) / 100

      taxable += lineTaxable
      cgst += lineCgst
      sgst += lineSgst
    })

    const unroundedTotal = taxable + cgst + sgst
    const rounded = Math.round(unroundedTotal)
    const roundOffVal = Math.round((rounded - unroundedTotal) * 100) / 100

    return {
      taxableTotal: Math.round(taxable * 100) / 100,
      cgstTotal: Math.round(cgst * 100) / 100,
      sgstTotal: Math.round(sgst * 100) / 100,
      roundOff: roundOffVal,
      grandTotal: rounded,
    }
  }, [cart])

  // Payment assignment check
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const paymentDelta = grandTotal - totalPaid

  // Auto-sync initial payment row
  const addPaymentMethod = (method: PaymentRow['method']) => {
    const remaining = Math.max(0, paymentDelta)
    setPayments((prev) => [...prev, { method, amount: remaining }])
  }

  const removePaymentRow = (idx: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== idx))
  }

  const updatePaymentAmount = (idx: number, amt: number) => {
    setPayments((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, amount: amt } : p))
    )
  }

  // Validation
  const validationError = useMemo(() => {
    if (cart.length === 0) return 'Add at least one product to the sale.'

    if (!isWalkIn && phone.length !== 10) {
      return 'Enter a valid 10-digit customer phone number.'
    }

    if (hasPhoneItem && isWalkIn) {
      return 'Phone sales require a customer phone number.'
    }

    for (const item of cart) {
      if (item.product.requires_imei) {
        if (item.imeis.length < item.quantity) {
          return `Missing IMEI for ${item.product.name}.`
        }
        for (const imei of item.imeis) {
          if (!imei || imei.length !== 15) {
            return `Enter 15 digits IMEI for ${item.product.name}.`
          }
          if (!isValidIMEI(imei)) {
            return `Invalid IMEI check digit for ${item.product.name}.`
          }
        }
      }
    }

    if (paymentDelta !== 0) {
      return paymentDelta > 0
        ? `₹${paymentDelta.toLocaleString('en-IN')} left to assign to payments.`
        : `Payments exceed total by ₹${Math.abs(paymentDelta).toLocaleString('en-IN')}.`
    }

    if (isPaperBill && !paperBillNumber.trim()) {
      return 'Paper bill reference number is required.'
    }

    return null
  }, [cart, isWalkIn, phone, hasPhoneItem, paymentDelta, isPaperBill, paperBillNumber])

  // Submit sale handler
  const handleConfirmSale = () => {
    if (validationError || isSubmitting) return
    setIsSubmitting(true)

    // Simulate atomic persistence
    setTimeout(() => {
      setIsSubmitting(false)
      const nextInvoice = isPaperBill
        ? `PB/${paperBillNumber}`
        : `MC/26-27/00${Math.floor(Math.random() * 20 + 181)}`
      setConfirmedSale({
        invoiceNumber: nextInvoice,
        total: grandTotal,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
    }, 600)
  }

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return []
    const q = productSearch.toLowerCase().trim()
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [productSearch])

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      {/* ── Paper Bill Strip ────────────────────────────────────────── */}
      {isPaperBill && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[18px] bg-[var(--amber-bg)] p-4 border border-[var(--amber-crm)] text-xs text-[var(--ink)]">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="size-4.5 text-[var(--amber-crm)] shrink-0" />
            <div>
              <span className="font-bold">Paper Bill Backfill Mode:</span>{' '}
              <span>This record preserves original bill dates and does not consume CRM invoice series numbers.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={paperBillNumber}
              onChange={(e) => setPaperBillNumber(e.target.value)}
              placeholder="Paper Bill No. (e.g. 4021)"
              className="h-8 rounded-lg bg-white px-2.5 font-mono text-xs border border-[var(--amber-crm)] outline-none"
            />
            <input
              type="date"
              value={paperBillDate}
              onChange={(e) => setPaperBillDate(e.target.value)}
              className="h-8 rounded-lg bg-white px-2 text-xs border border-[var(--amber-crm)] outline-none"
            />
            <button
              type="button"
              onClick={() => setIsPaperBill(false)}
              className="text-xs font-semibold underline text-[var(--ink-2)]"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* ── Top Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
              New Sale
            </h1>
            <span className="rounded-full bg-[var(--lime-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--ink)]">
              Point of Sale
            </span>
          </div>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">
            Rapid billing terminal · Concurrency protected & GST compliant
          </p>
        </div>

        {!isPaperBill && (
          <button
            type="button"
            onClick={() => setIsPaperBill(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--amber-crm)] hover:underline"
          >
            <span>Switch to Paper Bill Backfill mode</span>
          </button>
        )}
      </div>

      {/* ── Two Column Layout (Form 8 / Sticky Summary 4) ─────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (8 cols): Customer Card + Items Card */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* 1. Customer Section */}
          <div className="rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-2)]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
                <UserIcon className="size-4 text-[var(--ink-3)]" />
                <span>1. Customer Details</span>
              </h2>
              {/* Walk-in toggle */}
              <button
                type="button"
                disabled={hasPhoneItem}
                onClick={() => {
                  setIsWalkIn(!isWalkIn)
                  if (!isWalkIn) {
                    setPhone('')
                    setCustomerName('Walk-in Customer')
                    setMatchedCustomer(null)
                  } else {
                    setCustomerName('')
                  }
                }}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold border transition-all',
                  isWalkIn
                    ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                    : 'bg-white text-[var(--ink-3)] border-[var(--line)] hover:border-[var(--ink-4)]',
                  hasPhoneItem && 'opacity-40 cursor-not-allowed'
                )}
                title={hasPhoneItem ? 'Phone sales require customer phone number' : ''}
              >
                Walk-in Customer
              </button>
            </div>

            {hasPhoneItem && isWalkIn && (
              <p className="mt-2 text-[11px] text-[var(--neg)] font-medium">
                * Mobile phone sales strictly require customer verification. Walk-in disabled.
              </p>
            )}

            {!isWalkIn ? (
              <div className="mt-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone input */}
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                      Phone Number (Mandatory)
                    </label>
                    <div className="flex items-center rounded-xl bg-[var(--surface-2)] border border-[var(--line)] focus-within:border-[var(--ink)] overflow-hidden transition-colors">
                      <span className="bg-[var(--surface-3)] px-3 py-2.5 text-xs font-semibold text-[var(--ink-2)] border-r border-[var(--line)]">
                        +91
                      </span>
                      <input
                        type="tel"
                        autoFocus
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="98765 43210"
                        className="h-10 w-full px-3 text-sm font-medium text-[var(--ink)] bg-transparent outline-none tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-sm font-medium text-[var(--ink)] border border-[var(--line)] focus:border-[var(--ink)] outline-none"
                    />
                  </div>
                </div>

                {/* Match card if customer matched */}
                {matchedCustomer && (
                  <div className="rounded-xl bg-[var(--lime-wash)] p-3.5 border border-[var(--lime-strong)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--lime)] text-xs font-bold text-[var(--ink)]">
                        {matchedCustomer.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[var(--ink)]">
                          {matchedCustomer.name} (Existing Customer)
                        </span>
                        <span className="text-[11px] text-[var(--ink-3)]">
                          {matchedCustomer.order_count} past orders · Spent ₹{matchedCustomer.total_spent.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--pos)] bg-[var(--pos-bg)] px-2 py-0.5 rounded-full">
                      Verified Match
                    </span>
                  </div>
                )}

                {/* Business Invoice Toggle */}
                <div className="pt-2 border-t border-[var(--surface-2)]">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[var(--ink-2)]">
                    <input
                      type="checkbox"
                      checked={isBusiness}
                      onChange={(e) => setIsBusiness(e.target.checked)}
                      className="rounded border-[var(--line)] size-4 text-[var(--ink)] focus:ring-[var(--lime)]"
                    />
                    <Building2Icon className="size-4 text-[var(--ink-3)]" />
                    <span>Generate B2B GST Tax Invoice (with GSTIN)</span>
                  </label>

                  {isBusiness && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                      <div>
                        <label className="text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                          Business Legal Name
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Apex Technologies LLP"
                          className="h-9 w-full rounded-lg bg-[var(--surface-2)] px-2.5 text-xs text-[var(--ink)] border border-[var(--line)] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                          15-Digit GSTIN
                        </label>
                        <input
                          type="text"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase())}
                          placeholder="07AAAAA0000A1Z5"
                          maxLength={15}
                          className="h-9 w-full rounded-lg bg-[var(--surface-2)] px-2.5 text-xs font-mono text-[var(--ink)] border border-[var(--line)] outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-xl bg-[var(--surface-2)] p-3 text-xs text-[var(--ink-3)]">
                Billed as standard Walk-in customer. No purchase history will be linked.
              </div>
            )}
          </div>

          {/* 2. Items Section */}
          <div className="rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-2)]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
                2. Items & Inventory Line Items
              </h2>
              <span className="text-xs font-semibold text-[var(--ink-3)]">
                {cart.length} item{cart.length === 1 ? '' : 's'} in bill
              </span>
            </div>

            {/* Product search box */}
            <div className="relative my-4">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-4)]" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search phone model, accessory, brand, or barcode…"
                className="h-11 w-full rounded-xl bg-[var(--surface-2)] pl-10 pr-4 text-xs font-medium text-[var(--ink)] placeholder:text-[var(--ink-4)] border border-[var(--line)] focus:border-[var(--ink)] outline-none transition-colors"
              />

              {/* Autocomplete dropdown */}
              {searchFocused && filteredProducts.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl bg-white border border-[var(--line)] shadow-xl overflow-hidden divide-y divide-[var(--surface-2)]">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addProductToCart(p)}
                      className="flex items-center justify-between p-3 hover:bg-[var(--surface-2)] cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[var(--ink)]">{p.name}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-3)] mt-0.5">
                          <span className="rounded bg-[var(--surface-3)] px-1.5 py-0.2 text-[10px] font-semibold">{p.brand}</span>
                          <span>·</span>
                          <span>{p.category}</span>
                          <span>·</span>
                          <span>GST {p.gst_rate}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--ink)] tabular-nums">
                          ₹{(p.default_price || 0).toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          className="rounded-full bg-[var(--lime)] p-1 text-[var(--ink)] hover:bg-[var(--lime-strong)]"
                        >
                          <PlusIcon className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart item cards */}
            <div className="flex flex-col gap-3.5">
              {cart.map((item, idx) => {
                const isPhone = item.product.requires_imei
                const unitDiscount =
                  item.discountType === 'percent'
                    ? (item.priceBeforeGst * item.discountValue) / 100
                    : item.discountValue
                const lineTaxable = Math.max(0, item.priceBeforeGst - unitDiscount) * item.quantity
                const lineGst = (lineTaxable * item.product.gst_rate) / 100
                const lineTotal = lineTaxable + lineGst

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-[16px] bg-[var(--surface-2)] p-4 border border-[var(--line)] transition-all"
                  >
                    {/* Item row header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--ink)]">
                            {item.product.name}
                          </span>
                          <span className="rounded-full bg-white px-2 py-0.2 text-[10px] font-semibold text-[var(--ink-3)] border border-[var(--line)]">
                            {item.product.brand}
                          </span>
                          <span className="rounded-full bg-[var(--lime-soft)] px-2 py-0.2 text-[10px] font-semibold text-[var(--ink)]">
                            GST {item.product.gst_rate}%
                          </span>
                        </div>
                        {isPhone && (
                          <input
                            type="text"
                            value={item.variant}
                            onChange={(e) => {
                              const v = e.target.value
                              setCart((prev) =>
                                prev.map((it) => (it.id === item.id ? { ...it, variant: v } : it))
                              )
                            }}
                            placeholder="Variant details (e.g. 8GB/256GB, Black)"
                            className="mt-1.5 h-7 w-64 rounded-md bg-white px-2 text-[11px] text-[var(--ink)] border border-[var(--line)] outline-none"
                          />
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
                        className="text-[var(--ink-4)] hover:text-[var(--neg)] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>

                    {/* Numeric fields row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end pt-2 border-t border-[var(--line)]">
                      {/* Qty */}
                      <div>
                        <label className="text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                          Qty
                        </label>
                        <div className="flex items-center h-8 rounded-lg bg-white border border-[var(--line)] overflow-hidden">
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => {
                              const newQty = Math.max(1, item.quantity - 1)
                              setCart((prev) =>
                                prev.map((it) =>
                                  it.id === item.id
                                    ? {
                                        ...it,
                                        quantity: newQty,
                                        imeis: it.imeis.slice(0, newQty),
                                      }
                                    : it
                                )
                              )
                            }}
                            className="w-7 h-full flex items-center justify-center font-bold text-[var(--ink-3)] hover:bg-[var(--surface-3)]"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newQty = item.quantity + 1
                              setCart((prev) =>
                                prev.map((it) =>
                                  it.id === item.id
                                    ? {
                                        ...it,
                                        quantity: newQty,
                                        imeis: [...it.imeis, ''],
                                      }
                                    : it
                                )
                              )
                            }}
                            className="w-7 h-full flex items-center justify-center font-bold text-[var(--ink-3)] hover:bg-[var(--surface-3)]"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price before GST */}
                      <div>
                        <label className="text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                          Price Excl. GST
                        </label>
                        <input
                          type="number"
                          value={item.priceBeforeGst}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0
                            setCart((prev) =>
                              prev.map((it) => (it.id === item.id ? { ...it, priceBeforeGst: val } : it))
                            )
                          }}
                          className="h-8 w-full rounded-lg bg-white px-2 text-xs font-semibold tabular-nums border border-[var(--line)] outline-none"
                        />
                      </div>

                      {/* Discount */}
                      <div>
                        <label className="text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                          Discount ({item.discountType === 'percent' ? '%' : '₹'})
                        </label>
                        <div className="flex h-8 rounded-lg bg-white border border-[var(--line)] overflow-hidden">
                          <input
                            type="number"
                            value={item.discountValue}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0
                              setCart((prev) =>
                                prev.map((it) => (it.id === item.id ? { ...it, discountValue: val } : it))
                              )
                            }}
                            className="w-full px-2 text-xs font-semibold tabular-nums outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCart((prev) =>
                                prev.map((it) =>
                                  it.id === item.id
                                    ? {
                                        ...it,
                                        discountType: it.discountType === 'amount' ? 'percent' : 'amount',
                                      }
                                    : it
                                )
                              )
                            }}
                            className="px-2 text-[10px] font-bold bg-[var(--surface-3)] border-l border-[var(--line)]"
                          >
                            {item.discountType === 'percent' ? '%' : '₹'}
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="flex flex-col items-end justify-center">
                        <span className="text-[10px] font-semibold text-[var(--ink-3)] uppercase">
                          Line Total
                        </span>
                        <span className="text-sm font-bold text-[var(--ink)] tabular-nums">
                          ₹{Math.round(lineTotal).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* IMEI inputs for phones */}
                    {isPhone && (
                      <div className="pt-2 border-t border-[var(--line)] flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[var(--ink-2)]">
                            IMEI Capture ({item.imeis.length} required):
                          </span>
                          <span className="text-[10px] text-[var(--ink-4)]">
                            15 digits per unit (barcode scan supported)
                          </span>
                        </div>

                        {item.imeis.map((imei, imeiIdx) => {
                          const valid = isValidIMEI(imei)
                          return (
                            <div key={imeiIdx} className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <input
                                  type="text"
                                  maxLength={15}
                                  value={imei}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '')
                                    setCart((prev) =>
                                      prev.map((it) => {
                                        if (it.id === item.id) {
                                          const nextImeis = [...it.imeis]
                                          nextImeis[imeiIdx] = val
                                          return { ...it, imeis: nextImeis }
                                        }
                                        return it
                                      })
                                    )
                                  }}
                                  placeholder={`Enter 15-digit IMEI for Unit ${imeiIdx + 1}`}
                                  className={cn(
                                    'h-8 w-full rounded-lg bg-white px-3 font-mono text-xs border outline-none tracking-wider',
                                    valid
                                      ? 'border-[var(--pos)] text-[var(--pos)]'
                                      : imei.length > 0
                                      ? 'border-[var(--neg)] text-[var(--neg)]'
                                      : 'border-[var(--line)] text-[var(--ink)]'
                                  )}
                                />
                                {valid && (
                                  <CheckCircle2Icon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-[var(--pos)]" />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sticky Summary Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="rounded-[28px] bg-white p-5 md:p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col gap-5">
            <div>
              <h2 className="text-base font-bold text-[var(--ink)]">Bill Summary</h2>
              <p className="text-xs text-[var(--ink-3)]">Real-time GST calculations</p>
            </div>

            {/* Financial lines */}
            <div className="flex flex-col gap-2.5 text-xs text-[var(--ink-2)] border-b border-[var(--surface-2)] pb-4">
              <div className="flex items-center justify-between">
                <span>Taxable Value:</span>
                <span className="font-semibold text-[var(--ink)] tabular-nums">
                  ₹{taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>CGST (Central Tax 9%):</span>
                <span className="font-semibold text-[var(--ink)] tabular-nums">
                  ₹{cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>SGST (Delhi State Tax 9%):</span>
                <span className="font-semibold text-[var(--ink)] tabular-nums">
                  ₹{sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[var(--ink-3)]">
                <span>Round-off:</span>
                <span className="font-mono tabular-nums">
                  {roundOff >= 0 ? `+₹${roundOff}` : `-₹${Math.abs(roundOff)}`}
                </span>
              </div>
            </div>

            {/* Big Hero Total */}
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-3)]">
                Net Payable Amount
              </span>
              <div className="text-3xl font-bold tracking-tight text-[var(--ink)] tabular-nums sm:text-4xl">
                ₹{grandTotal.toLocaleString('en-IN')}
                <span className="hero-paise text-lg">.00</span>
              </div>
            </div>

            {/* Split Payment Section */}
            <div className="flex flex-col gap-3 pt-3 border-t border-[var(--surface-2)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--ink)]">Split Payment Tenders</span>
                {/* Balance status pill */}
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    paymentDelta === 0
                      ? 'bg-[var(--pos-bg)] text-[var(--pos)]'
                      : paymentDelta > 0
                      ? 'bg-[var(--amber-bg)] text-[var(--amber-crm)]'
                      : 'bg-[var(--neg-bg)] text-[var(--neg)]'
                  )}
                >
                  {paymentDelta === 0
                    ? 'Balanced'
                    : paymentDelta > 0
                    ? `₹${paymentDelta.toLocaleString('en-IN')} left`
                    : `₹${Math.abs(paymentDelta).toLocaleString('en-IN')} over`}
                </span>
              </div>

              {/* Payment tender quick chips */}
              <div className="flex flex-wrap gap-1.5">
                {(['UPI', 'Cash', 'Card', 'Bank Transfer', 'Finance'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => addPaymentMethod(method)}
                    className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] hover:bg-[var(--surface-3)] transition-colors border border-[var(--line)]"
                  >
                    + {method}
                  </button>
                ))}
              </div>

              {/* Active payment rows */}
              <div className="flex flex-col gap-2 mt-1">
                {payments.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 rounded-xl bg-[var(--surface-2)] p-2.5 border border-[var(--line)]"
                  >
                    <span className="text-xs font-bold text-[var(--ink)] w-24 truncate">
                      {p.method}
                    </span>
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-xs font-semibold text-[var(--ink-3)]">₹</span>
                      <input
                        type="number"
                        value={p.amount}
                        onChange={(e) => updatePaymentAmount(idx, parseFloat(e.target.value) || 0)}
                        className="h-7 w-full rounded bg-white px-2 text-xs font-bold tabular-nums outline-none border border-[var(--line)]"
                      />
                    </div>
                    {payments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePaymentRow(idx)}
                        className="text-[var(--ink-4)] hover:text-[var(--neg)] p-1"
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error reason under confirm button */}
            {validationError && (
              <p className="text-xs font-medium text-[var(--neg)] text-center">
                * {validationError}
              </p>
            )}

            {/* Primary Confirm Button */}
            <button
              type="button"
              disabled={!!validationError || isSubmitting}
              onClick={handleConfirmSale}
              className={cn(
                'h-14 w-full rounded-full font-bold text-sm tracking-wide transition-all shadow-md',
                validationError || isSubmitting
                  ? 'bg-[var(--surface-3)] text-[var(--ink-4)] cursor-not-allowed'
                  : 'bg-[var(--lime)] text-[var(--ink)] hover:bg-[var(--lime-strong)] active:scale-[0.98]'
              )}
            >
              {isSubmitting ? (
                <span>Generating GST Invoice…</span>
              ) : (
                <span>Confirm Sale · ₹{grandTotal.toLocaleString('en-IN')}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Success Dialog Modal ────────────────────────────────────── */}
      {confirmedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 md:p-8 text-center shadow-2xl border border-[var(--line)] flex flex-col items-center">
            {/* Lime Check Circle */}
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--lime)] text-[var(--ink)] mb-4 animate-in zoom-in duration-300">
              <CheckIcon className="size-8 stroke-[3]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[var(--pos)]">
              Sale Confirmed &amp; Invoiced
            </span>
            <h3 className="mt-1 font-mono text-2xl font-bold text-[var(--ink)]">
              {confirmedSale.invoiceNumber}
            </h3>
            <p className="mt-1 text-xs text-[var(--ink-3)]">{confirmedSale.date}</p>

            <div className="my-5 w-full rounded-2xl bg-[var(--surface-2)] p-4 border border-[var(--line)] flex items-center justify-between">
              <span className="text-xs text-[var(--ink-3)] font-medium">Total Paid:</span>
              <span className="text-xl font-bold text-[var(--ink)] tabular-nums">
                ₹{confirmedSale.total.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-[11px] text-[var(--ink-3)] italic mb-6">
              * GST Invoice snapshot is frozen in database. To share with customer on WhatsApp, download the PDF.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col w-full gap-2.5">
              <Link
                href={`/sales/${confirmedSale.invoiceNumber.replace(/\//g, '-')}`}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--lime)] font-bold text-xs text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors"
              >
                <DownloadIcon className="size-4" />
                <span>View &amp; Download A4 PDF</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setConfirmedSale(null)
                  setCart([])
                  setPhone('')
                  setCustomerName('')
                  setMatchedCustomer(null)
                }}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white font-semibold text-xs text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <span>Start Next Sale</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
