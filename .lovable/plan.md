# Why customers aren't growing while leads are

**Diagnosis (confirmed from DB):**
- `leads` table: **3,608 rows**
- `customers` table: **38 rows**
- `leads.customer_id` populated on only **2 rows**

The public lead-intake server function `src/lib/leads.functions.ts` (`createLead`) inserts into `leads` and `applications`, but **never touches the `customers` table** and never sets `leads.customer_id`. The DB already has a perfect helper for this — `public.find_or_create_customer(name, email, mobile, state, language)` — it just isn't being called from the website form. Nothing else in the onboarding / payment / application flow creates customers either, so the only customers in the system are the 38 created manually from the CRM. That's the break.

## Fix

Update `src/lib/leads.functions.ts` so every website submission also resolves a customer record and links it to the lead.

### Step 1 — Resolve/create customer before inserting the lead

After the service lookup, call the existing RPC:

```ts
const { data: customerId, error: custErr } = await supabaseAdmin.rpc(
  "find_or_create_customer",
  {
    p_name: data.name,
    p_email: normalizedEmail,
    p_mobile: data.mobile,
    p_state: data.state,
    p_language: data.language,
  }
);
if (custErr) console.error("find_or_create_customer failed:", custErr.message);
```

The RPC already handles:
- dedupe by mobile, then email
- creates a `CU-YYYY-NNNNNN` code via existing trigger
- updates `last_seen_at` + fills any missing fields on repeat submissions

Customer creation is **non-fatal** — if it fails we still save the lead.

### Step 2 — Link the customer to the new lead

Add `customer_id: customerId ?? null` to the `leads` insert payload.

### Step 3 — One-time backfill for existing 3,606 unlinked leads

A second migration that, for every lead with `customer_id IS NULL`, calls `find_or_create_customer` using the lead's `name/email/mobile/state/language` and writes the returned id back into `leads.customer_id`. After this, the Customers page in the CRM will reflect the real population (expect a large jump — likely a few thousand unique customers once dedupe by mobile/email is applied).

### Out of scope (not changing)
- `customers` table schema, RLS, or grants — already correct
- The `find_or_create_customer` function — already correct
- Onboarding / payment / application flows — they don't need to create customers; the lead intake is the single entry point and is enough once fixed

## Verification after build

Run:
```sql
SELECT count(*) FROM customers;
SELECT count(*) FROM leads WHERE customer_id IS NULL;
```
Expected: `customers` jumps from 38 → several thousand, and `leads WHERE customer_id IS NULL` drops to 0 (or near-0 for rows with invalid contact data).
