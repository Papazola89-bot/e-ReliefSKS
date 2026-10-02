import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { supabasePublishableKey, supabaseUrl } from '@/lib/supabase/config';

export type GuestStaff = { id: string; staff_code: string; display_name: string };

export const getGuestDirectory = unstable_cache(async (): Promise<GuestStaff[]> => {
  const client = createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await client.rpc('guest_staff_directory');
  if (error) throw new Error('Senarai guru gagal dibaca. Sila cuba semula.');
  return data ?? [];
}, ['guest-staff-directory'], { revalidate: 300 });
