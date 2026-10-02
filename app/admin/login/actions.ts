'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    redirect('/admin/login?error=Maklumat%20login%20tidak%20lengkap');
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === 'email_not_confirmed') {
      redirect(`/admin/login?error=${encodeURIComponent('Sahkan email melalui pautan pengesahan sebelum log masuk.')}`);
    }
    redirect(`/admin/login?error=${encodeURIComponent('Email atau kata laluan tidak sah')}`);
  }

  const { data: profile } = await supabase.from('user_profiles')
    .select('app_role,active').eq('auth_user_id', data.user!.id).single();
  if (!profile?.active || profile.app_role !== 'ADMIN') {
    await supabase.auth.signOut();
    redirect(`/admin/login?error=${encodeURIComponent('Akses Admin belum aktif. Hubungi pentadbir sekolah untuk pengaktifan akaun.')}`);
  }
  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
