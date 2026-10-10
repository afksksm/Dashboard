import { InvoiceSettingsPage } from '@/components/admin/invoice-settings'
import { CrmShell } from '@/components/shell/crm-shell'
import { DEMO_PROFILE } from '@/lib/mock/profile'

export default function AdminInvoiceRoutePage() {
  return (
    <CrmShell
      profile={DEMO_PROFILE}
      pageTitle="Invoice Settings"
      parentLabel="Admin"
    >
      <InvoiceSettingsPage />
    </CrmShell>
  )
}
