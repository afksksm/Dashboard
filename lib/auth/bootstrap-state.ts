import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { hasServerSupabaseConfig } from '@/lib/supabase/config'
import { emailOnlySchema } from '@/lib/auth/schemas'

export type BootstrapState =
  | 'available'
  | 'pending'
  | 'complete'
  | 'unconfigured'
  | 'unavailable'

export async function getBootstrapState(): Promise<BootstrapState> {
  const configuredEmail = process.env.CRM_BOOTSTRAP_EMAIL?.trim()

  if (
    !configuredEmail ||
    !emailOnlySchema.safeParse({ email: configuredEmail }).success ||
    !hasServerSupabaseConfig()
  ) {
    return 'unconfigured'
  }

  try {
    const supabase = createAdminClient()
    const [profileCount, acceptedBootstrap, pendingBootstrap] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase
        .from('user_invitations')
        .select('id')
        .eq('is_bootstrap', true)
        .eq('status', 'accepted')
        .maybeSingle(),
      supabase
        .from('user_invitations')
        .select('id,expires_at,sent_at')
        .eq('is_bootstrap', true)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    if (profileCount.error || acceptedBootstrap.error || pendingBootstrap.error) {
      return 'unavailable'
    }

    if (acceptedBootstrap.data) {
      return 'complete'
    }

    if (
      pendingBootstrap.data &&
      Date.parse(pendingBootstrap.data.expires_at) > Date.now()
    ) {
      return 'pending'
    }

    return (profileCount.count ?? 0) > 0 ? 'complete' : 'available'
  } catch {
    return 'unavailable'
  }
}

