import Link from 'next/link';
import { AdminNav } from '@/components/AdminNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { malaysiaDate, requireAdmin } from '@/lib/admin';
import { isDate } from '@/lib/validation';

export default async function TodayReliefPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { supabase, profile } = await requireAdmin();
  const query = await searchParams;
  const date = query.date && isDate(query.date) ? query.date : malaysiaDate();
  const { data: runs, error } = await supabase.from('relief_runs').select('id,mode,relief_date,published_at').eq('school_id', profile.school_id).eq('relief_date', date).eq('status', 'PUBLISHED').order('published_at', { ascending: false });
  return <main className="adminLayout"><AdminNav active="Jadual Relief" /><section className="adminContent">
    <header className="adminTop"><div><span className="eyebrow">JADUAL RASMI</span><h1>Jadual Relief</h1><p>Jadual yang telah diterbitkan sahaja.</p></div></header>
    <form method="get" className="dateFilter"><label>Tarikh<input name="date" type="date" defaultValue={date} required /></label><button className="button secondary">Papar</button></form>
    {error ? <div className="notice warning" role="alert">Jadual gagal dibaca. Sila cuba semula.</div> : (runs ?? []).length ? (runs ?? []).map(run => <section className="blockCard adminBlock" key={run.id}><h2>{run.relief_date} · {run.mode === 'BERKAMPUNG' ? 'Relief Berkampung' : 'Relief Biasa'}</h2><Link className="button teal" href={`/admin/relief/${run.id}`}>Lihat Jadual Diterbitkan</Link></section>) : <section className="blockCard adminBlock emptyState">Belum ada jadual relief diterbitkan untuk {date}.</section>}
  </section><MobileBottomNav /></main>;
}
