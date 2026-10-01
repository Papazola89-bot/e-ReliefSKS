import { CheckCircle2, Sparkles, UsersRound } from 'lucide-react';
import { AdminNav } from '@/components/AdminNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { malaysiaDate, requireAdmin } from '@/lib/admin';
import { createReliefPreview } from './actions';

export default async function NewReliefPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { supabase, profile } = await requireAdmin();
  const { error, message } = await searchParams;
  const today = malaysiaDate();

  const { data: evaluation } = await supabase.rpc('evaluate_relief_day', {
    p_school_id: profile.school_id,
    p_relief_date: today,
    p_source: 'LIVE',
  });

  const evalData = (evaluation ?? {}) as {
    p1_total?: number;
    minimum_p1_presence_pct?: number;
    max_normal_capacity_shortfall?: number;
    recommended_mode?: 'NORMAL' | 'BERKAMPUNG' | null;
  };

  const present = evalData.p1_total && evalData.minimum_p1_presence_pct != null
    ? Math.round(evalData.p1_total * evalData.minimum_p1_presence_pct)
    : 0;

  return (
    <main className="adminLayout">
      <AdminNav active="Jana Relief" />
      <section className="adminContent">
        <header className="adminTop"><div><span className="eyebrow">STEP 1 · TETAPAN</span><h1>Jana Relief</h1><p>Sistem menilai planned + LIVE dan mencadangkan mode yang sesuai.</p></div></header>
        <div className="stepper"><span className="active">1 Tetapan</span><span>2 Analisis</span><span>3 Preview</span><span>4 Terbit</span></div>
        {error ? <div className="notice warning">{error}</div> : null}
        {message ? <div className="notice info">{message}</div> : null}
        <form action={createReliefPreview} className="blockCard settingsCard">
          <label>Tarikh Relief<input name="date" type="date" defaultValue={today} required /></label>
          <label>Mode<select name="mode" defaultValue="AUTO"><option value="AUTO">AUTO</option><option value="NORMAL">RELIEF BIASA</option><option value="BERKAMPUNG">RELIEF BERKAMPUNG</option></select></label>
          <div className="analysisPreview">
            <div><UsersRound /><span>P1 Hadir</span><strong>{present} / {evalData.p1_total ?? 0}</strong></div>
            <div><CheckCircle2 /><span>Normal Capacity</span><strong>{(evalData.max_normal_capacity_shortfall ?? 0) > 0 ? `Kurang ${evalData.max_normal_capacity_shortfall}` : 'Mencukupi'}</strong></div>
            <div><Sparkles /><span>Cadangan</span><strong>{evalData.recommended_mode === 'BERKAMPUNG' ? 'Relief Berkampung' : evalData.recommended_mode === 'NORMAL' ? 'Relief Biasa' : 'Tiada Relief'}</strong></div>
          </div>
          <button type="submit" className="button primary full"><Sparkles size={18} /> Jana Cadangan</button>
        </form>
      </section>
      <MobileBottomNav />
    </main>
  );
}
