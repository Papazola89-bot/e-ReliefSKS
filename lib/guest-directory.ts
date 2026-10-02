import { unstable_cache } from 'next/cache';
import { createGuestClient } from '@/lib/supabase/public';

export type GuestStaff = { id: string; staff_code: string; display_name: string };

export const getGuestDirectory = unstable_cache(async (): Promise<GuestStaff[]> => {
  const client = createGuestClient();
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { data, error } = await client.rpc('guest_staff_directory').abortSignal(AbortSignal.timeout(8000));
    if (!error) return data ?? [];
    console.error('[guest-directory]', { attempt, code: error.code || 'NETWORK' });
    if (error.code && !error.code.startsWith('08') && error.code !== '57014') break;
  }
  throw new Error('Senarai guru gagal dibaca. Sila cuba semula.');
}, ['guest-staff-directory'], { revalidate: 300 });
