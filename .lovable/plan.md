## 1. Super-admin password reset for employees

**New server fn** `resetEmployeePassword` in `src/lib/crm/users-admin.functions.ts`:
- Middleware: `requireSupabaseAuth`.
- Input: `{ user_id: uuid, new_password: string (min 8, max 72) }`.
- Guard: caller must hold `super_admin` (tighter than the existing `assertAdmin` which also lets `admin` through — password reset is super-only).
- Calls `supabaseAdmin.auth.admin.updateUserById(user_id, { password })`.
- Writes an `audit_logs` row: `entity_type='user', action='password_reset', actor_id=caller`. Never logs the password itself.

**UI in `src/routes/admin.employees.tsx`:**
- Add a "Reset password" item in the per-row action menu (next to Edit / Activate-Deactivate), visible only when `useRole().has('super_admin')`.
- Opens a dialog: new password + confirm password fields, show/hide toggle, client-side validation (min 8, must match). Submit calls the new server fn, toasts success, closes.
- No email is sent — super-admin tells the employee out-of-band.

## 2. Surface every built admin page in the sidebar

**`src/components/admin/AdminShell.tsx` — rewrite `NAV`** into clearer groups so every existing route appears:

```text
Overview      Dashboard, My Dashboard, Pipeline, Activity, Notifications
Sales         Leads, Customers, Orders, Applications, Documents, Submissions, Review
Service       Complaints, Support Tickets, Tasks, Services
Finance       Invoices, Payments, Gateways, Finance (GST / Settlements)
Insights      Reports, Audit Log, SEO
Admin         Employees, Users & Roles, Certificates, Email System,
              Email Templates, WhatsApp Templates, Super Admin, Settings
```

All entries are plain `Link`s — no new routes, just nav items pointing at routes that already exist (`/admin/my-work`, `/admin/pipeline`, `/admin/activity`, `/admin/notifications`, `/admin/applications`, `/admin/submissions`, `/admin/review`, `/admin/certificates`, `/admin/gateways`, `/admin/finance`, `/admin/audit`, `/admin/seo`, `/admin/users`, `/admin/super`).

The Super Admin entry is rendered only when `useRole().has('super_admin')`; everything else is unconditional.

## 3. Open module access to all staff roles

**`src/lib/roles.ts` — broaden `ACCESS_MATRIX`** so every role in `ASSIGNABLE_ROLES` gets at least `read` (or `full` where it already had `full`) on every module: dashboard, leads, orders, payments, invoices, customers, documents, complaints, tickets, tasks, reports, employees, email_templates, audit_log.

- `super_admin`, `admin`, `manager`: keep `full` everywhere.
- `executive`, `support`, `accounts`, `finance`, `operations`: upgrade `none` cells to `read` so the sidebar shows the link and the page renders, while `full` cells stay `full`.

Pages that already perform their own per-action authorisation (refunds, role grants, password reset, super-admin overview) keep those checks — broadening the matrix only opens visibility, not destructive actions.

## 4. Out of scope

- No new pages or routes.
- No schema migration.
- No nav copy/icon overhaul beyond regrouping; same lucide icons reused.
- Password reset email flow not added (per choice "Set a new password directly").

## Files touched

- `src/lib/crm/users-admin.functions.ts` — add `resetEmployeePassword`.
- `src/routes/admin.employees.tsx` — row action + dialog.
- `src/components/admin/AdminShell.tsx` — expanded `NAV` groups.
- `src/lib/roles.ts` — widened `ACCESS_MATRIX`.

## Verification

- Sign in as super-admin → /admin/employees → reset a test employee's password → sign in as that employee with new password.
- Sign in as `executive` (or `support`) → confirm every sidebar group is visible and every linked page loads without an "unauthorized" flash.
- Sign in as `admin` (non-super) → "Reset password" action is hidden.
- Typecheck/build clean.
