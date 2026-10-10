import { ActivityPage } from '@/components/activity/activity-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function ActivityRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Activity"
      parentLabel="Workspace"
    >
      <ActivityPage />
    </CrmShell>
  )
}
