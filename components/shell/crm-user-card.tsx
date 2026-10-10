'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronDownIcon,
  UserIcon,
  LogOutIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserProfile } from '@/lib/supabase/domain'

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function CrmUserCard({ profile }: { profile: UserProfile }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-[14px] p-3 hover:bg-[var(--surface-3)] transition-colors text-left"
      >
        {/* Avatar */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--lime-soft)] text-[var(--ink)] text-sm font-semibold select-none">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="size-9 rounded-full object-cover"
            />
          ) : (
            getInitials(profile.full_name)
          )}
        </div>
        {/* Name & role */}
        <div className="flex min-w-0 flex-col flex-1">
          <span className="truncate text-[13px] font-semibold text-[var(--ink)] leading-tight">
            {profile.full_name}
          </span>
          <span className="text-[11px] text-[var(--ink-3)] leading-tight capitalize">
            {profile.role === 'admin' ? 'Admin' : 'Salesperson'}
          </span>
        </div>
        <ChevronDownIcon
          className={cn(
            'size-4 shrink-0 text-[var(--ink-3)] transition-transform duration-150',
            menuOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-full left-0 right-0 z-20 mb-1 rounded-[14px] bg-white border border-[var(--line)] shadow-[0_24px_48px_-16px_rgba(18,20,16,0.24)] overflow-hidden py-1">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ink-2)] hover:bg-[var(--surface-3)] hover:text-[var(--ink)] transition-colors"
            >
              <UserIcon className="size-4 text-[var(--ink-3)]" />
              Profile
            </Link>
            <div className="h-px bg-[var(--line)] mx-2 my-1" />
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                router.push('/login')
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--neg)] hover:bg-[var(--neg-bg)] transition-colors"
            >
              <LogOutIcon className="size-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
