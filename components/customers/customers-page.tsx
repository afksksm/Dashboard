'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  SearchIcon,
  PlusIcon,
  PhoneIcon,
  Building2Icon,
  UserIcon,
  ArrowRightIcon,
  ReceiptIcon,
  XIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_CUSTOMERS, type MockCustomer } from '@/lib/mock/customers'
import { formatINR } from '@/lib/mock/analytics'

export function CustomersPage() {
  const [customers, setCustomers] = useState<MockCustomer[]>(MOCK_CUSTOMERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'individual' | 'business'>('all')

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = c.name.toLowerCase().includes(q)
        const matchesPhone = c.phone.includes(q) || c.phone_display.includes(q)
        const matchesBiz = c.business_name?.toLowerCase().includes(q)
        const matchesGstin = c.gstin?.toLowerCase().includes(q)
        if (!matchesName && !matchesPhone && !matchesBiz && !matchesGstin) {
          return false
        }
      }

      if (typeFilter === 'business' && !c.is_business) return false
      if (typeFilter === 'individual' && c.is_business) return false

      return true
    })
  }, [customers, searchQuery, typeFilter])

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
              Customers
            </h1>
            <span className="rounded-full bg-[var(--surface-3)] px-2.5 py-0.5 text-xs font-bold text-[var(--ink)]">
              {customers.length} Profiles
            </span>
          </div>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">
            Customer directory with purchase histories, GST profiles &amp; spend metrics
          </p>
        </div>

        <Link
          href="/sales/new"
          className="flex h-10 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-xs self-start sm:self-auto"
        >
          <PlusIcon className="size-4 stroke-[2.5]" />
          <span>New sale for customer</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] bg-white p-4 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-4)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by phone number, name, GSTIN…"
            className="h-10 w-full rounded-full bg-[var(--surface-2)] pl-9.5 pr-4 text-xs font-medium text-[var(--ink)] placeholder:text-[var(--ink-4)] border border-[var(--line)] focus:border-[var(--ink)] outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-4)] hover:text-[var(--ink)]"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        {/* Type pills */}
        <div className="inline-flex rounded-full bg-[var(--surface-2)] p-1 border border-[var(--line)] self-start sm:self-auto">
          {(['all', 'individual', 'business'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all',
                typeFilter === t
                  ? 'bg-[var(--ink)] text-white shadow-xs'
                  : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
              )}
            >
              {t === 'all' ? 'All Customers' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="rounded-[20px] bg-white border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--surface-2)] border-b border-[var(--line)] text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wider">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-3 text-center">Orders</th>
                <th className="py-3 px-4">Last Purchase</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-2)]">
              {filteredCustomers.map((cust) => {
                const initials = cust.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()

                return (
                  <tr
                    key={cust.id}
                    className="h-14 hover:bg-[var(--surface-2)] transition-colors group"
                  >
                    {/* Name + Avatar */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/customers/${cust.id}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-[var(--lime-soft)] text-xs font-bold text-[var(--ink)]">
                          {initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[var(--ink)] truncate max-w-[180px]">
                            {cust.name}
                          </span>
                          {cust.is_business && cust.business_name && (
                            <span className="text-[10px] text-[var(--ink-3)] truncate max-w-[180px]">
                              {cust.business_name}
                            </span>
                          )}
                        </div>
                      </Link>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 font-mono font-medium text-[var(--ink-2)]">
                      {cust.phone_display}
                    </td>

                    {/* Type chip */}
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                          cust.is_business
                            ? 'bg-[var(--ink)] text-white'
                            : 'bg-[var(--surface-3)] text-[var(--ink-2)]'
                        )}
                        title={cust.gstin ? `GSTIN: ${cust.gstin}` : undefined}
                      >
                        {cust.is_business ? (
                          <Building2Icon className="size-2.5" />
                        ) : (
                          <UserIcon className="size-2.5" />
                        )}
                        <span>{cust.is_business ? 'B2B' : 'Individual'}</span>
                      </span>
                    </td>

                    {/* Spend */}
                    <td className="py-3 px-4 text-right font-bold text-[var(--ink)] tabular-nums">
                      {formatINR(cust.total_spent)}
                    </td>

                    {/* Orders count */}
                    <td className="py-3 px-3 text-center font-semibold text-[var(--ink-2)]">
                      {cust.order_count}
                    </td>

                    {/* Last purchase */}
                    <td className="py-3 px-4 text-[var(--ink-3)] whitespace-nowrap">
                      {new Date(cust.last_purchase).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/customers/${cust.id}`}
                        className="inline-flex size-7 items-center justify-center rounded-full hover:bg-[var(--surface-3)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
                      >
                        <ArrowRightIcon className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="py-16 text-center text-xs text-[var(--ink-3)]">
            No customer accounts found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>
    </div>
  )
}
