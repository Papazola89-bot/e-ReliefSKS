'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function fail(message: string): never {
  redirect(`/admin/signup?error=${encodeURIComponent(message)}`);
}

function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  return 'https://e-relief-sks.vercel.app';
}

export async function signup(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmation = String(formData.get('confirmPassword') ?? '');

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail('Masukkan alamat email yang sah.');
  }
  if (password.length < 8 || password.length > 128) {
    fail('Kata laluan mesti mengandungi 8 hingga 128 aksara.');
  }
  if (password !== confirmation) fail('Pengesahan kata laluan tidak sepadan.');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl()}/admin/login?verified=1`,
    },
  });

  if (error) {
    if (error.code === 'email_address_not_authorized') {
      fail('Penghantaran email pengesahan belum tersedia untuk alamat ini. Hubungi pentadbir sekolah untuk menyediakan akaun.');
    }
    if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
      fail('Terlalu banyak permintaan. Sila cuba semula sebentar lagi.');
    }
    if (error.code === 'weak_password') fail('Kata laluan terlalu lemah. Gunakan kata laluan yang lebih kuat.');
    fail('Pendaftaran tidak berjaya. Cuba semula atau hubungi pentadbir sekolah. Jika sudah berdaftar, kembali ke Log Masuk.');
  }

  // Pendaftaran hanya mencipta akaun Auth. Akses Admin tetap perlu diaktifkan oleh Admin sedia ada.
  if (data.session) await supabase.auth.signOut();
  redirect('/admin/signup?submitted=1');
}
