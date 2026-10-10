import { AnalyticsPage } from '@/components/analytics/analytics-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function AnalyticsRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Analytics"
      parentLabel="Insights"
    >
      <AnalyticsPage />
    </CrmShell>
  )
}
