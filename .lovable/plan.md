## Goal
Rebuild `src/routes/admin.orders.$orderId.tsx` as a **modern colorful Tabbed Command Center**. Keep every existing capability (customer details, lead form, post-payment form, fulfillment, workflow, timeline, emails, payments, documents, notes, consultation flow, RBAC money-hiding) — only the shell + visual language change.

## Visual direction
- Palette: Indigo `#4f46e5` (primary), Cyan `#06b6d4` (info/active stage), Amber `#f59e0b` (warnings/pending), Coral `#ef4444` (danger/closure), Emerald `#10b981` (success). Soft gradient backgrounds (`from-indigo-50 via-white to-cyan-50`).
- Typography: keep current font stack. Bold headings, uppercase micro-labels with tracking.
- Surface: rounded-2xl cards, subtle ring + colored gradient borders for the active stage, smooth `animate-fade-in` / `hover-scale` transitions.
- Stage stepper: full-width horizontal pill-stepper with gradient fills per stage, animated pulsing dot on the active stage, click to jump to that tab.
- Density: everything visible — tabs are the primary nav, but Overview tab shows a bento of mini-cards so power users see the whole picture without clicking.

## New shell layout
```text
┌────────────────────────────────────────────────────────────────────┐
│ ← Back to orders                                       [+ Add Task] │
├────────────────────────────────────────────────────────────────────┤
│ STICKY GRADIENT HEADER                                              │
│  AP-2026-006630  •  Payment Done  •  Download Udyam Certificate     │
│  Customer • Mobile • Email • Created • Payment • Total • Assignee   │
├────────────────────────────────────────────────────────────────────┤
│ COLORFUL GRADIENT STAGE STEPPER  (9 pills, active = pulse + glow)   │
├────────────────────────────────────────────────────────────────────┤
│ PERSISTENT ACTION BAR  [Call][WhatsApp][Email][Docs][Cert][Done]    │
├────────────────────────────────────────────────────────────────────┤
│ TABS:  Overview | Customer | Form & Docs | Workflow | Emails | Log  │
│ ┌──────────────────────────────────────┬──────────────────────────┐ │
│ │ Active tab content (2/3 width)       │ Right rail (1/3)         │ │
│ │                                      │ • Customer mini card     │ │
│ │                                      │ • Stage summary          │ │
│ │                                      │ • Payments & Invoices    │ │
│ │                                      │ • Documents quick list   │ │
│ └──────────────────────────────────────┴──────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

## Tabs (content mapping — all existing components reused)
1. **Overview** — Bento of: StageActionsPanel (next step), ProcessingChecklist, mini Form status card, mini Workflow status card, last 3 timeline events. One-glance health.
2. **Customer** — Full customer profile card (name/mobile/email/repeat badges) + LeadWorkspacePanel-style lead form details (the original website lead form submission).
3. **Form & Docs** — `FormSubmissionPanel` (post-payment service form) + `OrderDocumentsPanel` side-by-side on wide screens.
4. **Workflow** — `FulfillmentStatusUpdater` + `WorkflowTimelinePanel` (external delay, reminders, closure actions) + `ConvertConsultationPanel` when applicable.
5. **Emails** — Existing emails history (LeadEmailsTab-style) scoped to this order/lead — read-only list with subject, status, sent time, preview drawer.
6. **Activity Log** — `UnifiedTimeline` (events + payments + documents) + `InternalNotes` composer at top.

Consultation (Talk-to-Expert) special case: when `showConsultationPanel` is true, Overview + Form & Docs tabs are replaced by a single highlighted "Consultation" tab hosting `ConsultationContactStrip` + `ConvertConsultationPanel` — matches current gating exactly.

## New components (presentation only — no business logic changes)
- `src/components/admin/workspace/WorkspaceHeader.tsx` — gradient sticky header (wraps current `OrderCommandHeader` data into the new look).
- `src/components/admin/workspace/StageStepper.tsx` — colorful gradient horizontal stepper (replaces `ProcessTracker` visually; same `stage` + `timestamps` props; click → switch tab).
- `src/components/admin/workspace/WorkspaceTabs.tsx` — shadcn `Tabs` with colored active indicator, icons, count badges (e.g. unread emails, missing docs).
- `src/components/admin/workspace/OverviewBento.tsx` — bento grid of summary cards composed from existing data.
- `src/components/admin/workspace/EmailsTab.tsx` — thin wrapper around the existing emails-admin query for this lead/application.
- `src/components/admin/workspace/RightRail.tsx` — assembles customer card + stage summary + payments + docs quick list.

All other panels (`FormSubmissionPanel`, `OrderDocumentsPanel`, `OrderPaymentsPanel`, `FulfillmentStatusUpdater`, `WorkflowTimelinePanel`, `ProcessingChecklist`, `UnifiedTimeline`, `ConvertConsultationPanel`, `StageActionsPanel`) are **reused as-is** — no prop changes.

## Files touched
- `src/routes/admin.orders.$orderId.tsx` — rewritten shell using the new components; data fetching, RBAC, consultation gating, assignee/notes/reminder handlers all unchanged.
- New files under `src/components/admin/workspace/` listed above.
- No changes to server functions, schemas, RLS, emails, or workflow logic.

## Out of scope
- Lead list, orders list, dashboards, customer profile route, settings — untouched.
- No DB migrations, no API changes.
- No removal of any data currently shown.

## Acceptance
- Same URL, same data, same role-based money hiding.
- All previous actions reachable in ≤ 1 click from the action bar or active tab.
- Stage stepper, header, and action bar stay sticky while scrolling within a tab.
- Works at 1280px and at mobile (tabs become a horizontal scroller; right rail stacks).
