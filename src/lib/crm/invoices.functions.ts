import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { renderInvoicePdf, type InvoiceData } from "@/lib/invoices/pdf.server";

// Place of supply for the seller. Change here if your registered office moves.
const COMPANY_STATE = (process.env.COMPANY_STATE ?? "Delhi").trim().toLowerCase();

const BUCKET = "invoices";

async function generateAndStore(paymentId: string): Promise<string> {
  // Load payment + lead + application
  const { data: payment, error: pErr } = await supabaseAdmin
    .from("payments")
    .select("id, lead_id, application_id, amount, base_amount, gst_amount, gateway_name, transaction_id, payment_date, created_at")
    .eq("id", paymentId)
    .single();
  if (pErr || !payment) throw new Error(pErr?.message ?? "Payment not found");

  const { data: lead } = await supabaseAdmin
    .from("leads")
    .select("id, lead_code, name, email, mobile, state, service")
    .eq("id", payment.lead_id)
    .single();
  if (!lead) throw new Error("Lead not found");

  let applicationCode: string | null = null;
  if (payment.application_id) {
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("application_code")
      .eq("id", payment.application_id)
      .maybeSingle();
    applicationCode = app?.application_code ?? null;
  }

  // Upsert invoice row first (so invoice_number trigger fires)
  const { data: existing } = await supabaseAdmin
    .from("invoices")
    .select("id, invoice_number, pdf_path")
    .eq("payment_id", paymentId)
    .maybeSingle();

  // Compute GST split based on customer state vs company state
  const customerState = (lead.state ?? "").trim();
  const isIntraState = customerState && customerState.toLowerCase() === COMPANY_STATE;
  const gstTotal = Number(payment.gst_amount);
  const cgst = isIntraState ? gstTotal / 2 : 0;
  const sgst = isIntraState ? gstTotal / 2 : 0;
  const igst = isIntraState ? 0 : gstTotal;

  let invoiceId: string;
  let invoiceNumber: string;
  if (existing) {
    invoiceId = existing.id;
    invoiceNumber = existing.invoice_number!;
    await supabaseAdmin.from("invoices").update({
      cgst_amount: cgst, sgst_amount: sgst, igst_amount: igst,
      place_of_supply: customerState || null,
    }).eq("id", invoiceId);
  } else {
    const { data: row, error: invErr } = await supabaseAdmin
      .from("invoices")
      .insert({
        lead_id: payment.lead_id,
        application_id: payment.application_id,
        payment_id: payment.id,
        base_amount: Number(payment.base_amount),
        gst_amount: gstTotal,
        total_amount: Number(payment.amount),
        cgst_amount: cgst,
        sgst_amount: sgst,
        igst_amount: igst,
        place_of_supply: customerState || null,
      })
      .select("id, invoice_number")
      .single();
    if (invErr || !row) throw new Error(invErr?.message ?? "Could not create invoice");
    invoiceId = row.id;
    invoiceNumber = row.invoice_number!;
  }

  // Render PDF
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
    paymentId: payment.transaction_id ?? null,
    gatewayName: payment.gateway_name,
  };

  const pdfBytes = await renderInvoicePdf(data);
  const path = `${new Date().getFullYear()}/${invoiceNumber}.pdf`;

  const { error: upErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, pdfBytes, { contentType: "application/pdf", upsert: true });
  if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

  await supabaseAdmin.from("invoices").update({ pdf_path: path }).eq("id", invoiceId);

  return invoiceId;
}

export const generateInvoice = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ paymentId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const id = await generateAndStore(data.paymentId);
    return { ok: true, invoiceId: id };
  });

// Internal (called from webhook). Same logic, no auth — used right after we
// verify the gateway signature server-to-server.
export async function generateInvoiceInternal(paymentId: string) {
  return generateAndStore(paymentId);
}

export const regenerateInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ invoiceId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    // Auth check: only super_admin / finance can regenerate
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance");
    if (!ok) throw new Error("Forbidden");

    const { data: inv } = await supabaseAdmin
      .from("invoices")
      .select("payment_id")
      .eq("id", data.invoiceId)
      .single();
    if (!inv?.payment_id) throw new Error("Invoice not found");
    await generateAndStore(inv.payment_id);
    return { ok: true };
  });

export const getInvoiceSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ invoiceId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    // Auth: super_admin / finance only
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance");
    if (!ok) throw new Error("Forbidden");

    const { data: inv } = await supabaseAdmin
      .from("invoices")
      .select("pdf_path, invoice_number")
      .eq("id", data.invoiceId)
      .single();
    if (!inv?.pdf_path) throw new Error("Invoice PDF not generated yet");

    const { data: signed, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(inv.pdf_path, 60 * 5); // 5 min
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl, invoiceNumber: inv.invoice_number };
  });

export const listInvoices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance");
    if (!ok) throw new Error("Forbidden");

    const { data, error } = await supabaseAdmin
      .from("invoices")
      .select("id, invoice_number, lead_id, payment_id, total_amount, base_amount, gst_amount, issued_at, pdf_path")
      .order("issued_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });
