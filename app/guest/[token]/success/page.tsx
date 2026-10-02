import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CheckCircle2, Home } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { isUuid } from '@/lib/validation';

export default async function SuccessPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!isUuid(token)) redirect('/guest');
  const cookieStore = await cookies();
  let receipt: { token?: string; date?: string; reason?: string; absenceCode?: string; mode?: string } = {};
  try { receipt = JSON.parse(cookieStore.get('guest_submission')?.value ?? '{}'); } catch { /* No receipt. */ }
  if (receipt.token !== token) redirect(`/guest/${token}`);
  const supabase = await createClient();
  const { data: profile, error } = await supabase.rpc('guest_resolve_token', { p_token: token });
  if (error || !profile?.valid) redirect(`/guest/${token}`);
  return <main className="successPage container narrow"><div className="successCard blockCard">
    <CheckCircle2 size={74} className="successIcon" /><span className="eyebrow">BERJAYA</span>
    <h1>Maklumat Berjaya Dihantar</h1><p>Terima kasih kerana memaklumkan keberadaan anda.</p>
    <div className="summaryList">
      <div><span>Nama Guru</span><strong>{profile.display_name}</strong></div>
      <div><span>Tarikh</span><strong>{receipt.date}</strong></div>
      <div><span>Status</span><strong>{receipt.absenceCode} · {receipt.mode === 'LIVE' ? 'LIVE' : 'Terancang'}</strong></div>
      <div><span>Sebab / Program</span><strong>{receipt.reason}</strong></div>
    </div>
    <Link href={`/guest/${token}`} className="button secondary full">Kemaskini Maklumat</Link>
    <Link href="/" className="button primary full"><Home size={18} /> Kembali ke Halaman Utama</Link>
  </div></main>;
}
