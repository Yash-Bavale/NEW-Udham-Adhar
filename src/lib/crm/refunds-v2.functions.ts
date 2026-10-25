import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function requireStaff(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_any_staff_role", { _user_id: userId });
  if (!data) throw new Error("Forbidden");
}

/** Aggregate KPI counts + totals across all refund requests. */
export const refundStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireStaff(context.supabase, context.userId);
    const admin = await getAdmin();
    const { data: rows } = await admin
      .from("refund_requests")
      .select("id, status, refund_amount, processed_at, created_at");
    const all = (rows ?? []) as Array<{
      status: string | null;
      refund_amount: number | string | null;
      processed_at: string | null;
      created_at: string | null;
    }>;
    const num = (v: number | string | null | undefined) => (v == null ? 0 : Number(v) || 0);
    const isProc = (r: (typeof all)[number]) => Boolean(r.processed_at || r.status === "processed");
    const byStatus = (s: string) => all.filter((r) => !isProc(r) && (r.status ?? "pending") === s);
    const sum = (arr: typeof all) => arr.reduce((a, r) => a + num(r.refund_amount), 0);
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    return {
      totals: {
        all: all.length,
        pending: byStatus("pending").length,
        info_needed: byStatus("info_needed").length,
        escalated: byStatus("escalated").length,
        approved: byStatus("approved").length,
        rejected: byStatus("rejected").length,
        processed: all.filter(isProc).length,
      },
      amounts: {
        pending: sum(byStatus("pending")),
        approved: sum(byStatus("approved")),
        processedThisMonth: all
          .filter(
            (r) =>
              isProc(r) &&
              r.processed_at &&
              new Date(r.processed_at).getMonth() === new Date().getMonth() &&
              new Date(r.processed_at).getFullYear() === new Date().getFullYear(),
          )
          .reduce((a, r) => a + num(r.refund_amount), 0),
        totalProcessed: all
          .filter(isProc)
          .reduce((a, r) => a + num(r.refund_amount), 0),
      },
      agingPending: {
        under24h: byStatus("pending").filter(
          (r) => r.created_at && now - new Date(r.created_at).getTime() < dayMs,
        ).length,
        over24h: byStatus("pending").filter(
          (r) => r.created_at && now - new Date(r.created_at).getTime() >= dayMs && now - new Date(r.created_at).getTime() < 3 * dayMs,
        ).length,
        over72h: byStatus("pending").filter(
          (r) => r.created_at && now - new Date(r.created_at).getTime() >= 3 * dayMs,
        ).length,
      },
    };
  });

/** Search + filter refund requests. Returns rows joined with lead + application + customer. */
export const listRefundsAdvanced = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      status: z.enum(["all", "pending", "info_needed", "escalated", "approved", "rejected", "processed"]).default("all"),
      search: z.string().max(120).optional(),
      limit: z.number().int().min(1).max(200).default(100),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await requireStaff(context.supabase, context.userId);
    const admin = await getAdmin();
    let q = admin
      .from("refund_requests")
      .select(
        "id, application_id, lead_id, reason, refund_amount, refund_mode, deduction_amount, deduction_reason, gateway_ref, gateway_name, status, admin_notes, customer_notes, created_at, decided_at, processed_at, info_needed_note, escalation_note, application:applications(id, application_code, order_status, service_id, refund_processed_at), lead:leads(id, name, email, mobile, service, lead_code)",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status === "processed") {
      q = q.or("processed_at.not.is.null,status.eq.processed");
    } else if (data.status === "approved") {
      q = q.eq("status", "approved").is("processed_at", null);
    } else if (data.status !== "all") {
      q = q.eq("status", data.status);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const filtered = data.search?.trim()
      ? (rows ?? []).filter((r: any) => {
          const s = data.search!.toLowerCase();
          return (
            r.lead?.name?.toLowerCase().includes(s) ||
            r.lead?.email?.toLowerCase().includes(s) ||
            r.lead?.mobile?.includes(s) ||
            r.application?.application_code?.toLowerCase().includes(s) ||
            r.reason?.toLowerCase().includes(s)
          );
        })
      : rows ?? [];
    return { rows: filtered };
  });

/** Full detail for a single refund request: joined data + payments on the order + event timeline. */
export const getRefundDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    await requireStaff(context.supabase, context.userId);
    const admin = await getAdmin();
    const { data: req, error } = await admin
      .from("refund_requests")
      .select(
        "*, application:applications(id, application_code, order_status, fulfillment_status, service_id, customer_id, refund_processed_at, refund_gateway_ref), lead:leads(id, name, email, mobile, service, state, lead_code, base_amount, gst_amount, total_amount)",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!req) throw new Error("Refund request not found");
    const appId = (req as any).application_id as string;
    const [{ data: rawPayments }, { data: events }, { data: customer }] = await Promise.all([
      admin
        .from("payments")
        .select("id, amount, currency, status, gateway_name, transaction_id, payment_date, parent_payment_id, refund_reason, created_at")
        .eq("application_id", appId)
        .order("created_at", { ascending: false }),
      admin
        .from("refund_request_events")
        .select("id, action, note, meta, actor_id, actor_name, actor_role, created_at")
        .eq("request_id", data.id)
        .order("created_at", { ascending: true }),
      (req as any).application?.customer_id
        ? admin
            .from("customers")
            .select("id, name, primary_email, primary_mobile, state, customer_code")
            .eq("id", (req as any).application.customer_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    // Self-healing: if application has refund_processed_at but refund_requests row has null processed_at
    if (!req.processed_at && (req as any).application?.refund_processed_at) {
      const pAt = (req as any).application.refund_processed_at;
      req.processed_at = pAt;
      if (!req.gateway_ref && (req as any).application.refund_gateway_ref) {
        req.gateway_ref = (req as any).application.refund_gateway_ref;
      }
      admin
        .from("refund_requests")
        .update({
          processed_at: pAt,
          gateway_ref: req.gateway_ref ?? (req as any).application?.refund_gateway_ref,
        } as never)
        .eq("id", req.id)
        .then(() => {});
    }

    // Deduplicate negative payments if multiple identical negative rows were inserted
    const payments = rawPayments ?? [];
    const negPayments = payments.filter((p) => Number(p.amount) < 0);
    let cleanedPayments = payments;
    if (negPayments.length > 1) {
      const dupNegIds = negPayments.slice(1).map((p) => p.id);
      cleanedPayments = payments.filter((p) => !dupNegIds.includes(p.id));
      // Delete superfluous duplicates from DB
      admin.from("payments").delete().in("id", dupNegIds).then(() => {});
    }

    return {
      request: req,
      payments: cleanedPayments,
      events: events ?? [],
      customer: customer ?? null,
    };
  });
