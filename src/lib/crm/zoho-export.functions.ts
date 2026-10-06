import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole } from "@/lib/audit";

/**
 * Zoho Books invoice export — READ-ONLY over existing CRM invoices/leads.
 * Exports only the Zoho template columns the CRM actually has data for.
 */

export const ZOHO_COLUMNS = [
  "Invoice Number",
  "Invoice Date",
  "Invoice Status",
  "Customer Name",
  "GST Treatment",
  "GST Identification Number (GSTIN)",
  "Place of Supply",
  "Currency Code",
  "Exchange Rate",
  "Account",
  "Item Name",
  "Item Desc",
  "Item Type",
  "HSN/SAC",
  "Quantity",
  "Item Price",
  "Is Inclusive Tax",
  "Item Tax",
  "Item Tax Type",
  "Item Tax %",
  "Supply Type",
  "Notes",
] as const;

const STATE_CODES: Record<string, string> = {
  "andaman and nicobar islands": "AN", "andhra pradesh": "AP", "arunachal pradesh": "AR", assam: "AS",
  bihar: "BR", chandigarh: "CH", chhattisgarh: "CG", "dadra and nagar haveli and daman and diu": "DN",
  "daman and diu": "DD", delhi: "DL", "new delhi": "DL", goa: "GA", gujarat: "GJ", haryana: "HR",
  "himachal pradesh": "HP", "jammu and kashmir": "JK", jharkhand: "JH", karnataka: "KA", kerala: "KL",
  ladakh: "LA", lakshadweep: "LD", "madhya pradesh": "MP", maharashtra: "MH", manipur: "MN",
  meghalaya: "ML", mizoram: "MZ", nagaland: "NL", odisha: "OD", orissa: "OD", puducherry: "PY",
  pondicherry: "PY", punjab: "PB", rajasthan: "RJ", sikkim: "SK", "tamil nadu": "TN", telangana: "TS",
  tripura: "TR", "uttar pradesh": "UP", uttarakhand: "UK", "west bengal": "WB",
};
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

function stateCode(s: string | null | undefined): string | null {
  if (!s) return null;
  const t = s.trim();
  if (/^[A-Za-z]{2}$/.test(t) && Object.values(STATE_CODES).includes(t.toUpperCase())) return t.toUpperCase();
  return STATE_CODES[t.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ")] ?? null;
}
const r2 = (n: number) => Math.round(n * 100) / 100;
const num = (v: unknown) => (v == null || v === "" ? NaN : Number(v));
const istDate = (iso: string) =>
  new Date(new Date(iso).getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

export type ZohoIssue = { invoice_number: string; field: string; error: string };
export type ZohoRow = Record<(typeof ZOHO_COLUMNS)[number], string>;

const Input = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const buildZohoInvoiceExport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "finance", "accounts"] as any);
    if (data.from > data.to) throw new Error("From date must be before To date");
    const { supabaseAdmin: admin } = await import("@/integrations/supabase/client.server");

    // IST day boundaries
    const fromIso = new Date(`${data.from}T00:00:00+05:30`).toISOString();
    const toIso = new Date(`${data.to}T23:59:59.999+05:30`).toISOString();

    const invoices: any[] = [];
    for (let off = 0; ; off += 1000) {
      const { data: page, error } = await (admin as any)
        .from("invoices")
        .select("id, invoice_number, lead_id, issued_at, base_amount, gst_amount, total_amount, cgst_amount, sgst_amount, igst_amount, cgst_rate, sgst_rate, igst_rate, sac_code, place_of_supply, customer_state_snapshot, customer_gstin_snapshot, company_state_snapshot, replaced_at")
        .gte("issued_at", fromIso)
        .lte("issued_at", toIso)
        .is("replaced_at", null)
        .order("issued_at", { ascending: true })
        .range(off, off + 999);
      if (error) throw new Error(error.message);
      invoices.push(...(page ?? []));
      if (!page || page.length < 1000) break;
    }

    const leadIds = [...new Set(invoices.map((i) => i.lead_id).filter(Boolean))];
    const leads = new Map<string, any>();
    for (let i = 0; i < leadIds.length; i += 200) {
      const { data: rows, error } = await admin
        .from("leads")
        .select("id, name, service, state")
        .in("id", leadIds.slice(i, i + 200));
      if (error) throw new Error(error.message);
      for (const l of rows ?? []) leads.set(l.id, l);
    }

    const issues: ZohoIssue[] = [];
    const rows: ZohoRow[] = [];
    const totals = { taxable: 0, cgst: 0, sgst: 0, igst: 0, total: 0 };
    const validTotals = { taxable: 0, cgst: 0, sgst: 0, igst: 0, total: 0 };
    let valid = 0;

    for (const inv of invoices) {
      const no = inv.invoice_number ?? `(no number ${String(inv.id).slice(0, 8)})`;
      const errs: ZohoIssue[] = [];
      const add = (field: string, error: string) => errs.push({ invoice_number: no, field, error });
      const lead = inv.lead_id ? leads.get(inv.lead_id) : null;

      const base = num(inv.base_amount), gst = num(inv.gst_amount), total = num(inv.total_amount);
      const cg = num(inv.cgst_amount) || 0, sg = num(inv.sgst_amount) || 0, ig = num(inv.igst_amount) || 0;
      const igRate = num(inv.igst_rate) || 0, cgRate = num(inv.cgst_rate) || 0, sgRate = num(inv.sgst_rate) || 0;
      const isIntra = cg > 0 || sg > 0;
      const rate = isIntra ? cgRate + sgRate : igRate;
      totals.taxable += base || 0; totals.cgst += cg; totals.sgst += sg; totals.igst += ig; totals.total += total || 0;

      if (!inv.invoice_number) add("Invoice Number", "Missing invoice number");
      if (!inv.issued_at) add("Invoice Date", "Missing invoice date");
      const customer = (lead?.name ?? "").trim();
      if (!customer) add("Customer Name", "Missing customer name");
      const service = (lead?.service ?? "").trim();
      if (!service) add("Item Name", "Missing service name");
      const pos = stateCode(inv.place_of_supply ?? inv.customer_state_snapshot ?? lead?.state);
      if (!pos) add("Place of Supply", `Unknown/missing state "${inv.place_of_supply ?? inv.customer_state_snapshot ?? ""}"`);
      if (!inv.sac_code || !/^\d{4,8}$/.test(inv.sac_code)) add("HSN/SAC", "Missing or invalid SAC code");
      const gstin = (inv.customer_gstin_snapshot ?? "").trim().toUpperCase();
      if (gstin && !GSTIN_RE.test(gstin)) add("GST Identification Number (GSTIN)", `Invalid GSTIN "${gstin}"`);
      if (!(base > 0)) add("Item Price", "Taxable value must be greater than 0");
      if (Number.isNaN(gst) || Number.isNaN(total)) add("Total", "Missing GST or total amount");
      else {
        if (Math.abs(r2(cg + sg + ig) - r2(gst)) > 0.01)
          add("Item Tax", `CGST+SGST+IGST (${r2(cg + sg + ig)}) ≠ GST amount (${r2(gst)})`);
        if (Math.abs(r2(base + gst) - r2(total)) > 0.01)
          add("Total", `Taxable + GST (${r2(base + gst)}) ≠ invoice total (${r2(total)})`);
        if (isIntra && ig > 0) add("Item Tax", "Invoice has both CGST/SGST and IGST");
        if (base > 0 && rate > 0 && Math.abs(r2((base * rate) / 100) - r2(gst)) > 1)
          add("Item Tax %", `GST ${r2(gst)} does not match ${rate}% of ${r2(base)}`);
        if (gst > 0 && !(rate > 0)) add("Item Tax %", "GST charged but tax rate is 0/missing");
      }

      if (errs.length) { issues.push(...errs); continue; }
      valid++;
      validTotals.taxable += base; validTotals.cgst += cg; validTotals.sgst += sg; validTotals.igst += ig; validTotals.total += total;
      rows.push({
        "Invoice Number": inv.invoice_number,
        "Invoice Date": istDate(inv.issued_at),
        "Invoice Status": "Sent",
        "Customer Name": customer,
        "GST Treatment": gstin ? "business_gst" : "consumer",
        "GST Identification Number (GSTIN)": gstin,
        "Place of Supply": pos!,
        "Currency Code": "INR",
        "Exchange Rate": "1",
        "Account": "Sales",
        "Item Name": service,
        "Item Desc": service,
        "Item Type": "service",
        "HSN/SAC": inv.sac_code,
        "Quantity": "1",
        "Item Price": r2(base).toFixed(2),
        "Is Inclusive Tax": "false",
        "Item Tax": rate > 0 ? (isIntra ? `GST${rate}` : `IGST${rate}`) : "",
        "Item Tax Type": rate > 0 ? (isIntra ? "Tax Group" : "ItemAmount") : "",
        "Item Tax %": rate > 0 ? String(rate) : "",
        "Supply Type": rate > 0 ? "Taxable" : "Exempted",
        "Notes": "",
      });
    }

    const round = (t: typeof totals) => ({
      taxable: r2(t.taxable), cgst: r2(t.cgst), sgst: r2(t.sgst), igst: r2(t.igst), total: r2(t.total),
    });
    return {
      columns: [...ZOHO_COLUMNS],
      summary: { totalInvoices: invoices.length, valid, errors: invoices.length - valid, ...round(totals) },
      validTotals: round(validTotals),
      issues,
      rows,
    };
  });
