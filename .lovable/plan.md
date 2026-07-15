
## Goal

Two things, tied together:

1. **Gate buttons by current status** using a config lookup table (not if/else), matching the B01–B10 table you sent.
2. **Actually rebuild** the Journey view + Ticket panel as new components (not in-place edits to `CustomerJourneyMap.tsx` / `TicketPanel.tsx`), so the diff is visible.

E011 template + `resumeFromHold` trigger already landed last turn — I'll verify the row is inserted and wire B03 to it. If the DB row is missing, I'll ship the migration.

---

## Part 1 — Button state machine (config-driven)

### New file: `src/lib/orders/button-state-machine.ts`

Single source of truth. Two exports:

**a) Button catalog** — one entry per code:

```ts
export type ButtonCode = "B01"|"B02"|"B03"|"B04"|"B05"|"B06"|"B07"|"B08"|"B09"|"B10"|"BX_CLOSE"|"BX_REOPEN";

export interface ButtonSpec {
  code: ButtonCode;
  label: string;              // exact label from your table
  emailCode: string | null;   // E001…E011, or null (reopen TBD)
  action: ActionKind;         // maps to existing server fn
  reasonCategory?: "A"|"B"|"C";
  terminal?: boolean;
  variant: "primary"|"outline"|"danger"|"success";
  requiresReminder?: boolean;
  autoCloseHours?: number;    // B01=8, B10=8
  flagged?: string;           // "E011 template stub" for B03 if missing
}
```

**b) Status → active buttons table**, driven by the exact matrix you gave:

```ts
export const NEXT_ACTIVE_BUTTONS: Record<InternalStatus, ButtonCode[]> = {
  FORM_PENDING:              ["B01"],
  FORM_RECEIVED:             ["B02","B04","B05","B08","B10"],
  IN_PROCESSING:             ["B02","B04","B05","B08","B10"],   // alias of Form Submitted
  TECHNICAL_HOLD_EXTERNAL:   ["B03"],
  TECHNICAL_HOLD_INTERNAL:   ["B03"],
  // After B04 pressed → post-B04 state
  SUBMITTED_TO_GOVT:         ["B08","B09"],           // B04
  AWAITING_GOVT_APPROVAL:    ["B06","B07","B08","B09","B10"],  // B05
  CHECKING_STATUS:           ["B07","B08","B09","B10"],        // B06
  POST_WAIT_SUBMITTED:       ["B08","B09"],           // B07 (new sub-status)
  CUSTOMER_HOLD:             [...B10_RESUME_SET],     // B10 — see config flag
  COMPLETED:                 [],                     // B08 terminal
  CLOSED:                    [],                     // B09 terminal
};
```

**Config flag for the unresolved B10 case:**

```ts
// Flip once product confirms which variant is correct.
export const B10_RESUME_INCLUDES_B09 = false; // false → …,"B10"; true → …,"B09"
export const B10_RESUME_SET: ButtonCode[] =
  ["B02","B04","B05","B08", B10_RESUME_INCLUDES_B09 ? "B09" : "B10"];
```

**Always-visible buttons** (independent of state, appended by the renderer, hidden only on terminal):

- `BX_CLOSE` — "Order Closed — Select Reason Manually" → E004 (Category A picker), calls existing `forceCloseOrder`.
- `BX_REOPEN` — "Reopen / Restart Order" → email TBD (flagged), calls new `reopenOrder` server fn. Visible on `COMPLETED` / `CLOSED` only.

**Wiring each B-code to existing server fns** (no new business logic where possible):

| Code | Server fn |
|------|-----------|
| B01 | `markFormPending` (already arms 8h auto-close + E002) |
| B02 | `startTechnicalHold({kind:"external"})` (E003 + reason B + reminder) |
| B03 | `resumeFromHold` (already fires E011 for external tech hold) |
| B04 | `markSubmittedToGovt` (E005) |
| B05 | `markAwaitingGovt` (E006 + reminder) — extend to also send E006 to customer |
| B06 | new thin wrapper `logStatusCheck` → transitions to `CHECKING_STATUS`, sends E006, arms reminder |
| B07 | `markSubmittedToGovt` re-fire (E005) from post-wait state |
| B08 | `completeWithCertificate` (E007, terminal COMPLETED) |
| B09 | `handleGovtRejected` (E008, terminal CLOSED, reason B) |
| B10 | `startCustomerHold` (E004 + reason A + 8h auto-close) — add if missing in `hold-actions.functions.ts` |
| BX_CLOSE | `forceCloseOrder` (E004 manual, reason A) |
| BX_REOPEN | new `reopenOrder` in `close-actions.functions.ts` |

### Removed / superseded

- `STATUS_ACTIONS` map in `src/lib/orders/order-actions-map.ts` — kept for legacy `EmployeeActionPanel` but the workspace journey no longer reads it.
- `JOURNEY_BRANCHES` in `src/lib/orders/journey-map.ts` — retained for read-only labelling; the new UI reads button visibility only from `NEXT_ACTIVE_BUTTONS`.

---

## Part 2 — Journey UI (new components, not in-place edits)

Explicit non-goal: I will **not** edit `CustomerJourneyMap.tsx` or `TicketPanel.tsx` in place. Both are replaced.

### New file: `src/components/admin/workspace/OrderJourneyBoardV2.tsx`

Single flowchart-style panel that shows the full happy path AND the delay/hold/closed branches together on one canvas.

- Reads `NEXT_ACTIVE_BUTTONS[currentStatus]` → renders only those buttons enabled; the rest render greyed/hidden.
- Current stage highlighted; on a hold branch (B02→TECH_HOLD or B10→CUSTOMER_HOLD), draws the divergence arrow from `FORM_SUBMITTED` and shows the selected reason chip.
- Two always-visible buttons pinned bottom-right: `BX_CLOSE`, `BX_REOPEN` (reopen disabled unless terminal).
- Live updates: mutations invalidate `useOrderWorkflow` query key — no page reload.
- Reason picker + reminder picker reuse existing `ReasonPicker` / `ReminderCadencePicker`.

### New file: `src/components/admin/workspace/OrderTicketPanelV2.tsx`

Rebuilt ticket panel, one-ticket-per-order.
- 5 close variants surfaced as explicit buttons: T001-Normal, T001-Restart, T001-Consultation, T002-Reply-w/-Reason (8h auto-close), Force-Close.
- Reason picker inline for T002 and Force-Close (Category A).
- Reuses existing `ticket-actions.functions.ts` server fns.

### Modified: `src/components/admin/workspace/WorkspaceShell.tsx`

Swap `<CustomerJourneyMap>` → `<OrderJourneyBoardV2>` and `<TicketPanel>` → `<OrderTicketPanelV2>`. Old files stay on disk for one release so nothing else breaks, but are no longer imported.

---

## Part 3 — E011 verification

- Confirm the E011 row was actually inserted by last turn's migration (`select code from email_templates where code = 'E011'`). If missing, ship a small idempotent migration.
- B03 handler (`resumeFromHold`) already sends E011 with `{{resolved_at}}` — no change needed there, just surface it as B03 in the new UI.

---

## Files — planned changes

**Create (5):**
- `src/lib/orders/button-state-machine.ts`
- `src/components/admin/workspace/OrderJourneyBoardV2.tsx`
- `src/components/admin/workspace/OrderTicketPanelV2.tsx`
- `src/lib/orders/actions/reopen-actions.functions.ts` (`reopenOrder`, `logStatusCheck`)
- (conditional) `supabase/migrations/<ts>_ensure_e011_template.sql`

**Modify (3):**
- `src/components/admin/workspace/WorkspaceShell.tsx` — swap components
- `src/lib/orders/actions/hold-actions.functions.ts` — add `startCustomerHold` if not present; ensure B03 path clean
- `src/lib/orders/actions/index.ts` — export the new server fns

**Untouched (explicit):**
- `src/components/admin/workspace/CustomerJourneyMap.tsx`
- `src/components/admin/workspace/TicketPanel.tsx`
- `src/components/admin/ProcessTracker.tsx`
- All existing email templates E001–E010

---

## After build — I will re-print the file list

Same 5 create / 3 modify list above, marked with what actually changed, so you can diff against last round's "nothing visibly moved".

## Open question (blocking config default only, not the build)

`B10_RESUME_INCLUDES_B09` — defaulting to `false` (B10 self-loop). Flip the constant once you confirm. Say the word if you want the default flipped to `true` (B09) before I start.
