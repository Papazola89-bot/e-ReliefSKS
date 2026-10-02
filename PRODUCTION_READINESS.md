# Production readiness — 2 October 2026

Target repository: Papazola89-bot/e-ReliefSKS. Target Supabase: lhjgdvpsvscghecwuwho. Target Vercel: e-relief-sks.

## Implemented

- Restored missing school logo and school photo using the supplied originals; the repository previously contained no public images.
- Guest entry accepts a personal link or UUID token; removes the broken demo link.
- Guest submission validates date, required reason and W1–W12 period range on the server. MC automatically uses LIVE. Pending controls prevent repeated clicks.
- Success receipt displays the submitted date, reason, absence and resolved teacher rather than example content.
- Keberadaan and published schedule read real school-scoped data with admin authorization; sample records removed.
- Admin settings issues a guest token using the existing RPC for teachers without an active token.
- Dashboard and generation support date selection. Analysis and preview use the same date.
- Preview counts OPEN/UNFILLED jobs or Berkampung slots directly and disables publish while coverage is unresolved.
- Active ADMIN role is checked after sign-in and in each protected page/action. Logout available on desktop and mobile.
- Dependencies pinned; package-lock.json committed. No backend schema or algorithm changes.
- Login now links to /admin/signup. Signup validates email, password length and password confirmation, calls Supabase Auth with the publishable client, and never creates an ADMIN profile. Unconfirmed email and inactive Admin access have separate login messages.

## Verification completed

- Clean npm ci, next build and tsc --noEmit pass.
- Local production-build browser checks at 390 px: home, Guest entry, admin login and invalid-token page render without horizontal overflow or page errors. Anonymous requests to dashboard, Keberadaan and published schedule redirect to admin login. Authenticated mobile screens and valid-token form still need live production verification.
- Live Supabase tests ran in transactions and were rolled back. No test tokens, profiles, attendance or relief runs remain.
- Anonymous DB role: valid token resolution, rejection of invalid token, planned submission, LIVE MC submission, rejection of blank reason, denial of admin preview RPC.
- Authenticated DB role with temporary admin profile/JWT claims: admin profile read, guest-token issuance/read, dashboard snapshot and preview read pass RLS.
- NORMAL: create_relief_preview → publish_relief_run; 4 assignments, 0 unresolved.
- BERKAMPUNG: create_relief_preview → publish_relief_run; 42 assignments, 0 unresolved.
- Guru Pemulihan absence produces NO_RELIEF_REQUIRED.

These SQL tests verify deployed database contracts and privileges. They do not verify a real Supabase Auth password login, HTTP Data API requests using the publishable key, or production Server Actions.

## Production deployment

- Production URL: https://e-relief-sks.vercel.app/
- Deployment 4SnHJWf6cFBEqBip3KmYZ9F5uUeh is Ready on main commit 6e1737624e301a09f1267e1bcf02a75be56e9235 (22s build).
- Live public UI: home, Guest entry and Admin login render at 500px without horizontal overflow; school images load. Desktop home also passes at 1363px.
- Guest entry Server Action accepts a UUID and routes to the token page; a nonexistent token returns Link tidak sah through the production Supabase connection.
- Anonymous /admin and /admin/keberadaan requests redirect to /admin/login.

## Configuration and remaining account gate

1. Vercel browser login verified on 2 October. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY saved and verified for all environments on e-relief-sks. Git is connected; production tracks main. Source URL/key and legacy anon-key fallbacks removed; next build and typecheck pass after removal.
2. Supabase initially has zero auth.users and zero user_profiles. Users may now create an Auth account via /admin/signup, confirm their email, then have an authorized administrator associate their Auth user with an active ADMIN user_profiles row for SK Semangar. Never add a public admin-role creation endpoint.
3. Guest tokens initially number zero. After successful real admin login, use /admin/settings to issue personal links.
4. User chose to provide Admin accounts later. Multiple Admins are supported through individual Auth users with active school-scoped ADMIN profiles. Production login and authenticated end-to-end browser tests remain pending until accounts are provided. Never add a service-role/secret key to frontend code.

## Next production gate

- After Admin accounts are supplied, test real login, token issuance/resolution, planned and LIVE submission, dashboard, both modes, preview and publish through the production UI. Use an explicitly designated test date and clean up test records.
- Verify mobile Guest and authenticated Admin pages, with console/network errors checked. Report actual production alias and deployment READY status.
- Signup UI and server validation are checked locally at 390px. Live Auth settings show email signup enabled and email confirmation required. Actual confirmation-email delivery and return URL still need testing with the user's own email; no test registration or email was sent.

## Direct Guest update — 2 October 2026

- User requested open name-selected Keberadaan. /guest now loads 17 active teachers and submits without login or personal links; reason remains mandatory.
- Reviewed additive guest_staff_directory and guest_submit_by_staff RPCs applied only to e-Prod. Existing tables, RLS and Relief Engine definitions unchanged. Adapter uses internal existing Guest submission contract; token never reaches the public form.
- Anonymous transaction/rollback checks pass for directory, PLANNED insert/update (same entry ID), MC LIVE, blank-reason rejection and invalid-teacher rejection. No test attendance persisted.
- Public pages skip Auth middleware; teacher directory cached 5 minutes; loading feedback added; Vercel functions configured sin1 near the Singapore database. Actual user-perceived speed has not yet been measured.
- User email confirmed and active school ADMIN profile provisioned. Authenticated production UI end-to-end verification remains pending manual login. Supabase Auth Site URL localhost issue remains pending management access.

## Multiple absence dates — 2 October 2026

- Guest can add/remove up to 31 distinct dates with one shared reason and absence type. No date is silently preselected. All dates validated before writing; duplicate dates normalized on the server.
- Existing guest_submit_by_staff RPC called separately per date, without schema/engine changes. A batch is not atomic: receipt lists successful dates and explicitly identifies failed dates for resubmission.
- Two-date anonymous PLANNED contract verified for 6 and 7 October in a rolled-back transaction. Build passed.
