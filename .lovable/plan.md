## Scope

Phases 1–4 only. No changes to journeys, payments, emails, lead/order flows, or bundles this iteration.

## What already exists (reuse)

- `public.websites` — CRUD via `websites-admin.functions.ts` (`listWebsiteTree`, `upsertWebsite`, `deleteWebsite`). Currently no `description` column, no dedicated "Websites" management route surfaced in sidebar.
- `public.service_categories`, `public.services` — CRUD via same module + `services-admin.functions.ts`. Each service already carries `website_id`, `category_id`, pricing, `sort_order`, `is_active`.
- `public.profiles` — has `display_name`, `email`, `mobile`, `full_name`, `is_active`. No `employee_code`, no `department`, no `joining_date`.
- `public.user_roles` (+ `has_role`, `has_any_staff_role`) — canonical role storage. Keep.
- `public.user_permissions` (module + can_view/create/edit/delete) and `public.user_permission_scopes` (website / category / service per module) — already the shape needed for per-website / per-service access.
- `public.assignment_pool` (user_id, service_id nullable, is_active, round-robin counters) — powers `auto_assign_lead` / `auto_assign_application`.

## What's missing / to change

### Phase 1 — Websites
- Add `websites.description text`.
- Add `Management → Websites` route with list + create/edit dialog. Reuse `upsertWebsite`; extend Zod for `description`.

### Phase 2 — Services
- Add `services.expected_processing_days int`, `services.journey_key text` (nullable; defaults to current Udyam journey when null — actual journey routing lands in Phase 7, column added now so admin UI can capture it).
- Extend `Management → Services` page: filter by website, show category, price, expected days, active toggle, and an "Assigned Employees" count sourced from `assignment_pool ⋈ user_permission_scopes`.
- Do NOT change service_code semantics used by existing form-schema/onboarding code.

### Phase 3 — Employees + EMP-#### IDs
- Add `profiles.employee_code text UNIQUE`, `profiles.department text`, `profiles.joining_date date`.
- Create sequence `employee_code_seq` starting at 1.
- Trigger `set_employee_code` on `profiles` BEFORE INSERT: if null, `EMP-` + `lpad(nextval, 4, '0')`. Never reused, never mutated (trigger only fires on INSERT and only when null).
- One-off backfill in the same migration: assign EMP-#### to existing profiles ordered by `created_at ASC`, then `setval` sequence to `max + 1`.
- Update `handle_new_user()` so new signups get an EMP-#### automatically (trigger handles it — no code change needed beyond sequence existing).
- Surface `employee_code` everywhere staff is shown: employees list, lead/order assignee chips, activity log staff labels. This iteration wires it into the employees admin table + assignee dropdowns; broader surfaces get updated as they're touched later.

### Phase 4 — Employee → Website + Service + Work Permission
- Introduce four "work permission" module keys in `permission_modules` (idempotent insert): `work.leads`, `work.orders`, `work.support`, `work.finance`. These are separate from view permissions and represent "can be auto-assigned this kind of work".
- Employee editor UI (extend existing employee/permissions page):
  1. Role checkboxes (unchanged).
  2. Website access — writes `user_permission_scopes` rows with `module_key='work.leads'|'work.orders'|...` and `website_id` set.
  3. Service access — same table, `service_id` set (nullable website_id means "all sites").
  4. Work permission toggles — writes `user_permissions` rows for the `work.*` module keys.
- Extend `auto_assign_lead()` and `auto_assign_application()` to require:
  - user has `user_permissions.can_view` on `work.leads` (or `work.orders`) AND
  - a matching `user_permission_scopes` row for that module covering `NEW.website_id` (or scope is "all sites") AND
  - service scope match if the user has any service scopes on that module (empty = all services).
  - Falls back to today's `assignment_pool` behaviour when a user has no `work.*` scopes configured, so existing assignments keep working during rollout.
- Manual reassignment (admin/manager) unchanged.

## Technical details

Migration (single file):

```sql
ALTER TABLE public.websites ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS expected_processing_days int,
  ADD COLUMN IF NOT EXISTS journey_key text;
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS employee_code text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS joining_date date;

CREATE SEQUENCE IF NOT EXISTS public.employee_code_seq START 1;

CREATE OR REPLACE FUNCTION public.set_employee_code() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.employee_code IS NULL THEN
    NEW.employee_code := 'EMP-' || lpad(nextval('public.employee_code_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_profiles_employee_code ON public.profiles;
CREATE TRIGGER trg_profiles_employee_code BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_employee_code();

-- Backfill in creation order, then advance sequence.
WITH ordered AS (
  SELECT id, row_number() OVER (ORDER BY created_at ASC, id ASC) AS n
  FROM public.profiles WHERE employee_code IS NULL
)
UPDATE public.profiles p SET employee_code = 'EMP-' || lpad(o.n::text, 4, '0')
FROM ordered o WHERE p.id = o.id;
SELECT setval('public.employee_code_seq',
  GREATEST(1, (SELECT COALESCE(MAX(substring(employee_code from 5)::int), 0) FROM public.profiles)));

ALTER TABLE public.profiles ADD CONSTRAINT profiles_employee_code_key UNIQUE (employee_code);

INSERT INTO public.permission_modules(key, label, sort_order) VALUES
  ('work.leads','Work: Leads',900),
  ('work.orders','Work: Orders',901),
  ('work.support','Work: Support',902),
  ('work.finance','Work: Finance',903)
ON CONFLICT (key) DO NOTHING;
```

`auto_assign_lead` / `auto_assign_application` updated in the same migration to filter pool candidates by the `work.*` permission + website/service scopes, with the "no scopes configured → treat as unrestricted" fallback for safety.

Server functions changed (thin edits, no new files unless noted):
- `src/lib/crm/websites-admin.functions.ts` — accept `description`.
- `src/lib/crm/services-admin.functions.ts` — accept `expected_processing_days`, `journey_key`.
- `src/lib/crm/users-admin.functions.ts` — return `employee_code`, `department`, `joining_date`; accept them in upserts; new `setEmployeeWorkAccess({ userId, websites[], services[], work: {leads,orders,support,finance} })` writing `user_permissions` + `user_permission_scopes`.

UI:
- New route `src/routes/admin.management.websites.tsx` (list + dialog). Sidebar entry under Management.
- Extend existing services management route with expected-days + journey-key inputs, plus a small "Assigned employees" popover.
- Extend existing employees admin page with three collapsible sections: Websites, Services, Work Permissions. Employee row shows `EMP-####` prominently.

## Verification (in this iteration)

1. Apply migration; confirm all existing profiles have unique EMP-####.
2. Create a new employee via admin → EMP-#### auto-assigned; sequence not reused.
3. Grant a test employee `work.leads` + website Udyam + service "New Udyam" only; create a Udyam lead → auto-assigned to them; create a GST lead → NOT assigned to them.
4. Existing employees with no `work.*` scopes still receive assignments (fallback path).
5. `admin.leads.index` and employee dropdowns render `EMP-####` beside names.

## Out of scope (later phases)

Phase 5–7 lead/order flow rewrites, Phase 8 bundles, Phase 9 Customer 360 (already largely present), Phase 10–14. Journey per service uses the added `services.journey_key` column but the router lands in Phase 7.
