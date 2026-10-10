import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function HomePage() {
  // Demo mode: use DEMO_PROFILE for immediate review
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Overview"
      parentLabel="Workspace"
    >
      <DashboardPage profile={DEMO_PROFILE} />
    </CrmShell>
  )
}
