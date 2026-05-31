
# Phase 3 — Payment Engine, Onboarding, Documents, Finance & Communication

Scope is large, so I'll ship it in 5 sequenced sub-phases. Each sub-phase is independently shippable and does **not** redesign Phase 1/2 modules — it extends them. Existing `leads` / `applications` / `payments` / `activity_logs` tables stay; we add columns + new tables and reuse the same lifecycle (no duplicate records).

---

## 3A — Finance-grade RBAC + Payment Engine core

**DB (migration)**
- Add `app_role` value `finance` (if needed) — keep existing roles.
- Extend `payments`: `application_id`, `gateway_name` (`razorpay|cashfree|payu|phonepe`), `transaction_id`, `gst_amount`, `base_amount`, `payment_date`, `webhook_response jsonb`, `idempotency_key unique`.
- New `payment_gateways` table: `name`, `is_enabled`, `priority`, `config jsonb` (key IDs only — secrets stay in Lovable Cloud secrets, never DB), `webhook_secret_name`.
- New `invoices` table: `invoice_number` (auto `INV-YYYY-NNNNNN`), `lead_id`, `application_id`, `payment_id`, `base_amount`, `gst_amount`, `total_amount`, `pdf_path` (Storage), `issued_at`.
- New `audit_logs` table: `actor_id`, `entity_type`, `entity_id`, `action`, `old_value jsonb`, `new_value jsonb`, `ip`, `user_agent`, `created_at`.
- Helper fn `is_super_admin(uid)` + `is_finance(uid)`.
- **RLS hard-lock**: `payments`, `invoices`, `payment_gateways` → SELECT only for `super_admin` (+ `finance` if added). `operations/support` get a **view** `payments_safe` exposing only `lead_id`, `application_id`, `status` (no amounts). Admin UI for ops reads from the view.

**Server functions (`src/lib/crm/...`)**
- `gateways.functions.ts` — list/toggle/reorder/configure gateways (super_admin only).
- `payments.functions.ts` — `createOrder({leadId})` picks highest-priority enabled gateway, falls back on failure; idempotent by `(lead_id, gateway, order_id)`.
- `invoices.functions.ts` — `generateInvoice(paymentId)` (pdf-lib, no native deps; Worker-safe), `regenerateInvoice`, `getSignedInvoiceUrl`.

**Public server routes (`src/routes/api/public/webhooks/*`)**
- `razorpay.ts`, `cashfree.ts`, `payu.ts`, `phonepe.ts` — HMAC signature verify per gateway, idempotent upsert, updates lead/application status to `payment_successful` / `payment_received`, triggers invoice + email queue. Reuses existing lead — no duplicates.

**Secrets requested via add_secret** (no hardcoding): `RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET`, `CASHFREE_*`, `PAYU_*`, `PHONEPE_*`. Only ask for ones the user wants to enable now.

---

## 3B — Customer Onboarding + Dynamic Form Engine + Document Center

**DB**
- `service_onboarding_schemas` (per `service_id`): `fields jsonb` (JSON-schema-lite: label, type, validation, required), `required_documents jsonb` (label, accepted_mime, max_size).
- `application_submissions`: `application_id`, `field_values jsonb`, `submitted_at`.
- `documents`: `application_id`, `doc_type`, `file_path`, `version`, `status` (`pending|approved|rejected`), `rejection_reason`, `uploaded_by`, `verified_by`, timestamps.
- Storage buckets: `documents` (private), `invoices` (private), `certificates` (private). Path scheme: `{application_id}/{doc_type}/v{n}.ext`. RLS: customer can read/write own (by signed magic link token), staff reads all, super_admin only sees finance docs.
- `magic_links`: `lead_id`, `token_hash`, `expires_at`, `purpose` — used so customers don't need a password to fill onboarding form.

**Customer portal (public, token-gated, noindex)**
- `/portal/$token` — shows lead status, personalized service form, document upload, invoice download.
- Dynamic form renderer reads `service_onboarding_schemas.fields` and renders inputs with Zod validation built from the schema.

**Seed onboarding schemas** for: New Udyam, Update Udyam, Download Udyam, Forgot Mobile/Email, PAN/Aadhaar Correction, Expert Consultation (as specified).

**Auto-update**: any submission/upload writes `activity_logs` + updates `applications.form_status` / `document_status` / `application_status` automatically via triggers — no manual sync.

---

## 3C — Workflow Engine, Email Automation, Certificates, Notifications

**Workflow**
- Status machine on `applications.application_status` with allowed transitions; trigger writes timeline + enqueues email + (optional) reassigns. Statuses match spec (Lead Created → … → Completed/Closed).

**Email engine** — use Lovable's built-in email infrastructure (requires domain setup). I'll:
1. Check `email_domain` status; if none, prompt setup dialog.
2. Run `setup_email_infra` (queue/cron/tables).
3. Run `scaffold_transactional_email`.
4. Create templates: payment-success (+ invoice link), welcome (service-specific), details-pending-reminder, documents-pending-reminder, documents-rejected, processing-started, certificate-generated, service-completed, support-ticket-update, internal-team-notification.
5. Triggers wired from status transitions and document state changes.

**Certificates**
- `certificates` table: `application_id`, `file_path`, `issued_at`, `expires_at`, `download_count`. Signed-URL downloads, emailed via `certificate-generated` + `service-completed`.

**Notifications**
- In-app `notifications` table (admin + customer scopes), bell UI in admin shell, realtime via Supabase channel. WhatsApp/SMS left as adapter stubs for future.

**Audit logs** wired across all admin mutations via a shared `withAudit()` helper around server fns.

---

## 3D — Premium Admin UI Upgrade

Keep existing routes/data — only swap presentation.

- Install `framer-motion` (already on Worker-safe list), `cmdk`, `@tanstack/react-table`, `date-fns`, `recharts` (charts only render client-side).
- New `AdminShell` v2: collapsible sidebar, command palette (⌘K), breadcrumb, dark/light theme toggle (CSS tokens in `src/styles.css`, no hard-coded colors), glassmorphism surfaces via `backdrop-blur` + token-based translucent backgrounds.
- Reusable primitives: `StatCard`, `DataTable` (sort/filter/column-visibility/pagination), `Timeline`, `ActivityFeed`, `SkeletonRow`, `StatusPill`, `EmptyState`, `SlideOver` (lead/application detail drawer).
- Motion: page transitions, list stagger, skeleton → content crossfade.
- Mobile: responsive sidebar → sheet, tables → card list under `md`.
- Dashboards (permission-gated):
  - Ops view: leads funnel, application status funnel, pending docs queue, operator performance, activity feed.
  - Super_admin view: + revenue trend, MRR/today/week, conversion %, GST collected, top services by revenue, recent payments (with amounts).
- Real-time: subscribe to `leads`, `applications`, `notifications` postgres_changes for live updates.

---

## 3E — Hardening

- Strict input validation (Zod) on every server fn + webhook.
- Rate limit public webhooks + portal endpoints (token-bucket in DB).
- Linter pass + RLS audit (`security--get_table_schema` + `linter`).
- Smoke: create lead → pay (test mode) → invoice → onboarding form → upload doc → approve → status to completed → certificate email.

---

## What I need from you before building 3A

1. **Which gateways to enable now?** (Razorpay only, or all four?) I'll only ask for secrets for those.
2. **Finance role**: keep finance-visible data restricted to `super_admin` only (your spec), or add a separate `finance` role too?
3. **Email domain**: do you already have a sender domain set up in Lovable Cloud? If not, 3C will start with the domain-setup dialog.
4. **Customer portal auth**: magic-link via email (recommended, no password), or full Supabase auth signup for customers?

Once you answer, I'll start with 3A migration + payment engine, then proceed sub-phase by sub-phase, each shippable on its own.
