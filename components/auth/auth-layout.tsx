import Link from 'next/link'
import { ShieldCheckIcon } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-2">
      <aside className="hidden flex-col justify-between border-r bg-sidebar px-10 py-8 lg:flex xl:px-14 xl:py-10">
        <Link href="/login" aria-label="Mittal Communication CRM sign in">
          <BrandMark />
        </Link>

        <div className="max-w-xl py-12">
          <Badge variant="outline">Invitation-only workspace</Badge>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">
            Make room for the work that matters.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            A calm, shared foundation for your team. Sign in to manage access,
            keep account details current, and build on a secure workspace.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t pt-5 text-sm text-muted-foreground">
          <ShieldCheckIcon aria-hidden="true" />
          <span>Private by default. Access is managed by your administrator.</span>
        </div>
      </aside>

      <section className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="mb-8 inline-flex lg:hidden"
            aria-label="Mittal Communication CRM sign in"
          >
            <BrandMark />
          </Link>
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </p>
              <CardTitle className="text-2xl tracking-tight">{title}</CardTitle>
              <CardDescription className="leading-6">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">{children}</CardContent>
          </Card>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need access? Ask your CRM administrator for an invitation.
          </p>
        </div>
      </section>
    </main>
  )
}

