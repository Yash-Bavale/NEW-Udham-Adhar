## Phase 4C — Turn 2: Admin productivity

Single turn, ship all four pieces on the admin **Leads** screen and lead-detail drawer/page.

### 1) CSV export

- Toolbar button **Export CSV** next to filters.
- Respects current filter set (search, status, service, assigned, date range) and current sort, ignores pagination — exports everything matching.
- Server fn `exportLeadsCsv` (auth-only, ops+ roles) streams CSV from `leads` joined with `services` + `profiles` (assignee).
- Columns: `lead_code, created_at, name, email, mobile, state, language, service, status, base_amount, gst_amount, total_amount, assigned_to_name, lead_source, last_activity_at`.
- Logs an `audit_logs` row: action `leads.export_csv`, with filter snapshot + row count.
- Downloads as `leads_YYYY-MM-DD_HHmm.csv`.

### 2) Bulk actions

- Row checkboxes + header "select all on page" + "select all matching filter" (banner appears once page-select is used).
- Bulk action bar shows: **Change status**, **Assign to**, **Send email**, **Delete**.
- Confirmation modal for every action; delete requires typing `DELETE` to confirm.
- Server fns (all auth + role-gated, all batch-safe with chunking of 200):
  - `bulkUpdateLeadStatus({ ids, status })` — ops+; writes `activity_logs` rows.
  - `bulkAssignLeads({ ids, assignee })` — ops+; assignee must be active staff.
  - `bulkDeleteLeads({ ids })` — admin/super_admin only; cascades nothing destructive — also deletes related `applications`, `onboarding_submissions`, `documents` rows; storage cleanup for `documents` bucket; `payments` and `invoices` are **preserved** (financial record) and just orphaned from the lead by nulling `lead_id` would break NOT NULL → instead block delete if a paid payment exists and surface the count in the modal.
  - `bulkEmailLeads({ ids, templateCode, variablesOverride? })` — ops+; enqueues via existing `enqueueFromTemplateInternal` per lead; template picker filters `email_templates` where `is_enabled = true`; uses lead `email` + `name` + `lead_code` as default vars; respects `suppressed_emails`.
- Toast summary: `X succeeded, Y skipped (suppressed), Z failed`.

### 3) Saved filters

- New table `saved_lead_filters` (per-user): `id, user_id, name, filter_json, is_default, created_at, updated_at`. RLS: a user reads / writes their own rows; admins read all.
- Filter bar gets a **Saved views** dropdown: list, apply, set default, rename, delete; "Save current as…" captures current query state.
- On admin leads page load, if user has a default saved filter, apply it (overridable by URL search params).

### 4) Lead detail timeline

- New route `/admin/leads/$leadId` (or expand existing drawer if one exists; verify in `AdminShell` / `AdminLeadsPanel`). Plan defaults to a full page route with a back-to-list link.
- Sections:
  - Header: lead code, name, mobile/email (click-to-copy), service, total amount (finance-gated), current status pill, assignee.
  - Quick actions: change status, reassign, add note, send template email, mark do-not-contact.
  - **Timeline** (vertical, newest first): merged feed of `activity_logs` (status/assignment/created), `lead_notes`, `email_logs` (sent/failed with subject), `payments` (created/paid/failed), `onboarding_submissions` (draft/submitted), `documents` (uploaded/verified/rejected), `analytics_events` filtered to that lead. Each item has icon, actor (when known), timestamp (relative + absolute on hover), one-line summary, expandable detail.
  - Right sidebar: payments list (amount masked unless finance), invoices list with download link, documents list with preview link.
- Server fn `getLeadTimeline({ leadId })` fans out the 7 queries in parallel and returns a single sorted feed (cap 500 items, with "Load older" for pagination).

### Cross-cutting

- All new tables get explicit `GRANT`s + RLS per project rules.
- All new mutating server fns: input validated with Zod, role-checked via `has_role` / `current_user_is_admin`, write an `audit_logs` entry.
- No new client libraries — reuse existing shadcn (DataTable, Dialog, DropdownMenu, Command for template/assignee pickers), `motion/react` for timeline reveal.
- Mobile: bulk-action bar collapses to a sticky bottom sheet; timeline switches to single column; export and saved-views move into the overflow `…` menu.

### Out of scope (deferred to Turn 3 — Finance)

- Invoice PDF generation, GST report, settlement reconciliation.
- Any finance-only views on the lead detail page beyond surfacing existing `invoices` / `payments` rows.

### Technical notes

- **DB additions** (one migration):
  - `saved_lead_filters` table + RLS + GRANTs.
  - No schema changes to `leads` / `applications` / `payments`.
- **Files added** (approx):
  - `src/lib/crm/leads-bulk.functions.ts` — bulk + export server fns.
  - `src/lib/crm/saved-filters.functions.ts` — CRUD.
  - `src/lib/crm/lead-timeline.functions.ts` — `getLeadTimeline`.
  - `src/routes/admin.leads.$leadId.tsx` — detail page.
  - `src/components/admin/LeadsBulkBar.tsx`, `SavedFiltersMenu.tsx`, `LeadTimeline.tsx`, `BulkEmailDialog.tsx`.
- **Files modified**:
  - `src/components/admin/AdminLeadsPanel.tsx` (or current leads table) — checkboxes, bulk bar, export button, saved-filter dropdown, row click → detail page.
  - `src/lib/crm/leads-admin.functions.ts` — extend list query to accept the saved-filter JSON shape if it differs.

### After this turn

- Turn 3 (Finance: invoice PDFs, GST report, settlement reconciliation) is the only remaining 4C work. Then 4D scope discussion.
