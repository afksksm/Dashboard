'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  SearchIcon,
  ReceiptIcon,
  XCircleIcon,
  UserPlusIcon,
  PackagePlusIcon,
  SettingsIcon,
  LogInIcon,
  FilterIcon,
  ChevronDownIcon,
  XIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_ACTIVITY, type MockActivity } from '@/lib/mock/activity'

export function ActivityPage() {
  const [activities] = useState<MockActivity[]>(MOCK_ACTIVITY)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [actorFilter, setActorFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchDesc = act.description.toLowerCase().includes(q)
        const matchActor = act.actor_name.toLowerCase().includes(q)
        const matchDetail = act.detail?.toLowerCase().includes(q)
        const matchRef = act.related_id?.toLowerCase().includes(q)
        if (!matchDesc && !matchActor && !matchDetail && !matchRef) return false
      }
      if (typeFilter !== 'all' && act.type !== typeFilter) return false
      if (actorFilter !== 'all' && act.actor_id !== actorFilter) return false
      return true
    })
  }, [activities, searchQuery, typeFilter, actorFilter])

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
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
          Audit Activity Trail
        </h1>
        <p className="text-xs text-[var(--ink-3)] mt-0.5">
          Immutable, append-only security log of billing, cancellations, inventory modifications, and logins
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-4)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity description, staff name, invoice ref…"
              className="h-10 w-full rounded-full bg-[var(--surface-2)] pl-9.5 pr-4 text-xs font-medium text-[var(--ink)] placeholder:text-[var(--ink-4)] border border-[var(--line)] focus:border-[var(--ink)] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-4)] hover:text-[var(--ink)]"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>

          {/* Quick Selects */}
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-lg bg-[var(--surface-2)] px-2.5 text-xs font-medium text-[var(--ink)] border border-[var(--line)] outline-none"
            >
              <option value="all">All Action Types</option>
              <option value="sale">Sales</option>
              <option value="cancellation">Cancellations</option>
              <option value="customer">Customers</option>
              <option value="product">Products</option>
              <option value="settings">Settings</option>
              <option value="import">Imports</option>
              <option value="login">Logins</option>
            </select>

            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="h-9 rounded-lg bg-[var(--surface-2)] px-2.5 text-xs font-medium text-[var(--ink)] border border-[var(--line)] outline-none"
            >
              <option value="all">All Staff Actors</option>
              <option value="demo-admin-001">Saksham Sharma</option>
              <option value="sp-002">Rahul Verma</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-[24px] bg-white border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] divide-y divide-[var(--surface-2)] overflow-hidden">
        {filteredActivities.map((act) => {
          const isExpanded = expandedId === act.id

          return (
            <div key={act.id} className="p-4 sm:p-5 hover:bg-[var(--surface-2)] transition-colors">
              <div
                onClick={() => toggleExpand(act.id)}
                className="flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-xl mt-0.5',
                      getTileBg(act.type)
                    )}
                  >
                    {getIcon(act.type)}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-snug">
                      <strong className="font-semibold text-[var(--ink)]">
                        {act.actor_name}
                      </strong>{' '}
                      {act.description}
                    </p>
                    <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                      <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--ink)] uppercase tracking-wider border border-[var(--line)]">
                        {act.type}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--ink-4)]">
                        {new Date(act.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--ink-4)] uppercase">
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

              {/* In-place expansion details */}
              {isExpanded && act.detail && (
                <div className="mt-3 ml-12.5 rounded-xl bg-[var(--surface-2)] p-3.5 text-xs text-[var(--ink-2)] border border-[var(--line)]">
                  <p className="font-medium">{act.detail}</p>
                  {act.related_id && (
                    <div className="mt-2 flex items-center gap-2 pt-2 border-t border-[var(--line)]">
                      <span className="text-[11px] text-[var(--ink-3)]">Related Document:</span>
                      <Link
                        href={`/sales/${act.related_id.replace(/\//g, '-')}`}
                        className="font-mono text-xs font-bold text-[var(--ink)] hover:underline"
                      >
                        {act.related_id} →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {filteredActivities.length === 0 && (
          <div className="py-16 text-center text-xs text-[var(--ink-3)]">
            No audit log records match the applied filters.
          </div>
        )}
      </div>
    </div>
  )
}
