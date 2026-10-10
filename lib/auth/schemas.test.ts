import { describe, expect, it } from 'vitest'

import { safeAuthRedirect } from '../supabase/config'
import {
  accountStatusSchema,
  inviteUserSchema,
  newPasswordSchema,
  signInSchema,
} from './schemas'

describe('CRM access validation', () => {
  it('allows only safe same-origin redirects', () => {
    const origin = 'https://crm.example'

    expect(safeAuthRedirect('/team?tab=members#owner', origin)).toBe(
      '/team?tab=members#owner',
    )
    expect(safeAuthRedirect('https://attacker.example', origin)).toBe('/')
    expect(safeAuthRedirect('//attacker.example', origin)).toBe('/')
    expect(safeAuthRedirect('/..//attacker.example', origin)).toBe('/')
    expect(safeAuthRedirect('/\\\\attacker.example', origin)).toBe('/')
  })

  it('normalizes invitation and sign-in email addresses', () => {
    const signIn = signInSchema.parse({
      email: '  SALES@MITTAL.IN ',
      password: 'password',
    })
    const invite = inviteUserSchema.parse({
      email: '  TEAM@MITTAL.IN ',
      fullName: '  Team Member  ',
      role: 'salesperson',
    })

    expect(signIn.email).toBe('sales@mittal.in')
    expect(invite.email).toBe('team@mittal.in')
    expect(invite.fullName).toBe('Team Member')
  })

  it('requires matching passwords of at least twelve characters', () => {
    expect(
      newPasswordSchema.safeParse({
        password: 'short',
        confirmPassword: 'short',
      }).success,
    ).toBe(false)
    expect(
      newPasswordSchema.safeParse({
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }).success,
    ).toBe(true)
    expect(
      newPasswordSchema.safeParse({
        password: 'SecurePass123',
        confirmPassword: 'DifferentPass123',
      }).success,
    ).toBe(false)
  })

  it('rejects invalid roles and account states', () => {
    expect(
      inviteUserSchema.safeParse({
        email: 'team@mittal.in',
        fullName: 'Team Member',
        role: 'owner',
      }).success,
    ).toBe(false)
    expect(
      accountStatusSchema.safeParse({
        profileId: '00000000-0000-4000-8000-000000000001',
        status: 'deleted',
      }).success,
    ).toBe(false)
  })
})

