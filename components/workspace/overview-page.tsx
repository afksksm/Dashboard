import { ArrowRightIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'

import { ActivityFeed } from '@/components/workspace/activity-feed'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getActivityFeed } from '@/lib/workspace/activity'
import type { UserProfile } from '@/lib/supabase/domain'

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || 'there'
}

export async function OverviewPage({ profile }: { profile: UserProfile }) {
  const activity =
    profile.role === 'admin' ? await getActivityFeed(6) : null

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">CRM foundation</Badge>
          <h2 className="text-3xl font-semibold tracking-tight">
            Good to have you back, {firstName(profile.full_name)}.
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Your secure team workspace is ready. The CRM will grow from this
            foundation without loading sample business records.
          </p>
        </div>
        {profile.role === 'admin' && (
          <Button render={<Link href="/team" />} className="shrink-0">
            <UsersIcon data-icon="inline-start" />
            Manage team
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Workspace foundation</CardTitle>
              <Badge variant="outline">Phase 0–2</Badge>
            </div>
            <CardDescription>
              Secure access and team administration are ready for the next modules.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon aria-hidden="true" />
                <h3 className="text-sm font-medium">Protected access</h3>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Invitations, role checks, and row-level security protect team data.
              </p>
              <Badge variant="secondary" className="w-fit">Ready</Badge>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center gap-2">
                <UsersIcon aria-hidden="true" />
                <h3 className="text-sm font-medium">Team management</h3>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {profile.role === 'admin'
                  ? 'Invite teammates and manage account access from one place.'
                  : 'Your administrator manages invitations and account access.'}
              </p>
              {profile.role === 'admin' ? (
                <Link href="/team" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-fit' })}>
                  Open team
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              ) : (
                <Badge variant="outline" className="w-fit">Administrator managed</Badge>
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-xl border bg-muted/40 p-4 sm:col-span-2">
              <h3 className="text-sm font-medium">Business modules</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Customer, sales, product, and reporting workflows are intentionally
                deferred to a later phase. No demo totals or sample records are shown.
              </p>
            </div>
          </CardContent>
        </Card>

        {activity ? (
          <ActivityFeed
            events={activity.events}
            actorNames={activity.actorNames}
            failed={activity.failed}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Workspace activity</CardTitle>
              <CardDescription>Recent account changes are available to administrators.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-6 text-sm text-muted-foreground">
                Your account is active. Contact an administrator if you need access to another area.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

