'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusIcon, DownloadIcon } from 'lucide-react'
import { KpiCard } from './kpi-card'
import { SalesTrendCard } from './sales-trend-card'
import { CategoryCards } from './category-cards'
import { RecentSalesWidget } from './recent-sales-widget'
import { PaymentMethodsWidget } from './payment-methods-widget'
import { TopProductsWidget } from './top-products-widget'
import { SalespeopleWidget } from './salespeople-widget'
import { ActivityStream } from './activity-stream'
import { ShopHealthWidget } from './shop-health-widget'
import {
  getDashboardKPIs,
  getLast7DaysChart,
  getCategoryBreakdown,
  getPaymentBreakdown,
  getTopProducts,
  getSalespersonBreakdown,
  getRecentSales,
} from '@/lib/mock/analytics'
import { MOCK_ACTIVITY } from '@/lib/mock/activity'
import type { UserProfile } from '@/lib/supabase/domain'

function getGreeting(name: string) {
  const hour = new Date().getHours()
  const firstName = name.trim().split(/\s+/)[0] || 'Saksham'
  if (hour >= 5 && hour < 12) return `Good morning, ${firstName}`
  if (hour >= 12 && hour < 17) return `Good afternoon, ${firstName}`
  if (hour >= 17 && hour < 21) return `Good evening, ${firstName}`
  return `Hello, ${firstName}`
}

export function DashboardPage({ profile }: { profile: UserProfile }) {
  const kpis = getDashboardKPIs()
  const chartData = getLast7DaysChart()
  const categories = getCategoryBreakdown()
  const paymentData = getPaymentBreakdown()
  const topProducts = getTopProducts()
  const salespeople = getSalespersonBreakdown()
  const recentSales = getRecentSales()

  const todayDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase().replace(',', ' ·')

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* ── Page Header (ref-01 Bond CRM style) ────────────────────── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pt-1 sm:pt-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ink-3)]">
            {todayDateFormatted}
          </span>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl lg:text-[44px] leading-tight">
            {getGreeting(profile.full_name)}
          </h1>
          <p className="text-sm font-medium text-[var(--ink-2)] max-w-2xl mt-0.5">
            You have <strong className="font-semibold text-[var(--ink)]">7 sales so far today</strong>, totaling ₹84,200 before GST. Yesterday closed at 11 sales.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/export"
            className="flex h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors shadow-xs"
          >
            <DownloadIcon className="size-3.5" />
            <span>Export summary</span>
          </Link>
          <Link
            href="/sales/new"
            className="flex h-10 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all active:scale-[0.98] shadow-xs"
          >
            <PlusIcon className="size-4 stroke-[2.5]" />
            <span>New sale</span>
          </Link>
        </div>
      </section>

      {/* ── KPI Row (4 cards) ──────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Today's sales"
          value={`₹${(kpis.todaySales / 1000).toFixed(1)}K`}
          subline={`${kpis.todayOrders} non-cancelled orders`}
          delta={kpis.todaySalesDelta}
          sparkline={[45, 52, 60, 55, 70, 78, 84]}
        />
        <KpiCard
          label="Today's orders"
          value={String(kpis.todayOrders)}
          subline={`from ${kpis.todayCustomers} unique customers`}
          delta={8.3}
          sparkline={[4, 5, 5, 6, 8, 9, 7]}
        />
        <KpiCard
          label="Avg. order value"
          value={`₹${kpis.avgOrderValue.toLocaleString('en-IN')}`}
          subline="across today's orders"
          delta={4.1}
          sparkline={[11200, 11500, 11800, 12400, 12028]}
        />
        <KpiCard
          label="This month"
          value={`₹${(kpis.monthSales / 100000).toFixed(2)}L`}
          subline={`${kpis.monthOrders} orders MTD`}
          delta={kpis.monthSalesDelta}
          sparkline={[580, 620, 690, 720, 784]}
        />
      </section>

      {/* ── Main Layout: 2 Columns (Main content 8 / Right rail 4) ─── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left Column (8 cols): Trend, Categories, Activity */}
        <div className="flex flex-col gap-6 xl:col-span-8">
          {/* Sales Trend Hero Card */}
          <SalesTrendCard
            data={chartData}
            heroAmount={784200}
            heroPaise=".00"
            delta={18.6}
            ordersCount={132}
            avgOrderValue={12028}
            bestDay="Sat, ₹1.42L"
          />

          {/* Category breakdown cards */}
          <CategoryCards categories={categories} />

          {/* Activity stream */}
          <ActivityStream activities={MOCK_ACTIVITY} />
        </div>

        {/* Right Rail Column (4 cols): Widgets */}
        <div className="flex flex-col gap-6 xl:col-span-4">
          {/* Recent sales */}
          <RecentSalesWidget sales={recentSales} />

          {/* Payment breakdown hatched bars */}
          <PaymentMethodsWidget data={paymentData} />

          {/* Top products hatched bars */}
          <TopProductsWidget products={topProducts} />

          {/* Salespeople ranking */}
          <SalespeopleWidget salespeople={salespeople} />

          {/* Shop health & backup status */}
          <ShopHealthWidget />
        </div>
      </div>
    </div>
  )
}
