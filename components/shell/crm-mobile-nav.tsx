'use client'

import { useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import { CrmNavigation } from '@/components/shell/crm-navigation'
import { CrmUserCard } from '@/components/shell/crm-user-card'
import { CrmBrandMark } from '@/components/shell/crm-brand-mark'
import type { UserProfile } from '@/lib/supabase/domain'

export function CrmMobileNav({ profile }: { profile: UserProfile }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="flex size-10 items-center justify-center rounded-full hover:bg-[var(--surface-3)] transition-colors"
      >
        <MenuIcon className="size-5 text-[var(--ink)]" />
      </button>

      {/* Drawer backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white px-5 py-6 rounded-r-[28px] shadow-[0_24px_48px_-16px_rgba(18,20,16,0.24)] transition-transform duration-220 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation"
      >
        <div className="flex items-center justify-between mb-6">
          <CrmBrandMark />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="flex size-10 items-center justify-center rounded-full hover:bg-[var(--surface-3)] transition-colors"
          >
            <XIcon className="size-5 text-[var(--ink)]" />
          </button>
        </div>

        <CrmNavigation profile={profile} onNavigate={() => setOpen(false)} />

        <div className="mt-4 pt-4 border-t border-[var(--line)]">
          <CrmUserCard profile={profile} />
        </div>
      </div>
    </>
  )
}
