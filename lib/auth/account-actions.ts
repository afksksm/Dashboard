'use server'

import { revalidatePath } from 'next/cache'

import type { ActionResult } from '@/lib/auth/action-result'
import { getActiveProfile } from '@/lib/auth/server'
import { profileUpdateSchema } from '@/lib/auth/schemas'
import { normalizePhone } from '@/lib/supabase/domain'
import { createClient } from '@/lib/supabase/server'

export async function updateProfileAction(input: unknown): Promise<ActionResult> {
  const context = await getActiveProfile()

  if (!context.profile) {
    return { ok: false, message: 'Your session is no longer active. Sign in again.' }
  }

  const parsed = profileUpdateSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Check the profile fields.',
    }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: parsed.data.fullName,
        phone: normalizePhone(parsed.data.phone),
      })
      .eq('id', context.profile.id)
      .select('id')
      .maybeSingle()

    if (error || !data) {
      return {
        ok: false,
        message: 'We could not save your profile. Please try again.',
      }
    }
  } catch {
    return {
      ok: false,
      message: 'We could not save your profile. Please try again.',
    }
  }

  revalidatePath('/account')
  revalidatePath('/')
  return { ok: true, message: 'Your profile has been updated.' }
}

