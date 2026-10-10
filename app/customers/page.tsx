import { CustomersPage } from '@/components/customers/customers-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function CustomersRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Customers"
      parentLabel="Records"
    >
      <CustomersPage />
    </CrmShell>
  )
}
