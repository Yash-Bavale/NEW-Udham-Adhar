This is a large change with three interlocking parts. Building in the order you specified (Part 2 → Part 3 → Part 1) so the data model is in place before permissions and metrics layer on top.

---

## Part 2 — Multi-Website / Multi-Service Hierarchy (foundation)

**New tables**

- `websites` — id, name, domain (unique), is_active, created_at/updated_at.
- `service_categories` — id, website_id, name, sort_order (optional grouping like "Udyam").
- Extend existing `services` — add `website_id` (FK), `category_id` (FK, nullable), keep `is_active`, keep existing `service_code` and form-schema wiring. Existing 6 Udyam services get backfilled to a seeded "Udyam Aadhar Advisory" website with domain `udyamadhar.in`.

**Extend `leads` and `applications**`

- Add `website_id` (FK, NOT NULL after backfill).
- `service_id` already exists on both — keep it, backfill from `service` text column, then make FK NOT NULL.
- Public lead form resolves `website_id` from the request `Host` header so future domains auto-route.

**Admin UI — `src/routes/admin.websites.tsx` (super-admin only)**

- Tree view: Website → Categories → Services.
- Inline add/edit/toggle for each level. "Add Website" needs name + domain. "Add Service" reuses the existing service form (code, name, price, form schema link).
- New websites/services default to `is_active = true` but permission-off for everyone (see Part 3).

---

## Part 3 — Granular RBAC (per-employee × module × website × service)

**New tables**

- `app_modules` — seeded enum-like list: `leads`, `orders`, `tickets`, `invoices`, `reports`, `services_admin`, `websites_admin`, `users_admin`.
- `user_permissions` — `(user_id, module, website_id, service_id nullable, access_level)` where `access_level ∈ ('view','manage')`. `service_id NULL` = all services for that website. `website_id NULL` reserved for global (admin only, not usable in the UI).
- Unique index on `(user_id, module, website_id, coalesce(service_id, '00...'))`.

**Helpers (SECURITY DEFINER)**

- `has_module_access(_user, _module, _website, _service, _level)` — admins/super_admins bypass; otherwise checks `user_permissions`.
- `accessible_service_ids(_user, _module)` returns setof service_ids — used by RLS and UI filters.

**RLS updates**

- `leads`, `applications`, `support_tickets`, `invoices` staff-read policies switch from "any staff role" to "staff AND service_id in accessible_service_ids(auth.uid(), &nbsp;)". Admins/super_admins keep full access via bypass in helper.
- Write policies similarly gated by `access_level = 'manage'`.

**Admin UI — `src/routes/admin.users.$userId.permissions.tsx**`

- Left rail: modules with on/off toggles.
- Right pane: for each enabled module, a Website accordion; inside each website either "All services" radio or per-service checklist with view/manage radio.
- Bulk apply: "grant this module for all services of website X".
- Save writes a full diff to `user_permissions`.

**Enforcement in app shell**

- `AdminShell` sidebar reads the user's modules once and hides tabs with zero access.
- Lead / Order / Ticket list loaders pass the caller's accessible service_ids into their filters; RLS is the backstop.

---

## Part 1 — Contact-Gated Performance Tracking

**Schema on `leads**`

- `first_contact_at TIMESTAMPTZ NULL` — set by the first contact log, never overwritten.
- `first_contact_by UUID NULL` — employee who logged it.
- `is_repeat BOOLEAN` — computed at insert time by matching normalized phone/email against prior leads (trigger).
- `payment_at TIMESTAMPTZ` — mirror of the linked application's first successful payment timestamp (backfill + trigger).

**New table `lead_contact_logs**`

- `id, lead_id, user_id, channel ('call'|'whatsapp'|'email'|'sms'), outcome ('connected'|'no_answer'|'busy'|'wrong_number'|'not_interested'|'callback_requested'|'other'), notes TEXT, created_at`.
- Insert trigger: if `leads.first_contact_at IS NULL`, stamp it (+ `first_contact_by`) and write an `application_events` row.

**Lead workspace changes**

- Add a "Log Contact" required action to the Quick Actions card. Modal picks channel + outcome + optional note.
- Existing "Mark Contacted" chip becomes a shortcut that opens the same modal (no more silent status flip).
- `moveLeadStatus` / `convertLead` server fns hard-block advancing past `new` until at least one contact log exists (except when the auto-conversion classifier applies).
- Repeat badge in the lead list from `is_repeat` (+ tooltip linking to prior leads for that phone/email).

**Classification (SQL view `lead_performance_v`)**

- `is_system_converted = payment_at IS NOT NULL AND (first_contact_at IS NULL OR payment_at < first_contact_at)`.
- `is_employee_handled = NOT is_system_converted`.
- `is_contacted = is_employee_handled AND first_contact_at IS NOT NULL`.
- `is_converted_after_contact = is_employee_handled AND first_contact_at IS NOT NULL AND payment_at IS NOT NULL AND payment_at >= first_contact_at`.
- `is_pending = is_employee_handled AND first_contact_at IS NULL`.
- `is_not_converted = is_employee_handled AND first_contact_at IS NOT NULL AND payment_at IS NULL`.

**Metrics RPC `get_employee_performance(from, to, website_ids, service_ids, user_ids)**`

- Returns per-employee rows + a company total row using the view above. Respects RBAC scope on the caller side.

**Dashboard — `src/routes/admin.performance.tsx**`

- Filters: date range (today / this week / this month / custom), website multi-select, service multi-select (both scoped to caller's permissions).
- Company-summary strip on top; grid of per-employee cards below with all seven counters + conversion rate (Converted After Contact ÷ Employee-Handled) and contact rate (Contacted ÷ Employee-Handled).
- "System-converted" leads appear in a separate strip so they're visible but excluded from rate math.

---

## Rollout order in code

1. Migration bundle: `websites`, extend `services`, extend `leads` + `applications`, `service_categories`, backfill.
2. Migration bundle: `user_permissions`, helpers, RLS swap.
3. Migration bundle: `lead_contact_logs`, `first_contact_at`, `payment_at` mirror, `is_repeat` trigger, `lead_performance_v`, `get_employee_performance` RPC.
4. Admin UIs (websites, permissions, performance) — each as a new route under `_authenticated/admin/`.
5. Enforcement wiring in existing lead/order/ticket loaders + sidebar.
6. Contact-log modal + gating in lead workspace.

---

## Technical notes

- All new tables get GRANTs to `authenticated` + `service_role`, RLS enabled, policies via `has_role` / `has_module_access` (SECURITY DEFINER) to avoid recursion.
- Backfill migration is idempotent; existing 6 Udyam services attach to the seeded website.
- The `Host`-header website resolver falls back to the default seeded website when running under `localhost` / Lovable preview domains.
- No customer-facing site changes beyond the lead form now stamping `website_id`.

---

## Confirm before I build

- **Default website domain**: seed `udyamadhar.in` as the default and attach existing services + leads to it — OK? -- Yes
- **Auto-conversion window**: use the strict rule you wrote (payment before first contact OR no contact yet) — OK, or add a grace period (e.g. paid within 5 minutes of lead creation regardless)? - payment before first contact OR no contact yet
- **Blocking conversion without a contact log**: hard block, or soft warning + override note for admins?

Reply "go" (with any of the three tweaks) and I'll ship the migrations first, then the UI.