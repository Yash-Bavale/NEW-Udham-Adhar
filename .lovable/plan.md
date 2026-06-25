# Unified Operations Platform — UI/UX Redesign Plan

**Scope guardrail:** Presentation layer only. No backend, schema, server-function, RLS, workflow, or business-logic changes. Every section below reuses existing data shapes from `getOrderDetailV2`, `getCustomer360`, `getDashboardStats`, `getOpsDashboard`, `computeOrderStage`, `FULFILLMENT_*`, `useRole`, etc. If a piece of data isn't already returned, we render an empty state — we do not add new server functions.

---

## Stage 1 — Design System Foundation

Build the visual language once so every later stage just consumes tokens.

- `src/styles.css`: add a dedicated `@theme` block for the admin surface — premium typography stack (display + body), 8pt spacing scale, refined shadow/elevation tokens, glass surface tokens, semantic stage colors (done/current/pending/blocked), light + dark variants via existing `@custom-variant dark`.
- `src/components/admin/theme.tsx`: extend with `Surface`, `GlassCard`, `SectionHeader`, `StickyBar`, `Kbd`, `EmptyState`, `SkeletonRow`, `MetricTile` primitives. All consume CSS vars — no hardcoded colors.
- `src/components/admin/primitives/`: add `StageChip`, `PriorityBadge`, `SLAIndicator`, `ActionButton` (icon + label, tooltip, keyboard hint), `AccordionCard`, `ChecklistItem`, `TimelineItem`, `DocumentCard`, `PreviewDrawer`.
- Framer Motion: install if missing, add shared `fadeUp`, `stagger`, `drawerSlide` presets in `src/lib/motion.ts`.
- Reference quality: Linear / Attio / Stripe — dense, quiet, typographic, no gradient noise.

## Stage 2 — Order Command Center (`/admin/orders/$orderId`)

Full rebuild of the page composition. Same server function (`getOrderDetailV2`), same mutations.

Layout:
```text
┌─ Sticky Header (always visible) ──────────────────────────────┐
│ Order# · Customer · Service · StageChip · Assignee · Pay · SLA · Priority │
├─ Persistent Action Bar ───────────────────────────────────────┤
│ [Call] [Email] [WhatsApp] [Request Docs] [Upload Cert]        │
│ [Complete] [Assign] [Print]                                   │
├─ Process Tracker (horizontal, 8 stages, color-coded) ─────────┤
├─ 2-column workspace ──────────────────────────────────────────┤
│  LEFT (2/3)                          RIGHT (1/3)              │
│  • Service Form (as-filled view)     • Documents (cards+drawer)│
│  • Processing Checklist              • Payments (read-only)   │
│  • Unified Timeline                  • Customer mini-profile  │
│                                      • Internal Notes         │
└───────────────────────────────────────────────────────────────┘
```

Specifics:
- **Sticky header + action bar:** new `OrderCommandHeader.tsx` + `OrderActionBar.tsx`. Actions wire to existing handlers (call/email/whatsapp links, `queueDocumentReminder`, `CompletionGateDialog`, `updateOrderAssignee`, browser print). Hidden by role via `useRole` (no Complete for support).
- **Process Tracker:** replace both `OrderJourneyStepper` and `StageJourneyStrip` with a single `ProcessTracker.tsx` driven by `computeOrderStage` — 8 nodes, green/blue/grey/red states, tooltip with timestamp.
- **Service Form view:** rebuild `FormSubmissionPanel` to render submitted form using existing `formDisplayConfig` ordering — section headings, grouped fields, exact sequence, copy-to-clipboard on each field, "Open in Govt Portal" link. Read-only application-form aesthetic, not a table.
- **Document workspace:** rebuild `OrderDocumentsPanel` as a card grid. Each card: thumbnail preview, type, status pill, uploaded-on, verified-by, actions (Approve / Reject / Replace / Request Again — all existing mutations). Click opens `PreviewDrawer` (side sheet) without leaving page.
- **Processing Checklist:** new `ProcessingChecklist.tsx` — derives ticks from existing fields (`form_submitted_at`, doc verification statuses, `certificate_uploaded_at`, fulfillment_status, last email event). Read-only reflection of state; no new writes.
- **Unified Timeline:** new `UnifiedTimeline.tsx` merging `events`, payments, emails, status changes, notes from the existing detail payload into one chronological stream.
- Delete: `OrderJourneyStepper.tsx`, `StageJourneyStrip.tsx`, `OrderJourney.tsx` (replaced by ProcessTracker).

## Stage 3 — Customer & List Surfaces Aligned to Workspace Language

- `/admin/customers/$customerId`: re-skin to match Command Center — sticky identity header, action bar (Call/Email/WhatsApp/New Order), tabs become accordions on one canvas (Orders · Payments · Documents · Communications · Notes). Same `getCustomer360` payload.
- `/admin/orders` list: keep existing filter chips and `listOrdersV2`. Re-skin row to "Attio-style" — dense, monospaced order#, StageChip, SLA dot, assignee avatar, last-activity relative time. Add command-palette-style search (reuses existing `CommandPalette`). One primary action per row: "Open Workspace".
- `/admin/leads`: row shows date + IST time together (no logic change), "View" navigates to full lead page (already in place — verify and keep).

## Stage 4 — Dashboards by Role

Same server functions (`getDashboardStats`, `getOpsDashboard`, `super-admin.functions`). Re-compose only.

- **Super Admin (`/admin/dashboard` when `super_admin`)**: rebuild as analytics canvas — Revenue trend (area), Order trend (line), Conversion funnel (horizontal bars), Service mix (donut), Pipeline (stacked), KPI tiles for Pending Processing / Certificates / Complaints / Gateway Health / Avg Processing Time / Employee Productivity / Customer Growth / Top Services. Uses `recharts` (already in deps). "Needs Attention" live list. Glassy dark-first surfaces.
- **Operations (`/admin/my-work` is canonical)**: redesign as "Today's Work" — assigned orders grouped by stage, SLA-sorted, one-click into Order Command Center. Payment column shows only `Success / Pending / Failed` chip — no amounts, GST, totals, revenue (gated via `useRole`, hide columns + redact `OrderPaymentsPanel` amounts for operations role).
- **Support (`/admin/my-work` when support role)**: complaints inbox + customer comms only. Hide orders/finance/processing modules in `AdminShell` sidebar for support role.

## Stage 5 — Sidebar, Navigation, Empty/Loading States

- `AdminShell.tsx`: shrink to role-filtered nav. Operations sees: My Work · Orders · Customers · Tasks · Doc Review. Support sees: My Work · Complaints · Customers. Super Admin sees full set. Collapsible, keyboard-shortcut hints, active route highlight per `tanstack-navigation`.
- Add global empty states + skeleton loaders to every list/detail (`EmptyState`, `SkeletonRow` from Stage 1).
- Add Framer Motion page transitions in `__root` admin outlet.
- Dark mode toggle in shell header (token system already supports it).

## Stage 6 — Verification

- `tsgo` clean across project.
- Playwright smoke: open `/admin/orders`, click into one order, verify sticky header + action bar + process tracker visible above fold; open a document → preview drawer slides in without route change; switch to operations role fixture → confirm no rupee symbols / GST / totals render anywhere on the page.
- Role matrix sanity: super_admin sees revenue tiles; operations does not; support sees complaints surface only.
- Confirm zero changes under `src/lib/crm/*.functions.ts`, `supabase/migrations/*`, `src/integrations/supabase/*` (presentation-only diff).

---

## Out of Scope (explicit)

- No new tables, columns, RPCs, edge functions, RLS policies.
- No changes to `computeOrderStage`, fulfillment transitions, completion gate, payment webhooks, email templates, cron, or any server function signature.
- No new modules or business entities. Customers/Submissions/Certificates/Payments/Invoices/Documents continue to exist as routes but are also surfaced inside the Order Command Center as sections.

## Files Touched (high level)

- New: `src/lib/motion.ts`, `src/components/admin/OrderCommandHeader.tsx`, `OrderActionBar.tsx`, `ProcessTracker.tsx`, `ProcessingChecklist.tsx`, `UnifiedTimeline.tsx`, `PreviewDrawer.tsx`, `primitives/{StageChip,PriorityBadge,SLAIndicator,ActionButton,AccordionCard,ChecklistItem,TimelineItem,DocumentCard,MetricTile,EmptyState,SkeletonRow}.tsx`.
- Rebuilt (UI only): `routes/admin.orders.$orderId.tsx`, `routes/admin.customers.$customerId.tsx`, `routes/admin.dashboard.tsx`, `routes/admin.my-work.tsx`, `routes/admin.orders.tsx`, `components/admin/{FormSubmissionPanel,OrderDocumentsPanel,OrderPaymentsPanel,AdminShell,theme}.tsx`, `src/styles.css`.
- Deleted: `components/admin/{OrderJourneyStepper,StageJourneyStrip,OrderJourney}.tsx`.

Reply **approve** to begin Stage 1.
