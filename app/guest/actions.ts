'use server';

import { redirect } from 'next/navigation';
import { isUuid } from '@/lib/validation';

export async function openGuestLink(formData: FormData) {
  const input = String(formData.get('token') ?? '').trim();
  let token = input;
  try { token = new URL(input).pathname.match(/^\/guest\/([^/]+)\/?$/)?.[1] ?? ''; } catch { /* A token alone is also accepted. */ }
  if (!isUuid(token)) redirect('/guest?error=Masukkan%20pautan%20atau%20token%20guru%20yang%20sah.');
  redirect(`/guest/${token}`);
}
