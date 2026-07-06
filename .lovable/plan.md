## Goal

Bring the DB-backed `email_templates` into 1:1 alignment with the two source docs the user uploaded:

- `All_Mail_Draft_Template.docx` + the 12 HTML files in `Emails_Templates.zip` — the canonical **content** (subject + body) and order (SR 1-12).
- `All_Mail_Auto_Flow_System-2.docx` — the canonical **flow** (E001-E006 + which stage each email fires at).

Then reorganise the `/admin/email-templates` page so employees can navigate by **category** and see **SR numbers**.

---

## 1. Canonical template map (source of truth going forward)

| SR | Flow ID | Category | Template code (DB) | Final Subject | HTML source |
|----|---------|----------|--------------------|---------------|-------------|
| 1  | E001 | Onboarding & Payment | `order_confirmation` | `Order Confirmation & Tax Invoice – Order No. {{order_number}}` | `01-welcome-mail-tax-invoice.html` |
| 2  | E006 | Fulfillment | `order_completed` | `Your Order {{order_number}} Has Been Completed` | `02-order-completed-mail.html` |
| 3  | E002 | Onboarding & Payment | `welcome_and_form_link` | `Action Required: Submit Required Information/Documents – Order No. {{order_number}}` | `03-incomplete-information-link-mail.html` |
| 4  | E003 | Delay & Hold | `cancel-action-required` | `Action Required – Your Order is Temporarily On Hold – Order No. {{order_number}}` | `04-order-closure-intimation-customer-side-reason.html` |
| 5  | E005 | Delay & Hold | `service_processing_update` | `Update Regarding Your Order – Temporary Processing Hold – Order No. {{order_number}}` | `05-order-closure-intimation-our-side-reason.html` |
| 6  | E004 | Closure | `order_closure_confirmation` | `Order Closed – Order No. {{order_number}}` | `06-order-closure-mail.html` |
| 7  | E006-C | Consultation | `consultation_service_converted` | `Your Order {{order_number}} Has Been Completed` | `07-talk-to-expert-consultation-completed-mail.html` |
| 8  | — | Support / Tickets | `ticket_reply` | `Update Regarding Your Support Request – Ticket No. {{ticket_number}}` | `08-ticket-reply-mail-with-reason.html` |
| 9  | — | Support / Tickets | `ticket_resolved` | `Your Support Request Has Been Successfully Resolved – Ticket No. {{ticket_number}}` | `09-ticket-reply-mail-consultation-support-completed.html` |
| 10 | — | Support / Tickets | `support_ticket_closed_final` | `Your Support Ticket Has Been Closed – Ticket No. {{ticket_number}}` | `10-ticket-closed-mail.html` |
| 11 | — | Refunds | `refund_processed_confirmation` | `Refund Request Approved – Order No. {{order_number}}` | `11-refund-accepted-mail.html` |
| 12 | E-GOVT | Fulfillment | `bhs_e012_submitted_to_govt` | `Update on Your Order – Application Submitted (Order No. {{order_number}})` | `12-government-application-submitted-pending-mail.html` |

**Placeholder normalisation** applied to every HTML while migrating:

- `[Order No.]` / `[Order/Application No.]` → `{{order_number}}`
- `[Customer Name]` → `{{customer_name}}`
- `[Customer Email]` → `{{customer_email}}`
- `[Customer Mobile]` → `{{customer_mobile}}`
- `[Service Name]` → `{{service_name}}`
- `[Invoice No.]` → `{{invoice_number}}`
- `[Payment Reference No.]` → `{{payment_reference}}`
- `[DD/MM/YYYY HH:MM AM/PM]` inside Order Created → `{{order_created_at}}`; inside Payment → `{{payment_date}}`; inside Invoice → `{{invoice_date}}`; inside Consultation → `{{consultation_at}}`
- `[Ticket No.]` → `{{ticket_number}}`
- `[EMPLOYEE_REPLY_BLOCK]` → `{{employee_reply}}`
- `[EMPLOYEE_REMARKS]` → `{{employee_remarks}}`
- `[Refund Reference No.]` → `{{refund_gateway_ref}}`
- `[Amount]` / `[GST Amount]` / `[Total Amount]` → `{{service_fee}}` / `{{gst_amount}}` / `{{total_amount}}`
- Footer links (`Terms & Conditions`, `Privacy Policy`, …) are turned into real `<a href="https://udyamadhar.in/…">` tags.

---

## 2. Database change — `email_templates.category`

One idempotent migration:

1. `ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS category TEXT;`
2. `ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS flow_id TEXT;`  (stores `E001`…`E006`, nullable)
3. `ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS sr_no INT;`     (stable 1-N per category)
4. `UPDATE` every row above with its `subject`, `body_html`, `category`, `flow_id`, `sr_no`.
5. Backfill `category` for all remaining rows (`admin_*`, `bhs_*`, `complaint_*`, `workflow_*`, `cancel-*`, `refund_*`, `lead_*`, `onboarding_*`, `contact_*`, `document_*`, `payment_*`) using a WHEN…THEN table so nothing is left un-categorised. Rows without an explicit SR get an auto SR from row_number within their category.
6. Categories used (fixed enum-style list, kept in code and in the migration):
   - `Onboarding & Payment`
   - `Fulfillment`
   - `Delay & Hold`
   - `Closure`
   - `Consultation`
   - `Support / Tickets`
   - `Refunds`
   - `Complaints`
   - `Internal / Admin`
   - `Workflow Automation`

Grants already exist on `email_templates`; no policy changes.

---

## 3. Admin UI — `/admin/email-templates` grouping

Refactor `src/routes/admin.email-templates.tsx`:

- Load templates once, then group by `category`.
- Render one collapsible section per category with:
  - Category header + count badge + a "Enable all / Disable all" toggle (admin only).
  - Table columns: `SR`, `Flow`, `Code`, `Name`, `Subject`, `Status`, `Last Sent`, `Sent`, `Actions`.
  - `SR` is `sr_no`, monospaced. `Flow` shows the `E00x` chip (empty when none).
- Add top-of-page search that filters across name / code / subject and auto-expands matching categories.
- Add a left "Categories" nav rail (sticky) with jump-to-anchor links so navigating between the 10 groups is one click.
- No change to Preview / Edit / Disable dialogs (existing behaviour keeps working).
- `listEmailTemplates` server fn already returns `*`; extend its `Tpl` type on the client to include `category`, `flow_id`, `sr_no`.

---

## 4. Files touched

- `supabase/migrations/2026xxxx_email_templates_sync_and_categories.sql` (new — the only DB change).
- `src/routes/admin.email-templates.tsx` (grouped view + SR/flow columns + search + side nav).
- `src/lib/emails/emails.functions.ts` (widen `saveEmailTemplate` input to allow updating `category`, `flow_id`, `sr_no`; leave defaults intact for backwards compat).
- `src/lib/email-templates/registry.ts` — unchanged; the React registry is only for the Lovable transactional route and is not the source of truth for these DB templates.

## 5. Verification

1. Run the migration; re-run `SELECT code, category, sr_no, flow_id, subject FROM email_templates ORDER BY category, sr_no` and confirm all 12 SR rows have the exact subjects from the source doc.
2. Open `/admin/email-templates` — 10 category sections render, SR 1-12 visible under their categories, Flow chips show for E001-E006 rows.
3. Click **Preview** on SR 1 (`order_confirmation`) → renders the uploaded HTML with sample data, subject matches the doc exactly.
4. Trigger a test send from a lead workspace using each of the 12 codes and confirm the delivered subject line matches the table above (via the Emails tab body-expanded view added earlier).

## Out of scope (ask before doing)

- Adding brand-new template rows that aren't in the 12 sources (e.g. auto-generated feedback E007).
- Rewriting the automation triggers (`workflow-reminders`, `closure-workflow`) — this plan only aligns content + UI. Trigger wiring already sends the correct codes.
