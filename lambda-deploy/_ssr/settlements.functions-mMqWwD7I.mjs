import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, _ as _enum, n as number } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function assertFinance(supabase, userId) {
  const {
    data: roles
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance" || r.role === "admin");
  if (!ok) throw new Error("Forbidden");
}
function parseCsv(csv) {
  const lines = csv.replace(/\r/g, "").split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const split = (line) => {
    const out = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') q = false;
        else cur += ch;
      } else {
        if (ch === '"') q = true;
        else if (ch === ",") {
          out.push(cur);
          cur = "";
        } else cur += ch;
      }
    }
    out.push(cur);
    return out;
  };
  const headers = split(lines[0]).map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((l) => {
    const cols = split(l);
    const row = {};
    headers.forEach((h, i) => row[h] = (cols[i] ?? "").trim());
    return row;
  });
}
function pick(row, keys) {
  for (const k of keys) if (row[k] != null && row[k] !== "") return row[k];
  return "";
}
function num(s) {
  if (!s) return 0;
  const n = Number(String(s).replace(/[,₹\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
const importSettlementCsv_createServerFn_handler = createServerRpc({
  id: "aa29de67b1f16df41ee45a2473cf1af9dade105a78c24f90e6ce43cb50c2977b",
  name: "importSettlementCsv",
  filename: "src/lib/finance/settlements.functions.ts"
}, (opts) => importSettlementCsv.__executeServer(opts));
const importSettlementCsv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  gateway: _enum(["payu", "razorpay"]),
  csvText: string().min(10).max(5e6)
}).parse(i)).handler(importSettlementCsv_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinance(context.supabase, context.userId);
  const rows = parseCsv(data.csvText);
  if (rows.length === 0) throw new Error("CSV had no data rows");
  const groups = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const sid = pick(r, ["settlement_id", "settlement id", "payout_id", "utr", "utr_no", "utr no"]) || pick(r, ["settled on", "settlement_date", "settled_at"]);
    if (!sid) continue;
    const settledAt = pick(r, ["settled_at", "settlement_date", "settled on", "date", "txn_date"]) || (/* @__PURE__ */ new Date()).toISOString();
    const amount = num(pick(r, ["amount", "txn_amount", "transaction_amount", "gross"]));
    const fee = num(pick(r, ["fee", "fees", "service_fee", "gateway_fee"]));
    const tax = num(pick(r, ["service_tax", "tax", "gst", "tax_on_fees"]));
    const net = num(pick(r, ["net", "net_amount", "settled_amount"])) || amount - fee - tax;
    const txn = pick(r, ["txnid", "txn_id", "transaction_id", "mihpayid", "merchant_txn_id", "order_id"]) || "";
    const g = groups.get(sid) ?? {
      settlementId: sid,
      settledAt,
      gross: 0,
      fees: 0,
      taxOnFees: 0,
      net: 0,
      txns: [],
      raw: []
    };
    g.gross += amount;
    g.fees += fee;
    g.taxOnFees += tax;
    g.net += net;
    if (txn) g.txns.push({
      txn,
      amount,
      fee,
      net
    });
    g.raw.push(r);
    groups.set(sid, g);
  }
  let settlementsCreated = 0;
  let linksCreated = 0;
  let unmatched = 0;
  for (const g of groups.values()) {
    const {
      data: existing
    } = await (await getAdmin()).from("gateway_settlements").select("id").eq("gateway", data.gateway).eq("settlement_id", g.settlementId).maybeSingle();
    let settlementUuid;
    if (existing?.id) {
      settlementUuid = existing.id;
      await (await getAdmin()).from("gateway_settlements").update({
        settled_at: new Date(g.settledAt).toISOString(),
        gross: g.gross,
        fees: g.fees,
        tax_on_fees: g.taxOnFees,
        net: g.net,
        raw: {
          rows: g.raw
        }
      }).eq("id", settlementUuid);
    } else {
      const {
        data: ins,
        error: insErr
      } = await (await getAdmin()).from("gateway_settlements").insert({
        gateway: data.gateway,
        settlement_id: g.settlementId,
        settled_at: new Date(g.settledAt).toISOString(),
        gross: g.gross,
        fees: g.fees,
        tax_on_fees: g.taxOnFees,
        net: g.net,
        raw: {
          rows: g.raw
        }
      }).select("id").single();
      if (insErr) throw new Error(insErr.message);
      settlementUuid = ins.id;
      settlementsCreated += 1;
    }
    if (g.txns.length > 0) {
      const txnIds = g.txns.map((t) => t.txn);
      const {
        data: matched
      } = await (await getAdmin()).from("payments").select("id, transaction_id, razorpay_payment_id, razorpay_order_id").or(`transaction_id.in.(${txnIds.map((x) => `"${x}"`).join(",")}),razorpay_payment_id.in.(${txnIds.map((x) => `"${x}"`).join(",")}),razorpay_order_id.in.(${txnIds.map((x) => `"${x}"`).join(",")})`);
      const byTxn = /* @__PURE__ */ new Map();
      for (const p of matched ?? []) {
        if (p.transaction_id) byTxn.set(p.transaction_id, p);
        if (p.razorpay_payment_id) byTxn.set(p.razorpay_payment_id, p);
        if (p.razorpay_order_id) byTxn.set(p.razorpay_order_id, p);
      }
      for (const t of g.txns) {
        const p = byTxn.get(t.txn);
        if (!p) {
          unmatched += 1;
          continue;
        }
        const {
          error
        } = await (await getAdmin()).from("payment_settlements").upsert({
          payment_id: p.id,
          settlement_id: settlementUuid,
          settled_amount: t.amount,
          fee: t.fee,
          net: t.net
        }, {
          onConflict: "payment_id,settlement_id"
        });
        if (!error) linksCreated += 1;
      }
    }
  }
  await (await getAdmin()).from("audit_logs").insert({
    action: "settlement_import",
    entity_type: "gateway_settlement",
    actor_id: context.userId,
    new_value: {
      gateway: data.gateway,
      settlementsCreated,
      linksCreated,
      unmatched,
      groups: groups.size
    }
  });
  return {
    settlementsCreated,
    linksCreated,
    unmatched,
    groups: groups.size
  };
});
const listSettlements_createServerFn_handler = createServerRpc({
  id: "d2b513abb725553d7a81750fc3992405be3425757125bf872f711fd4cd389540",
  name: "listSettlements",
  filename: "src/lib/finance/settlements.functions.ts"
}, (opts) => listSettlements.__executeServer(opts));
const listSettlements = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  gateway: string().optional(),
  limit: number().min(1).max(500).default(100)
}).parse(i)).handler(listSettlements_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinance(context.supabase, context.userId);
  let q = (await getAdmin()).from("gateway_settlements").select("id, gateway, settlement_id, settled_at, gross, fees, tax_on_fees, net, currency").order("settled_at", {
    ascending: false
  }).limit(data.limit);
  if (data.gateway) q = q.eq("gateway", data.gateway);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const ids = (rows ?? []).map((r) => r.id);
  const counts = /* @__PURE__ */ new Map();
  if (ids.length > 0) {
    const {
      data: links
    } = await (await getAdmin()).from("payment_settlements").select("settlement_id").in("settlement_id", ids);
    for (const l of links ?? []) {
      counts.set(l.settlement_id, (counts.get(l.settlement_id) ?? 0) + 1);
    }
  }
  return {
    rows: (rows ?? []).map((r) => ({
      ...r,
      payment_count: counts.get(r.id) ?? 0
    }))
  };
});
const getUnreconciledPayments_createServerFn_handler = createServerRpc({
  id: "850ac66cc0534b9c4d18a1117e6254021411713aa1646a9e13b28779dd069bba",
  name: "getUnreconciledPayments",
  filename: "src/lib/finance/settlements.functions.ts"
}, (opts) => getUnreconciledPayments.__executeServer(opts));
const getUnreconciledPayments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getUnreconciledPayments_createServerFn_handler, async ({
  context
}) => {
  await assertFinance(context.supabase, context.userId);
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString();
  const {
    data: pays,
    error
  } = await (await getAdmin()).from("payments").select("id, transaction_id, gateway_name, amount, payment_date, lead_id").eq("status", "paid").lt("payment_date", cutoff).order("payment_date", {
    ascending: false
  }).limit(500);
  if (error) throw new Error(error.message);
  const ids = (pays ?? []).map((p) => p.id);
  if (ids.length === 0) return {
    rows: []
  };
  const {
    data: links
  } = await (await getAdmin()).from("payment_settlements").select("payment_id").in("payment_id", ids);
  const linked = new Set((links ?? []).map((l) => l.payment_id));
  return {
    rows: (pays ?? []).filter((p) => !linked.has(p.id))
  };
});
const getLeadFinance_createServerFn_handler = createServerRpc({
  id: "821bda134b97d86f0ee4b1f310a659bbea8217187be0096c896d4a1871dfd5c8",
  name: "getLeadFinance",
  filename: "src/lib/finance/settlements.functions.ts"
}, (opts) => getLeadFinance.__executeServer(opts));
const getLeadFinance = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(getLeadFinance_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinance(context.supabase, context.userId);
  const [{
    data: pays
  }, {
    data: invs
  }] = await Promise.all([(await getAdmin()).from("payments").select("*").eq("lead_id", data.leadId).order("created_at", {
    ascending: false
  }), (await getAdmin()).from("invoices").select("*").eq("lead_id", data.leadId).order("issued_at", {
    ascending: false
  })]);
  const payIds = (pays ?? []).map((p) => p.id);
  let settlements = [];
  if (payIds.length > 0) {
    const {
      data: links
    } = await (await getAdmin()).from("payment_settlements").select("payment_id, settled_amount, fee, net, gateway_settlements(settlement_id, settled_at, gateway)").in("payment_id", payIds);
    settlements = links ?? [];
  }
  return {
    payments: pays ?? [],
    invoices: invs ?? [],
    settlements
  };
});
export {
  getLeadFinance_createServerFn_handler,
  getUnreconciledPayments_createServerFn_handler,
  importSettlementCsv_createServerFn_handler,
  listSettlements_createServerFn_handler
};
