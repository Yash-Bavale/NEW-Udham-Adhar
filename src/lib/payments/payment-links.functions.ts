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

    // If already paid and no balance/pending status, don't issue a link.
    const { data: paidRows } = await supabaseAdmin
      .from("payments")
      .select("amount")
      .eq("lead_id", lead.id)
      .eq("status", "paid");
    const paidSum = (paidRows ?? []).reduce((s, r: any) => s + Number(r.amount ?? 0), 0);
    const totalAmt = Number(lead.total_amount ?? 0);
    const isPending = lead.status === "payment_pending" || lead.lead_status_v2 === "payment_pending";
    if (paidRows && paidRows.length > 0 && totalAmt <= paidSum && !isPending) {
      throw new Error("This lead has already paid in full. No new link needed.");
    }

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

    // Update lead status to payment_pending if currently new/contacted
    if (
      ["new_lead", "contacted", "follow_up_required", "lead_created"].includes(lead.status ?? "") ||
      ["new_lead", "contacted", "follow_up_required", "lead_created"].includes(lead.lead_status_v2 ?? "")
    ) {
      await supabaseAdmin
        .from("leads")
        .update({ status: "payment_pending", lead_status_v2: "payment_pending" } as any)
        .eq("id", lead.id);
    }

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
      .select("id, txnid, payment_url, amount, status, created_at, expires_at, opened_at, paid_at, payment_id")
      .eq("lead_id", data.leadId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!link) return { link: null, paid: false };

    // Source of truth is the link row itself. The PayU finalize pipeline flips
    // payment_links.status to 'paid' + stamps paid_at + payment_id when the
    // matching payment settles. Inferring "paid" from unrelated payments (e.g.
    // an earlier ₹99 consultation charge, or a top-up sibling) caused false
    // "Payment Received" banners on Talk-to-Expert / service-change flows.
    const linkRow: any = link;
    let isPaid = linkRow.status === "paid";

    // 1. If the link is not paid yet, only a payment that actually settled
    //    FOR THIS LINK may mark it paid: it must be created after the link was
    //    issued and match the link amount. Matching any older paid payment
    //    (the original order fee) marked unpaid top-ups as paid — a real
    //    financial mis-statement, so never relax this.
    if (!isPaid) {
      const linkAmount = Number(linkRow.amount ?? 0);
      const { data: paidPayment } = await supabaseAdmin
        .from("payments")
        .select("id, amount, created_at")
        .eq("lead_id", data.leadId)
        .eq("status", "paid")
        .gte("created_at", linkRow.created_at)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const amountMatches =
        !!paidPayment && linkAmount > 0 &&
        Math.abs(Number(paidPayment.amount ?? 0) - linkAmount) < 0.01;

      if (paidPayment && amountMatches) {
        await supabaseAdmin
          .from("payment_links" as any)
          .update({ status: "paid", paid_at: new Date().toISOString(), payment_id: paidPayment.id } as any)
          .eq("lead_id", data.leadId)
          .eq("status", "pending");

        try {
          const { finalizePaidPayment } = await import("@/lib/payments/finalize-paid.server");
          await finalizePaidPayment(paidPayment.id, { source: "reconcile" });
        } catch { /* ignore */ }

        isPaid = true;
        linkRow.status = "paid";
        linkRow.paid_at = paidPayment.created_at;
        linkRow.payment_id = paidPayment.id;
      }
    }

    // 2. If still not paid, query payment gateway API for any attempted payment rows for this lead.
    if (!isPaid) {
      const { data: attemptedPayments } = await supabaseAdmin
        .from("payments")
        .select("id, gateway_name, transaction_id, razorpay_order_id")
        .eq("lead_id", data.leadId)
        .in("status", ["created", "attempted"])
        .order("created_at", { ascending: false })
        .limit(5);

      for (const p of attemptedPayments ?? []) {
        const txnid = p.transaction_id || p.razorpay_order_id;
        if (!txnid) continue;
        const gw = String(p.gateway_name ?? "payu").toLowerCase();

        if (gw === "payu") {
          try {
            const { verifyPayUPayment } = await import("@/lib/payments/payu.server");
            const verified = await verifyPayUPayment(txnid);
            const status = String(verified?.status ?? "").trim().toLowerCase();
            const unmapped = String(verified?.unmappedstatus ?? "").trim().toLowerCase();
            if (status === "success" || unmapped === "captured") {
              const mihpayid = verified?.mihpayid ? String(verified.mihpayid) : null;
              await supabaseAdmin.from("payments").update({
                status: "paid",
                payment_date: new Date().toISOString(),
                razorpay_payment_id: mihpayid,
                payu_mihpayid: mihpayid,
                raw_response: { verified_payment: verified, source: "link-status-auto-check" } as any,
              } as any).eq("id", p.id);

              const { finalizePaidPayment } = await import("@/lib/payments/finalize-paid.server");
              await finalizePaidPayment(p.id, { source: "reconcile", txnid, mihpayid });

              isPaid = true;
              linkRow.status = "paid";
              linkRow.paid_at = new Date().toISOString();
              linkRow.payment_id = p.id;
              break;
            }
          } catch (e) {
            console.error("[getPaymentLinkStatus] PayU verify failed for txnid", txnid, e);
          }
        } else if (gw === "ccavenue") {
          try {
            const { callOrderStatusApi } = await import("@/lib/payments/ccavenue.server");
            const reconciled = await callOrderStatusApi(txnid);
            if (reconciled.status === "paid") {
              await supabaseAdmin.from("payments").update({
                status: "paid",
                payment_date: new Date().toISOString(),
                raw_response: { reconciled: reconciled.raw, source: "link-status-auto-check" } as any,
              } as any).eq("id", p.id);

              const { finalizePaidPayment } = await import("@/lib/payments/finalize-paid.server");
              await finalizePaidPayment(p.id, { source: "reconcile", txnid, mihpayid: reconciled.trackingId || null });

              isPaid = true;
              linkRow.status = "paid";
              linkRow.paid_at = new Date().toISOString();
              linkRow.payment_id = p.id;
              break;
            }
          } catch (e) {
            console.error("[getPaymentLinkStatus] CCAvenue verify failed for orderId", txnid, e);
          }
        }
      }
    }

    let paidAmount: number | null = null;
    if (isPaid && linkRow.payment_id) {
      const { data: p } = await supabaseAdmin
        .from("payments")
        .select("amount")
        .eq("id", linkRow.payment_id)
        .maybeSingle();
      paidAmount = p?.amount != null ? Number(p.amount) : Number(linkRow.amount);
    } else if (isPaid) {
      paidAmount = Number(linkRow.amount);
    }

    return {
      link: { ...linkRow, amount: Number(linkRow.amount) },
      paid: isPaid,
      paidAt: linkRow.paid_at ?? null,
      paidAmount,
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
