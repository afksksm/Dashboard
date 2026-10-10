import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertCircleIcon, ArrowLeftIcon } from 'lucide-react'
import { CrmBrandMark } from '@/components/shell/crm-brand-mark'

export const metadata: Metadata = {
  title: 'Authentication link error',
  description: 'The authentication link could not be verified.',
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--canvas)] px-4 py-12 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 right-0 h-96 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(213,246,90,0.38) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        <div className="mb-6 flex justify-center">
          <CrmBrandMark />
        </div>

        <div className="w-full rounded-[28px] bg-white p-7 sm:p-9 border border-[var(--line)] shadow-[0_24px_48px_-16px_rgba(18,20,16,0.18)] text-center flex flex-col items-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--neg-bg)] text-[var(--neg)] mb-4">
            <AlertCircleIcon className="size-6 stroke-[2.5]" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">
            This link could not be verified
          </h1>
          <p className="text-xs text-[var(--ink-3)] mt-2 leading-relaxed">
            It may have expired or already been used. Ask your shop administrator for a new invitation, or request another password reset.
          </p>

          <div className="mt-6 flex flex-col w-full gap-2.5">
            <Link
              href="/login"
              className="flex h-11 w-full items-center justify-center rounded-full bg-[var(--lime)] font-bold text-xs text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors shadow-xs"
            >
              Back to Sign In
            </Link>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[var(--ink-2)] hover:underline py-1"
            >
              Request a password reset
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
