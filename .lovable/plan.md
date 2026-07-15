
## Goal

Make the Customer Journey Map show/enable exactly the right B-buttons per current phase, add the missing **B03 – Technical Delay Resolved (E011)** button, and drive the enable/disable rules from a single config so we can flip the unresolved "after B10" set once you confirm.

Purely UI + config changes — no email templates, no schema, no server actions rewritten (E011 wiring already exists from the last turn).

---

## 1. New "phase" model (config, shared)

Add to `src/lib/orders/journey-map.ts`:

```ts
export type JourneyPhase =
  | "form_not_submitted"     // order_received, no form yet
  | "form_submitted"         // form in / verification / review
  | "technical_delay"        // B02 pressed, hold active
  | "customer_delay"         // B10 pressed, hold active
  | "consultation_done"      // B04 pressed → awaiting govt
  | "awaiting_govt"          // B05 pressed → reminder queued
  | "status_checked"         // B06 pressed → checked, still waiting
  | "post_wait_submitted"    // B07 pressed
  | "completed"              // B08 terminal
  | "closed";                // B09 terminal (or A-closed)
```

`derivePhase(live, workflowStatus, closureStage, reasonCode)` — pure fn that returns one `JourneyPhase`. Reuses existing `deriveJourneyLiveState` output. Persist "last pressed" phase transitions in workflow events (already there) — read latest `workflow_event.kind` (`e005_sent`, `e006_sent`, etc.) via the existing `useOrderWorkflow` events list to distinguish B04/B05/B06/B07.

## 2. Button ↔ phase enablement map (config)

```ts
// Order of buttons matches your reference (B01..B10)
export const PHASE_ENABLED_BUTTONS: Record<JourneyPhase, ButtonCode[]> = {
  form_not_submitted:  ["B01"],
  form_submitted:      ["B02", "B04", "B05", "B08", "B10"],
  technical_delay:     ["B03"],
  customer_delay:      POST_B10_ALLOWED,   // configurable — see §4
  consultation_done:   ["B08", "B09"],
  awaiting_govt:       ["B06", "B07", "B08", "B09", "B10"],
  status_checked:      ["B07", "B08", "B09", "B10"],
  post_wait_submitted: ["B08", "B09"],
  completed:           [],   // terminal
  closed:              [],   // terminal
};
```

`ButtonCode` = `"B01" | ... | "B10"`.

## 3. Add the missing B03 sub-card

In `CustomerJourneyMap.tsx`, the Technical Delay card at `NODE_X[3] / ROW_Y[0]` currently only has "Select Reason + Add Reminder" (B02). When `phase === "technical_delay"` swap the CTA to:

- Label: **"Technical Delay — Issue Resolved"**
- Chip: `E011`
- onClick → calls the existing `resumeFromHold` server fn (already wired last turn) with the technical-hold row id from `useOrderWorkflow().view.timers`.
- On success toast "E011 sent — order resumed" and invalidate the standard keys.

No new server code; just a mutation + button swap inside the same card.

## 4. Config value for "after B10" (unresolved)

```ts
// src/lib/orders/journey-map.ts
// FIXME(confirm): after B10 (Customer Side Delay) which buttons stay active?
// Set to whichever variant Ops confirms. Flip here, not in components.
export const POST_B10_ALLOWED: ButtonCode[] =
  ["B02", "B04", "B05", "B08", "B09"];   // default guess; flip to include B10 or swap B09↔B10 later
```

Component reads `PHASE_ENABLED_BUTTONS.customer_delay` — no hardcoding downstream.

## 5. Gate every existing sub-card button

Each `<SubCard button={...} />` gets a `disabled` derived from:

```ts
disabled: closed || !PHASE_ENABLED_BUTTONS[phase].includes(code)
```

Mapping of the 10 existing cards → codes:

| Card location | Code | Existing label kept |
|---|---|---|
| Order col / row0 "Form Not Submitted" | B01 | Send Info Incomplete Mail (E002) |
| Form col / row0 "Technical Delay" (CTA A) | B02 | Select Reason + Add Reminder (E003) |
| Form col / row0 "Technical Delay" (CTA B, when active) | **B03** *(new)* | Issue Resolved (E011) |
| Govt col / row0 "Consultation Completed" | B04 | Order Completed (E005) |
| Govt col / row1 "Waiting for Govt Approval" | B05 | Add Reminder (E006) |
| Final col / row0 "Awaiting Govt Response" | B06 | Add Reminder (E006) |
| Final col / row1 "Consultation Completed (After Waiting)" | B07 | Order Completed (E005) |
| Final col / row2 "Application Accepted — Upload PDF" | B08 | Upload Cert & Complete (E007) |
| Final col / row3 "Application Rejected" | B09 | Select Reason (E008) |
| Form col / row1 "Customer Side Delay" | B10 | Select Reason (E004) |

Force Close (E010) card stays as-is — it is not in the B-set and is always visible per existing rules.

## 6. Visual state for disabled buttons

Existing `SubCard` already dims when `disabled`. Add a small "Not available in this phase" tooltip when `disabled && !closed` so employees understand why the CTA is greyed out instead of hidden.

## 7. Files touched

- `src/lib/orders/journey-map.ts` — add `JourneyPhase`, `derivePhase()`, `PHASE_ENABLED_BUTTONS`, `POST_B10_ALLOWED`, `ButtonCode`.
- `src/components/admin/workspace/CustomerJourneyMap.tsx` — compute `phase` via `derivePhase`, add B03 CTA branch on the Technical Delay card, apply `disabled` gating to all 10 cards, add tooltip.

No changes to: email templates, `hold-actions.functions.ts`, `transition-guard.server.ts`, migrations, `stageActionMap.ts`, invoices, or any other flow.

## 8. Verification

- Build passes (tsgo).
- Manually walk each phase in the preview at `/admin/orders/…`:
  1. New order, no form → only B01 enabled.
  2. Press B01 → all B* disabled (still `form_not_submitted` until form arrives).
  3. Form submitted → B02/B04/B05/B08/B10 enabled.
  4. Press B02 → only B03 enabled; press B03 → returns to (3).
  5. Press B04 → B08/B09 only.
  6. Press B05 → B06/B07/B08/B09/B10.
  7. Press B06 → B07/B08/B09/B10.
  8. Press B07 → B08/B09.
  9. Press B08 → terminal completed, all disabled.
  10. Press B09 → terminal closed, all disabled.
  11. Press B10 → whatever `POST_B10_ALLOWED` says (documented as unresolved).
