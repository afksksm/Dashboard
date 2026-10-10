'use client'

import { useState } from 'react'
import {
  FileSpreadsheetIcon,
  DownloadIcon,
  DatabaseBackupIcon,
  FileTextIcon,
  UsersIcon,
  ReceiptIcon,
  PackageIcon,
  CheckIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleExport = (key: string) => {
    setDownloading(key)
    setTimeout(() => {
      setDownloading(null)
    }, 1200)
  }

  const exportCards = [
    {
      id: 'sales',
      title: 'Sales & Invoices Dataset',
      description: 'Line item breakdown including HSN values, tax components, customer mappings, and payment tenders.',
      formats: ['CSV', 'Excel'],
      lastExport: 'Today, 2:15 PM',
      icon: ReceiptIcon,
    },
    {
      id: 'customers',
      title: 'Customer Directory',
      description: 'Customer profiles, normalized phone numbers, business GSTINs, and lifetime purchase totals.',
      formats: ['CSV', 'Excel'],
      lastExport: 'Yesterday, 6:30 PM',
      icon: UsersIcon,
    },
    {
      id: 'products',
      title: 'Product Catalog',
      description: 'Complete stock definitions, HSN mappings, tax slabs, and active serialization flags.',
      formats: ['CSV', 'Excel'],
      lastExport: '8 Oct 2026',
      icon: PackageIcon,
    },
    {
      id: 'reports',
      title: 'Financial Analytics Summary',
      description: 'Monthly executive revenue charts, salesperson league tables, and category sales splits.',
      formats: ['PDF', 'Excel'],
      lastExport: '1 Oct 2026',
      icon: FileTextIcon,
    },
    {
      id: 'audit',
      title: 'Append-Only Audit Trail',
      description: 'Complete security timestamp log of all user logins, price adjustments, and invoice cancellations.',
      formats: ['CSV'],
      lastExport: 'Never',
      icon: FileSpreadsheetIcon,
    },
    {
      id: 'full_backup',
      title: 'Full PostgreSQL Database Backup',
      description: 'Admin-only raw JSON/SQL dump of all tables, schema definitions, and frozen invoice snapshots.',
      formats: ['Full Backup (.tar.gz)'],
      lastExport: 'Today, 8:00 AM (Automated)',
      adminOnly: true,
      icon: DatabaseBackupIcon,
    },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
          Data Export &amp; Statutory Archives
        </h1>
        <p className="text-xs text-[var(--ink-3)] mt-0.5">
          Generate on-demand compliance archives for your CA, quarterly GST returns, or off-site backups
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exportCards.map((card) => {
          const Icon = card.icon
          const isFull = card.id === 'full_backup'

          return (
            <div
              key={card.id}
              className={cn(
                'rounded-[24px] bg-white p-6 border shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col justify-between transition-all',
                isFull
                  ? 'border-[var(--lime-strong)] bg-[var(--lime-wash)]'
                  : 'border-[var(--line)]'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-2xl text-[var(--ink)]',
                      isFull ? 'bg-[var(--lime)]' : 'bg-[var(--surface-2)]'
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  {card.adminOnly && (
                    <span className="rounded-full bg-[var(--ink)] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      Admin Only
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[var(--ink)]">{card.title}</h3>
                <p className="text-xs text-[var(--ink-3)] mt-1.5 leading-relaxed">
                  {card.description}
                </p>

                {isFull && (
                  <p className="mt-3 text-[11px] font-semibold text-[var(--ink-2)] bg-white/70 p-2.5 rounded-xl border border-[var(--lime-strong)]/40">
                    💡 Owner note: Keep an offline copy on an external encrypted USB drive at the end of each month.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--line)] flex flex-col gap-3">
                <div className="flex items-center justify-between text-[11px] text-[var(--ink-3)]">
                  <span>Last exported:</span>
                  <span className="font-semibold text-[var(--ink)]">{card.lastExport}</span>
                </div>

                <div className="flex items-center gap-2">
                  {card.formats.map((fmt) => {
                    const btnKey = `${card.id}-${fmt}`
                    const isBusy = downloading === btnKey
                    return (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => handleExport(btnKey)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 h-9 rounded-full text-xs font-bold transition-all shadow-xs',
                          isFull
                            ? 'bg-[var(--ink)] text-white hover:bg-black'
                            : 'bg-white border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--surface-2)]'
                        )}
                      >
                        {isBusy ? (
                          <>
                            <CheckIcon className="size-3.5 text-[var(--pos)]" />
                            <span>Exporting…</span>
                          </>
                        ) : (
                          <>
                            <DownloadIcon className="size-3.5" />
                            <span>{fmt}</span>
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
