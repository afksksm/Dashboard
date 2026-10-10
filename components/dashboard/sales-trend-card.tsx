'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ArrowUpRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatINRCompact } from '@/lib/mock/analytics'

export type ChartPoint = {
  date: string
  fullDate: string
  sales: number
  orders: number
  prev_sales: number
}

interface SalesTrendCardProps {
  data: ChartPoint[]
  heroAmount: number
  heroPaise?: string
  delta: number
  ordersCount: number
  avgOrderValue: number
  bestDay: string
}

export function SalesTrendCard({
  data,
  heroAmount,
  heroPaise = '.00',
  delta,
  ordersCount,
  avgOrderValue,
  bestDay,
}: SalesTrendCardProps) {
  const [chartMode, setChartMode] = useState<'line' | 'bar'>('line')
  const [compareEnabled, setCompareEnabled] = useState(true)
  const [range, setRange] = useState<'7D' | 'Month' | '6M' | 'Year'>('7D')

  // Indian format for hero integer part
  const formattedHeroInt = '₹' + heroAmount.toLocaleString('en-IN')

  return (
    <div className="flex flex-col rounded-[28px] bg-white p-5 md:p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
      {/* Card Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[var(--surface-2)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)] sm:text-xl">
              Sales trend
            </h2>
            <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--ink-3)]">
              Before GST
            </span>
          </div>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">
            Non-cancelled sales net of credit notes
          </p>
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Range pills */}
          <div className="inline-flex rounded-full bg-[var(--surface-2)] p-1 border border-[var(--line)]">
            {(['7D', 'Month', '6M', 'Year'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-all',
                  range === r
                    ? 'bg-[var(--ink)] text-white shadow-sm'
                    : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
                )}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Line / Bar toggle */}
          <div className="inline-flex rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-0.5">
            <button
              type="button"
              onClick={() => setChartMode('line')}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                chartMode === 'line'
                  ? 'bg-white text-[var(--ink)] shadow-xs'
                  : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
              )}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setChartMode('bar')}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                chartMode === 'bar'
                  ? 'bg-white text-[var(--ink)] shadow-xs'
                  : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
              )}
            >
              Bar
            </button>
          </div>

          {/* Compare toggle */}
          <label className="hidden md:flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--ink-3)] select-none">
            <input
              type="checkbox"
              checked={compareEnabled}
              onChange={(e) => setCompareEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-8 h-4.5 bg-[var(--surface-3)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-[var(--line)] after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--ink)]" />
            <span>Compare</span>
          </label>
        </div>
      </div>

      {/* Main Content: Left stats + Right chart */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left block (30%) */}
        <div className="flex flex-col gap-4 lg:col-span-4 lg:pr-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              Total {range === '7D' ? 'Last 7 Days' : range} Sales
            </span>
            <div className="mt-1 flex items-baseline">
              <span className="text-4xl font-bold tracking-tight text-[var(--ink)] tabular-nums sm:text-5xl">
                {formattedHeroInt}
              </span>
              <span className="hero-paise text-xl ml-0.5">{heroPaise}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lime-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--pos)]">
                <ArrowUpRightIcon className="size-3.5 stroke-[2.5]" />
                +{delta}%
              </span>
              <span className="text-xs text-[var(--ink-3)] font-medium">
                vs previous period
              </span>
            </div>
          </div>

          {/* Stat rows with dotted leaders */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--line)]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--ink-3)]">Completed orders</span>
              <span className="font-semibold text-[var(--ink)] tabular-nums">{ordersCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--ink-3)]">Avg. order value</span>
              <span className="font-semibold text-[var(--ink)] tabular-nums">
                ₹{avgOrderValue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--ink-3)]">Best performance</span>
              <span className="font-semibold text-[var(--ink)]">{bestDay}</span>
            </div>
          </div>

          <p className="text-[11px] text-[var(--ink-4)] leading-tight italic">
            * Cancelled invoices and refunds are excluded from trend analytics.
          </p>
        </div>

        {/* Right block: Recharts (70%) */}
        <div className="h-[280px] w-full lg:col-span-8 sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'line' ? (
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D5F65A" stopOpacity={0.65} />
                    <stop offset="90%" stopColor="#D5F65A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6E7268', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6E7268', fontSize: 11 }}
                  tickFormatter={formatINRCompact}
                />
                <Tooltip
                  cursor={{ stroke: '#121410', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload as ChartPoint
                      return (
                        <div className="rounded-[12px] bg-[var(--ink)] px-3 py-2 text-white shadow-xl">
                          <p className="text-sm font-bold tracking-tight">
                            ₹{p.sales.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[11px] text-[var(--ink-4)] mt-0.5">
                            {p.fullDate} · {p.orders} orders
                          </p>
                          {compareEnabled && p.prev_sales && (
                            <p className="text-[10px] text-[var(--lime)] mt-1 pt-1 border-t border-white/10">
                              Prev: ₹{p.prev_sales.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                {compareEnabled && (
                  <Area
                    type="monotone"
                    dataKey="prev_sales"
                    stroke="#8FA336"
                    strokeWidth={1.5}
                    strokeDasharray="6 6"
                    fill="none"
                    isAnimationActive={false}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#121410"
                  strokeWidth={2.2}
                  fill="url(#limeGradient)"
                  activeDot={{ r: 5, fill: '#121410', stroke: '#D5F65A', strokeWidth: 3 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6E7268', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6E7268', fontSize: 11 }}
                  tickFormatter={formatINRCompact}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload as ChartPoint
                      return (
                        <div className="rounded-[12px] bg-[var(--ink)] px-3 py-2 text-white shadow-xl">
                          <p className="text-sm font-bold">₹{p.sales.toLocaleString('en-IN')}</p>
                          <p className="text-[11px] text-[var(--ink-4)]">{p.fullDate} · {p.orders} orders</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="#D5F65A"
                  radius={[8, 8, 0, 0]}
                  className="hover:fill-[var(--ink)] transition-colors cursor-pointer"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
