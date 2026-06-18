
# Audit + Gap-Close Plan (Parts 1–12)

## What's already in the repo

A repo scan shows the bulk of Parts 1–12 is built. I will NOT rebuild these — only fix defects found during verification.

| Part | Surface | Built? |
|---|---|---|
| 2 Design system | `src/styles.css` with `--admin-primary #1F4E79`, `--admin-accent #2E75B6`, `--admin-surface-2 #EFF6FC`; Inter via `<link>`; pill + table + form primitives in `components/admin/ui.tsx` | Yes |
| 3 Sidebar | `AdminShell.tsx` — fixed 220px, 6 visual groups, all 16 items + Logout, Lucide icons, active state, mobile bottom nav | Yes |
| 4 Dashboard 12 sections | `admin.dashboard.tsx` (634 lines): KPI cards, Action Required, Service Pipeline, Document Pending, Complaint Tracker, Payment Summary, Revenue chart, Top Services, Staff Performance, Follow-ups, Tickets, Recent Activity + global search top bar | Yes (gaps in §10/§11 noted in code) |
| 5 Leads | `admin.leads.tsx` + `admin.leads.$leadId.tsx` + pills/filters/side panel/bulk bar | Yes |
| 6 Orders + Journey + Notes | `admin.applications.$applicationId.tsx` + `JourneyTimeline.tsx` | Yes |
| 7 Customer Profile (6 tabs, Aadhaar mask) | `admin.customers.$customerId.tsx` + `mask.ts` | Yes |
| 8 Document Management | `admin.documents.tsx` + `documents-admin.functions.ts` | Yes |
| 9 Complaints (list + detail stepper) | `admin.complaints.tsx` + `admin.complaints.$complaintId.tsx` | Yes |
| 10 Services/Invoices/Payments/Tickets/Tasks/Employees/Email/WhatsApp/Reports/Settings | All routes present (`admin.services.tsx`, `admin.finance.gst.tsx`, `admin.finance.tsx`, `admin.tickets.tsx`, `admin.tasks.tsx`, `admin.employees.tsx`, `admin.emails.tsx`, `admin.whatsapp-templates.tsx`, `admin.reports.tsx`, `admin.settings.tsx`) | Yes |
| 11 Audit + Legal Compliance + Aadhaar sweep | `admin.audit.tsx` + `audit.functions.ts`; mask util applied | Partial — legal compliance block in customer profile to verify |
| 12 Cancellation workflow (3-step, 7+7d, configurable) | `applications.closure_stage` columns, `workflow_settings` row, 3 email templates seeded, `CancellationPanel`, cron route `/api/public/cron/closure-workflow`, `pg_cron` `closure-workflow-hourly` scheduled | Yes |

Saying "nothing is completed" doesn't match the file tree. Before any code change, I will produce evidence — screenshots + console + network — for every screen, then fix only what's actually broken.

## Phase A — Live verification (read-only)

Drive Playwright against `http://localhost:8080` with the signed-in session and walk every Part:

1. `/admin/dashboard` — capture all 12 sections; confirm each pulls live data (no zeros from missing wiring); confirm global search returns results for order #, mobile, complaint #, customer, email, Udyam.
2. Sidebar — confirm 6 groups, 16 items + Logout, active highlight, mobile bottom nav at 390px viewport.
3. Each module page in order: Leads, Customers, Customer detail (6 tabs + Aadhaar mask), Orders, Order detail (Journey + Notes + CancellationPanel), Documents, Complaints + detail stepper, Services, Invoices, Payments, Tickets, Tasks, Employees, Email Templates, WhatsApp Templates, Reports, Settings (incl. Workflow Automation), Audit.
4. Cancellation workflow — record a request on a test order, verify Step 1 email enqueued and `closure_next_at` set; simulate cron via direct POST to confirm advance logic.

Output of Phase A: a numbered defect list with screenshot + page + exact failure (e.g. "Dashboard §10 Follow-ups: shows placeholder text instead of today's items", "Settings → Workflow Automation: save button no-op", etc.).

## Phase B — Gap closure (only against the Phase A list)

Each defect becomes one focused commit. No file is rewritten if its current behavior already matches the spec. Likely fix candidates already visible in code:
- Dashboard §10 Follow-ups currently shows a placeholder ("lands with the Tasks module") — wire to existing tasks/notifications data.
- Dashboard §11 Support Tickets currently shows "module ships next" copy — wire to existing complaints/ticket counts.
- Confirm KPI cards expose Today/Weekly/Monthly toggle and reason-wise/service-wise expand drawers per spec (Part 4 §1).
- Confirm KPI #4 Pending Orders, #5/#6 Complaints, #7/#8 Orders/Sale expand to breakdowns.
- Legal Compliance block on Customer Overview tab — add if missing.
- Aadhaar sweep — grep for any unmasked render path and route through `maskAadhaar`.

Migrations only if a defect strictly requires schema change; each migration will include GRANTs + RLS per project rules and will be flagged before running.

## Phase C — Final pass

- Re-run Phase A walk to confirm every defect is closed.
- `bun run lint` / typecheck via the build harness — no new errors.
- Summarize: per-Part status table with a screenshot reference.

## Cross-cutting guarantees (unchanged)

- No backend regressions for leads or payments — additive server fns only.
- All admin reads via `createServerFn` + `requireSupabaseAuth`.
- Aadhaar never rendered in full.
- Realtime channels keep `user:<uid>:…` prefix.

## What I will deliver per phase

- Phase A: defect list + screenshots, no code changes.
- Phase B: one commit per defect, each verified with a follow-up screenshot.
- Phase C: final status table.

Approve to start Phase A.
