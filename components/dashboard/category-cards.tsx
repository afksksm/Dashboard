'use client'

import { useState } from 'react'
import { ArrowUpRightIcon, ArrowDownRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CategoryStat = {
  name: string
  category: string
  sales: number
  share: number
  delta: number
}

interface CategoryCardsProps {
  categories: CategoryStat[]
  onSelectCategory?: (category: string | null) => void
}

export function CategoryCards({
  categories,
  onSelectCategory,
}: CategoryCardsProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleToggle = (name: string) => {
    const next = selected === name ? null : name
    setSelected(next)
    onSelectCategory?.(next)
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {categories.map((cat) => {
        const isSelected = selected === cat.name
        const isPositive = cat.delta >= 0

        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => handleToggle(cat.name)}
            className={cn(
              'flex flex-col justify-between rounded-[20px] p-4 text-left transition-all duration-200 cursor-pointer',
              'border',
              isSelected
                ? 'bg-[var(--ink)] text-white border-[var(--ink)] shadow-md scale-[1.01]'
                : 'bg-white text-[var(--ink)] border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] hover:border-[var(--ink-4)]'
            )}
          >
            {/* Top: indicator + category name */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  'text-xs font-semibold tracking-wide truncate',
                  isSelected ? 'text-white' : 'text-[var(--ink)]'
                )}
              >
                {cat.name}
              </span>
              <span
                className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-[var(--surface-2)] text-[var(--ink-3)]'
                )}
              >
                {cat.share}%
              </span>
            </div>

            {/* Middle: Amount + Delta */}
            <div className="my-2.5">
              <div
                className={cn(
                  'text-xl font-bold tracking-tight tabular-nums sm:text-2xl',
                  isSelected ? 'text-white' : 'text-[var(--ink)]'
                )}
              >
                ₹{cat.sales.toLocaleString('en-IN')}
              </div>
              <div className="mt-1 flex items-center gap-1">
                {isPositive ? (
                  <ArrowUpRightIcon
                    className={cn(
                      'size-3 stroke-[2.5]',
                      isSelected ? 'text-[var(--lime)]' : 'text-[var(--pos)]'
                    )}
                  />
                ) : (
                  <ArrowDownRightIcon
                    className={cn(
                      'size-3 stroke-[2.5]',
                      isSelected ? 'text-[var(--neg)]' : 'text-[var(--neg)]'
                    )}
                  />
                )}
                <span
                  className={cn(
                    'text-[11px] font-semibold',
                    isSelected
                      ? isPositive
                        ? 'text-[var(--lime)]'
                        : 'text-[var(--neg)]'
                      : isPositive
                      ? 'text-[var(--pos)]'
                      : 'text-[var(--neg)]'
                  )}
                >
                  {isPositive ? '+' : ''}
                  {cat.delta}%
                </span>
              </div>
            </div>

            {/* Bottom: Progress Bar */}
            <div className="w-full">
              <div
                className={cn(
                  'h-1.5 w-full rounded-full overflow-hidden',
                  isSelected ? 'bg-white/20' : 'bg-[var(--surface-3)]'
                )}
              >
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    isSelected ? 'bg-[var(--lime)]' : 'bg-[var(--ink)]'
                  )}
                  style={{ width: `${cat.share}%` }}
                />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
