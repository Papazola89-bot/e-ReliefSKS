import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, Info, Send } from "lucide-react";
import { SchoolBrand } from "@/components/SchoolBrand";

export default async function GuestPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="guestPage container narrow">
      <header className="guestHeader"><Link href="/"><ArrowLeft size={21} /></Link><SchoolBrand compact /></header>
      <section className="pageIntro"><span className="eyebrow">GUEST MODE</span><h1>Keberadaan Guru</h1><p>Isi hanya jika tidak hadir atau bertugas di luar sekolah.</p></section>
      <div className="notice info"><Info size={20} /><span><strong>Jika hadir seperti biasa, tidak perlu isi borang ini.</strong><br />Sila isi hanya bagi urusan rasmi, kursus, CRK, MC, pertandingan atau tugasan luar.</span></div>
      <div className="notice warning"><Clock3 size={20} /><span>Keberadaan terancang disarankan dihantar sebelum <strong>6.30 petang</strong>. Kecemasan boleh dihantar bila-bila masa.</span></div>
      <form className="formCard blockCard">
        <input type="hidden" name="token" value={token} />
        <label>Nama Guru<div className="readOnlyField">Nama guru daripada token<small>Dikenal pasti melalui link / QR unik</small></div></label>
        <div className="formGrid two"><label>Tarikh<input type="date" defaultValue="2026-10-02" /></label><label>Jenis Ketidakhadiran<select defaultValue=""><option value="" disabled>Pilih jenis</option><option>URUSAN_RASMI</option><option>CRK</option><option>CRT</option><option>MC</option><option>KURSUS</option><option>MESYUARAT</option></select></label></div>
        <label>Sebab / Program *<textarea rows={3} placeholder="Contoh: TPPK MPT4, pertandingan bola sepak, kursus..." /></label>
        <div className="formGrid two"><label>Anjuran<input placeholder="Contoh: PPD Kota Tinggi" /></label><label>Peringkat<select defaultValue=""><option value="">Pilih peringkat</option><option>Sekolah</option><option>Daerah</option><option>Negeri</option><option>Kebangsaan</option></select></label></div>
        <label>Tempat<input placeholder="Contoh: PKG Bandar Mas" /></label>
        <div className="formGrid two"><label>Mula waktu<select defaultValue=""><option value="">Sehari</option><option>W1</option><option>W2</option><option>W3</option></select></label><label>Akhir waktu<select defaultValue=""><option value="">Sehari</option><option>W10</option><option>W11</option><option>W12</option></select></label></div>
        <label className="checkRow"><input type="checkbox" /><span><strong>Kecemasan / hari ini</strong><small>Tandakan untuk MC atau perubahan mendadak.</small></span></label>
        <Link href={`/guest/${token}/success`} className="button primary full"><Send size={18} /> Hantar Maklumat</Link>
      </form>
      <div className="guestFooter"><CalendarDays size={17} /><span>Rekod ini akan digunakan oleh sistem penjanaan relief selepas dihantar.</span></div>
    </main>
  );
}
