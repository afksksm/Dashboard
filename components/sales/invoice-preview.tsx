'use client'

import { cn } from '@/lib/utils'
import type { MockSale } from '@/lib/mock/sales'
import { formatINR } from '@/lib/mock/analytics'

// Helper to convert number to Indian words
function numberToWordsINR(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ]
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function inWords(n: number): string {
    if (n < 20) return a[n]
    const digit = n % 10
    return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '')
  }

  if (num === 0) return 'Zero Rupees Only'
  let str = ''

  const crore = Math.floor(num / 10000000)
  num %= 10000000
  const lakh = Math.floor(num / 100000)
  num %= 100000
  const thousand = Math.floor(num / 1000)
  num %= 1000
  const hundred = Math.floor(num / 100)
  const rem = num % 100

  if (crore > 0) str += inWords(crore) + ' Crore '
  if (lakh > 0) str += inWords(lakh) + ' Lakh '
  if (thousand > 0) str += inWords(thousand) + ' Thousand '
  if (hundred > 0) str += inWords(hundred) + ' Hundred '
  if (rem > 0) str += inWords(rem) + ' '

  return 'Rupees ' + str.trim() + ' Only'
}

interface InvoicePreviewProps {
  sale: MockSale
  className?: string
}

export function InvoicePreview({ sale, className }: InvoicePreviewProps) {
  const isCancelled = sale.status === 'cancelled'

  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-[800px] bg-white text-[var(--ink)] shadow-2xl border border-[var(--line)] rounded-sm p-8 sm:p-10 font-sans print:shadow-none print:border-none print:p-0',
        className
      )}
      style={{ minHeight: '1050px' }}
    >
      {/* 3mm Lime accent bar at top per DESIGN.md */}
      <div className="absolute top-0 left-0 right-0 h-[3.5mm] bg-[var(--lime)]" />

      {/* Cancelled watermark */}
      {isCancelled && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20 overflow-hidden">
          <span className="rotate-[-35deg] text-7xl sm:text-8xl font-black uppercase tracking-widest text-[var(--neg)] opacity-15 select-none border-8 border-[var(--neg)] py-4 px-12 rounded-2xl">
            CANCELLED
          </span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between gap-6 pt-3 pb-6 border-b border-neutral-200">
        {/* Left: Shop identity */}
        <div className="flex flex-col max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--ink)] text-white text-xs font-bold">
              MC
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">
              Mittal Communication
            </h1>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Shop No. 12, Main Rohtak Road, Nangloi, New Delhi - 110041
          </p>
          <p className="text-xs text-neutral-600 mt-0.5">
            Phone: +91 98765 43210 · Email: billing@mittalcommunication.in
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-800">
            <span>GSTIN:</span>
            <span className="bg-neutral-100 px-1.5 py-0.5 rounded">07ABCDE1234F1Z5</span>
          </div>
        </div>

        {/* Right: Invoice Meta */}
        <div className="flex flex-col sm:items-end text-left sm:text-right">
          <span className="text-lg font-black tracking-wider uppercase text-neutral-900 border-b-2 border-neutral-900 pb-0.5">
            TAX INVOICE
          </span>
          <div className="mt-3 flex flex-col gap-1 text-xs text-neutral-700">
            <div className="flex sm:justify-end gap-2">
              <span className="text-neutral-500">Invoice No:</span>
              <strong className="font-mono text-neutral-900 font-bold">{sale.invoice_number}</strong>
            </div>
            <div className="flex sm:justify-end gap-2">
              <span className="text-neutral-500">Invoice Date:</span>
              <span>{new Date(sale.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex sm:justify-end gap-2">
              <span className="text-neutral-500">Sale ID:</span>
              <span className="font-mono text-neutral-600">{sale.id}</span>
            </div>
            <div className="flex sm:justify-end gap-2">
              <span className="text-neutral-500">Place of Supply:</span>
              <span className="font-semibold text-neutral-800">Delhi (State Code: 07)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill-to Section */}
      <div className="my-5 rounded-md bg-neutral-50 p-4 border border-neutral-200 flex flex-col sm:flex-row justify-between gap-4 text-xs">
        <div className="flex flex-col">
          <span className="font-semibold uppercase tracking-wider text-neutral-500 text-[10px] mb-1">
            Billed To:
          </span>
          <span className="font-bold text-sm text-neutral-900">
            {sale.customer_name || 'Walk-in Customer'}
          </span>
          {sale.customer_phone && (
            <span className="text-neutral-600 mt-0.5">
              Phone: {sale.customer_phone}
            </span>
          )}
          <span className="text-neutral-500 mt-0.5">Delhi NCR, India</span>
        </div>

        <div className="flex flex-col sm:items-end text-left sm:text-right">
          <span className="font-semibold uppercase tracking-wider text-neutral-500 text-[10px] mb-1">
            Billed By:
          </span>
          <span className="font-semibold text-neutral-800">{sale.salesperson_name}</span>
          <span className="text-neutral-500">Terminal Nangloi Counter 1</span>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 border-y border-neutral-300 text-[11px] font-bold text-neutral-700 uppercase">
              <th className="py-2.5 px-2 w-8 text-center">#</th>
              <th className="py-2.5 px-3">Description of Goods</th>
              <th className="py-2.5 px-2 w-16">HSN</th>
              <th className="py-2.5 px-2 w-10 text-center">Qty</th>
              <th className="py-2.5 px-3 w-20 text-right">Rate</th>
              <th className="py-2.5 px-2 w-16 text-right">Disc.</th>
              <th className="py-2.5 px-3 w-22 text-right">Taxable</th>
              <th className="py-2.5 px-3 w-20 text-right">GST</th>
              <th className="py-2.5 px-3 w-24 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {sale.items.map((item, idx) => (
              <tr key={idx} className="align-top">
                <td className="py-2.5 px-2 text-center text-neutral-500">{idx + 1}</td>
                <td className="py-2.5 px-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-900">{item.product_name}</span>
                    {item.variant && (
                      <span className="text-[11px] text-neutral-600 italic">
                        {item.variant}
                      </span>
                    )}
                    {item.imeis && item.imeis.length > 0 && (
                      <div className="mt-1 flex flex-col font-mono text-[10px] text-neutral-700">
                        {item.imeis.map((imei, iIdx) => (
                          <span key={iIdx}>IMEI {iIdx + 1}: {imei}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-2 font-mono text-neutral-600">85171200</td>
                <td className="py-2.5 px-2 text-center font-bold text-neutral-800">{item.quantity}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-neutral-700">
                  {formatINR(item.price_before_gst)}
                </td>
                <td className="py-2.5 px-2 text-right tabular-nums text-neutral-700">
                  {formatINR(item.discount_amount)}
                </td>
                <td className="py-2.5 px-3 text-right font-medium tabular-nums text-neutral-800">
                  {formatINR(item.taxable_value)}
                </td>
                <td className="py-2.5 px-3 text-right text-neutral-600 tabular-nums">
                  {item.gst_rate}%
                </td>
                <td className="py-2.5 px-3 text-right font-bold tabular-nums text-neutral-900">
                  {formatINR(item.line_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & Tax Breakup section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 pt-4 border-t border-neutral-200">
        {/* Left: Amount in words & Payments */}
        <div className="flex flex-col justify-between gap-4 text-xs">
          <div>
            <span className="font-semibold text-neutral-500 uppercase tracking-wide text-[10px] block mb-1">
              Amount Chargeable (in words):
            </span>
            <p className="font-bold text-neutral-900 text-sm leading-snug">
              {numberToWordsINR(sale.total)}
            </p>
          </div>

          <div>
            <span className="font-semibold text-neutral-500 uppercase tracking-wide text-[10px] block mb-1">
              Payment Summary:
            </span>
            <div className="flex flex-col gap-1">
              {sale.payments.map((p, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2 font-medium text-neutral-800">
                  <span>Paid via {p.method}:</span>
                  <span className="font-bold tabular-nums">{formatINR(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tax Breakdown */}
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-700">
            <span>Taxable Value (Total):</span>
            <span className="font-semibold tabular-nums">{formatINR(sale.taxable_value)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-700">
            <span>Central Tax (CGST 9%):</span>
            <span className="font-semibold tabular-nums">{formatINR(sale.cgst)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-700">
            <span>State Tax (SGST 9%):</span>
            <span className="font-semibold tabular-nums">{formatINR(sale.sgst)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-500 text-[11px]">
            <span>Round-off adjustment:</span>
            <span className="font-mono tabular-nums">{formatINR(sale.round_off)}</span>
          </div>
          <div className="flex justify-between py-2.5 border-t-2 border-neutral-900 text-sm font-black text-neutral-900">
            <span>Total Invoice Value:</span>
            <span className="text-base font-black tabular-nums">{formatINR(sale.total)}</span>
          </div>
        </div>
      </div>

      {/* Footer & Declaration */}
      <div className="mt-12 pt-6 border-t border-neutral-300 text-xs text-neutral-600 flex flex-col sm:flex-row justify-between items-end gap-6">
        <div className="max-w-md flex flex-col gap-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-neutral-500">
            Terms & Conditions:
          </span>
          <p className="text-[11px] leading-relaxed text-neutral-500">
            1. Goods once sold will only be replaced as per manufacturer warranty policy.
            2. Customer must produce original tax invoice for all warranty claims.
            3. Subject to Delhi jurisdiction only.
          </p>
          <span className="text-[10px] text-neutral-400 mt-2">
            This is an electronically generated and certified tax invoice.
          </span>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-center text-center w-52">
          <div className="h-14 border-b border-neutral-400 w-full mb-1 flex items-end justify-center pb-1">
            <span className="text-xs font-serif italic text-neutral-700">Authorised Signatory</span>
          </div>
          <span className="text-[11px] font-bold text-neutral-800">For Mittal Communication</span>
        </div>
      </div>
    </div>
  )
}
