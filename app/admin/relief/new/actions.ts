'use server';

import { redirect } from 'next/navigation';
import { isDate } from '@/lib/validation';
import { requireAdmin } from '@/lib/admin';

export async function createReliefPreview(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const date = String(formData.get('date') ?? '');
  const mode = String(formData.get('mode') ?? 'AUTO');

  if (!isDate(date) || !['AUTO', 'NORMAL', 'BERKAMPUNG'].includes(mode)) redirect('/admin/relief/new?error=Tarikh%20atau%20mode%20tidak%20sah');

  const forceMode = mode === 'AUTO' ? null : mode;
  const { data, error } = await supabase.rpc('create_relief_preview', {
    p_school_id: profile.school_id,
    p_relief_date: date,
    p_source: 'LIVE',
    p_force_mode: forceMode,
  });

  if (error) {
    redirect(`/admin/relief/new?date=${date}&error=${encodeURIComponent(error.message)}`);
  }

  const result = data as { run_id?: string | null; status?: string } | null;

  if (!result?.run_id) {
    redirect(`/admin/relief/new?date=${date}&message=Tiada%20relief%20diperlukan`);
  }

  redirect(`/admin/relief/${result.run_id}`);
}
