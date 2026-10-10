'use server'

import { redirect } from 'next/navigation'

import type { ActionResult } from '@/lib/auth/action-result'
import {
  emailOnlySchema,
  newPasswordSchema,
  signInSchema,
} from '@/lib/auth/schemas'
import { getActiveProfile } from '@/lib/auth/server'
import { getAuthRedirectUrlFromServer } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

export async function signInAction(input: unknown): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: 'Enter a valid email and password.' }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data)

    if (error) {
      if (error.code === 'email_not_confirmed') {
        return {
          ok: false,
          message: 'Confirm your invitation from your inbox before signing in.',
        }
      }

      if (error.status === 429 || error.code?.includes('rate')) {
        return {
          ok: false,
          message: 'Too many attempts. Wait a little before trying again.',
        }
      }

      if (error.code === 'invalid_credentials') {
        return { ok: false, message: 'The email or password is incorrect.' }
      }

      return {
        ok: false,
        message: 'We could not complete sign-in. Please try again.',
      }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id,status')
      .eq('id', data.user.id)
      .maybeSingle()

    if (profileError || !profile || profile.status !== 'active') {
      await supabase.auth.signOut()
      return {
        ok: false,
        message: 'This account is disabled or not yet provisioned. Contact an administrator.',
      }
    }

    const { error: auditError } = await supabase.rpc('record_login')

    if (auditError) {
      await supabase.auth.signOut()
      return {
        ok: false,
        message: 'We could not complete sign-in. Please try again.',
      }
    }
  } catch {
    return {
      ok: false,
      message: 'We could not complete sign-in. Please try again.',
    }
  }

  redirect('/')
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } finally {
    redirect('/login')
  }
}

export async function requestPasswordResetAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = emailOnlySchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: 'Enter a valid email address.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(
      parsed.data.email,
      { redirectTo: getAuthRedirectUrlFromServer('/reset-password') },
    )

    if (error) {
      return {
        ok: false,
        message: 'We could not start the reset request. Please try again later.',
      }
    }
  } catch {
    return {
      ok: false,
      message: 'We could not start the reset request. Please try again later.',
    }
  }

  return {
    ok: true,
    message: 'If an account matches that address, a reset link will arrive shortly.',
  }
}

export async function updatePasswordAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = newPasswordSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Check the password fields.',
    }
  }

  const context = await getActiveProfile()

  if (!context.user || !context.profile) {
    return {
      ok: false,
      message: 'This password link has expired. Request a new one to continue.',
    }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    })

    if (error) {
      if (error.code === 'weak_password') {
        return {
          ok: false,
          message: 'Choose a stronger password and try again.',
        }
      }

      return {
        ok: false,
        message: 'We could not update your password. Request a fresh link and try again.',
      }
    }
  } catch {
    return {
      ok: false,
      message: 'We could not update your password. Request a fresh link and try again.',
    }
  }

  redirect('/')
}

