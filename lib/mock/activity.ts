// lib/mock/activity.ts

export type MockActivity = {
  id: string
  type: 'sale' | 'cancellation' | 'customer' | 'product' | 'import' | 'settings' | 'user' | 'login'
  actor_id: string
  actor_name: string
  description: string
  detail?: string
  related_id: string | null
  related_type: string | null
  created_at: string
  time_ago: string
}

export const MOCK_ACTIVITY: MockActivity[] = [
  {
    id: 'act-001',
    type: 'sale',
    actor_id: 'demo-admin-001',
    actor_name: 'Saksham Sharma',
    description: 'created invoice MC/26-27/00180',
    detail: 'vivo V40 5G + 1 item · ₹38,900 via UPI (Priya Sharma)',
    related_id: 'MC/26-27/00180',
    related_type: 'invoice',
    created_at: '2026-10-10T16:32:00Z',
    time_ago: '12 MIN AGO',
  },
  {
    id: 'act-002',
    type: 'sale',
    actor_id: 'sp-002',
    actor_name: 'Rahul Verma',
    description: 'created invoice MC/26-27/00179',
    detail: '67W SuperVOOC Charger · ₹1,499 via Cash (Walk-in)',
    related_id: 'MC/26-27/00179',
    related_type: 'invoice',
    created_at: '2026-10-10T15:45:00Z',
    time_ago: '59 MIN AGO',
  },
  {
    id: 'act-003',
    type: 'cancellation',
    actor_id: 'demo-admin-001',
    actor_name: 'Saksham Sharma',
    description: 'cancelled invoice MC/26-27/00176',
    detail: 'Reason: Customer changed mind on phone model. Released IMEI 355000000000045.',
    related_id: 'MC/26-27/00176',
    related_type: 'invoice',
    created_at: '2026-10-10T14:10:00Z',
    time_ago: '2 HOURS AGO',
  },
  {
    id: 'act-004',
    type: 'customer',
    actor_id: 'sp-002',
    actor_name: 'Rahul Verma',
    description: 'added customer Amit Khandelwal',
    detail: 'Phone: +91 98101 23456 · Individual profile created',
    related_id: 'c-012',
    related_type: 'customer',
    created_at: '2026-10-10T13:20:00Z',
    time_ago: '3 HOURS AGO',
  },
  {
    id: 'act-005',
    type: 'sale',
    actor_id: 'demo-admin-001',
    actor_name: 'Saksham Sharma',
    description: 'created invoice MC/26-27/00175',
    detail: 'Samsung Galaxy A35 · ₹28,499 via Card (Rohit Electronics - GST)',
    related_id: 'MC/26-27/00175',
    related_type: 'invoice',
    created_at: '2026-10-10T11:40:00Z',
    time_ago: '5 HOURS AGO',
  },
  {
    id: 'act-006',
    type: 'product',
    actor_id: 'demo-admin-001',
    actor_name: 'Saksham Sharma',
    description: 'updated product default price for iPhone 16 128GB',
    detail: 'Default price changed from ₹74,999 to ₹72,999 before GST',
    related_id: 'p-008',
    related_type: 'product',
    created_at: '2026-10-10T10:15:00Z',
    time_ago: '6 HOURS AGO',
  },
  {
    id: 'act-007',
    type: 'login',
    actor_id: 'demo-admin-001',
    actor_name: 'Saksham Sharma',
    description: 'signed in to POS terminal',
    detail: 'Nangloi shop desktop · Chrome on Windows',
    related_id: null,
    related_type: null,
    created_at: '2026-10-10T09:30:00Z',
    time_ago: '7 HOURS AGO',
  },
  {
    id: 'act-008',
    type: 'settings',
    actor_id: 'demo-admin-001',
    actor_name: 'Saksham Sharma',
    description: 'updated invoice terms and footer text',
    detail: 'Added standard 7-day warranty claim policy notice to footer',
    related_id: null,
    related_type: null,
    created_at: '2026-10-09T18:20:00Z',
    time_ago: 'YESTERDAY',
  },
  {
    id: 'act-009',
    type: 'import',
    actor_id: 'demo-admin-001',
    actor_name: 'Saksham Sharma',
    description: 'imported 45 products via Excel catalog template',
    detail: 'Catalog updated: 42 added, 3 skipped due to duplicate names',
    related_id: null,
    related_type: null,
    created_at: '2026-10-09T12:00:00Z',
    time_ago: 'YESTERDAY',
  },
  {
    id: 'act-010',
    type: 'user',
    actor_id: 'demo-admin-001',
    actor_name: 'Saksham Sharma',
    description: 'invited salesperson Rahul Verma',
    detail: 'Role: Salesperson · Invitation email dispatched',
    related_id: 'u-002',
    related_type: 'user',
    created_at: '2026-10-08T15:00:00Z',
    time_ago: '2 DAYS AGO',
  },
]
