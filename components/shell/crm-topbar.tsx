'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BellIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
  CheckIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserProfile } from '@/lib/supabase/domain'

const MOCK_ALERTS = [
  {
    id: '1',
    title: 'Invoice MC/26-27/00142 cancelled',
    description: 'Rahul Verma cancelled invoice. Reason: Customer returned item.',
    time: '35 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'Invoice MC/26-27/00138 cancelled',
    description: 'Admin cancelled invoice at month-end.',
    time: '2 days ago',
    read: true,
  },
]

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

export function CrmTopbar({
  profile,
  pageTitle,
  parentLabel,
}: {
  profile: UserProfile
  pageTitle: string
  parentLabel?: string
}) {
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  const unreadCount = MOCK_ALERTS.filter((a) => !a.read).length

  useEffect(() => {
    if (!searchOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  return (
    <div className="sticky top-4 z-20 mx-4 md:mx-6">
      <div
        className="flex h-16 items-center justify-between gap-4 rounded-full bg-white/95 backdrop-blur-md px-4 md:px-5 border border-[var(--line)]"
        style={{ boxShadow: '0 12px 32px -16px rgba(18,20,16,0.10)' }}
      >
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0">
          {parentLabel && (
            <>
              <span className="hidden text-sm text-[var(--ink-3)] sm:block truncate">
                {parentLabel}
              </span>
              <span className="hidden text-[var(--ink-4)] sm:block">/</span>
            </>
          )}
          <span className="text-sm font-semibold text-[var(--ink)] truncate">{pageTitle}</span>
        </div>

        {/* Right: actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex size-9 items-center justify-center rounded-full hover:bg-[var(--surface-3)] transition-colors"
            aria-label="Search"
          >
            <SearchIcon className="size-4 text-[var(--ink-3)]" />
          </button>

          {/* Alerts (admin only) */}
          {profile.role === 'admin' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAlertsOpen((v) => !v)}
                className="flex size-9 items-center justify-center rounded-full hover:bg-[var(--surface-3)] transition-colors relative"
                aria-label={`Alerts${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              >
                <BellIcon className="size-4 text-[var(--ink-3)]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex size-2.5 items-center justify-center rounded-full bg-[var(--neg)] text-white text-[8px] font-bold">
                    <span className="sr-only">{unreadCount}</span>
                  </span>
                )}
              </button>

              {alertsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAlertsOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 top-full mt-2 z-20 w-80 rounded-[20px] bg-white border border-[var(--line)] shadow-[0_24px_48px_-16px_rgba(18,20,16,0.24)] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--line)]">
                      <span className="text-sm font-semibold text-[var(--ink)]">Alerts</span>
                      <button
                        type="button"
                        className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
                        onClick={() => setAlertsOpen(false)}
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="divide-y divide-[var(--line)]">
                      {MOCK_ALERTS.map((alert) => (
                        <div
                          key={alert.id}
                          className={cn(
                            'px-4 py-3 flex gap-3',
                            !alert.read && 'bg-[var(--lime-soft)]'
                          )}
                        >
                          <div className="mt-0.5 flex size-2 shrink-0 items-center justify-center">
                            {!alert.read && (
                              <div className="size-2 rounded-full bg-[var(--lime-strong)]" />
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="text-[13px] font-medium text-[var(--ink)] leading-tight">{alert.title}</p>
                            <p className="text-[12px] text-[var(--ink-3)] leading-snug">{alert.description}</p>
                            <p className="text-[11px] text-[var(--ink-4)] uppercase tracking-wide">{alert.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="h-5 w-px bg-[var(--line)] hidden sm:block" />

          {/* New Sale button */}
          <Link
            href="/sales/new"
            className="hidden sm:flex items-center gap-2 h-9 rounded-full bg-[var(--lime)] px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors active:scale-[0.98]"
          >
            <PlusIcon className="size-4" />
            New sale
          </Link>

          {/* Mobile: just + icon */}
          <Link
            href="/sales/new"
            className="sm:hidden flex size-9 items-center justify-center rounded-full bg-[var(--lime)] hover:bg-[var(--lime-strong)] transition-colors"
            aria-label="New sale"
          >
            <PlusIcon className="size-4 text-[var(--ink)]" />
          </Link>

          {/* Avatar */}
          <Link
            href="/account"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--lime-soft)] text-[var(--ink)] text-sm font-semibold hover:ring-2 hover:ring-[var(--lime-strong)] transition-all"
          >
            {getInitials(profile.full_name)}
          </Link>
        </div>
      </div>

      {/* Global search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-xl rounded-[20px] bg-white border border-[var(--line)] shadow-[0_24px_48px_-16px_rgba(18,20,16,0.24)] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--line)]">
              <SearchIcon className="size-5 text-[var(--ink-3)] shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phone, invoice, IMEI, product…"
                className="flex-1 bg-transparent text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none"
              />
              <kbd className="hidden sm:flex items-center gap-1 rounded-[6px] border border-[var(--line)] bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-mono text-[var(--ink-3)]">
                Esc
              </kbd>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex size-8 items-center justify-center rounded-full hover:bg-[var(--surface-3)] transition-colors"
                aria-label="Close search"
              >
                <XIcon className="size-4 text-[var(--ink-3)]" />
              </button>
            </div>
            {!searchQuery && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-[var(--ink-3)]">
                  Search by customer phone, name, Sale ID, invoice number, or IMEI
                </p>
              </div>
            )}
            {searchQuery && (
              <div className="px-2 py-2">
                <p className="px-3 py-2 text-xs text-[var(--ink-3)] text-eyebrow">Results for &ldquo;{searchQuery}&rdquo;</p>
                <div className="flex flex-col gap-0.5">
                  {[
                    { type: 'Invoice', label: 'MC/26-27/00142', sub: 'Priya Sharma — ₹12,980', href: '/sales/MC-26-27-00142' },
                    { type: 'Customer', label: 'Priya Sharma', sub: '+91 98765 43210 · 8 orders', href: '/customers/cust-001' },
                  ].map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 hover:bg-[var(--surface-3)] transition-colors"
                    >
                      <span className="text-[10px] font-semibold text-[var(--ink-4)] uppercase tracking-wide w-14 shrink-0">{r.type}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-medium text-[var(--ink)] truncate">{r.label}</span>
                        <span className="text-[12px] text-[var(--ink-3)] truncate">{r.sub}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
