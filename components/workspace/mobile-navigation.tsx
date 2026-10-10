'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MenuIcon } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { WorkspaceNavigation } from '@/components/workspace/workspace-navigation'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { UserProfile } from '@/lib/supabase/domain'

export function MobileNavigation({ profile }: { profile: UserProfile }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Open workspace navigation">
            <MenuIcon />
          </Button>
        }
      />
      <SheetContent side="left" className="flex w-72 flex-col gap-6">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Move around your CRM workspace.</SheetDescription>
        </SheetHeader>
        <Link href="/" onClick={() => setOpen(false)} aria-label="Go to workspace overview">
          <BrandMark />
        </Link>
        <WorkspaceNavigation profile={profile} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

