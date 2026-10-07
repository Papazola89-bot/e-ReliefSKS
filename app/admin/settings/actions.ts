'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';
import { isUuid } from '@/lib/validation';

function settingsUrl(message: string, kind: 'error' | 'activated' = 'error') {
  return `/admin/settings?${kind}=${encodeURIComponent(message)}`;
}

export async function activateAdmin(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const email = String(formData.get('email') ?? '').trim();
  const staffIdRaw = String(formData.get('staff_id') ?? '').trim();
  const staffId = staffIdRaw || null;

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect(settingsUrl('Masukkan email akaun yang sah.'));
  }
  if (staffId && !isUuid(staffId)) {
    redirect(settingsUrl('Guru yang dipilih tidak sah.'));
  }

  if (staffId) {
    const { data: staff } = await supabase
      .from('staff')
      .select('id')
      .eq('id', staffId)
      .eq('school_id', profile.school_id)
      .eq('active', true)
      .single();
    if (!staff) redirect(settingsUrl('Guru tidak dijumpai atau tidak aktif.'));
  }

  const { data, error } = await supabase.rpc('admin_activate_admin_by_email', {
    p_email: email,
    p_staff_id: staffId,
  });

  if (error || !data?.success) {
    redirect(settingsUrl(error?.message ?? 'Akses Admin tidak dapat diaktifkan.'));
  }

  revalidatePath('/admin/settings');
  redirect(settingsUrl('Akses Admin berjaya diaktifkan.', 'activated'));
}
