// lib/mock/analytics.ts
import { MOCK_SALES, type MockSale } from './sales'

export function getSalesInRange(from: Date, to: Date): MockSale[] {
  const fromTime = from.getTime()
  const toTime = to.getTime()

  return MOCK_SALES.filter((sale) => {
    const saleTime = new Date(sale.created_at).getTime()
    return saleTime >= fromTime && saleTime <= toTime && sale.status !== 'cancelled'
  })
}

export function formatINR(val: number, decimals: number = 2): string {
  const rounded = Math.round(val * 100) / 100
  const parts = rounded.toFixed(decimals).split('.')
  let intPart = parts[0]
  const decPart = parts[1]

  // Indian numbering: last 3 digits, then groups of 2
  let isNegative = false
  if (intPart.startsWith('-')) {
    isNegative = true
    intPart = intPart.slice(1)
  }

  if (intPart.length > 3) {
    const last3 = intPart.slice(-3)
    const rest = intPart.slice(0, -3)
    const formattedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
    intPart = formattedRest + ',' + last3
  }

  const result = (isNegative ? '-' : '') + '₹' + intPart + (decimals > 0 ? '.' + decPart : '')
  return result
}

export function formatINRCompact(val: number): string {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(1)}Cr`
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1)}L`
  }
  if (val >= 1000) {
    return `₹${(val / 1000).toFixed(1)}K`
  }
  return `₹${Math.round(val)}`
}

export function getDashboardKPIs() {
  const completedSales = MOCK_SALES.filter((s) => s.status !== 'cancelled')

  // Let's compute based on October 10, 2026 as the current reference day
  const todaySalesList = completedSales.filter((s) => s.created_at.startsWith('2026-10-10'))
  const todaySales = todaySalesList.reduce((acc, s) => acc + s.taxable_value, 0)
  const todayOrders = todaySalesList.length
  
  const uniqueCusts = new Set(todaySalesList.filter((s) => s.customer_id).map((s) => s.customer_id)).size
  const todayCustomers = uniqueCusts || 5

  const avgOrderValue = todayOrders > 0 ? Math.round(todaySales / todayOrders) : 12028

  const monthSalesList = completedSales.filter((s) => s.created_at.startsWith('2026-10'))
  const monthSales = monthSalesList.reduce((acc, s) => acc + s.taxable_value, 0)
  const monthOrders = monthSalesList.length

  return {
    todaySales: todaySales || 84200,
    todayOrders: todayOrders || 7,
    todayCustomers: todayCustomers || 5,
    avgOrderValue: avgOrderValue || 12028,
    monthSales: monthSales || 784200,
    monthOrders: monthOrders || 132,
    todaySalesDelta: 12.4, // +12.4% vs same time yesterday
    monthSalesDelta: 18.6, // +18.6% vs same days last month
  }
}

export function getLast7DaysChart(): Array<{
  date: string
  fullDate: string
  sales: number
  orders: number
  prev_sales: number
}> {
  return [
    { date: 'Sun', fullDate: '4 Oct', sales: 62400, orders: 5, prev_sales: 58000 },
    { date: 'Mon', fullDate: '5 Oct', sales: 94800, orders: 8, prev_sales: 82000 },
    { date: 'Tue', fullDate: '6 Oct', sales: 71200, orders: 6, prev_sales: 76400 },
    { date: 'Wed', fullDate: '7 Oct', sales: 118500, orders: 11, prev_sales: 89000 },
    { date: 'Thu', fullDate: '8 Oct', sales: 88200, orders: 7, prev_sales: 91200 },
    { date: 'Fri', fullDate: '9 Oct', sales: 142000, orders: 13, prev_sales: 112000 },
    { date: 'Sat', fullDate: '10 Oct', sales: 84200, orders: 7, prev_sales: 74500 },
  ]
}

export function getPaymentBreakdown(from?: Date, to?: Date): Record<string, { amount: number; count: number; share: number }> {
  return {
    UPI: { amount: 486000, count: 68, share: 54 },
    Cash: { amount: 215000, count: 34, share: 24 },
    Card: { amount: 128000, count: 18, share: 14 },
    Finance: { amount: 55000, count: 8, share: 6 },
    Other: { amount: 18000, count: 4, share: 2 },
  }
}

export function getTopProducts(from?: Date, to?: Date, limit: number = 5): Array<{
  name: string
  category: string
  units: number
  sales: number
}> {
  return [
    { name: 'vivo V40 5G', category: 'Phones', units: 28, sales: 839972 },
    { name: 'Samsung Galaxy A35', category: 'Phones', units: 22, sales: 549978 },
    { name: 'OnePlus Nord CE 4', category: 'Phones', units: 19, sales: 436981 },
    { name: '67W SuperVOOC Charger', category: 'Chargers', units: 46, sales: 59754 },
    { name: 'boAt Rockerz 255 Pro+', category: 'Earphones', units: 38, sales: 37962 },
  ].slice(0, limit)
}

export function getCategoryBreakdown(from?: Date, to?: Date): Array<{
  name: string
  category: string
  sales: number
  share: number
  delta: number
}> {
  return [
    { name: 'Phones', category: 'Phones', sales: 532000, share: 68, delta: 18.4 },
    { name: 'Chargers', category: 'Chargers', sales: 117500, share: 15, delta: 8.2 },
    { name: 'Covers & Glass', category: 'Covers & Glass', sales: 78400, share: 10, delta: -3.5 },
    { name: 'Earphones', category: 'Earphones', sales: 56300, share: 7, delta: 12.1 },
  ]
}

export function getSalespersonBreakdown(from?: Date, to?: Date): Array<{
  id: string
  name: string
  sales: number
  orders: number
  initials: string
}> {
  return [
    { id: 'demo-admin-001', name: 'Saksham Sharma', sales: 486200, orders: 78, initials: 'SS' },
    { id: 'sp-002', name: 'Rahul Verma', sales: 298000, orders: 54, initials: 'RV' },
  ]
}

export function getRecentSales(limit: number = 6): MockSale[] {
  return MOCK_SALES.slice(0, limit)
}
