import { notFound } from 'next/navigation'
import { InvoiceDetail } from '@/components/sales/invoice-detail'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'
import { MOCK_SALES } from '@/lib/mock/sales'

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Match by id (SALE-000001) or by invoice number (MC-26-27-00001 or MC/26-27/00001)
  const normalizedSearch = id.replace(/-/g, '/').toLowerCase()
  const sale = MOCK_SALES.find(
    (s) =>
      s.id.toLowerCase() === id.toLowerCase() ||
      s.invoice_number.toLowerCase() === normalizedSearch ||
      s.invoice_number.replace(/\//g, '-').toLowerCase() === id.toLowerCase()
  ) || MOCK_SALES[0] // Fallback to first sale for rich demo preview

  if (!sale) {
    notFound()
  }

  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle={sale.invoice_number}
      parentLabel="Sales"
    >
      <InvoiceDetail sale={sale} />
    </CrmShell>
  )
}
