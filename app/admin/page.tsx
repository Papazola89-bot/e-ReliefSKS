import Link from 'next/link';
import { AlertTriangle, CalendarDays, CheckCircle2, Sparkles, UserRoundX, UsersRound } from 'lucide-react';
import { AdminNav } from '@/components/AdminNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { isDate } from '@/lib/validation';
import { malaysiaDate, requireAdmin } from '@/lib/admin';

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { supabase, profile } = await requireAdmin();
  const query = await searchParams;
  const today = query.date && isDate(query.date) ? query.date : malaysiaDate();

  const [{ data: snapshot, error: snapshotError }, { data: evaluation, error: evaluationError }] = await Promise.all([
    supabase.rpc('get_daily_availability_snapshot', {
      p_school_id: profile.school_id,
      p_date: today,
    }),
    supabase.rpc('evaluate_relief_day', {
      p_school_id: profile.school_id,
      p_relief_date: today,
      p_source: 'LIVE',
    }),
  ]);

  if (snapshotError || evaluationError) {
    return <main className="adminLayout"><AdminNav active="Dashboard" /><section className="adminContent"><h1>Dashboard Admin</h1><div className="notice warning" role="alert">Data dashboard gagal dibaca. Sila cuba semula.</div></section><MobileBottomNav /></main>;
  }

  const rows = (snapshot ?? []) as Array<{
    staff_id: string;
    display_name: string;
    relief_tier: string;
    planned_absence: string | null;
    live_absence: string | null;
    availability_state: string;
  }>;

  const evalData = (evaluation ?? {}) as {
    requires_relief?: boolean;
    recommended_mode?: 'NORMAL' | 'BERKAMPUNG' | null;
    total_cover_demand?: number;
  };

  const awayRows = rows.filter((r) => r.availability_state !== 'AVAILABLE');
  const liveAbsent = rows.filter((r) => r.availability_state === 'LIVE_ABSENT').length;
  const plannedAway = rows.filter((r) => r.availability_state === 'PLANNED_AWAY').length;
  const available = rows.filter(r => r.availability_state === 'AVAILABLE').length;
  const modeLabel = evalData.recommended_mode === 'BERKAMPUNG' ? 'BERKAMPUNG' : evalData.recommended_mode === 'NORMAL' ? 'BIASA' : 'TIADA';

  return (
    <main className="adminLayout">
      <AdminNav active="Dashboard" />
      <section className="adminContent">
        <header className="adminTop"><div><span className="eyebrow">{today}</span><h1>Dashboard Admin</h1><p>Ringkasan keberadaan guru dan status relief sekolah.</p></div><span className="adminChip">Admin SK Semangar</span></header>
        <form method="get" className="dateFilter"><label>Tarikh<input name="date" type="date" defaultValue={today} required /></label><button className="button secondary">Papar</button></form>
        <div className="kpiGrid">
          <div className="kpi"><UsersRound /><span>Guru Hadir</span><strong>{available}</strong><small>Status semasa</small></div>
          <div className="kpi"><CalendarDays /><span>Terancang</span><strong>{plannedAway}</strong><small>Keberadaan terancang</small></div>
          <div className="kpi"><UserRoundX /><span>Tidak Hadir LIVE</span><strong>{liveAbsent}</strong><small>Tidak hadir pada tarikh dipilih</small></div>
          <div className="kpi"><Sparkles /><span>Cadangan Mode</span><strong>{modeLabel}</strong><small>Berdasarkan kapasiti semasa</small></div>
        </div>
        <section className="blockCard adminBlock">
          <div className="sectionHeading"><div><h2>Senarai Guru Tidak Hadir</h2><p>Terancang dan LIVE pada tarikh dipilih.</p></div><Link href={`/admin/keberadaan?date=${today}`}>Lihat semua</Link></div>
          <div className="tableLike">
            {awayRows.length === 0 ? <div className="emptyState">Tiada ketidakhadiran direkodkan pada tarikh ini.</div> : awayRows.map((row,index)=><div className="tableRow" key={row.staff_id}><span>{index+1}</span><strong>{row.display_name}</strong><span className="statusPill">{row.availability_state === 'LIVE_ABSENT' ? 'LIVE' : 'PLANNED'}</span><span className="rowDetail">{row.live_absence ?? row.planned_absence ?? '-'}</span><span className="source">{row.relief_tier}</span></div>)}
          </div>
        </section>
        <div className="dashboardActions">
          <section className="blockCard reliefNeed"><AlertTriangle /><span>Keperluan Relief</span><strong>{evalData.total_cover_demand ?? 0}</strong><small>waktu perlu diisi</small></section>
          <section className="blockCard modeCard"><CheckCircle2 /><span>Mode Dicadangkan</span><strong>{modeLabel === 'BERKAMPUNG' ? 'Relief Berkampung' : modeLabel === 'BIASA' ? 'Relief Biasa' : 'Tiada Relief'}</strong><small>{evalData.requires_relief ? 'Cadangan dijana oleh Relief Orchestrator.' : 'Tiada relief diperlukan.'}</small></section>
        </div>
        <Link href={`/admin/relief/new?date=${today}`} className="button primary fabLike"><Sparkles size={18} /> Jana Relief</Link>
      </section>
      <MobileBottomNav />
    </main>
  );
}
