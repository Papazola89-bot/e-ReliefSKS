import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const requireAdmin = cache(async function requireAdmin() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) redirect('/admin/login');

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('school_id, staff_id, app_role, active')
    .eq('auth_user_id', userData.user.id)
    .eq('active', true)
    .single();

  if (error || !profile || profile.app_role !== 'ADMIN') {
    redirect('/admin/login?error=Akaun%20ini%20bukan%20pentadbir%20aktif');
  }

  return { supabase, user: userData.user, profile };
});

export function malaysiaDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur' }).format(new Date());
}
