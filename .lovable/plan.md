## 1. Certificate delivery email — "Order Completed" template

In `src/lib/crm/certificates.functions.ts` (and the matching call in `src/lib/crm/orders-v2.functions.ts` that re-uses `certificate_delivery`):

- New subject: `Your Order No. {orderCode} has been completed`.
- Replace the inline HTML with a Zoho-styled template that mirrors the verbatim copy you provided:
  - Header bar: **Order Completed**.
  - Body opens "Dear {Customer Name}, Greetings from Business Help Services."
  - Confirmation that Order/Application No. **{orderCode}** for UDYAM-related consultancy & assistance services has been processed/completed.
  - Line: *"Please find the relevant document/certificate attached to this email for your reference and records."*
  - Review/clarification paragraph + contact block (Team Business Help Services, help@businesshelpservices.com, https://udyamadhar.in).
  - Reminder to quote the Order/Application Number in future communications.
  - Deemed-completion clause ("In case no response... within a reasonable period...").
  - Warm regards sign-off and footer with email + website.
- Keep the existing certificate attachment logic (PDF/JPG/PNG ≤9 MB) and the secondary "Download Certificate" button as a fallback in case the attachment is stripped.
- Apply the same template in `orders-v2.functions.ts` so the auto-send on completion uses the new copy.

## 2. Global date format → DD/MM/YYYY (IST)

Single source of truth in `src/lib/datetime.ts`:

- Add `formatDateDMY(value)` that:
  - Accepts `Date | string | number`.
  - Hard-fails on malformed values like `"12021-08-31"` (year > 9999) and tries `slice(-10)` recovery so the legacy bad record renders as `31/08/2021` instead of `01/01/+12021`.
  - Returns `DD/MM/YYYY` in `Asia/Kolkata`.

Wire-through (UI only, no business logic changes):

- `src/lib/crm/formDisplayConfig.ts` → `formatValue` `case "date"` uses `formatDateDMY`.
- Replace ad-hoc `toLocaleDateString("en-IN", { day:"2-digit", month:"short" ...})` calls across admin screens with `formatDateDMY` (sweep `src/components/admin/**` and `src/routes/admin.*`). I'll grep and update every hit in one pass.
- Day-separator label in lead/order tables keeps the weekday but switches the date part to DD/MM/YYYY.

## 3. NIC 4-digit truncation ("783" → "7830")

Root cause: `NicCodePicker.pick()` saves `group_code` from the DB, and Postgres `nic_codes.group_code` drops trailing zeros for some rows, so "7830" stores as "783".

Fix in `src/components/onboarding/NicCodePicker.tsx`:

- When `digits === 4`, build the display code from `r.code.slice(0, 4)` (which is always 4 chars) rather than relying on `group_code`. Same hardening for `digits === 2` (use `code.slice(0,2)`).
- Apply identical logic in the dropdown row render so the suggestion list matches what gets saved.

Backfill (read-only display fix is enough — the form submission text is rendered as stored):

- Add a tiny normaliser in `formDisplayConfig.ts` for the `nic.two_digit` / `nic.four_digit` paths that pads the leading code segment with trailing zeros up to N digits before the `—`. This corrects already-saved submissions in CRM without rewriting the DB.

## 4. Verification

- Re-render the "New Udyam Registration" form panel for the order in the screenshot and confirm:
  - Date of Incorporation shows `31/08/2021` (recovered from the malformed `12021-08-31`).
  - 4-Digit NIC shows `7830 — Human resources provision and management of human resources functions`.
- Trigger a test completion to confirm the new certificate email subject/body and that the certificate file is still attached.

### Files touched
- `src/lib/crm/certificates.functions.ts`
- `src/lib/crm/orders-v2.functions.ts`
- `src/lib/datetime.ts`
- `src/lib/crm/formDisplayConfig.ts`
- `src/components/onboarding/NicCodePicker.tsx`
- Sweep of admin date renderers under `src/components/admin/**` and `src/routes/admin.*`
