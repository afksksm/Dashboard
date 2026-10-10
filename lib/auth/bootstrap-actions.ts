'use server'

import { getAuthRedirectUrlFromServer } from '@/lib/supabase/config'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBootstrapState } from '@/lib/auth/bootstrap-state'
import type { BootstrapState } from '@/lib/auth/bootstrap-state'
import { emailOnlySchema } from '@/lib/auth/schemas'

export type BootstrapActionState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

const idleState: BootstrapActionState = { status: 'idle', message: '' }

export async function requestInitialAdminInviteAction(
  _previousState: BootstrapActionState,
  _formData: FormData,
): Promise<BootstrapActionState> {
  const configuredEmail = process.env.CRM_BOOTSTRAP_EMAIL?.trim()
  const parsedEmail = emailOnlySchema.safeParse({ email: configuredEmail })

  if (!parsedEmail.success) {
    return {
      status: 'error',
      message: 'Initial administrator setup is not configured.',
    }
  }

  const state: BootstrapState = await getBootstrapState()

  if (state === 'pending') {
    return {
      status: 'success',
      message: 'The owner invitation is already in progress. Check the owner inbox.',
    }
  }

  if (state !== 'available') {
    return {
      status: 'error',
      message: 'Initial administrator setup is unavailable.',
    }
  }

  const supabase = createAdminClient()
  const email = parsedEmail.data.email
  const { data: invitation, error: insertError } = await supabase
    .from('user_invitations')
    .insert({
      email,
      role: 'admin',
      invited_by: null,
      is_bootstrap: true,
    })
    .select('id')
    .single()

  if (insertError || !invitation) {
    const { data: pending } = await supabase
      .from('user_invitations')
      .select('id')
      .eq('email', email)
      .eq('is_bootstrap', true)
      .eq('status', 'pending')
      .maybeSingle()

    if (pending) {
      return {
        status: 'success',
        message: 'The owner invitation is already in progress. Check the owner inbox.',
      }
    }

    return {
      status: 'error',
      message: 'We could not start administrator setup. Please try again.',
    }
  }

  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    email,
    {
      redirectTo: getAuthRedirectUrlFromServer('/set-password'),
      data: { full_name: 'Business owner' },
    },
  )

  if (inviteError) {
    const { data: invitationState } = await supabase
      .from('user_invitations')
      .select('auth_user_id')
      .eq('id', invitation.id)
      .maybeSingle()

    if (!invitationState?.auth_user_id) {
      await supabase
        .from('user_invitations')
        .update({ status: 'failed' })
        .eq('id', invitation.id)
    }

    return {
      status: 'error',
      message: 'We could not send the owner invitation. Check email delivery configuration and try again.',
    }
  }

  await supabase
    .from('user_invitations')
    .update({ sent_at: new Date().toISOString() })
    .eq('id', invitation.id)

  return {
    status: 'success',
    message: 'The owner invitation has been sent. Check the configured owner inbox.',
  }
}

export async function getInitialBootstrapActionState(): Promise<BootstrapActionState> {
  return idleState
}

