import Link from 'next/link'
import type { ReactNode } from 'react'
import { ShieldCheckIcon } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { MobileNavigation } from '@/components/workspace/mobile-navigation'
import { UserMenu } from '@/components/workspace/user-menu'
import { WorkspaceNavigation } from '@/components/workspace/workspace-navigation'
import { Badge } from '@/components/ui/badge'
import type { UserProfile } from '@/lib/supabase/domain'

export function WorkspaceShell({
  profile,
  children,
  title = 'Overview',
}: {
  profile: UserProfile
  children: ReactNode
  title?: string
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar px-5 py-6 md:flex">
        <Link href="/" className="mb-9" aria-label="Mittal Communication CRM home">
          <BrandMark />
        </Link>
        <WorkspaceNavigation profile={profile} />
        <div className="mt-auto flex flex-col gap-3 rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon aria-hidden="true" />
            <span className="text-sm font-medium">Private workspace</span>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Team access is invitation-only and controlled by your administrator.
          </p>
          <Badge variant="secondary" className="w-fit">Foundation</Badge>
        </div>
      </aside>

      <div className="min-w-0 md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="md:hidden">
              <MobileNavigation profile={profile} />
            </div>
            <div className="min-w-0">
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                Mittal Communication
              </p>
              <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="outline" className="hidden sm:inline-flex">
              {profile.role === 'admin' ? 'Administrator' : 'Salesperson'}
            </Badge>
            <UserMenu profile={profile} />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

