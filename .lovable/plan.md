
# Phase 4 — Sub-Phase Plan

Phase 4 is realistically 5 separate builds. Each ships independently, is verifiable, and unblocks the next. We pause for your approval between sub-phases.

---

## Sub-Phase 4A — Bug Audit + Email Foundation (this build)

**Scope**
1. **Bug Audit Report** — sweep current codebase + DB + workflows. Output a markdown doc at `/mnt/documents/phase4-bug-audit.md` covering:
   - Frontend: broken routes, console errors, mobile breakpoints, dead links, header duplication on SEO pages, FAQ accordion state
   - Backend: server functions failing, auth middleware coverage, RLS gaps, missing GRANTs
   - Database: orphan rows, missing indexes, nullable columns that shouldn't be, status enum drift
   - Workflows: lead → payment → onboarding → completion path; payment webhook idempotency; document upload edge cases
   - Validation: Zod coverage on every public server fn, file-size/MIME enforcement
   - Security: finance amount leakage to non-finance roles (current state)
2. **Fix all P0/P1 bugs found** before any new feature work in 4A.
3. **SMTP Email System (custom)**
   - New tables: `smtp_settings` (singleton, super_admin only), `email_templates`, `email_queue`, `email_logs`
   - Secrets: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (collected via add_secret after approval)
   - Server functions: `sendEmail`, `enqueueEmail`, `processEmailQueue`, `sendTestEmail`
   - pg_cron → `/api/public/cron/process-email-queue` every minute
   - Retry logic (5 attempts, exponential backoff), DLQ status
   - Admin UI under `/admin/emails`: SMTP Settings form, Test Email button, Template Manager (create/edit/duplicate/enable-disable), Email Logs (searchable), Status Dashboard (sent/queued/failed counts)
   - RBAC: super_admin only for SMTP settings; admin can manage templates + view logs

**Why first:** Email is a hard dependency for Contact Us auto-ack, post-payment welcome, complaint reminders, certificate delivery, and dynamic links. Bug audit prevents new features from inheriting broken foundations.

---

## Sub-Phase 4B — Contact Us + Funnel Analytics + Pre-Payment UX

1. **Contact Us wiring** — every contact form submit creates a lead (`lead_source='contact_form'`), activity log, admin notification email, auto-ack email to user. Dashboard widgets: today's contacts, pending, conversion rate.
2. **Funnel analytics** — new `analytics_events` table tracking 11 events (page view → service completed). Dashboard cards: Lead Funnel, Conversion Funnel, Drop-Off Funnel.
3. **Premium loading screen** — 20–30s animated multi-step (Creating Application → Loading Payment Options) shown between Submit click and redirect to Application Summary. Lead + Application created synchronously at click; loader is UX only.
4. **Application Summary Page** — Application ID, customer details, pricing breakdown (super_admin only), enabled gateway picker.
5. **Gateway management** — admin UI to enable/disable/reorder Razorpay, Cashfree, PayU, PhonePe, CC Avenue. Only enabled gateways render. (Only PayU is integrated today; others are placeholders with "coming soon" until you supply credentials.)

---

## Sub-Phase 4C — Service Workflow Engine (7 services)

1. **Dynamic form builder** — extend `onboarding/schemas.ts` into DB-driven (`service_forms`, `form_fields`, `service_documents`) so admin can edit fields per service without code deploy.
2. **Service 1 — New Udyam:** full multi-step form (Aadhaar/PAN/ITR/GSTIN/Enterprise/Address/Bank/NIC/Employment/GeM/TReDS/NCS/NSIC/Skill India). NIC search engine (autocomplete on full NIC master list — sourced from official 2008 NIC dataset, seeded into `nic_codes` table). Auto-save every 5s.
3. **Services 2–4** — Update / Download / Migrate (extend existing schemas, add validation).
4. **Service 5 — Forgot Mobile/Email** — special automation:
   - Dynamic PDF generator (using `@react-pdf/renderer` server-side) — fills complaint PDF from customer data
   - Download → user signs → re-upload signed PDF → stored in `documents`
   - Ops enters Complaint Number → triggers timeline event, complaint email, 10-day reminder via pg_cron + `complaint_reminders` table
5. **Service 6 — PAN/Aadhaar Correction** — form + doc upload.
6. **Service 7 — Talk to Expert** — expert notes, recommended service picker, "Convert to Lead" button that creates a new paid lead, sends recommendation email with secure payment link.
7. **Dynamic Link Engine** — signed tokens (`magic_links` table, HMAC + 7-day expiry) that auto-identify customer, update existing lead, no login. Used in every email CTA.

---

## Sub-Phase 4D — Document Workflow + Communication + Certificates

1. **Document Mgmt enhancements** — preview (signed URL viewer), version history (`document_versions`), approve/reject with remarks, document comments table, document timeline events.
2. **CRM Synchronization** — central trigger function: any customer action (upload/submit/sign/update) → updates lead, application, timeline, notifies `assigned_to` via in-app + email. De-dup guard on lead creation.
3. **Communication Center** (inside Lead detail):
   - WhatsApp deeplink (`wa.me/91<mobile>?text=...`)
   - Call button (`tel:`)
   - Email composer (uses templates)
   - Copy contact, Quick Reminder, Request Documents, Request Information, Resend Invoice, Resend Certificate
   - Communication history feed
4. **Certificate Management** — `certificates` table with version control, upload, email delivery with tracking, history. Completion workflow auto-moves application status.

---

## Sub-Phase 4E — Finance RBAC + Advanced Dashboard

1. **Finance RBAC lockdown** (confirmed: hide all amounts from non-finance):
   - Audit every server fn returning amounts; gate by `is_finance_viewer(auth.uid())`
   - Strip amount columns from leads/applications lists for non-finance
   - Replace amount cards with status-only badges (Success / Pending / Failed)
   - Hide invoices, payments, revenue pages from non-finance nav
   - Block CSV exports for non-finance
2. **Advanced Dashboard** — role-aware:
   - Super admin: Revenue Funnel, Payment Analytics, Service Analytics, GST, Profit
   - Ops: Application Status Board, Doc Verification Queue, Today's Queue, SLA Monitoring, Operator Productivity
   - All: Recent Activities, Live System Feed, Pending Actions, Drop-Off Analytics
3. **Final regression sweep** + production-readiness checklist.

---

## Technical Notes

- **Email:** custom SMTP via `nodemailer` in TanStack server function. SMTP creds stored as runtime secrets, not in DB. `smtp_settings` table stores only non-secret config (from address, reply-to, daily quota).
- **PDF:** `@react-pdf/renderer` (Worker-compatible) for complaint PDF generation; output to `documents` bucket.
- **Cron:** pg_cron + pg_net calling `/api/public/cron/*` endpoints authed via Supabase anon key (per platform pattern).
- **Magic links:** HMAC-SHA256 signed tokens, server-fn `resolveMagicLink` validates + rate-limits.
- **NIC dataset:** seeded once via migration (~700 rows, NIC 2008).
- **No schema breaking changes** — all new tables are additive; existing tables get nullable columns only.

---

## Deliverable for this turn (4A)

1. `/mnt/documents/phase4-bug-audit.md` (the audit report)
2. P0/P1 bug fixes
3. Email system (DB + server fns + admin UI + cron)
4. SMTP secrets request (after migration approval)

Approve and I'll start with the bug audit, then the email migration.
