import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import type { Database } from '@/lib/supabase/database.types'
import { getSupabaseConfigForServerClient } from '@/lib/supabase/config'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { supabaseUrl, supabaseKey } = getSupabaseConfigForServerClient()

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })

        response = NextResponse.next({ request })

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  await supabase.auth.getClaims()
  return response
}

