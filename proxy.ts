import { NextResponse, type NextRequest } from 'next/server'

import { hasPublicSupabaseConfig } from '@/lib/supabase/config'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  if (!hasPublicSupabaseConfig()) {
    return NextResponse.next({ request })
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|map|woff2?|ttf|svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

