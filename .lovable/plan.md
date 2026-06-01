## Sub-Phase 4B + 4A Bug Sweep

Tackled in 2 turns so each ships clean.

---

### Turn 1 — Foundation & high-leverage pieces

**4A bug sweep + fixes (do first, unblocks everything):**
1. Verify Lovable Emails path end-to-end: enqueue → cron → send → log. Query `email_queue` / `email_logs` to confirm last sends.
2. Confirm `pg_cron` job `process-email-queue` exists and points at the right URL.
3. Strip dead Zoho UI from `/admin/emails` (SMTP_HOST/PORT/USER/PASS fields) — keep only sender identity (from_email, from_name, reply_to, enable toggle). Mark obsolete secrets as removable.
4. Remove unused `nodemailer` + `getSmtpTransport` imports from `smtp.server.ts`; keep `renderTemplate` only.
5. Bug sweep recent files (lead create, payu webhook, onboarding) for: missing `await`, unescaped template vars, missing error handling, hardcoded statuses, RLS GRANT gaps. Fix or note in `/mnt/documents/phase4a-sweep.md`.

**4B-1 — Contact form → CRM + email (highest leverage):**
6. Public server route `POST /api/public/contact` (rate-limited by IP+email, Zod-validated): inserts into `leads` with `lead_source='contact_form'`, status `lead_created`; logs activity; enqueues `contact_ack` email to customer; enqueues `admin_new_lead` email to admin.
7. Add `admin_new_lead` template + (re-)seed if missing.
8. Wire the existing public Contact form (find current handler) to the new endpoint. Show success state.

**4B-2 — Application Summary page + gateway picker:**
9. Route `/apply/:leadCode/summary`: shows service, customer, **pricing breakdown (base/GST/total) — super_admin only via server fn**, list of enabled `payment_gateways` (radio), "Pay now" → existing PayU flow (others = placeholder buttons disabled with "coming soon").
10. New super_admin admin page `/admin/gateways` to toggle `is_enabled` / `priority` (table already exists, seed 5 rows if empty: razorpay, cashfree, payu, phonepe, ccavenue).

---

### Turn 2 — Analytics & UX polish

**4B-3 — Analytics events:**
11. Migration: `analytics_events` table (event_name, lead_id, application_id, session_id, metadata, created_at) + RLS (insert: anyone; read: staff) + GRANTs.
12. Tiny client helper `trackEvent(name, props)` → POST `/api/public/analytics/track`.
13. Instrument 11 events: page_view (landing/service), service_selected, contact_submit, lead_created, summary_viewed, gateway_selected, payment_initiated, payment_success, payment_failed, onboarding_started, onboarding_submitted.
14. Funnel cards on admin dashboard: counts + drop-off % between stages, last 7/30 days filter.

**4B-4 — Premium loading screen:**
15. Animated component (Framer Motion, brand palette, ~20–25s sequence): "Securing your details" → "Generating application code" → "Preparing payment" with progress bar + ticks. Used between Submit and gateway redirect.

---

### Technical notes

- Public POST routes go under `src/routes/api/public/*` (auth bypass per Lovable conventions). All Zod-validated; rate-limit via simple in-memory token bucket keyed on IP (best-effort, since workers are stateless — also dedupe by `(email, created_at within 60s)` in DB).
- `emails.functions.ts` already has `enqueueFromTemplateInternal` — reuse it. No new template engine.
- Application Summary pricing visibility uses a server fn returning a stripped DTO for non-super_admin (no `base_amount/gst_amount/total_amount`).
- Gateway picker reads `payment_gateways` filtered by `is_enabled=true`, sorted by `priority`. PayU is the only one wired; rest render disabled.
- Analytics dashboard uses dedup-by-`session_id` for unique visitor counts.
- Animated loading screen uses CSS + Framer Motion; no heavy lib.

### Deliverable now (Turn 1)
- `/mnt/documents/phase4a-sweep.md` with findings + fixes applied
- Working Contact form → lead + emails
- Application Summary page + gateway picker + `/admin/gateways`
- Cleaned `/admin/emails` (no dead Zoho fields)

Turn 2 ships analytics + loading screen after you confirm Turn 1 is solid.
