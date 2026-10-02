'use server';

import { redirect } from 'next/navigation';
import { isDate, isUuid, periodError } from '@/lib/validation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function submitKeberadaan(formData: FormData) {
  const staffId = String(formData.get('staff_id') ?? '');
  if (!isUuid(staffId)) redirect('/guest?error=Pilih%20nama%20guru');
  const supabase = await createClient();

  const startRaw = String(formData.get('start_period') ?? '').trim();
  const endRaw = String(formData.get('end_period') ?? '').trim();
  const dates = [...new Set(formData.getAll('dates').map(String))].sort();
  const reason = String(formData.get('reason') ?? '').trim();
  const absenceCode = String(formData.get('absence_code') ?? '');
  const validationError = (!dates.length || dates.length > 31 || dates.some(date => !isDate(date))) ? 'Pilih 1 hingga 31 tarikh yang sah.' : !reason ? 'Sebab / program wajib diisi.' : periodError(startRaw, endRaw);
  if (validationError) redirect(`/guest?staff=${staffId}&error=${encodeURIComponent(validationError)}`);
  const isEmergency = absenceCode === 'MC' || formData.get('is_emergency') === 'on';

  const payload = {
    p_staff_id: staffId,
    p_absence_code: absenceCode,
    p_reason: reason,
    p_program_name: String(formData.get('program_name') ?? '') || null,
    p_organizer: String(formData.get('organizer') ?? '') || null,
    p_event_level: String(formData.get('event_level') ?? '') || null,
    p_venue: String(formData.get('venue') ?? '') || null,
    p_start_period: startRaw ? Number(startRaw) : null,
    p_end_period: endRaw ? Number(endRaw) : null,
    p_is_emergency: isEmergency,
  };

  const successful: string[] = [];
  const failed: string[] = [];
  let displayName = '';
  let mode = '';
  for (const date of dates) {
    const { data, error } = await supabase.rpc('guest_submit_by_staff', { ...payload, p_date: date });
    if (error || !data?.success) { failed.push(date); continue; }
    successful.push(date); displayName = data.display_name; mode = data.mode;
  }
  if (!successful.length) redirect(`/guest?staff=${staffId}&error=${encodeURIComponent('Penghantaran tidak berjaya bagi tarikh: ' + failed.join(', ') + '. Sila cuba semula.')}`);
  const cookieStore = await cookies();
  cookieStore.set('guest_submission', JSON.stringify({ staffId, displayName, dates: successful, failedDates: failed, reason: reason.slice(0, 200), absenceCode, mode }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 300, path: '/guest' });
  redirect('/guest/success');
}
