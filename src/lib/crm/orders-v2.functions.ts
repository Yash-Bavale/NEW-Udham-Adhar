// Order Management server functions (Phase 2).
// Built fresh alongside legacy orders.functions.ts. Once /admin/applications
// is fully retired the legacy file can be removed.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  FULFILLMENT_STAGES,
  type FulfillmentStatus,
  getAllowedFulfillmentTransitions,
} from "./fulfillment-transitions";
import { computeOrderStage } from "./computeOrderStage";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function assertStaff(supabase: any) {
  const { data } = await supabase.from("user_roles").select("role").limit(50);
  const roles = new Set((data ?? []).map((r: any) => r.role));
  const allowed = ["admin", "super_admin", "operations", "support", "accounts", "finance", "executive", "manager"];
  if (!allowed.some((r) => roles.has(r))) throw new Error("Forbidden");
}

async function getStaff(userId: string) {
  const admin = await getAdmin();
  const [{ data: p }, { data: rr }] = await Promise.all([
    admin.from("profiles").select("display_name, email").eq("id", userId).maybeSingle(),
    admin.from("user_roles").select("role").eq("user_id", userId).limit(1).maybeSingle(),
  ]);
  return {
    staff_name: (p?.display_name as string) || (p?.email as string) || "Staff",
    staff_role: (rr?.role as string) || "staff",
  };
}

export type OrderPaymentRollup = "Pending" | "Paid" | "Partially Paid" | "Refunded" | "Failed";

function rollupPaymentStatus(payments: Array<{ status: string; amount: number }>, total: number): OrderPaymentRollup {
  if (!payments.length) return "Pending";
  const positives = payments.filter((p) => Number(p.amount || 0) >= 0);
  const refunds = payments.filter((p) => Number(p.amount || 0) < 0 || p.status === "refunded");
  if (refunds.length && positives.every((p) => p.status === "refunded")) return "Refunded";
  const paidSum = positives
    .filter((p) => ["paid", "success", "successful"].includes(p.status))
    .reduce((s, p) => s + Number(p.amount || 0), 0);
  if (paidSum <= 0) {
    if (positives.some((p) => ["failed", "cancelled"].includes(p.status))) return "Failed";
    return "Pending";
  }
  if (total > 0 && paidSum < total - 0.01) return "Partially Paid";
  return "Paid";
}

/* ----------------------------- listOrders ------------------------------- */

export const listOrdersV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(25),
        fulfillmentStatus: z.string().optional(),
        serviceId: z.string().uuid().optional(),
        assignedTo: z.string().uuid().optional(),
        paymentStatus: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        search: z.string().max(120).optional(),
      })
      .parse(i ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();

    // Orders surface = applications with at least one successful payment.
    // Pre-resolve paid application IDs from the payments table, then filter.
    const { data: paidRows, error: paidErr } = await admin
      .from("payments")
      .select("application_id")
      .eq("status", "paid")
      .not("application_id", "is", null);
    if (paidErr) throw new Error(paidErr.message);
    const paidAppIds = Array.from(
      new Set((paidRows ?? []).map((r: any) => r.application_id).filter(Boolean)),
    ) as string[];

    if (paidAppIds.length === 0) {
      return { rows: [], total: 0, page: data.page, pageSize: data.pageSize };
    }

    let q = admin
      .from("applications")
      .select(
        "id, application_code, fulfillment_status, application_status, created_at, assigned_to, lead_id, customer_id, service_id, form_submitted_at, certificate_uploaded_at",
        { count: "exact" },
      )
      .eq("is_deleted", false)
      .in("id", paidAppIds)
      .order("created_at", { ascending: false });

    if (data.fulfillmentStatus) q = q.eq("fulfillment_status", data.fulfillmentStatus as never);
    if (data.serviceId) q = q.eq("service_id", data.serviceId);
    if (data.assignedTo) q = q.eq("assigned_to", data.assignedTo);
    if (data.dateFrom) q = q.gte("created_at", data.dateFrom);
    if (data.dateTo) q = q.lte("created_at", data.dateTo);

    const { data: apps, count, error } = await q.range(
      (data.page - 1) * data.pageSize,
      data.page * data.pageSize - 1,
    );
    if (error) throw new Error(error.message);
    const appList = apps ?? [];

    const ids = appList.map((a) => a.id);
    const leadIds = Array.from(new Set(appList.map((a) => a.lead_id).filter(Boolean))) as string[];
    const customerIds = Array.from(new Set(appList.map((a) => a.customer_id).filter(Boolean))) as string[];
    const serviceIds = Array.from(new Set(appList.map((a) => a.service_id).filter(Boolean))) as string[];
    const staffIds = Array.from(new Set(appList.map((a) => a.assigned_to).filter(Boolean))) as string[];

    const [leadsRes, custsRes, svcsRes, paysRes, staffRes] = await Promise.all([
      leadIds.length
        ? admin.from("leads").select("id, name, email, mobile, total_amount, lead_status_v2, lead_code, status, lead_source, service").in("id", leadIds)
        : Promise.resolve({ data: [] as any[] }),
      customerIds.length
        ? admin.from("customers").select("id, name, primary_mobile, primary_email").in("id", customerIds)
        : Promise.resolve({ data: [] as any[] }),
      serviceIds.length
        ? admin.from("services").select("id, service_name").in("id", serviceIds)
        : Promise.resolve({ data: [] as any[] }),
      ids.length
        ? admin.from("payments").select("application_id, status, amount, payment_date").in("application_id", ids)
        : Promise.resolve({ data: [] as any[] }),
      staffIds.length
        ? admin.from("profiles").select("id, display_name, email").in("id", staffIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const leadMap = new Map((leadsRes.data ?? []).map((l: any) => [l.id, l]));
    const custMap = new Map((custsRes.data ?? []).map((c: any) => [c.id, c]));
    const svcMap  = new Map((svcsRes.data  ?? []).map((s: any) => [s.id, s]));
    const staffMap = new Map((staffRes.data ?? []).map((s: any) => [s.id, s]));
    const payByApp = new Map<string, Array<{ status: string; amount: number }>>();
    const paidAtByApp = new Map<string, string>();
    for (const p of paysRes.data ?? []) {
      const arr = payByApp.get(p.application_id) ?? [];
      arr.push({ status: p.status as string, amount: Number(p.amount || 0) });
      payByApp.set(p.application_id, arr);
      if (["paid", "success", "successful"].includes(String(p.status)) && (p as any).payment_date) {
        const prev = paidAtByApp.get(p.application_id);
        const cur = (p as any).payment_date as string;
        if (!prev || cur < prev) paidAtByApp.set(p.application_id, cur);
      }
    }

    let rows = appList.map((a) => {
      const lead = leadMap.get(a.lead_id);
      const cust = a.customer_id ? custMap.get(a.customer_id) : null;
      const svc = a.service_id ? svcMap.get(a.service_id) : null;
      const staff = a.assigned_to ? staffMap.get(a.assigned_to) : null;
      const total = Number(lead?.total_amount || 0);
      const payments = payByApp.get(a.id) ?? [];
      return {
        id: a.id,
        application_code: a.application_code,
        fulfillment_status: (a.fulfillment_status ?? "order_received") as FulfillmentStatus,
        lead_status_v2: lead?.lead_status_v2 ?? null,
        created_at: a.created_at,
        lead_id: a.lead_id,
        lead_code: lead?.lead_code ?? null,
        customer_id: a.customer_id,
        customer_name: cust?.name ?? lead?.name ?? "—",
        customer_mobile: cust?.primary_mobile ?? lead?.mobile ?? null,
        customer_email: cust?.primary_email ?? lead?.email ?? null,
        service_id: a.service_id,
        service_name: svc?.service_name ?? null,
        total_amount: total,
        payment_status: rollupPaymentStatus(payments, total),
        assigned_to: a.assigned_to,
        assigned_name: staff?.display_name ?? staff?.email ?? null,
        stage: computeOrderStage(
          { lead_status_v2: lead?.lead_status_v2, status: lead?.status, payment_successful_at: paidAtByApp.get(a.id) ?? null },
          { form_submitted_at: a.form_submitted_at, certificate_uploaded_at: a.certificate_uploaded_at, fulfillment_status: a.fulfillment_status, application_status: a.application_status },
        ),
      };
    });

    if (data.paymentStatus) rows = rows.filter((r) => r.payment_status === data.paymentStatus);
    if (data.search) {
      const s = data.search.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.application_code ?? "").toLowerCase().includes(s) ||
          (r.customer_name ?? "").toLowerCase().includes(s) ||
          (r.customer_mobile ?? "").includes(s) ||
          (r.lead_code ?? "").toLowerCase().includes(s),
      );
    }

    return { rows, total: count ?? 0 };
  });

/* ----------------------------- getOrderDetail --------------------------- */

export const getOrderDetailV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ orderId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();

    const { data: app, error } = await admin
      .from("applications")
      .select("*")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error || !app) throw new Error("Order not found");

    const [leadRes, custRes, svcRes, paysRes, docsRes, evRes, staffRes, wfRes] = await Promise.all([
      app.lead_id
        ? admin.from("leads").select("id, lead_code, name, email, mobile, total_amount, base_amount, gst_amount, lead_status_v2, status, lead_source, service").eq("id", app.lead_id).maybeSingle()
        : Promise.resolve({ data: null }),
      app.customer_id
        ? admin.from("customers").select("id, customer_code, name, primary_email, primary_mobile").eq("id", app.customer_id).maybeSingle()
        : Promise.resolve({ data: null }),
      app.service_id
        ? admin.from("services").select("id, service_code, service_name").eq("id", app.service_id).maybeSingle()
        : Promise.resolve({ data: null }),
      admin
        .from("payments")
        .select("id, status, amount, gateway_name, transaction_id, payment_date, created_at, parent_payment_id, refund_reason, currency")
        .eq("application_id", data.orderId)
        .order("created_at", { ascending: false }),
      admin
        .from("documents")
        .select("id, doc_type, file_path, file_name, mime_type, size_bytes, status, uploaded_at, created_at")
        .eq("application_id", data.orderId)
        .order("created_at", { ascending: false }),
      admin
        .from("application_events")
        .select("id, event_type, old_value, new_value, note, staff_name, staff_role, created_at")
        .eq("application_id", data.orderId)
        .order("created_at", { ascending: false })
        .limit(200),
      app.assigned_to
        ? admin.from("profiles").select("id, display_name, email").eq("id", app.assigned_to).maybeSingle()
        : Promise.resolve({ data: null }),
      app.service_id
        ? admin.from("services").select("service_code").eq("id", app.service_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    // Look up service_workflows by service_code if present
    let workflowStages: string[] = FULFILLMENT_STAGES;
    if ((wfRes as any).data?.service_code) {
      const { data: wf } = await admin
        .from("service_workflows")
        .select("application_statuses")
        .eq("service_code", (wfRes as any).data.service_code)
        .maybeSingle();
      const arr = (wf?.application_statuses as any[] | null) ?? null;
      if (Array.isArray(arr) && arr.length) {
        workflowStages = arr.map((s) => (typeof s === "string" ? s : s?.code ?? s?.id ?? "")).filter(Boolean);
      }
    }

    const lead = (leadRes as any).data;
    const total = Number(lead?.total_amount || 0);
    let payments = (paysRes.data ?? []) as any[];
    // Enrich with invoice_id so admin actions know which invoice to email/download.
    if (payments.length > 0) {
      const payIds = payments.map((p) => p.id);
      const { data: invs } = await admin
        .from("invoices")
        .select("id, payment_id, invoice_number, pdf_path, issued_at, last_emailed_at, email_attempts, last_email_status, delivery_status, replaced_at")
        .in("payment_id", payIds);
      const map = new Map((invs ?? []).map((i: any) => [i.payment_id, i]));
      payments = payments.map((p) => {
        const inv: any = map.get(p.id);
        return {
          ...p,
          invoice_id: inv?.id ?? null,
          invoice_number: inv?.invoice_number ?? null,
          invoice_issued_at: inv?.issued_at ?? null,
          invoice_last_emailed_at: inv?.last_emailed_at ?? null,
          invoice_email_attempts: inv?.email_attempts ?? 0,
          invoice_last_email_status: inv?.last_email_status ?? null,
          invoice_delivery_status: inv?.delivery_status ?? null,
          invoice_replaced_at: inv?.replaced_at ?? null,
          has_pdf: !!inv?.pdf_path,
        };
      });
    }
    const paymentStatus = rollupPaymentStatus(
      payments.map((p) => ({ status: String(p.status), amount: Number(p.amount || 0) })),
      total,
    );


    // Build per-stage timestamps + actor from application_events
    const stageEvents = (evRes.data ?? []).filter((e: any) => e.event_type === "status_change");
    const stageMeta: Record<string, { at: string; staff_name: string | null }> = {};
    for (const ev of stageEvents) {
      const key = ev.new_value as string;
      if (key && !stageMeta[key]) stageMeta[key] = { at: (ev.created_at as string) ?? "", staff_name: ev.staff_name ?? null };
    }
    // Seed `order_received` from the application's own created_at when missing
    if (!stageMeta["order_received"]) {
      stageMeta["order_received"] = { at: app.created_at as string, staff_name: null };
    }

    return {
      application: app,
      lead,
      customer: (custRes as any).data,
      service: (svcRes as any).data,
      payments,
      paymentStatus,
      total,
      documents: docsRes.data ?? [],
      events: evRes.data ?? [],
      assignedStaff: (staffRes as any).data ?? null,
      workflowStages,
      stageMeta,
    };
  });

/* ----------------------------- updateOrderAssignee ---------------------- */

export const updateOrderAssignee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ orderId: z.string().uuid(), assignedTo: z.string().uuid().nullable() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();
    const { error } = await admin
      .from("applications")
      .update({ assigned_to: data.assignedTo } as never)
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ----------------------------- updateFulfillmentStatus ------------------ */

export const updateFulfillmentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        toStatus: z.string(),
        note: z.string().max(2000).optional(),
        // Required when transitioning to `completed`
        certificateDocumentId: z.string().uuid().optional(),
        certificateNumber: z.string().trim().min(1).max(120).optional(),
        completionNotes: z.string().trim().max(2000).optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();

    const { data: app } = await admin
      .from("applications")
      .select("id, application_code, fulfillment_status, lead_id, customer_id, service_id")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!app) throw new Error("Order not found");

    const current = (app.fulfillment_status ?? "order_received") as FulfillmentStatus;
    const target = data.toStatus as FulfillmentStatus;
    if (current === target) return { ok: true, noop: true };

    const allowed = getAllowedFulfillmentTransitions(current);
    if (!allowed.includes(target)) {
      throw new Error(`Invalid transition: ${current} → ${target}`);
    }

    if (target === "completed") {
      if (!data.certificateDocumentId) {
        throw new Error("Certificate upload required before marking complete.");
      }
      if (!data.certificateNumber || !data.certificateNumber.trim()) {
        throw new Error("Certificate / document number is required to complete this order.");
      }
    }

    // Update fulfillment status (trigger logs `status_change` event).
    const upd: Record<string, unknown> = { fulfillment_status: target };
    const { error: upErr } = await admin.from("applications").update(upd as never).eq("id", data.orderId);
    if (upErr) throw new Error(upErr.message);

    const { staff_name, staff_role } = await getStaff(context.userId);

    if (data.note) {
      await admin.from("application_events").insert({
        application_id: data.orderId,
        lead_id: app.lead_id,
        customer_id: app.customer_id ?? null,
        event_type: "note_added",
        note: data.note,
        created_by: context.userId,
        staff_name,
        staff_role,
      } as never);
    }

    if (target === "completed") {
      const certNumber = data.certificateNumber!.trim();
      const completionNotes = data.completionNotes?.trim() || null;
      const now = new Date().toISOString();

      // Mark application_status completed too (for legacy consumers) and set fulfilled_at.
      await admin
        .from("applications")
        .update({
          application_status: "completed",
          fulfilled_at: now,
          documents_deleted_reason: "completed",
        } as never)
        .eq("id", data.orderId);

      // Lookup the uploaded certificate document so we can mirror it into
      // the `certificates` table (single source of truth for history & resend).
      const { data: certDoc } = await admin
        .from("documents")
        .select("id, file_path, file_name, mime_type")
        .eq("id", data.certificateDocumentId!)
        .maybeSingle();

      let certificateId: string | null = null;
      if (certDoc) {
        const { data: certRow, error: certErr } = await admin
          .from("certificates")
          .insert({
            application_id: data.orderId,
            lead_id: app.lead_id,
            customer_id: app.customer_id ?? null,
            certificate_number: certNumber,
            file_path: certDoc.file_path,
            file_name: certDoc.file_name,
            mime_type: certDoc.mime_type,
            issued_at: now,
            uploaded_by: context.userId,
          } as never)
          .select("id")
          .single();
        if (certErr) {
          console.error("[fulfillment.complete] certificate insert failed:", certErr);
        } else {
          certificateId = (certRow as { id: string }).id;
        }
      }

      // Wipe other docs via the existing edge function.
      try {
        await admin.functions.invoke("delete-order-documents", {
          body: {
            application_id: data.orderId,
            reason: "completed",
            keep_document_id: data.certificateDocumentId,
          },
        });
      } catch (e) {
        console.error("delete-order-documents invocation failed:", e);
      }

      // Close the parent lead (trigger logs lead_status_change automatically).
      if (app.lead_id) {
        await admin
          .from("leads")
          .update({ lead_status_v2: "closed" } as never)
          .eq("id", app.lead_id);
      }

      // Build certificate delivery email — signed URL valid 7 days.
      const [{ data: lead }, { data: customer }, { data: service }] = await Promise.all([
        app.lead_id
          ? admin.from("leads").select("name, email, mobile, service").eq("id", app.lead_id).maybeSingle()
          : Promise.resolve({ data: null as null | { name: string | null; email: string | null; mobile: string | null; service: string | null } }),
        app.customer_id
          ? admin.from("customers").select("name, primary_email, primary_mobile").eq("id", app.customer_id).maybeSingle()
          : Promise.resolve({ data: null as null | { name: string | null; primary_email: string | null; primary_mobile: string | null } }),
        app.service_id
          ? admin.from("services").select("service_name, service_code").eq("id", app.service_id).maybeSingle()
          : Promise.resolve({ data: null as null | { service_name: string | null; service_code: string | null } }),
      ]);

      const recipientEmail = customer?.primary_email || lead?.email || null;
      const recipientName = customer?.name || lead?.name || "Customer";
      const serviceName = service?.service_name || lead?.service || "Service";

      let certificateUrl: string | null = null;
      let certAttachment: { filename: string; content_type: string; content_base64: string } | null = null;
      if (certDoc?.file_path) {
        const { data: signed } = await admin.storage
          .from("documents")
          .createSignedUrl(certDoc.file_path, 60 * 60 * 24 * 7);
        certificateUrl = signed?.signedUrl ?? null;

        try {
          const { data: blob, error: dlErr } = await admin.storage
            .from("documents")
            .download(certDoc.file_path);
          if (dlErr) throw dlErr;
          if (blob) {
            const buf = Buffer.from(await blob.arrayBuffer());
            if (buf.byteLength <= 9 * 1024 * 1024) {
              const ext = (certDoc.file_name?.split(".").pop() || "pdf").toLowerCase();
              certAttachment = {
                filename: `${certNumber || app.application_code || "certificate"}.${ext}`,
                content_type: certDoc.mime_type || "application/octet-stream",
                content_base64: buf.toString("base64"),
              };
            } else {
              console.warn("[certificate] attachment skipped: file >9MB", buf.byteLength);
            }
          }
        } catch (e) {
          console.warn("[certificate] attachment skipped: download failed", e);
        }
      }

      if (recipientEmail && certificateUrl) {
        await admin.from("email_queue").insert({
          template_code: "certificate_delivery",
          to_email: recipientEmail,
          to_name: recipientName,
          subject: `Your ${serviceName} is complete — Certificate ${certNumber}`,
          body_html: buildCertificateEmailHtml({
            recipientName,
            serviceName,
            certificateNumber: certNumber,
            certificateUrl,
            completionNotes,
            orderCode: app.application_code ?? "",
          }),
          lead_id: app.lead_id,
          application_id: data.orderId,
          variables: {
            customer_name: recipientName,
            service_name: serviceName,
            certificate_number: certNumber,
            certificate_url: certificateUrl,
            completion_notes: completionNotes ?? "",
            order_code: app.application_code ?? "",
            ...(certAttachment ? { __attachments: [certAttachment] } : {}),
          },
          created_by: context.userId,
        } as never);
      }


      await admin.from("application_events").insert({
        application_id: data.orderId,
        lead_id: app.lead_id,
        customer_id: app.customer_id ?? null,
        event_type: "application_completed",
        new_value: "completed",
        note:
          `Application completed. Certificate ${certNumber}` +
          (recipientEmail ? ` queued to ${recipientEmail}` : " (no email on file)") +
          (completionNotes ? `. Notes: ${completionNotes}` : "."),
        created_by: context.userId,
        staff_name,
        staff_role,
      } as never);

      return {
        ok: true,
        certificateId,
        certificateNumber: certNumber,
        emailQueuedTo: recipientEmail,
      };
    }

    return { ok: true };
  });

/** Resend the latest certificate for an order. Generates a fresh 7-day signed URL. */
export const resendOrderCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ orderId: z.string().uuid() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();

    const { data: cert, error: certErr } = await admin
      .from("certificates")
      .select("id, file_path, file_name, mime_type, certificate_number, lead_id, customer_id, application_id")
      .eq("application_id", data.orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (certErr) throw new Error(certErr.message);
    if (!cert) throw new Error("No certificate has been issued for this order yet.");
    if (!cert.file_path) throw new Error("Certificate file is missing — cannot resend.");

    const { data: signed } = await admin.storage
      .from("documents")
      .createSignedUrl(cert.file_path, 60 * 60 * 24 * 7);
    if (!signed?.signedUrl) throw new Error("Could not generate a fresh download link.");

    let resendAttachment: { filename: string; content_type: string; content_base64: string } | null = null;
    try {
      const { data: blob, error: dlErr } = await admin.storage
        .from("documents")
        .download(cert.file_path);
      if (dlErr) throw dlErr;
      if (blob) {
        const buf = Buffer.from(await blob.arrayBuffer());
        if (buf.byteLength <= 9 * 1024 * 1024) {
          const ext = ((cert as any).file_name?.split(".").pop() || "pdf").toLowerCase();
          resendAttachment = {
            filename: `${cert.certificate_number || "certificate"}.${ext}`,
            content_type: (cert as any).mime_type || "application/octet-stream",
            content_base64: buf.toString("base64"),
          };
        } else {
          console.warn("[certificate.resend] attachment skipped: file >9MB", buf.byteLength);
        }
      }
    } catch (e) {
      console.warn("[certificate.resend] attachment skipped: download failed", e);
    }


    const [{ data: app }, { data: customer }, { data: lead }] = await Promise.all([
      admin.from("applications").select("application_code, service_id, lead_id, customer_id").eq("id", data.orderId).maybeSingle(),
      cert.customer_id
        ? admin.from("customers").select("name, primary_email").eq("id", cert.customer_id).maybeSingle()
        : Promise.resolve({ data: null as null | { name: string | null; primary_email: string | null } }),
      cert.lead_id
        ? admin.from("leads").select("name, email, service").eq("id", cert.lead_id).maybeSingle()
        : Promise.resolve({ data: null as null | { name: string | null; email: string | null; service: string | null } }),
    ]);

    const serviceRow = app?.service_id
      ? (await admin.from("services").select("service_name").eq("id", app.service_id).maybeSingle()).data
      : null;

    const recipientEmail = customer?.primary_email || lead?.email || null;
    const recipientName = customer?.name || lead?.name || "Customer";
    const serviceName = serviceRow?.service_name || lead?.service || "Service";

    if (!recipientEmail) {
      throw new Error("No email address on file for this customer — cannot resend certificate.");
    }

    await admin.from("email_queue").insert({
      template_code: "certificate_delivery",
      to_email: recipientEmail,
      to_name: recipientName,
      subject: `[Resent] Your ${serviceName} certificate — ${cert.certificate_number ?? ""}`,
      body_html: buildCertificateEmailHtml({
        recipientName,
        serviceName,
        certificateNumber: cert.certificate_number ?? "",
        certificateUrl: signed.signedUrl,
        completionNotes: null,
        orderCode: app?.application_code ?? "",
        resend: true,
      }),
      lead_id: cert.lead_id,
      application_id: data.orderId,
      variables: {
        customer_name: recipientName,
        service_name: serviceName,
        certificate_number: cert.certificate_number,
        certificate_url: signed.signedUrl,
        resend: true,
        ...(resendAttachment ? { __attachments: [resendAttachment] } : {}),
      },
      created_by: context.userId,
    } as never);


    const { staff_name, staff_role } = await getStaff(context.userId);
    await admin.from("application_events").insert({
      application_id: data.orderId,
      lead_id: cert.lead_id,
      customer_id: cert.customer_id ?? null,
      event_type: "certificate_resent",
      note: `Certificate ${cert.certificate_number ?? ""} resent to ${recipientEmail}.`,
      created_by: context.userId,
      staff_name,
      staff_role,
    } as never);

    return { ok: true, resentTo: recipientEmail };
  });

function buildCertificateEmailHtml(opts: {
  recipientName: string;
  serviceName: string;
  certificateNumber: string;
  certificateUrl: string;
  completionNotes: string | null;
  orderCode: string;
  resend?: boolean;
}): string {
  const notesBlock = opts.completionNotes
    ? `<p style="margin:16px 0 0 0;padding:12px;background:#f8fafc;border-left:3px solid #0f3460;color:#334155;font-size:13px">
         <strong>Note from our team:</strong><br/>${escapeHtml(opts.completionNotes)}
       </p>`
    : "";
  const resendBanner = opts.resend
    ? `<p style="margin:0 0 16px 0;padding:10px;background:#fef3c7;border:1px solid #fde68a;border-radius:6px;color:#92400e;font-size:12px">
         This is a fresh copy of your certificate, sent again at your request.
       </p>`
    : "";
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0f172a">
      ${resendBanner}
      <h2 style="color:#0f3460;margin:0 0 12px 0">Your ${escapeHtml(opts.serviceName)} is complete</h2>
      <p>Dear ${escapeHtml(opts.recipientName)},</p>
      <p>Congratulations — your application has been successfully processed.</p>
      <p style="margin:16px 0 8px 0"><strong>Certificate / Document Number:</strong><br/>
        <span style="font-family:monospace;font-size:15px;color:#0f3460">${escapeHtml(opts.certificateNumber)}</span>
      </p>
      <p style="text-align:center;margin:28px 0">
        <a href="${opts.certificateUrl}"
           style="background:#0f3460;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block">
          Download Certificate
        </a>
      </p>
      <p style="font-size:12px;color:#64748b;margin:0">This download link is valid for 7 days. Save the file locally for future reference.</p>
      ${notesBlock}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
      <p style="font-size:12px;color:#94a3b8;margin:0">Order: ${escapeHtml(opts.orderCode || "—")}</p>
    </div>`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


/* ----------------------------- Document upload (cert + internal) -------- */

const MAX_DOC_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME = [
  "application/pdf",
  "image/jpeg", "image/jpg", "image/png", "image/webp",
];

export const requestOrderDocumentUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        docType: z.string().trim().min(1).max(60),
        fileName: z.string().trim().min(1).max(200),
        mimeType: z.string().trim().min(1).max(120),
        sizeBytes: z.number().int().min(1).max(MAX_DOC_BYTES),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    if (!ALLOWED_MIME.includes(data.mimeType.toLowerCase())) {
      throw new Error("Unsupported file type. Use PDF, JPG, PNG or WEBP.");
    }
    const admin = await getAdmin();
    const ext = (data.fileName.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) || "bin";
    const safe = data.docType.replace(/[^a-z0-9_-]/gi, "_").slice(0, 40);
    const path = `orders/${data.orderId}/${safe}-${Date.now()}.${ext}`;
    const { data: signed, error } = await admin.storage.from("documents").createSignedUploadUrl(path);
    if (error || !signed) throw new Error(error?.message ?? "Could not start upload.");
    return { path, token: signed.token, signedUrl: signed.signedUrl };
  });

export const confirmOrderDocumentUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        docType: z.string().trim().min(1).max(60),
        filePath: z.string().min(1).max(400),
        fileName: z.string().min(1).max(200),
        mimeType: z.string().min(1).max(120),
        sizeBytes: z.number().int().min(1).max(MAX_DOC_BYTES),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();
    const { data: app } = await admin
      .from("applications")
      .select("lead_id")
      .eq("id", data.orderId)
      .maybeSingle();

    const { data: row, error } = await admin
      .from("documents")
      .insert({
        application_id: data.orderId,
        lead_id: app?.lead_id ?? null,
        doc_type: data.docType,
        file_path: data.filePath,
        file_name: data.fileName,
        mime_type: data.mimeType,
        size_bytes: data.sizeBytes,
        status: "uploaded",
        uploaded_at: new Date().toISOString(),
      } as never)
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const { staff_name, staff_role } = await getStaff(context.userId);
    await admin.from("application_events").insert({
      application_id: data.orderId,
      lead_id: app?.lead_id ?? null,
      event_type: "document_uploaded",
      note: `${data.docType}: ${data.fileName}`,
      created_by: context.userId,
      staff_name,
      staff_role,
    } as never);

    return { documentId: (row as any).id as string };
  });

export const getOrderDocumentSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ path: z.string().min(1) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();
    const { data: signed, error } = await admin.storage.from("documents").createSignedUrl(data.path, 600);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });

export const addOrderNoteV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ orderId: z.string().uuid(), note: z.string().trim().min(1).max(2000) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();
    const { data: app } = await admin
      .from("applications")
      .select("lead_id, customer_id")
      .eq("id", data.orderId)
      .maybeSingle();
    const { staff_name, staff_role } = await getStaff(context.userId);
    const { error } = await admin.from("application_events").insert({
      application_id: data.orderId,
      lead_id: app?.lead_id ?? null,
      customer_id: app?.customer_id ?? null,
      event_type: "note_added",
      note: data.note,
      created_by: context.userId,
      staff_name,
      staff_role,
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
