import { BusinessSettingsPage } from '@/components/admin/business-settings'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function AdminBusinessRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Business Settings"
      parentLabel="Admin"
    >
      <BusinessSettingsPage />
    </CrmShell>
  )
}
