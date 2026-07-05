## Goal
Rebuild the workspace's "Customer Journey" as a full **Employee Workflow diagram** that matches the attached reference: three tiers (Consultation → After Consultation → Final Status) with four branching lanes. Every node is one of Past / Current / Next — Past nodes show green with timestamp, Current pulses, Next nodes are click-to-advance buttons. The customer's autosaved form + documents live inside the workspace, always visible.

## 1. New EmployeeWorkflowMap component

Replace `CustomerJourneyMap.tsx` with `EmployeeWorkflowMap.tsx` structured as three horizontal tiers.

```text
Tier 1 — CONSULTATION
  [Initial Customer Interaction]  → button: "Consultation Completed"

Tier 2 — AFTER CONSULTATION (Change Status)
  4 lane heads (buttons when Current, chips when Past):
    A. Application Submitted   →  Application Process lane
    B. Information Incomplete  →  Information Incomplete lane
    C. Service Delay - Our Side
    D. Service Delay - Customer Side

  Lane A (green):
    Pending Government Portal → Schedule Follow-up →
      Government Response Received → { Order Completed | Rejected }
  Lane B (amber):
    Information Incomplete (Email/WhatsApp/Reminder Sent)
    → Customer Submitted Information → Application Submitted
    …OR… Auto Close Order (No Response)
  Lane C (blue):
    Service Delay - Our Side → Schedule Follow-up
    → Continue Processing → Application Submitted
  Lane D (purple):
    Service Delay - Customer Side (Reminder Sent)
    → { Customer Responded → Continue Processing → Application Submitted
      | Auto Close Order (No Response) }

Tier 3 — FINAL STATUS
  Order Completed  ·  Rejected  ·  Auto Closed
```

### Node states (single visual language)

- **Past** — solid tinted card (lane color) + green check + `formatIST` timestamp under the label.
- **Current** — same card + pulse ring + "Current" pill.
- **Next** — outlined card rendered as a Button; on click fires the mapped action from `order-actions-map.ts`. Disabled when not legal (with tooltip reason).
- **Blocked / Skipped** — muted gray, no hover state.

### Status → node mapping (drives Past/Current/Next)

Add a single `WORKFLOW_NODES` table in `src/lib/orders/employee-workflow-map.ts`:

| Node id                 | Lane | Reached when order_status ∈             | Action key (Next)       |
|-------------------------|------|-----------------------------------------|-------------------------|
| consultation            | root | any (past once order_status set)        | send_form_link          |
| after_consult.appA      | A    | INFO_RECEIVED, IN_PROCESSING, …         | start_processing        |
| after_consult.infoB     | B    | WAITING_CUSTOMER_INFO                   | manual_reminder         |
| after_consult.ourC      | C    | OUR_SIDE_DELAY                          | our_delay               |
| after_consult.custD     | D    | CUSTOMER_HOLD                           | customer_delay          |
| A.pending_govt          | A    | IN_PROCESSING                           | submitted_to_govt       |
| A.schedule_followup     | A    | IN_PROCESSING (with pending follow-up)  | (opens AddTaskDialog)   |
| A.govt_response         | A    | SUBMITTED_TO_GOVT                       | certificate_issued      |
| A.order_completed       | end  | COMPLETED                               | —                       |
| A.rejected              | end  | CLOSED (rejected reason)                | —                       |
| B.customer_submitted    | B    | INFO_RECEIVED                           | start_processing        |
| B.application_submitted | B    | SUBMITTED_TO_GOVT                       | certificate_issued      |
| B.auto_close            | B    | CLOSED (no_response reason)             | —                       |
| C/D similar             | …    | mirror A                                |                         |
| final.auto_closed       | end  | CLOSED (auto reason)                    | —                       |

Reached-timestamps come from the `stageMeta` / `application` fields already loaded in `WorkspaceShell` (`form_submitted_at`, `stageMeta.application_submitted.at`, etc.) plus a small extra fetch of the last few `order_events` for lane branching (INFO_RECEIVED entered via Lane A vs B).

### Handler wiring

Each "Next" button calls `onAction(key)` → `WorkspaceShell.handlePrimaryStep(key)` → sets `pendingActionKey` on the (still-mounted) `EmployeeActionPanel`, which auto-opens its existing dialog. No new server functions.

## 2. Layout in WorkspaceShell

Replace the current "Customer Journey" section with the new full-width `EmployeeWorkflowMap`. Drop `TabStatusHeader` (its info is now on the Current node). Keep `EmployeeActionPanel` mounted but hidden inside a `<details>` labelled **"All status actions"** below the workflow — fallback for edge actions (refunds, close manual, etc.).

## 3. Autosaved form + docs inline

Add `src/components/admin/workspace/OrderFormInline.tsx`:

- Reuses `getFormSubmissionForApplication` (already used by `FormSubmissionPanel`) and `groupFields()` copied from `LeadFormSubmissionInline`.
- Renders: submission status pill + submitted-at, grouped autosaved fields (2-column key/value), uploaded documents list with Preview / Download buttons, missing-required-doc chips, and — when no submission yet — an empty state with a "Send form link" button that calls `onAction("send_form_link")`.

Mount it in `WorkspaceShell` inside the **Employee Workflow** tab, directly under the `EmployeeWorkflowMap`, so form data is visible without switching tabs. The dedicated "Forms & Docs" tab keeps the fuller `FormSubmissionPanel` + `OrderDocumentsPanel` for upload/manage flows.

## 4. Files touched

**New**
- `src/lib/orders/employee-workflow-map.ts` — the node table + `resolveNodeState(orderStatus, timestamps, events)` helper.
- `src/components/admin/workspace/EmployeeWorkflowMap.tsx` — the diagram (three tiers, four lanes).
- `src/components/admin/workspace/OrderFormInline.tsx` — inline autosaved form + docs viewer.

**Edited**
- `src/components/admin/workspace/WorkspaceShell.tsx` — swap `CustomerJourneyMap` → `EmployeeWorkflowMap`, remove `TabStatusHeader`, wrap `EmployeeActionPanel` in the collapsible, mount `OrderFormInline` in the workflow tab.
- `src/lib/orders/order-actions-map.ts` — no logic change, but export a small `LANE_TONE` map (green/amber/blue/purple) that both the diagram and the shell use.

**Removed** — `src/components/admin/workspace/CustomerJourneyMap.tsx` (replaced) and `src/components/admin/workspace/TabStatusHeader.tsx` (redundant).

**No** backend, RLS, edge-function, or server-fn changes.

## 5. Acceptance

- The workspace shows a single Employee Workflow diagram identical in structure to the reference: Consultation → 4 branching lanes → Final Status.
- Past nodes show a green tick + timestamp; Current node pulses; Next nodes are clickable buttons that open the correct action dialog.
- Autosaved form fields + uploaded docs are visible on the Employee Workflow tab without switching tabs.
- The old status pill strip and standalone Employee Actions grid are gone from the primary view; the full action set is one click away under "All status actions".
