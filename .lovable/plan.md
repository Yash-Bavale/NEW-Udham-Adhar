## What you'll see in the workspace

One **Order Journey** strip at the top of every order page. It always shows three lanes side-by-side so the employee never has to guess where the order is:

```text
┌─ HAPPY PATH ──────────────────────────────────────────────────┐ ┌─ SIDE TRACK ─────────────┐
│ Lead → Payment → Order Received → (Talk-to-Expert?) → Form    │ │ External Delay (if any)  │
│      → Docs → Verification → Submitted → Processing → DONE    │ │ reason · auto-resume in  │
└───────────────────────────────────────────────────────────────┘ └──────────────────────────┘
┌─ CANCELLATION (only if started) ─────────────────────────────────────────────────────────────┐
│ Req Received → Closed (24h) → Concern Reply → Ticket Closed (24h) → Refund Reviewed → Final  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

Active step = colored & pulsing. Completed = green check. Future = grey. Next auto-action shows a live countdown (e.g. "Auto-closure in 18h 22m").

---

## Full user journey (the map)

```text
LEAD CAPTURED ─▶ PAYMENT SUCCESS ─▶ ORDER RECEIVED
                                         │
                              ┌─ Talk-to-Expert? ─┐
                              │ yes               │ no
                              ▼                   ▼
                  CONSULTATION PENDING     FORM SUBMITTED
                  (pick service +                │
                   2nd payment link)             ▼
                              │           DOCUMENTS RECEIVED
                              └────────────────▶ │
                                                 ▼
                                          VERIFICATION PENDING
                                                 │
                                                 ▼
                                          APPLICATION SUBMITTED
                                                 │
                                                 ▼
                                          UNDER PROCESSING
                                                 │
                                                 ▼
                                          COMPLETED (cert uploaded + emailed)

SIDE TRACKS — branch from any active stage, never skip the main flow:

  EXTERNAL DELAY (13 reasons)
     └─ customer emailed · employee sets auto-resume · order pauses, never closes

  CANCELLATION / REFUND  (NEW — replaces the instant "cancelled" jump)
     1. Request Received    ── Email A "Action Required" (+ chosen REASON_BLOCK)
        wait 24h
     2. Closed — No Response── Email B "Closure Confirmation" · status=cancelled
        │
        ├─ customer agrees ──▶ Resume order (closure_stage cleared)
        │
        └─ customer argues ──▶ employee clicks "Send Concern Reply"
     3. Concern Reply Sent  ── Email C "Regarding Your Concern"
        wait 24h
     4. Ticket Closed       ── Email D "Ticket Closed"
        │
        └─ argues again ─────▶ employee clicks "Send Refund Decision"
     5. Refund Reviewed     ── Email E "Not Refundable"
        wait 24h
     6. Final Ticket Closed ── Email F "Final Closure"
        │
        └─ any further reply▶ employee clicks "Acknowledge"
     7. Acknowledged        ── Email G "Already Reviewed" (one-shot)

  Revert button available at every step until Step 6.
```

Visual version of the same flow is attached below.

---

## What changes in code (UI/wiring only — no business logic invented)

### 1. Cancel button no longer cancels directly
- `FulfillmentStatusUpdater.tsx` — remove `"cancelled"` from the dropdown.
- A new red **Cancel Order** button (in the workspace action bar) opens the cancellation dialog with the **13 REASON_BLOCK** picker. Submitting calls `requestCancellation` → enters Step 1 of the workflow above.

### 2. Cancellation panel restored & extended
- `src/components/admin/CancellationPanel.tsx` rewritten as a stage-aware card mounted in the workspace right rail.
- Always visible. Shows current step (1–7), live countdown to next cron action, the REASON_BLOCK used, and the *next manual action* button that's valid for the current step:
  - Step 2 → "Customer Argued · Send Concern Reply" / "Customer Agreed · Resume"
  - Step 4 → "Send Refund Decision" / "Customer Agreed · Resume"
  - Step 6 → "Acknowledge Customer Reply"
  - Any step before 6 → "Revert Workflow"
- Mini timeline inside the card lists Email A–G as they fire with sent-at IST.

### 3. Unified Customer Journey strip (the "one view")
- New component `src/components/admin/workspace/CustomerJourneyMap.tsx` shown as the top block of the **Overview** tab.
- Three lanes: Happy Path, External Delay, Cancellation. Each lane is a horizontal stepper with `STAGE_META` colors, timestamps in IST, and a "Next: …" line.
- Stage data merged from: `application.fulfillment_status`, `application.workflow_status`, `application.closure_stage`, `application.external_delay_*`.
- Clicking a step deep-links to the relevant tab (e.g. cancellation step → Workflow tab → CancellationPanel highlighted).

### 4. Workflow Timeline already exists — just wire it
- `WorkflowTimelinePanel` is the canonical event log. Every new cancellation event (`cancellation_requested`, `concern_reply_sent`, `refund_reviewed`, `ticket_closed`, `acknowledged`) is inserted into `workflow_events`, so the timeline shows the same story as the strip. No new component for this.

### 5. Customer fields you asked for earlier
- `CustomerProfileCard.tsx`: add **State** and **Language** rows (from `customer.state/language`, fallback to `lead.state/language`).
- Right-rail mini-card: append `State · Language` line under the email.

---

## Files

- `src/components/admin/workspace/CustomerJourneyMap.tsx` (new — the unified strip)
- `src/components/admin/workspace/CustomerProfileCard.tsx` (add State/Language)
- `src/components/admin/workspace/WorkspaceShell.tsx` (mount strip + cancellation panel in right rail, mini-card line)
- `src/components/admin/CancellationPanel.tsx` (rewrite to stage-aware card with manual-action buttons)
- `src/components/admin/FulfillmentStatusUpdater.tsx` (remove direct `cancelled`, add Cancel Order trigger that opens the dialog)
- `src/lib/crm/cancellation.functions.ts` (already extended in previous plan: `requestCancellation` with reasonCode, `sendConcernReply`, `sendRefundDecision`, `acknowledgePostClosure`, `customerAgreedResume`)
- `src/routes/api/public/cron/closure-workflow.ts` (24h advance for new stages — covered in previous plan)
- `src/routes/admin.orders.$orderId.tsx` (select `closure_stage`, `closure_next_at`, `closure_reason_code`, `cancellation_requested_at`, `external_delay_*` and pass to shell)
- Migration: extend `closure_stage` values + add `closure_reason_code`, `cancel_wait_hours` (covered in previous plan)

No other functionality touched. Refund money-movement, invoices, fulfillment updater, lead status engine, and unrelated email templates remain unchanged.

---

## Diagram

<lov-artifact url="/__l5e/documents/Order_Journey_Map.mmd" mime_type="text/vnd.mermaid"></lov-artifact>