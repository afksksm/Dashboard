'use client'

import { ArrowUpRightIcon, ArrowDownRightIcon } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  subline: string
  delta?: number
  deltaLabel?: string
  sparkline?: number[]
  className?: string
}

export function KpiCard({
  label,
  value,
  subline,
  delta,
  deltaLabel,
  sparkline,
  className,
}: KpiCardProps) {
  const isPositive = delta !== undefined && delta >= 0
  const sparkData = sparkline?.map((val, idx) => ({ idx, val }))

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-[20px] bg-white p-5 border border-[var(--line)]',
        'shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] transition-all',
        className
      )}
    >
      {/* Top: Label */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--indigo-crm)]">
          {label}
        </span>
      </div>

      {/* Middle: Value + Delta chip */}
      <div className="my-3 flex items-baseline gap-2.5 flex-wrap">
        <span className="text-3xl font-semibold tracking-[-0.025em] text-[var(--ink)] tabular-nums sm:text-[34px]">
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              isPositive
                ? 'bg-[var(--pos-bg)] text-[var(--pos)]'
                : 'bg-[var(--neg-bg)] text-[var(--neg)]'
            )}
            title={deltaLabel || `${isPositive ? '+' : ''}${delta}%`}
          >
            {isPositive ? (
              <ArrowUpRightIcon className="size-3.5 stroke-[2.5]" />
            ) : (
              <ArrowDownRightIcon className="size-3.5 stroke-[2.5]" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {delta}%
            </span>
          </span>
        )}
      </div>

      {/* Bottom: Subline & Sparkline */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--surface-2)]">
        <span className="text-xs text-[var(--ink-3)] font-medium truncate">{subline}</span>
        {sparkData && sparkData.length > 0 && (
          <div className="h-7 w-20 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke="var(--indigo-crm)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
