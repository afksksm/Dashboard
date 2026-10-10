'use client'

import Link from 'next/link'
import { ArrowRightIcon, MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MockSale } from '@/lib/mock/sales'

interface RecentSalesWidgetProps {
  sales: MockSale[]
}

export function RecentSalesWidget({ sales }: RecentSalesWidgetProps) {
  return (
    <div className="flex flex-col rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-2)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Recent sales</h3>
          <p className="text-[11px] text-[var(--ink-3)]">Latest transactions from shop POS</p>
        </div>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-3)]"
          aria-label="Options"
        >
          <MoreHorizontalIcon className="size-4" />
        </button>
      </div>

      {/* Sales list */}
      <div className="divide-y divide-[var(--surface-2)]">
        {sales.slice(0, 6).map((sale) => {
          const isCancelled = sale.status === 'cancelled'
          const primaryItem = sale.items[0]?.product_name || 'Electronics item'
          const extraCount = sale.items.length - 1
          const itemSummary = extraCount > 0 ? `${primaryItem} + ${extraCount} items` : primaryItem

          return (
            <Link
              key={sale.id}
              href={`/sales/${sale.id}`}
              className="flex items-center justify-between py-3 hover:bg-[var(--surface-2)] -mx-2 px-2 rounded-lg transition-colors group"
            >
              <div className="flex flex-col min-w-0 pr-3">
                <span className="text-xs font-semibold text-[var(--ink)] truncate group-hover:text-black">
                  {itemSummary}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-3)] mt-0.5">
                  <span className="truncate">{sale.customer_name || 'Walk-in'}</span>
                  <span>·</span>
                  <span className="font-mono text-[10px] text-[var(--ink-4)]">
                    {sale.invoice_number}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span
                  className={cn(
                    'text-xs font-bold tabular-nums',
                    isCancelled
                      ? 'text-[var(--ink-4)] line-through'
                      : 'text-[var(--ink)]'
                  )}
                >
                  ₹{sale.total.toLocaleString('en-IN')}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-semibold mt-0.5 px-1.5 py-0.2 rounded-sm',
                    isCancelled
                      ? 'text-[var(--neg)] bg-[var(--neg-bg)]'
                      : 'text-[var(--pos)] bg-[var(--pos-bg)]'
                  )}
                >
                  {isCancelled ? 'Cancelled' : 'Completed'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Widget Footer */}
      <div className="mt-3 pt-3 border-t border-[var(--surface-2)]">
        <Link
          href="/sales"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors py-1"
        >
          <span>View all sales & invoices</span>
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
