const CLOSED_ORDER = ["COMPLETED", "CLOSED", "CERTIFICATE_ISSUED", "REFUND_APPROVED", "REFUND_PROCESSED"];
function normalizeIndianMobile(raw) {
  const d = String(raw ?? "").replace(/\D/g, "");
  const ten = d.length > 10 ? d.slice(-10) : d;
  if (!/^[6-9]\d{9}$/.test(ten)) return null;
  if (d.length > 10 && !/^(0|91|091|0091)$/.test(d.slice(0, -10))) return null;
  return ten;
}
function maskNumber(m) {
  return m ? `******${m.slice(-4)}` : "unknown";
}
async function dbLookup(m) {
  const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
  const variants = [m, `+91${m}`, `91${m}`, `0${m}`, `+91 ${m}`];
  const [leadsRes, custRes] = await Promise.all([
    supabaseAdmin.from("leads").select("id, customer_id, assigned_to").in("mobile", variants).order("created_at", { ascending: false }).limit(10),
    supabaseAdmin.from("customers").select("id").in("primary_mobile", variants).eq("is_deleted", false).limit(1)
  ]);
  if (leadsRes.error) throw leadsRes.error;
  if (custRes.error) throw custRes.error;
  const leads = leadsRes.data ?? [];
  const customerId = custRes.data?.[0]?.id ?? leads.find((l) => l.customer_id)?.customer_id ?? null;
  const leadIds = leads.map((l) => l.id);
  let app = null;
  if (leadIds.length || customerId) {
    const ors = [
      leadIds.length ? `lead_id.in.(${leadIds.join(",")})` : null,
      customerId ? `customer_id.eq.${customerId}` : null
    ].filter(Boolean).join(",");
    const { data, error } = await supabaseAdmin.from("applications").select("id, lead_id, assigned_to").or(ors).not("order_status", "in", `(${CLOSED_ORDER.join(",")})`).order("created_at", { ascending: false }).limit(1);
    if (error) throw error;
    app = data?.[0] ?? null;
  }
  const lead = app && leads.find((l) => l.id === app.lead_id) || leads[0] || null;
  return {
    customerId,
    leadId: lead?.id ?? null,
    applicationId: app?.id ?? null,
    employeeId: app?.assigned_to ?? lead?.assigned_to ?? null
  };
}
const isClosedOrder = (s) => CLOSED_ORDER.includes(String(s).toUpperCase());
function rankCallerOrders(rows) {
  const seen = /* @__PURE__ */ new Map();
  for (const r of rows) if (!seen.has(r.id)) seen.set(r.id, r);
  return [...seen.values()].sort((a, b) => a.active === b.active ? b.createdAt.localeCompare(a.createdAt) : a.active ? -1 : 1);
}
async function lookupCaller(raw) {
  const m = normalizeIndianMobile(raw);
  const empty = { customerName: null, lead: null, orders: [] };
  if (!m) return { number: null, kind: "invalid", ...empty };
  const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
  const db = supabaseAdmin;
  const variants = [m, `+91${m}`, `91${m}`, `0${m}`, `+91 ${m}`];
  const [lr, cr] = await Promise.all([
    db.from("leads").select("id, lead_code, name, status, service_id, assigned_to, customer_id, created_at").in("mobile", variants).or("is_deleted.is.null,is_deleted.eq.false").order("created_at", { ascending: false }).limit(10),
    db.from("customers").select("id, name").in("primary_mobile", variants).or("is_deleted.is.null,is_deleted.eq.false").limit(5)
  ]);
  if (lr.error) throw lr.error;
  if (cr.error) throw cr.error;
  const leads = lr.data ?? [];
  const custs = cr.data ?? [];
  const custIds = [.../* @__PURE__ */ new Set([...custs.map((c) => c.id), ...leads.map((l2) => l2.customer_id).filter(Boolean)])];
  const leadIds = leads.map((l2) => l2.id);
  let apps = [];
  if (leadIds.length || custIds.length) {
    const ors = [leadIds.length ? `lead_id.in.(${leadIds.join(",")})` : null, custIds.length ? `customer_id.in.(${custIds.join(",")})` : null].filter(Boolean).join(",");
    const ar = await db.from("applications").select("id, application_code, order_status, service_id, assigned_to, created_at").or(ors).or("is_deleted.is.null,is_deleted.eq.false").order("created_at", { ascending: false }).limit(20);
    if (ar.error) throw ar.error;
    apps = ar.data ?? [];
  }
  const svcIds = [...new Set([...apps, ...leads].map((r) => r.service_id).filter(Boolean))];
  const userIds = [...new Set([...apps, ...leads].map((r) => r.assigned_to).filter(Boolean))];
  const [sr, pr] = await Promise.all([
    svcIds.length ? db.from("services").select("id, service_name").in("id", svcIds) : { data: [] },
    userIds.length ? db.from("profiles").select("id, full_name, display_name").in("id", userIds) : { data: [] }
  ]);
  const svc = new Map((sr.data ?? []).map((s) => [s.id, s.service_name]));
  const ppl = new Map((pr.data ?? []).map((p) => [p.id, p.full_name || p.display_name || "Employee"]));
  const orders = rankCallerOrders(apps.map((a) => ({
    id: a.id,
    code: a.application_code,
    service: svc.get(a.service_id) ?? null,
    status: String(a.order_status),
    assignee: ppl.get(a.assigned_to) ?? null,
    active: !isClosedOrder(a.order_status),
    createdAt: a.created_at
  })));
  const l = leads[0];
  const lead = l ? { id: l.id, code: l.lead_code, name: l.name, service: svc.get(l.service_id) ?? null, status: String(l.status), assignee: ppl.get(l.assigned_to) ?? null } : null;
  const customerName = custs[0]?.name ?? l?.name ?? null;
  return { number: m, kind: orders.length ? "orders" : lead ? "lead" : custs.length ? "lead" : "unknown", customerName, lead, orders };
}
export {
  dbLookup,
  isClosedOrder,
  lookupCaller,
  maskNumber,
  normalizeIndianMobile,
  rankCallerOrders
};
