## What's actually happening

The email you're seeing — **"[Action Required] Update on grievance CMP-…"** — is **not** one of the 13 templates in your Email Templates screen. It is hard-coded inside a cron endpoint (`src/routes/api/public/cron/complaints-sla.ts`) that scans the `complaints` table, and whenever it finds a complaint whose SLA due-date has passed, it enqueues a reminder email with subject + HTML built inline in the code and stamped with `template_code = "complaint_sla_breach"`.

That is the **only** "phantom" email in the system I could find. Every other email in the queue traces back to one of the 13 rows in `email_templates`.

Why it keeps hitting the same 4 people:

- 4 complaints are stuck in status `pending` with `breached_at` set weeks ago (Jun 17 / Jun 26).
- The cron re-queues each one once per 24h (guard: `last_reminded_at`), so each customer has already received **10–19** of these.
- `CMP-202606-5MBNU` is the one currently failing — its latest attempt errors with `[zoho] proxy request failed, cannot connect to the specified address`. That's an outbound-network hiccup on the Zoho HTTPS API from this preview sandbox, **not** a Zoho auth problem — same account, same key, same code is delivering all your other mail right now. It will typically self-heal on the next queue tick, but the underlying issue is that this reminder should never have been sent 19 times to begin with.

## Fix plan

**1. Make this email visible & controllable in your admin UI**
Insert a proper row into `email_templates` for `complaint_sla_breach`:

- `code = complaint_sla_breach`, category `Support / Tickets` (or a new "Complaints" category), `is_system = true`, `dispatch_mode = auto`, `is_enabled = true`.
- Move the subject + HTML body from the cron file into the template row (with `{{customerName}}`, `{{complaintNumber}}`, `{{severity}}` variables), matching how your other templates work.

**2. Update the cron to respect the template row**
Rewrite `src/routes/api/public/cron/complaints-sla.ts` so it:

- Loads the `complaint_sla_breach` template from `email_templates`.
- Skips silently if `is_enabled = false` (so you can turn it off from the admin screen without touching code — exactly like the other auto templates).
- Renders subject/body from the template with the complaint variables instead of hard-coding them.

**3. Stop the current flood**

- Cap total reminders per complaint (e.g. hard stop after 3) inside the cron, so a stale complaint can't rack up 19 emails.
- One-time cleanup: for the 4 currently-breached complaints (`CMP-202606-5MBNU / IOAFV / WKIOE / 917TH`), set `last_reminded_at` far in the future OR bump their status out of `pending`, so no more reminders go out until you decide.

**4. Proxy send error**

- No code change needed for the Zoho path itself — the send helper already retries and the same account is delivering other mail. The failing row (`6c2aaac1-…`) will retry on the next tick.
- Once step 1–3 are in, this class of email drops to near zero, and if it still errors it's now visible + toggleable from the admin.

## Questions before I build

- **Kill switch style:** do you want me to *disable* `complaint_sla_breach` by default after moving it into `email_templates` (so nothing goes out until you flip it on), or leave it enabled with the 3-attempt cap? disable
- **The 4 stuck complaints:** should I just stop future reminders on them, or also mark them `resolved` / assign them so the SLA clock isn't perpetually red?

Say the word and I'll implement.