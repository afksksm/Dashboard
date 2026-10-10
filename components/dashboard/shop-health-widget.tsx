'use client'

import { ShieldCheckIcon, CloudUploadIcon, HardDriveIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ShopHealthWidget() {
  const meters = [
    { label: 'Database rows & storage', pct: 24, status: '24% of 500MB' },
    { label: 'PDF Invoice storage', pct: 18, status: '1.8GB of 10GB' },
    { label: 'Monthly bandwidth quota', pct: 12, status: '12GB of 100GB' },
  ]

  const getMeterColor = (pct: number) => {
    if (pct >= 95) return 'bg-[var(--neg)]'
    if (pct >= 85) return 'bg-[var(--orange-crm)]'
    if (pct >= 70) return 'bg-[var(--amber-crm)]'
    return 'bg-[var(--ink)]'
  }

  return (
    <div className="flex flex-col rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-2)]">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[var(--pos)] animate-pulse" />
          <h3 className="text-sm font-semibold text-[var(--ink)]">Shop system health</h3>
        </div>
        <span className="text-[11px] font-semibold text-[var(--pos)] bg-[var(--pos-bg)] px-2 py-0.5 rounded-full">
          Normal
        </span>
      </div>

      {/* Quota meters */}
      <div className="my-4 flex flex-col gap-3">
        {meters.map((m) => (
          <div key={m.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--ink-3)] font-medium">{m.label}</span>
              <span className="font-semibold text-[var(--ink)] tabular-nums">{m.status}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--surface-3)] overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-300', getMeterColor(m.pct))}
                style={{ width: `${m.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Backup state */}
      <div className="mt-1 pt-3 border-t border-[var(--surface-2)] flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[var(--ink-2)]">
            <CloudUploadIcon className="size-3.5 text-[var(--pos)]" />
            <span>Cloud Bucket sync:</span>
          </div>
          <span className="font-medium text-[var(--ink)]">Today, 2:00 PM (Verified)</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[var(--ink-2)]">
            <HardDriveIcon className="size-3.5 text-[var(--pos)]" />
            <span>Google Drive mirror:</span>
          </div>
          <span className="font-medium text-[var(--ink)]">Today, 8:00 AM (Verified)</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[var(--ink-4)] pt-1">
          <span>Last restore drill: 1 Oct 2026</span>
          <span className="font-semibold text-[var(--ink-3)]">RTO &lt; 15 mins</span>
        </div>
      </div>
    </div>
  )
}
