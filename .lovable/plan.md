
## What I'll deliver in this turn

Five separate things, each scoped tight. Confirm/adjust before I start.

---

### 1. Architecture & web flow document

Write `docs/ARCHITECTURE.md` (also rendered as a `<presentation-artifact>` markdown file) covering:

- **Stack**: TanStack Start v1 on Cloudflare Worker, Vite 7, React 19, Tailwind v4, Supabase (Lovable Cloud), PayU.
- **Route map**: 150+ SEO landing routes → `LeadForm` → `/payment/:leadCode` → PayU → webhook → `/success/:leadCode` → `/onboarding/:leadCode` → `/onboarding/:leadCode/documents` → `/onboarding/:leadCode/done` → `/processing/:leadCode`.
- **Admin map**: `/admin-login` → `/admin/{dashboard,leads,leads/$id,applications,emails,gateways,services,users,activity,finance/gst,finance/settlements}`.
- **Server layer**: `createServerFn` modules in `src/lib/**`, `requireSupabaseAuth` middleware, `supabaseAdmin` for webhooks/PayU, server routes under `src/routes/api/public/*`.
- **Data model**: leads → applications → payments → invoices → settlements; onboarding_submissions, documents, email_queue/log, user_roles + RBAC (admin/super_admin/operations/support/accounts/finance).
- **Email pipeline**: enqueue → `processQueueInternal` → Lovable transactional API (unsubscribe token mint).
- **Sequence diagram** (mermaid) of the full lead→payment→onboarding flow.

---

### 2. "Duplicate users" = count distinct, not block them

Rule: a single email/mobile **can** create multiple leads across services. Nothing in the schema or UI will block duplicates. Only the **metrics** change so the same person isn't inflating numbers.

- `src/lib/crm/dashboard.functions.ts` → add `uniqueCustomers` = `count(distinct lower(email))` and `uniqueMobiles`. Keep `totalLeads` as-is.
- `admin.dashboard.tsx` → add a **"Unique Customers"** StatCard next to Total Leads, with a subtle "(N repeat)" caption = totalLeads − uniqueCustomers.
- `admin.leads.tsx` → add a "Repeat" badge on a lead row when that email already has ≥1 earlier lead (computed in the list server fn via a window count, no schema change).
- No DB migration, no unique constraint added, no existing duplicates removed.

---

### 3. Fix admin dashboard "not showing numbers & leads"

Diagnosis from DB: data exists (19 leads, 9 payments). Most likely causes:
- The logged-in admin user lacks an `admin`/`super_admin` row in `user_roles`, so RLS on `leads` returns 0 for SELECT.
- `getDashboardStats` references a `trend` field that the function never returns → chart stays empty even when totals exist.

Fixes:
- Add `trend` (last 30 days bucketed) to `getDashboardStats` so the area chart renders.
- Add a one-time **"You don't have a staff role assigned"** banner on `/admin/dashboard` when stats return all zeros AND `user_roles` for the current user is empty — so the actual cause is visible instead of a silent blank screen.
- Verify your admin auth user has a `user_roles` row; if missing, I'll insert via migration helper (`bootstrap_first_admin` already covers the first signup but later admins need an explicit row).

---

### 4. Configure PayU live payments

Currently `PAYU_MODE` defaults to `test` and `PAYU_MERCHANT_KEY` / `PAYU_MERCHANT_SALT` are set as test creds (assumed). To go live:

- Add/replace secrets via `add_secret`: `PAYU_MERCHANT_KEY` (live), `PAYU_MERCHANT_SALT` (live), and **new** `PAYU_MODE=live`.
- Confirm `payment_gateways` row `name='payu'` has `is_enabled=true` (insert via data tool).
- Confirm webhook URL `https://everythinghappensqindiaserver4cored.lovable.app/api/public/webhooks/payu` is whitelisted in PayU live dashboard (you'll need to paste this into PayU merchant dashboard — I can't do that for you).
- Add a small `/admin/gateways` health check that calls `getPayUCreds()` server-side and returns `{ mode, keyPresent: true }` (never returns the actual key).

**I will pause before applying** to ask you for the live PayU key + salt — never echo them.

---

### 5. Verify post-payment success flow + forms

Walk-through (no code change unless I find a bug):

1. PayU webhook `/api/public/webhooks/payu` → verifies `computeResponseHash`, updates `payments.status='paid'`, sets `leads.status='payment_successful'`, creates/updates `applications`, enqueues "payment_received" email, generates invoice PDF into `invoices` bucket.
2. Browser lands on `/success/:leadCode` → polls `getApplicationSummary` until paid (6 retries) → shows invoice download + "Start Onboarding" CTA.
3. `/onboarding/:leadCode` → renders `getSchema(serviceCode)` from `src/lib/onboarding/schemas.ts` (per-service field list). Submit → `onboarding_submissions` row + `applications.form_status='completed'`.
4. `/onboarding/:leadCode/documents` → `DocumentUploader` → `documents` bucket → updates `applications.document_status`.
5. `/onboarding/:leadCode/done` → triggers ops handoff email + redirects to `/processing/:leadCode`.

I'll smoke-test by:
- Invoking `getApplicationSummary` via `stack_modern--invoke-server-function` with a real `leadCode` and confirming the response shape.
- Checking the most recent `payments` row to confirm webhook actually flipped status (currently all 9 are still `created` per the count — meaning **no payment has actually completed end-to-end yet**; that's the real "after success" gap to investigate).
- Reading the webhook handler `src/routes/api/public/webhooks/payu.ts` for hash verification and status update; reporting any defects with a one-line fix proposal.

No frontend redesign in this step — just verification + targeted fixes.

---

## Order of execution

1. Architecture doc (no risk).
2. Dedup-count metric + UI badge.
3. Dashboard `trend` + role banner.
4. PayU live — **pauses for your keys**.
5. Post-payment flow audit + fixes.

## Questions before I start

1. PayU live keys ready to paste when I prompt?
2. For the "Repeat" badge in leads list — match on **email** only, or **email OR mobile**?
3. Confirm: do NOT add any DB unique constraint on `leads.email/mobile` (just the metric change)?
