'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ActivityIcon,
  BriefcaseBusinessIcon,
  HomeIcon,
  PackageIcon,
  UsersIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { UserProfile } from '@/lib/supabase/domain'
import { Badge } from '@/components/ui/badge'

const futureItems = [
  { label: 'Customers', icon: UsersIcon },
  { label: 'Sales', icon: BriefcaseBusinessIcon },
  { label: 'Products', icon: PackageIcon },
  { label: 'Reports', icon: ActivityIcon },
]

export function WorkspaceNavigation({
  profile,
  onNavigate,
}: {
  profile: UserProfile
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  const items = [
    { label: 'Overview', href: '/', icon: HomeIcon },
    ...(profile.role === 'admin'
      ? [
          { label: 'Team', href: '/team', icon: UsersIcon },
          { label: 'Activity', href: '/activity', icon: ActivityIcon },
        ]
      : []),
    { label: 'Account', href: '/account', icon: UsersIcon },
  ]

  return (
    <nav aria-label="Workspace navigation" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Workspace
        </p>
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors',
                active
                  ? 'bg-accent font-medium text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Coming next
        </p>
        {futureItems.map(({ label, icon: Icon }) => (
          <div
            key={label}
            aria-disabled="true"
            title="Available in a later CRM phase"
            className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground/70"
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span>{label}</span>
            <Badge variant="outline" className="ml-auto px-1.5 py-0 text-[10px]">
              Later
            </Badge>
          </div>
        ))}
      </div>
    </nav>
  )
}

