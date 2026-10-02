import Link from 'next/link';
import { AdminNav } from '@/components/AdminNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { SubmitButton } from '@/components/SubmitButton';
import { requireAdmin } from '@/lib/admin';
import { issueGuestToken } from './actions';

export default async function Settings({ searchParams }: { searchParams: Promise<{ error?: string; issued?: string }> }) {
  const { supabase, profile } = await requireAdmin();
  const { error, issued } = await searchParams;
  const [{ data: staff, error: staffError }, { data: tokens, error: tokenError }] = await Promise.all([
    supabase.from('staff').select('id,display_name,staff_code').eq('school_id', profile.school_id).eq('active', true).order('display_name'),
    supabase.from('guest_access_tokens').select('staff_id,token,expires_at').eq('school_id', profile.school_id).eq('active', true),
  ]);
  const tokenMap = new Map((tokens ?? []).filter(t => !t.expires_at || new Date(t.expires_at) > new Date()).map(t => [t.staff_id, t.token]));
  return <main className="adminLayout"><AdminNav active="Tetapan" /><section className="adminContent">
    <header className="adminTop"><div><span className="eyebrow">PENGURUSAN PAUTAN</span><h1>Tetapan Guest</h1><p>Beri setiap guru pautan peribadi. Guru tidak perlu login.</p></div></header>
    <div className="notice info">Pautan peribadi hanya untuk guru berkenaan. Menukar pautan akan membatalkan pautan lama.</div>
    {error || staffError || tokenError ? <div className="notice warning" role="alert">{error ?? 'Pautan guru gagal dibaca.'}</div> : null}
    {issued ? <div className="notice info">Pautan guru berjaya dijana.</div> : null}
    <section className="blockCard adminBlock">{(staff ?? []).map(s => <article className="availabilityRow" key={s.id}>
      <strong>{s.display_name} <small>{s.staff_code}</small></strong>
      {tokenMap.has(s.id) ? <p><Link className="textLink guestTokenLink" href={`/guest/${tokenMap.get(s.id)}`} prefetch={false}>Buka pautan guru: /guest/{tokenMap.get(s.id)}</Link></p> : <p>Belum ada pautan aktif.</p>}
      <form action={issueGuestToken}><input type="hidden" name="staff_id" value={s.id} /><SubmitButton className="button secondary" disabled={tokenMap.has(s.id)}>Jana Pautan</SubmitButton></form>
    </article>)}</section>
  </section><MobileBottomNav /></main>;
}
