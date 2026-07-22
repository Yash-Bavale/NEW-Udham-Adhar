## Goals

1. Wire the new RBAC (`<Can>` + `scopeIds()`) into pages so unauthorized users don't see actions/rows.
2. Build the Employee Performance dashboard (Part 1 of the earlier 3-part CRM enhancement) — contact tracking, conversion attribution, unique/repeat detection, and reporting UI.

---

## Part A — Wire RBAC into the app

### A1. UI gating with `<Can>` (client-side hide)
Wrap destructive/admin actions in the existing `<Can module="…" action="…">` component across:

- **Leads** (`admin.leads.index.tsx`, `admin.leads.$leadId.tsx`, `LeadWorkspacePanel.tsx`): bulk delete, "Assign to…", edit customer, delete lead.
- **Orders** (`admin.orders.index.tsx`, `admin.orders.$orderId.tsx`, `OrderWorkflowPanel.tsx`): close order, refund, change service, admin override, delete docs.
- **Customers, Applications, Tickets, Invoices, Payments, Services, Websites, Employees, Permissions, Email Templates, SEO, Automations** index + detail pages: hide Create / Edit / Delete buttons per module key.
- **Sidebar** (`AdminShell.tsx`): hide nav entries when the user has zero `view` permission on that module (admins always pass).

Module keys align with rows already in `permission_modules`.

### A2. List scoping with `scopeIds()`
When `scopeAll === false`, pass the resolved website/category/service ID lists into list queries. Two-tier approach:

- **Client filter (fast win)**: in list routes (leads, orders, applications, tickets, services) call `scopeIds(module)` and, when not `all`, filter the returned rows by matching `service_id` / `website_id` / `category_id` before rendering.
- **Server filter (defence-in-depth)**: add an optional `scopeFilter` arg to the corresponding list server functions (`listLeads`, `listOrders`, `listApplications`, `listTickets`, `listServices`). When provided, apply `.in('service_id', ids)` etc. Admins skip the filter.

RLS policies stay unchanged for this pass (as previously agreed) — enforcement is UI + server-fn scoped queries. Add a TODO comment linking the follow-up RLS migration.

### A3. Verification
- Sign in as admin: everything visible (unchanged).
- Sign in as a scoped employee: hidden buttons, filtered lists, sidebar reflects modules.
- Typecheck + smoke click through Leads, Orders, Services.

---

## Part B — Employee Performance Tracking

### B1. Data model (one migration)
Reuse existing tables; only two additions:

- `public.lead_contact_events` — one row per outbound contact attempt.
  - fields: `lead_id`, `user_id`, `channel` (`whatsapp | email | call | note`), `outcome` (`connected | no_answer | wrong_number | not_interested | callback | converted_intent`), `notes`, `created_at`.
  - RLS: staff insert their own; admins read all; employees read own.
  - GRANTs for authenticated + service_role.
- `public.lead_attribution` — one row per lead capturing conversion source.
  - fields: `lead_id UNIQUE`, `first_contact_user_id`, `first_contact_at`, `converted_user_id` (nullable), `converted_at`, `conversion_kind` (`system_paid | employee_handled | organic`), `is_unique_lead` (bool, false when same email/mobile already exists), `repeat_of_lead_id` (nullable).
  - Trigger on `leads INSERT`: set `is_unique_lead` + `repeat_of_lead_id` by matching normalized email/mobile.
  - Trigger on `lead_contact_events INSERT`: populate `first_contact_user_id/at` if null.
  - Trigger on `applications UPDATE` when `fulfillment_status` transitions to a paid/completed state: set `converted_user_id` = current `assigned_to` (or first contact user if system-paid before any contact) and `conversion_kind` accordingly.

### B2. Server functions (`src/lib/crm/performance.functions.ts`)
All `requireSupabaseAuth`, admin-only via `assertRole`:

- `logLeadContact({ leadId, channel, outcome, notes })` — inserts a `lead_contact_events` row; also mirrors an `activity_logs` row for the existing timeline.
- `getPerformanceOverview({ from, to, userId? })` — returns per-employee KPI rows: leads assigned, contacted, avg time-to-first-contact, conversions (employee-handled vs system-paid), conversion rate, repeat vs unique split, revenue attributed (join `payments`/`invoices` on converted leads).
- `getEmployeeDetail({ userId, from, to })` — contact log, funnel counts by service, daily trend.
- `getMyPerformance({ from, to })` — same shape but scoped to `auth.uid()` for self-view.

### B3. UI wiring

- **Log contact (staff surface)**: in `LeadWorkspacePanel.tsx`, replace/augment the existing "Mark as Contacted" quick action with a small dialog that calls `logLeadContact` (channel + outcome dropdowns + optional note). Existing WhatsApp/Email quick actions also call `logLeadContact` automatically on click.
- **Employee self view**: new route `/admin/my-performance` — KPI cards + funnel chart from `getMyPerformance`. Linked from the sidebar under "My Work".
- **Admin performance dashboard**: new route `/admin/performance` — leaderboard table (sortable columns), per-employee drilldown drawer, date-range picker reusing `DateRangePicker`, filters for service/website (respects `scopeIds`). Sidebar entry gated with `<Can module="performance">`; add a `performance` row to `permission_modules` in the same migration.

### B4. Verification

- Insert a lead, log contacts, mark paid — attribution row reflects `employee_handled`.
- Insert a webhook-paid lead with no contact — shows `system_paid`.
- Duplicate email → `is_unique_lead=false`, `repeat_of_lead_id` set.
- Admin sees leaderboard; employee sees only their own metrics.
- Typecheck clean.

---

## Deliverables (files touched)

```text
supabase/migrations/*.sql              # tables, triggers, GRANTs, permission_modules row
src/lib/crm/performance.functions.ts   # new
src/routes/admin.performance.tsx       # admin dashboard
src/routes/admin.my-performance.tsx    # self view
src/components/admin/AdminShell.tsx    # sidebar gating + new links
src/components/admin/LeadWorkspacePanel.tsx  # log-contact dialog
src/routes/admin.leads.index.tsx, admin.orders.index.tsx,
src/routes/admin.applications.tsx, admin.tickets.index.tsx,
src/routes/admin.services.index.tsx, admin.websites.tsx,
src/routes/admin.customers.tsx, admin.invoices.tsx,
src/routes/admin.payments.tsx, admin.employees.tsx,
src/routes/admin.email-templates.tsx, admin.seo.tsx      # <Can> wrapping + scopeIds filtering
src/lib/crm/leads-admin.functions.ts, orders-v2.functions.ts,
src/lib/crm/services-admin.functions.ts, tickets.functions.ts   # optional scopeFilter arg
```

Once approved, I'll ship it in that order: migration first, then server functions, then UI (RBAC wiring and performance screens in parallel).