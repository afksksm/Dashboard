import { describe, expect, it } from 'vitest'

import { asTeamMember, normalizePhone } from './domain'

describe('CRM profile data normalization', () => {
  it('fails closed for unsupported role and status values', () => {
    const member = asTeamMember({
      id: '00000000-0000-4000-8000-000000000001',
      email: 'team@example.com',
      full_name: 'Team Member',
      role: 'owner',
      status: 'pending',
      last_login_at: null,
    })

    expect(member.role).toBe('salesperson')
    expect(member.status).toBe('disabled')
  })

  it('stores blank profile phone numbers as null', () => {
    expect(normalizePhone('  ')).toBeNull()
    expect(normalizePhone('  +91 98765 43210  ')).toBe('+91 98765 43210')
  })
})
