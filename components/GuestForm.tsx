'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { GuestDates } from './GuestDates';
import { SubmitButton } from './SubmitButton';
import { submitKeberadaan } from '@/app/guest/actions';
import type { GuestStaff } from '@/lib/guest-directory';
import type { GuestFormState } from '@/lib/guest-form';

export function GuestForm({ staff, today, selectedStaff }: { staff: GuestStaff[]; today: string; selectedStaff?: string }) {
  const [state, action] = useActionState<GuestFormState, FormData>(submitKeberadaan, { attempt: 0 });
  const notice = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.error) { notice.current?.focus(); notice.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, [state.attempt, state.error]);
  return <>
    {state.error ? <div ref={notice} tabIndex={-1} className="notice warning guestErrors" role="alert"><strong>{state.error}</strong>
      {state.successfulDates?.length ? <p>Berjaya: {state.successfulDates.join(', ')}</p> : null}
      {state.failures?.map(f => <p key={f.date}>{f.date}: {f.message}</p>)}
      <p>Maklumat borang dikekalkan. Hanya tarikh yang belum berjaya akan dihantar semula.</p>
    </div> : null}
      <form key={state.attempt} action={action} className="formCard blockCard">
        <label>Nama Guru<select name="staff_id" required defaultValue={state.values?.staff_id ?? selectedStaff ?? ""}><option value="" disabled>Pilih nama anda</option>{staff.map(s => <option key={s.id} value={s.id}>{s.display_name}</option>)}</select></label>
        <GuestDates today={today} initialDates={state.dates} initialPending={state.values?.pending_date} />
        <div className="formGrid two">
          <label>Jenis Ketidakhadiran<select name="absence_code" defaultValue={state.values?.absence_code ?? ""} required><option value="" disabled>Pilih jenis</option><option value="URUSAN_RASMI">Urusan Rasmi</option><option value="KURSUS">Kursus</option><option value="MESYUARAT">Mesyuarat</option><option value="CRK">CRK</option><option value="CRT">CRT</option><option value="MC">MC</option><option value="KELUAR_SEKOLAH">Keluar Sekolah</option><option value="LAIN_LAIN">Lain-lain</option></select></label>
        </div>
        <label>Sebab / Program *<textarea name="reason" defaultValue={state.values?.reason ?? ""} maxLength={1000} rows={3} placeholder="Contoh: TPPK MPT4, pertandingan bola sepak, kursus..." required /></label>
        <div className="formGrid two"><label>Nama Program<input name="program_name" defaultValue={state.values?.program_name ?? ""} maxLength={200} placeholder="Contoh: TPPK MPT4" /></label><label>Anjuran<input name="organizer" defaultValue={state.values?.organizer ?? ""} maxLength={200} placeholder="Contoh: PPD Kota Tinggi" /></label></div>
        <div className="formGrid two"><label>Peringkat<select name="event_level" defaultValue={state.values?.event_level ?? ""}><option value="">Pilih peringkat</option><option>Sekolah</option><option>Daerah</option><option>Negeri</option><option>Kebangsaan</option></select></label><label>Tempat<input name="venue" defaultValue={state.values?.venue ?? ""} maxLength={200} placeholder="Contoh: PKG Bandar Mas" /></label></div>
        <div className="formGrid two"><label>Mula waktu<select name="start_period" defaultValue={state.values?.start_period ?? ""}><option value="">Sehari</option>{Array.from({ length: 12 },(_,i)=><option key={i+1} value={i+1}>W{i+1}</option>)}</select></label><label>Akhir waktu<select name="end_period" defaultValue={state.values?.end_period ?? ""}><option value="">Sehari</option>{Array.from({ length: 12 },(_,i)=><option key={i+1} value={i+1}>W{i+1}</option>)}</select></label></div>
        <label className="checkRow"><input name="is_emergency" type="checkbox" defaultChecked={state.values?.is_emergency === "on"} /><span><strong>Kecemasan / LIVE</strong><small>Tandakan untuk perubahan mendadak yang perlu dibaca sistem serta-merta. MC diproses sebagai LIVE secara automatik.</small></span></label>
        <SubmitButton><Send size={18} /> Hantar Maklumat</SubmitButton>
      </form>
  </>;
}
