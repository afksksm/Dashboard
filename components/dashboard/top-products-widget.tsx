'use client'

import { useState } from 'react'
import { MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TopProductItem = {
  name: string
  category: string
  units: number
  sales: number
}

interface TopProductsWidgetProps {
  products: TopProductItem[]
}

export function TopProductsWidget({ products }: TopProductsWidgetProps) {
  const [metric, setMetric] = useState<'units' | 'sales'>('units')

  const maxVal = Math.max(
    ...products.map((p) => (metric === 'units' ? p.units : p.sales)),
    1
  )

  return (
    <div className="flex flex-col rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-2)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Top products</h3>
          <p className="text-[11px] text-[var(--ink-3)]">Fastest selling inventory items</p>
        </div>

        {/* Units / Sales toggle */}
        <div className="inline-flex rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-0.5">
          <button
            type="button"
            onClick={() => setMetric('units')}
            className={cn(
              'rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors',
              metric === 'units'
                ? 'bg-white text-[var(--ink)] shadow-xs'
                : 'text-[var(--ink-3)]'
            )}
          >
            Units
          </button>
          <button
            type="button"
            onClick={() => setMetric('sales')}
            className={cn(
              'rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors',
              metric === 'sales'
                ? 'bg-white text-[var(--ink)] shadow-xs'
                : 'text-[var(--ink-3)]'
            )}
          >
            Sales
          </button>
        </div>
      </div>

      {/* Product List with Hatched Bars & Count Badges */}
      <div className="mt-4 flex flex-col gap-3.5">
        {products.map((prod, idx) => {
          const val = metric === 'units' ? prod.units : prod.sales
          const widthPercent = Math.max(20, Math.min(100, Math.round((val / maxVal) * 100)))
          const isTop = idx === 0

          return (
            <div key={prod.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--ink)] truncate max-w-[190px]">
                  {prod.name}
                </span>
                <span className="text-[11px] font-semibold text-[var(--ink-2)] tabular-nums shrink-0">
                  {metric === 'units' ? `${prod.units} units` : `₹${(prod.sales / 1000).toFixed(0)}K`}
                </span>
              </div>

              {/* Progress bar container */}
              <div className="relative h-4 w-full rounded-md bg-[var(--surface-3)] overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-md transition-all duration-300 relative',
                    isTop ? 'hatch-lime bg-[var(--lime-soft)]' : 'hatch-grey bg-[var(--surface-2)]'
                  )}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
