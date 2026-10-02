'use server';

import { redirect } from 'next/navigation';
import { isDate, isUuid, periodError } from '@/lib/validation';
import { cookies } from 'next/headers';
import { submitGuestDates, type GuestFormState } from '@/lib/guest-form';
import { revalidatePath } from 'next/cache';
import { createGuestClient } from '@/lib/supabase/public';

export async function submitKeberadaan(previous: GuestFormState, formData: FormData): Promise<GuestFormState> {
  const values = Object.fromEntries(['staff_id', 'absence_code', 'reason', 'program_name', 'organizer', 'event_level', 'venue', 'start_period', 'end_period', 'is_emergency', 'pending_date'].map(key => [key, String(formData.get(key) ?? '').slice(0, key === 'reason' ? 1000 : 200)]));
  const dates = [...new Set(formData.getAll('dates').map(String))].sort();
  const fail = (error: string): GuestFormState => ({ attempt: previous.attempt + 1, error, values, dates: dates.filter(isDate).slice(0, 31) });
  const staffId = String(formData.get('staff_id') ?? '');
  if (!isUuid(staffId)) return fail('Pilih nama guru.');

  const startRaw = String(formData.get('start_period') ?? '').trim();
  const endRaw = String(formData.get('end_period') ?? '').trim();
  const reason = String(formData.get('reason') ?? '').trim();
  const absenceCode = String(formData.get('absence_code') ?? '');
  const validationError = (!dates.length || dates.length > 31 || dates.some(date => !isDate(date))) ? 'Pilih 1 hingga 31 tarikh yang sah.' : !reason ? 'Sebab / program wajib diisi.' : periodError(startRaw, endRaw);
  if (validationError) return fail(validationError);
  if (values.pending_date && !dates.includes(values.pending_date)) return fail('Tekan Tambah untuk memasukkan tarikh yang masih dalam pemilih tarikh.');
  if (!['URUSAN_RASMI','KURSUS','MESYUARAT','CRK','CRT','MC','KELUAR_SEKOLAH','LAIN_LAIN'].includes(absenceCode)) return fail('Pilih jenis ketidakhadiran yang sah.');
  if (reason.length > 1000) return fail('Sebab / program maksimum 1000 aksara.');
  const supabase = createGuestClient();
  const isEmergency = absenceCode === 'MC' || formData.get('is_emergency') === 'on';

  const payload = {
    p_staff_id: staffId,
    p_absence_code: absenceCode,
    p_reason: reason,
    p_program_name: values.program_name || null,
    p_organizer: values.organizer || null,
    p_event_level: values.event_level || null,
    p_venue: values.venue || null,
    p_start_period: startRaw ? Number(startRaw) : null,
    p_end_period: endRaw ? Number(endRaw) : null,
    p_is_emergency: isEmergency,
  };

  const deadline = Date.now() + 90000;
  const { successful, failures, displayName, mode } = await submitGuestDates(dates, async date => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) return { success: false };
    const { data, error } = await supabase.rpc('guest_submit_by_staff', { ...payload, p_date: date }).abortSignal(AbortSignal.timeout(Math.min(15000, remaining)));
    if (error) console.error('[guest-submit]', { code: error.code || 'NETWORK', date });
    return { success: !error && Boolean(data?.success), message: error?.message, displayName: data?.display_name, mode: data?.mode };
  });
  if (successful.length) { revalidatePath('/admin'); revalidatePath('/admin/keberadaan'); }
  if (failures.length) return { ...fail(successful.length ? 'Sebahagian tarikh berjaya dihantar. Semak tarikh yang gagal di bawah dan hantar semula.' : 'Penghantaran belum dapat disahkan. Semak butiran di bawah.'), dates: failures.map(f => f.date), successfulDates: successful, failures, values: { ...values, pending_date: '' } };
  const cookieStore = await cookies();
  cookieStore.set('guest_submission', JSON.stringify({ staffId, displayName, dates: successful,  reason: reason.slice(0, 200), absenceCode, mode }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 300, path: '/guest' });
  redirect('/guest/success');
}
