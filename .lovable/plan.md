
## 1. Reply-To — route replies into the support inbox

Currently outbound uses `help@businesshelpservices.com` as From but `noreply.mail.businesshelpservices.in` as Reply-To, so customer replies vanish. Fix:

- Update the single `smtp_settings` row so `reply_to = 'help@businesshelpservices.com'` (the same monitored Zoho mailbox the inbox poller reads via `zoho-inbox.server.ts` / `inbox-matcher.server.ts`). This makes every outgoing email — templates, manual sends, delay notices — thread back into the support inbox where tickets are auto-created.
- In `src/routes/admin.emails.tsx`, add an inline hint under the Reply-To field: "Must be the mailbox connected to the Zoho poller — replies here become support tickets."
- No code change to `emails.server.ts` needed; it already reads `settings.reply_to`.

## 2. Delay reasons — mark each row as customer-side or internal-side

The workflow currently uses a hard-coded `DENIED_CLOSURE_REASONS` set inside `setExternalDelay` to decide flow. Replace with a real column on `workflow_delay_reasons`.

Migration:
- Add `side text NOT NULL DEFAULT 'customer' CHECK (side IN ('customer','internal'))` to `workflow_delay_reasons`.
- Add `email_template_code text` (optional per-reason override — otherwise defaults per side).
- Backfill:
  - `side='customer'` for: `government_platform_assumption`, `change_of_mind`, `user_does_not_wish_to_proceed`, `otp_not_provided`, `change_in_service_requirement`, `incorrect_information`, `documents_missing`, `customer_non_responsive`, `eligibility_issue`, `service_already_started`.
  - `side='internal'` for: `government_portal_down`, `portal_maintenance`, `payment_gateway_issue`, `system_outage`, `pending_govt_response`, anything technical. Seed missing internal rows if absent.

## 3. ExternalDelayDialog — separate the two flows in the UI

`src/components/admin/ExternalDelayDialog.tsx`:
- Replace the free `kind` dropdown with two tabs / segmented control: **Customer-side delay** and **Our-side delay (internal)**.
- The reason `<select>` filters by the selected side (using the new `side` column from `listDelayReasons`).
- Panel copy changes per side:
  - Customer: "Customer will get the delay notice now. Order auto-closes after 8 business hours if no reply. You can resume anytime."
  - Internal: "No email will go to the customer. Assignee is notified now; a follow-up reminder is scheduled. Order status stays in-progress."
- `kind` sent to server is derived: customer → `external_dependency`, internal → `government_portal_pending`.

Extend `listDelayReasons` in `src/lib/crm/workflow.functions.ts` to return `side` and `email_template_code`.

## 4. setExternalDelay — branch on reason.side

Rewrite the tail of `setExternalDelay` in `src/lib/crm/workflow.functions.ts`:

**Customer-side branch** (`reason.side === 'customer'`):
1. Send `bhs_e003_customer_delay` (E003) immediately to the customer with `{reason_block}`, `{customer_note}`, order vars. (User asked for the "1st intimation with reason block" — E003 is that template.)
2. Schedule ONE `workflow_reminders` row: `kind='pending_closure_followup'`, `template_code='order_closure_confirmation'` (E004), `due_at = addBusinessSeconds(now, 8*3600, businessHoursConfig)` — 8 **business** hours, not calendar. Import `addBusinessSeconds` from `src/lib/scheduling/business-hours.ts` and load the config from `business_hours_config`.
3. Set `applications.workflow_status = 'pending_customer_response'` (existing enum value already used by pending-closure flow).
4. Existing cron `workflow-reminders.ts` already handles `pending_closure_followup` → sends E004 + auto-closes. Keep as-is.
5. `resumeOrder` already cancels pending reminders and clears the delay — this becomes the "resume service" path. Add a customer email `service_processing_update` on resume so customer knows work restarted.

**Internal-side branch** (`reason.side === 'internal'`):
1. **Do NOT enqueue any customer email.**
2. Timeline event stays (internal only).
3. Schedule a `workflow_reminders` row `kind='internal_review'`, `template_code=null`, `due_at = expectedReviewAt` (or +24h if not set), `assigned_to = lead.assigned_to`. When it fires, `workflow-reminders.ts` sees `template_code=null` and skips email — but we add a `notifications` insert for the assignee ("Internal delay review due — {reason_label}"). Add that branch inside the cron loop guarded by `r.kind === 'internal_review'`.
4. No 3/5/7-day cadence, no closure follow-up.
5. Application status → `government_portal_pending` (existing).

Remove the hard-coded `DENIED_CLOSURE_REASONS` set; drive everything from `reason.side`.

## 5. Small supporting changes

- `workflow-reminders.ts`: add handling for `kind='internal_review'` (insert notification, no email, no auto-close).
- Optional `email_template_code` on the reason row overrides the default template for the customer branch (so admins can pick any of the 12 templates per reason from the Reason Library).
- `ReasonLibraryTab.tsx`: add Side (Customer/Internal) selector and Email Template dropdown when editing a reason.

## Files touched

- `src/routes/admin.emails.tsx` (hint text)
- Migration: `workflow_delay_reasons.side`, `email_template_code`; backfill; update `smtp_settings.reply_to`
- `src/lib/crm/workflow.functions.ts` — `listDelayReasons` returns side/tpl; `setExternalDelay` branches on side; `resumeOrder` sends resume email
- `src/components/admin/ExternalDelayDialog.tsx` — tabbed UI, filtered reasons
- `src/components/admin/ReasonLibraryTab.tsx` — Side + Template fields
- `src/routes/api/public/cron/workflow-reminders.ts` — `internal_review` branch
- `src/lib/scheduling/business-hours.ts` — reuse `addBusinessSeconds`

## Out of scope

- No changes to existing 12 templates' copy.
- No changes to Zoho inbox poller / ticket auto-creation (it already keys off Reply-To once fixed).
- Cancellation closure workflow (`closure-workflow.ts`) is unchanged.
