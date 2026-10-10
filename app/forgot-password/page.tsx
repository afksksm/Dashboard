'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, CheckCircle2Icon } from 'lucide-react'
import { CrmBrandMark } from '@/components/shell/crm-brand-mark'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
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
              Password Recovery
            </h1>
            <p className="text-xs text-[var(--ink-3)] mt-1">
              Enter your authorized staff email to receive a password reset link
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Registered Staff Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mittalcommunication.in"
                  className="h-12 w-full rounded-xl bg-[var(--surface-2)] px-3.5 text-sm font-medium text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 h-12 w-full rounded-full bg-[var(--lime)] font-bold text-xs text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-xs"
              >
                Send Password Reset Link
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div className="flex size-12 items-center justify-center rounded-full bg-[var(--pos-bg)] text-[var(--pos)]">
                <CheckCircle2Icon className="size-6 stroke-[2.5]" />
              </div>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                If an account exists for <strong className="text-[var(--ink)]">{email}</strong>, a secure reset instruction email is on its way.
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[var(--line)] text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--ink)]"
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
