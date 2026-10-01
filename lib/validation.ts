export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function periodError(start: string, end: string) {
  if (!start && !end) return null;
  if (!start || !end) return 'Pilih kedua-dua waktu mula dan akhir.';
  const a = Number(start), b = Number(end);
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b > 12 || a > b) {
    return 'Julat waktu mesti antara W1 hingga W12 dan waktu akhir selepas waktu mula.';
  }
  return null;
}
