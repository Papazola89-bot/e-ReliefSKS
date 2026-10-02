'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';
import { isUuid } from '@/lib/validation';

export async function issueGuestToken(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const staffId = String(formData.get('staff_id') ?? '');
  if (!isUuid(staffId)) redirect('/admin/settings?error=Guru%20tidak%20sah');
  const { data: staff } = await supabase.from('staff').select('id').eq('id', staffId).eq('school_id', profile.school_id).eq('active', true).single();
  if (!staff) redirect('/admin/settings?error=Guru%20tidak%20dijumpai');
  const { error } = await supabase.rpc('admin_issue_guest_token', { p_staff_id: staffId });
  if (error) redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/admin/settings');
  redirect('/admin/settings?issued=1');
}
