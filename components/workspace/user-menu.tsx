'use client'

import Link from 'next/link'
import { LogOutIcon, SettingsIcon, ChevronDownIcon } from 'lucide-react'

import { signOutAction } from '@/lib/auth/actions'
import type { UserProfile } from '@/lib/supabase/domain'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function UserMenu({ profile }: { profile: UserProfile }) {
  const initials = getInitials(profile.full_name) || 'MC'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto max-w-full gap-2 rounded-full px-2 py-1.5"
            aria-label={`Account menu for ${profile.full_name}`}
          />
        }
      >
        <Avatar className="size-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden min-w-0 flex-col text-left sm:flex">
          <span className="max-w-36 truncate text-sm font-medium">{profile.full_name}</span>
          <span className="max-w-36 truncate text-xs text-muted-foreground">{profile.email}</span>
        </span>
        <ChevronDownIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium">{profile.full_name}</span>
          <span className="block truncate text-xs text-muted-foreground">{profile.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/account" />}>
            <SettingsIcon aria-hidden="true" />
            Account settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOutAction()}>
          <LogOutIcon aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

