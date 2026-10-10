'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboardIcon,
  ReceiptIcon,
  UsersIcon,
  PackageIcon,
  BarChart3Icon,
  ActivityIcon,
  UploadIcon,
  DownloadIcon,
  UserCogIcon,
  BuildingIcon,
  FileTextIcon,
  HardDriveIcon,
  UserCircleIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserProfile } from '@/lib/supabase/domain'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
}

type NavGroup = {
  label: string
  items: NavItem[]
  adminOnly?: boolean
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboardIcon },
      { label: 'Sales & Invoices', href: '/sales', icon: ReceiptIcon },
      { label: 'Activity', href: '/activity', icon: ActivityIcon },
    ],
  },
  {
    label: 'Records',
    items: [
      { label: 'Customers', href: '/customers', icon: UsersIcon },
      { label: 'Products', href: '/products', icon: PackageIcon },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics', href: '/analytics', icon: BarChart3Icon },
    ],
  },
  {
    label: 'Data',
    items: [
      { label: 'Import', href: '/import', icon: UploadIcon },
      { label: 'Export & Backup', href: '/export', icon: DownloadIcon },
    ],
  },
  {
    label: 'Admin',
    adminOnly: true,
    items: [
      { label: 'Users', href: '/admin/users', icon: UserCogIcon },
      { label: 'Business Settings', href: '/admin/business', icon: BuildingIcon },
      { label: 'Invoice Settings', href: '/admin/invoice', icon: FileTextIcon },
      { label: 'Storage & Backups', href: '/admin/storage', icon: HardDriveIcon },
    ],
  },
]

export function CrmNavigation({
  profile,
  onNavigate,
}: {
  profile: UserProfile
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  const visibleGroups = NAV_GROUPS.filter(
    (g) => !g.adminOnly || profile.role === 'admin'
  )

  return (
    <nav aria-label="CRM navigation" className="flex flex-col gap-5 flex-1 overflow-y-auto">
      {visibleGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-0.5">
          <p className="text-eyebrow px-3 pb-1">{group.label}</p>
          {group.items.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== '/' && pathname.startsWith(`${href}/`))
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-3 rounded-full px-3 text-sm font-medium transition-colors duration-150',
                  active
                    ? 'bg-[var(--ink)] text-white'
                    : 'text-[var(--ink-2)] hover:bg-[var(--surface-3)] hover:text-[var(--ink)]'
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn(
                    'size-[18px] shrink-0',
                    active ? 'text-[var(--lime)]' : 'text-[var(--ink-3)]'
                  )}
                />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      ))}

      {/* Account at bottom */}
      <div className="mt-auto flex flex-col gap-0.5">
        <Link
          href="/account"
          onClick={onNavigate}
          aria-current={pathname === '/account' ? 'page' : undefined}
          className={cn(
            'flex min-h-11 items-center gap-3 rounded-full px-3 text-sm font-medium transition-colors duration-150',
            pathname === '/account'
              ? 'bg-[var(--ink)] text-white'
              : 'text-[var(--ink-2)] hover:bg-[var(--surface-3)] hover:text-[var(--ink)]'
          )}
        >
          <UserCircleIcon
            aria-hidden="true"
            className={cn(
              'size-[18px] shrink-0',
              pathname === '/account' ? 'text-[var(--lime)]' : 'text-[var(--ink-3)]'
            )}
          />
          <span>Account</span>
        </Link>
      </div>
    </nav>
  )
}
