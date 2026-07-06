
## Goal

Put the **Employee Actions** block back where the screenshot shows it (directly under the header card, above Customer Journey), but as the **single source of truth** — the exact layout from the earlier plan mockup, covering **every** lifecycle stage from `computeOrderStage`, with the Timeline auto-syncing on every action.

## What went wrong last pass

- Removed the top "Employee Actions" strip entirely. Employees lost the at-a-glance action surface.
- Kept actions only inside the Workflow tab and only for `FULFILLMENT_STAGES` (7 stages), so pre-fulfillment stages (`lead_received`, `payment_pending`, `payment_done`, `consultation_pending`) had no action mapping.
- Exception row didn't match the mockup (missing Customer Hold, Request Docs).
- Timeline in the tab wasn't invalidated on every action → out of sync until refresh.

## New layout (matches earlier mockup)

Rendered in `WorkspaceShell` between the Header card and Customer Journey:

```text
┌─ EMPLOYEE ACTIONS ────────────────────────────────────────────┐
│ CURRENT STAGE: Submitted to Govt · updated 26 Jun 2026        │
│ Next: Mark the certificate issued when it arrives             │
│                                                               │
│ [  →  Mark Certificate Issued  ]                  ← 1 primary │
│                                                               │
│ Exceptions:  ⚠ Our-Side Delay   ⏸ Customer Hold               │
│              📎 Request Docs    ✕ Cancel/Refund   ← contextual│
└───────────────────────────────────────────────────────────────┘
```

Rules
- **One primary** button per stage. Clicking it drives the canonical forward transition (or opens the required gate dialog, e.g. certificate upload).
- **Exceptions** are contextual: only render the ones valid for the current stage/lane.
- **Revert** stays super-admin-only, shown as a small text link in the header row.
- Delay / cancellation lanes replace the primary with lane-specific CTAs (Resume Order, Customer Replied, Close/Refund) — same card, same position.

## Stage → primary + exceptions map (single source of truth)

New file `src/lib/crm/stageActionMap.ts` keyed by `OrderStage` (from `computeOrderStage`), so **every** stage has an entry:

| Stage | Primary | Exceptions |
|---|---|---|
| `lead_received` | Send Payment Link | Mark Uninterested |
| `payment_pending` | Resend Payment Link | Mark Uninterested, Cancel |
| `payment_done` | Start Consultation / Mark Documents Received | Our-Side Delay, Customer Hold, Cancel |
| `consultation_pending` | Convert Consultation → Order | Reschedule, Mark Uninterested |
| `form_submitted` → `order_received` | Mark Documents Received | Request Docs, Our-Side Delay, Customer Hold, Cancel |
| `under_review` (`verification_pending`) | Mark Verified & Ready to Submit | Request Docs, Our-Side Delay, Customer Hold, Cancel |
| `in_progress` (`documents_received`) | Move to Verification | Request Docs, Our-Side Delay, Customer Hold, Cancel |
| `submitted_to_govt` (`application_submitted`) | Move to Under Processing | Our-Side Delay, Customer Hold, Cancel |
| `under_processing` | Mark Certificate Issued (opens gate) | Our-Side Delay, Customer Hold, Cancel |
| `certificate_ready` | Complete & Send Certificate | Our-Side Delay, Cancel |
| `completed` | — (read-only "Order completed") | Revert (super-admin) |
| `uninterested` / `refund_requested` / `refunded` | Resume Order (super-admin) | — |

Every primary action calls an existing server fn (`updateFulfillmentStatus`, `convertConsultation`, `sendPaymentLink`, `resumeOrder`, etc.) — no new backend endpoints.

## Files

### New
- `src/components/admin/workspace/OrderActionRail.tsx` — the single card shown in the screenshot. Reads `OrderStage`, renders primary + exceptions from the stage map, owns delay/cancellation lane switching, opens existing dialogs (`CompletionGateDialogStandalone`, `ExternalDelayDialog`, `CloseOrderDialog`, customer-hold dialog, request-docs dialog).
- `src/lib/crm/stageActionMap.ts` — pure stage→actions map (table above) + helper `getStageActions(stage, current, lane)`.

### Edited
- `src/components/admin/workspace/WorkspaceShell.tsx` — mount `<OrderActionRail />` between the header card and Customer Journey (the exact slot the user circled in the screenshot). Pass `stage`, `current`, `workflowStatus`, `closureStage`, etc.
- `src/components/admin/workspace/OrderWorkflowPanel.tsx` — **remove** Card 1 (Order Status + primary/exceptions) so the Rail is the only place with these buttons. Keep only: Internal Note editor + Timeline & Reminders section. This is what fills the Workflow tab.
- `src/routes/admin.orders.$orderId.tsx` — re-wire `onRequestDocs` and pass `stage`/timestamps into `WorkspaceShell` so the Rail can invalidate the same queries.

### Timeline sync
On every action success, `OrderActionRail` calls one shared `refresh()` that invalidates:
- `["admin.order", orderId]`
- `["order-detail-v2", orderId]`
- `["workflow-events", orderId]` (drives the Timeline tab + collapsed Timeline in Workflow tab)
- `["workflow-reminders", orderId]`

The existing `UnifiedTimeline` and Workflow-tab history section already read those keys, so they refresh live after any Rail click.

## Not changing

- Database, email templates, schedulers, automation rules — untouched.
- `computeOrderStage`, `FULFILLMENT_TRANSITIONS`, CustomerJourneyMap — untouched (Rail consumes them).
- Quick Actions tile grid (Call / WhatsApp / Email / Open Lead / Print / Copy) — stays in the header card; it's contact tooling, not workflow.

## Verification

1. Open a `submitted_to_govt` order → Rail shows "Mark Certificate Issued" + 4 exceptions, matches screenshot exactly.
2. Click primary → toast + stage advances + Customer Journey pill + Timeline entry all update in the same render.
3. Open a `lead_received` and `consultation_pending` order → each shows its own primary from the map (no empty state).
4. Trigger Our-Side Delay → lane switches to delay, primary becomes "Resume Order", Timeline logs the pause reason.
