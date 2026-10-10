import { notFound } from 'next/navigation'
import { CustomerProfile } from '@/components/customers/customer-profile'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'
import { MOCK_CUSTOMERS } from '@/lib/mock/customers'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = MOCK_CUSTOMERS.find((c) => c.id === id) || MOCK_CUSTOMERS[0]

  if (!customer) {
    notFound()
  }

  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle={customer.name}
      parentLabel="Customers"
    >
      <CustomerProfile customer={customer} />
    </CrmShell>
  )
}
