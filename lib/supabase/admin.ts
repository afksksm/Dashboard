import 'server-only'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/database.types'
import { getServerSupabaseConfig } from '@/lib/supabase/config'

export function createAdminClient() {
  const { supabaseUrl, serviceRoleKey } = getServerSupabaseConfig()

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })
}

