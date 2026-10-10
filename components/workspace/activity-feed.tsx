import { ActivityIcon } from 'lucide-react'

import type { ActivityRow } from '@/lib/workspace/activity'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const actionLabels: Record<string, string> = {
  'auth.login': 'Signed in',
  'user.invite_requested': 'Created a team invitation',
  'user.invited': 'Sent a team invitation',
  'user.invitation_accepted': 'Accepted a team invitation',
  'user.invitation_expired': 'Invitation expired',
  'user.invitation_failed': 'Invitation could not be sent',
  'user.invitation_revoked': 'Revoked a team invitation',
  'user.disabled': 'Disabled an account',
  'user.reenabled': 'Restored an account',
  'user.bootstrap_requested': 'Started owner setup',
}

function formatAction(action: string) {
  return actionLabels[action] ?? action.replaceAll('.', ' ').replaceAll('_', ' ')
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value))
}

export function ActivityFeed({
  events,
  actorNames,
  failed = false,
  title = 'Recent activity',
  description = 'A record of account and team changes.',
}: {
  events: ActivityRow[]
  actorNames: Record<string, string>
  failed?: boolean
  title?: string
  description?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <p role="status" className="py-6 text-sm text-muted-foreground">
            Activity could not be loaded right now.
          </p>
        ) : events.length === 0 ? (
          <Empty className="border-0 py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ActivityIcon />
              </EmptyMedia>
              <EmptyTitle>No activity yet</EmptyTitle>
              <EmptyDescription>
                Account and team events will appear here as your workspace is used.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ol className="flex flex-col">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex items-start justify-between gap-4 border-b py-4 last:border-b-0 last:pb-0 first:pt-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{formatAction(event.action)}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {event.actor_id
                      ? actorNames[event.actor_id] ?? 'Team member'
                      : 'System'}
                    {event.entity_type ? ` · ${event.entity_type}` : ''}
                  </p>
                </div>
                <time
                  dateTime={event.created_at}
                  className="shrink-0 text-right text-xs text-muted-foreground"
                >
                  {formatTimestamp(event.created_at)}
                </time>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}

