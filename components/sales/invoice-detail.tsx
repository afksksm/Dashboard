'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DownloadIcon,
  PrinterIcon,
  XCircleIcon,
  ArrowLeftIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  ShieldAlertIcon,
} from 'lucide-react'
import { InvoicePreview } from './invoice-preview'
import { cn } from '@/lib/utils'
import type { MockSale } from '@/lib/mock/sales'
import { formatINR } from '@/lib/mock/analytics'

interface InvoiceDetailProps {
  sale: MockSale
}

export function InvoiceDetail({ sale: initialSale }: InvoiceDetailProps) {
  const [sale, setSale] = useState<MockSale>(initialSale)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReasonCategory, setCancelReasonCategory] = useState('Customer returned item')
  const [cancelReasonNote, setCancelReasonNote] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    window.print()
  }

  const handleConfirmCancel = () => {
    if (!cancelReasonNote.trim()) return
    setIsCancelling(true)

    setTimeout(() => {
      setSale((prev) => ({
        ...prev,
        status: 'cancelled',
        cancellation_reason: `${cancelReasonCategory}: ${cancelReasonNote}`,
      }))
      setIsCancelling(false)
      setShowCancelModal(false)
    }, 500)
  }

  const isCancelled = sale.status === 'cancelled'

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/sales"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Sales list</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
              isCancelled
                ? 'bg-[var(--neg-bg)] text-[var(--neg)]'
                : 'bg-[var(--pos-bg)] text-[var(--pos)]'
            )}
          >
            {isCancelled ? 'Cancelled Bill' : 'Completed GST Invoice'}
          </span>
        </div>
      </div>

      {/* Main Grid: Left A4 Preview (7 cols) / Right Actions & Facts (5 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left: Invoice Preview */}
        <div className="lg:col-span-8 flex justify-center overflow-x-auto p-1">
          <InvoicePreview sale={sale} />
        </div>

        {/* Right: Actions, Facts & Timeline */}
        <div className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-24">
          {/* Action Card */}
          <div className="rounded-[24px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col gap-3.5">
            <h3 className="text-sm font-bold text-[var(--ink)]">Actions</h3>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleDownload}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--lime)] font-bold text-xs text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-xs"
              >
                <DownloadIcon className="size-4 stroke-[2.5]" />
                <span>Download A4 PDF</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white font-semibold text-xs text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <PrinterIcon className="size-4" />
                <span>Print Invoice</span>
              </button>

              {!isCancelled && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[var(--neg)] bg-white font-semibold text-xs text-[var(--neg)] hover:bg-[var(--neg-bg)] transition-colors mt-1"
                >
                  <XCircleIcon className="size-4" />
                  <span>Cancel this Invoice</span>
                </button>
              )}
            </div>

            {isCancelled && (
              <div className="rounded-xl bg-[var(--neg-bg)] p-3 text-xs text-[var(--neg)] flex items-start gap-2 border border-[var(--neg)]/20">
                <AlertTriangleIcon className="size-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Cancellation Reason:</span>
                  <p className="mt-0.5 leading-snug">{sale.cancellation_reason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sale Facts Card */}
          <div className="rounded-[24px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[var(--ink)]">Transaction Facts</h3>
            <div className="divide-y divide-[var(--surface-2)] text-xs">
              <div className="flex justify-between py-2 text-[var(--ink-2)]">
                <span className="text-[var(--ink-3)]">Internal Sale ID:</span>
                <span className="font-mono font-bold text-[var(--ink)]">{sale.id}</span>
              </div>
              <div className="flex justify-between py-2 text-[var(--ink-2)]">
                <span className="text-[var(--ink-3)]">Salesperson:</span>
                <span className="font-semibold text-[var(--ink)]">{sale.salesperson_name}</span>
              </div>
              <div className="flex justify-between py-2 text-[var(--ink-2)]">
                <span className="text-[var(--ink-3)]">Created at:</span>
                <span>
                  {new Date(sale.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 text-[var(--ink-2)]">
                <span className="text-[var(--ink-3)]">Total Taxable:</span>
                <span className="tabular-nums font-semibold">{formatINR(sale.taxable_value)}</span>
              </div>
              <div className="flex justify-between py-2 text-[var(--ink-2)]">
                <span className="text-[var(--ink-3)]">GST Amount:</span>
                <span className="tabular-nums font-semibold">{formatINR(sale.cgst + sale.sgst)}</span>
              </div>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="rounded-[24px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[var(--ink)]">Invoice Audit Trail</h3>
            <div className="flex flex-col gap-3 text-xs pl-2 border-l-2 border-[var(--lime-strong)]">
              <div className="flex flex-col">
                <span className="font-bold text-[var(--ink)]">Created & Billed</span>
                <span className="text-[11px] text-[var(--ink-3)]">
                  by {sale.salesperson_name} · Concurrency lock verified
                </span>
              </div>
              {isCancelled && (
                <div className="flex flex-col text-[var(--neg)]">
                  <span className="font-bold">Cancelled</span>
                  <span className="text-[11px] text-[var(--neg)] opacity-90">
                    Mandatory written reason logged · Admin alert fired
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Cancellation Modal ──────────────────────────────────────── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 md:p-7 shadow-2xl border border-[var(--line)] flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[var(--neg)]">
              <div className="flex size-10 items-center justify-center rounded-full bg-[var(--neg-bg)]">
                <ShieldAlertIcon className="size-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">
                  Cancel Invoice {sale.invoice_number}?
                </h3>
                <p className="text-xs text-[var(--ink-3)]">
                  This action is permanent and creates an administrative audit alert.
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              The invoice number stays on record as cancelled (gap-free statutory compliance) and all linked phone IMEIs will be released back to active stock.
            </p>

            <div className="flex flex-col gap-3 my-1">
              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Reason Category (Mandatory)
                </label>
                <select
                  value={cancelReasonCategory}
                  onChange={(e) => setCancelReasonCategory(e.target.value)}
                  className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
                >
                  <option value="Customer returned item">Customer returned item</option>
                  <option value="Incorrect customer GST details">Incorrect customer GST details</option>
                  <option value="Billing operator clerical error">Billing operator clerical error</option>
                  <option value="Hardware IMEI mistype">Hardware IMEI mistype</option>
                  <option value="Other valid shop reason">Other valid shop reason</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Written Explanation Note (Mandatory)
                </label>
                <textarea
                  rows={3}
                  value={cancelReasonNote}
                  onChange={(e) => setCancelReasonNote(e.target.value)}
                  placeholder="Detail the specific rationale for this cancellation…"
                  className="w-full rounded-xl bg-[var(--surface-2)] p-3 text-xs text-[var(--ink)] border border-[var(--line)] outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="h-10 rounded-full px-5 text-xs font-semibold text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
              >
                Keep Invoice Active
              </button>
              <button
                type="button"
                disabled={!cancelReasonNote.trim() || isCancelling}
                onClick={handleConfirmCancel}
                className="h-10 rounded-full bg-[var(--neg)] px-5 text-xs font-bold text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                {isCancelling ? 'Cancelling…' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
