import Link from 'next/link';
import { CheckCircle2, ChevronLeft, Send } from 'lucide-react';
import { AdminNav } from '@/components/AdminNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { requireAdmin } from '@/lib/admin';
import { isUuid } from '@/lib/validation';
import { notFound } from 'next/navigation';
import { SubmitButton } from '@/components/SubmitButton';
import { publishRun } from './actions';

export default async function ReliefPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ runId: string }>;
  searchParams: Promise<{ error?: string; published?: string }>;
}) {
  const { runId } = await params;
  if (!isUuid(runId)) notFound();
  const { error, published } = await searchParams;
  const { supabase, profile } = await requireAdmin();

  const { data: run, error: runError } = await supabase
    .from('relief_runs')
    .select('id, mode, status, relief_date, trigger_snapshot')
    .eq('id', runId)
    .eq('school_id', profile.school_id)
    .single();

  if (runError || !run) {
    return <main className="adminLayout"><AdminNav active="Jana Relief" /><section className="adminContent"><div className="notice warning">Run relief tidak dijumpai.</div></section><MobileBottomNav /></main>;
  }

  const [{ data: assignments, error: assignmentsError }, { data: unresolvedRows, error: unresolvedError }] = await Promise.all([
    supabase.from('relief_assignments')
      .select('id, substitute_staff_id, class_id, rotation_block_no, mode, start_period, end_period, load_units, status')
      .eq('run_id', runId).neq('status', 'CANCELLED').order('start_period'),
    run.mode === 'BERKAMPUNG'
      ? supabase.from('berkampung_slots').select('id,class_id,start_period,end_period,reason').eq('run_id', runId).in('status', ['OPEN', 'UNFILLED'])
      : supabase.from('relief_jobs').select('id,class_id,period_no,reason').eq('run_id', runId).eq('requires_cover', true).in('status', ['OPEN', 'UNFILLED']),
  ]);
  const assignmentRows = assignments ?? [];
  const assignmentIds = assignmentRows.map((a) => a.id);

  const { data: links, error: linksError } = assignmentIds.length
    ? await supabase.from('relief_assignment_jobs').select('assignment_id, relief_job_id').in('assignment_id', assignmentIds)
    : { error: null, data: [] as Array<{ assignment_id: string; relief_job_id: string }> };

  const jobIds = (links ?? []).map((l) => l.relief_job_id);
  const { data: jobs, error: jobsError } = jobIds.length
    ? await supabase.from('relief_jobs').select('id, absent_staff_id, class_id, period_no, activity_code').in('id', jobIds)
    : { error: null, data: [] as Array<{ id: string; absent_staff_id: string; class_id: string | null; period_no: number; activity_code: string | null }> };

  const staffIds = Array.from(new Set([
    ...assignmentRows.map((a) => a.substitute_staff_id),
    ...(jobs ?? []).map((j) => j.absent_staff_id),
  ].filter(Boolean)));
  const classIds = Array.from(new Set([
    ...assignmentRows.map((a) => a.class_id),
    ...(jobs ?? []).map((j) => j.class_id),
    ...(unresolvedRows ?? []).map((j) => j.class_id),
  ].filter(Boolean)));

  const [{ data: staff, error: staffError }, { data: classes, error: classesError }] = await Promise.all([
    staffIds.length ? supabase.from('staff').select('id, display_name').in('id', staffIds) : Promise.resolve({ data: [], error: null }),
    classIds.length ? supabase.from('classes').select('id, class_name').in('id', classIds) : Promise.resolve({ data: [], error: null }),
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
  const unresolved = unresolvedRows?.length ?? 0;
  const readError = Boolean(assignmentsError || unresolvedError || linksError || jobsError || staffError || classesError);
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
          {readError ? <div className="notice warning" role="alert">Preview gagal dibaca. Terbitkan hanya selepas data lengkap.</div> : null}
          {unresolved > 0 ? <div className="notice warning">{unresolved} slot belum diisi. Jadual ini belum boleh diterbitkan.</div> : null}
          {(unresolvedRows ?? []).map(row => <div className="notice warning" key={row.id}>{classMap.get(row.class_id ?? '') ?? 'Kelas'} · {row.reason ?? 'Belum ada guru relief'}</div>)}
          {!cards.length && !readError ? <div className="emptyState">Tiada tugasan relief dijana.</div> : null}
          {cards.map((item,index)=><article className="reliefCard blockCard" key={item.id}><div className="reliefNo">{index+1}</div><div className="reliefMain"><span className="reliefTime">W{item.start_period}{item.end_period !== item.start_period ? `–W${item.end_period}` : ''}</span><h3>{item.className} · {item.activity}</h3><div className="pair">{run.mode === 'NORMAL' ? <span>Guru Tidak Hadir<strong>{item.absent}</strong></span> : <span>Rotasi<strong>Blok {item.rotation_block_no}</strong></span>}<span>Guru Relief<strong>{item.relief}</strong></span></div></div>{item.rotation_block_no ? <span className="rankBadge">Blok {item.rotation_block_no}</span> : <span className="rankBadge">Auto</span>}</article>)}
        </section>
        <div className="publishBar"><Link href={`/admin/relief/new?date=${run.relief_date}`} className="button secondary"><ChevronLeft size={17} /> Kembali</Link>{run.status === 'DRAFT' ? <form action={publishAction}><SubmitButton className="button teal" disabled={readError || unresolved > 0}><Send size={17} /> Terbitkan</SubmitButton></form> : <span className="button secondary"><CheckCircle2 size={17} /> {run.status}</span>}</div>
      </section>
      <MobileBottomNav />
    </main>
  );
}
