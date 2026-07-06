# Consolidate Order Workspace — Single Source of Truth for Actions

## The problem (from the screenshots)

The order page currently shows the **same set of workflow actions in 3–4 places**:

- Top summary card → "Employee Actions" row with Submitted-to-Govt / Mark Certificate Issued / Our-Side Delay / Request Refund
- Employee Workflow tab header → another "Mark Certificate Issued" button
- "Order Status" section → Mark as Under Processing / Revert to Verification Pending
- Right sidebar → Request Documents
- "Need to pause or cancel?" → Mark External Delay / Start Cancellation
- Customer Journey pipeline (visual only)

They're not synchronized: some derive state from `order_status`, some from `application_status`, some from stage flags. Employees get confused about which button is the "real" one, and clicking them in the wrong order desyncs the automation (schedulers, emails E001–E005).

## The target model (from `All_Mail_Auto_Flow_System.docx`)

One order = one linear stage machine driven by **Customer Journey**:

```text
Lead → Payment → Consultation → Form → Verification → Govt Portal → Certificate → Completed
```

Every stage has exactly **one primary action** (advance) plus optional **exception actions** (Our-Side Delay, Customer-Side Delay, Request Docs, Cancel/Refund). Emails E001–E005 and the 3 schedulers are triggered by these stage transitions — never by ad-hoc buttons.

## Plan

### 1. Single ActionRail component (new)

`src/components/admin/workspace/OrderActionRail.tsx` — the ONLY place staff click to move the order forward.

Layout:

```text
┌─ CURRENT STAGE ────────────────────────────────────┐
│  Submitted to Govt  ·  updated 26 Jun 2026        │
│  Next: Mark the certificate issued when it arrives │
│                                                    │
│  [ Primary → Mark Certificate Issued        ]     │  ← 1 primary
│                                                    │
│  Exceptions:  ⚠ Our-Side Delay   ⏸ Customer Hold │  ← contextual
│               📄 Request Docs   ✖ Cancel/Refund   │
└────────────────────────────────────────────────────┘
```

Rules:
- Primary button = the single "advance to next stage" action for the current stage, derived from `computeOrderStage`.
- Exception buttons only render if allowed by `allowed_order_transitions` for the current status.
- Every click calls one server fn (`transition_order_status` or the corresponding stage-specific fn) and the panel re-derives from server state — no local optimistic UI drift.

### 2. Delete duplicate action UIs

Remove these action clusters entirely (keeping only display bits where noted):

| File | What to remove |
|------|----------------|
| Top summary card ("Employee Actions" row in `WorkspaceShell.tsx`) | Entire button strip — Submitted to Govt / Mark Certificate Issued / Our-Side Delay / Request Refund |
| `OrderWorkflowPanel.tsx` header pill | The extra "Mark Certificate Issued" button next to "updated …" |
| `OrderWorkflowPanel.tsx` "Order Status" block | Mark as Under Processing / Revert to Verification Pending |
| `OrderWorkflowPanel.tsx` "Need to pause or cancel?" | Mark External Delay / Start Cancellation |
| Right sidebar in `WorkspaceShell.tsx` | Standalone Request Documents button |
| `EmployeeActionPanel.tsx`, `StageActionsPanel.tsx` | Delete both files — replaced by ActionRail |

Kept as read-only display:
- Order summary card (order no, payment status, customer, quick contact icons)
- Customer Journey pipeline (visual stage indicator only, non-clickable)
- Stage Map inside Workflow tab → merged into the Journey; single visual, not two

### 3. Align stage machine with the automation doc

Introduce a single source-of-truth mapping in `src/lib/crm/computeOrderStage.ts`:

```text
Stage            | Primary action              | Auto emails / schedulers
-----------------|-----------------------------|--------------------------
payment_done     | (auto) Send E001            | E001 + start 5-min timer
awaiting_form    | Request Docs (manual)       | E002 + Incomplete-info scheduler
form_submitted   | Start Processing            | stop Incomplete-info scheduler
under_review     | Mark Verification Done      | —
in_progress      | Submit to Govt              | —
submitted_to_govt| Mark Certificate Issued     | —
certificate_ready| Complete Order              | E-Completed + stop all schedulers
completed        | (locked, Reopen only)       | —
```

Exception actions available on all in-flight stages:
- Our-Side Delay → E005 + Reminder scheduler (Manual / Auto 2h / Stop)
- Customer-Side Delay → E003 + External-delay scheduler → auto E004 after 8h
- Cancel / Refund → transition_order_status → REFUND_REQUESTED

### 4. Sync UI ↔ automation

- All buttons flow through `transition_order_status()` (server) so `order_status`, `application_status`, and the Customer Journey stage always match.
- The ActionRail subscribes to the `admin.order` query only; a successful transition triggers `queryClient.invalidateQueries` and the whole panel + journey pipeline re-renders from one server payload — no split state.
- Remove the `Revert to Verification Pending` button (super-admin only; move to a "…" menu behind role gate to keep normal UI clean).

### 5. Tabs cleanup

Employee Workflow tab becomes:

```text
[ ActionRail ]           ← single action surface
[ Internal Note ]        ← keep
[ Timeline & Reminders ] ← keep (read-only audit trail)
```

Drop the redundant "Order Status" and "Stage Map" blocks inside this tab — both were duplicating the Customer Journey pipeline shown on the summary above.

## Files touched

- **New**: `src/components/admin/workspace/OrderActionRail.tsx`
- **Edit**: `src/components/admin/workspace/WorkspaceShell.tsx` (drop top action strip + sidebar Request Docs)
- **Edit**: `src/components/admin/workspace/OrderWorkflowPanel.tsx` (drop header button, Order Status block, pause/cancel block, Stage Map)
- **Edit**: `src/lib/crm/computeOrderStage.ts` (expose `primaryAction(stage)` + `exceptionActions(stage, status)`)
- **Delete**: `src/components/admin/EmployeeActionPanel.tsx`, `src/components/admin/StageActionsPanel.tsx`
- **Keep as-is**: `ExternalDelayDialog.tsx`, `order-actions.functions.ts`, `schedulers.server.ts` — ActionRail calls into these unchanged.

## Non-goals for this pass

- No schema changes.
- No email template changes (E001–E005 already wired).
- Reopen / Refund detail flows unchanged — ActionRail only re-exposes them in one place.
- Bulk-order screens untouched.

## Confirmation asked

Approve this and I'll implement the ActionRail + deletions in one pass, then verify by loading the order page and walking a lead → completed transition.
