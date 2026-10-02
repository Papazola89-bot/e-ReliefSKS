import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CheckCircle2, Home } from 'lucide-react';
import { isUuid } from '@/lib/validation';

export default async function SuccessPage() {
  const cookieStore = await cookies();
  let receipt: { staffId?: string; displayName?: string; date?: string; dates?: string[]; failedDates?: string[]; reason?: string; absenceCode?: string; mode?: string } = {};
  try { receipt = JSON.parse(cookieStore.get('guest_submission')?.value ?? '{}'); } catch { /* Missing receipt. */ }
  if (!receipt.staffId || !isUuid(receipt.staffId) || !receipt.displayName) redirect('/guest');
  return <main className="successPage container narrow"><div className="successCard blockCard">
    <CheckCircle2 size={74} className="successIcon" /><span className="eyebrow">BERJAYA</span>
    <h1>{receipt.failedDates?.length ? 'Sebahagian Maklumat Berjaya Dihantar' : 'Maklumat Berjaya Dihantar'}</h1><p>Terima kasih kerana memaklumkan keberadaan anda.</p>
    {receipt.failedDates?.length ? <div className="notice warning" role="alert">Tarikh belum berjaya dihantar: {receipt.failedDates.join(', ')}. Sila hantar semula tarikh ini sahaja.</div> : null}
    <div className="summaryList">
      <div><span>Nama Guru</span><strong>{receipt.displayName}</strong></div>
      <div><span>Tarikh</span><strong>{(receipt.dates ?? [receipt.date ?? '']).join(', ')}</strong></div>
      <div><span>Status</span><strong>{receipt.absenceCode} · {receipt.mode === 'LIVE' ? 'LIVE' : 'Terancang'}</strong></div>
      <div><span>Sebab / Program</span><strong>{receipt.reason}</strong></div>
    </div>
    <Link href={`/guest?staff=${receipt.staffId}`} className="button secondary full">Kemaskini Maklumat</Link>
    <Link href="/" className="button primary full"><Home size={18} /> Kembali ke Halaman Utama</Link>
  </div></main>;
}
