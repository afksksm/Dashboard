import type { Metadata } from 'next'

import { WorkspaceShell } from '@/components/workspace/workspace-shell'
import { TeamManagement } from '@/components/workspace/team-management'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/server'
import { requireAdminProfile } from '@/lib/auth/server'
import { asTeamMember } from '@/lib/supabase/domain'

export const metadata: Metadata = {
  title: 'Team administration',
  description: 'Manage CRM invitations and account access.',
}

export default async function TeamPage() {
  const { user, profile } = await requireAdminProfile()
  const supabase = await createClient()

  const [membersResult, invitationsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id,email,full_name,role,status,last_login_at')
      .order('full_name', { ascending: true }),
    supabase
      .from('user_invitations')
      .select('id,email,role,status,is_bootstrap,sent_at,expires_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const hasLoadError = Boolean(membersResult.error || invitationsResult.error)

  return (
    <WorkspaceShell profile={profile} title="Team">
      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">Team access</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Invite people with the least access they need, and disable accounts when access should end.
          </p>
        </section>
        {hasLoadError && (
          <Alert variant="destructive">
            <AlertTitle>Team data could not be loaded</AlertTitle>
            <AlertDescription>
              Refresh the page. If the problem continues, verify the Supabase connection and access policies.
            </AlertDescription>
          </Alert>
        )}
        <TeamManagement
          members={(membersResult.data ?? []).map(asTeamMember)}
          invitations={invitationsResult.data ?? []}
          currentUserId={user.id}
        />
      </div>
    </WorkspaceShell>
  )
}
