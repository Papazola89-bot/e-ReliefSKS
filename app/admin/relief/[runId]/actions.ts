'use server';

import { redirect } from 'next/navigation';
import { isUuid } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';

export async function publishRun(runId: string) {
  const { supabase, profile } = await requireAdmin();
  if (!isUuid(runId)) redirect('/admin/relief/new?error=Run%20tidak%20sah');
  const { data: run } = await supabase.from('relief_runs').select('id').eq('id', runId).eq('school_id', profile.school_id).single();
  if (!run) redirect('/admin/relief/new?error=Run%20tidak%20dijumpai');
  const { error } = await supabase.rpc('publish_relief_run', {
    p_run_id: runId,
    p_allow_unfilled: false,
    p_notes: 'Diterbitkan melalui e-Relief SKS',
  });

  if (error) {
    redirect(`/admin/relief/${runId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/relief/today');
  revalidatePath('/admin');
  redirect(`/admin/relief/${runId}?published=1`);
}
