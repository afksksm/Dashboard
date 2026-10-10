import { ProductsPage } from '@/components/products/products-page'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function ProductsRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Products"
      parentLabel="Records"
    >
      <ProductsPage />
    </CrmShell>
  )
}
