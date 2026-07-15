
## Goal

Rebuild `CustomerJourneyMap` so every branch of the flow chart renders as its own visible lane below the straight 7-node happy path — no overlaps, no stacked cards. At a glance an operator sees: current main stage, which sub-path is live, its countdown / paused state, and only the B-buttons that are valid right now per the exact transition table below.

## Locked button-gating table (from user)

| # | Current phase | Active buttons |
|---|---|---|
| 1 | Form Not Submitted | **B01** |
| 2 | Form Submitted (fresh) | **B02, B04, B05, B08, B10** |
| 3 | After B01 pressed | *none* until status flips to Form Submitted |
| 4 | After B02 pressed (Technical Delay) | **B03** |
| 5 | After B04 pressed (Consultation done → Govt) | **B08, B09** |
| 6 | After B05 pressed (Submitted, awaiting govt) | **B06, B07, B08, B09, B10** |
| 7 | After B06 pressed (Status checked, awaiting response) | **B07, B08, B09, B10** |
| 8 | After B07 pressed (Consultation done post-wait) | **B08, B09** |
| 9 | After B08 pressed (Accepted) | *none — terminal Completed* |
| 10 | After B09 pressed (Rejected) | *none — terminal Closed* |
| 11 | After B10 pressed (Customer Side Delay) | **B02, B04, B05, B08, B09** |

Encoded in `src/lib/orders/journey-map.ts` as `PHASE_ENABLED_BUTTONS`. `POST_B10_ALLOWED` becomes hard-set to `["B02","B04","B05","B08","B09"]` (removes the previous FIXME).

Phases mapped from state:
- `form_not_submitted` → row 1
- `form_submitted` (no B-press yet on Form) → row 2
- `form_link_sent` (B01 pressed, still not submitted) → row 3
- `technical_delay` (B02 pressed) → row 4
- `consultation_submitted` (B04 pressed) → row 5
- `awaiting_govt` (B05 pressed) → row 6
- `status_checked` (B06 pressed) → row 7
- `post_wait_submitted` (B07 pressed) → row 8
- `completed` (B08) → row 9
- `closed` (B09 or auto-close) → row 10
- `customer_delay` (B10 pressed) → row 11

`derivePhase()` reads: stage, workflowStatus, closureStage, workflow_events (count of B01/B02/B04/B05/B06/B07/B10 dispatched), plus `hasOpenTicket` for the paused-lane variant.

## Layout — one lane per branch, always visible

```text
Lead ─ Payment ─ Order ─ Form ─ Govt Portal ─ Final Status ─ Completed
                   │       │         │             │
                   │       │         │             └─ Lane E (Final)    B06-again / B07 / B08 / B09 / B10
                   │       │         └─ Lane D (Govt submitted)  B04 · B05
                   │       ├─ Lane B (Technical delay)  B02 → B03
                   │       └─ Lane C (Customer-side delay)  B10 → 8h close
                   │             └─ Lane C-ticket (paused, ticket open)  T001×3 / T002
                   └─ Lane A (Form not submitted)  B01 → 8h close  → Order Closed (E010)
```

Each lane = fixed row under its parent main node. Idle lanes render muted (dashed grey rail); the live lane per `derivePhase()` lights up (colored solid rail, glowing parent node, animated arrowhead). Terminal **Order Closed** sits below the tree with red converging arrows from Lane A, Lane C, and Lane E's B09 branch.

## Lane strips

Each lane is a horizontal strip with three slots:

1. **Status chip** — icon + short label ("Waiting for form", "Technical delay · <reason>", "Customer delay — ticket open", "Awaiting govt · reminder set", …).
2. **Countdown / meta chip** — `CountdownChip` for 8h auto-close (Lanes A and C), "Paused — ticket open" when a ticket freezes Lane C, "Reminder <time>" for Lane D · B05 / Lane E · B06.
3. **Action buttons** — only phase-enabled B-codes rendered via existing `JourneyActionButton`. Sent/consumed buttons show a check tick and stay disabled. Buttons not in the phase render greyed with tooltip "Not available in current phase".

### Lane A — Form Not Submitted (parent: Order Received)
- Icon `FileWarning`, red rail. Chip: "Waiting for form • auto-close in HH:MM:SS".
- **B01 → E002**. Post-send: button ticked-disabled; rail solid red; arrow drops into Order Closed if 8h expires (auto-fires E010). No other buttons active until customer actually submits the form (row 3).

### Lane B — Technical / External Delay (parent: Form Submitted)
- Icon `Wrench`, sky rail. Chip: "Technical delay · <B-cat reason>".
- **B02 → E003** (pick B-cat reason). After press: B02 ticked; **B03 → E011** becomes the only active button (row 4). B03 press → rail turns emerald, arrow to Govt Portal node, phase returns to `form_submitted`-style row 2 minus B02.

### Lane C — Customer-Side Delay (parent: Form Submitted)
- Icon `UserX`, amber → red rail. Chip: "Customer delay <A-cat reason> • auto-close in HH:MM:SS".
- **B10 → E004** (pick A-cat reason). After press: countdown visible; active buttons flip to row 11 (B02/B04/B05/B08/B09) — those live on Lane D/E as usual but the Lane C rail keeps ticking until the customer responds or the timer closes the order.

### Lane C-ticket — Ticket opened during Lane C (indented under Lane C)
- Shown only when `useRealtimeTable('support_tickets')` reports an open ticket for this order.
- Icon `LifeBuoy`, violet rail. Countdown chip flips to **"Paused — ticket open"**.
- 4 close actions (existing ticket-actions server fns):
  1. **T001 · No action** → close ticket; resume Lane C countdown.
  2. **T001 · Restart order** → close ticket; arrow jumps to Govt Portal.
  3. **T001 · Consultation done** (sends T001 template) → close ticket; arrow to Govt Portal / Completed.
  4. **T002 · Reply w/ reason** → keep ticket open 8h; auto-close; Lane C rail resumes to Order Closed.

### Lane D — After Govt Portal Submitted (parent: Govt Portal)
- Icon `Send`, violet rail. Buttons:
  - **B04 → E005** (row 2 or row 11 phases). Post-press: row 5 → only B08/B09 active on Lane E.
  - **B05 → E006 + employee reminder** (row 2 or row 11). Post-press: row 6, reminder chip renders; also permits Lane C (B10) again.

### Lane E — Final Status (parent: Check Final Status)
- Icon `ClipboardCheck`, emerald rail. Buttons per current phase:
  - Row 6: **B06, B07, B08, B09, B10**
  - Row 7 (post B06): **B07, B08, B09, B10**
  - Row 8 (post B07): **B08, B09**
- **B08 → E007** (upload PDF + note) → Completed terminal.
- **B09 → E008** (pick B-cat reason + note) → red arrow to Order Closed.
- **B06 → E006 again** → reminder chip refreshes.
- **B07 → E005 variant (post-wait)** → arrow to Completed.

## Rail / arrow rendering

- Keep the existing SVG canvas. Replace the current stacked sub-branch cards with lane-strips at fixed Y offsets under each parent node (`ROW_Y[0..4]`).
- Idle rails: `stroke-dasharray`, muted grey. Live rail: solid colored per lane tone with `<animate>` on the arrowhead.
- Terminal arrows (A, C-expiry, E·B09) converge on the single **Order Closed** node with a small badge showing which lane/reason closed it. Completed converges from Lane E · B08 (and Lane D · B04 → Lane E · B08).
- Use `framer-motion` (already installed) for the arrow-slide when a lane resolves and the current-stage highlight moves to the next main node.

## Data & state wiring

- Update `PHASE_ENABLED_BUTTONS` to match the 11 rows above exactly.
- Add new phases: `form_link_sent`, `consultation_submitted`. Extend `derivePhase()` to detect them from `workflow_events` (B-code counts) already recorded when each action fires.
- Add `hasOpenTicket` input (from `support_tickets` realtime query used by `TicketPanel`); when `activeSubKey === "customer-delay" && hasOpenTicket`, render Lane C-ticket and pause the countdown display via a new `paused` prop on `CountdownChip`.
- Server actions for ticket-close variants reuse existing handlers in `src/lib/tickets/ticket-actions.functions.ts`; add thin wrappers if any of the 4 aren't there.
- No workflow-engine core changes; no email-template changes; no DB migration.

## Files to touch

- `src/lib/orders/journey-map.ts` — rewrite `JourneyPhase`, `PHASE_ENABLED_BUTTONS`, `derivePhase()`; add `LANES` config (parent stage, tone, icon, allowed B-codes).
- `src/components/admin/workspace/CustomerJourneyMap.tsx` — full re-layout (lane strips instead of stacked cards), converging terminal arrows, motion transitions.
- `src/components/admin/workspace/CountdownChip.tsx` — add `paused` prop + "Paused — ticket open" state.
- `src/components/admin/workspace/JourneyActionButton.tsx` — add `sent` state (check tick + permanent disable) and per-lane `tone`.
- `src/lib/tickets/ticket-actions.functions.ts` — verify/add the 4 close variants (no-action / restart / consultation-done / reply-with-reason-8h).

## Out of scope

- No email template changes (E001–E011 already in place).
- No workflow engine / state-machine changes.
- No TicketPanel rework — Lane C-ticket delegates to the same server actions.
- No mobile-specific redesign; canvas keeps horizontal scroll.

## Redesign ritual (visual polish)

Before implementing, run the two-act redesign ritual on this panel: capture the current preview, ask palette / type / layout in one round of visual-choice questions, generate 3 rendered directions locked to those picks, then implement the chosen direction. The lane structure above is fixed; the ritual chooses tone, density, and rail styling.
