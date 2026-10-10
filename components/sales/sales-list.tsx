'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  ArrowUpDownIcon,
  XIcon,
  ReceiptIcon,
  FileSpreadsheetIcon,
  EyeIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MockSale } from '@/lib/mock/sales'
import { formatINR } from '@/lib/mock/analytics'

interface SalesListProps {
  initialSales: MockSale[]
}

export function SalesList({ initialSales }: SalesListProps) {
  const [sales, setSales] = useState<MockSale[]>(initialSales)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'cancelled'>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [salespersonFilter, setSalespersonFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Filter logic
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // Search filter: customer phone/name, Sale ID, invoice number, product name, IMEI
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesInvoice = sale.invoice_number.toLowerCase().includes(query)
        const matchesSaleId = sale.id.toLowerCase().includes(query)
        const matchesCustomer =
          sale.customer_name?.toLowerCase().includes(query) ||
          sale.customer_phone?.toLowerCase().includes(query)
        const matchesProduct = sale.items.some((item) =>
          item.product_name.toLowerCase().includes(query) ||
          item.imeis.some((imei) => imei.includes(query))
        )
        if (!matchesInvoice && !matchesSaleId && !matchesCustomer && !matchesProduct) {
          return false
        }
      }

      // Status filter
      if (statusFilter !== 'all' && sale.status !== statusFilter) {
        return false
      }

      // Payment filter
      if (paymentFilter !== 'all') {
        const hasPayment = sale.payments.some((p) => p.method === paymentFilter)
        if (!hasPayment) return false
      }

      // Salesperson filter
      if (salespersonFilter !== 'all' && sale.salesperson_id !== salespersonFilter) {
        return false
      }

      return true
    })
  }, [sales, searchQuery, statusFilter, paymentFilter, salespersonFilter])

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / pageSize) || 1
  const paginatedSales = filteredSales.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Totals for filter bar
  const totalCompletedAmount = filteredSales
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.total, 0)

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
            Sales & Invoices
          </h1>
          <p className="text-xs text-[var(--ink-3)] mt-1">
            Complete GST tax invoice records, paper bill backfills, and cancellation registry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/export"
            className="flex h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors shadow-xs"
          >
            <FileSpreadsheetIcon className="size-3.5" />
            <span>Export CSV</span>
          </Link>
          <Link
            href="/sales/new"
            className="flex h-10 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-xs"
          >
            <PlusIcon className="size-4 stroke-[2.5]" />
            <span>New sale</span>
          </Link>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
        {/* Row 1: Search + Quick stats */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-4)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by invoice, phone, customer, IMEI, product…"
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

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-[var(--ink-3)]">
              <span>Matching:</span>
              <strong className="font-semibold text-[var(--ink)]">{filteredSales.length} bills</strong>
            </div>
            <div className="h-4 w-px bg-[var(--line)]" />
            <div className="flex items-center gap-1.5 text-[var(--ink-3)]">
              <span>Total value:</span>
              <strong className="font-semibold text-[var(--ink)] tabular-nums">
                {formatINR(totalCompletedAmount)}
              </strong>
            </div>
          </div>
        </div>

        {/* Row 2: Filter selects */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--surface-2)]">
          {/* Status filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-[var(--ink-3)]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="h-8 rounded-lg bg-[var(--surface-2)] px-2.5 text-xs font-medium text-[var(--ink)] border border-[var(--line)] outline-none"
            >
              <option value="all">All statuses</option>
              <option value="completed">Completed only</option>
              <option value="cancelled">Cancelled only</option>
            </select>
          </div>

          {/* Payment filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-[var(--ink-3)]">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="h-8 rounded-lg bg-[var(--surface-2)] px-2.5 text-xs font-medium text-[var(--ink)] border border-[var(--line)] outline-none"
            >
              <option value="all">All methods</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {/* Salesperson filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-[var(--ink-3)]">Salesperson:</span>
            <select
              value={salespersonFilter}
              onChange={(e) => {
                setSalespersonFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="h-8 rounded-lg bg-[var(--surface-2)] px-2.5 text-xs font-medium text-[var(--ink)] border border-[var(--line)] outline-none"
            >
              <option value="all">All staff</option>
              <option value="demo-admin-001">Saksham Sharma</option>
              <option value="sp-002">Rahul Verma</option>
            </select>
          </div>

          {(statusFilter !== 'all' || paymentFilter !== 'all' || salespersonFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all')
                setPaymentFilter('all')
                setSalespersonFilter('all')
                setSearchQuery('')
                setCurrentPage(1)
              }}
              className="ml-auto text-xs font-medium text-[var(--neg)] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Table (Desktop) / Cards (Mobile) */}
      <div className="rounded-[20px] bg-white border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--surface-2)] border-b border-[var(--line)] text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-3">Sale ID</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items summary</th>
                <th className="py-3 px-3">Salesperson</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-2)]">
              {paginatedSales.map((sale) => {
                const isCancelled = sale.status === 'cancelled'
                const primaryItem = sale.items[0]?.product_name || 'Item'
                const extraItems = sale.items.length - 1
                const itemSummary = extraItems > 0 ? `${primaryItem} + ${extraItems}` : primaryItem
                const formattedDate = new Date(sale.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <tr
                    key={sale.id}
                    className="h-14 hover:bg-[var(--surface-2)] transition-colors group"
                  >
                    {/* Invoice number */}
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--ink)] whitespace-nowrap">
                      <Link
                        href={`/sales/${sale.id}`}
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <ReceiptIcon className="size-3.5 text-[var(--ink-4)] group-hover:text-[var(--ink)]" />
                        <span>{sale.invoice_number}</span>
                      </Link>
                    </td>

                    {/* Sale ID */}
                    <td className="py-3 px-3 font-mono text-[11px] text-[var(--ink-4)] whitespace-nowrap">
                      {sale.id}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-[var(--ink-3)] whitespace-nowrap">
                      {formattedDate}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      {sale.customer_name ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-[var(--ink)] truncate max-w-[130px]">
                            {sale.customer_name}
                          </span>
                          <span className="text-[10px] text-[var(--ink-3)]">
                            {sale.customer_phone || ''}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-block rounded-md bg-[var(--surface-3)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ink-3)]">
                          Walk-in
                        </span>
                      )}
                    </td>

                    {/* Items */}
                    <td className="py-3 px-4 text-[var(--ink-2)] truncate max-w-[200px]" title={sale.items.map(i => i.product_name).join(', ')}>
                      {itemSummary}
                    </td>

                    {/* Salesperson */}
                    <td className="py-3 px-3 text-[var(--ink-2)] whitespace-nowrap">
                      {sale.salesperson_name.split(' ')[0]}
                    </td>

                    {/* Payment methods chips */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {sale.payments.map((p, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-[var(--surface-3)] px-2 py-0.2 text-[10px] font-semibold text-[var(--ink)]"
                          >
                            {p.method}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-semibold text-[var(--ink)] tabular-nums whitespace-nowrap">
                      <span className={cn(isCancelled && 'text-[var(--ink-4)] line-through')}>
                        {formatINR(sale.total)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                          isCancelled
                            ? 'bg-[var(--neg-bg)] text-[var(--neg)]'
                            : sale.is_paper_bill
                            ? 'bg-[var(--amber-bg)] text-[var(--amber-crm)]'
                            : 'bg-[var(--pos-bg)] text-[var(--pos)]'
                        )}
                      >
                        {isCancelled ? 'Cancelled' : sale.is_paper_bill ? 'Paper Bill' : 'Completed'}
                      </span>
                    </td>

                    {/* View Action */}
                    <td className="py-3 px-3 text-center">
                      <Link
                        href={`/sales/${sale.id}`}
                        className="inline-flex size-7 items-center justify-center rounded-full hover:bg-[var(--surface-3)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
                        title="View invoice preview"
                      >
                        <EyeIcon className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (DESIGN.md Section 19) */}
        <div className="lg:hidden divide-y divide-[var(--surface-2)]">
          {paginatedSales.map((sale) => {
            const isCancelled = sale.status === 'cancelled'
            const primaryItem = sale.items[0]?.product_name || 'Item'
            const extraItems = sale.items.length - 1
            const itemSummary = extraItems > 0 ? `${primaryItem} + ${extraItems}` : primaryItem

            return (
              <Link
                key={sale.id}
                href={`/sales/${sale.id}`}
                className="flex flex-col gap-2 p-4 hover:bg-[var(--surface-2)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--ink)]">
                    {sale.invoice_number}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-bold tabular-nums',
                      isCancelled ? 'text-[var(--ink-4)] line-through' : 'text-[var(--ink)]'
                    )}
                  >
                    {formatINR(sale.total)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--ink-3)]">
                  <span className="font-medium text-[var(--ink-2)] truncate max-w-[200px]">
                    {itemSummary}
                  </span>
                  <span>{sale.customer_name || 'Walk-in'}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[var(--surface-2)] text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {sale.payments.map((p, idx) => (
                      <span key={idx} className="rounded bg-[var(--surface-2)] px-1.5 py-0.2 text-[10px] font-semibold">
                        {p.method}
                      </span>
                    ))}
                  </div>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-bold',
                      isCancelled ? 'bg-[var(--neg-bg)] text-[var(--neg)]' : 'bg-[var(--pos-bg)] text-[var(--pos)]'
                    )}
                  >
                    {isCancelled ? 'Cancelled' : 'Completed'}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Empty state */}
        {filteredSales.length === 0 && (
          <div className="py-16 text-center">
            <ReceiptIcon className="mx-auto size-10 text-[var(--ink-4)]" />
            <h3 className="mt-3 text-sm font-semibold text-[var(--ink)]">No invoices match your filter</h3>
            <p className="mt-1 text-xs text-[var(--ink-3)]">
              Try adjusting your search terms or clearing the filters.
            </p>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredSales.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--line)] bg-[var(--surface-2)] text-xs text-[var(--ink-3)]">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredSales.length)} of {filteredSales.length} bills
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-[var(--line)] bg-white px-2.5 py-1 font-semibold text-[var(--ink)] disabled:opacity-40 hover:bg-[var(--surface-3)]"
              >
                Previous
              </button>
              <span className="px-2 font-medium">
                {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border border-[var(--line)] bg-white px-2.5 py-1 font-semibold text-[var(--ink)] disabled:opacity-40 hover:bg-[var(--surface-3)]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
