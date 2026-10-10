import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'

export type ActivityRow = Pick<
  Database['public']['Tables']['activity_logs']['Row'],
  'id' | 'action' | 'actor_id' | 'entity_type' | 'entity_id' | 'created_at'
>

export type ActivityFeedResult = {
  events: ActivityRow[]
  actorNames: Record<string, string>
  failed: boolean
}

export async function getActivityFeed(limit = 8): Promise<ActivityFeedResult> {
  const supabase = await createClient()
  const { data: events, error } = await supabase
    .from('activity_logs')
    .select('id,action,actor_id,entity_type,entity_id,created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !events) {
    return { events: [], actorNames: {}, failed: true }
  }

  const actorIds = [
    ...new Set(events.map((event) => event.actor_id).filter((id): id is string => Boolean(id))),
  ]

  if (actorIds.length === 0) {
    return { events, actorNames: {}, failed: false }
  }

  const { data: actors } = await supabase
    .from('profiles')
    .select('id,full_name')
    .in('id', actorIds)

  return {
    events,
    actorNames: Object.fromEntries(
      (actors ?? []).map((actor) => [actor.id, actor.full_name]),
    ),
    failed: false,
  }
}

