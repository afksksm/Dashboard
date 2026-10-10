'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CopyIcon,
  CheckIcon,
  Building2Icon,
  UserIcon,
  ReceiptIcon,
  PlusIcon,
  ArrowLeftIcon,
  CalendarIcon,
  SaveIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MockCustomer } from '@/lib/mock/customers'
import { MOCK_SALES, type MockSale } from '@/lib/mock/sales'
import { formatINR } from '@/lib/mock/analytics'

interface CustomerProfileProps {
  customer: MockCustomer
}

export function CustomerProfile({ customer }: CustomerProfileProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'purchases' | 'notes'>('purchases')
  const [notes, setNotes] = useState(customer.notes || '')
  const [notesSaved, setNotesSaved] = useState(false)

  // Find linked sales for this customer
  const linkedSales = MOCK_SALES.filter(
    (s) => s.customer_id === customer.id || s.customer_name === customer.name
  )

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(customer.phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveNotes = () => {
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
  }

  const initials = customer.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      {/* Top back link */}
      <div>
        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Customers directory</span>
        </Link>
      </div>

      {/* Header Profile Card */}
      <div className="rounded-[24px] bg-white p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--lime-soft)] text-xl font-bold text-[var(--ink)] shadow-xs">
            {initials}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">
                {customer.name}
              </h1>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold',
                  customer.is_business
                    ? 'bg-[var(--ink)] text-white'
                    : 'bg-[var(--surface-3)] text-[var(--ink-2)]'
                )}
              >
                {customer.is_business ? (
                  <Building2Icon className="size-3" />
                ) : (
                  <UserIcon className="size-3" />
                )}
                <span>{customer.is_business ? 'B2B Client' : 'Individual'}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--ink-3)] flex-wrap">
              <div className="flex items-center gap-1 font-mono font-medium text-[var(--ink)]">
                <span>{customer.phone_display}</span>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="p-1 hover:text-[var(--ink)] transition-colors"
                  title="Copy phone"
                >
                  {copied ? (
                    <CheckIcon className="size-3.5 text-[var(--pos)]" />
                  ) : (
                    <CopyIcon className="size-3.5" />
                  )}
                </button>
              </div>
              {customer.gstin && (
                <>
                  <span>·</span>
                  <span className="font-mono bg-[var(--surface-2)] px-2 py-0.5 rounded text-[11px] font-semibold text-[var(--ink)]">
                    GSTIN: {customer.gstin}
                  </span>
                </>
              )}
              {customer.business_name && (
                <>
                  <span>·</span>
                  <span className="font-medium text-[var(--ink-2)]">
                    {customer.business_name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/sales/new?customer=${customer.id}`}
          className="flex h-11 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-xs self-start md:self-center"
        >
          <PlusIcon className="size-4 stroke-[2.5]" />
          <span>New Sale for this Customer</span>
        </Link>
      </div>

      {/* Mini KPI row (4 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[20px] bg-white p-4 border border-[var(--line)] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">
            Lifetime Spend
          </span>
          <div className="text-2xl font-bold text-[var(--ink)] tabular-nums mt-1">
            {formatINR(customer.total_spent)}
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-4 border border-[var(--line)] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">
            Total Orders
          </span>
          <div className="text-2xl font-bold text-[var(--ink)] tabular-nums mt-1">
            {customer.order_count}
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-4 border border-[var(--line)] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">
            First Purchase
          </span>
          <div className="text-sm font-bold text-[var(--ink)] mt-2">
            {new Date(customer.first_purchase).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-4 border border-[var(--line)] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">
            Last Purchase
          </span>
          <div className="text-sm font-bold text-[var(--ink)] mt-2">
            {new Date(customer.last_purchase).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="rounded-[24px] bg-white p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col gap-5">
        <div className="flex items-center gap-6 border-b border-[var(--line)] pb-2 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('purchases')}
            className={cn(
              'pb-2 transition-colors relative',
              activeTab === 'purchases'
                ? 'text-[var(--ink)] font-bold'
                : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
            )}
          >
            <span>Order History ({linkedSales.length})</span>
            {activeTab === 'purchases' && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[var(--ink)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={cn(
              'pb-2 transition-colors relative',
              activeTab === 'notes'
                ? 'text-[var(--ink)] font-bold'
                : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
            )}
          >
            <span>Staff Relationship Notes</span>
            {activeTab === 'notes' && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[var(--ink)]" />
            )}
          </button>
        </div>

        {/* Tab 1: Purchases */}
        {activeTab === 'purchases' && (
          <div className="flex flex-col">
            {linkedSales.length > 0 ? (
              <div className="divide-y divide-[var(--surface-2)]">
                {linkedSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2 hover:bg-[var(--surface-2)] -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-3)] text-[var(--ink)]">
                        <ReceiptIcon className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-[var(--ink)]">
                          {sale.invoice_number}
                        </span>
                        <span className="text-[11px] text-[var(--ink-3)]">
                          {sale.items.map((i) => i.product_name).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-xs font-bold text-[var(--ink)] tabular-nums">
                        {formatINR(sale.total)}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold',
                          sale.status === 'cancelled'
                            ? 'bg-[var(--neg-bg)] text-[var(--neg)]'
                            : 'bg-[var(--pos-bg)] text-[var(--pos)]'
                        )}
                      >
                        {sale.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                      </span>
                      <Link
                        href={`/sales/${sale.id}`}
                        className="text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] underline"
                      >
                        View Bill
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-[var(--ink-3)]">
                No past transactions recorded for this customer profile yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Notes */}
        {activeTab === 'notes' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-[var(--ink-3)]">
              Store internal customer preferences, preferred phone brands, or special payment arrangement reminders.
            </p>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add staff notes regarding this customer…"
              className="w-full rounded-xl bg-[var(--surface-2)] p-3 text-xs text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)] resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--pos)] font-semibold">
                {notesSaved && '✓ Notes saved to customer record'}
              </span>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors"
              >
                <SaveIcon className="size-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
