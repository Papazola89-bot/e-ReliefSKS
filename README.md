# e-ReliefSKS

Frontend rasmi **Relief SK Semangar**.

Aplikasi ini dibina untuk:
- keberadaan guru tanpa login melalui Guest Mode,
- ketidakhadiran terancang dan LIVE,
- penjanaan Relief Biasa,
- Relief Berkampung,
- preview dan publish jadual relief,
- paparan jadual relief guru.

## UI direction

Mobile-first, **minimalist + block UI**.

- putih + teal + navy
- kad modular
- hierarchy jelas
- status chips
- shadow ringan
- responsive untuk telefon, tablet dan desktop
- foto dan logo sebenar SK Semangar

## Routes scaffold

- `/` Landing
- `/guest/[token]` Guest Mode keberadaan
- `/guest/[token]/success` Guest success
- `/admin/login` Admin login
- `/admin` Dashboard
- `/admin/keberadaan` Mingguan
- `/admin/relief/new` Jana relief
- `/admin/relief/[runId]` Preview relief
- `/relief/today` Jadual relief guru

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when Supabase wiring starts.

## Status

STEP 8A UI scaffold. Data on pages is currently mock data. Next milestone is wiring the existing Supabase RPCs and auth.
