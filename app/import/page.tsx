import { ImportPage } from '@/components/import/import-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function ImportRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Import"
      parentLabel="Data"
    >
      <ImportPage />
    </CrmShell>
  )
}
