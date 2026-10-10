import Link from 'next/link'
import type { ReactNode } from 'react'
import { CrmBrandMark } from '@/components/shell/crm-brand-mark'
import { CrmNavigation } from '@/components/shell/crm-navigation'
import { CrmUserCard } from '@/components/shell/crm-user-card'
import { CrmTopbar } from '@/components/shell/crm-topbar'
import { CrmMobileNav } from '@/components/shell/crm-mobile-nav'
import type { UserProfile } from '@/lib/supabase/domain'

export function CrmShell({
  profile,
  children,
  pageTitle = 'Dashboard',
  parentLabel = 'Workspace',
}: {
  profile: UserProfile
  children: ReactNode
  pageTitle?: string
  parentLabel?: string
}) {
  return (
    <div className="min-h-dvh bg-[var(--canvas)] relative">
      {/* Canvas lime wash (top-right subtle lime glow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 w-[900px] h-[900px] z-0"
        style={{
          background: 'radial-gradient(circle at 100% 0%, rgba(213,246,90,0.25) 0%, transparent 60%)',
        }}
      />

      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col lg:flex"
        style={{ padding: '16px' }}
      >
        <div
          className="flex flex-1 flex-col rounded-[28px] bg-white border border-[var(--line)] px-5 py-5 overflow-hidden"
          style={{ boxShadow: '0 12px 32px -16px rgba(18,20,16,0.10)' }}
        >
          {/* Logo */}
          <Link href="/" className="mb-7 block" aria-label="Go to dashboard">
            <CrmBrandMark />
          </Link>

          {/* Search bar shortcut */}
          <div className="mb-5">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[14px] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--ink-4)] hover:bg-[var(--surface-3)] transition-colors"
            >
              <svg className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span className="flex-1 text-left text-[13px]">Search phone, invoice…</span>
              <kbd className="hidden md:flex items-center gap-0.5 rounded-[5px] border border-[var(--line)] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[var(--ink-4)]">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Navigation */}
          <CrmNavigation profile={profile} />

          {/* User card */}
          <div className="mt-4 pt-4 border-t border-[var(--line)]">
            <CrmUserCard profile={profile} />
          </div>
        </div>
      </aside>

      {/* ── Main content area ───────────────────────────── */}
      <div className="relative z-10 lg:pl-[calc(256px+16px)]">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-[var(--line)] bg-white/95 backdrop-blur-md px-4 lg:hidden">
          <CrmMobileNav profile={profile} />
          <Link href="/" aria-label="Dashboard">
            <CrmBrandMark />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/sales/new"
              className="flex items-center gap-1.5 h-9 rounded-full bg-[var(--lime)] px-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors"
              aria-label="New sale"
            >
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14m-7-7h14" />
              </svg>
              <span className="hidden sm:inline">New sale</span>
            </Link>
          </div>
        </header>

        {/* Desktop floating topbar */}
        <div className="hidden lg:block pt-4">
          <CrmTopbar
            profile={profile}
            pageTitle={pageTitle}
            parentLabel={parentLabel}
          />
        </div>

        {/* Page content */}
        <main className="px-4 py-4 md:px-6 md:py-6 lg:px-6 lg:py-4 relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}
