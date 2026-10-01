import { AdminNav } from '@/components/AdminNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { malaysiaDate, requireAdmin } from '@/lib/admin';
import { isDate } from '@/lib/validation';

export default async function KeberadaanPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { supabase, profile } = await requireAdmin();
  const query = await searchParams;
  const date = query.date && isDate(query.date) ? query.date : malaysiaDate();
  const [{ data: planned, error: plannedError }, { data: live, error: liveError }] = await Promise.all([
    supabase.from('weekly_availability').select('id,staff_id,notes,program_name,start_period,end_period,status,absence_types(label),staff(display_name)').eq('school_id', profile.school_id).eq('planned_date', date).in('status', ['SUBMITTED', 'CONFIRMED']),
    supabase.from('attendance_events').select('id,staff_id,notes,start_period,end_period,absence_types(label),staff(display_name)').eq('school_id', profile.school_id).eq('event_date', date),
  ]);
  function displayName(value: unknown, field: string): string {
    const row = Array.isArray(value) ? value[0] : value;
    return row && typeof row === 'object' ? String((row as Record<string, unknown>)[field] ?? '-') : '-';
  }
  const rows = [
    ...(planned ?? []).map(r => ({ ...r, source: 'TERANCANG' })),
    ...(live ?? []).map(r => ({ ...r, source: 'LIVE' })),
  ];
  return <main className="adminLayout"><AdminNav active="Keberadaan" /><section className="adminContent">
    <header className="adminTop"><div><span className="eyebrow">{date}</span><h1>Keberadaan Guru</h1><p>Rekod terancang dan LIVE daripada Supabase.</p></div></header>
    <form method="get" className="dateFilter"><label>Tarikh<input name="date" type="date" defaultValue={date} required /></label><button className="button secondary">Papar</button></form>
    {plannedError || liveError ? <div className="notice warning" role="alert">Rekod keberadaan gagal dibaca. Sila cuba semula.</div> : <section className="blockCard adminBlock">
      {rows.length ? rows.map(r => <article key={r.id} className="availabilityRow">
        <div><strong>{displayName(r.staff, 'display_name')}</strong><span className="statusPill">{r.source}</span></div>
        <p>{displayName(r.absence_types, 'label')} · {r.start_period ? `W${r.start_period}–W${r.end_period}` : 'Sehari'}</p>
        <p>{r.notes}</p>
      </article>) : <div className="emptyState">Tiada ketidakhadiran direkodkan pada tarikh ini.</div>}
    </section>}
  </section><MobileBottomNav /></main>;
}
