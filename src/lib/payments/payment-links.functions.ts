import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole } from "@/lib/audit";

const STAFF_ROLES = ["super_admin", "admin", "manager", "executive", "support", "accounts", "finance", "operations"] as const;

function appOrigin() {
  return process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
}

function newTrackingToken(leadCode: string) {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 8);
  return `LNK-${leadCode}-${ts}-${rnd}`.toUpperCase();
}

const LeadIdInput = z.object({ leadId: z.string().uuid() });

/**
 * Create (or reuse) a self-checkout payment link for a lead.
 * The URL always points to `/payment/$leadCode` which initiates a fresh PayU
 * order when the customer opens it. The `payment_links` row is just a record
 * of who shared the link, when, and whether the lead eventually paid.
 */
export const createPaymentLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LeadIdInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF_ROLES] as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: lead, error: leadErr } = await supabaseAdmin
      .from("leads")
      .select("id, lead_code, name, mobile, email, service, total_amount, base_amount, gst_amount, status, lead_status_v2")
      .eq("id", data.leadId)
      .maybeSingle();
    if (leadErr) throw new Error(leadErr.message);
    if (!lead?.lead_code) throw new Error("Lead not found");

    // If already paid, don't issue a link.
    const { data: paidRow } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("lead_id", lead.id)
      .eq("status", "paid")
      .limit(1)
      .maybeSingle();
    if (paidRow) throw new Error("This lead has already paid. No new link needed.");

    // Reuse the most recent pending, non-expired link instead of minting a new one.
    const nowIso = new Date().toISOString();
    const { data: existing } = await supabaseAdmin
      .from("payment_links" as any)
      .select("id, txnid, payment_url, amount, status, created_at, expires_at")
      .eq("lead_id", lead.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing && (!(existing as any).expires_at || (existing as any).expires_at > nowIso)) {
      return {
        ...(existing as any),
        amount: Number((existing as any).amount),
        leadCode: lead.lead_code,
        isReused: true,
      };
    }

    const txnid = newTrackingToken(lead.lead_code);
    const paymentUrl = `${appOrigin()}/payment/${encodeURIComponent(lead.lead_code)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("payment_links" as any)
      .insert({
        lead_id: lead.id,
        txnid,
        payment_url: paymentUrl,
        amount: Number(lead.total_amount ?? 0),
        status: "pending",
        expires_at: expiresAt,
        created_by: context.userId,
      } as any)
      .select("id, txnid, payment_url, amount, status, created_at, expires_at")
      .single();
    if (insErr || !inserted) throw new Error(insErr?.message ?? "Could not create payment link");

    return {
      ...(inserted as any),
      amount: Number((inserted as any).amount),
      leadCode: lead.lead_code,
      isReused: false,
    };
  });

/** Poll a lead's most recent link status (UI auto-refreshes every 15s). */
export const getPaymentLinkStatusForLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LeadIdInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF_ROLES] as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: link } = await supabaseAdmin
      .from("payment_links" as any)
      .select("id, txnid, payment_url, amount, status, created_at, expires_at, opened_at, paid_at")
      .eq("lead_id", data.leadId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!link) return { link: null, paid: false };

    // Cross-check actual payment status, but only count payments that arrived
    // AFTER this link was minted. Otherwise, for a Talk-to-Expert converted
    // lead the original ₹99 consultation payment would falsely mark the new
    // link as paid and hide the share UI.
    const { data: paidRow } = await supabaseAdmin
      .from("payments")
      .select("id, status, payment_date, amount, created_at")
      .eq("lead_id", data.leadId)
      .eq("status", "paid")
      .gte("created_at", (link as any).created_at)
      .order("payment_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      link: { ...(link as any), amount: Number((link as any).amount) },
      paid: !!paidRow,
      paidAt: paidRow?.payment_date ?? null,
      paidAmount: paidRow?.amount ? Number(paidRow.amount) : null,
    };
  });


/** Force a brand-new link, voiding any pending ones for the same lead. */
export const regeneratePaymentLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LeadIdInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF_ROLES] as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin
      .from("payment_links" as any)
      .update({ status: "expired" } as any)
      .eq("lead_id", data.leadId)
      .eq("status", "pending");

    // Reuse the same create-link path now that no pending row exists.
    return createPaymentLink({ data });
  });
