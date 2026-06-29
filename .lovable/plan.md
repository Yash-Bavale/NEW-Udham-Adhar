## Goal
1. Auto-assign **orders** (applications) to employees using the existing round-robin assignment pool (today only leads are auto-assigned).
2. Add a visible **dark day-separator row** between dates in the Leads and Orders lists so a day's activity is easy to scan.

Nothing else changes — same UI, same columns, same filters.

---

## Part 1 — Auto-assign orders

### How it works today
- `assignment_pool` + `lead_assignment_config` + `auto_assign_lead()` trigger already round-robin **leads** by service.
- `applications.assigned_to` exists but is only set manually (or inherited from the lead). New orders created when a lead converts/pays often stay unassigned, or the assignee doesn't match the active pool rotation.

### Change (DB migration)
Add a sibling trigger function `auto_assign_application()` that mirrors the lead logic and fires `BEFORE INSERT` on `public.applications`:

- Skip if `NEW.assigned_to IS NOT NULL`.
- Honour the same global switch (`lead_assignment_config.is_active` where `service_id IS NULL`) — one toggle controls both leads and orders, which matches the existing Lead Assignment UI.
- Pick the next pool member using the same ordering used for leads (service-specific first, then global; `last_assigned_at NULLS FIRST`, then `total_assigned`).
- If the parent lead is already assigned to an active pool member for that service, inherit that assignee (so lead-owner stays on the order) **without** advancing the rotation. Otherwise pick the next pool member and bump `last_assigned_at` / `total_assigned`.
- Stamp `assigned_at = now()` and `auto_assigned = true` (add the `auto_assigned boolean default false` column to `applications` if missing) so the existing application-event logger records it.

Also add a small audit log row to `application_events` (`event_type = 'assignment_change'`) when the trigger assigns — matches the lead pattern in `log_lead_auto_assignment()`.

No code changes are required in the React app — the existing Orders list already shows `assigned_name`, and the Lead Assignment UI (`LeadAssignmentTab.tsx`) already controls the pool.

### Acceptance
- Toggle "Round-Robin Auto-Assignment" ON → new paid orders show an assignee immediately in `/admin/orders`.
- Toggle OFF → new orders stay Unassigned.
- An order whose parent lead is already owned by an active pool member keeps that owner.
- Pool stats (`last_assigned_at`, `total_assigned`) advance only when the trigger actually picks a new owner.

---

## Part 2 — Day separator rows in lists

Add a thin full-width separator `<tr>` rendered whenever the IST calendar date of the current row differs from the previous row's IST date. The list is already sorted newest-first, so the separator naturally appears at each new day boundary.

### Files to edit
- `src/routes/admin.orders.index.tsx` — inside the `rows.map(...)` at line ~203, track `lastDateKey` and emit a separator row before the order row when the IST date changes. `colSpan` matches the header (10 normally, 8 when `hideMoney`).
- `src/routes/admin.leads.index.tsx` — same pattern inside the `rows.map(...)` at line ~345. `colSpan` matches the leads table header column count.

### Separator row design
```text
┌───────────────────────────────────────────────┐
│  ▎ Mon, 29 Jun 2026 IST                       │  ← dark slate-900 bar, white text, sticky-looking
└───────────────────────────────────────────────┘
```
- Background `bg-slate-900` (dark line as requested), text white, 11px uppercase tracking-wide.
- Left padding aligned with the first column; date formatted via existing `formatIST(date, { dateOnly: true })` with weekday prepended.
- Today's row gets a small "Today" pill on the right; Yesterday gets "Yesterday".
- Pure presentational — no change to filters, sorting, pagination, counts, or row data.

### Acceptance
- Scrolling the Orders or Leads table shows one dark bar at every IST date change.
- No bar appears above the very first row of the page (optional — only between days).
- Toggling money columns in Orders keeps the bar full width (correct `colSpan`).
- No regression in row striping, hover, selection, or bulk-bar behaviour.

---

## Out of scope
- No changes to the assignment UI, role rules, or pool ordering algorithm.
- No changes to lead auto-assignment behaviour.
- No re-assignment of historical orders — trigger fires only on new inserts.
