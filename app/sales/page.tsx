import { SalesList } from '@/components/sales/sales-list'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'
import { MOCK_SALES } from '@/lib/mock/sales'

export default function SalesPage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Sales & Invoices"
      parentLabel="Workspace"
    >
      <SalesList initialSales={MOCK_SALES} />
    </CrmShell>
  )
}
