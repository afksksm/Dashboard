import { AccountPage } from '@/components/account/account-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function AccountRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Account Settings"
      parentLabel="User"
    >
      <AccountPage />
    </CrmShell>
  )
}
