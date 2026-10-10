'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ReceiptIcon,
  XCircleIcon,
  UserPlusIcon,
  PackagePlusIcon,
  SettingsIcon,
  LogInIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MockActivity } from '@/lib/mock/activity'

interface ActivityStreamProps {
  activities: MockActivity[]
}

export function ActivityStream({ activities }: ActivityStreamProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const getIcon = (type: MockActivity['type']) => {
    switch (type) {
      case 'sale':
        return <ReceiptIcon className="size-4 text-[var(--ink)]" />
      case 'cancellation':
        return <XCircleIcon className="size-4 text-[var(--neg)]" />
      case 'customer':
        return <UserPlusIcon className="size-4 text-[var(--ink)]" />
      case 'product':
        return <PackagePlusIcon className="size-4 text-[var(--ink)]" />
      case 'settings':
      case 'import':
      case 'user':
        return <SettingsIcon className="size-4 text-[var(--ink)]" />
      case 'login':
        return <LogInIcon className="size-4 text-[var(--ink)]" />
    }
  }

  const getTileBg = (type: MockActivity['type']) => {
    switch (type) {
      case 'sale':
        return 'bg-[var(--lime-soft)]'
      case 'cancellation':
        return 'bg-[var(--amber-bg)]'
      default:
        return 'bg-[var(--surface-3)]'
    }
  }

  return (
    <div className="flex flex-col rounded-[20px] bg-white p-5 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-2)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Audit activity</h3>
          <p className="text-[11px] text-[var(--ink-3)]">
            Append-only record of sales, cancellations & changes
          </p>
        </div>
        <Link
          href="/activity"
          className="text-xs font-semibold text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Stream rows */}
      <div className="divide-y divide-[var(--surface-2)] mt-1">
        {activities.slice(0, 8).map((act) => {
          const isExpanded = expandedId === act.id

          return (
            <div key={act.id} className="py-2.5">
              <div
                onClick={() => toggleExpand(act.id)}
                className="flex items-start justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Icon Tile */}
                  <div
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-[10px] mt-0.5',
                      getTileBg(act.type)
                    )}
                  >
                    {getIcon(act.type)}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col min-w-0">
                    <p className="text-xs text-[var(--ink-2)] leading-snug">
                      <strong className="font-semibold text-[var(--ink)]">
                        {act.actor_name}
                      </strong>{' '}
                      {act.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.2 text-[10px] font-medium text-[var(--ink-3)] uppercase tracking-wider">
                        {act.type}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--ink-4)] tracking-wide">
                        {act.time_ago}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronDownIcon
                  className={cn(
                    'size-4 shrink-0 text-[var(--ink-4)] transition-transform duration-200 mt-1',
                    isExpanded && 'rotate-180'
                  )}
                />
              </div>

              {/* In-place expanded detail */}
              {isExpanded && act.detail && (
                <div className="mt-2.5 ml-11 rounded-xl bg-[var(--surface-2)] p-3 text-xs text-[var(--ink-2)] border border-[var(--line)]">
                  <p className="font-medium">{act.detail}</p>
                  {act.related_id && (
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[var(--ink-3)]">
                      <span>Ref ID:</span>
                      <span className="font-mono font-medium">{act.related_id}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-3 border-t border-[var(--surface-2)]">
        <Link
          href="/activity"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors py-1"
        >
          <span>View all shop activity logs</span>
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
