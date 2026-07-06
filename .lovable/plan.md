## What I found

- There are **53 email templates** now; only **12 are the intended BHS lifecycle templates**, so duplicates/old cancellation/onboarding/admin templates are still present.
- There are **two delay-reason systems**:
  - Order action panel uses one reason table with `customer_side` / `our_side` categories.
  - Workflow engine uses another reason table with `customer` / `internal` sides and its own editable settings screen.
- Customer support inbound polling is active, but the current matcher is too strict:
  - It only creates a ticket when it can match the inbound email to an existing ticket thread or an open order.
  - Your recent inbound emails are being stored as **no-match quarantine records**, not converted into tickets.

## Current messy journey map

```text
Payment success
├─ PayU webhook updates payment/order
├─ Should send E001 order confirmation
└─ Some old/payment_success/welcome mappings still exist in old flows

Manual form link
└─ Employee clicks Send Form Link → E002

Customer-side delay
├─ Employee selects reason in Action Panel → E003
├─ Starts customer auto-close scheduler
└─ Scheduler currently still has old 24h labels in places; target is 8 business hours → E004

Our-side delay
├─ Employee selects internal/our-side reason
└─ Should NOT send customer delay email automatically

Order processing
├─ Submitted to government → E012
├─ Completed → E006
└─ Feedback follow-up scheduler → E007

Refund
└─ Refund processed → E011

Support
├─ Staff closes ticket with reply → E008
├─ Staff closes final → E009
├─ Ticket auto-close scheduler → E010
└─ Customer inbound email replies are currently landing in quarantine when no exact match is found
```

## Target clean journey map

```text
ORDER PAID
└─ E001 AUTO: Order confirmation / payment received
   └─ Stage: NEW_ORDER

EMPLOYEE SENDS FORM LINK
└─ E002 MANUAL ONLY: Form/information link
   └─ Stage: WAITING_CUSTOMER_INFO / form pending

FORM PENDING OR CUSTOMER-SIDE DELAY
└─ Employee chooses Customer-side delay reason
   ├─ Reason block auto-filled from editable customer-side reason library
   ├─ E003 AUTO: Customer-side delay notice
   └─ 8 business-hour timer starts
      ├─ Customer replies → support ticket created/updated, timer paused/cancelled
      └─ No reply after 8 business hours → E004 AUTO: closure confirmation

OUR-SIDE DELAY
└─ Employee chooses Our-side delay reason
   ├─ Reason block auto-filled from editable our-side reason library
   └─ No customer delay email unless a separate manual action is used

FULFILLMENT
├─ Employee marks Submitted to Govt → E012 AUTO
├─ Employee marks Completed → E006 AUTO
└─ Post-completion feedback timer → E007 AUTO

REFUND
└─ Refund processed → E011 AUTO

SUPPORT
├─ Customer replies to any known email/order/customer thread → ticket created/updated
├─ Staff closes with response → E008 AUTO
├─ Staff closes final/no action needed → E009 AUTO
└─ No customer reply after staff response → E010 AUTO
```

## Implementation plan

1. **Keep only the 12 BHS templates**
   - Delete every email template except:
     `order_confirmation`, `welcome_and_form_link`, `bhs_e003_customer_delay`, `order_closure_confirmation`, `bhs_e005_manual_reminder`, `order_completed`, `bhs_e007_feedback`, `support_ticket_closed`, `support_ticket_closed_final`, `bhs_e010_ticket_autoclose`, `refund_processed_confirmation`, `bhs_e012_submitted_to_govt`.
   - Set dispatch modes:
     - Manual only: **E002**, **E005**
     - Auto: **E001, E003, E004, E006, E007, E008, E009, E010, E011, E012**
   - Remove old duplicate mappings/actions that reference deleted templates.

2. **Fix E002 automation rule**
   - Ensure E002 is never sent automatically after payment.
   - Keep it only on employee “Send / Resend Form Link”.

3. **Unify and separate delay reasons**
   - Make one editable admin reason library for:
     - Customer-side delay reasons
     - Our-side/internal delay reasons
   - Update the UI so these are shown separately.
   - When a reason is selected, automatically fill the email/template reason block from the saved reason description/label.
   - Keep “Other” reasons editable and requiring remarks.

4. **Fix customer-side delay timing**
   - E003 sends when employee puts order into customer-side delay/form pending.
   - E004 sends after **8 business hours** with no customer reply.
   - Update stale labels/comments/messages that still say 24 hours for this customer-delay flow.

5. **Repair inbound support ticket creation**
   - Keep the Zoho inbox polling route, but make matching more forgiving:
     - Match by ticket number in subject.
     - Match by email thread headers when available.
     - Match by outgoing order/customer headers when available.
     - Fallback match by sender email to customer/lead/order.
   - If the customer is known but no order match exists, still create a support ticket instead of only quarantining.
   - When a customer replies, create/append `ticket_replies`, reopen/update the ticket, and cancel/pause relevant no-reply timers.

6. **Process existing quarantined replies**
   - Re-run matching for current `no_match` inbound records.
   - Convert safely matched records into tickets/replies so previous customer replies are not lost.

7. **Validate after implementation**
   - Confirm database has exactly 12 email templates.
   - Confirm reasons are split and editable.
   - Confirm E002 is manual-only.
   - Confirm E003 → 8 business hours → E004 behavior.
   - Confirm inbound replies now create or update support tickets instead of remaining as `no_match`.