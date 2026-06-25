import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole } from "@/lib/audit";
import type { InvoiceData } from "@/lib/invoices/pdf.server";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

// Place of supply / GSTIN for the seller. Override per-environment.
const COMPANY_STATE = (process.env.COMPANY_STATE ?? "Maharashtra").trim();
const COMPANY_GSTIN = (process.env.COMPANY_GSTIN ?? "27COFPD1743E2ZB").trim() || null;

const DEFAULT_SAC = "998311";
const GST_RATE = 18; // %

const BUCKET = "invoices";

/** Append a lifecycle event for an invoice. Never throws — failures are logged. */
async function logInvoiceEvent(
  invoiceId: string,
  eventType: "generated" | "regenerated" | "replaced" | "emailed" | "email_failed" | "delivery_update" | "preview",
  detail: Record<string, unknown> = {},
  actor?: { id?: string | null; label?: string | null },
): Promise<void> {
  try {
    const admin = await getAdmin();
    await (admin as any).from("invoice_events").insert({
      invoice_id: invoiceId,
      event_type: eventType,
      actor_id: actor?.id ?? null,
      actor_label: actor?.label ?? "system",
      detail,
    });
  } catch (e) {
    console.error("[invoice_events] log failed", e);
  }
}

async function generateAndStore(paymentId: string, actor?: { id?: string | null; label?: string | null }): Promise<string> {
  const admin = await getAdmin();

  const { data: payment, error: pErr } = await admin
    .from("payments")
    .select("id, lead_id, application_id, amount, base_amount, gst_amount, gateway_name, transaction_id, payment_date, created_at, status")
    .eq("id", paymentId)
    .single();
  if (pErr || !payment) throw new Error(pErr?.message ?? "Payment not found");
  if (payment.status !== "paid") throw new Error("Invoice can only be generated for paid payments");

  const { data: lead } = await admin
    .from("leads")
    .select("id, lead_code, name, email, mobile, state, service, service_id, gstin")
    .eq("id", payment.lead_id)
    .single();
  if (!lead) throw new Error("Lead not found");

  let applicationCode: string | null = null;
  if (payment.application_id) {
    const { data: app } = await admin
      .from("applications")
      .select("application_code")
      .eq("id", payment.application_id)
      .maybeSingle();
    applicationCode = app?.application_code ?? null;
  }

  let sacCode: string = DEFAULT_SAC;
  if (lead.service_id) {
    const { data: svc } = await admin
      .from("services").select("sac_code").eq("id", lead.service_id).maybeSingle();
    if (svc?.sac_code) sacCode = svc.sac_code;
  }

  const { data: existing } = await admin
    .from("invoices")
    .select("id, invoice_number, pdf_path")
    .eq("payment_id", paymentId)
    .maybeSingle();

  // GST split — pin SNAPSHOTS so future changes to company state don't alter history.
  const customerState = (lead.state ?? "").trim();
  const isIntraState = !!customerState && customerState.toLowerCase() === COMPANY_STATE.toLowerCase();
  const gstTotal = Number(payment.gst_amount);
  const cgst = isIntraState ? gstTotal / 2 : 0;
  const sgst = isIntraState ? gstTotal / 2 : 0;
  const igst = isIntraState ? 0 : gstTotal;
  const cgstRate = isIntraState ? GST_RATE / 2 : 0;
  const sgstRate = isIntraState ? GST_RATE / 2 : 0;
  const igstRate = isIntraState ? 0 : GST_RATE;

  const snapshotFields: Record<string, any> = {
    cgst_amount: cgst, sgst_amount: sgst, igst_amount: igst,
    cgst_rate: cgstRate, sgst_rate: sgstRate, igst_rate: igstRate,
    place_of_supply: customerState || null,
    company_state_snapshot: COMPANY_STATE,
    customer_state_snapshot: customerState || null,
    company_gstin_snapshot: COMPANY_GSTIN,
    customer_gstin_snapshot: lead.gstin ?? null,
    sac_code: sacCode,
  };

  let invoiceId: string;
  let invoiceNumber: string;
  if (existing) {
    invoiceId = existing.id;
    invoiceNumber = existing.invoice_number!;
    if (!existing.pdf_path) {
      await admin.from("invoices").update(snapshotFields as any).eq("id", invoiceId);
    }
  } else {
    const { data: row, error: invErr } = await (admin as any)
      .from("invoices")
      .insert({
        lead_id: payment.lead_id,
        application_id: payment.application_id,
        payment_id: payment.id,
        base_amount: Number(payment.base_amount),
        gst_amount: gstTotal,
        total_amount: Number(payment.amount),
        ...snapshotFields,
      })
      .select("id, invoice_number")
      .single();
    if (invErr || !row) throw new Error(invErr?.message ?? "Could not create invoice");
    invoiceId = row.id;
    invoiceNumber = row.invoice_number!;
  }

  const data: InvoiceData = {
    invoiceNumber,
    invoiceDate: payment.payment_date ? new Date(payment.payment_date) : new Date(payment.created_at),
    customerName: lead.name,
    customerEmail: lead.email,
    customerMobile: lead.mobile,
    customerState: lead.state,
    serviceName: lead.service,
    leadCode: lead.lead_code!,
    applicationCode,
    baseAmount: Number(payment.base_amount),
    gstAmount: Number(payment.gst_amount),
    totalAmount: Number(payment.amount),
    cgstAmount: cgst,
    sgstAmount: sgst,
    igstAmount: igst,
    sacCode,
    placeOfSupply: customerState || null,
    paymentId: payment.transaction_id ?? null,
    gatewayName: payment.gateway_name,
  };

  const { renderInvoicePdf } = await import("@/lib/invoices/pdf.server");
  const pdfBytes = await renderInvoicePdf(data);
  const path = `${new Date(payment.payment_date ?? payment.created_at).getFullYear()}/${invoiceNumber}.pdf`;

  const { error: upErr } = await admin.storage
    .from(BUCKET)
    .upload(path, pdfBytes, { contentType: "application/pdf", upsert: true });
  if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

  await admin.from("invoices").update({
    pdf_path: path,
    pdf_generated_at: new Date().toISOString(),
  }).eq("id", invoiceId);

  await logInvoiceEvent(
    invoiceId,
    existing ? "regenerated" : "generated",
    { invoice_number: invoiceNumber, pdf_path: path, payment_id: paymentId },
    actor,
  );

  return invoiceId;
}

export const generateInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ paymentId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "finance"]);
    const id = await generateAndStore(data.paymentId);
    return { ok: true, invoiceId: id };
  });

// Internal (called from webhook). Same logic, no auth — used right after we
// verify the gateway signature server-to-server.
export async function generateInvoiceInternal(paymentId: string) {
  return generateAndStore(paymentId);
}

/** Load the latest invoice PDF for a payment as a base64 email attachment. */
export async function loadInvoiceAttachmentByPayment(paymentId: string): Promise<
  { filename: string; content_base64: string; content_type: string } | null
> {
  const admin = await getAdmin();
  const { data: inv } = await admin
    .from("invoices")
    .select("invoice_number, pdf_path, application_id, lead_id")
    .eq("payment_id", paymentId)
    .maybeSingle();
  if (!inv?.pdf_path) return null;
  const { data: blob, error } = await admin.storage.from(BUCKET).download(inv.pdf_path);
  if (error || !blob) return null;
  const buf = new Uint8Array(await blob.arrayBuffer());
  // base64 encode
  let bin = "";
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  const b64 = btoa(bin);

  // Pretty file name: prefer order/application code if available.
  let orderRef = inv.invoice_number;
  if (inv.application_id) {
    const { data: app } = await admin
      .from("applications").select("application_code").eq("id", inv.application_id).maybeSingle();
    if (app?.application_code) orderRef = app.application_code;
  } else if (inv.lead_id) {
    const { data: l } = await admin
      .from("leads").select("lead_code").eq("id", inv.lead_id).maybeSingle();
    if (l?.lead_code) orderRef = l.lead_code;
  }
  return {
    filename: `Invoice-${orderRef}.pdf`,
    content_base64: b64,
    content_type: "application/pdf",
  };
}

export const resendInvoiceEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ paymentId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "finance"]);
    const admin = await getAdmin();
    const { data: payment } = await admin
      .from("payments")
      .select("id, lead_id, application_id")
      .eq("id", data.paymentId)
      .single();
    if (!payment) throw new Error("Payment not found");

    const { data: profile } = await context.supabase
      .from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle();
    const actor = { id: context.userId, label: profile?.display_name ?? profile?.email ?? "staff" };

    // Ensure invoice exists (regenerate if missing).
    let attachment = await loadInvoiceAttachmentByPayment(data.paymentId);
    if (!attachment) {
      await generateAndStore(data.paymentId, actor);
      attachment = await loadInvoiceAttachmentByPayment(data.paymentId);
    }
    if (!attachment) throw new Error("Invoice PDF unavailable");

    const { data: lead } = await admin
      .from("leads")
      .select("lead_code, name, email, service, base_amount, gst_amount, total_amount")
      .eq("id", payment.lead_id).single();
    if (!lead?.email) throw new Error("Customer email missing");

    const { data: inv } = await admin
      .from("invoices").select("id, invoice_number").eq("payment_id", data.paymentId).maybeSingle();

    const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
    try {
      await enqueueFromTemplateInternal(
        "payment_success",
        lead.email,
        {
          name: lead.name ?? "",
          customer_name: lead.name ?? "",
          lead_code: lead.lead_code ?? "",
          order_number: lead.lead_code ?? "",
          service: lead.service ?? "",
          service_name: lead.service ?? "",
          invoice_number: inv?.invoice_number ?? "",
          invoice_attachment: attachment.filename,
          base_amount: Number(lead.base_amount ?? 0).toFixed(2),
          gst_amount: Number(lead.gst_amount ?? 0).toFixed(2),
          total_amount: Number(lead.total_amount ?? 0).toFixed(2),
          amount: Number(lead.total_amount ?? 0).toFixed(2),
          support_email: "help@businesshelpservices.com",
        },
        {
          toName: lead.name ?? undefined,
          leadId: payment.lead_id,
          applicationId: payment.application_id ?? undefined,
          attachments: [attachment],
        },
      );
      if (inv?.id) {
        const { data: cur } = await admin.from("invoices").select("email_attempts").eq("id", inv.id).maybeSingle();
        await (admin as any).from("invoices").update({
          last_emailed_at: new Date().toISOString(),
          email_attempts: Number((cur as any)?.email_attempts ?? 0) + 1,
          last_email_status: "queued",
          delivery_status: "queued",
        }).eq("id", inv.id);
        await logInvoiceEvent(inv.id, "emailed", {
          recipient: lead.email,
          attachment: attachment.filename,
          template: "payment_success",
        }, actor);
      }

    } catch (e) {
      if (inv?.id) {
        await (admin as any).from("invoices").update({
          last_email_status: "failed",
          delivery_status: "failed",
        }).eq("id", inv.id);
        await logInvoiceEvent(inv.id, "email_failed", {
          recipient: lead.email,
          error: e instanceof Error ? e.message : String(e),
        }, actor);
      }
      throw e;
    }
    return { ok: true };
  });


export const regenerateInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ invoiceId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId);
    const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance");
    if (!ok) throw new Error("Forbidden");

    const admin = await getAdmin();
    const { data: inv } = await admin
      .from("invoices").select("payment_id, pdf_path").eq("id", data.invoiceId).single();
    if (!inv?.payment_id) throw new Error("Invoice not found");

    // Archive existing pdf path so it's recoverable.
    if (inv.pdf_path) {
      const archivePath = inv.pdf_path.replace(/\.pdf$/, `-${Date.now()}.pdf`).replace(/^/, "archive/");
      try {
        await admin.storage.from(BUCKET).copy(inv.pdf_path, archivePath);
        await (admin as any).rpc("noop").catch(() => null);
        const { data: row } = await admin.from("invoices")
          .select("prev_pdf_paths").eq("id", data.invoiceId).maybeSingle();
        const arr = Array.isArray((row as any)?.prev_pdf_paths) ? (row as any).prev_pdf_paths : [];
        await (admin as any).from("invoices").update({
          prev_pdf_paths: [...arr, archivePath],
        }).eq("id", data.invoiceId);
      } catch (e) {
        console.error("[invoice archive] failed", e);
      }
    }

    const { data: profile } = await context.supabase
      .from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle();
    await generateAndStore(inv.payment_id, {
      id: context.userId,
      label: profile?.display_name ?? profile?.email ?? "staff",
    });
    return { ok: true };
  });

export const getInvoiceSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ invoiceId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId);
    const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance" || r.role === "admin");
    if (!ok) throw new Error("Forbidden");

    const { data: inv } = await (await getAdmin())
      .from("invoices").select("pdf_path, invoice_number").eq("id", data.invoiceId).single();
    if (!inv?.pdf_path) throw new Error("Invoice PDF not generated yet");

    const { data: signed, error } = await (await getAdmin()).storage
      .from(BUCKET).createSignedUrl(inv.pdf_path, 60 * 5);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl, invoiceNumber: inv.invoice_number };
  });

export const listInvoices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId);
    const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance");
    if (!ok) throw new Error("Forbidden");

    const { data, error } = await (await getAdmin())
      .from("invoices")
      .select("id, invoice_number, lead_id, payment_id, total_amount, base_amount, gst_amount, issued_at, pdf_path")
      .order("issued_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

// Customer-facing: get signed URL by leadCode (no auth — scoped to that lead only)
export const getCustomerInvoiceUrl = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ leadCode: z.string().min(3).max(50) }).parse(i))
  .handler(async ({ data }) => {
    const { data: lead } = await (await getAdmin())
      .from("leads").select("id").eq("lead_code", data.leadCode).maybeSingle();
    if (!lead) throw new Error("Lead not found");
    const { data: inv } = await (await getAdmin())
      .from("invoices")
      .select("pdf_path, invoice_number")
      .eq("lead_id", lead.id)
      .order("issued_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!inv?.pdf_path) throw new Error("Invoice not ready yet");
    const { data: signed, error } = await (await getAdmin()).storage
      .from(BUCKET).createSignedUrl(inv.pdf_path, 60 * 10);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl, invoiceNumber: inv.invoice_number };
  });

// ── Admin list functions for /admin/payments and /admin/invoices ─────────

const PageFilters = z.object({
  q: z.string().trim().max(120).optional(),
  status: z.string().optional(),
  gateway: z.string().optional(),
  serviceId: z.string().uuid().optional(),
  gstType: z.enum(["cgst_sgst", "igst"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
});

export const listPaymentsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => PageFilters.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "finance", "accounts"]);
    const admin = await getAdmin();
    const offset = (data.page - 1) * data.pageSize;

    let q = admin
      .from("payments")
      .select(
        "id, created_at, payment_date, amount, base_amount, gst_amount, status, gateway_name, transaction_id, lead_id, application_id",
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    if (data.status) q = q.eq("status", data.status as any);
    if (data.gateway) q = q.eq("gateway_name", data.gateway);
    if (data.from) q = q.gte("created_at", new Date(data.from).toISOString());
    if (data.to) q = q.lte("created_at", new Date(data.to).toISOString());

    const { data: rows, count, error } = await q.range(offset, offset + data.pageSize - 1);
    if (error) throw new Error(error.message);

    const leadIds = [...new Set((rows ?? []).map((r) => r.lead_id))];
    const appIds = [...new Set((rows ?? []).map((r) => r.application_id).filter(Boolean) as string[])];
    const payIds = (rows ?? []).map((r) => r.id);

    const [{ data: leads }, { data: apps }, { data: invs }] = await Promise.all([
      admin.from("leads").select("id, name, email, mobile, lead_code, service, service_id").in("id", leadIds.length ? leadIds : ["00000000-0000-0000-0000-000000000000"]),
      appIds.length
        ? admin.from("applications").select("id, application_code").in("id", appIds)
        : Promise.resolve({ data: [] as any[] }),
      payIds.length
        ? admin.from("invoices").select("id, payment_id, invoice_number, pdf_path").in("payment_id", payIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const leadMap = new Map((leads ?? []).map((l: any) => [l.id, l]));
    const appMap = new Map((apps ?? []).map((a: any) => [a.id, a]));
    const invMap = new Map((invs ?? []).map((i: any) => [i.payment_id, i]));

    let enriched = (rows ?? []).map((r) => {
      const l = leadMap.get(r.lead_id) ?? {};
      const a = r.application_id ? appMap.get(r.application_id) : null;
      const inv = invMap.get(r.id) ?? null;
      return {
        id: r.id,
        created_at: r.created_at,
        payment_date: r.payment_date,
        amount: Number(r.amount),
        base_amount: Number(r.base_amount),
        gst_amount: Number(r.gst_amount),
        status: r.status,
        gateway_name: r.gateway_name,
        transaction_id: r.transaction_id,
        lead_id: r.lead_id,
        application_id: r.application_id,
        application_code: a?.application_code ?? null,
        customer_name: l.name ?? "",
        customer_email: l.email ?? "",
        customer_mobile: l.mobile ?? "",
        lead_code: l.lead_code ?? "",
        service: l.service ?? "",
        service_id: l.service_id ?? null,
        invoice_id: inv?.id ?? null,
        invoice_number: inv?.invoice_number ?? null,
        has_pdf: !!inv?.pdf_path,
      };
    });

    if (data.serviceId) enriched = enriched.filter((r) => r.service_id === data.serviceId);
    if (data.q) {
      const needle = data.q.toLowerCase();
      enriched = enriched.filter((r) =>
        [r.customer_name, r.customer_email, r.customer_mobile, r.lead_code, r.application_code, r.transaction_id]
          .some((v) => (v ?? "").toString().toLowerCase().includes(needle)),
      );
    }

    return { rows: enriched, total: count ?? enriched.length, page: data.page, pageSize: data.pageSize };
  });

export const listInvoicesAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => PageFilters.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "finance", "accounts"]);
    const admin = await getAdmin();
    const offset = (data.page - 1) * data.pageSize;

    let q = admin
      .from("invoices")
      .select(
        "id, invoice_number, issued_at, base_amount, gst_amount, total_amount, cgst_amount, sgst_amount, igst_amount, sac_code, place_of_supply, pdf_path, lead_id, application_id, payment_id",
        { count: "exact" },
      )
      .order("issued_at", { ascending: false });

    if (data.from) q = q.gte("issued_at", new Date(data.from).toISOString());
    if (data.to) q = q.lte("issued_at", new Date(data.to).toISOString());
    if (data.gstType === "igst") q = q.gt("igst_amount", 0);
    if (data.gstType === "cgst_sgst") q = q.gt("cgst_amount", 0);

    const { data: rows, count, error } = await q.range(offset, offset + data.pageSize - 1);
    if (error) throw new Error(error.message);

    const leadIds = [...new Set((rows ?? []).map((r) => r.lead_id))];
    const appIds = [...new Set((rows ?? []).map((r) => r.application_id).filter(Boolean) as string[])];

    const [{ data: leads }, { data: apps }] = await Promise.all([
      leadIds.length
        ? admin.from("leads").select("id, name, email, mobile, lead_code, service, service_id").in("id", leadIds)
        : Promise.resolve({ data: [] as any[] }),
      appIds.length
        ? admin.from("applications").select("id, application_code").in("id", appIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const leadMap = new Map((leads ?? []).map((l: any) => [l.id, l]));
    const appMap = new Map((apps ?? []).map((a: any) => [a.id, a]));

    let enriched = (rows ?? []).map((r) => {
      const l = leadMap.get(r.lead_id) ?? {};
      const a = r.application_id ? appMap.get(r.application_id) : null;
      const gstType: "cgst_sgst" | "igst" | "none" =
        Number(r.igst_amount) > 0 ? "igst" : Number(r.cgst_amount) > 0 ? "cgst_sgst" : "none";
      return {
        ...r,
        base_amount: Number(r.base_amount),
        gst_amount: Number(r.gst_amount),
        total_amount: Number(r.total_amount),
        cgst_amount: Number(r.cgst_amount),
        sgst_amount: Number(r.sgst_amount),
        igst_amount: Number(r.igst_amount),
        application_code: a?.application_code ?? null,
        customer_name: l.name ?? "",
        customer_email: l.email ?? "",
        lead_code: l.lead_code ?? "",
        service: l.service ?? "",
        service_id: l.service_id ?? null,
        gst_type: gstType,
      };
    });

    if (data.serviceId) enriched = enriched.filter((r) => r.service_id === data.serviceId);
    if (data.q) {
      const needle = data.q.toLowerCase();
      enriched = enriched.filter((r) =>
        [r.customer_name, r.customer_email, r.invoice_number, r.lead_code, r.application_code]
          .some((v) => (v ?? "").toString().toLowerCase().includes(needle)),
      );
    }

    return { rows: enriched, total: count ?? enriched.length, page: data.page, pageSize: data.pageSize };
  });

// Filter dropdown data: distinct gateways + active services
export const getPaymentsFilterMeta = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "finance", "accounts"]);
    const admin = await getAdmin();
    const [{ data: services }] = await Promise.all([
      admin.from("services").select("id, service_name").eq("is_active", true).order("service_name"),
    ]);
    return {
      services: (services ?? []) as Array<{ id: string; service_name: string }>,
      gateways: ["razorpay", "payu", "ccavenue"],
      statuses: ["created", "attempted", "paid", "failed", "refunded"],
    };
  });
