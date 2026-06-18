
# Phase 1: Design System + New Admin Shell

Scope is intentionally narrow. No backend changes. No page rebuilds. We replace the chrome (sidebar, top bar, container, tokens) so every existing `/admin/*` page renders inside the new shell. The Dashboard, Leads, Orders, etc. screens keep their current content and will be rebuilt in later phases.

## What gets built

### 1. Design tokens (`src/styles.css`)
Add a dedicated admin token block — does not touch the public site theme:
- `--admin-primary: #1F4E79`
- `--admin-accent: #2E75B6`
- `--admin-surface: #FFFFFF`
- `--admin-surface-2: #EFF6FC` (light surface / row tint / hover)
- `--admin-border: #E2E8F0`
- `--admin-fg: #0F172A`
- `--admin-fg-muted: #64748B`
- Status pill colors (success / warn / danger / info / neutral) as flat solids (no gradients, no shadows).
- Body 14px, headings weight 500, system/Inter font stack.
- Remove existing admin gradient tokens (`--gradient-admin`, elevated shadows) from admin scope so the new look stays flat.

### 2. New `AdminShell` (`src/components/admin/AdminShell.tsx`)
Replace in place. Structure:
- **Fixed left sidebar, 220px**, always visible on desktop, collapses to bottom nav with icons on mobile (`md:` breakpoint).
- **Top bar**: global search input (always visible, full-width center), notifications bell, user avatar with dropdown (sign out).
- **Main**: 24px padding, full-width content area where current route children render via `<Outlet />`.
- Active route highlight via `useRouterState` pathname match.
- Visual grouping with thin dividers between the 6 groups listed in the spec.

### 3. Sidebar items (exact order + grouping from spec)
Each linked to a route. Routes that don't yet exist get created as **stub pages** with a `ComingSoon`-style empty state (reusing `src/components/admin/ComingSoon.tsx`). No backend, no mock data.

| Group | Item | Route | Status |
|---|---|---|---|
| 1 | Dashboard | `/admin/dashboard` | exists |
| 2 | Leads | `/admin/leads` | exists |
| 2 | Customers | `/admin/customers` | exists |
| 2 | Orders | `/admin/applications` (relabel "Orders") | exists |
| 2 | Documents | `/admin/documents` | **new stub** |
| 3 | Complaints | `/admin/complaints` | exists |
| 3 | Services | `/admin/services` | exists |
| 3 | Invoices | `/admin/invoices` | exists |
| 3 | Payments | `/admin/payments` | exists |
| 4 | Support Tickets | `/admin/tickets` | **new stub** |
| 4 | Tasks | `/admin/tasks` | **new stub** |
| 4 | Reports | `/admin/reports` | exists or stub |
| 5 | Employees | `/admin/users` (relabel "Employees") | exists |
| 5 | Email Templates | `/admin/emails/templates` | exists or stub |
| 5 | WhatsApp Templates | `/admin/whatsapp-templates` | **new stub** |
| 5 | Settings | `/admin/settings` | exists or stub |
| 6 | Logout | action (sign out) | wired to existing auth |

### 4. Global search (top bar)
Wire to the existing `src/lib/crm/global-search.functions.ts` server function (already covers leads/customers/orders). Debounced input, dropdown results, click navigates to detail. No new backend.

### 5. Shared UI primitives (admin scope only)
Light refresh of `src/components/admin/ui.tsx`:
- `StatusBadge` → flat pill with colored dot + label (remove gradient).
- `SectionCard` → flat, 1px border, no shadow.
- `StatCard` → flat surface, large number, no gradient backgrounds.
- Table base classes: alternating row tint (`--admin-surface-2`), sticky header, sortable column affordance.
- Form base classes: label-above-input, helper text, inline error styles.

Existing pages will pick up the new look automatically because they already consume these primitives and CSS variables.

## What is explicitly NOT in this phase
- No Dashboard rebuild (12 sections come later).
- No Leads/Orders/Customers/etc. UI rebuilds.
- No new tables, RLS, or backend functions.
- No Audit Trail, Cancellation Workflow automation, Aadhaar masking sweep, Legal consent capture, WhatsApp send logic — these come with their respective module rebuilds.
- The 4 new stub routes show "Coming soon" only.

## Files touched
- `src/styles.css` — admin token block (additive + flatten admin gradients)
- `src/components/admin/AdminShell.tsx` — rewrite
- `src/components/admin/ui.tsx` — flatten primitives
- `src/components/admin/CommandPalette.tsx` — keep (Ctrl-K), unchanged
- `src/routes/admin.documents.tsx` — new stub
- `src/routes/admin.tickets.tsx` — new stub
- `src/routes/admin.tasks.tsx` — new stub
- `src/routes/admin.whatsapp-templates.tsx` — new stub
- (verify existing routes for reports/email-templates/settings; add stubs only if missing)

## Acceptance check after build
- Every existing `/admin/*` page still renders with real backend data, just inside the new shell.
- Sidebar shows all 16 items in the spec order and grouping.
- Top bar search returns existing global search results.
- Mobile (<768px) collapses sidebar to bottom icon nav.
- No gradients or drop shadows anywhere in `/admin/*`.

Approve to proceed, or tell me which item to adjust (e.g. keep gradients, rename "Orders" back to "Applications", skip stubs).
