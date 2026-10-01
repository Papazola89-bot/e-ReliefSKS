import Link from 'next/link';
import { CheckCircle2, ChevronLeft, Send } from 'lucide-react';
import { AdminNav } from '@/components/AdminNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { requireAdmin } from '@/lib/admin';
import { publishRun } from './actions';

export default async function ReliefPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ runId: string }>;
  searchParams: Promise<{ error?: string; published?: string }>;
}) {
  const { runId } = await params;
  const { error, published } = await searchParams;
  const { supabase } = await requireAdmin();

  const { data: run, error: runError } = await supabase
    .from('relief_runs')
    .select('id, mode, status, relief_date, trigger_snapshot')
    .eq('id', runId)
    .single();

  if (runError || !run) {
    return <main className="adminLayout"><AdminNav active="Jana Relief" /><section className="adminContent"><div className="notice warning">Run relief tidak dijumpai.</div></section><MobileBottomNav /></main>;
  }

  const { data: assignments } = await supabase
    .from('relief_assignments')
    .select('id, substitute_staff_id, class_id, rotation_block_no, mode, start_period, end_period, load_units, status')
    .eq('run_id', runId)
    .neq('status', 'CANCELLED')
    .order('start_period');

  const assignmentRows = assignments ?? [];
  const assignmentIds = assignmentRows.map((a) => a.id);

  const { data: links } = assignmentIds.length
    ? await supabase.from('relief_assignment_jobs').select('assignment_id, relief_job_id').in('assignment_id', assignmentIds)
    : { data: [] as Array<{ assignment_id: string; relief_job_id: string }> };

  const jobIds = (links ?? []).map((l) => l.relief_job_id);
  const { data: jobs } = jobIds.length
    ? await supabase.from('relief_jobs').select('id, absent_staff_id, class_id, period_no, activity_code').in('id', jobIds)
    : { data: [] as Array<{ id: string; absent_staff_id: string; class_id: string | null; period_no: number; activity_code: string | null }> };

  const staffIds = Array.from(new Set([
    ...assignmentRows.map((a) => a.substitute_staff_id),
    ...(jobs ?? []).map((j) => j.absent_staff_id),
  ].filter(Boolean)));
  const classIds = Array.from(new Set([
    ...assignmentRows.map((a) => a.class_id),
    ...(jobs ?? []).map((j) => j.class_id),
  ].filter(Boolean)));

  const [{ data: staff }, { data: classes }] = await Promise.all([
    staffIds.length ? supabase.from('staff').select('id, display_name').in('id', staffIds) : Promise.resolve({ data: [] }),
    classIds.length ? supabase.from('classes').select('id, class_name').in('id', classIds) : Promise.resolve({ data: [] }),
  ]);

  const staffMap = new Map((staff ?? []).map((s) => [s.id, s.display_name]));
  const classMap = new Map((classes ?? []).map((c) => [c.id, c.class_name]));
  const jobMap = new Map((jobs ?? []).map((j) => [j.id, j]));
  const linksByAssignment = new Map<string, string[]>();
  for (const link of links ?? []) {
    const current = linksByAssignment.get(link.assignment_id) ?? [];
    current.push(link.relief_job_id);
    linksByAssignment.set(link.assignment_id, current);
  }

  const cards = assignmentRows.map((a) => {
    const linkedJobs = (linksByAssignment.get(a.id) ?? []).map((id) => jobMap.get(id)).filter(Boolean) as NonNullable<ReturnType<typeof jobMap.get>>[];
    const firstJob = linkedJobs[0];
    const className = a.class_id ? classMap.get(a.class_id) : firstJob?.class_id ? classMap.get(firstJob.class_id) : undefined;
    return {
      ...a,
      className: className ?? '-',
      absent: firstJob ? staffMap.get(firstJob.absent_staff_id) ?? '-' : '-',
      relief: staffMap.get(a.substitute_staff_id) ?? '-',
      activity: firstJob?.activity_code ?? (a.mode === 'BERKAMPUNG' ? 'ROTASI' : '-'),
    };
  });

  const totalLoad = cards.reduce((sum, card) => sum + Number(card.load_units ?? 0), 0);
  const unresolved = Number((run.trigger_snapshot as Record<string, unknown> | null)?.unfilled_slots ?? (run.trigger_snapshot as Record<string, unknown> | null)?.unfilled_jobs ?? 0);
  const uniqueTeachers = new Set(cards.map((c) => c.substitute_staff_id)).size;
  const publishAction = publishRun.bind(null, runId);

  return (
    <main className="adminLayout">
      <AdminNav active="Jana Relief" />
      <section className="adminContent">
        <header className="adminTop"><div><span className="eyebrow">STEP 3 · PREVIEW</span><h1>Preview Relief</h1><p>{run.relief_date} · {run.mode === 'BERKAMPUNG' ? 'Relief Berkampung' : 'Relief Biasa'}</p></div><span className="statusPill">{run.status}</span></header>
        {error ? <div className="notice warning">{error}</div> : null}
        {published ? <div className="notice info">Jadual relief telah diterbitkan.</div> : null}
        <div className="summaryCards"><div><strong>{cards.length}</strong><span>assignment</span></div><div><strong>{unresolved}</strong><span>unresolved</span></div><div><strong>{uniqueTeachers}</strong><span>guru terlibat</span></div><div><strong>{totalLoad.toFixed(1)}</strong><span>load unit</span></div></div>
        <section className="previewList">
          {cards.map((item,index)=><article className="reliefCard blockCard" key={item.id}><div className="reliefNo">{index+1}</div><div className="reliefMain"><span className="reliefTime">W{item.start_period}{item.end_period !== item.start_period ? `–W${item.end_period}` : ''}</span><h3>{item.className} · {item.activity}</h3><div className="pair"><span>Guru Tidak Hadir<strong>{item.absent}</strong></span><span>Guru Relief<strong>{item.relief}</strong></span></div></div>{item.rotation_block_no ? <span className="rankBadge">Blok {item.rotation_block_no}</span> : <span className="rankBadge">Auto</span>}</article>)}
        </section>
        <div className="publishBar"><Link href="/admin/relief/new" className="button secondary"><ChevronLeft size={17} /> Kembali</Link>{run.status === 'DRAFT' ? <form action={publishAction}><button type="submit" className="button teal"><Send size={17} /> Terbitkan</button></form> : <span className="button secondary"><CheckCircle2 size={17} /> {run.status}</span>}</div>
      </section>
      <MobileBottomNav />
    </main>
  );
}
