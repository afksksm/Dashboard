'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeOffIcon, LockIcon, ArrowRightIcon } from 'lucide-react'
import { CrmBrandMark } from '@/components/shell/crm-brand-mark'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@mittalcommunication.in')
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      router.push('/')
    }, 400)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--canvas)] px-4 py-12 relative overflow-hidden">
      {/* Top radial lime glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 right-0 h-96 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(213,246,90,0.38) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-6 flex justify-center">
          <CrmBrandMark />
        </div>

        {/* Card */}
        <div className="w-full rounded-[28px] bg-white p-7 sm:p-9 border border-[var(--line)] shadow-[0_24px_48px_-16px_rgba(18,20,16,0.18)]">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">
              Sign in to CRM
            </h1>
            <p className="text-xs text-[var(--ink-3)] mt-1">
              Private, invitation-only workspace for Mittal Communication staff
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@mittalcommunication.in"
                className="h-12 w-full rounded-xl bg-[var(--surface-2)] px-3.5 text-sm font-medium text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[var(--ink-2)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-12 w-full rounded-xl bg-[var(--surface-2)] pl-3.5 pr-10 text-sm font-medium text-[var(--ink)] border border-[var(--line)] outline-none focus:border-[var(--ink)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)] hover:text-[var(--ink)]"
                >
                  {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Fill Note */}
            <div className="rounded-xl bg-[var(--lime-wash)] p-3 text-[11px] text-[var(--ink-2)] border border-[var(--lime-strong)]/40 mt-1">
              <span className="font-bold text-[var(--ink)]">Demo Mode Active:</span> Pre-filled with administrator credentials. Click Sign in to enter the POS dashboard.
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-full bg-[var(--lime)] font-bold text-xs text-[var(--ink)] hover:bg-[var(--lime-strong)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isSubmitting ? 'Signing in…' : 'Sign in to Terminal'}</span>
              <ArrowRightIcon className="size-3.5" />
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-[var(--ink-3)]">
          Need an account? Contact your shop administrator for an invitation.
        </p>
      </div>
    </div>
  )
}
