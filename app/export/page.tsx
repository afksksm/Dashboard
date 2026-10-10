import { ExportPage } from '@/components/export/export-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function ExportRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Export & Backup"
      parentLabel="Data"
    >
      <ExportPage />
    </CrmShell>
  )
}
