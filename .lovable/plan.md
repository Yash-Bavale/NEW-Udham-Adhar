# Phase 5.5 — Udyam Operations OS (Master Plan)

Eight sub-phases. We approve and ship them **one at a time**. Each sub-phase ends with a working preview before we start the next. No "big bang" rewrite.

## Locked decisions (from your answers)

- **Landing**: role-based — Super Admin/Admin → Executive Dashboard, Operations/Support → My Work, Finance → Finance Dashboard.
- **Form builder**: dual-read. Customer & CRM read `service_form_schemas` first, fall back to the hardcoded schemas in `src/lib/onboarding/schemas.ts`. Hardcoded file stays as the safety net until every service has a DB version that matches.
- **Design system**: Linear-style — dark-first, dense, mono-accent (single hue), subtle glass, sharp typography. No prototype round. New tokens in `src/styles.css`, new shell wraps everything.

---

## Sub-phase map

```text
5.5a  Foundation        IA + new AdminShell + design tokens + role-based landing
5.5b  My Work           Next-Best-Action queue, sticky header, notifications
5.5c  Command Center    Unified application workspace (replaces split screens)
5.5d  Document Review   KYC-style 3-pane reviewer + checklist + completion score
5.5e  Customer 360      Snapshot + lifecycle timeline + unified activity feed
5.5f  Pipeline & Tasks  Kanban pipeline, real task engine, SLA visualization
5.5g  Finance Center    Revenue dashboard, invoice builder, GST/settlement views
5.5h  People & Polish   Employee lifecycle, performance, RBAC matrix, bug sweep
```

Bug fixes are folded into the relevant sub-phase (status bypass → 5.5c, form builder disconnect → 5.5a, invoice auto-email + cert resend → 5.5g, complaints/SLA → 5.5f, SEO admin in shell → 5.5a, etc.).

---

## 5.5a — Foundation (ship first)

**Goal**: new IA + shell + tokens. No screen rewrites yet — every existing admin route renders inside the new shell so we can iterate safely.

- New design tokens in `src/styles.css` (Linear-inspired: near-black surfaces, single indigo accent, tight radii, refined shadows, dark+light parity).
- New `src/components/admin/AppShell.tsx`:
  - Collapsible sidebar with 9 groups: Home, Customers, Applications, Operations, Communications, Finance, Services, People, System.
  - Sticky topbar: global search (⌘K), notifications bell, profile menu, breadcrumb.
  - Command palette (extend existing `CommandPalette.tsx`) with deep-link results.
- Re-map all existing `/admin/*` routes under the new sidebar groups (no URL changes, just nav grouping). Pull SEO admin inside the shell.
- Role-based landing redirect in `_authenticated/admin/index.tsx`.
- Form builder dual-read: new `src/lib/onboarding/schema-resolver.ts` checks `service_form_schemas` first, falls back to hardcoded. `OnboardingForm.tsx` and CRM submission viewers use the resolver. Seed empty DB rows kept unchanged → behavior identical.
- Skeleton routes for new pages (`/admin/my-work`, `/admin/pipeline`, `/admin/tasks`, `/admin/finance/*`, `/admin/employees`) so 5.5b–h can fill them in.

## 5.5b — My Work + Notifications

- `/admin/my-work` route. Greeting + counters (assigned, pending reviews, pending docs, certs pending, overdue, SLA warnings, follow-ups due).
- Next-Best-Action queue: server fn that ranks user's open work by SLA + priority. "Complete & next" auto-opens next item.
- Notification center: new `notifications` table (mig) + bell dropdown + realtime subscription. Event sources: lead created, payment success, doc uploaded, cert delivered, assignment, customer reply, SLA breach.

## 5.5c — Application Command Center

- New `/admin/applications/$id` workspace replacing current split screens.
- Sticky header (IDs, status, SLA pill, assignee, quick actions).
- Left rail: section nav (Customer, Application, Payment, Form, Documents, Certificate, Comms, Notes, Activity, Audit).
- Right panel: activity timeline + notes + @mentions.
- Service-specific layouts: New Udyam, Update, Download, Migration, Forgot Mobile/Email, PAN Correction — purpose-built sections per service code.
- **Bug fix**: status transitions go through `transitions.functions.ts` only (close direct `applications.update` paths in UI), enforce workflow steps from `service_workflows`.

## 5.5d — Document Review Center

- `/admin/review` queue + 3-pane reviewer (form left, doc viewer center, actions right).
- Approve / Reject / Request reupload / Add remark / Escalate.
- Doc checklist, completion %, missing docs list. Drives `documents.status` + emits timeline events.

## 5.5e — Customer 360 redesign

- Snapshot strip + Active Applications + Pending Tasks/Docs/Certs.
- Visual lifecycle timeline (per-year service chronology).
- Unified activity feed merging `activity_logs`, `application_status_history`, `email_logs`, `documents`, `payments`, `certificates` via a single `lead-timeline` server fn extension.

## 5.5f — Pipeline + Task engine + SLA

- Drag-drop Kanban at `/admin/pipeline` (columns = workflow statuses, drag triggers transition fn).
- New `tasks` table (mig): types (verify_info, verify_docs, generate_cert, upload_cert, follow_up, custom), owner, priority, due, SLA, completion. Kanban + table + calendar views.
- SLA pills (green/yellow/red) wired everywhere from `sla_due_at` and workflow `sla_hours`.
- **Bug fixes**: complaints assignment, SLA tracking, activity filtering.

## 5.5g — Finance Command Center

- `/admin/finance` dashboard: today/MTD revenue, pending, failed, refunds, service revenue, gateway perf, GST, settlements (visual, not tables).
- Invoice builder + detail view + resend + search. Company info / GST / bank / terms / prefix in `/admin/finance/settings` (new `invoice_settings` table, mig).
- **Bug fixes**: invoice auto-email on payment success (queue in `payments` webhook), certificate resend wired to email queue, finance role gating verified.

## 5.5h — People & Polish

- Employee lifecycle: invite, deactivate, suspend, reset password, assign team/region/services.
- Performance center: assigned/completed/avg time/SLA compliance/leaderboard.
- RBAC matrix UI over `user_roles` + granular permission map (new `role_permissions` table, mig).
- Final bug sweep, dark/light parity, motion polish (Framer Motion), empty/error/skeleton states everywhere, keyboard shortcuts doc.

---

## What changes vs. what stays

- **Stays**: all server fns under `src/lib/crm/*`, `src/lib/applications/*`, `src/lib/finance/*`, schema, RLS, status engine, payment gateways, email queue, onboarding schemas (as fallback). No business logic rewrites.
- **Changes**: routes under `/admin/*` get a new shell + new pages; some are new files, some wrap existing components. URLs preserved where possible; new URLs added for new screens.
- **New tables (each in its own sub-phase migration)**: `notifications`, `tasks`, `invoice_settings`, `role_permissions`. Each with GRANTs + RLS scoped to staff roles.

---

## Approval flow

After you approve this master plan, I'll start **5.5a only**. When 5.5a is shipped and you've sanity-checked the preview, say "next" and I'll write the detailed 5.5b plan, and so on. If you want to reorder, skip, or merge sub-phases, tell me before 5.5a starts.
