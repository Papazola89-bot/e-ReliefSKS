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
  const date = String(formData.get('date') ?? '');
  const reason = String(formData.get('reason') ?? '').trim();
  const absenceCode = String(formData.get('absence_code') ?? '');
  const validationError = !isDate(date) ? 'Tarikh tidak sah.' : !reason ? 'Sebab / program wajib diisi.' : periodError(startRaw, endRaw);
  if (validationError) redirect(`/guest?staff=${staffId}&error=${encodeURIComponent(validationError)}`);
  const isEmergency = absenceCode === 'MC' || formData.get('is_emergency') === 'on';

  const payload = {
    p_staff_id: staffId,
    p_date: date,
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

  const { data, error } = await supabase.rpc('guest_submit_by_staff', payload);

  if (error) {
    redirect(`/guest?staff=${staffId}&error=${encodeURIComponent(error.message)}`);
  }

  if (!data?.success) redirect(`/guest?staff=${staffId}&error=Penghantaran%20tidak%20berjaya`);
  const cookieStore = await cookies();
  cookieStore.set('guest_submission', JSON.stringify({ staffId, displayName: data.display_name, date, reason, absenceCode, mode: data.mode }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 300, path: '/guest' });
  redirect('/guest/success');
}
