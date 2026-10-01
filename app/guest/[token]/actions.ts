'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function submitGuestUnavailability(token: string, formData: FormData) {
  const supabase = await createClient();

  const startRaw = String(formData.get('start_period') ?? '').trim();
  const endRaw = String(formData.get('end_period') ?? '').trim();
  const isEmergency = formData.get('is_emergency') === 'on';

  const payload = {
    p_token: token,
    p_date: String(formData.get('date') ?? ''),
    p_absence_code: String(formData.get('absence_code') ?? ''),
    p_reason: String(formData.get('reason') ?? ''),
    p_program_name: String(formData.get('program_name') ?? '') || null,
    p_organizer: String(formData.get('organizer') ?? '') || null,
    p_event_level: String(formData.get('event_level') ?? '') || null,
    p_venue: String(formData.get('venue') ?? '') || null,
    p_start_period: startRaw ? Number(startRaw) : null,
    p_end_period: endRaw ? Number(endRaw) : null,
    p_is_emergency: isEmergency,
  };

  const { error } = await supabase.rpc('guest_submit_unavailability', payload);

  if (error) {
    redirect(`/guest/${token}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/guest/${token}/success`);
}
