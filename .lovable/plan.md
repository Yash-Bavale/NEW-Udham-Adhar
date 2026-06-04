
# Phase 5 — Enterprise CRM Operating System V2

This is a large rebuild (admin shell + 6 new modules + a major schema move to Customer 360). To stay shippable I'm landing it as **6 sequential turns**, each one self-contained and verifiable. Nothing here is cosmetic — every turn delivers working data + UI.

## Key architectural decisions (calling these out so you can veto before I start)

1. **Customer 360 = new `customers` table.** Today every paid service creates a new `leads` row, so the same person shows up many times. I'll introduce `public.customers` keyed by normalised mobile + lowercased email, and add `customer_id` on `leads`, `applications`, `payments`, `invoices`, `certificates`, `complaints`. Existing rows get backfilled in the same migration (group by mobile, fall back to email). `leads` stays — it becomes "this person's intent for one service" under a customer.
2. **Form builder = JSON-Schema driven, table already exists.** `service_form_schemas` is already in the DB. I'll build the admin UI on top of it and migrate the 7 hardcoded services into rows. Customer-facing onboarding will render from the schema, not from hand-coded forms.
3. **Permissions = capability flags layered on existing roles.** I'm not throwing out `app_role`. I'm adding `role_permissions(role, permission)` plus a `permissions` enum so super-admin can toggle granular caps per role without changing the role enum itself. Custom roles map to the existing `app_role` set + capability overrides.
4. **Data retention = soft-redact, not hard-delete.** "Delete sensitive documents on completed" will null the file in Storage + flip `documents.status = 'redacted'` while keeping the row + audit trail. Hard delete would break GST / audit.
5. **Realtime / glass UI / command palette** layered in once on the new admin shell (Turn 1), so every later module inherits them.

## Out of scope for Phase 5 (still deferred to Phase 6+)

WhatsApp / SMS sending, customer self-service portal login, mobile app, Razorpay/Cashfree activation (gateway picker is built, second gateway just isn't enabled), in-app voice calling. The "Call / WhatsApp / Email" buttons in Communication Center will be `tel:` / `wa.me/` / `mailto:` deep-links + email queue — no provider integration yet.

---

## Turn 1 — Admin Shell V2 + Customer 360 schema

**Migration**
- `public.customers (id, customer_code 'CU-YYYY-######', name, primary_email, primary_mobile, state, language, lifetime_value, total_applications, completed_applications, first_seen_at, last_seen_at, last_service_id, status)` + GRANTs + RLS (staff read/write).
- Add nullable `customer_id` FK to `leads`, `applications`, `payments`, `invoices`, `certificates`, `complaints`.
- Backfill: collapse existing `leads` by `(coalesce(mobile), lower(email))` into one `customers` row, set FKs.
- `find_or_create_customer(p_email, p_mobile, p_name, p_state, p_language) returns uuid` SECURITY DEFINER — used by every public form (contact, talk-to-expert, payment success, onboarding) from this turn on.
- Add `customers` to `supabase_realtime` publication.

**Admin shell V2 (`src/components/admin/AdminShell.tsx` rewrite)**
- New left sidebar order: **Dashboard · Customers · Leads · Applications · Tasks · Communications · Finance · Services · Employees · Settings**.
- Header: global command palette (`⌘K`), global search across customers / applications / invoices / certificates / complaints / lead codes, theme toggle (light/dark/system), notification bell, profile menu.
- Glassmorphism tokens added to `src/styles.css`: `--glass-bg`, `--glass-border`, `--glass-blur`. Dark-mode palette finalised.
- Framer Motion page transitions, Sonner toaster, keyboard shortcuts (`g d` dashboard, `g c` customers, `n a` new application, `?` shortcut sheet).
- Realtime hook `useRealtimeTable(table, filter)` — wraps `postgres_changes` once for the whole admin.

**Verification:** existing admin routes still render inside the new shell; `customers` table populated with one row per unique person; command palette navigates between routes.

---

## Turn 2 — Customer 360 + Repositories

**New routes**
- `/admin/customers` — table with LTV, total apps, completed/pending, last service, SLA badge, last activity. Realtime. Filter chips. Saved views.
- `/admin/customers/$customerId` — single-screen workspace, tabs as **panels** not nav (everything visible on scroll):
  - Summary card (since, totals, current active service, primary contacts, copy buttons).
  - **Applications** list (every app this customer ever had, status pills, jump links).
  - **Certificates** repository — name, service, issue date, app number, download.
  - **Invoices** repository — number, date, service, PDF download, "Email again" action.
  - **Payments** ledger.
  - **Communications** — email log + outbound buttons (Call / WhatsApp / Email / Reminder / Request Docs / Request Info).
  - **Timeline** — every event from `activity_logs` + `application_status_history` + `email_logs` + `payments` interleaved.
  - **Notes** — internal notes per customer (new `customer_notes` table).
  - **Activity logs** raw view.
- Server fns: `getCustomer360(customerId)` (one query, returns all panels), `listCustomers(filters)`, `getRepeatPurchaseMetrics()`.

**Verification:** open one customer, see every application + invoice + certificate they ever had. Search "9767870331" lands directly on the right customer.

---

## Turn 3 — Service Management Center + Form Builder + Workflow Builder

**Migration**
- Extend `services` with: `gateway_overrides jsonb`, `completion_rules jsonb`, `emails_config jsonb`, `is_archived boolean`.
- `service_workflows` already exists — add `transitions jsonb` (from → [to]).
- Seed the 7 existing services into `service_form_schemas` (New Udyam, Update Udyam, Download Udyam, Migrate Udyog Aadhaar, Forgot Mobile/Email, PAN/Aadhaar Correction, Talk To Expert) with sections + fields + required docs matching today's hardcoded forms.

**New admin routes**
- `/admin/services` (rewrite) — list with enable/archive toggles, pricing/GST inline edit, gateway picker, "Edit form", "Edit workflow", "Edit emails".
- `/admin/services/$serviceId/form` — drag-and-drop form builder. Supports: sections, fields (text/email/mobile/number/date/select/radio/checkbox/textarea/file-upload/NIC-picker), required, validation rules (regex, min, max), help text, placeholder, conditional show/hide, multi-step.
- `/admin/services/$serviceId/workflow` — node editor for status flow (drag from one status to another), default assignee role per stage, SLA per stage, auto-email per stage.
- `/admin/services/$serviceId/emails` — pick which template fires on which stage transition.

**Customer-facing**
- `src/routes/onboarding.$leadCode.index.tsx` rewritten to render from `service_form_schemas` for that service. No more per-service hardcoded form files.

**Verification:** super-admin edits the New Udyam form (adds a field), customer onboarding picks it up live, submitted value lands on the application detail page.

---

## Turn 4 — Application Review Workspace + Task Engine

**Migration**
- `public.tasks (id, application_id, customer_id, assigned_to, title, description, priority, status, due_at, completed_at, time_spent_seconds, created_by)` + RLS + realtime.
- Auto-generation rule: on each application status transition, generate the tasks defined in that service's workflow stage.

**Admin routes**
- `/admin/applications/$applicationId` (rewrite) — single-screen workspace, no tab switching:
  - Top strip: customer chip, application code, service, status badge, SLA timer, assignee, primary action button (context-aware: "Approve form" / "Verify docs" / "Upload certificate" / "Mark complete").
  - Left column (sticky): customer summary card, payment + invoice card, certificate card.
  - Middle column: submitted form data (rendered from schema, missing-field badges, validation warnings, completion %), uploaded documents (version stack per slot, approve/reject/re-request inline), required actions.
  - Right column: tasks for this application, timeline, notes, communication history.
- `/admin/tasks` — global task inbox grouped by assignee (kanban) with priority + due-date filters.

**Form submission review**
- Completion percentage, missing-fields list, missing-docs list, validation errors all surfaced at the top of the workspace.
- Quick actions: Approve · Reject · Request Information · Request Documents · Assign · Reassign — each writes to timeline and fires the configured email.

**Verification:** open any in-progress application, see everything in one screen, approve a document, the timeline + customer 360 + email log all reflect it within 2 seconds (realtime).

---

## Turn 5 — Finance Center + Invoice Builder + Employee/Permission system

**Migration**
- `public.invoice_settings` (singleton: company_info, gstin, prefix, terms, footer, bank_details, authorized_signatory, notes_default, tax_rules jsonb).
- `public.permissions` enum (`view_customers`, `edit_customers`, `delete_customers`, `view_applications`, `edit_applications`, `view_finance`, `view_revenue`, `view_invoices`, `manage_users`, `manage_services`, `manage_settings`, `view_audit`).
- `public.role_permissions (role app_role, permission)` with seed defaults per role, plus override table `user_permissions (user_id, permission, granted boolean)` for individual exceptions.
- `has_permission(uid, permission)` SECURITY DEFINER helper for RLS / UI gates.
- Add `customer_id` + `place_of_supply` already exist on invoices — extend with `cgst_rate`, `sgst_rate`, `igst_rate`, `is_gst_exempt`.

**Admin routes**
- `/admin/finance` (super-admin only) — revenue chart, profit estimate, GST collected, settlements, top services, repeat-customer analytics. Recharts + motion.
- `/admin/finance/invoices` — invoice list, regenerate, resend, void.
- `/admin/finance/invoice-builder` — Zoho-style editor for `invoice_settings` (header, GSTIN, terms, bank, signature, notes, prefix, tax rules). Live preview pane renders the PDF template with the current overrides.
- `/admin/finance/reports` — GST report (CGST/SGST/IGST split), transaction report, collection report, service revenue.
- `/admin/employees` (rewrite of admin.users) — create / edit / suspend / reset password / assign role / assign team / per-user permission overrides. Activity log per employee.
- `/admin/settings/roles` — capability matrix (rows = roles, columns = permissions, checkboxes). Custom roles appear here too.

**Accounts role gating**
- Accounts users see `/admin/finance/invoices` + ability to generate/resend invoices + verify payments, but `view_revenue` and `view_finance_dashboard` are off → finance dashboard hidden.

**Verification:** super-admin edits invoice header → next generated invoice PDF shows new header. Accounts user logs in → no revenue widget visible. Super-admin grants a support agent `view_finance` → dashboard appears.

---

## Turn 6 — Dashboards, Analytics, Communication Center, Data Retention, Payment Gateway logos

**Role-specific dashboards** at `/admin/dashboard` (auto-routes based on highest role):
- **CEO / super-admin**: revenue, new vs returning customers, LTV, service mix, funnel, SLA breach rate.
- **Operations**: pending tasks, in-process applications, doc verification queue, SLA timers, today's certificates to upload.
- **Accounts**: invoices to send, payments to verify, today's collections, refunds pending.
- **Support**: open complaints, SLA timers, awaiting customer reply, recent escalations.
- **Manager**: team productivity, average handle time, completion rate per agent, workload distribution.

**Analytics center** `/admin/analytics` — lead conversion, payment conversion, application completion, employee productivity, repeat customers, service performance, doc completion rate, average processing time. Date-range picker, export to CSV.

**Communication center** `/admin/communications` — unified inbox of email_logs with filters by customer / application / template / status. Outbound composer using existing templates. Bulk reminder runs.

**Data retention** — on application transition to `completed`, a "Redact sensitive documents" action appears in the workspace. Click → confirms → deletes files from `documents` Storage bucket, flips `documents.status = 'redacted'`, retains row + audit. Cron job `retention-auto-redact` (90d after completion) does the same automatically; setting in `/admin/settings`.

**Payment-gateway branding (your explicit ask)**
- Add official PayU logo (`src/assets/payu-logo.svg`), Razorpay logo, Cashfree logo to project assets.
- `/apply/$leadCode/summary` payment-method card now shows the gateway's real logo + "Powered by PayU" trust strip with `Secured by PayU · 256-bit SSL · PCI-DSS compliant` row.
- Payment-status pages (`/payment.$leadCode`, `/payment-failed.$leadCode`, `/payment-pending.$leadCode`, `/success.$leadCode`) get the same logo strip + Visa / Mastercard / RuPay / UPI / Net Banking method icons row underneath.

**Verification:** every dashboard role test, gateway logos visible on all 5 payment pages, redaction button on a completed app actually clears the file from Storage but keeps the audit row.

---

## Technical guardrails per turn

- Each turn ships its own migration; I run the linter after and fix any RLS/grant warnings before moving on.
- Realtime tables: `customers`, `applications`, `tasks`, `documents`, `email_queue`.
- All new server fns go through `requireSupabaseAuth` + `has_permission()` gate, never `supabaseAdmin` from a component path.
- UI tokens stay in `src/styles.css`; no hex literals in components.
- No new edge functions — TanStack server fns + `/api/public/*` routes only.

## Stop / change-my-mind checkpoints

Tell me now if any of these should change before Turn 1:
- Customer 360 collapse rule (mobile-first vs email-first).
- Form builder rendering on the customer side (replace hardcoded onboarding forms vs keep both and migrate per-service).
- Hard-delete sensitive docs vs soft-redact (compliance impact — I default to redact).
- Whether you want me to also bring in Razorpay / Cashfree this phase, or leave those gateway slots dark until you actually have keys.

If you're good with the above, I'll start Turn 1 (shell + Customer 360 migration) on approval.
