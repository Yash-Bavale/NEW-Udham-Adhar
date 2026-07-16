## Plan

1. **Correct the four support action buttons**
   - **Normal / No Action**: close the ticket instantly only. Do not send T001.
   - **Restart Order**: move the linked order directly to **FORM_RECEIVED / form completed**, resume the workflow, cancel/pause cleanup as needed, and close the ticket instantly. Do not send T001 unless explicitly needed later.
   - **Consultation / Support Done**: send **T001** with full placeholders, then close the ticket instantly.
   - **Reply w/ Reason (8h auto-close)**: send **T002** with the selected reason block + reply body, keep ticket waiting for customer, and arm the 8-business-hour auto-close.

2. **Make email delivery honest and visible**
   - Change ticket action functions so they require immediate email success for customer-facing sends.
   - If email fails, show a real error instead of “sent”.
   - Mark the `ticket_replies` row with `emailed_at`, `email_message_id`, and related log info when sending succeeds, so the chat timeline reflects actual delivery.

3. **Fix normal chat-box replies not reaching customers**
   - Apply the same “require send success + update reply delivery metadata” behavior to the standard composer reply flow.
   - Keep internal notes as staff-only with no email.

4. **Map support tickets to orders and pause/resume timelines correctly**
   - Preserve/use `application_id` on ticket actions.
   - When a customer-delay scheduler is paused by a ticket, resolve/restart/consultation-close should dispatch the workflow close/resume event and resume paused customer-delay timers where appropriate.
   - T002 should keep the ticket/order waiting, and the customer delay should remain paused until the ticket closes or the customer replies.

5. **Update UI copy and modals to match behavior**
   - Remove “Sends T001” from Normal / Restart copy.
   - Restart modal becomes “move order to Form Completed and close ticket” with no destination dropdown.
   - Success toasts distinguish actual emailed vs closed-only actions.

6. **Validate**
   - Check the changed server functions for type/syntax issues.
   - Verify button mutations and composer reply handling match the requested workflow.