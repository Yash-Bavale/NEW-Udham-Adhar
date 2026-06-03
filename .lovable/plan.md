
# Service Workflow & Dynamic Form Engine — Build Plan

Scope: DB-driven form engine, all 7 service schemas, supporting modules (PDF, complaint, reminders, dynamic links, document mgmt), and premium admin UI overhaul.

Pricing kept dynamic via existing `services` table — no hardcoded prices.

---

## Phase A — Foundation: DB-driven Form Engine

### A1. New tables (migration)
- `service_workflows` — `service_code`, `display_name`, `application_statuses jsonb[]` (ordered status pipeline per service), `default_assignee_role`.
- `service_form_schemas` — `service_code`, `version`, `is_active`, `schema jsonb` (sections, fields, validation, conditional logic), `documents jsonb` (required/optional doc types), `created_at`, `updated_at`. Versioned: editing creates new version, old kept for in-flight apps.
- `nic_codes` — `code`, `division`, `group`, `class`, `description`, `section` (A–U), `keywords text[]`. Indexed for trigram search.
- `application_links` — `token` (secure random), `application_id`, `lead_id`, `purpose` (continue/documents/update/certificate), `expires_at`, `used_at`. Public-readable by token only.
- `complaints` — `lead_id`, `application_id`, `complaint_number`, `submitted_at`, `last_reminded_at`, `reminder_count`, `status`, `notes`.
- `certificates` — `application_id`, `file_path`, `cert_number`, `issued_at`, `delivered_at`.
- `pdf_templates` — `code`, `name`, `html_template` (Handlebars-style), `version`.

All with GRANTs + RLS (staff read/write; anon read only for `application_links` lookup via secure token; public read for `nic_codes`).

### A2. Schema engine (TS)
- `src/lib/forms/schema-engine.ts` — load active schema for service_code from DB, validate submissions against JSON schema (Zod-generated at runtime), evaluate conditional field visibility (`show_if: {field: value}`).
- Field types supported: `text`, `number`, `email`, `mobile`, `aadhaar`, `pan`, `pincode`, `select`, `radio`, `checkbox`, `date`, `textarea`, `nic_picker`, `bank_ifsc` (auto-fetch bank name), `address_group`.
- Replace `src/lib/onboarding/schemas.ts` static registry → fetch from DB, with TS fallback for the 7 services so first deploy works before seed runs.

### A3. Renderer
- `src/components/onboarding/DynamicFormRenderer.tsx` — drives sections, fields, conditional visibility, inline validation, autosave draft to `onboarding_submissions`.
- New field components: `AadhaarField`, `PANField`, `IFSCField`, `PincodeField` (auto state/district), `NICPickerDialog`.

---

## Phase B — Service Schemas (seed all 7)

Each seeded into `service_form_schemas` + matching row in `service_workflows`.

| # | Service | service_code | Key sections |
|---|---------|--------------|--------------|
| 1 | New Udyam Registration | `new_udyam` | Aadhaar, Org, PAN, Tax, Enterprise, Address, Prev Reg, Business Status, Bank, Activity (mfg/svc + NIC), Employment, Govt Portals |
| 2 | Update Udyam | `update_udyam` | Udyam No, Mobile, fields to update |
| 3 | Download Udyam | `download_udyam` | Udyam No, Mobile |
| 4 | Migrate Udyog→Udyam | `migrate_udyog` | UAM No (validated `^[A-Z]{2}\d{2}[A-Z]\d{7}$`) |
| 5 | Forgot Mobile/Email | `forgot_contact` | User type, Aadhaar, Name, Address, PAN, contact — triggers PDF gen + signed upload + complaint flow |
| 6 | PAN/Aadhaar Name Correction | `name_correction` | Udyam No, Mobile, correction info |
| 7 | Talk to Expert | `talk_to_expert` | Required service, notes — ops adds recommended service + payment link |

Required documents per service seeded into `documents` JSON.

---

## Phase C — NIC Code System
- Source: govt-published NIC 2008 list (open-source CSV available on data.gov.in / multiple GitHub mirrors). I'll seed ~700 codes.
- Insert into `nic_codes` with trigram index on `description` and `keywords`.
- `searchNicCodes` server fn (paginated, fuzzy).
- `NICPickerDialog` component: search + section filter + multi-select.

---

## Phase D — Workflow / Status Engine
- `application_status` enum extended: add `awaiting_authority`, `certificate_ready`, plus alignment with spec.
- `src/lib/workflow/transitions.ts` — `transitionStatus(applicationId, nextStatus, actor)` — validates allowed transitions per `service_workflows.application_statuses`, writes activity log, triggers status-change email.
- Auto-transitions:
  - Payment webhook → `payment_success` → `details_pending`
  - Form submit → `documents_pending` (if docs needed) or `under_review`
  - All docs verified → `under_process`
  - Certificate uploaded → `certificate_ready` → `completed` on delivery

---

## Phase E — Dynamic Link Engine
- `createApplicationLink(applicationId, purpose, ttlDays)` server fn — generates token, returns `/app/{token}` URL.
- Public route `src/routes/app.$token.tsx` — looks up `application_links`, redirects to correct page (continue form / upload docs / view cert), marks `used_at` on completion.
- Email templates reference these tokens.

---

## Phase F — PDF Generator (for Forgot Contact)
- `src/lib/pdf/templates.server.ts` — Handlebars-rendered HTML → PDF via `@react-pdf/renderer` (Worker-compatible, pure JS).
- Template seeded for "Grievance Application" using form data.
- Server fn `generateApplicationPDF(applicationId)` → stores in `documents` bucket → returns signed URL.
- Customer flow: form submit → PDF download → upload signed copy → ops review.

---

## Phase G — Complaint Tracking
- After ops marks complaint submitted with complaint number → row in `complaints` → triggers complaint-confirmation email.
- pg_cron job every 24h calls `/api/public/cron/complaint-reminders` → finds complaints >10 days without resolution, sends reminder email, increments `reminder_count`.

---

## Phase H — Document Management Upgrades
- Extend `documents` table: `version`, `parent_document_id`, `verification_comment`.
- Admin doc panel: preview, approve, reject (with comment), version history.
- Auto-update `application.document_status` when all required docs verified.

---

## Phase I — Email Automation
Seed templates in `email_templates`:
`payment_success`, `welcome`, `details_pending_reminder`, `documents_pending_reminder`, `complaint_submitted`, `complaint_reminder`, `certificate_ready`, `service_completed`, `invoice`, `consultation_recommendation`.

Reminder cron: pg_cron daily → enqueues reminders for stuck applications (details_pending >24h, documents_pending >48h).

---

## Phase J — Talk to Expert Conversion
- Ops UI in lead detail: pick recommended service → generates payment link for that service's price (from `services` table) → emails customer.
- On payment of recommended service, original `talk_to_expert` application closed with note + new application linked.

---

## Phase K — Admin UI Premium Overhaul
New layout for `/admin/*`:
- Glassmorphism sidebar + topbar (backdrop-blur, semi-transparent surfaces over gradient bg).
- Framer-motion: page transitions, list item stagger, status badge pulse.
- Realtime: subscribe via Supabase Realtime on `leads`, `applications`, `payments` → live dashboard tiles.
- Activity timeline component (vertical, animated, color-coded by event type).
- Interactive tables: column reorder, saved views, bulk actions toolbar (already partial).
- Command palette (⌘K) — jump to any lead/application by code.
- Dashboard widgets: revenue today/week/month, funnel conversion, pending actions, SLA breaches.
- Modules per spec: Dashboard, Leads, Applications, Payments, Invoices, Documents, Certificates, Services, Employees, Communications (email queue + logs), Activity Logs, Settings.

---

## Phase L — Bug Fixes & Phase 4 Essentials
- Contact form: wire to a server fn that inserts a `contact_messages` row + sends notification email.
- SMTP: existing `smtp_settings` + `email_queue` — verify cron drains queue every minute; add admin "Test Email" button.
- Multi-gateway payments: scaffold gateway adapter pattern (`PayU` exists; add stubs for Razorpay/Cashfree behind `payment_gateways` table priority).

---

## Technical Details

**Stack**: TanStack Start server fns + Supabase. No edge functions. PDF via `@react-pdf/renderer`. Realtime via `supabase.channel`. Reminders via pg_cron → `/api/public/cron/*`.

**Migrations** (one per phase, in order): A1, B (seed via insert), C (seed), D (enum + activity_logs trigger update), E, F (storage policy for PDFs), G, I (template seed). Each `CREATE TABLE` includes GRANTs + RLS per project rules.

**Backwards compat**: Existing `onboarding_submissions`, `applications`, `leads`, `payments` retained. New schemas read from DB with TS fallback so deploy ordering is safe.

**Order of execution** (each step is a separate turn; you confirm migrations as they appear):

1. Phase A migration (engine tables) + schema-engine code + DynamicFormRenderer + replace existing onboarding to use it (fallback schemas keep current flow working).
2. Phase B seed migration (all 7 schemas + workflows).
3. Phase C NIC seed + picker.
4. Phase D workflow engine + status enum extension.
5. Phase E dynamic links + public app.$token route.
6. Phase F PDF generator for forgot-contact.
7. Phase G complaints + reminder cron.
8. Phase H document mgmt upgrades.
9. Phase I email template seed + reminder cron.
10. Phase J talk-to-expert conversion UI.
11. Phase K admin UI overhaul (largest single phase; will need its own sub-plan when reached).
12. Phase L bug-fix sweep.

**Out of scope for this plan** (call out so we don't drift): KYC/Aadhaar API integration (govt portals are manual ops), SMS gateway, mobile app.

---

## Risks
- Admin UI overhaul (Phase K) is huge — recommend splitting into its own plan when we get there.
- PDF generation on Cloudflare Worker: `@react-pdf/renderer` works but heavy; if perf is bad, fall back to `pdf-lib` (lighter).
- NIC dataset licensing: data.gov.in is Open Government Licence — safe to bundle.

Ready to start with Phase A on approval.
