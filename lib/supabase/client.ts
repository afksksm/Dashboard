'use client'

import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/lib/supabase/database.types'
import { getPublicSupabaseConfig } from '@/lib/supabase/config'

export function createClient() {
  const { supabaseUrl, supabaseKey } = getPublicSupabaseConfig()

  return createBrowserClient<Database>(supabaseUrl, supabaseKey, {
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  })
}

