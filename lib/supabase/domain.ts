import type { Database } from './database.types'

export type UserRole = 'admin' | 'salesperson'
export type AccountStatus = 'active' | 'disabled'
export type InvitationStatus =
  | 'pending'
  | 'accepted'
  | 'revoked'
  | 'failed'
  | 'expired'

export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type UserProfile = Omit<ProfileRow, 'role' | 'status'> & {
  role: UserRole
  status: AccountStatus
}

export type TeamMemberRow = Pick<
  ProfileRow,
  'id' | 'email' | 'full_name' | 'role' | 'status' | 'last_login_at'
>
export type TeamMember = Omit<TeamMemberRow, 'role' | 'status'> & {
  role: UserRole
  status: AccountStatus
}

export type InvitationRow =
  Database['public']['Tables']['user_invitations']['Row']
export type UserInvitation = Omit<InvitationRow, 'role' | 'status'> & {
  role: UserRole
  status: InvitationStatus
}

export function isUserRole(value: string): value is UserRole {
  return value === 'admin' || value === 'salesperson'
}

export function isAccountStatus(value: string): value is AccountStatus {
  return value === 'active' || value === 'disabled'
}

export function isInvitationStatus(value: string): value is InvitationStatus {
  return (
    value === 'pending' ||
    value === 'accepted' ||
    value === 'revoked' ||
    value === 'failed' ||
    value === 'expired'
  )
}

export function asUserProfile(row: ProfileRow): UserProfile {
  return {
    ...row,
    role: isUserRole(row.role) ? row.role : 'salesperson',
    status: isAccountStatus(row.status) ? row.status : 'disabled',
  }
}

export function asTeamMember(row: TeamMemberRow): TeamMember {
  return {
    ...row,
    role: isUserRole(row.role) ? row.role : 'salesperson',
    status: isAccountStatus(row.status) ? row.status : 'disabled',
  }
}

export function asUserInvitation(row: InvitationRow): UserInvitation {
  return {
    ...row,
    role: isUserRole(row.role) ? row.role : 'salesperson',
    status: isInvitationStatus(row.status) ? row.status : 'failed',
  }
}

export function normalizePhone(phone: string): string | null {
  const normalized = phone.trim()
  return normalized || null
}
