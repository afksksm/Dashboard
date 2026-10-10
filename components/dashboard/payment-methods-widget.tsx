'use client'

import { MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentBreakdownProps {
  data: Record<string, { amount: number; count: number; share: number }>
}

export function PaymentMethodsWidget({ data }: PaymentBreakdownProps) {
  const methods = [
    { key: 'UPI', label: 'UPI', hatchClass: 'hatch-lime', badgeBg: 'bg-[var(--lime)]', color: '#D5F65A' },
    { key: 'Cash', label: 'Cash', hatchClass: 'hatch-amber', badgeBg: 'bg-[var(--amber-bg)]', color: '#D99A0B' },
    { key: 'Card', label: 'Card', hatchClass: 'hatch-orange', badgeBg: 'bg-[var(--orange-crm)]', color: '#F28A1F' },
    { key: 'Finance', label: 'Finance', hatchClass: 'hatch-grey', badgeBg: 'bg-[var(--surface-3)]', color: '#2E3B8F' },
    { key: 'Other', label: 'Other', hatchClass: 'hatch-mint', badgeBg: 'bg-[var(--mint-crm)]', color: '#5ED6B0' },
  ]

  return (
    <div className="flex flex-col rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-2)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Payment methods</h3>
          <p className="text-[11px] text-[var(--ink-3)]">Collection breakdown by tender</p>
        </div>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-3)]"
          aria-label="Options"
        >
          <MoreHorizontalIcon className="size-4" />
        </button>
      </div>

      {/* Hatched Vertical Bars with Count Badges (ref-03 style) */}
      <div className="my-5 flex items-end justify-between gap-3 px-2 h-36 border-b border-[var(--surface-2)] pb-2">
        {methods.map(({ key, label, hatchClass, badgeBg }) => {
          const item = data[key] || { amount: 0, count: 0, share: 5 }
          // Minimum bar height 15%, max 100%
          const barHeightPercent = Math.max(15, Math.min(100, item.share * 1.5))

          return (
            <div key={key} className="flex flex-col items-center flex-1 h-full justify-end group">
              {/* Count badge sitting right above the bar */}
              <span
                className={cn(
                  'mb-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-[var(--ink)] shadow-xs transition-transform group-hover:scale-110',
                  badgeBg
                )}
              >
                {item.count}
              </span>

              {/* Hatched Bar */}
              <div
                className="w-full max-w-[28px] rounded-t-md overflow-hidden bg-[var(--surface-3)] relative"
                style={{ height: `${barHeightPercent}%` }}
              >
                <div className={cn('absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity', hatchClass)} />
              </div>

              {/* Label */}
              <span className="mt-2 text-[11px] font-medium text-[var(--ink-3)] truncate w-full text-center">
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend with Rupee amounts */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {methods.slice(0, 4).map(({ key, label }) => {
          const item = data[key] || { amount: 0, share: 0 }
          return (
            <div key={key} className="flex items-center justify-between rounded-lg bg-[var(--surface-2)] p-2">
              <span className="text-[var(--ink-3)]">{label}</span>
              <span className="font-semibold text-[var(--ink)] tabular-nums">
                ₹{(item.amount / 1000).toFixed(0)}K
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
