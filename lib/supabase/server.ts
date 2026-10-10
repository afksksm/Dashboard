import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from '@/lib/supabase/database.types'
import { getSupabaseConfigForServerClient } from '@/lib/supabase/config'

export async function createClient() {
  const cookieStore = await cookies()
  const { supabaseUrl, supabaseKey } = getSupabaseConfigForServerClient()

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components are read-only; proxy.ts persists refreshed cookies.
        }
      },
    },
  })
}

