## Part 3 — Granular Role-Based Access Control

Layer per-employee permissions on top of the existing `user_roles` system without breaking `admin`/`super_admin` bypass or existing RLS.

### Data model (single migration)

`**permission_modules**` (seed table, read-only for staff)

- `key` (PK text): e.g. `leads`, `orders`, `tickets`, `services`, `websites`, `customers`, `payments`, `reports`, `settings`, `form_builder`, `assignments`
- `label`, `description`, `sort_order`
- Seeded with all current admin modules.

`**user_permissions**` (per-employee grants)

- `user_id` (FK auth.users)
- `module_key` (FK permission_modules)
- `can_view`, `can_create`, `can_edit`, `can_delete` (bool, default false)
- `scope_all` (bool, default true) — if false, restrict to scoped rows
- PK (`user_id`, `module_key`)

`**user_permission_scopes**` (row-level scope)

- `user_id`, `module_key`
- `website_id` (nullable), `category_id` (nullable), `service_id` (nullable)
- One row = one allowed slice; module read is union of scopes.

**Helper functions (SECURITY DEFINER):**

- `has_permission(_uid, _module, _action text)` — admin/super_admin auto-true; otherwise checks `user_permissions`.
- `permitted_service_ids(_uid, _module)` — returns array of service UUIDs the user may access (or NULL meaning "all").
- `permitted_website_ids(_uid, _module)` — same for websites.

GRANTs + RLS: `authenticated` reads own permissions; only admins write.

### RLS updates

Extend existing lead/application/ticket policies to also allow rows where `service_id`/`website_id` is in `permitted_*_ids(auth.uid(), '<module>')`. Admin/super_admin unchanged (already bypass).

### Server functions

`src/lib/crm/permissions-admin.functions.ts`:

- `listPermissionModules()`
- `listUserPermissions(userId)` — returns modules + scopes
- `upsertUserPermission({ userId, moduleKey, canView, canCreate, canEdit, canDelete, scopeAll })`
- `setUserPermissionScopes({ userId, moduleKey, scopes: [{websiteId?, categoryId?, serviceId?}] })`
- `listStaffUsers()` — id, email, display_name, role

`src/lib/crm/permissions.functions.ts` (self):

- `getMyPermissions()` — used by client to gate UI. Returns `{ [moduleKey]: {view,create,edit,delete, scopes} }`.

### Client integration

- `src/hooks/usePermissions.ts` — TanStack Query wrapper around `getMyPermissions`, caches per session.
- `<Can module="leads" action="edit">` component + `useCan(module, action)` hook.
- `AdminShell.tsx`: filter sidebar links by `view` permission (admin sees all).
- Guard action buttons (assign, delete, edit) in Leads/Orders/Tickets/Services pages via `useCan`.

### Admin UI

New route `src/routes/admin.permissions.tsx`:

1. Left column: staff user list (search).
2. Right column for selected user: matrix — rows = modules, columns = View / Create / Edit / Delete + "Scope: All / Custom".
3. Expand a "Custom" module → picker to add scope rows (Website → Category → Service selects; leaving deeper levels blank means "all under").
4. Save persists via server fns; live toast + query invalidation.

Sidebar link "Permissions" (admin-only) with Shield icon.

### Out of scope (call out to user)

- Not rewriting every existing RLS policy — only the high-value ones (leads, applications, support_tickets). Others still fall back to role checks.
- No bulk-copy-permissions-from-user helper this round.
- No audit log of permission changes beyond existing activity_logs.

### Rollout

Default state: every existing non-admin user gets NO explicit permissions → they lose access until an admin grants. To avoid disruption, migration seeds all current staff with full `view/create/edit` on all modules, `scope_all=true`. Admins then tighten as needed. make sure after migrating shift to default state 

&nbsp;