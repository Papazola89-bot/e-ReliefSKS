'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { isDate } from '@/lib/validation';

export function GuestDates({ today }: { today: string }) {
  const [dates, setDates] = useState<string[]>([]);
  const [nextDate, setNextDate] = useState(today);
  const [error, setError] = useState('');
  function addDate() {
    if (!isDate(nextDate)) { setError('Pilih tarikh yang sah.'); return; }
    if (dates.includes(nextDate)) { setError('Tarikh ini sudah dipilih.'); return; }
    if (dates.length >= 31) { setError('Maksimum 31 tarikh bagi satu penghantaran.'); return; }
    setDates([...dates, nextDate].sort()); setNextDate(''); setError('');
  }
  return <fieldset className="guestDates">
    <legend>Tarikh Tidak Hadir</legend>
    <p>Pilih satu atau beberapa tarikh. Sebab dan maklumat yang sama digunakan untuk semua tarikh.</p>
    <div className="dateChips" aria-live="polite">{dates.map(date => <span className="dateChip" key={date}>
      <input type="hidden" name="dates" value={date} />
      {new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date))}
      <button type="button" onClick={() => setDates(dates.filter(d => d !== date))} aria-label={`Buang tarikh ${date}`}><X size={16} /></button>
    </span>)}</div>
    <div className="dateAdd"><label>Tambah tarikh<input type="date" value={nextDate} onChange={e => { setNextDate(e.target.value); setError(''); }} /></label>
      <button type="button" className="button secondary" onClick={addDate}><Plus size={18} /> Tambah</button></div>
    {error ? <small role="alert">{error}</small> : null}
    {!dates.length ? <small role="alert">Tambah sekurang-kurangnya satu tarikh sebelum hantar.</small> : <small>{dates.length} tarikh dipilih</small>}
  </fieldset>;
}
