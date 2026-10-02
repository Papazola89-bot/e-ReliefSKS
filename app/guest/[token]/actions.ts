'use server';

import { redirect } from 'next/navigation';
import { isDate, isUuid, periodError } from '@/lib/validation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function submitGuestUnavailability(token: string, formData: FormData) {
  if (!isUuid(token)) redirect('/guest?error=Token%20tidak%20sah');
  const supabase = await createClient();

  const startRaw = String(formData.get('start_period') ?? '').trim();
  const endRaw = String(formData.get('end_period') ?? '').trim();
  const date = String(formData.get('date') ?? '');
  const reason = String(formData.get('reason') ?? '').trim();
  const absenceCode = String(formData.get('absence_code') ?? '');
  const validationError = !isDate(date) ? 'Tarikh tidak sah.' : !reason ? 'Sebab / program wajib diisi.' : periodError(startRaw, endRaw);
  if (validationError) redirect(`/guest/${token}?error=${encodeURIComponent(validationError)}`);
  const isEmergency = absenceCode === 'MC' || formData.get('is_emergency') === 'on';

  const payload = {
    p_token: token,
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

  const { data, error } = await supabase.rpc('guest_submit_unavailability', payload);

  if (error) {
    redirect(`/guest/${token}?error=${encodeURIComponent(error.message)}`);
  }

  if (!data?.success) redirect(`/guest/${token}?error=Penghantaran%20tidak%20berjaya`);
  const cookieStore = await cookies();
  cookieStore.set('guest_submission', JSON.stringify({ token, date, reason, absenceCode, mode: data.mode }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 300, path: `/guest/${token}` });
  redirect(`/guest/${token}/success`);
}
