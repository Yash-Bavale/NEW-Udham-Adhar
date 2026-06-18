
# CRM UI Rebuild — Coverage Check & Remaining Execution Plan

## Coverage vs. uploaded spec (Parts 1–12)

The uploaded `CRM_Internal_Requirements.docx` maps 1:1 to the 12 parts in your message. Every module is already in `.lovable/plan.md`. Status:

| Part | Module | Status |
|---|---|---|
| 1 | Context & constraints (no backend regressions) | Enforced — all new server fns additive |
| 2 | Design system (#1F4E79 / #2E75B6 / #EFF6FC, Inter, pills, tables, forms) | **Phase 0 — not yet built** |
| 3 | Sidebar (6 visual groups, 17 items) | **Phase 0 — not yet built** |
| 4 | Main Dashboard (12 sections + global search) | **Phase 1 — not yet built** |
| 5 | Leads (pills, filters, side panel, Add Lead) | Done (earlier turn) |
| 6 | Orders + Journey Timeline + Internal Notes | Done |
| 7 | Customer Profile (6 tabs, Aadhaar masking) | Done |
| 8 | Document Management (global) | Done (Phase 5) |
| 9 | Complaints (list + add + stepper) | Done list/add (Phase 6); **detail page stepper pending** |
| 10 | Services / Invoices / Payments / Tickets / Tasks / Employees / Email & WhatsApp Templates / Reports / Settings | **Phase 7 — not yet built** |
| 11 | Audit Trail page + Legal Compliance block + system-wide Aadhaar sweep | **Phase 8 — not yet built** |
| 12 | Cancellation Workflow (3 steps, 7+7 days, configurable in Settings) | **Phase 9 — not yet built** |

Coverage is complete — no gaps vs. the document. Remaining work = Phases 0, 1, 7, 8, 9 + complaint detail page.

---

## Execution order (remaining phases)

I will pause for approval after each phase before starting the next.

### Phase 0 — Design System & Shell (Part 2 + 3)
- Add tokens to `src/styles.css` (`--color-primary #1F4E79`, `--color-accent #2E75B6`, `--color-surface #EFF6FC`, semantic status colors, no gradients/shadows).
- Load Inter via `<link>` in `__root.tsx`. Body 14px; headings weight 500.
- Build shared primitives in `src/components/admin/ui/`: `StatusPill`, `DataTable`, `FormField`, `SectionCard`, `KpiCard`, `EmptyState`, `SidePanel`.
- Rebuild `AdminShell` sidebar: fixed 220px, 6 visual groups per spec, Lucide icons, active highlight, mobile bottom nav, top bar (global search + bell + avatar), 24px main padding.

### Phase 1 — Main Dashboard (Part 4)
- New aggregation server fns (read-only, additive) in `src/lib/crm/dashboard-v2.functions.ts`: `getDashboardKpis(range)`, `getActionRequired`, `getPipelineCounts`, `getDocumentPending`, `getComplaintTracker`, `getPaymentSummary`, `getRevenueSeries(range)`, `getTopServices`, `getStaffPerformance`, `getTodayFollowups`, `getTicketSummary`, `getRecentActivities`.
- Global search server fn already exists (`global-search.functions.ts`) — wire to top bar.
- Build 12 sections per spec on `/admin/dashboard` using `recharts` (already used elsewhere; install if missing).
- Send Reminder button → existing email queue using `document-pending-reminder` template.

### Phase 7 — Remaining modules (Part 10)
Sub-batches, each shippable:
- **7a Services** — Kanban-style per-service pipeline board (read-only counts; cards link to order detail).
- **7b Invoices** — table + filters + PDF download (existing `invoices` bucket).
- **7c Payments** — UI rebuild only (existing backend), summary pills + filterable table.
- **7d Support Tickets** — table + detail (verify schema; use `complaints` if no dedicated table, with `category='ticket'` filter, else flag).
- **7e Tasks** — table with overdue/today highlights + Assign Task modal (flag if no `tasks` table; propose additive migration).
- **7f Employees** — staff list from `profiles`+`user_roles` with role badges and per-staff performance summary.
- **7g Email Templates** — list + editor (subject/body + merge tags) bound to `email_templates`.
- **7h WhatsApp Templates** — same shape; new table only if absent (flag before migration).
- **7i Reports** — date range, daily KPI cards, monthly service-wise revenue bar, lead conversion funnel, employee performance table.
- **7j Settings** — Company Info, Status Master, Notifications, Gateway status. Workflow Automation tab implemented in Phase 9.
- **Complaints detail page** — status stepper, linked order, notes timeline, attachments (completes Part 9).

### Phase 8 — Audit Trail & Compliance (Part 11)
- `/admin/audit` page (Super Admin + Manager via `has_role`) over existing `audit_logs` (search, filter by entity_type / actor / date).
- Legal Compliance block on Customer Overview tab (terms/privacy timestamps, IP, gateway timestamp, consent). If `customers` lacks these columns → flag additive migration.
- System-wide Aadhaar masking sweep (exports, invoice PDF, document table) via existing `maskAadhaar` util.

### Phase 9 — Cancellation Workflow Automation (Part 12)
- Migration (with GRANTs): add `applications.cancellation_requested_at`, `closure_stage` enum, `closure_next_at`.
- 3 new email templates seeded: `cancellation-request-received`, `final-notice-before-closure`, `order-closed-notice`.
- Server route `/api/public/hooks/run-closure-workflow` advances Step 1→2→3 (7+7 days configurable) and enqueues emails via existing queue.
- `pg_cron` daily job hitting the route with `apikey` header.
- Settings → Workflow Automation page: timer config (default 7/7) and per-step template selection; bound to a new `workflow_settings` row (or `settings` JSON) — flagged before migration.

---

## Cross-cutting guarantees

- **No backend regressions** for leads/payments — only additive server fns.
- All admin reads via `createServerFn` + `requireSupabaseAuth`.
- Realtime channels keep `user:<uid>:...` prefix.
- Aadhaar never rendered in full (existing `maskAadhaar` util).
- Migrations only when strictly required (Phase 9; possibly Phase 7e tasks, 7h WhatsApp templates, Phase 8 compliance columns) — each flagged for your approval before running, with GRANTs + RLS + `service_role` per project security rules.

---

## What I'll start on approval

**Phase 0 — Design System & Shell.** Visual reskin only, no behavior changes; safe checkpoint to review before the dashboard build.
