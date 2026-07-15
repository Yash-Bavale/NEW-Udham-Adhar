## Problem (evidence)

Recent inbound Zoho mails **are** being ingested (rows in `email_logs`) and support tickets **are** being created — but every recent ticket + email_log has `application_id = NULL`, even though the subject clearly contains the order code:

```
Re: … Order No. AP-2026-007193      → ticket.application_id = NULL
Re: … Order No. AP-2026-007184      → ticket.application_id = NULL
Re: … Order No. AP-2026-006921      → ticket.application_id = NULL
Re: … UA-2026-008120                → ticket.application_id = NULL
```

Because `application_id` is NULL:
- The order workspace's `TicketPanel` (filters `support_tickets.application_id = orderId`) shows nothing.
- The ticket workspace's "emails" pane (queries `email_logs` by `application_id`) is empty, so no sent/received chat thread.
- Journey map cannot pause/resume against these tickets.

`inbox-matcher.server.ts` only tries: In-Reply-To → `email_logs.message_id`, `X-BHS-Order` header, then `from_email → customers/leads`. It **never parses the order code from the subject**. Zoho customers replying from web/mobile frequently drop In-Reply-To, and we don't set `X-BHS-Order` on all outgoing mail — so matching falls to the `from_email` path, which returns customer_id but no application_id when the customer has multiple orders or the order is beyond the `NOT IN (COMPLETED,CLOSED,REFUND_PROCESSED)` filter.

Separate bug: HTML entities (`&amp;`, `&nbsp;`, `&#39;`) render literally. `stripHtml()` in `inbox-matcher.server.ts` removes tags but never decodes entities, so `body_text` (which the chat bubble renders as plain text when no HTML is present) contains raw entities. Subjects saved from Zoho headers can also arrive entity-encoded.

## Plan

### 1. Subject-based order matching (root fix)

In `src/lib/mail/inbox-matcher.server.ts`, extend `matchOrder()` with a new **step 0** (highest priority, runs before In-Reply-To):

- Regex the subject for `AP-\d{4}-\d{6}` and `UA-\d{4}-\d{6}`.
- If `AP-...` found → `applications.application_code` lookup → return `{applicationId, leadId, customerId}`.
- Else if `UA-...` found → `leads.lead_code` lookup → then latest application for that lead.

Apply the same subject match inside `matchTicket()` too (before falling back to In-Reply-To) so replies without headers still merge into the right ticket via `ticket_reopen_or_create` when the matched application already has a ticket.

Also stop the current `from_email` path from silently dropping the order match when the customer has exactly one open order — remove the `NOT IN (COMPLETED,CLOSED)` filter's REOPENED exclusion so a customer replying to a completed order still links.

### 2. Attach existing orphan tickets/emails (one-shot backfill)

Migration `backfill_orphan_ticket_application_id.sql`:

- For every `support_tickets` row where `application_id IS NULL` and subject matches `AP-\d{4}-\d{6}` or `UA-\d{4}-\d{6}`, resolve to an application id and update.
- Same for `email_logs` rows with `direction='incoming'` and `application_id IS NULL`.
- Purely additive updates — no schema changes, no GRANT changes.

### 3. Decode HTML entities

- Update `stripHtml()` in `inbox-matcher.server.ts` to decode entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;`, numeric `&#NN;` / `&#xNN;`) after tag removal.
- Decode entities when normalizing `subject` headers coming out of Zoho.
- In the ticket-thread `MessageCard` (`src/routes/admin.tickets.$ticketId.tsx`), when only `bodyText` is present, run a small `decodeEntities()` helper before rendering into the `<p className="whitespace-pre-wrap">` block. Keeps HTML path (DOMPurify) untouched.

### 4. Chat-box view (sent + received) on the order

`TicketPanel` today only lists ticket rows. Extend it (still under `CustomerJourneyMap`'s "Customer contacted" section):

- For the top open ticket of the order, render a compact **thread preview**: last 4 messages using the existing bubble style (agent right / customer left), with sent/received chips, timestamp, and a "Open full thread ↗" link to `/admin/tickets/$ticketId`. No new server function — reuse `getTicketWorkspace` scoped to `mostRecentOpenTicket.id` or add a tiny `getOrderThreadPreview(orderId)` server fn that returns the last 4 merged `ticket_replies + email_logs`.

### 5. Journey ↔ Ticket mapping

In `src/lib/orders/journey-map.ts` and `CustomerJourneyMap.tsx`:

- Add a **"Customer contacted"** phase indicator (chip) that lights up when `support_tickets` has an open row for this order. It doesn't replace the B-button phase; it sits alongside as an overlay pill (amber).
- When the pill is active, the E-template & button strip shows:
  - E009 (Reply to customer) — links to open the thread composer
  - "Resolve ticket & resume order" button — calls existing `resolveTicketAndResumeOrder`
- Wire `TicketOpened` / `TicketClosed` workflow events (already dispatched by the matcher and `ticket-merge.functions.ts`) into the journey pill so it updates in real time via the existing `useRealtimeTable("support_tickets")` hook.

### 6. Verification

- Manually trigger `/api/public/cron/poll-zoho-inbox` after fix + backfill; confirm new incoming replies land with `application_id` set.
- Open `/admin/orders/abe94685-…` → confirm `TicketPanel` shows the ticket and thread preview.
- Open the ticket detail; confirm sent (agent bubble) + received (customer bubble) rendering, and no `&amp;` / `&nbsp;` in body or subject.
- Journey card shows the amber "Customer contacted" pill; clicking "Resolve & resume" clears it.

## Files touched

- edit `src/lib/mail/inbox-matcher.server.ts` (subject regex match, entity decode)
- new  `supabase/migrations/<ts>_backfill_orphan_ticket_application_id.sql`
- edit `src/routes/admin.tickets.$ticketId.tsx` (decode entities in text-only bubbles)
- edit `src/components/admin/workspace/TicketPanel.tsx` (thread preview)
- new  `src/lib/tickets/order-thread-preview.functions.ts`
- edit `src/components/admin/workspace/CustomerJourneyMap.tsx` + `src/lib/orders/journey-map.ts` (Customer-contacted pill + E009 / resolve-resume button)

No changes to email sending, templates, `hold-actions.functions.ts`, workflow engine core, or GRANT/RLS policies.
