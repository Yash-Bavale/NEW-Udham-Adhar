## Phase 4 — Email Automation

### 1. Seed 10 new templates (migration via insert tool)
INSERT the 10 codes from the prompt into `email_templates` with `ON CONFLICT (code) DO UPDATE` so existing rows refresh. Set `is_enabled = true`, `is_system = true`, `variables` array populated from each template's placeholders, `body_text` derived from `body_html` plain text.

Codes: `order_confirmation`, `welcome_and_form_link`, `docs_required_reminder`, `service_started_notification`, `order_completed`, `customer_uninterested_reason_request`, `refund_processed_confirmation`, `refund_rejected_notice`, `complaint_filed`, `ticket_created`.

### 2. New page `/admin/email-templates`
Dedicated route (separate from the combined `/admin/emails` tabs). Columns: Code | Name | Subject | Last Updated | Preview | Edit.

- **Preview** opens a dialog rendering `body_html` with `previewData` substituted via existing `renderTemplate`.
- **Edit** opens drawer/dialog:
  - Code (read-only)
  - Name (editable)
  - Subject (editable)
  - Body HTML textarea (monospace, full height)
  - **Variable reference sidebar**: chip-list of `{{customer_name}}`, `{{order_number}}`, `{{service_name}}`, `{{invoice_url}}`, `{{document_checklist}}`, `{{complaint_number}}`, `{{refund_amount}}`, `{{refund_reason}}`, `{{rejection_reason}}`, `{{executive_name}}`, `{{followup_date}}` — click-to-insert at caret.
- Save calls existing `saveEmailTemplate` server fn.
- Add sidebar nav link "Email Templates" in `AdminShell`.

### 3. Queue worker — log to `application_events`
Extend `processQueueInternal` in `src/lib/emails/emails.server.ts`: on successful send, when `row.application_id` is set, also INSERT into `application_events`:
```
event_type = 'email_sent'
new_value  = row.template_code
staff_name = 'System', staff_role = 'system'
```
(No new edge function — existing pg_cron `/api/public/cron/process-emails` already runs the worker every minute. Mention this to user in summary so they don't expect a new edge function.)

### 4. Out of scope (already exists)
- Variable substitution (`renderTemplate`) — already implemented.
- `email_logs` writes with template_code/recipient/status/error — already done.
- SMTP/Lovable email sender — already wired via `@lovable.dev/email-js`.
- Triggering enqueue from order/payment/refund/complaint events — wired in Phases 1-3 via `enqueueFromTemplateInternal`. Phase 4 only ensures the templates exist by those codes.

### 5. Files
- **New**: `src/routes/admin.email-templates.tsx`, `src/components/admin/EmailTemplateEditor.tsx`, `src/components/admin/EmailTemplatePreviewDialog.tsx`
- **Edit**: `src/lib/emails/emails.server.ts` (add application_events insert), `src/components/admin/AdminShell.tsx` (nav link), `src/routeTree.gen.ts`
- **Data**: one `supabase--insert` call seeding the 10 templates

### Order of work
1. Seed templates (insert tool)
2. Build editor + preview components
3. Build `/admin/email-templates` route
4. Patch worker to log `email_sent` event
5. Add nav link
