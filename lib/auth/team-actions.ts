'use server'

import { revalidatePath } from 'next/cache'

import type { ActionResult } from '@/lib/auth/action-result'
import { accountStatusSchema, inviteUserSchema } from '@/lib/auth/schemas'
import { getActiveProfile } from '@/lib/auth/server'
import { getAuthRedirectUrlFromServer } from '@/lib/supabase/config'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  isAccountStatus,
  isUserRole,
  type AccountStatus,
} from '@/lib/supabase/domain'
import { createClient } from '@/lib/supabase/server'

export async function inviteUserAction(input: unknown): Promise<ActionResult> {
  const context = await getActiveProfile()

  if (!context.profile || context.profile.role !== 'admin') {
    return { ok: false, message: 'You do not have permission to invite teammates.' }
  }

  const parsed = inviteUserSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Check the invitation details.',
    }
  }

  const { email, fullName, role } = parsed.data
  const supabase = await createClient()
  const admin = createAdminClient()
  const { data: pendingInvitation, error: pendingError } = await admin
    .from('user_invitations')
    .select('id,expires_at')
    .eq('email', email)
    .eq('status', 'pending')
    .maybeSingle()

  if (pendingError) {
    return { ok: false, message: 'We could not check invitation status. Try again.' }
  }

  if (pendingInvitation && Date.parse(pendingInvitation.expires_at) > Date.now()) {
    return { ok: false, message: 'A pending invitation already exists for this email.' }
  }

  if (pendingInvitation) {
    const { error: expireError } = await admin
      .from('user_invitations')
      .update({ status: 'expired' })
      .eq('id', pendingInvitation.id)

    if (expireError) {
      return { ok: false, message: 'We could not refresh the expired invitation.' }
    }
  }

  const { data: existingProfile, error: profileLookupError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (profileLookupError) {
    return { ok: false, message: 'We could not check the team directory. Try again.' }
  }

  if (existingProfile) {
    return { ok: false, message: 'An account already exists for this email.' }
  }

  const { data: invitation, error: insertError } = await supabase
    .from('user_invitations')
    .insert({
      email,
      role,
      invited_by: context.profile.id,
      is_bootstrap: false,
    })
    .select('id')
    .single()

  if (insertError || !invitation) {
    return {
      ok: false,
      message: 'We could not create this invitation. Check for a pending invite and try again.',
    }
  }

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: getAuthRedirectUrlFromServer('/set-password'),
    data: { full_name: fullName },
  })

  if (inviteError) {
    const { data: invitationState } = await admin
      .from('user_invitations')
      .select('auth_user_id')
      .eq('id', invitation.id)
      .maybeSingle()

    if (!invitationState?.auth_user_id) {
      await admin
        .from('user_invitations')
        .update({ status: 'failed' })
        .eq('id', invitation.id)
    }

    return {
      ok: false,
      message: 'The invitation could not be sent. Check email delivery configuration and try again.',
    }
  }

  await admin
    .from('user_invitations')
    .update({ sent_at: new Date().toISOString() })
    .eq('id', invitation.id)

  revalidatePath('/team')
  return { ok: true, message: `Invitation sent to ${email}.` }
}

export async function updateAccountStatusAction(
  input: unknown,
): Promise<ActionResult> {
  const context = await getActiveProfile()

  if (!context.profile || context.profile.role !== 'admin') {
    return { ok: false, message: 'You do not have permission to manage accounts.' }
  }

  const parsed = accountStatusSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: 'The account update request is invalid.' }
  }

  const { profileId, status } = parsed.data

  if (profileId === context.profile.id) {
    return { ok: false, message: 'You cannot change your own account status.' }
  }

  const supabase = await createClient()
  const { data: target, error: targetError } = await supabase
    .from('profiles')
    .select('id,role,status')
    .eq('id', profileId)
    .maybeSingle()

  if (targetError || !target || !isAccountStatus(target.status)) {
    return { ok: false, message: 'That account could not be found.' }
  }

  if (!isUserRole(target.role)) {
    return { ok: false, message: 'That account has an unsupported role.' }
  }

  if (target.status === status) {
    return { ok: true, message: 'No account changes were needed.' }
  }

  if (target.role === 'admin' && status === 'disabled') {
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin')
      .eq('status', 'active')

    if (countError || (count ?? 0) <= 1) {
      return {
        ok: false,
        message: 'The last active administrator cannot be disabled.',
      }
    }
  }

  const { data: updatedProfile, error: profileUpdateError } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', profileId)
    .select('id')
    .maybeSingle()

  if (profileUpdateError || !updatedProfile) {
    return { ok: false, message: 'We could not update that account. Try again.' }
  }

  const admin = createAdminClient()
  const { error: authUpdateError } = await admin.auth.admin.updateUserById(
    profileId,
    { ban_duration: status === 'disabled' ? '876600h' : 'none' },
  )

  if (authUpdateError) {
    const previousStatus = target.status as AccountStatus
    await supabase
      .from('profiles')
      .update({ status: previousStatus })
      .eq('id', profileId)

    return {
      ok: false,
      message: 'Account access could not be synchronized. Refresh and try again.',
    }
  }

  revalidatePath('/team')
  revalidatePath('/')
  return {
    ok: true,
    message: status === 'disabled' ? 'Account access disabled.' : 'Account access restored.',
  }
}

