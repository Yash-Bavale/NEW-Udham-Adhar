## Goal
Wire the verbatim copy you provided into the existing Service Workflow Engine. No existing content is rewritten; new templates and reasons are added, and the External Delay / Close Order dialogs are extended to use them.

## What I'll deliver

### 1. Reason library (13 REASON_BLOCKs)
Update `workflow_delay_reasons` and `workflow_closure_reasons` so both expose the same 13 reason codes with the **full descriptive paragraph** you gave (used as `description`, which is what gets injected as `[REASON_BLOCK]` in emails). Existing codes are kept where they already match; missing ones are inserted; descriptions are upgraded to your exact wording.

Codes:
`government_platform_assumption`, `change_of_mind`, `user_does_not_wish_to_proceed`, `otp_not_provided`, `change_in_service_requirement` *(new)*, `incorrect_information` *(new)*, `documents_missing`, `customer_non_responsive`, `eligibility_issue`, `external_portal_dependency` *(new)*, `technical_interruption` *(new)*, `operational_issue`, `service_already_started`.

### 2. New email templates (verbatim copy, Zoho-style HTML + plain text)
Inserted into `email_templates` with `is_system=true`, `is_enabled=true`. Each accepts variables: `customer_name`, `order_number`, `service_name`, `reason_block`, `ticket_id`, `date`.

| Code | Subject | When it fires |
|---|---|---|
| `service_processing_update` | Service Processing Update – Order No. {{order_number}} | First email when staff marks External Delay (generic — no reason block). Replaces use of existing `workflow_external_delay_notice` only when staff picks the new "Generic processing update" option; existing template stays intact for current callers. |
| `order_pending_closure` | Update Regarding Order No. {{order_number}} | Step 1 of denied-service flow. Sent when staff opens new "Mark Pending Closure" action and picks a reason. Schedules a 24h reminder. |
| `order_closure_confirmation` | Final Update Order Closure Confirmation – Order No. {{order_number}} | Step 2 — fires from the 24h reminder if customer hasn't responded, or manually via Close Order dialog. |
| `refund_concern_response` | Regarding Your Concern for Order No. {{order_number}} | Sent when customer argues for refund (manual send from Refund/Concern action). Schedules 24h reminder. |
| `support_ticket_closed` | Ticket Closed - Order No. {{order_number}} | Final closure mail after concern flow — auto from 24h reminder or manual. |
| `refund_request_reviewed` | Regarding Your Refund Request – Order No. {{order_number}} | Sent when customer argues again after ticket closed. Schedules 24h. |
| `support_ticket_closed_final` | Ticket Closed – Order No. {{order_number}} | Final ticket closure after second argument — auto from 24h reminder. |
| `post_closure_acknowledgement` | (no subject given — uses "Re: Order No. {{order_number}}") | Sent when customer replies after final ticket closure. Manual one-click action. |

All bodies use your text **verbatim**, wrapped in the same Zoho-style HTML shell used by `order_confirmation` (navy header band, white card, footer). Header banner text shown where you specified `[HEADER IMAGE TEXT - …]`.

### 3. UI wiring (additive — no existing button changes)
- `ExternalDelayDialog`: existing 7 delay reasons stay; appended group "Denied Service Reasons" with the 13 codes. When a denied-service code is picked, the dialog title flips to "Mark Pending Closure" and sends `order_pending_closure` instead of `workflow_external_delay_notice`, and schedules a 24h reminder of type `pending_closure_followup`.
- `CloseOrderDialog`: unchanged inputs, but now sends `order_closure_confirmation` (with REASON_BLOCK) in addition to the existing `workflow_closure_notice`. *(You can disable the old one later from Email Templates console if desired — I won't touch it.)*
- New `ConcernResponseDialog` accessible from the order's "Refund / Concern" menu — triggers the 4-step concern → ticket-closed → refund-reviewed → final-ticket-closed chain with automatic 24h reminders between each step.
- New "Acknowledge post-closure reply" button on closed orders to send `post_closure_acknowledgement`.

### 4. Reminder cron handling
Extend `/api/public/cron/workflow-reminders` to handle new reminder types:
- `pending_closure_followup` → auto-send `order_closure_confirmation`
- `concern_followup` → auto-send `support_ticket_closed`
- `refund_review_followup` → auto-send `support_ticket_closed_final`

Each auto-send creates a `workflow_events` row and cancels itself, matching existing pattern.

## Verification
1. `psql` check: confirm 13 reasons present in both reason tables with full descriptions.
2. `psql` check: confirm 8 new templates inserted with non-empty `body_html`.
3. Playwright: open an order → External Delay → pick "Change of Mind" → verify `order_pending_closure` row enqueued in `email_queue` with REASON_BLOCK substituted.
4. Manually fast-forward a reminder `due_at` to past, POST cron route, verify auto-closure mail enqueued.
5. Build green.

## Out of scope
- No changes to existing template copy (`workflow_external_delay_notice`, `workflow_closure_notice`, `final-notice-before-closure` stay as-is).
- No banner-image generation in this pass — header band uses text-only ("Action Required for Your Order", etc.) styled to match the existing banner aesthetic. Say the word and I'll generate the 3 PNG banners after.
