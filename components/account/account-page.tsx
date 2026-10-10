'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserIcon, LockIcon, LogOutIcon, CheckIcon, SaveIcon } from 'lucide-react'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export function AccountPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState(DEMO_PROFILE.full_name)
  const [phone, setPhone] = useState(DEMO_PROFILE.phone || '')
  const [saved, setSaved] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwSaved, setPwSaved] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPw || !newPw) return
    setPwSaved(true)
    setCurrentPw('')
    setNewPw('')
    setTimeout(() => setPwSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-[900px] mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
          Account Profile &amp; Credentials
        </h1>
        <p className="text-xs text-[var(--ink-3)] mt-0.5">
          Manage your personal shop credentials and counter staff authentication details
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-[28px] bg-white p-6 md:p-8 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--lime-soft)] text-xl font-bold text-[var(--ink)]">
            SS
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--ink)]">{fullName}</h2>
            <p className="text-xs text-[var(--ink-3)]">{DEMO_PROFILE.email}</p>
            <span className="inline-block mt-1.5 rounded-full bg-[var(--ink)] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
              {DEMO_PROFILE.role === 'admin' ? 'Shop Administrator' : 'Salesperson'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="rounded-[28px] bg-white p-6 md:p-8 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
            <UserIcon className="size-4 text-[var(--ink-3)]" />
            <span>Profile Information</span>
          </h3>

          <div>
            <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
              Contact Phone Number
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 font-mono text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--pos)]">
              {saved && '✓ Profile changes saved'}
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 h-10 rounded-full bg-[var(--lime)] px-5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors shadow-xs"
            >
              <SaveIcon className="size-3.5" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Form */}
      <div className="rounded-[28px] bg-white p-6 md:p-8 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
            <LockIcon className="size-4 text-[var(--ink-3)]" />
            <span>Change Master Password</span>
          </h3>

          <div>
            <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••••••"
              className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs border border-[var(--line)] outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
              New Secure Password
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Min. 8 characters, letters &amp; numbers"
              className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs border border-[var(--line)] outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--pos)]">
              {pwSaved && '✓ Password updated successfully'}
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 h-10 rounded-full bg-[var(--ink)] px-5 text-xs font-bold text-white hover:bg-black transition-colors shadow-xs"
            >
              <LockIcon className="size-3.5" />
              <span>Save New Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Sign Out */}
      <div className="rounded-[28px] bg-white p-6 border border-[var(--line)] shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[var(--ink)]">Terminate Session</h3>
          <p className="text-xs text-[var(--ink-3)]">Safely sign out of this POS terminal</p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 h-10 rounded-full border border-[var(--neg)] bg-white px-5 text-xs font-bold text-[var(--neg)] hover:bg-[var(--neg-bg)] transition-colors"
        >
          <LogOutIcon className="size-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
