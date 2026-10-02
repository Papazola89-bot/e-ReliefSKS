import Link from 'next/link';
import { ArrowLeft, CalendarDays, Clock3, Info } from 'lucide-react';
import { SchoolBrand } from '@/components/SchoolBrand';
import { GuestForm } from '@/components/GuestForm';
import { getGuestDirectory } from '@/lib/guest-directory';

export const maxDuration = 120;

export default async function GuestPage({ searchParams }: {
  searchParams: Promise<{ error?: string; staff?: string }>;
}) {
  const { error, staff: selectedStaff } = await searchParams;
  let staff;
  try { staff = await getGuestDirectory(); }
  catch { return <main className="guestPage container narrow"><SchoolBrand compact /><h1>Keberadaan Guru</h1><div className="notice warning" role="alert">Senarai guru gagal dibaca. Sila cuba semula.</div><Link href="/guest" className="button primary">Cuba Semula</Link></main>; }
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur' }).format(new Date());
  return (
    <main className="guestPage container narrow">
      <header className="guestHeader"><Link href="/"><ArrowLeft size={21} aria-label="Kembali" /></Link><SchoolBrand compact /></header>
      <section className="pageIntro"><span className="eyebrow">GUEST MODE</span><h1>Keberadaan Guru</h1><p>Isi hanya jika tidak hadir atau bertugas di luar sekolah.</p></section>
      <div className="notice info"><Info size={20} /><span><strong>Jika hadir seperti biasa, tidak perlu isi borang ini.</strong><br />Sila isi hanya bagi urusan rasmi, kursus, CRK, MC, pertandingan atau tugasan luar.</span></div>
      <div className="notice warning"><Clock3 size={20} /><span>Keberadaan terancang disarankan dihantar sebelum <strong>6.30 petang</strong>. Kecemasan boleh dihantar bila-bila masa.</span></div>
      {error ? <div className="notice warning">{error}</div> : null}
      <GuestForm staff={staff} today={today} selectedStaff={selectedStaff} />
      <div className="guestFooter"><CalendarDays size={17} /><span>Rekod ini terus digunakan oleh sistem penjanaan relief selepas dihantar.</span></div>
    </main>
  );
}
