import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}


async function assertFinance(supabase: any, userId: string) {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const ok = (roles ?? []).some(
    (r: any) => r.role === "super_admin" || r.role === "finance" || r.role === "admin",
  );
  if (!ok) throw new Error("Forbidden");
}

type Row = {
  id: string;
  invoice_number: string | null;
  issued_at: string;
  base_amount: number;
  gst_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_amount: number;
  place_of_supply: string | null;
  sac_code: string | null;
  lead_id: string;
  payment_id: string;
};

async function fetchRows(month: string, state?: string, gateway?: string) {
  const from = `${month}-01T00:00:00Z`;
  const d = new Date(from);
  const to = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString();

  let q = (await getAdmin())
    .from("invoices")
    .select(
      "id, invoice_number, issued_at, base_amount, gst_amount, cgst_amount, sgst_amount, igst_amount, total_amount, place_of_supply, sac_code, lead_id, payment_id",
    )
    .gte("issued_at", from)
    .lt("issued_at", to)
    .is("cancelled_at", null)
    .order("issued_at", { ascending: true });

  const { data: invs, error } = await q;
  if (error) throw new Error(error.message);
  let rows = (invs ?? []) as Row[];

  // Hydrate lead state + name + gateway
  const leadIds = [...new Set(rows.map((r) => r.lead_id))];
  const payIds = [...new Set(rows.map((r) => r.payment_id))];
  const [{ data: leads }, { data: pays }] = await Promise.all([
    (await getAdmin()).from("leads").select("id, name, state, lead_code, service").in("id", leadIds),
    (await getAdmin()).from("payments").select("id, gateway_name, transaction_id").in("id", payIds),
  ]);
  const leadMap = new Map((leads ?? []).map((l: any) => [l.id, l]));
  const payMap = new Map((pays ?? []).map((p: any) => [p.id, p]));

  const enriched = rows.map((r) => {
    const l = leadMap.get(r.lead_id) || {};
    const p = payMap.get(r.payment_id) || {};
    return {
      ...r,
      customer_name: l.name ?? "",
      customer_state: l.state ?? r.place_of_supply ?? "",
      lead_code: l.lead_code ?? "",
      service: l.service ?? "",
      gateway: p.gateway_name ?? "",
      transaction_id: p.transaction_id ?? "",
    };
  });

  let out = enriched;
  if (state) out = out.filter((r) => (r.customer_state || "").toLowerCase() === state.toLowerCase());
  if (gateway) out = out.filter((r) => (r.gateway || "").toLowerCase() === gateway.toLowerCase());
  return out;
}

export const getGstReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      month: z.string().regex(/^\d{4}-\d{2}$/),
      state: z.string().max(80).optional(),
      gateway: z.string().max(40).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertFinance(context.supabase, context.userId);
    const rows = await fetchRows(data.month, data.state, data.gateway);

    let taxable = 0, cgst = 0, sgst = 0, igst = 0, total = 0;
    const byState = new Map<string, { taxable: number; cgst: number; sgst: number; igst: number; total: number; count: number }>();
    for (const r of rows) {
      const b = Number(r.base_amount);
      const c = Number(r.cgst_amount);
      const s = Number(r.sgst_amount);
      const i = Number(r.igst_amount);
      const t = Number(r.total_amount);
      // Back-compat: if cgst/sgst/igst all 0 but gst_amount > 0, split it
      let cVal = c, sVal = s, iVal = i;
      const gst = Number(r.gst_amount);
      if (cVal === 0 && sVal === 0 && iVal === 0 && gst > 0) {
        cVal = gst / 2;
        sVal = gst / 2;
      }
      taxable += b;
      cgst += cVal;
      sgst += sVal;
      igst += iVal;
      total += t;
      const st = (r.customer_state || "Unknown").trim();
      const cur = byState.get(st) ?? { taxable: 0, cgst: 0, sgst: 0, igst: 0, total: 0, count: 0 };
      cur.taxable += b;
      cur.cgst += cVal;
      cur.sgst += sVal;
      cur.igst += iVal;
      cur.total += t;
      cur.count += 1;
      byState.set(st, cur);
    }

    return {
      summary: {
        taxable, cgst, sgst, igst, totalTax: cgst + sgst + igst, total, count: rows.length,
      },
      byState: [...byState.entries()].map(([state, v]) => ({ state, ...v })),
      rows,
    };
  });

export const exportGstReportCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      month: z.string().regex(/^\d{4}-\d{2}$/),
      state: z.string().max(80).optional(),
      gateway: z.string().max(40).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertFinance(context.supabase, context.userId);
    const rows = await fetchRows(data.month, data.state, data.gateway);

    const header = [
      "invoice_number", "issued_at", "lead_code", "customer_name", "customer_state",
      "service", "sac_code", "base_amount", "cgst", "sgst", "igst", "total_amount",
      "gateway", "transaction_id",
    ];
    const escape = (v: any) => {
      if (v == null) return "";
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [header.join(",")];
    for (const r of rows) {
      const gst = Number(r.gst_amount);
      let c = Number(r.cgst_amount), s = Number(r.sgst_amount), i = Number(r.igst_amount);
      if (c === 0 && s === 0 && i === 0 && gst > 0) { c = gst / 2; s = gst / 2; }
      lines.push([
        r.invoice_number,
        r.issued_at,
        r.lead_code,
        r.customer_name,
        r.customer_state,
        r.service,
        r.sac_code ?? "998311",
        r.base_amount,
        c.toFixed(2),
        s.toFixed(2),
        i.toFixed(2),
        r.total_amount,
        r.gateway,
        r.transaction_id,
      ].map(escape).join(","));
    }
    return { csv: lines.join("\n"), filename: `gst_${data.month}.csv` };
  });
