import Link from 'next/link';
import { AdminNav } from '@/components/AdminNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { SubmitButton } from '@/components/SubmitButton';
import { requireAdmin } from '@/lib/admin';
import { activateAdmin } from './actions';

export default async function Settings({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; activated?: string }>;
}) {
  const { supabase, profile } = await requireAdmin();
  const { error: queryError, activated } = await searchParams;
  const { data: staff, error } = await supabase
    .from('staff')
    .select('id,display_name,staff_code')
    .eq('school_id', profile.school_id)
    .eq('active', true)
    .order('display_name');

  return <main className="adminLayout"><AdminNav active="Tetapan" /><section className="adminContent">
    <header className="adminTop"><div><span className="eyebrow">PENGURUSAN SISTEM</span><h1>Tetapan</h1><p>Urus Guest Mode dan akses pentadbir sekolah.</p></div></header>

    {queryError ? <div className="notice warning" role="alert">{queryError}</div> : null}
    {activated ? <div className="notice info" role="status">{activated}</div> : null}

    <section className="blockCard adminBlock">
      <div className="sectionHeading"><div><h2>Guest Mode</h2><p>Guru memilih nama sendiri dan mengisi keberadaan tanpa login.</p></div></div>
      <div className="notice info">Semua guru menggunakan borang Keberadaan yang sama. Pautan token lama tidak diperlukan.</div>
      <Link href="/guest" className="button teal">Buka Borang Keberadaan</Link>
    </section>

    <section className="blockCard adminBlock">
      <div className="sectionHeading"><div><h2>Aktifkan Admin</h2><p>Akaun mesti sudah didaftarkan dan email mesti telah disahkan.</p></div></div>
      <form action={activateAdmin} className="settingsCard">
        <label>Email Akaun<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="nama@sekolah.my" required /></label>
        <label>Pautkan kepada guru <select name="staff_id" defaultValue=""><option value="">Tidak dipautkan</option>{(staff ?? []).map(s => <option key={s.id} value={s.id}>{s.display_name} · {s.staff_code}</option>)}</select></label>
        <div className="notice warning">Tindakan ini memberikan akses penuh Admin SK Semangar kepada akaun tersebut. Aktifkan hanya akaun yang telah disahkan identitinya.</div>
        <SubmitButton>Aktifkan Akses Admin</SubmitButton>
      </form>
    </section>

    {error ? <div className="notice warning" role="alert">Senarai guru gagal dibaca.</div> : null}
    <section className="blockCard adminBlock"><div className="sectionHeading"><div><h2>Guru Aktif</h2><p>Rujukan untuk pemilihan akaun Admin.</p></div></div>{(staff ?? []).map(s => <article className="availabilityRow" key={s.id}><strong>{s.display_name} <small>{s.staff_code}</small></strong></article>)}</section>
  </section><MobileBottomNav /></main>;
}
