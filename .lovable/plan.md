# Part P — Final Wiring Verification

Audit the 20 production blockers from the launch checklist. For each item, read the relevant file(s), confirm the resolution is actually in place, and fix any gaps found. No new features — verification + targeted fixes only.

## Approach

Work through the list in three passes so related code is opened together:

**Pass 1 — Auth & access gates** (#1, #2, #3, #19)
- `/admin/*` route gate: read `src/routes/admin/route.tsx` (or `_admin` layout) — confirm `beforeLoad` calls `has_role` for staff roles, not just "signed in".
- Onboarding server fns (`src/lib/onboarding/*.functions.ts`): list public ones; mark each as intentionally public or add `requireSupabaseAuth`. Item #2 is tagged "separate sprint" — verify a TODO/comment exists; do not implement.
- `updateLeadContact` in `src/lib/crm/*`: confirm `.middleware([requireSupabaseAuth])` present.
- `bulkExportLeads`: confirm role check inside handler.

**Pass 2 — Payments, cron, email** (#4, #5, #7, #9, #18)
- CCAvenue: confirm warning banner renders in `src/routes/admin.super-admin*` / gateway settings.
- PayU refund fn: confirm it throws a clean "not supported" error.
- Closure cron route (`src/routes/api/public/cron/*`): confirm it authenticates via `apikey` header / anon key, not a custom secret.
- Email queue: confirm Super Admin has a "Process Queue" action wired to the queue-drain server fn; confirm a doc/note explains external cron requirement.
- Hardcoded Gmail address: grep `gmail.com` across `src/` to confirm none remain in code; replaced by `INTERNAL_NOTIFICATION_EMAIL` env.

**Pass 3 — Data integrity, UI, state machines** (#6, #8, #10, #11, #12, #13, #14, #15, #16, #17, #20)
- Item #6 (ops dashboard aggregation): confirm a TODO/comment tags it for post-launch; do not implement.
- Email templates: query `email_templates` count — expect 12 seeded.
- DB indexes (#10) and UNIQUE on `idempotency_key` (#20): run `supabase--linter` + `read_query` against `pg_indexes` / `pg_constraint` to confirm.
- Rate limiter (#11): confirm middleware/util exists and is applied to sensitive endpoints.
- State machines (#12): grep for direct `update({ status: ... })` writes on `leads`/`applications`/`complaints` outside the engine modules; flag any raw bypass.
- C360 leak (#13): open Customer 360 route, confirm email/activity queries are scoped by `customer_id` and respect RLS.
- `activity_logs` rendering (#14): confirm the timeline component renders rows in the customer/lead detail view.
- Certificate history tab (#15) + resend (#16): confirm tab exists in certificate detail and resend action is enabled (no hard block).
- Document status enum (#17): grep for `'verified'` literal in document code — should be `'approved'`.

## Output

For each of the 20 items: ✅ verified in place / 🔧 fixed now (with file + change) / ⏭️ deferred (with reference). Any item that requires more than a small fix (e.g. real implementation work) gets flagged back to you before I touch it rather than silently expanding scope.

## Out of scope

- #2 (onboarding fn auth) and #6 (ops dashboard DB aggregation) — both explicitly tagged "separate sprint / post-launch" in your checklist; I will only confirm the TODO markers exist.
- Any new features, redesigns, or refactors beyond the listed resolutions.
