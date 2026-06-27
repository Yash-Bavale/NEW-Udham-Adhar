## Final design — Order Status panel

### 1. Simpler wording (drop "Advance to")
Use the verb the team already says out loud:

- Primary CTA: **"Mark as {Next Stage} →"** (e.g. "Mark as Application Submitted →")
- Helper line: "Next step in this order."
- Lane chip: keep "Happy Path / External Delay / Cancellation" — short and clear.

For the completed step the CTA reads **"Mark as Completed →"** and still opens the Completion Gate dialog.

### 2. Add a Revert option (the missing piece)
Backward moves are real — wrong button taps, premature status updates, customer asked to redo docs. Senior PM call: surface it, don't hide it.

**UI** — to the right of the primary button:
```
[ Mark as Application Submitted → ]   [ ↶ Revert to Documents Received ]
```
- Shown only when there is a previous stage (i.e. current ≠ first stage).
- Secondary visual weight (outline button, slate), so it never competes with the forward action.
- Click opens a small confirm dialog: "Revert this order back to {previous}? A note will be added to the activity log." with an optional reason textarea.
- Permission: any staff can revert one step backward; the action is always logged with actor name + reason.

**Backend** — extend `updateFulfillmentStatus`:
- Add an optional `allowBackward: boolean` flag in the input schema.
- When `true`, accept a transition to the immediately previous stage in `FULFILLMENT_STAGES` (one step only — no jumping multiple stages back, no reverting from `completed`, no reverting once `cancelled`).
- Always write a `status_change` event with `note` = the revert reason so it shows up in the timeline.

No DB migration needed — `fulfillment_status` already accepts every stage value; the only gate is the server-side transitions map.

### 3. Final Order Status card layout

```
ORDER STATUS
[ Verification Pending ]   ● Happy Path
─────────────────────────────────────────────────────────
[ Mark as Application Submitted → ]   [ ↶ Revert to Documents Received ]
Next step in this order.
```

- Delay lane: unchanged (Customer Replied / Resume Order / Close Order).
- Cancellation lane: unchanged (renders `CancellationPanel`).
- Stage Map, Pause/Cancel card, and collapsible Timeline & reminders: unchanged.

### Files
- `src/lib/crm/orders-v2.functions.ts` — extend `updateFulfillmentStatus` to allow a single-step backward move with reason logging.
- `src/components/admin/workspace/OrderWorkflowPanel.tsx` — rename CTA to "Mark as …", add the Revert button + confirm dialog, wire to the server fn.

### Result
One forward verb everyone understands, an explicit one-click way back, the rest of the panel unchanged. No clutter, no hidden dropdown, no inprofessional dead-ends.