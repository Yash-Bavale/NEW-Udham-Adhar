## 1. Disable payment flow — repeat the 30s countdown

Currently the form journey is:

```text
LeadForm  →  /processing/$leadCode  (30s)  →  /apply/$leadCode/summary  (payment)
```

We will keep the lead saved in CRM and keep the same processing screen, but never advance to payment.

**File: `src/routes/processing.$leadCode.tsx`**
- Remove the `navigate(...)` call when `elapsed >= TOTAL_SECONDS`. Instead, reset `elapsed` back to `0` so the timer loops forever (30 → 0 → 30 → 0 …).
- After the first cycle completes once, replace the bottom helper line (currently "Please don't close or refresh this window.") with a friendlier message like "Our team will reach out shortly on your registered mobile and email." Step pips and ring animation keep running.
- Keep the existing `trackEvent("processing_viewed")` call.

**Hide payment page links (defensive)**

- `src/routes/apply.$leadCode.summary.tsx` — leave the file in place (so it doesn't break the route tree), but no nav now points to it. Nothing else needs changing for this turn.
- `src/routes/app.$token.tsx` — the `/app/$token` magic-link page redirects to processing already, that stays fine.

## 2. CRM lead capture + duplicate counting

The existing `createLead` server function already inserts the lead and an application — that part stays. We add duplicate detection (match on mobile OR email).

**Migration**
Add two columns to `public.leads`:
```sql
ALTER TABLE public.leads
  ADD COLUMN is_duplicate boolean NOT NULL DEFAULT false,
  ADD COLUMN duplicate_of uuid NULL REFERENCES public.leads(id) ON DELETE SET NULL,
  ADD COLUMN duplicate_count integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS leads_mobile_idx ON public.leads(mobile);
CREATE INDEX IF NOT EXISTS leads_email_idx  ON public.leads(lower(email));
```
No grants/RLS changes needed (existing policies cover the new columns).

**File: `src/lib/leads.functions.ts`**
- Before inserting the new lead, look up the earliest existing lead where `mobile = data.mobile OR lower(email) = lower(data.email)` (order by `created_at asc`, limit 1).
- If found:
  - Insert the new lead with `is_duplicate = true`, `duplicate_of = <original_id>`.
  - In the same transaction-ish flow, `update leads set duplicate_count = duplicate_count + 1 where id = <original_id>`.
- If not found: insert as today (defaults `is_duplicate = false`).
- Everything else (service lookup, application insert, return shape) is unchanged.

**File: `src/components/admin/LeadEditableCard.tsx`** (and/or `src/routes/admin.leads.tsx` list view — whichever already renders lead rows)
- Show a small "Duplicate" badge when `is_duplicate` is true (with a link/tooltip to the original lead).
- On the original lead, show `× N duplicates` when `duplicate_count > 0`.

(I'll keep this scoped to the most visible CRM surfaces — full reporting can come later.)

## 3. Footer SEO tree — hide behind 3-click + password unlock

Right now `src/components/site/Footer.tsx` renders the full `SeoTree` under the "MSME / Udyog Aadhaar" column, with "Home" as the first item. We will hide the SEO categories by default and gate them behind a password.

**File: `src/components/site/Footer.tsx` (and the inner `SeoTree` component)**

- Default render: show only the "Home" row (the home icon + "Home" link). No categories below it.
- Track click count locally on the Home row's container (per session, in component state — does not navigate yet on counting clicks; the Home link itself still navigates on plain click via a separate `<Link>` so users aren't blocked).
  - Implementation detail: wrap the Home label in a clickable area that increments `clicks` state. Clicking the home icon still routes to `/`. The 3-click counter is on the *row* (not the link) so accidental nav is fine — we'll attach the counter to a small chevron/handle next to the label, OR use a `onClick` on the row that increments but doesn't preventDefault on the Link. Simplest: add an invisible button overlay on the row that increments and, on the 3rd click, reveals the password UI.
- On the **3rd** click within a session, render directly below the Home row:
  - A single password `<input type="password" />` (no placeholder text, no label like "insert password" — just a bare input styled to match the footer)
  - An "Open" button to its right.
- On submit, compare to the hardcoded string `113355`:
  - **Match** → set `unlocked = true` in `sessionStorage` under a key like `udyam_footer_unlock`, render the full `SeoTree` (the existing categories + children) directly below the Home row. Hide the password input.
  - **No match** → clear the input, shake/highlight red briefly, keep input visible. Click counter resets so the user has to click Home 3× again to retry (prevents brute force).
- If `sessionStorage` already has `udyam_footer_unlock === "1"` on mount, render the unlocked tree from the start (no 3-click needed for the rest of that browser session).
- This is footer-only — the underlying SEO landing pages remain reachable by direct URL (per the user's choice).

Security note: the password lives in the client bundle. This is purely UX hiding for visitors browsing the site — it is not a real access control. We'll note this in @security-memory so the scanner doesn't flag the hardcoded password as a leaked secret (it isn't one).

## 4. Files touched

- `src/routes/processing.$leadCode.tsx` — loop countdown, no payment nav, friendly subline.
- `src/lib/leads.functions.ts` — duplicate detection logic.
- `supabase/migrations/<timestamp>_leads_duplicate_tracking.sql` — new columns + indexes.
- `src/components/admin/LeadEditableCard.tsx` (and lead list) — duplicate badges.
- `src/components/site/Footer.tsx` — hide SEO tree, 3-click + password unlock.
- `@security-memory` — note that the footer password is intentional UX hiding, not a secret.

## 5. Out of scope (this turn)

- Removing/refactoring `/apply/$leadCode/summary`, `/payment/...`, webhook routes — leaving them dormant until payments are re-enabled.
- Server-side rate-limiting on the lead intake (existing dedupe is acceptable).
- Admin reporting/export for duplicate counts beyond the inline badge.
