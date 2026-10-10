export function getPublicSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase public configuration is missing.')
  }

  return { supabaseUrl, supabaseKey }
}

export function getServerSupabaseUrl() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    throw new Error('Supabase URL is missing.')
  }

  return supabaseUrl
}

export function getSupabaseServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('Supabase service role configuration is missing.')
  }

  return serviceRoleKey
}

export function getAuthRedirectUrl(next: '/set-password' | '/reset-password') {
  const appOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ??
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000')
  const proxyUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
  const redirectUrl = new URL(proxyUrl ?? '/auth/callback', appOrigin)

  redirectUrl.searchParams.set('next', next)
  return redirectUrl.toString()
}

export function getAuthCallbackUrl(next: '/set-password' | '/reset-password') {
  return getAuthRedirectUrl(next)
}

export function getAuthRedirectUrlForServer(
  next: '/set-password' | '/reset-password',
) {
  const appOrigin =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')
  const proxyUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
  const redirectUrl = new URL(proxyUrl ?? '/auth/callback', appOrigin)

  redirectUrl.searchParams.set('next', next)
  return redirectUrl.toString()
}

export function getServerSupabaseConfig() {
  return {
    supabaseUrl: getServerSupabaseUrl(),
    serviceRoleKey: getSupabaseServiceRoleKey(),
  }
}

export function getPublicSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ''
  )
}

export function hasPublicSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      getPublicSupabaseAnonKey(),
  )
}

export function hasServerSupabaseConfig() {
  return Boolean(
    (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

export function getSupabaseConfigForServerClient() {
  return {
    supabaseUrl: getServerSupabaseUrl(),
    supabaseKey: getPublicSupabaseAnonKey(),
  }
}

export function getPublicSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
}

export function getSafeAppOrigin() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')
  )
}

export function safeAuthRedirect(next: string | null, origin: string): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
    return '/'
  }

  try {
    const base = new URL(origin)
    const target = new URL(next, base)

    if (
      target.origin !== base.origin ||
      target.pathname.startsWith('//') ||
      target.pathname.includes('\\')
    ) {
      return '/'
    }

    return `${target.pathname}${target.search}${target.hash}`
  } catch {
    return '/'
  }
}

export function getAuthRedirectUrlFromServer(
  next: '/set-password' | '/reset-password',
) {
  const redirectUrl = new URL(
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? '/auth/callback',
    getSafeAppOrigin(),
  )
  redirectUrl.searchParams.set('next', next)
  return redirectUrl.toString()
}

export function getSupabaseKeys() {
  const { supabaseUrl, supabaseKey } = getPublicSupabaseConfig()
  return { supabaseUrl, supabaseKey }
}

export function getServiceSupabaseKeys() {
  const { supabaseUrl, serviceRoleKey } = getServerSupabaseConfig()
  return { supabaseUrl, serviceRoleKey }
}
