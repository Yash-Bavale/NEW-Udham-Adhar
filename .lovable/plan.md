
## Problem

The **Workflow** tab on the order workspace currently stacks three independent panels that overlap in purpose and confuse the operator:

1. **Fulfillment Status** — "Move to" dropdown + Update Status (from `FulfillmentStatusUpdater`)
2. **Cancellation & Refund Workflow** — red "Start cancellation workflow" card (from `CancellationPanel`)
3. **Workflow Timeline** — Note / External Delay / Customer Replied / Resume / Refund / Close buttons + scheduled reminders + event log (from `WorkflowTimelinePanel`)

Three boxes, three "primary" buttons, two places that change order state, and the cancellation card sits between the status dropdown and the action buttons that already include "Close Order" and "Refund Request". The operator cannot tell which control to use.

## Goal

One **Order Workflow** panel inside the Workflow tab that wires fulfillment progress, external delay, customer reply, and cancellation/refund into a single flow driven by the current order stage.

## Unified panel layout

```text
┌─ Order Workflow ──────────────────────────────────────────┐
│ Stage chip:  Under Processing  •  External Dependency     │
│ Sub-stage:   (none | external_delay | pending_closure …)  │
│                                                           │
│ [ Primary action row — stage-aware, ONE CTA ]             │
│   happy path        → Advance to <next fulfillment stage> │
│   external_delay    → Customer Replied  /  Resume Order   │
│   pending_closure   → Send Concern Reply  /  Force Close  │
│   active order      → Start Cancellation                  │
│                                                           │
│ [ Secondary actions — collapsed in a "More" menu ]        │
│   Add Note · Refund Request · External Delay · Close      │
│                                                           │
│ ── Scheduled reminders (if any) ──────────────────────    │
│ ── Activity timeline (events) ────────────────────────    │
└───────────────────────────────────────────────────────────┘
```

Above the panel, the existing **CustomerJourneyMap** stays as the read-only three-lane visual (Happy / Delay / Cancellation) so the operator sees where they are before acting.

## Stage → primary CTA mapping

| Order state                              | Primary CTA shown            | Secondary actions available           |
| ---------------------------------------- | ---------------------------- | ------------------------------------- |
| Active, no delay, no cancellation        | `Advance to <next stage>`    | External Delay · Start Cancellation · Note |
| `workflow_status = external_delay`       | `Customer Replied` + `Resume Order` | Note · Start Cancellation            |
| `closure_stage = cancellation_requested` | `Send 24h follow-up` (auto)  | Customer Replied · Note               |
| `closure_stage = pending_closure`        | `Send Concern Reply` / `Force Close` | Note                              |
| `closure_stage = closed`                 | (read-only)                  | Reopen (admin)                        |
| `fulfillment_status = completed`         | (read-only completion card)  | —                                     |

The "Move to" status dropdown is hidden in normal flow; it's tucked under "More → Manual status override" for super-admins only so it stops competing with the stage-aware CTA.

## Files to change

- `src/components/admin/workspace/WorkspaceShell.tsx`
  Replace the three stacked components in the `workflow` TabsContent with a single `<OrderWorkflowPanel … />`, keep `<CustomerJourneyMap />` above it.
- `src/components/admin/workspace/OrderWorkflowPanel.tsx` *(new)*
  Owns the unified UI. Internally composes the existing logic by re-using the hooks/handlers from `FulfillmentStatusUpdater`, `CancellationPanel`, and `WorkflowTimelinePanel` (advanceFulfillment, setExternalDelay, customerReplied, resumeOrder, startCancellation, sendConcernReply, forceClose, addNote, refundRequest). No business-logic rewrites — only UI consolidation and stage-aware CTA selection.
- `src/components/admin/FulfillmentStatusUpdater.tsx`, `CancellationPanel.tsx`, `WorkflowTimelinePanel.tsx`
  Kept as-is for now (still imported by other routes/tests). Workspace stops rendering them directly.

## Out of scope

- No changes to server functions (`workflow.functions.ts`, `cancellation.functions.ts`), email templates, reminders, or DB schema.
- No changes to other tabs (Overview, Customer, Form & Docs, Emails, Activity).
- CustomerJourneyMap visual stays unchanged.
