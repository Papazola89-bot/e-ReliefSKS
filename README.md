# e-ReliefSKS

Sistem pengurusan **Relief Guru SK Semangar**.

Production: https://e-relief-sks.vercel.app/

## Ciri utama

- Guest Mode tanpa login untuk keberadaan guru
- ketidakhadiran terancang dan LIVE
- multi-tarikh bagi satu sebab/program
- Relief Biasa
- Relief Berkampung
- dashboard keberadaan sebenar
- preview relief, unresolved guard dan publish
- Supabase Auth untuk Admin
- multi-admin activation oleh Admin aktif
- mobile-first minimalist + block UI

## Route utama

- `/` Landing
- `/guest` Keberadaan Guru
- `/guest/success` Resit Guest
- `/admin/login` Login Admin
- `/admin/signup` Daftar akaun Auth
- `/admin` Dashboard
- `/admin/keberadaan` Keberadaan
- `/admin/relief/new` Jana Relief
- `/admin/relief/[runId]` Preview / Publish
- `/admin/settings` Tetapan + Multi-Admin
- `/relief/today` Jadual Relief diterbitkan

Route Guest token lama `/guest/[token]` dikekalkan hanya sebagai redirect ke `/guest`.

## Environment

Salin `.env.example` ke `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://e-relief-sks.vercel.app
```

Jangan letakkan service-role atau secret key pada frontend.

## Development

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

## Production notes

- Supabase project: `lhjgdvpsvscghecwuwho`
- Vercel project: `e-relief-sks`
- Production branch: `main`
- Guest Mode rasmi ialah borang pilih nama di `/guest`
- Signup tidak memberikan akses Admin secara automatik
- Admin aktif boleh mengaktifkan Admin lain di `/admin/settings`
- Relief Engine dan schema core tidak diubah oleh frontend hardening
