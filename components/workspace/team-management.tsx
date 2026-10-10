import { UsersIcon } from 'lucide-react'

import { AccountStatusAction } from '@/components/workspace/account-status-action'
import { InviteUserDialog } from '@/components/workspace/invite-user-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Database } from '@/lib/supabase/database.types'
import type { TeamMember } from '@/lib/supabase/domain'

type InvitationRow = Pick<
  Database['public']['Tables']['user_invitations']['Row'],
  'id' | 'email' | 'role' | 'status' | 'is_bootstrap' | 'sent_at' | 'expires_at'
>

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase() || 'MC'
}

function formatDate(value: string | null) {
  if (!value) return 'Not yet'

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value))
}

function invitationLabel(invitation: InvitationRow) {
  if (
    invitation.status === 'pending' &&
    Date.parse(invitation.expires_at) <= Date.now()
  ) {
    return 'Expired'
  }

  const labels: Record<string, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    expired: 'Expired',
    revoked: 'Revoked',
    failed: 'Needs attention',
  }

  return labels[invitation.status] ?? 'Unknown'
}

export function TeamManagement({
  members,
  invitations,
  currentUserId,
}: {
  members: TeamMember[]
  invitations: InvitationRow[]
  currentUserId: string
}) {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Team members</CardTitle>
            <CardDescription>
              {members.length} {members.length === 1 ? 'account' : 'accounts'} in this workspace. Roles and account status are enforced on the server and in Supabase.
            </CardDescription>
          </div>
          <InviteUserDialog />
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UsersIcon />
                </EmptyMedia>
                <EmptyTitle>No team members yet</EmptyTitle>
                <EmptyDescription>
                  Invite a teammate to begin sharing this workspace.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last sign-in</TableHead>
                    <TableHead className="text-right">Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex min-w-56 items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback>{initials(member.full_name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{member.full_name}</p>
                            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {member.role === 'admin' ? 'Administrator' : 'Salesperson'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === 'active' ? 'secondary' : 'outline'}>
                          {member.status === 'active' ? 'Active' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(member.last_login_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        {member.id === currentUserId ? (
                          <span className="text-xs text-muted-foreground">You</span>
                        ) : (
                          <AccountStatusAction
                            profileId={member.id}
                            fullName={member.full_name}
                            status={member.status}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
          <CardDescription>
            Invite links expire according to the configured authentication policy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UsersIcon />
                </EmptyMedia>
                <EmptyTitle>No invitations yet</EmptyTitle>
                <EmptyDescription>
                  New teammate invitations will be listed here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Expires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => {
                    const status = invitationLabel(invitation)
                    return (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">{invitation.email}</TableCell>
                        <TableCell>
                          {invitation.role === 'admin' ? 'Administrator' : 'Salesperson'}
                          {invitation.is_bootstrap ? ' · Owner setup' : ''}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status === 'Pending' ? 'secondary' : status === 'Needs attention' ? 'destructive' : 'outline'}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDate(invitation.sent_at)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDate(invitation.expires_at)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

