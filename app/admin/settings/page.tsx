import Link from 'next/link';
import { AdminNav } from '@/components/AdminNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { requireAdmin } from '@/lib/admin';

export default async function Settings() {
  const { supabase, profile } = await requireAdmin();
  const { data: staff, error } = await supabase.from('staff').select('id,display_name,staff_code').eq('school_id', profile.school_id).eq('active', true).order('display_name');
  return <main className="adminLayout"><AdminNav active="Tetapan" /><section className="adminContent">
    <header className="adminTop"><div><span className="eyebrow">KEBERADAAN GURU</span><h1>Tetapan Guest</h1><p>Guru terus memilih nama dan mengisi keberadaan tanpa login.</p></div></header>
    <div className="notice info">Semua guru menggunakan borang Keberadaan yang sama. Pautan unik tidak diperlukan.</div>
    <Link href="/guest" className="button teal">Buka Borang Keberadaan</Link>
    {error ? <div className="notice warning" role="alert">Senarai guru gagal dibaca.</div> : null}
    <section className="blockCard adminBlock">{(staff ?? []).map(s => <article className="availabilityRow" key={s.id}><strong>{s.display_name} <small>{s.staff_code}</small></strong></article>)}</section>
  </section><MobileBottomNav /></main>;
}
