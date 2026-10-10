'use client'

import { useState } from 'react'
import {
  UploadCloudIcon,
  FileSpreadsheetIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  XCircleIcon,
  ArrowRightIcon,
  DownloadIcon,
  FileCheckIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImportPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [importType, setImportType] = useState<'products' | 'historical_sales'>('products')
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)

  const steps = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Validate' },
    { num: 3, label: 'Preview' },
    { num: 4, label: 'Confirm' },
  ]

  const handleSimulateUpload = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setCurrentStep(2)
    }, 800)
  }

  const handleExecuteImport = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setCompleted(true)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
          Import Data
        </h1>
        <p className="text-xs text-[var(--ink-3)] mt-0.5">
          Migrate existing inventory catalogs or historical paper bills into Mittal CRM with strict schema validation
        </p>
      </div>

      {/* Stepper (Horizontal) */}
      <div className="rounded-[20px] bg-white p-4 sm:p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((st, idx) => {
            const isCurrent = currentStep === st.num
            const isDone = currentStep > st.num
            return (
              <div key={st.num} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                      isCurrent
                        ? 'bg-[var(--lime)] text-[var(--ink)] shadow-xs ring-4 ring-[var(--lime-soft)]'
                        : isDone
                        ? 'bg-[var(--ink)] text-white'
                        : 'bg-[var(--surface-3)] text-[var(--ink-3)]'
                    )}
                  >
                    {isDone ? <CheckCircle2Icon className="size-4" /> : st.num}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-semibold hidden sm:inline',
                      isCurrent ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]'
                    )}
                  >
                    {st.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-8 sm:w-16 h-0.5 bg-[var(--line)] mx-2" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── STEP 1: UPLOAD ─────────────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-6">
          {/* Import Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setImportType('products')}
              className={cn(
                'flex flex-col gap-2 rounded-[24px] p-5 text-left border transition-all cursor-pointer',
                importType === 'products'
                  ? 'bg-white border-[var(--ink)] shadow-md'
                  : 'bg-white/60 border-[var(--line)] hover:bg-white'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--ink)]">Product Catalog</span>
                <span className="text-xs text-[var(--ink-3)] underline font-medium">Download sample CSV</span>
              </div>
              <p className="text-xs text-[var(--ink-3)] leading-relaxed">
                Import phone models, chargers, and accessory SKUs with default pre-tax rates and HSN codes.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setImportType('historical_sales')}
              className={cn(
                'flex flex-col gap-2 rounded-[24px] p-5 text-left border transition-all cursor-pointer',
                importType === 'historical_sales'
                  ? 'bg-white border-[var(--ink)] shadow-md'
                  : 'bg-white/60 border-[var(--line)] hover:bg-white'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--ink)]">Historical Paper Sales</span>
                <span className="text-xs text-[var(--ink-3)] underline font-medium">Download sample Excel</span>
              </div>
              <p className="text-xs text-[var(--ink-3)] leading-relaxed">
                Backfill past paper bills for analytics. Automatically flagged as legacy entries without consuming live CRM invoice numbers.
              </p>
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              handleSimulateUpload()
            }}
            onClick={handleSimulateUpload}
            className={cn(
              'flex flex-col items-center justify-center p-12 sm:p-16 rounded-[28px] bg-white border-2 border-dashed transition-all cursor-pointer text-center group shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]',
              dragActive
                ? 'border-[var(--lime-strong)] bg-[var(--lime-wash)]'
                : 'border-[var(--line)] hover:border-[var(--lime-strong)]'
            )}
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--lime-soft)] text-[var(--ink)] mb-4 group-hover:scale-105 transition-transform">
              <UploadCloudIcon className="size-8 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]">
              {isProcessing ? 'Analyzing file columns & encoding…' : 'Drop your spreadsheet here or click to browse'}
            </h3>
            <p className="text-xs text-[var(--ink-3)] mt-1 max-w-sm">
              Supports .xlsx, .xls, or .csv up to 25MB. UTF-8 encoded files recommended.
            </p>
            <button
              type="button"
              className="mt-6 rounded-full bg-[var(--ink)] px-6 py-2.5 text-xs font-bold text-white group-hover:bg-black transition-colors"
            >
              Select File
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: VALIDATE ───────────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-xs">
              <div className="flex items-center gap-2 text-[var(--pos)]">
                <CheckCircle2Icon className="size-4.5" />
                <span className="text-xs font-bold uppercase tracking-wider">Valid Rows</span>
              </div>
              <div className="text-3xl font-bold text-[var(--ink)] tabular-nums mt-2">
                142
              </div>
              <span className="text-xs text-[var(--ink-3)]">Ready for direct catalog import</span>
            </div>

            <div className="rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-xs">
              <div className="flex items-center gap-2 text-[var(--amber-crm)]">
                <AlertTriangleIcon className="size-4.5" />
                <span className="text-xs font-bold uppercase tracking-wider">Warnings</span>
              </div>
              <div className="text-3xl font-bold text-[var(--ink)] tabular-nums mt-2">
                6
              </div>
              <span className="text-xs text-[var(--ink-3)]">Missing default price (set to ₹0)</span>
            </div>

            <div className="rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-xs">
              <div className="flex items-center gap-2 text-[var(--neg)]">
                <XCircleIcon className="size-4.5" />
                <span className="text-xs font-bold uppercase tracking-wider">Format Errors</span>
              </div>
              <div className="text-3xl font-bold text-[var(--ink)] tabular-nums mt-2">
                2
              </div>
              <span className="text-xs text-[var(--ink-3)]">Rows skipped due to invalid HSN</span>
            </div>
          </div>

          {/* Validation Log */}
          <div className="rounded-[24px] bg-white p-6 border border-[var(--line)] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-2)]">
              <h3 className="text-sm font-bold text-[var(--ink)]">Validation Findings</h3>
              <button
                type="button"
                className="text-xs font-semibold text-[var(--ink-3)] hover:text-[var(--ink)] flex items-center gap-1"
              >
                <DownloadIcon className="size-3.5" />
                <span>Download Error CSV Report</span>
              </button>
            </div>
            <div className="divide-y divide-[var(--surface-2)] text-xs">
              <div className="py-2.5 flex items-start gap-3 text-[var(--neg)]">
                <XCircleIcon className="size-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Row 14:</span> Invalid HSN Code &ldquo;8517&rdquo; — GST HSN requires minimum 6 or 8 digits.
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-3 text-[var(--neg)]">
                <XCircleIcon className="size-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Row 38:</span> Product name is empty or contains unsupported symbols.
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-3 text-[var(--amber-crm)]">
                <AlertTriangleIcon className="size-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Row 89:</span> Default price missing for &ldquo;USB-C Fast Cable&rdquo;.
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-[var(--ink-3)] hover:text-[var(--ink)]"
            >
              ← Choose another file
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="h-11 rounded-full bg-[var(--lime)] px-6 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors shadow-xs"
            >
              Continue to Data Preview →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: PREVIEW ────────────────────────────────────────── */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-6">
          <div className="rounded-[24px] bg-white border border-[var(--line)] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[var(--line)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">Pre-import Row Preview (First 5 Rows)</h3>
                <p className="text-xs text-[var(--ink-3)]">Verify column mapping matches target catalog schema</p>
              </div>
              <span className="text-xs font-semibold text-[var(--pos)] bg-[var(--pos-bg)] px-2.5 py-1 rounded-full">
                142 records will be imported
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] font-semibold text-[var(--ink-3)] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Row</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">HSN</th>
                    <th className="py-3 px-4">GST</th>
                    <th className="py-3 px-4">Default Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--surface-2)]">
                  {[
                    { row: 1, name: 'Google Pixel 8a 128GB', brand: 'Google', cat: 'Phones', hsn: '85171200', gst: '18%', price: '₹42,999' },
                    { row: 2, name: 'Samsung 25W Travel Adapter', brand: 'Samsung', cat: 'Chargers', hsn: '85044030', gst: '18%', price: '₹1,299' },
                    { row: 3, name: 'boAt Airdopes 141', brand: 'boAt', cat: 'Earphones', hsn: '85183000', gst: '18%', price: '₹1,099' },
                    { row: 4, name: 'Redmi 13C 5G 128GB', brand: 'Xiaomi', cat: 'Phones', hsn: '85171200', gst: '18%', price: '₹10,499' },
                    { row: 5, name: 'OnePlus Warp Type-C Cable', brand: 'OnePlus', cat: 'Cables', hsn: '85444299', gst: '18%', price: '₹799' },
                  ].map((r) => (
                    <tr key={r.row} className="h-12 hover:bg-[var(--surface-2)]">
                      <td className="py-3 px-4 font-mono text-[var(--ink-4)]">{r.row}</td>
                      <td className="py-3 px-4 font-bold text-[var(--ink)]">{r.name}</td>
                      <td className="py-3 px-4 font-semibold text-[var(--ink-2)]">{r.brand}</td>
                      <td className="py-3 px-4 text-[var(--ink-2)]">{r.cat}</td>
                      <td className="py-3 px-4 font-mono text-[var(--ink-3)]">{r.hsn}</td>
                      <td className="py-3 px-4 font-bold text-[var(--ink)]">{r.gst}</td>
                      <td className="py-3 px-4 font-bold tabular-nums text-[var(--ink)]">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-[var(--ink-3)] hover:text-[var(--ink)]"
            >
              ← Back to Validation Summary
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="h-11 rounded-full bg-[var(--lime)] px-6 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors shadow-xs"
            >
              Confirm &amp; Proceed to Commit →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: CONFIRM ────────────────────────────────────────── */}
      {currentStep === 4 && (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-[28px] bg-white border border-[var(--line)] shadow-xl text-center max-w-lg mx-auto">
          {!completed ? (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--lime-soft)] text-[var(--ink)] mb-4">
                <FileCheckIcon className="size-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--ink)]">
                Ready to Import 142 Products?
              </h3>
              <p className="text-xs text-[var(--ink-3)] mt-2 leading-relaxed">
                2 rows containing invalid HSN data will be safely skipped. The remaining catalog records will be committed to the inventory database.
              </p>

              <div className="flex flex-col w-full gap-2.5 mt-8">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleExecuteImport}
                  className="h-12 w-full rounded-full bg-[var(--lime)] font-bold text-xs text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors shadow-xs"
                >
                  {isProcessing ? 'Writing records to database…' : 'Execute Import (142 Records)'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="h-10 text-xs font-semibold text-[var(--ink-3)] hover:text-[var(--ink)]"
                >
                  Back to Preview
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--pos-bg)] text-[var(--pos)] mb-4">
                <CheckCircle2Icon className="size-9 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--ink)]">
                Import Successfully Completed!
              </h3>
              <p className="text-xs text-[var(--ink-3)] mt-2">
                142 product catalog rows are now live and available on counter billing terminals.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCompleted(false)
                  setCurrentStep(1)
                }}
                className="mt-6 rounded-full bg-[var(--ink)] px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors"
              >
                Perform Another Import
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
