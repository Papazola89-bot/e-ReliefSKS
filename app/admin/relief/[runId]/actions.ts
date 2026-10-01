'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

export async function publishRun(runId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc('publish_relief_run', {
    p_run_id: runId,
    p_allow_unfilled: false,
    p_notes: 'Diterbitkan melalui e-Relief SKS',
  });

  if (error) {
    redirect(`/admin/relief/${runId}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/admin/relief/${runId}?published=1`);
}
