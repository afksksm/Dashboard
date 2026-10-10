import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthLayout } from '@/components/auth/auth-layout'
import { Button, buttonVariants } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Authentication link error',
  description: 'The authentication link could not be verified.',
}

export default function AuthErrorPage() {
  return (
    <AuthLayout
      eyebrow="Secure access"
      title="This link could not be verified"
      description="It may have expired or already been used. Ask your administrator for a new invitation, or request another password reset."
    >
      <Button render={<Link href="/login" />}>Back to sign in</Button>
      <Link href="/forgot-password" className={buttonVariants({ variant: 'link' })}>
        Request a password reset
      </Link>
    </AuthLayout>
  )
}
