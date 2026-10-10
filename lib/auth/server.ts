import 'server-only'

import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

import {
  asUserProfile,
  type ProfileRow,
  type UserProfile,
} from '@/lib/supabase/domain'
import { createClient } from '@/lib/supabase/server'

export type ActiveProfileContext = {
  user: User
  profile: UserProfile
}

export async function getActiveProfile(): Promise<{
  user: User | null
  profile: UserProfile | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { user: null, profile: null }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(
      'id,email,full_name,phone,avatar_url,role,status,last_login_at,created_at,updated_at',
    )
    .eq('id', user.id)
    .maybeSingle()

  if (profileError || !profile || profile.status !== 'active') {
    return { user: null, profile: null }
  }

  return {
    user,
    profile: asUserProfile(profile as ProfileRow),
  }
}

export async function requireActiveProfile(): Promise<ActiveProfileContext> {
  const context = await getActiveProfile()

  if (!context.user || !context.profile) {
    redirect('/login?notice=access')
  }

  return {
    user: context.user,
    profile: context.profile,
  }
}

export async function requireAdminProfile(): Promise<ActiveProfileContext> {
  const context = await requireActiveProfile()

  if (context.profile.role !== 'admin') {
    redirect('/')
  }

  return context
}

