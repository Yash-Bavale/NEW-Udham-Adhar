import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { L as LEAD_STATUSES } from "./types-UrBsAyKK.mjs";
import { i as isUserAdmin } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, _ as _enum, a as array, s as string } from "../_libs/zod.mjs";
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
async function assertOps(userId) {
  const {
    data
  } = await (await getAdmin()).from("user_roles").select("role").eq("user_id", userId).in("role", ["admin", "super_admin", "operations"]);
  if (!data || data.length === 0) throw new Error("Forbidden: ops access required.");
}
async function assertAdmin(userId) {
  const {
    data
  } = await (await getAdmin()).from("user_roles").select("role").eq("user_id", userId).in("role", ["admin", "super_admin"]);
  if (!data || data.length === 0) throw new Error("Forbidden: admin access required.");
}
async function logAudit(actorId, action, entityIds, extra = {}) {
  await (await getAdmin()).from("audit_logs").insert({
    actor_id: actorId,
    entity_type: "lead",
    entity_id: entityIds.length === 1 ? entityIds[0] : `${entityIds.length} leads`,
    action,
    new_value: {
      ...extra,
      ids: entityIds.slice(0, 50)
    }
  });
}
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
const IdsStatusInput = object({
  ids: array(string().uuid()).min(1).max(2e3),
  status: _enum(LEAD_STATUSES)
});
const bulkUpdateLeadStatus_createServerFn_handler = createServerRpc({
  id: "06fa2a3e0155782bc44d5284fad876fa8de2e7ac8e280c13f44601e6b6595875",
  name: "bulkUpdateLeadStatus",
  filename: "src/lib/crm/leads-bulk.functions.ts"
}, (opts) => bulkUpdateLeadStatus.__executeServer(opts));
const bulkUpdateLeadStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdsStatusInput.parse(i)).handler(bulkUpdateLeadStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertOps(context.userId);
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  let finalIds = data.ids;
  if (!isAdmin) {
    const {
      data: allowedLeads
    } = await admin.from("leads").select("id").in("id", data.ids).eq("assigned_to", context.userId);
    finalIds = (allowedLeads ?? []).map((l) => l.id);
    if (finalIds.length === 0) throw new Error("Forbidden: None of the leads are assigned to you.");
  }
  let updated = 0;
  for (const batch of chunk(finalIds, 200)) {
    const {
      error,
      count
    } = await admin.from("leads").update({
      status: data.status
    }, {
      count: "exact"
    }).in("id", batch);
    if (error) throw new Error(error.message);
    updated += count ?? 0;
  }
  await logAudit(context.userId, "leads.bulk_status", data.ids, {
    status: data.status,
    updated
  });
  return {
    updated
  };
});
const IdsAssignInput = object({
  ids: array(string().uuid()).min(1).max(2e3),
  assignee: string().uuid().nullable()
});
const bulkAssignLeads_createServerFn_handler = createServerRpc({
  id: "ce1e068f5dcf99f7ea2b3a07492e1b45775a96328d70f1c69702279a892dac82",
  name: "bulkAssignLeads",
  filename: "src/lib/crm/leads-bulk.functions.ts"
}, (opts) => bulkAssignLeads.__executeServer(opts));
const bulkAssignLeads = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdsAssignInput.parse(i)).handler(bulkAssignLeads_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertOps(context.userId);
  let updated = 0;
  for (const batch of chunk(data.ids, 200)) {
    const {
      error,
      count
    } = await (await getAdmin()).from("leads").update({
      assigned_to: data.assignee
    }, {
      count: "exact"
    }).in("id", batch);
    if (error) throw new Error(error.message);
    updated += count ?? 0;
  }
  await logAudit(context.userId, "leads.bulk_assign", data.ids, {
    assignee: data.assignee,
    updated
  });
  return {
    updated
  };
});
const IdsInput = object({
  ids: array(string().uuid()).min(1).max(500)
});
const bulkDeleteLeads_createServerFn_handler = createServerRpc({
  id: "d1016360f0aa2151eba677d792bd1549b83ef1f0313e829577a3549f7555b732",
  name: "bulkDeleteLeads",
  filename: "src/lib/crm/leads-bulk.functions.ts"
}, (opts) => bulkDeleteLeads.__executeServer(opts));
const bulkDeleteLeads = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdsInput.parse(i)).handler(bulkDeleteLeads_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: paid
  } = await (await getAdmin()).from("payments").select("lead_id").in("lead_id", data.ids);
  const blocked = new Set((paid ?? []).map((p) => p.lead_id));
  const safe = data.ids.filter((id) => !blocked.has(id));
  let deleted = 0;
  for (const batch of chunk(safe, 200)) {
    const admin = await getAdmin();
    const {
      data: apps
    } = await admin.from("applications").select("id").in("lead_id", batch);
    const appIds = (apps ?? []).map((a) => a.id).filter(Boolean);
    await admin.from("leads").update({
      duplicate_of: null,
      is_duplicate: false
    }).in("duplicate_of", batch);
    if (appIds.length > 0) {
      await admin.from("workflow_events").delete().in("application_id", appIds);
      await admin.from("workflow_reminders").delete().in("application_id", appIds);
      await admin.from("workflow_delay_reasons").delete().in("application_id", appIds);
      await admin.from("workflow_closure_reasons").delete().in("application_id", appIds);
      await admin.from("application_events").delete().in("application_id", appIds);
      await admin.from("refund_requests").delete().in("application_id", appIds);
    }
    const {
      error: aeErr
    } = await admin.from("application_events").delete().in("lead_id", batch);
    if (aeErr) console.error("[bulkDeleteLeads] application_events delete error:", aeErr.message);
    await admin.from("activity_logs").delete().in("lead_id", batch);
    await admin.from("lead_notes").delete().in("lead_id", batch);
    await admin.from("documents").delete().in("lead_id", batch);
    await admin.from("onboarding_submissions").delete().in("lead_id", batch);
    await admin.from("follow_ups").delete().in("lead_id", batch);
    await admin.from("support_tickets").delete().in("lead_id", batch);
    await admin.from("payment_links").delete().in("lead_id", batch);
    await admin.from("analytics_events").delete().in("lead_id", batch);
    await admin.from("email_queue").delete().in("lead_id", batch);
    await admin.from("email_logs").delete().in("lead_id", batch);
    await admin.from("complaints").delete().in("lead_id", batch);
    await admin.from("certificates").delete().in("lead_id", batch);
    await admin.from("invoices").delete().in("lead_id", batch);
    await admin.from("refund_requests").delete().in("lead_id", batch);
    await admin.from("applications").delete().in("lead_id", batch);
    const {
      error,
      count
    } = await admin.from("leads").delete({
      count: "exact"
    }).in("id", batch);
    if (error) {
      console.error("[bulkDeleteLeads] leads delete failed:", error.message);
      throw new Error(error.message);
    }
    deleted += count ?? 0;
  }
  await logAudit(context.userId, "leads.bulk_delete", data.ids, {
    deleted,
    blocked_with_payments: blocked.size
  });
  return {
    deleted,
    blocked: blocked.size
  };
});
const BulkEmailInput = object({
  ids: array(string().uuid()).min(1).max(500),
  templateCode: string().min(1).max(80)
});
const bulkEmailLeads_createServerFn_handler = createServerRpc({
  id: "88277d7574050c50789162cf1f7746c4c1bd631711e4c2ffa402c12f5068602c",
  name: "bulkEmailLeads",
  filename: "src/lib/crm/leads-bulk.functions.ts"
}, (opts) => bulkEmailLeads.__executeServer(opts));
const bulkEmailLeads = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => BulkEmailInput.parse(i)).handler(bulkEmailLeads_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertOps(context.userId);
  const {
    enqueueFromTemplateInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  const {
    data: leads,
    error
  } = await (await getAdmin()).from("leads").select("id, name, email, lead_code, mobile, service, total_amount").in("id", data.ids);
  if (error) throw new Error(error.message);
  const {
    data: suppressed
  } = await (await getAdmin()).from("suppressed_emails").select("email");
  const suppressedSet = new Set((suppressed ?? []).map((s) => s.email.toLowerCase()));
  let queued = 0;
  let skipped = 0;
  let failed = 0;
  for (const lead of leads ?? []) {
    const email = lead.email?.toLowerCase();
    if (!email) {
      skipped++;
      continue;
    }
    if (suppressedSet.has(email)) {
      skipped++;
      continue;
    }
    try {
      await enqueueFromTemplateInternal(data.templateCode, email, {
        name: lead.name,
        lead_code: lead.lead_code,
        mobile: lead.mobile,
        service: lead.service,
        total_amount: lead.total_amount
      }, {
        toName: lead.name,
        leadId: lead.id
      });
      queued++;
    } catch {
      failed++;
    }
  }
  await logAudit(context.userId, "leads.bulk_email", data.ids, {
    template: data.templateCode,
    queued,
    skipped,
    failed
  });
  return {
    queued,
    skipped,
    failed
  };
});
const ExportInput = object({
  ids: array(string().uuid()).optional(),
  search: string().max(200).optional(),
  status: string().optional(),
  source: string().optional(),
  service: string().optional(),
  assignedTo: string().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
}).partial();
function buildCsvContent(headers, dataRows) {
  const csvEscape = (v) => {
    if (v == null) return "";
    const s = String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const headerLine = headers.map(csvEscape).join(",");
  const bodyLines = dataRows.map((r) => r.map(csvEscape).join(","));
  return "\uFEFF" + [headerLine, ...bodyLines].join("\n");
}
function buildExcelXmlContent(headers, dataRows) {
  const escapeXml = (v) => {
    if (v == null) return "";
    return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  };
  const xmlHeader = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Number">
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Leads Export">
  <Table>`;
  const columns = headers.map(() => `<Column ss:AutoFitWidth="1" ss:Width="140"/>`).join("\n");
  const headerRow = `   <Row ss:Height="24">
` + headers.map((h) => `    <Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join("\n") + `
   </Row>`;
  const rowsXml = dataRows.map((r) => {
    const cells = r.map((val) => {
      if (typeof val === "number") {
        return `    <Cell ss:StyleID="Number"><Data ss:Type="Number">${val}</Data></Cell>`;
      }
      return `    <Cell><Data ss:Type="String">${escapeXml(val)}</Data></Cell>`;
    }).join("\n");
    return `   <Row ss:Height="20">
${cells}
   </Row>`;
  }).join("\n");
  const xmlFooter = `  </Table>
 </Worksheet>
</Workbook>`;
  return `${xmlHeader}
${columns}
${headerRow}
${rowsXml}
${xmlFooter}`;
}
const exportLeadsCsv_createServerFn_handler = createServerRpc({
  id: "2cb45762b7358a631b5702b66598c9526942e2f77228d0a1e3e2d15173e63c23",
  name: "exportLeadsCsv",
  filename: "src/lib/crm/leads-bulk.functions.ts"
}, (opts) => exportLeadsCsv.__executeServer(opts));
const exportLeadsCsv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ExportInput.parse(i ?? {})).handler(exportLeadsCsv_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertOps(context.userId);
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  let q = admin.from("leads").select("id, lead_code, created_at, name, email, mobile, state, language, service, status, base_amount, gst_amount, total_amount, assigned_to, lead_source").order("created_at", {
    ascending: false
  }).limit(5e4);
  if (data.ids && data.ids.length > 0) {
    q = q.in("id", data.ids);
  } else {
    if (data.status) q = q.eq("status", data.status);
    if (data.source) {
      if (data.source.startsWith("__channel:")) {
        const ch = data.source.slice("__channel:".length);
        const prefixMap = {
          ads: "Google Ads",
          website: "Website",
          whatsapp: "WhatsApp",
          referral: "Referral",
          manual: "Manual",
          instagram: "Instagram",
          facebook: "Facebook"
        };
        const prefix = prefixMap[ch];
        if (prefix) {
          q = q.ilike("lead_source", `${prefix}%`);
        }
      } else {
        q = q.eq("lead_source", data.source);
      }
    }
    if (!isAdmin) {
      q = q.eq("assigned_to", context.userId);
    } else {
      if (data.assignedTo === "__unassigned") {
        q = q.is("assigned_to", null);
      } else if (data.assignedTo) {
        q = q.eq("assigned_to", data.assignedTo);
      }
    }
    if (data.dateFrom) q = q.gte("created_at", data.dateFrom);
    if (data.dateTo) q = q.lte("created_at", data.dateTo);
    if (data.search) {
      const s = data.search.replace(/[,()]/g, " ").trim();
      q = q.or(`lead_code.ilike.%${s}%,name.ilike.%${s}%,email.ilike.%${s}%,mobile.ilike.%${s}%`);
    }
  }
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const assigneeIds = Array.from(new Set((rows ?? []).map((r) => r.assigned_to).filter(Boolean)));
  const nameMap = /* @__PURE__ */ new Map();
  if (assigneeIds.length) {
    const {
      data: profs
    } = await (await getAdmin()).from("profiles").select("id, display_name, email").in("id", assigneeIds);
    (profs ?? []).forEach((p) => nameMap.set(p.id, p.display_name || p.email || ""));
  }
  const headers = ["Lead Code", "Created At", "Name", "Email", "Mobile", "State", "Language", "Service", "Status", "Base Amount", "GST Amount", "Total Amount", "Assigned To", "Lead Source"];
  const formattedRows = (rows ?? []).map((r) => [r.lead_code || "", r.created_at || "", r.name || "", r.email || "", r.mobile || "", r.state || "", r.language || "", r.service || "", (r.status || "").replace(/_/g, " "), Number(r.base_amount ?? 0), Number(r.gst_amount ?? 0), Number(r.total_amount ?? 0), r.assigned_to ? nameMap.get(r.assigned_to) ?? "" : "", r.lead_source || ""]);
  const csvContent = buildCsvContent(headers, formattedRows);
  const excelXmlContent = buildExcelXmlContent(headers, formattedRows);
  await logAudit(context.userId, "leads.export", (rows ?? []).map((r) => r.id), {
    count: rows?.length ?? 0,
    filter: data
  });
  return {
    csv: csvContent,
    excelXml: excelXmlContent,
    count: rows?.length ?? 0
  };
});
const listEnabledTemplates_createServerFn_handler = createServerRpc({
  id: "5a48d0f5e390a8b600bd7325a16d41c6ad86391cdd8bfa0f7cfea416f1014652",
  name: "listEnabledTemplates",
  filename: "src/lib/crm/leads-bulk.functions.ts"
}, (opts) => listEnabledTemplates.__executeServer(opts));
const listEnabledTemplates = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listEnabledTemplates_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabase.from("email_templates").select("code, name, subject, is_enabled").eq("is_enabled", true).order("name");
  if (error) throw new Error(error.message);
  return {
    rows: data ?? []
  };
});
const listAssignableStaff_createServerFn_handler = createServerRpc({
  id: "d6ad71ae21406133fa959e553fabe4b46832fdf0cadfe84258c23eb0fe10f137",
  name: "listAssignableStaff",
  filename: "src/lib/crm/leads-bulk.functions.ts"
}, (opts) => listAssignableStaff.__executeServer(opts));
const listAssignableStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAssignableStaff_createServerFn_handler, async ({
  context
}) => {
  await assertOps(context.userId);
  const {
    data: roles
  } = await (await getAdmin()).from("user_roles").select("user_id").in("role", ["admin", "super_admin", "operations", "support", "manager", "executive", "accounts", "finance"]);
  const ids = Array.from(new Set((roles ?? []).map((r) => r.user_id)));
  if (ids.length === 0) return {
    rows: []
  };
  const {
    data: profs
  } = await (await getAdmin()).from("profiles").select("id, display_name, email").in("id", ids).eq("is_active", true);
  return {
    rows: (profs ?? []).map((p) => ({
      id: p.id,
      name: p.display_name || p.email || "(unnamed)",
      email: p.email
    }))
  };
});
export {
  bulkAssignLeads_createServerFn_handler,
  bulkDeleteLeads_createServerFn_handler,
  bulkEmailLeads_createServerFn_handler,
  bulkUpdateLeadStatus_createServerFn_handler,
  exportLeadsCsv_createServerFn_handler,
  listAssignableStaff_createServerFn_handler,
  listEnabledTemplates_createServerFn_handler
};
