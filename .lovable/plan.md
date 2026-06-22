# Phase 0 — Database Foundation Rebuild

Schema-only migration. No UI, server functions, or component code changes in this phase. After approval, this runs as a **single migration** so it's atomic (one failure rolls back the whole thing — no half-migrated DB).

## Scope

Locks down referential integrity, introduces canonical enums for lead/order lifecycle, adds tamper-evident audit trails, and creates the missing tables (`tasks`, `support_tickets`, `ticket_replies`, `follow_ups`, `application_events`, `audit_log`) required by later phases.

## What changes

1. **Foreign keys** — add the 8 missing FKs across `leads`, `applications`, `payments`, `invoices`, `documents`, `complaints`. Pre-flight: clean orphan rows first so the `ALTER TABLE` doesn't fail.
2. **Enums** — create `lead_status_enum`, `fulfillment_status_enum`, `payment_status_enum`, `complaint_status_enum`, `ticket_status_enum`, `priority_enum`. Add `leads.lead_status_v2` and `applications.fulfillment_status` columns (old `status` columns kept untouched for safe migration in Phase 1).
3. **Soft-delete guard** — add `is_deleted` / `deleted_at` on `leads`, `applications`, `customers`; add restrictive `FOR DELETE USING (false)` RLS policies to block hard deletes.
4. **Refund tracking** — add 8 refund/document-deletion columns on `applications`.
5. **Lead follow-up** — add `next_followup_at`, `followup_note`, `assigned_to` on `leads` (note: `assigned_to` already exists — will skip if present).
6. **New tables** — `application_events` (with `INSTEAD NOTHING` rules blocking UPDATE/DELETE → tamper-evident), `audit_log`, `tasks`, `support_tickets`, `ticket_replies`, `follow_ups`. Each includes:
   - `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated; GRANT ALL ... TO service_role;`
   - `ENABLE ROW LEVEL SECURITY`
   - Staff-scoped policies using existing `has_any_staff_role(auth.uid())` helper
7. **Triggers** — `log_application_event()` on `applications` UPDATE (status + assignment changes) and `log_lead_status_change()` on `leads` UPDATE. Both `SECURITY DEFINER`, denormalising staff name/role from `profiles` + `user_roles`.
8. **`customer_stats` view** — aggregates applications/payments per customer (replaces dead counter columns).
9. **Sequences + ticket number trigger** — `ticket_seq`, `complaint_seq`, `generate_ticket_number()` BEFORE INSERT on `support_tickets`.

## Adjustments to your spec (to avoid migration failures)

- **FK pre-flight cleanup**: before each `ADD CONSTRAINT`, run a guard that nulls or rejects orphan rows. Otherwise existing bad data blocks the FK. I will surface any orphan counts in the migration output so you can review before approving.
- **`profiles.full_name`** does not exist in this project — `profiles` has `display_name`. Triggers will use `display_name`.
- **`payments.customer_id`** — verify column exists; if not, `customer_stats` view joins through `applications` instead.
- **`leads.assigned_to`** already exists (used by `my-work.functions.ts`), so step 5 will `ADD COLUMN IF NOT EXISTS` only.
- **RLS GRANTs**: every new public table gets explicit grants (Lovable Cloud requirement; spec omits them).
- **Idempotency**: wrap each `CREATE TYPE` / `CREATE TRIGGER` with `IF NOT EXISTS` / `DROP ... IF EXISTS` so the migration is re-runnable.

## What does NOT change in Phase 0

- No UI code, no server functions, no route changes.
- Existing `leads.status` and `applications.application_status` columns are **left in place** — Phase 1 will backfill `lead_status_v2` / `fulfillment_status` and switch reads/writes.
- Existing triggers (`log_lead_activity`, `log_application_activity`) stay; they write to `activity_logs`. New triggers write to `application_events`. Both coexist until Phase 1 consolidates.

## Deliverable

One `supabase--migration` call containing all 10 steps. After it runs cleanly I'll reply "Phase 0 complete" with a short summary of any orphan rows cleaned and any columns/objects skipped because they already existed. Phase 1 (Lead Management) starts only after your go-ahead.
