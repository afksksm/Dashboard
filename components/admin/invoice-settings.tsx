'use client'

import { useState } from 'react'
import { FileTextIcon, LockIcon, SaveIcon } from 'lucide-react'

export function InvoiceSettingsPage() {
  const [invoicePrefix] = useState('MC/26-27/')
  const [footerTerms, setFooterTerms] = useState(
    '1. Goods once sold will only be replaced as per manufacturer warranty policy.\n2. Customer must produce original tax invoice for all warranty claims.\n3. Subject to Delhi jurisdiction only.'
  )
  const [declaration, setDeclaration] = useState('This is a computer-generated tax invoice.')
  const [showImeiOnPrint, setShowImeiOnPrint] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
          GST Invoice &amp; Series Configuration
        </h1>
        <p className="text-xs text-[var(--ink-3)] mt-0.5">
          Manage sequential numbering rules, terms of sale, and statutory footer declarations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form (7 cols) */}
        <div className="lg:col-span-7 rounded-[28px] bg-white p-6 md:p-8 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
          <form onSubmit={handleSave} className="flex flex-col gap-5 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
              <FileTextIcon className="size-4 text-[var(--ink-3)]" />
              <span>Invoice Format Parameters</span>
            </h2>

            {/* Prefix Field (Locked) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide">
                  Financial Year Invoice Series Prefix
                </label>
                <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--amber-crm)]">
                  <LockIcon className="size-3" />
                  <span>Series Locked</span>
                </span>
              </div>
              <input
                type="text"
                readOnly
                value={invoicePrefix}
                className="h-10 w-full rounded-xl bg-[var(--surface-3)] px-3 font-mono text-xs font-bold text-[var(--ink-3)] border border-[var(--line)] cursor-not-allowed outline-none"
              />
              <p className="text-[11px] text-[var(--ink-3)] mt-1">
                Locked: The statutory financial year series (MC/26-27/00001) cannot be changed once bills are finalized in order to prevent gap-sequence tax audits.
              </p>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                Standard Terms &amp; Warranty Conditions
              </label>
              <textarea
                rows={4}
                value={footerTerms}
                onChange={(e) => setFooterTerms(e.target.value)}
                className="w-full rounded-xl bg-[var(--surface-2)] p-3 text-xs text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)] resize-none"
              />
            </div>

            {/* Declaration */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                Footer Declaration Text
              </label>
              <input
                type="text"
                value={declaration}
                onChange={(e) => setDeclaration(e.target.value)}
                className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)]"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-[var(--surface-2)] flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-[var(--ink)]">Print IMEI numbers directly on line items</span>
                  <p className="text-[11px] text-[var(--ink-3)]">Recommended for mobile handset warranty verification</p>
                </div>
                <input
                  type="checkbox"
                  checked={showImeiOnPrint}
                  onChange={(e) => setShowImeiOnPrint(e.target.checked)}
                  className="rounded size-4 text-[var(--ink)] focus:ring-[var(--lime)]"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--pos)]">
                {saved && '✓ Invoice layout settings saved'}
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 h-11 rounded-full bg-[var(--lime)] px-6 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors shadow-xs"
              >
                <SaveIcon className="size-4" />
                <span>Save Invoice Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview of Footer (5 cols) */}
        <div className="lg:col-span-5 rounded-[28px] bg-white p-6 border border-[var(--line)] shadow-sm flex flex-col gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--indigo-crm)]">
            Live Invoice Footer Preview
          </span>
          <div className="rounded-xl bg-white p-5 border border-neutral-300 shadow-inner flex flex-col gap-3 text-xs">
            <span className="font-bold text-[10px] uppercase text-neutral-500">Terms &amp; Conditions:</span>
            <div className="whitespace-pre-line text-neutral-600 text-[11px] leading-relaxed">
              {footerTerms}
            </div>
            <p className="text-[10px] text-neutral-400 pt-2 border-t border-neutral-100">{declaration}</p>
            <div className="flex justify-end pt-4">
              <div className="border-t border-neutral-300 w-36 text-center pt-1 text-[10px] font-bold text-neutral-700">
                Authorised Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
