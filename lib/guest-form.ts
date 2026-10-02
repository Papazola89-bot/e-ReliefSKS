export type GuestFormState = {
  attempt: number;
  error?: string;
  values?: Record<string, string>;
  dates?: string[];
  successfulDates?: string[];
  failures?: Array<{ date: string; message: string }>;
};

export function guestError(message?: string) {
  if (message?.includes('bertindih')) return 'Sudah ada rekod yang bertindih. Hubungi Admin untuk semakan.';
  if (message?.includes('dikunci oleh admin')) return 'Rekod dikunci oleh Admin. Hubungi Admin untuk kemaskini.';
  if (message?.includes('tidak dibenarkan')) return 'Jenis ketidakhadiran tidak dibenarkan untuk mod ini.';
  if (message?.includes('tidak sah atau tidak aktif')) return 'Nama guru tidak aktif. Pilih semula atau hubungi Admin.';
  return 'Penghantaran belum dapat disahkan. Cuba semula; jika sambungan terputus, semak dengan Admin.';
}

export async function submitGuestDates(dates: string[], submit: (date: string) => Promise<{ success: boolean; message?: string; displayName?: string; mode?: string }>) {
  const successful: string[] = [];
  const failures: Array<{ date: string; message: string }> = [];
  let displayName = '', mode = '';
  // Keep writes ordered: the existing adapter serializes updates for each teacher.
  for (const date of dates) {
    try {
      const result = await submit(date);
      if (!result.success) { failures.push({ date, message: guestError(result.message) }); continue; }
      successful.push(date); displayName = result.displayName ?? ''; mode = result.mode ?? '';
    } catch { failures.push({ date, message: guestError() }); }
  }
  return { successful, failures, displayName, mode };
}
