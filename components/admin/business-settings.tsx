'use client'

import { useState } from 'react'
import { Building2Icon, CheckIcon, SaveIcon } from 'lucide-react'

export function BusinessSettingsPage() {
  const [bizName, setBizName] = useState('Mittal Communication')
  const [address, setAddress] = useState('Shop No. 12, Main Rohtak Road, Nangloi, New Delhi - 110041')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [email, setEmail] = useState('billing@mittalcommunication.in')
  const [gstin, setGstin] = useState('07ABCDE1234F1Z5')
  const [stateCode, setStateCode] = useState('Delhi (State Code: 07)')
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
          Shop &amp; Business Profile Settings
        </h1>
        <p className="text-xs text-[var(--ink-3)] mt-0.5">
          Configure legal entity data rendered across all customer-facing GST tax invoices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Form (7 cols) */}
        <div className="lg:col-span-7 rounded-[28px] bg-white p-6 md:p-8 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
          <form onSubmit={handleSave} className="flex flex-col gap-5 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
              <Building2Icon className="size-4 text-[var(--ink-3)]" />
              <span>Statutory Entity Details</span>
            </h2>

            <div>
              <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                Registered Trade Name (Shop Name)
              </label>
              <input
                type="text"
                required
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-bold text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                Shop Address (Printed on Invoices)
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl bg-[var(--surface-2)] p-3 text-xs text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Counter Support Phone
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 font-mono text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Billing Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-medium text-[var(--ink)] border border-[var(--line)] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  15-Digit Shop GSTIN
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 font-mono text-xs font-bold text-[var(--ink)] border border-[var(--line)] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Place of Supply State Jurisdiction
                </label>
                <input
                  type="text"
                  required
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--pos)]">
                {saved && '✓ Business profile configuration saved'}
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 h-11 rounded-full bg-[var(--lime)] px-6 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors shadow-xs"
              >
                <SaveIcon className="size-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Invoice Header Preview (5 cols) */}
        <div className="lg:col-span-5 rounded-[28px] bg-white p-6 border border-[var(--line)] shadow-sm flex flex-col gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--indigo-crm)]">
            Live Invoice Header Preview
          </span>
          <p className="text-xs text-[var(--ink-3)]">
            Updates in real-time as you modify values on the left
          </p>

          <div className="mt-2 rounded-xl bg-white p-5 border border-neutral-300 shadow-inner flex flex-col gap-3 text-xs">
            <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-200">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--ink)] text-white font-bold text-xs">
                MC
              </div>
              <span className="font-bold text-sm text-neutral-900">{bizName}</span>
            </div>

            <p className="text-neutral-600 leading-snug">{address}</p>
            <p className="text-neutral-600">Phone: {phone} · Email: {email}</p>
            <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-800">
              <span>GSTIN:</span>
              <span className="bg-neutral-100 px-1.5 py-0.5 rounded">{gstin}</span>
            </div>
            <p className="text-neutral-500 font-medium">Place of Supply: {stateCode}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
