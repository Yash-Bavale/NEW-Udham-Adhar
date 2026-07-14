
# Unified Customer Journey Map

One component becomes the only place employees see the order's stage and act on it. Replaces `OrderJourney`, `StageJourneyStrip`, `OrderJourneyStepper`, and `OrderStageActions`.

## Visual layout (matches your HTML flowchart)

```text
Lead ─► Payment ─► Order ─► Form ─► App Submitted ─► Check Status ─► Completed
Received  Received  Received  Submitted   to Govt Portal    (Final)
  ✓         ✓         ●         ○              ○              ○           ○
                      │         │              │              │
                      │         ├─ Form Not Submitted ─► auto-close 8h (A7)
                      │         ├─ Customer Delay (E004, Cat A)
                      │         ├─ Technical Delay (E003, Cat B)
                      │         └─ Waiting for Govt (reminder)
                      │                        │
                      │                        ├─ Accepted → E007 + PDF
                      │                        ├─ Rejected → E008
                      │                        └─ Reminder → E006
                      └─ Ticket Open (pauses flow) ─► T001/T002/T003
```

Happy path on top row. Sub-paths drop below their parent stage. Current stage highlighted; past stages ticked; the live path (including which sub-branch the order is on) is drawn in accent color. All action buttons always visible and always clickable regardless of stage.

## Button → action map

| Button | Template | Reason | Effect |
|---|---|---|---|
| (auto on payment) | E001 | — | Payment confirmation, sent by webhook |
| Send Form Link / Reminder | E002 | — | Enqueue E002; start 8h auto-close armed with A7 |
| Customer-Side Delay | E004 | Cat A picker | Send E004, log delay |
| Technical Delay | E003 | Cat B picker | Send E003, log delay |
| Complete at Submission | E005 | — | Send E005, move to Completed |
| Add Reminder | E006 | — | Send E006 + create employee reminder (dashboard notif) |
| Application Accepted | E007 | — | Upload PDF cert + send E007, move to Completed |
| Application Rejected | E008 | Cat B picker | Send E008, force close via E010 |
| Talk-to-Expert Reply | E009 | — | Visible only if service=talk_to_expert |
| Force Close | E004+E010 | Cat A picker | Cancel timers + close order |
| Ticket: Normal Close | T001-normal | — | Close ticket, resume workflow |
| Ticket: Restart Order | T001-restart | — | Close ticket, resume timers |
| Ticket: Consultation Done | T001 | — | Close ticket (support completed) |
| Ticket: Reply w/ Reason | T002 | Cat A/B/C | Send reply, 8h auto-close ticket (T003) |

## Files

**New**
- `src/components/admin/workspace/CustomerJourneyMap.tsx` — the single map (happy path row + sub-branches + always-visible action rail below each node)
- `src/components/admin/workspace/JourneyActionButton.tsx` — small button with template code chip
- `src/lib/orders/journey-map.ts` — pure config: stages, branches, button definitions, service-visibility rules
- `src/lib/orders/actions/employee-reminder.functions.ts` — E006 sends email + inserts `order_reminders` row with notify_at

**Edit**
- `src/components/admin/workspace/WorkspaceShell.tsx` — replace the 3 old components with `<CustomerJourneyMap />`
- `src/lib/orders/order-actions.functions.ts` — add thin wrappers `sendE002`…`sendE009` calling `enqueueFromTemplateInternal` with the right BHS template + reason + side effects (timer arm/cancel, reminder insert)
- `src/lib/emails/bhs-templates.ts` — ensure all E001–E010 codes are exported constants

**Delete (after Shell swap)**
- `src/components/admin/OrderJourney.tsx`
- `src/components/admin/StageJourneyStrip.tsx`
- `src/components/admin/OrderJourneyStepper.tsx`
- `src/components/admin/workspace/OrderStageActions.tsx`
- `src/components/admin/workspace/StageStepper.tsx`

## Reason → standard reply → ticket

When any reason-picker button is used, the send-email server fn:
1. Reads the standard reply from `order_close_reasons.standard_reply` (already seeded from your docx).
2. Uses it as the email body (editable in dialog).
3. Calls `findOrReopenTicket` to open/reopen the single ticket for that order with the reply pre-attached as the first ticket reply.

No schema changes required — all tables (`order_close_reasons`, `support_tickets`, `ticket_replies`, `order_reminders`, `email_queue`) already exist.

## Out of scope for this pass
- Payment link button (removed as agreed)
- Any migrations (schema already supports everything)
- Redesign of dialogs — reuse existing `ReasonPicker`, `CloseOrderDialog`, `ExternalDelayDialog`

Approve and I'll build it in one shot.
