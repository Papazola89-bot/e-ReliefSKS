import Link from 'next/link';
import { ArrowLeft, CalendarDays, Clock3, Info, Send } from 'lucide-react';
import { SchoolBrand } from '@/components/SchoolBrand';
import { GuestDates } from '@/components/GuestDates';
import { SubmitButton } from '@/components/SubmitButton';
import { getGuestDirectory } from '@/lib/guest-directory';
import { submitKeberadaan } from './actions';

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
      <form action={submitKeberadaan} className="formCard blockCard">
        <label>Nama Guru<select name="staff_id" required defaultValue={selectedStaff ?? ""}><option value="" disabled>Pilih nama anda</option>{staff.map(s => <option key={s.id} value={s.id}>{s.display_name}</option>)}</select></label>
        <GuestDates today={today} />
        <div className="formGrid two">
          <label>Jenis Ketidakhadiran<select name="absence_code" defaultValue="" required><option value="" disabled>Pilih jenis</option><option value="URUSAN_RASMI">Urusan Rasmi</option><option value="KURSUS">Kursus</option><option value="MESYUARAT">Mesyuarat</option><option value="CRK">CRK</option><option value="CRT">CRT</option><option value="MC">MC</option><option value="KELUAR_SEKOLAH">Keluar Sekolah</option><option value="LAIN_LAIN">Lain-lain</option></select></label>
        </div>
        <label>Sebab / Program *<textarea name="reason" rows={3} placeholder="Contoh: TPPK MPT4, pertandingan bola sepak, kursus..." required /></label>
        <div className="formGrid two"><label>Nama Program<input name="program_name" placeholder="Contoh: TPPK MPT4" /></label><label>Anjuran<input name="organizer" placeholder="Contoh: PPD Kota Tinggi" /></label></div>
        <div className="formGrid two"><label>Peringkat<select name="event_level" defaultValue=""><option value="">Pilih peringkat</option><option>Sekolah</option><option>Daerah</option><option>Negeri</option><option>Kebangsaan</option></select></label><label>Tempat<input name="venue" placeholder="Contoh: PKG Bandar Mas" /></label></div>
        <div className="formGrid two"><label>Mula waktu<select name="start_period" defaultValue=""><option value="">Sehari</option>{Array.from({ length: 12 },(_,i)=><option key={i+1} value={i+1}>W{i+1}</option>)}</select></label><label>Akhir waktu<select name="end_period" defaultValue=""><option value="">Sehari</option>{Array.from({ length: 12 },(_,i)=><option key={i+1} value={i+1}>W{i+1}</option>)}</select></label></div>
        <label className="checkRow"><input name="is_emergency" type="checkbox" /><span><strong>Kecemasan / LIVE</strong><small>Tandakan untuk perubahan mendadak yang perlu dibaca sistem serta-merta. MC diproses sebagai LIVE secara automatik.</small></span></label>
        <SubmitButton><Send size={18} /> Hantar Maklumat</SubmitButton>
      </form>
      <div className="guestFooter"><CalendarDays size={17} /><span>Rekod ini terus digunakan oleh sistem penjanaan relief selepas dihantar.</span></div>
    </main>
  );
}
