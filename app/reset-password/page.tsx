'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2Icon, ArrowRightIcon } from 'lucide-react'
import { CrmBrandMark } from '@/components/shell/crm-brand-mark'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8 || password !== confirmPassword) return
    setSuccess(true)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }

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

        <div className="w-full rounded-[28px] bg-white p-7 sm:p-9 border border-[var(--line)] shadow-[0_24px_48px_-16px_rgba(18,20,16,0.18)]">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">
              Set New Password
            </h1>
            <p className="text-xs text-[var(--ink-3)] mt-1">
              Choose a strong personal password for your counter access
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  New Password (Min. 8 characters)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-12 w-full rounded-xl bg-[var(--surface-2)] px-3.5 text-sm font-medium text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-12 w-full rounded-xl bg-[var(--surface-2)] px-3.5 text-sm font-medium text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)]"
                />
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-[var(--neg)] font-semibold">
                  * Passwords do not match
                </p>
              )}

              <button
                type="submit"
                disabled={password.length < 8 || password !== confirmPassword}
                className="mt-2 h-12 w-full rounded-full bg-[var(--lime)] font-bold text-xs text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all disabled:opacity-40 shadow-xs"
              >
                Save New Password &amp; Continue
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div className="flex size-12 items-center justify-center rounded-full bg-[var(--pos-bg)] text-[var(--pos)]">
                <CheckCircle2Icon className="size-6 stroke-[2.5]" />
              </div>
              <p className="text-xs text-[var(--ink-2)]">
                Password updated! Redirecting to sign in…
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
