'use client'

import { useState } from 'react'
import {
  UserPlusIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  AlertTriangleIcon,
  XIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TeamUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'salesperson'
  status: 'active' | 'disabled'
  lastLogin: string
}

const INITIAL_USERS: TeamUser[] = [
  {
    id: 'demo-admin-001',
    name: 'Saksham Sharma',
    email: 'admin@mittalcommunication.in',
    role: 'admin',
    status: 'active',
    lastLogin: 'Today, 4:32 PM',
  },
  {
    id: 'sp-002',
    name: 'Rahul Verma',
    email: 'rahul@mittalcommunication.in',
    role: 'salesperson',
    status: 'active',
    lastLogin: 'Today, 2:15 PM',
  },
  {
    id: 'sp-003',
    name: 'Pooja Singh',
    email: 'pooja@mittalcommunication.in',
    role: 'salesperson',
    status: 'disabled',
    lastLogin: '15 Sep 2026, 11:20 AM',
  },
]

export function UsersAdminPage() {
  const [users, setUsers] = useState<TeamUser[]>(INITIAL_USERS)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [disableModalUser, setDisableModalUser] = useState<TeamUser | null>(null)

  // Invite state
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'salesperson'>('salesperson')
  const [inviteSent, setInviteSent] = useState(false)

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return

    const newUser: TeamUser = {
      id: `u-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'active',
      lastLogin: 'Invitation pending',
    }
    setUsers((prev) => [...prev, newUser])
    setInviteSent(true)
    setTimeout(() => {
      setInviteSent(false)
      setInviteModalOpen(false)
      setInviteName('')
      setInviteEmail('')
    }, 1200)
  }

  const handleConfirmToggleStatus = () => {
    if (!disableModalUser) return
    const targetId = disableModalUser.id
    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetId
          ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' }
          : u
      )
    )
    setDisableModalUser(null)
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
            Team &amp; User Access Control
          </h1>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">
            Administer shop accounts, role assignments, and instant session deactivation
          </p>
        </div>

        <button
          type="button"
          onClick={() => setInviteModalOpen(true)}
          className="flex h-10 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-xs self-start sm:self-auto"
        >
          <UserPlusIcon className="size-4 stroke-[2.5]" />
          <span>Invite Teammate</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-[24px] bg-white border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--surface-2)] border-b border-[var(--line)] text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Work Email</th>
                <th className="py-3 px-3">Role Permission</th>
                <th className="py-3 px-4 text-center">Account Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-3 text-center">Toggle Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-2)]">
              {users.map((u) => {
                const isDisabled = u.status === 'disabled'
                const initials = u.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()

                return (
                  <tr
                    key={u.id}
                    className={cn(
                      'h-16 hover:bg-[var(--surface-2)] transition-colors',
                      isDisabled && 'opacity-50 bg-neutral-50'
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--lime-soft)] text-xs font-bold text-[var(--ink)]">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--ink)]">{u.name}</span>
                          <span className="text-[10px] text-[var(--ink-4)] font-mono">{u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-[var(--ink-2)]">
                      {u.email}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                          u.role === 'admin'
                            ? 'bg-[var(--ink)] text-white'
                            : 'bg-[var(--surface-3)] text-[var(--ink)]'
                        )}
                      >
                        {u.role === 'admin' ? 'Administrator' : 'Salesperson'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold',
                          u.status === 'active'
                            ? 'bg-[var(--pos-bg)] text-[var(--pos)]'
                            : 'bg-neutral-200 text-neutral-600'
                        )}
                      >
                        {u.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[var(--ink-3)]">
                      {u.lastLogin}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setDisableModalUser(u)}
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-semibold border transition-colors',
                          u.status === 'active'
                            ? 'border-[var(--neg)] text-[var(--neg)] hover:bg-[var(--neg-bg)]'
                            : 'border-[var(--pos)] text-[var(--pos)] hover:bg-[var(--pos-bg)]'
                        )}
                      >
                        {u.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Invite Teammate Modal ──────────────────────────────────── */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 md:p-8 shadow-2xl border border-[var(--line)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-base font-bold text-[var(--ink)]">Invite New Teammate</h3>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="size-7 flex items-center justify-center rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-3)]"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="mt-4 flex flex-col gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Aman Gupta"
                  className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="aman@mittalcommunication.in"
                  className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                  Role Assignment
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
                >
                  <option value="salesperson">Salesperson (Counter POS &amp; Analytics)</option>
                  <option value="admin">Administrator (Full Master Access)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[var(--lime)] font-bold text-xs text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors"
                >
                  {inviteSent ? 'Invitation Dispatched!' : 'Send Email Invitation'}
                </button>
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="h-11 rounded-full px-5 border border-[var(--line)] text-xs font-semibold text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Disable / Enable Confirmation Modal ─────────────────────── */}
      {disableModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl border border-[var(--line)] flex flex-col gap-4 text-center items-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-[var(--neg-bg)] text-[var(--neg)]">
              <AlertTriangleIcon className="size-6 stroke-[2.5]" />
            </div>

            <h3 className="text-base font-bold text-[var(--ink)]">
              {disableModalUser.status === 'active'
                ? `Disable ${disableModalUser.name}?`
                : `Re-enable ${disableModalUser.name}?`}
            </h3>

            <p className="text-xs text-[var(--ink-3)] leading-relaxed">
              {disableModalUser.status === 'active'
                ? 'They will be immediately signed out of all devices and blocked at the application security layer until an administrator re-enables them.'
                : 'Account access will be restored and they can resume billing at POS terminals.'}
            </p>

            <div className="flex w-full gap-2 mt-2">
              <button
                type="button"
                onClick={handleConfirmToggleStatus}
                className={cn(
                  'flex-1 h-11 rounded-full font-bold text-xs text-white transition-colors',
                  disableModalUser.status === 'active'
                    ? 'bg-[var(--neg)] hover:opacity-90'
                    : 'bg-[var(--pos)] hover:opacity-90'
                )}
              >
                {disableModalUser.status === 'active' ? 'Confirm Account Suspension' : 'Confirm Reactivation'}
              </button>
              <button
                type="button"
                onClick={() => setDisableModalUser(null)}
                className="h-11 rounded-full px-5 border border-[var(--line)] text-xs font-semibold text-[var(--ink-2)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
