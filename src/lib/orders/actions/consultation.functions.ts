// B06 · Consultation Completed
// Stamps S08 (fulfillment = consultation_completed) AND enqueues the E005
// customer email with an operator-provided Note ({{employee_remarks}}) so
// the customer sees exactly what the executive wants them to know.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({
  orderId: z.string().uuid(),
  remarks: z.string().max(2000).optional().nullable(),
});

export const markConsultationCompleted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => Input.parse(raw))
  .handler(async ({ data, context }) => {
    // Staff gate — mirrors updateFulfillmentStatus / other B0x actions.
    const { data: roleRows } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = new Set((roleRows ?? []).map((r: any) => r.role));
    const allowed = ["super_admin", "admin", "operations", "support", "accounts", "finance", "executive", "manager"];
    if (!allowed.some((r) => roles.has(r))) {
      throw new Error("Forbidden");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: app, error: appErr } = await supabaseAdmin
      .from("applications")
      .select("id, application_code, lead_id, customer_id, service_id, fulfillment_status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (appErr) throw new Error(appErr.message);
    if (!app) throw new Error("Order not found");

    // Stamp S08 fulfillment stage (jump allowed for B06 by design).
    if (app.fulfillment_status !== "consultation_completed") {
      const { error: upErr } = await supabaseAdmin
        .from("applications")
        .update({ fulfillment_status: "consultation_completed" } as never)
        .eq("id", data.orderId);
      if (upErr) throw new Error(upErr.message);
    }

    // Resolve customer + service + executive.
    const [{ data: cust }, { data: svc }, { data: prof }] = await Promise.all([
      app.customer_id
        ? supabaseAdmin
            .from("customers")
            .select("name, primary_email, primary_mobile")
            .eq("id", app.customer_id)
            .maybeSingle()
        : Promise.resolve({ data: null } as any),
      app.service_id
        ? supabaseAdmin
            .from("services")
            .select("name")
            .eq("id", app.service_id)
            .maybeSingle()
        : Promise.resolve({ data: null } as any),
      supabaseAdmin
        .from("profiles")
        .select("display_name, full_name, email")
        .eq("id", context.userId)
        .maybeSingle(),
    ]);

    const customerEmail = (cust as any)?.primary_email as string | undefined;
    if (!customerEmail) {
      return { ok: true, emailQueued: false, reason: "no_email" as const };
    }

    // Log timeline event.
    try {
      await supabaseAdmin.from("application_events").insert({
        application_id: app.id,
        lead_id: app.lead_id,
        customer_id: app.customer_id,
        event_type: "consultation_completed",
        note: data.remarks || null,
        created_by: context.userId,
        staff_name:
          ((prof as any)?.display_name as string) ||
          ((prof as any)?.full_name as string) ||
          ((prof as any)?.email as string) ||
          "Staff",
        staff_role: "staff",
      } as never);
    } catch (e) {
      console.warn("[markConsultationCompleted] event log failed (non-fatal)", e);
    }

    // Enqueue E005.
    const istDate = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    const vars = {
      customerName: (cust as any)?.name || "Customer",
      customer_name: (cust as any)?.name || "Customer",
      orderNumber: app.application_code || app.id.slice(0, 8),
      order_number: app.application_code || app.id.slice(0, 8),
      serviceName: (svc as any)?.name || "—",
      service_name: (svc as any)?.name || "—",
      customerEmail,
      customer_email: customerEmail,
      customerMobile: (cust as any)?.primary_mobile || "—",
      customer_mobile: (cust as any)?.primary_mobile || "—",
      closureDate: istDate,
      closure_date: istDate,
      employeeRemarks: (data.remarks && data.remarks.trim()) || "—",
      employee_remarks: (data.remarks && data.remarks.trim()) || "—",
      executiveName:
        ((prof as any)?.display_name as string) ||
        ((prof as any)?.full_name as string) ||
        process.env.ZOHO_FROM_NAME ||
        "Care | Business Help Services",
      executive_name:
        ((prof as any)?.display_name as string) ||
        ((prof as any)?.full_name as string) ||
        process.env.ZOHO_FROM_NAME ||
        "Care | Business Help Services",
      fromName: process.env.ZOHO_FROM_NAME || "Care | Business Help Services",
    };

    const [{ enqueueFromTemplateInternal }, { BHS_EMAILS }] = await Promise.all([
      import("@/lib/emails/emails.server"),
      import("@/lib/emails/bhs-templates"),
    ]);
    try {
      await enqueueFromTemplateInternal(
        BHS_EMAILS.E005_CONSULTATION_SUBMITTED,
        customerEmail,
        vars,
        {
          applicationId: app.id,
          leadId: app.lead_id ?? undefined,
          trigger: "manual",
          requireImmediateSuccess: true,
        },
      );
    } catch (e) {
      console.error("[markConsultationCompleted] E005 enqueue failed", e);
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`E005 email could not be sent: ${msg}`);
    }

    return { ok: true, emailQueued: true };
  });
