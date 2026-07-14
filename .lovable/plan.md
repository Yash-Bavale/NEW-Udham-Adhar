## Customer Journey Map — final polish

### 1. Add a true "Order Closed" terminal node (parallel to "Completed")

Right now every closure sub-branch visually points back toward the "Completed" (green flag) node, which is wrong. Add an **8th terminal node** ("Order Closed", rose circle with `XCircle` icon) placed **below** the "Completed" node on the far right, at approx `(NODE_X[6], SUB2_Y)`.

Rewire connectors so:
- Force Close (E010) → Order Closed node
- Customer Side Delay → Order Closed node
- Application Rejected (E008) → Order Closed node
- "Order Closed with Selected Reason" card becomes a badge that sits on top of / feeds into the Order Closed node (or is merged into it).

The main horizontal line stops at "Completed". Closure is a distinct branch that terminates at "Order Closed". Node state logic updates so when `closed === true`:
- The "Completed" node becomes `upcoming/blocked` (grey/muted), not `current`
- The "Order Closed" node becomes `current` (rose ring)

### 2. Consistent color code across main + sub stages

Lock a single legend and reuse it everywhere (circles, sub-cards, connectors, tooltips, badges, bottom legend):

| Meaning | Color | Where |
|---|---|---|
| Done | emerald-500 | past main nodes, completed outcome |
| Current / Active | indigo-500 | current main node + any live sub-card |
| Upcoming | sky-400 | future main nodes, idle sub-cards |
| Delay (customer OR technical) | amber-500 | delay sub-cards + their connectors |
| Closure / Blocked | rose-500 | Force Close, Rejected, Order Closed |
| Talk-to-Expert optional | violet-500 | only that card |

Sub-cards drop the `teal` and `sky` tones for delays and use `amber` uniformly (with a chip that says "Customer" vs "Technical") so the color instantly conveys "this is a delay branch", regardless of type. Idle sub-cards get `opacity-70` + slate-300 border instead of colored borders, so only the live one lights up.

### 3. Current-stage indicator with sub-state

Add a prominent **status pill** in the header next to "Current Stage:" that shows the sub-state, not just the main stage. Example values:

- `Order Received · Form Not Submitted`
- `Form Submitted · Technical Delay (B3)`
- `Form Submitted · Customer Delay (A2)`
- `Application Submitted to Govt · Awaiting Response`
- `Order Closed · Force Closed (A7)`

Derived from `stage + workflowStatus + closureStage + closureReasonLabel`. Also render the same sub-state as a small chip on the currently-active main node itself, so you don't need to scan the whole chart.

### 4. Automatic branch mapping (already partly done — tighten)

Extend `getActiveDelayBranchKey` in `src/lib/orders/journey-map.ts` into a single `deriveJourneyLiveState(props)` helper that returns:

```ts
{
  currentMainIndex: number,
  activeSubKey: "form-not-submitted" | "technical-delay" | "customer-delay" | "govt-awaiting" | "govt-rejected" | "force-closed" | null,
  terminal: "completed" | "closed" | null,
  reasonCode: string | null,   // e.g. "A7", "B3"
  closureCountdownAt: string | null,
}
```

`CustomerJourneyMap` calls this once and every node/connector/pill reads from it. This is what makes the "always visible, correct one lights up" behaviour reliable across stage/status/closure combinations.

### 5. Countdowns + auto-close labels on the branches themselves

- On **Form Not Submitted** card: replace static "Auto-closed in 8 hrs" with a live countdown pulled from `useOrderWorkflow().view.nextTimer` when kind matches `form_pending_autoclose_8h` (e.g. "Auto-closes in 6h 12m"). Show the E002 chip. If timer is armed, add a small amber pill "E002 armed · Reason A7".
- On **Customer Side Delay** card: same treatment for `customer_hold_reminder` / auto-close (8h) — show remaining time + reason code (A-x) once picked.
- On **Force Close (E010)** card: show "E010 · A-reason" chip; disabled with tooltip "Already closed" when `closed`.
- On **Order Closed** terminal node: show the exact closure reason label + when it fired (`relativeIST(closure timestamp)`).

Countdowns re-use existing `useOrderWorkflow` timers — no new fetch.

### 6. Hover / click tooltips on connectors + nodes

Wrap every SVG connector `<path>` / `<line>` in a `<g>` with a `<title>` element (native SVG tooltip, zero deps) explaining the rule that triggered it. Examples:

- Order Received → Form Not Submitted: "Triggered when payment received but no form submission after N minutes."
- Form Submitted → Technical Delay: "Employee logged a Category B (technical/govt) delay."
- Form Submitted → Customer Delay: "Employee logged a Category A (customer-side) delay — 8h auto-close armed."
- Final Status → Rejected: "Govt portal returned rejection. E008 sent, order closed."
- Completed → Order Closed (if closed): "Force closed by operator or by auto-close timer."

Same for main nodes and sub-cards (wrap in a div with `title=` attribute, plus a shadcn `Tooltip` for richer content: rule name, event that flipped it, timestamp).

### 7. Backend transition guard

Add a single server-side validator so illegal moves are rejected consistently across all the button paths (E002/E003/E004/E005/E006/E007/E008/E010, T001/T002):

- New file: `src/lib/workflow/transition-guard.server.ts` exporting `assertTransitionAllowed({ from: { stage, workflowStatus, closureStage }, action })`.
- Rules encoded from the flow chart:
  - `send_form_link` (E002) only from `order_received`/`payment_done` and only when form not yet submitted; blocked when closed.
  - `technical_delay` / `customer_delay` only after `form_submitted`; not both simultaneously — new one cancels prior.
  - `submit_to_govt` (E005) only from `form_submitted` (or `verification`), and requires no active customer/technical hold.
  - `complete_with_cert` (E007) only from `app_submitted` / `check_status`.
  - `application_rejected` (E008) only from `app_submitted` / `check_status`.
  - `force_close` (E010) allowed from any non-closed stage; requires Cat A reason.
  - Any action rejected with 409 if `closureStage` is already a terminal closed value.
- Call this guard at the top of every action handler in:
  - `src/lib/orders/order-actions.functions.ts` (sendFormLink, markSubmittedToGovt, sendManualReminder, completeOrder)
  - `src/lib/orders/actions/close-actions.functions.ts` (closeOrderSystem, handleGovtRejected)
  - `src/lib/orders/actions/hold-actions.functions.ts` (all 5 hold actions)
- Emit a typed error message the UI already surfaces via `toast.error`.
- Also make each action write a `WorkflowEvent` (types already exist in `src/lib/workflow/events.ts`) so the timeline stays in sync — no drift between "stage says X, buttons say Y".

### 8. Files touched

- `src/components/admin/workspace/CustomerJourneyMap.tsx` — new Order Closed node, connectors, color pass, countdowns, tooltips, status pill.
- `src/lib/orders/journey-map.ts` — `deriveJourneyLiveState` helper + reason-code parsing.
- `src/lib/workflow/transition-guard.server.ts` — NEW guard module.
- `src/lib/orders/order-actions.functions.ts` — call guard.
- `src/lib/orders/actions/close-actions.functions.ts` — call guard.
- `src/lib/orders/actions/hold-actions.functions.ts` — call guard.

### 9. Out of scope (kept as-is)

- The 14-reason list, email templates, ticket flow, and timer executor are unchanged.
- No new DB migrations — guard runs in TS against existing columns.
- No layout change to the 7 main stages; only the closure endpoint is added.
