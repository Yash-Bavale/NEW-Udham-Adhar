
# CRM UI Rebuild — Phased Plan

This plan rebuilds **only the frontend UI** of the existing Udyam Ops admin panel. All existing backend (DB schema, server functions, RLS, auth, leads/payments logic) stays intact. Routes are preserved; pages are re-skinned and missing screens are added. Every page binds to existing server functions — no mocks.

Phases are sequenced so each phase is shippable on its own.

---

## Phase 0 — Design System & Shell (foundation)

Goal: lock visual language and chrome before touching pages.

- Tokens in `src/styles.css` (Tailwind v4 `@theme`):
  - `--color-primary: #1F4E79`, `--color-accent: #2E75B6`, `--color-surface: #EFF6FC`
  - Neutral grays, semantic status colors (success/warn/error/info), no gradients/shadows.
  - Inter via `<link>` in `__root.tsx`; body 14px; headings weight 500 only.
- Shared primitives:
  - `StatusPill` (dot + label, color by status key)
  - `DataTable` (alt-row tint, sticky header, sortable cols, pagination)
  - `FormField` (label-above, helper-below, inline error)
  - `SectionCard`, `KpiCard`, `EmptyState`, `SidePanel` wrapper
- App shell:
  - Fixed 220px left sidebar (grouped per spec, Lucide icons, active highlight, collapsible to icons on small screens; mobile bottom nav)
  - Top bar: global search, notifications bell, user avatar menu
  - 24px main padding
- Replace current `AppSidebar` groupings to match the 6 visual groups in Part 3.

Deliverable: re-themed shell visible on every `/admin/*` route, no functional regressions.

---

## Phase 1 — Main Dashboard (Part 4, 12 sections)

Rebuild `/admin/dashboard` using existing `ops-dashboard.functions.ts` plus new aggregation server fns where missing.

Sections wired to backend:
1. 8 KPI cards with Today/Week/Month toggle (+ expandable reason/service breakdowns)
2. Action Required panel (red border) — docs pending, complaint follow-ups, awaiting reply
3. Service Pipeline stage counts (applications grouped by status)
4. Document Pending cards with "Send Reminder" (uses existing email queue)
5. Complaint Tracker widget (counts + table)
6. Payment Summary pills (today collection, pending, refunds, chargebacks)
7. Revenue bar chart 7-day with weekly/monthly toggle (recharts)
8. Top Selling Services list
9. Staff Performance table
10. Today's Follow-up Calendar list
11. Support Ticket pills
12. Recent Activities feed (live, from `activity_logs`)
- Global search bar in top bar querying orders/mobile/complaint/customer/email/udyam via a new `globalSearch` server fn.

New server fns (read-only aggregations, no schema change):
`getDashboardKpis(range)`, `getActionRequired()`, `getPipelineCounts()`, `getDocumentPending()`, `getComplaintTracker()`, `getPaymentSummary()`, `getRevenueSeries(range)`, `getTopServices()`, `getStaffPerformance()`, `getTodayFollowups()`, `getTicketSummary()`, `getRecentActivities()`, `globalSearch(q)`.

---

## Phase 2 — Leads (Part 5)

Already partially done in earlier turn. Confirm:
- Status pills with live counts (all spec statuses)
- Filter bar (Status, Source, Date Range, Assigned, Service)
- Table cols per spec, row → side panel (not new page)
- Add Lead modal with all spec fields
- Bulk actions: assign, status, export CSV

---

## Phase 3 — Orders / Applications (Part 6)

- List page already rebuilt; verify columns + status pills match Part 6 master list.
- Detail page: ensure all 7 sections present (header, Journey Timeline, payment, customer card, documents checklist with upload slots, Internal Notes Timeline with auto + manual entries, linked complaint).
- Internal Notes: auto entries read-only, manual entry via `addApplicationNote`. Auto entries already produced by DB triggers (`log_application_activity`).

---

## Phase 4 — Customer Profile (Part 7)

Already rebuilt with 6 tabs and Aadhaar masking. Polish only:
- Tab 5 Documents → grid view with type icon, expiry badge, download, version history modal.
- Tab 6 Communication → include WhatsApp logs alongside email_logs (if table exists; else email only with note).

---

## Phase 5 — Document Management (Part 8)

New global page `/admin/documents`:
- Server fn `listAllDocuments(filters)` joining `documents` → leads → customers
- Table per spec, inline preview modal (PDF/image), download via signed URL from `documents` bucket
- Expiry badges (amber <30d, red expired)
- Version history modal: group by (customer_id, document_type)
- Filters: type, customer search, expiry status, date range

---

## Phase 6 — Complaints (Part 9)

- Rebuild list page columns per spec
- Detail page with status stepper, linked order, notes timeline (reuse component), attachments
- Add Complaint modal with searchable customer picker
- Status pills aligned to spec values

---

## Phase 7 — Remaining Modules (Part 10)

Each is a focused page bound to existing tables:
- **Services** → pipeline Kanban per service (drag disabled — read-only counts; click card → order detail)
- **Invoices** → table + PDF download (uses existing `invoices` table + `invoices` bucket)
- **Payments** → UI rebuild only, existing backend; summary + filterable table
- **Support Tickets** → table + detail (uses `complaints` or dedicated tickets table — verify during build)
- **Tasks** → table with overdue/today highlighting + Assign Task modal
- **Employees** → staff list from `profiles` + `user_roles`, role badges, performance summary
- **Email Templates** → list + editor (subject/body, merge tags) bound to `email_templates`
- **WhatsApp Templates** → mirrors email templates (new table if absent — flagged before creation)
- **Reports** → date range + daily KPIs + monthly charts (revenue bar, conversion funnel, employee table)
- **Settings** → Company Info, Status Master, Notification prefs, Gateway status, Workflow Automation (Phase 9)

---

## Phase 8 — Audit Trail & Compliance (Part 11)

- New `/admin/audit` page (Super Admin + Manager only via `has_role`)
- Searchable/filterable table over existing `audit_logs` (who/what/old→new/when)
- Customer profile Overview: add Legal Compliance block (terms/privacy timestamps, IP, gateway timestamp, consent) — read from existing customer fields; if missing columns, flag during build.
- System-wide Aadhaar masking via existing `maskAadhaar` util — sweep remaining surfaces (exports, invoice PDF, document table).

---

## Phase 9 — Cancellation Workflow Automation (Part 12)

- Settings → Workflow Automation page with configurable timers (default 7/7 days) and template selection per step.
- Implementation:
  - DB columns on `applications`: `cancellation_requested_at`, `closure_stage` (enum), `closure_next_at` — added via migration with GRANTs.
  - pg_cron job (daily) calls `/api/public/hooks/run-closure-workflow` which advances orders through Step 1→2→3 and enqueues the 3 emails via existing email queue + templates.
  - New email templates: `cancellation-request-received`, `final-notice-before-closure`, `order-closed-notice`.
  - Status transitions use existing application_status enum values (extend if missing).

---

## Cross-cutting rules

- No backend regressions: every new server fn is additive; no edits to existing leads/payments handlers.
- All reads via `createServerFn` (`requireSupabaseAuth`); no direct client → DB for admin pages except realtime subs (already in place).
- Realtime channels keep `user:<uid>:...` prefix per project memory.
- Aadhaar never rendered in full anywhere.

---

## Technical notes

- Charts: `recharts` (already in deps if present; otherwise `bun add recharts` in Phase 1).
- PDF preview: native `<iframe src=signedUrl>` for PDFs; `<img>` for images. No new heavy deps.
- CSV export: client-side from current filtered result set.
- New tables only if strictly required (Phase 7 WhatsApp templates, Phase 9 closure columns) — each gated by a migration step with GRANTs + RLS per security memory.

---

## Suggested execution order & checkpoints

1. Phase 0 (shell + tokens) — visible reskin, no behavior change.
2. Phase 1 (dashboard) — biggest user value.
3. Phase 2 → 4 verification passes (already largely done).
4. Phase 5, 6 — net-new pages.
5. Phase 7 — remaining modules in parallel sub-batches.
6. Phase 8 — audit + compliance sweep.
7. Phase 9 — cancellation automation (last; touches DB + cron).

I'll pause for approval after each phase so you can review before the next one starts.
