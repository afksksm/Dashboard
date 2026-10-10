import { NextRequest, NextResponse } from 'next/server'

import { safeAuthRedirect } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

function callbackError(request: NextRequest) {
  return NextResponse.redirect(new URL('/auth/error', request.url))
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const tokenHash = request.nextUrl.searchParams.get('token_hash')
  const type = request.nextUrl.searchParams.get('type')
  const next = request.nextUrl.searchParams.get('next')

  try {
    const supabase = await createClient()
    let authError: { message: string } | null = null

    if (code) {
      const result = await supabase.auth.exchangeCodeForSession(code)
      authError = result.error
    } else if (
      tokenHash &&
      (type === 'invite' || type === 'recovery')
    ) {
      const result = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      })
      authError = result.error
    } else {
      return callbackError(request)
    }

    if (authError) return callbackError(request)

    const safePath = safeAuthRedirect(next, request.nextUrl.origin)
    return NextResponse.redirect(new URL(safePath, request.url))
  } catch {
    return callbackError(request)
  }
}
