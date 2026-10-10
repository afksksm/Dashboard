// lib/mock/profile.ts
// Demo profile for Mittal Communication CRM — matches @/lib/supabase/domain.ts UserProfile

import type { UserProfile } from '@/lib/supabase/domain'

export const DEMO_PROFILE: UserProfile = {
  id: 'demo-admin-001',
  email: 'admin@mittalcommunication.in',
  full_name: 'Saksham Sharma',
  phone: '+91 98765 43210',
  avatar_url: null,
  role: 'admin',
  status: 'active',
  last_login_at: new Date().toISOString(),
  created_at: '2026-04-01T00:00:00.000Z',
  updated_at: new Date().toISOString(),
}

export const DEMO_SALESPERSON: UserProfile = {
  id: 'sp-002',
  email: 'rahul@mittalcommunication.in',
  full_name: 'Rahul Verma',
  phone: '+91 99887 76655',
  avatar_url: null,
  role: 'salesperson',
  status: 'active',
  last_login_at: new Date().toISOString(),
  created_at: '2026-04-05T00:00:00.000Z',
  updated_at: new Date().toISOString(),
}
