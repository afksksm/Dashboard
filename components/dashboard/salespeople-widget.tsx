'use client'

import { MoreHorizontalIcon } from 'lucide-react'

export type SalespersonItem = {
  id: string
  name: string
  sales: number
  orders: number
  initials: string
}

interface SalespeopleWidgetProps {
  salespeople: SalespersonItem[]
}

export function SalespeopleWidget({ salespeople }: SalespeopleWidgetProps) {
  return (
    <div className="flex flex-col rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-2)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Sales performance</h3>
          <p className="text-[11px] text-[var(--ink-3)]">Shop staff contribution</p>
        </div>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-3)]"
          aria-label="Options"
        >
          <MoreHorizontalIcon className="size-4" />
        </button>
      </div>

      {/* Staff list */}
      <div className="divide-y divide-[var(--surface-2)] mt-1">
        {salespeople.map((person, idx) => (
          <div key={person.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-[var(--lime-soft)] text-xs font-bold text-[var(--ink)]">
                {person.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[var(--ink)] truncate">
                  {person.name}
                </span>
                <span className="text-[11px] text-[var(--ink-3)]">
                  {person.orders} orders billed
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-[var(--ink)] tabular-nums">
                ₹{person.sales.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[var(--ink-4)] font-medium">
                #{idx + 1} ranked
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
