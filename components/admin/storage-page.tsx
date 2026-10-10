'use client'

import { useState } from 'react'
import {
  HardDriveIcon,
  CloudUploadIcon,
  DownloadIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function StorageAdminPage() {
  const [drillRunning, setDrillRunning] = useState(false)
  const [drillSuccess, setDrillSuccess] = useState(false)

  const handleTestRestore = () => {
    setDrillRunning(true)
    setTimeout(() => {
      setDrillRunning(false)
      setDrillSuccess(true)
      setTimeout(() => setDrillSuccess(false), 3000)
    }, 1500)
  }

  const meters = [
    {
      title: 'Database Table Storage',
      used: '124 MB',
      total: '500 MB',
      pct: 25,
      note: 'Approx. 4,200 rows of sales, items, customers and activity',
    },
    {
      title: 'A4 PDF Archive Bucket',
      used: '1.82 GB',
      total: '10 GB',
      pct: 18,
      note: 'Cryptographically hashed immutable invoice copies',
    },
    {
      title: 'Monthly Data Transfer Quota',
      used: '12.4 GB',
      total: '100 GB',
      pct: 12,
      note: 'Billing counter terminals and analytics bandwidth',
    },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
            Storage Usage &amp; Disaster Recovery
          </h1>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">
            Cloud resource consumption metrics, automated offsite mirrors &amp; RTO recovery tests
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Initiating master database archive download…')}
          className="flex h-10 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-xs self-start sm:self-auto"
        >
          <DownloadIcon className="size-4 stroke-[2.5]" />
          <span>Download Full DB Export</span>
        </button>
      </div>

      {/* Resource Consumption Meters (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {meters.map((m) => (
          <div
            key={m.title}
            className="rounded-[24px] bg-white p-6 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-3)]">
                {m.title}
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                  {m.used}
                </span>
                <span className="text-xs text-[var(--ink-3)]">
                  of {m.total} ({m.pct}%)
                </span>
              </div>

              {/* Meter bar */}
              <div className="mt-3 h-2 w-full rounded-full bg-[var(--surface-3)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--ink)] transition-all duration-300"
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>

            <p className="mt-4 text-[11px] text-[var(--ink-4)] leading-tight">
              {m.note}
            </p>
          </div>
        ))}
      </div>

      {/* Backup Mirror Channels */}
      <div className="rounded-[28px] bg-white p-6 md:p-8 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex flex-col gap-6">
        <div>
          <h2 className="text-base font-bold text-[var(--ink)]">
            Automated Redundancy Channels
          </h2>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">
            Two independent remote destinations ensuring complete zero-data-loss protection
          </p>
        </div>

        <div className="divide-y divide-[var(--surface-2)]">
          {/* Destination 1 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--lime-soft)] text-[var(--ink)]">
                <CloudUploadIcon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--ink)]">
                  Encrypted Cloud Storage Bucket (AWS S3 AP-South-1)
                </span>
                <span className="text-xs text-[var(--ink-3)]">
                  Scheduled every 4 hours · AES-256 server-side encryption
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--pos)] font-bold bg-[var(--pos-bg)] px-2.5 py-0.5 rounded-full">
                Healthy · Synced 2 hrs ago
              </span>
              <span className="text-xs font-mono text-[var(--ink-3)]">48.2 MB</span>
            </div>
          </div>

          {/* Destination 2 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--ink)]">
                <HardDriveIcon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--ink)]">
                  Google Drive Shop Owner Vault
                </span>
                <span className="text-xs text-[var(--ink-3)]">
                  Daily midnight mirror to owner@mittalcommunication.in
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--pos)] font-bold bg-[var(--pos-bg)] px-2.5 py-0.5 rounded-full">
                Healthy · Synced today 8:00 AM
              </span>
              <span className="text-xs font-mono text-[var(--ink-3)]">52.1 MB</span>
            </div>
          </div>
        </div>

        {/* Restore Drill Panel */}
        <div className="mt-2 rounded-2xl bg-[var(--surface-2)] p-5 border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-white text-[var(--pos)]">
              <ShieldCheckIcon className="size-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--ink)]">
                Disaster Recovery Testing
              </span>
              <p className="text-[11px] text-[var(--ink-3)]">
                Last dry-run restore successfully completed on <strong className="text-[var(--ink)]">1 October 2026</strong>. Verified zero transaction corruption.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={drillRunning}
            onClick={handleTestRestore}
            className="rounded-full bg-white border border-[var(--line)] px-4 py-2 text-xs font-bold text-[var(--ink)] hover:bg-[var(--surface-3)] transition-colors shrink-0 shadow-xs"
          >
            {drillRunning ? 'Executing Sandbox Restore…' : drillSuccess ? '✓ Restore Test Verified (RTO 4m)' : 'Run Restore Test Drill'}
          </button>
        </div>
      </div>
    </div>
  )
}
