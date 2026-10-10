import { NewSaleForm } from '@/components/sales/new-sale-form'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function NewSalePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="New Sale"
      parentLabel="Workspace"
    >
      <NewSaleForm />
    </CrmShell>
  )
}
