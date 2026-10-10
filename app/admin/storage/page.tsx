import { StorageAdminPage } from '@/components/admin/storage-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function AdminStorageRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Storage & Backups"
      parentLabel="Admin"
    >
      <StorageAdminPage />
    </CrmShell>
  )
}
