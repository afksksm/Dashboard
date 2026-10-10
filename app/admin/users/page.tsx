import { UsersAdminPage } from '@/components/admin/users-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function AdminUsersRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Users"
      parentLabel="Admin"
    >
      <UsersAdminPage />
    </CrmShell>
  )
}
