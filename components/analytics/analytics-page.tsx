'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  CalendarIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  TrendingUpIcon,
  UsersIcon,
  CreditCardIcon,
  PackageIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getLast7DaysChart,
  getCategoryBreakdown,
  getPaymentBreakdown,
  getTopProducts,
  getSalespersonBreakdown,
  formatINR,
  formatINRCompact,
} from '@/lib/mock/analytics'

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'salespeople' | 'payments'>('overview')
  const [range, setRange] = useState<'7D' | 'Month' | '6M' | 'Year'>('Month')
  const [compareEnabled, setCompareEnabled] = useState(true)

  const chartData = getLast7DaysChart()
  const categories = getCategoryBreakdown()
  const paymentData = getPaymentBreakdown()
  const topProducts = getTopProducts(undefined, undefined, 10)
  const salespeople = getSalespersonBreakdown()

  const pieColors = ['#D5F65A', '#D99A0B', '#F28A1F', '#2E3B8F', '#5ED6B0']
  const paymentPieData = Object.entries(paymentData).map(([name, val]) => ({
    name,
    value: val.amount,
    count: val.count,
  }))

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
            Business Analytics &amp; Reports
          </h1>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">
            Real-time financial intelligence aggregated from confirmed GST sales
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-1)] px-4 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors shadow-xs"
          >
            <DownloadIcon className="size-3.5" />
            <span>Export PDF Report</span>
          </button>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-1)] px-4 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors shadow-xs"
          >
            <FileSpreadsheetIcon className="size-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Control Strip: Range Selector & Compare Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] bg-[var(--surface-1)] p-4 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'overview', label: 'Revenue Overview', icon: TrendingUpIcon },
              { id: 'products', label: 'Product Performance', icon: PackageIcon },
              { id: 'salespeople', label: 'Sales Staff', icon: UsersIcon },
              { id: 'payments', label: 'Payment Tenders', icon: CreditCardIcon },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-[var(--ink)] text-white shadow-xs'
                    : 'bg-[var(--surface-2)] text-[var(--ink-3)] hover:text-[var(--ink)]'
                )}
              >
                <Icon className={cn('size-3.5', isActive ? 'text-[var(--lime)]' : '')} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Range Pill Selector */}
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-full bg-[var(--surface-2)] p-1 border border-[var(--line)]">
            {(['7D', 'Month', '6M', 'Year'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-all',
                  range === r
                    ? 'bg-[var(--ink)] text-white shadow-xs'
                    : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content: Revenue Overview ─────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          {/* Hero Area Chart */}
          <div className="rounded-[28px] bg-[var(--surface-1)] p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--surface-2)]">
              <div>
                <h3 className="text-lg font-bold text-[var(--ink)]">Taxable Revenue Trajectory</h3>
                <p className="text-xs text-[var(--ink-3)]">Excluding GST · Solid line current period, dashed previous period</p>
              </div>
              <span className="font-bold text-xs bg-[var(--lime-soft)] text-[var(--ink)] px-3 py-1 rounded-full">
                +18.6% Growth YoY
              </span>
            </div>

            <div className="h-80 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsLime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D5F65A" stopOpacity={0.65} />
                      <stop offset="90%" stopColor="#D5F65A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6E7268', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6E7268', fontSize: 11 }} tickFormatter={formatINRCompact} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0].payload
                        return (
                          <div className="rounded-xl bg-[var(--ink)] p-3 text-white shadow-xl">
                            <span className="text-sm font-bold">₹{p.sales.toLocaleString('en-IN')}</span>
                            <span className="block text-[11px] text-[var(--ink-4)]">{p.fullDate}</span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area type="monotone" dataKey="prev_sales" stroke="#8FA336" strokeWidth={1.5} strokeDasharray="6 6" fill="none" />
                  <Area type="monotone" dataKey="sales" stroke="#121410" strokeWidth={2.5} fill="url(#analyticsLime)" activeDot={{ r: 5, fill: '#121410', stroke: '#D5F65A', strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown by Category Table */}
          <div className="rounded-[24px] bg-[var(--surface-1)] border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] overflow-hidden">
            <div className="p-5 border-b border-[var(--line)]">
              <h3 className="text-sm font-bold text-[var(--ink)]">Category Sales Contribution</h3>
              <p className="text-xs text-[var(--ink-3)]">Product volume and growth breakdown</p>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] font-semibold text-[var(--ink-3)] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Revenue (Excl. GST)</th>
                  <th className="py-3 px-4 text-center">Share of Sales</th>
                  <th className="py-3 px-4 text-right">Growth vs Prev</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-2)]">
                {categories.map((c) => (
                  <tr key={c.name} className="h-12 hover:bg-[var(--surface-2)]">
                    <td className="py-3 px-4 font-bold text-[var(--ink)]">{c.name}</td>
                    <td className="py-3 px-4 text-right font-bold text-[var(--ink)] tabular-nums">{formatINR(c.sales)}</td>
                    <td className="py-3 px-4 text-center font-semibold text-[var(--ink-2)]">{c.share}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn('font-bold', c.delta >= 0 ? 'text-[var(--pos)]' : 'text-[var(--neg)]')}>
                        {c.delta >= 0 ? '+' : ''}{c.delta}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab Content: Products ─────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="flex flex-col gap-6">
          <div className="rounded-[28px] bg-[var(--surface-1)] p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-1">Top Selling Items by Revenue</h3>
            <p className="text-xs text-[var(--ink-3)] mb-6">Unit shipments and pre-tax turnover</p>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={formatINRCompact} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#121410' }} width={140} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0].payload
                        return (
                          <div className="rounded-xl bg-[var(--ink)] p-3 text-white shadow-xl">
                            <span className="text-xs font-bold">{p.name}</span>
                            <span className="block text-sm font-bold text-[var(--lime)] mt-1">₹{p.sales.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-[var(--ink-4)]">{p.units} units shipped</span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="sales" fill="#D5F65A" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab Content: Salespeople ──────────────────────────────── */}
      {activeTab === 'salespeople' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salespeople.map((sp) => (
            <div key={sp.id} className="rounded-[28px] bg-[var(--surface-1)] p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--lime-soft)] text-sm font-bold text-[var(--ink)]">
                    {sp.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)]">{sp.name}</h3>
                    <span className="text-xs text-[var(--ink-3)]">Shop Biller · ID {sp.id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="rounded-2xl bg-[var(--surface-2)] p-4 border border-[var(--line)]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-3)]">Total Billed</span>
                    <div className="text-xl font-bold text-[var(--ink)] tabular-nums mt-1">
                      {formatINR(sp.sales)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-2)] p-4 border border-[var(--line)]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-3)]">Orders Billed</span>
                    <div className="text-xl font-bold text-[var(--ink)] tabular-nums mt-1">
                      {sp.orders} bills
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--ink-3)]">
                <span>Avg. Basket Value:</span>
                <span className="font-bold text-[var(--ink)] tabular-nums">
                  ₹{Math.round(sp.sales / sp.orders).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab Content: Payments ─────────────────────────────────── */}
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-[28px] bg-[var(--surface-1)] p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
            <h3 className="text-base font-bold text-[var(--ink)] mb-4">Payment Method Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-[28px] bg-[var(--surface-1)] p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--ink)] mb-4">Tender Totals</h3>
              <div className="divide-y divide-[var(--surface-2)]">
                {paymentPieData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between py-3">
<div className="flex flex-wrap items-center gap-2.5">
                      <div className="size-3 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                      <span className="text-xs font-bold text-[var(--ink)]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--ink-3)]">{item.count} transactions</span>
                      <span className="text-xs font-bold text-[var(--ink)] tabular-nums">{formatINR(item.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
