import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean, n as number, _ as _enum } from "../_libs/zod.mjs";
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
const Input = object({
  leadCode: string().trim().min(3).max(80),
  accessToken: string().trim().min(10).max(200)
});
const getApplicationSummary_createServerFn_handler = createServerRpc({
  id: "d2d1919a68fd9d08baebe96c655a187f25a4bcfd40745577844c3a2180b40dae",
  name: "getApplicationSummary",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => getApplicationSummary.__executeServer(opts));
const getApplicationSummary = createServerFn({
  method: "POST"
}).inputValidator((i) => Input.parse(i)).handler(getApplicationSummary_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const code = data.leadCode.trim();
  const cols = "id, lead_code, name, email, mobile, service, base_amount, gst_amount, total_amount, status, lead_status_v2, service_id, website_id";
  let lead = null;
  if (code.toUpperCase().startsWith("AP-")) {
    const {
      data: app,
      error: appErr
    } = await supabaseAdmin.from("applications").select(`lead_id, leads:lead_id (${cols})`).eq("application_code", code).maybeSingle();
    if (appErr) throw new Error(appErr.message);
    lead = app?.leads ?? null;
  } else {
    const {
      data: byLead,
      error
    } = await supabaseAdmin.from("leads").select(cols).eq("lead_code", code).maybeSingle();
    if (error) throw new Error(error.message);
    lead = byLead;
  }
  const {
    assertCustomerAccess
  } = await import("./customer-access.server-C_oBiISE.mjs");
  await assertCustomerAccess(data.accessToken, lead?.id ?? null, "summary", code);
  let serviceDescription = "";
  if (lead.service_id) {
    const {
      data: svc
    } = await supabaseAdmin.from("services").select("description").eq("id", lead.service_id).maybeSingle();
    if (svc) serviceDescription = svc.description || "";
  }
  const {
    data: payments
  } = await supabaseAdmin.from("payments").select("transaction_id, gateway_name, payment_date, status, amount").eq("lead_id", lead.id).order("created_at", {
    ascending: false
  });
  const {
    data: pendingLink
  } = await supabaseAdmin.from("payment_links").select("amount, expires_at, status").eq("lead_id", lead.id).eq("status", "pending").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const hasPendingLink = !!pendingLink && Number(pendingLink.amount) > 0;
  const pendingAmount = hasPendingLink ? Number(pendingLink.amount) : 0;
  const isAwaitingConvertedServicePayment = hasPendingLink || lead.status === "payment_pending" || lead.lead_status_v2 === "payment_pending";
  const successfulPayment = isAwaitingConvertedServicePayment ? null : payments?.find((p) => p.status === "paid") || null;
  const effectiveTotal = hasPendingLink ? pendingAmount : Number(lead.total_amount ?? 0);
  const effectiveBase = hasPendingLink ? Math.round(effectiveTotal / 1.18 * 100) / 100 : Number(lead.base_amount ?? 0);
  const effectiveGst = hasPendingLink ? Math.round((effectiveTotal - effectiveBase) * 100) / 100 : Number(lead.gst_amount ?? 0);
  const {
    data: gateways
  } = await supabaseAdmin.from("payment_gateways").select("id, name, display_name, is_enabled, priority, config").eq("is_enabled", true).order("priority", {
    ascending: true
  });
  const globalList = (gateways ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    displayName: g.display_name,
    priority: g.priority,
    logoUrl: g.config?.logo_url || null,
    isDefault: Boolean(g.config?.is_default),
    description: g.config?.description || null
  }));
  const {
    applyWebsiteGateways
  } = await import("./website-gateways-jUN09uZm.mjs");
  const {
    websiteGatewayRules
  } = await import("./website-gateways.server-BkGrEQ88.mjs");
  const activeList = applyWebsiteGateways(globalList, await websiteGatewayRules(lead.website_id));
  const defaultGw = activeList.find((g) => g.isDefault) || activeList[0] || null;
  return {
    lead: {
      leadCode: lead.lead_code,
      name: lead.name,
      email: lead.email,
      mobile: lead.mobile,
      service: lead.service,
      serviceDescription,
      baseAmount: effectiveBase,
      gstAmount: effectiveGst,
      totalAmount: effectiveTotal,
      status: lead.status,
      leadStatusV2: lead.lead_status_v2,
      payment: successfulPayment
    },
    hasPendingLink,
    pendingAmount,
    gateways: activeList,
    defaultGateway: defaultGw?.name || (activeList.length > 0 ? activeList[0].name : "")
  };
});
const UpdateContact = object({
  leadCode: string().trim().min(3).max(80),
  accessToken: string().trim().min(10).max(200),
  name: string().trim().min(2).max(120),
  email: string().trim().email().max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  currentEmail: string().trim().email().max(160).optional(),
  currentMobile: string().trim().regex(/^[6-9]\d{9}$/).optional()
}).refine((v) => v.currentEmail || v.currentMobile, {
  message: "currentEmail or currentMobile is required to prove ownership"
});
const updateLeadContact_createServerFn_handler = createServerRpc({
  id: "b0ae9c064171c2de5f323c1dfda080c3a203e50f5491efcb7f3b2123728dcc35",
  name: "updateLeadContact",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => updateLeadContact.__executeServer(opts));
const updateLeadContact = createServerFn({
  method: "POST"
}).inputValidator((i) => UpdateContact.parse(i)).handler(updateLeadContact_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: lead
  } = await supabaseAdmin.from("leads").select("id, status, email, mobile").eq("lead_code", data.leadCode).maybeSingle();
  {
    const {
      assertCustomerAccess
    } = await import("./customer-access.server-C_oBiISE.mjs");
    await assertCustomerAccess(data.accessToken, lead?.id ?? null, "contact_update", data.leadCode);
  }
  if (!lead) throw new Error("Application not found");
  if (lead.status === "payment_successful" || lead.status === "completed") {
    throw new Error("Details can't be changed after payment.");
  }
  const emailMatches = data.currentEmail && lead.email && lead.email.toLowerCase() === data.currentEmail.toLowerCase();
  const mobileMatches = data.currentMobile && lead.mobile === data.currentMobile;
  if (!emailMatches && !mobileMatches) {
    throw new Error("Verification failed. Please contact support.");
  }
  const {
    error
  } = await supabaseAdmin.from("leads").update({
    name: data.name,
    email: data.email.toLowerCase(),
    mobile: data.mobile
  }).eq("id", lead.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listGateways_createServerFn_handler = createServerRpc({
  id: "4e8e88977ddb97dd593ce7f551542820185b53a6b656830f0a87bf718d37fd87",
  name: "listGateways",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => listGateways.__executeServer(opts));
const listGateways = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listGateways_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabaseAdmin.from("payment_gateways").select("id, name, display_name, is_enabled, priority, config, webhook_secret_name, updated_at").order("priority", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return {
    rows: data ?? []
  };
});
const GatewayUpdate = object({
  id: string().uuid(),
  display_name: string().trim().min(1).optional(),
  is_enabled: boolean().optional(),
  priority: number().int().min(0).max(999).optional(),
  logo_url: string().trim().nullable().optional(),
  is_default: boolean().optional(),
  description: string().trim().nullable().optional()
});
const updateGateway_createServerFn_handler = createServerRpc({
  id: "ad8f7485f17d344a376154f86c82b33b021de429a28d9353abafaa3e17ebf4b2",
  name: "updateGateway",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => updateGateway.__executeServer(opts));
const updateGateway = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => GatewayUpdate.parse(i)).handler(updateGateway_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: current
  } = await supabaseAdmin.from("payment_gateways").select("*").eq("id", data.id).maybeSingle();
  if (!current) throw new Error("Gateway not found");
  const curConfig = current.config || {};
  const newConfig = {
    ...curConfig,
    ...data.logo_url !== void 0 ? {
      logo_url: data.logo_url
    } : {},
    ...data.is_default !== void 0 ? {
      is_default: data.is_default
    } : {},
    ...data.description !== void 0 ? {
      description: data.description
    } : {}
  };
  if (data.is_default === true) {
    const {
      data: allGws
    } = await supabaseAdmin.from("payment_gateways").select("id, config");
    for (const g of allGws ?? []) {
      if (g.id !== data.id && g.config?.is_default) {
        await supabaseAdmin.from("payment_gateways").update({
          config: {
            ...g.config,
            is_default: false
          }
        }).eq("id", g.id);
      }
    }
  }
  const patch = {
    config: newConfig,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (data.display_name !== void 0) patch.display_name = data.display_name;
  if (data.is_enabled !== void 0) patch.is_enabled = data.is_enabled;
  if (data.priority !== void 0) patch.priority = data.priority;
  const {
    error
  } = await supabaseAdmin.from("payment_gateways").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const LogoUploadSchema = object({
  id: string().uuid(),
  fileBase64: string(),
  fileName: string(),
  mimeType: string()
});
const uploadGatewayLogo_createServerFn_handler = createServerRpc({
  id: "c928c74a3ac6888dbaad8614a5b11b51d00f78d0123cade2a5cbac362869074e",
  name: "uploadGatewayLogo",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => uploadGatewayLogo.__executeServer(opts));
const uploadGatewayLogo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LogoUploadSchema.parse(i)).handler(uploadGatewayLogo_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  let logoUrl = `data:${data.mimeType};base64,${data.fileBase64}`;
  try {
    const buffer = Buffer.from(data.fileBase64, "base64");
    const ext = data.fileName.split(".").pop() || "png";
    const filePath = `gateway-logos/${data.id}-${Date.now()}.${ext}`;
    const {
      error: uploadErr
    } = await supabaseAdmin.storage.from("documents").upload(filePath, buffer, {
      contentType: data.mimeType,
      upsert: true
    });
    if (!uploadErr) {
      const {
        data: pubUrlData
      } = supabaseAdmin.storage.from("documents").getPublicUrl(filePath);
      if (pubUrlData?.publicUrl) logoUrl = pubUrlData.publicUrl;
    }
  } catch (e) {
    console.warn("[uploadGatewayLogo] storage upload fallback to data URL", e);
  }
  const {
    data: current
  } = await supabaseAdmin.from("payment_gateways").select("*").eq("id", data.id).maybeSingle();
  if (!current) throw new Error("Gateway not found");
  const curConfig = current.config || {};
  const newConfig = {
    ...curConfig,
    logo_url: logoUrl
  };
  const {
    error
  } = await supabaseAdmin.from("payment_gateways").update({
    config: newConfig,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true,
    logoUrl
  };
});
const checkCcavenueCredentials_createServerFn_handler = createServerRpc({
  id: "60c340c86c87ebf31fbc35a80bee87cc159a655b56904f51965efc12b82223f0",
  name: "checkCcavenueCredentials",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => checkCcavenueCredentials.__executeServer(opts));
const checkCcavenueCredentials = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(checkCcavenueCredentials_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, ["super_admin"]);
  try {
    const {
      callOrderStatusApi
    } = await import("./ccavenue.server-DLXDMTcZ.mjs");
    const res = await callOrderStatusApi("CCAV-SELFCHECK-000000");
    const raw = res.raw ?? {};
    const errText = String(raw.error_desc ?? raw.reason ?? raw.status_message ?? raw.message ?? "").toLowerCase();
    const keys = Object.keys(raw);
    if (keys.length === 0) {
      return {
        ok: false,
        message: "CCAvenue did not return a readable response. The working key is most likely wrong (decryption failed)."
      };
    }
    if (errText.includes("access code") || errText.includes("merchant") || errText.includes("authentication")) {
      return {
        ok: false,
        message: `CCAvenue's optional Merchant Web API (Status/Refund) is not enabled for this account (${errText}). Live checkout, callbacks and payment confirmation are unaffected — only admin-side refunds and manual status re-checks need this API.`
      };
    }
    if (errText.includes("decrypt")) {
      return {
        ok: false,
        message: "Could not decrypt the CCAvenue response — the working key looks wrong."
      };
    }
    return {
      ok: true,
      message: "CCAvenue accepted the credentials (test lookup returned a normal 'order not found' style response)."
    };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : String(e)
    };
  }
});
const listWebsiteGateways_createServerFn_handler = createServerRpc({
  id: "d1653e71979212c9a27274cd6c5362e87e89dbbbb46fb5b675d66858ad2d19bd",
  name: "listWebsiteGateways",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => listWebsiteGateways.__executeServer(opts));
const listWebsiteGateways = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listWebsiteGateways_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const db = supabaseAdmin;
  const [sites, rules, globals, cf, cfAccts] = await Promise.all([db.from("websites").select("id, name, is_active, is_primary, sort_order, payments_enabled").order("sort_order"), db.from("website_payment_gateways").select("website_id, gateway_name, is_enabled, is_default"), db.from("payment_gateways").select("name, display_name, is_enabled"), db.from("cashfree_website_accounts").select("website_id, account_id, is_enabled"), db.from("cashfree_merchant_accounts").select("id, label, is_active")]);
  if (sites.error || rules.error) throw new Error("Could not load website payment options.");
  const acct = new Map((cfAccts.data ?? []).map((a) => [a.id, a]));
  return {
    // Website names only; partner domains are never sent to the screen.
    websites: (sites.data ?? []).map((w) => {
      const map = (cf.data ?? []).find((m) => m.website_id === w.id && m.is_enabled);
      const a = map ? acct.get(map.account_id) : null;
      return {
        id: w.id,
        name: w.name,
        isActive: w.is_active,
        isPrimary: w.is_primary,
        paymentsEnabled: w.payments_enabled !== false,
        cashfreeAccount: a?.is_active ? a.label : null,
        cashfreeAccountId: a?.is_active ? a.id : null
      };
    }),
    rules: rules.data ?? [],
    globals: (globals.data ?? []).filter((g) => ["cashfree", "payu", "ccavenue"].includes(g.name))
  };
});
const WebsiteGatewayInput = object({
  websiteId: string().uuid(),
  gateway: _enum(["cashfree", "payu", "ccavenue"]),
  isEnabled: boolean(),
  isDefault: boolean()
});
const setWebsiteGateway_createServerFn_handler = createServerRpc({
  id: "299b87b386cf821c9d2175b3ee03f20b9d19efc7459ff8588feee4bd5640c943",
  name: "setWebsiteGateway",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => setWebsiteGateway.__executeServer(opts));
const setWebsiteGateway = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => WebsiteGatewayInput.parse(i)).handler(setWebsiteGateway_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const db = supabaseAdmin;
  const isDefault = data.isEnabled && data.isDefault;
  if (isDefault) {
    await db.from("website_payment_gateways").update({
      is_default: false,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("website_id", data.websiteId).neq("gateway_name", data.gateway);
  }
  const {
    error
  } = await db.from("website_payment_gateways").upsert({
    website_id: data.websiteId,
    gateway_name: data.gateway,
    is_enabled: data.isEnabled,
    is_default: isDefault,
    updated_by: context.userId,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, {
    onConflict: "website_id,gateway_name"
  });
  if (error) throw new Error("Could not save the payment option.");
  return {
    ok: true
  };
});
const setWebsitePaymentsEnabled_createServerFn_handler = createServerRpc({
  id: "68a0749206bdc320b8012142b4adc5cca47557871e787824af8cc7ed62b7e3a1",
  name: "setWebsitePaymentsEnabled",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => setWebsitePaymentsEnabled.__executeServer(opts));
const setWebsitePaymentsEnabled = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  websiteId: string().uuid(),
  enabled: boolean()
}).parse(i)).handler(setWebsitePaymentsEnabled_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    error
  } = await supabaseAdmin.from("websites").update({
    payments_enabled: data.enabled
  }).eq("id", data.websiteId);
  if (error) throw new Error("Could not save the payment setting.");
  return {
    ok: true
  };
});
const listCashfreeAccounts_createServerFn_handler = createServerRpc({
  id: "93370f49b87a0612ddb801b4160c30de41ab3f1a7d58f67f8e127bb88e5fca12",
  name: "listCashfreeAccounts",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => listCashfreeAccounts.__executeServer(opts));
const listCashfreeAccounts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listCashfreeAccounts_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const db = supabaseAdmin;
  const [accts, creds, maps] = await Promise.all([db.from("cashfree_merchant_accounts").select("id, account_key, label, is_legacy, is_active, created_at").order("created_at"), db.from("cashfree_account_credentials").select("account_id, client_id, mode, updated_at"), db.from("cashfree_website_accounts").select("account_id, is_enabled")]);
  if (accts.error) throw new Error("Could not load merchant accounts.");
  return {
    accounts: (accts.data ?? []).map((a) => {
      const c = (creds.data ?? []).find((x) => x.account_id === a.id);
      const id = String(c?.client_id ?? "");
      return {
        id: a.id,
        key: a.account_key,
        label: a.label,
        isLegacy: a.is_legacy,
        isActive: a.is_active,
        // Only a masked hint of the App ID; the secret key is never returned.
        credentials: a.is_legacy ? "global" : c ? "saved" : "missing",
        clientIdHint: c ? `${id.slice(0, 4)}…${id.slice(-4)}` : null,
        mode: c?.mode ?? null,
        updatedAt: c?.updated_at ?? null,
        websites: (maps.data ?? []).filter((m) => m.account_id === a.id && m.is_enabled).length
      };
    })
  };
});
const SaveAccountInput = object({
  accountId: string().uuid().optional(),
  label: string().trim().min(2).max(80),
  accountKey: string().trim().toUpperCase().regex(/^[A-Z][A-Z0-9_]{1,30}$/, "Use letters, numbers and _ only").optional(),
  clientId: string().trim().min(4).max(200),
  clientSecret: string().trim().min(8).max(500),
  mode: _enum(["production", "sandbox"])
});
const saveCashfreeAccount_createServerFn_handler = createServerRpc({
  id: "9c4111329a69a79f89481e64f3feff498d735bcde7c8e2f6c75460ddbb31aa1d",
  name: "saveCashfreeAccount",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => saveCashfreeAccount.__executeServer(opts));
const saveCashfreeAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SaveAccountInput.parse(i)).handler(saveCashfreeAccount_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin"]);
  const {
    testCashfreeCreds,
    encryptPaymentSecret
  } = await import("./cashfree-accounts.server-guyWBqWD.mjs");
  const check = await testCashfreeCreds({
    clientId: data.clientId,
    clientSecret: data.clientSecret,
    isProd: data.mode === "production"
  });
  if (!check.ok) return {
    ok: false,
    message: check.message
  };
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const db = supabaseAdmin;
  let accountId = data.accountId;
  if (accountId) {
    const {
      data: a
    } = await db.from("cashfree_merchant_accounts").select("id, is_legacy").eq("id", accountId).maybeSingle();
    if (!a) return {
      ok: false,
      message: "Merchant account not found."
    };
    if (a.is_legacy) return {
      ok: false,
      message: "The original account uses the main project keys and cannot be changed here."
    };
    await db.from("cashfree_merchant_accounts").update({
      label: data.label,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", accountId);
  } else {
    if (!data.accountKey) return {
      ok: false,
      message: "Enter a short account code."
    };
    const {
      data: created,
      error
    } = await db.from("cashfree_merchant_accounts").insert({
      account_key: data.accountKey,
      label: data.label,
      is_legacy: false,
      is_active: true
    }).select("id").single();
    if (error || !created) return {
      ok: false,
      message: error?.code === "23505" ? "That account code is already used." : "Could not create the account."
    };
    accountId = created.id;
  }
  const ciphertext = await encryptPaymentSecret(data.clientSecret, accountId);
  const {
    error: credErr
  } = await db.from("cashfree_account_credentials").upsert({
    account_id: accountId,
    client_id: data.clientId,
    client_secret_ciphertext: ciphertext,
    mode: data.mode,
    updated_by: context.userId,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, {
    onConflict: "account_id"
  });
  if (credErr) return {
    ok: false,
    message: "Could not save the keys."
  };
  return {
    ok: true,
    message: `${check.message} Saved securely.`
  };
});
const setCashfreeAccountActive_createServerFn_handler = createServerRpc({
  id: "334d63f0b24a687445ce01e9d9cfdd0f73f178d19cd91a7b9208f4557bca986b",
  name: "setCashfreeAccountActive",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => setCashfreeAccountActive.__executeServer(opts));
const setCashfreeAccountActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  accountId: string().uuid(),
  isActive: boolean()
}).parse(i)).handler(setCashfreeAccountActive_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin"]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    error
  } = await supabaseAdmin.from("cashfree_merchant_accounts").update({
    is_active: data.isActive,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.accountId);
  if (error) throw new Error("Could not update the account.");
  return {
    ok: true
  };
});
const setWebsiteCashfreeAccount_createServerFn_handler = createServerRpc({
  id: "62922bda681f7d917a254c37aca9a817debd776b1f6de58692e0b9674d974332",
  name: "setWebsiteCashfreeAccount",
  filename: "src/lib/payments/gateways.functions.ts"
}, (opts) => setWebsiteCashfreeAccount.__executeServer(opts));
const setWebsiteCashfreeAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  websiteId: string().uuid(),
  accountId: string().uuid()
}).parse(i)).handler(setWebsiteCashfreeAccount_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin"]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const db = supabaseAdmin;
  const {
    data: a
  } = await db.from("cashfree_merchant_accounts").select("id, is_legacy, is_active").eq("id", data.accountId).maybeSingle();
  if (!a || !a.is_active) throw new Error("Choose an active merchant account.");
  if (!a.is_legacy) {
    const {
      data: c
    } = await db.from("cashfree_account_credentials").select("account_id").eq("account_id", a.id).maybeSingle();
    if (!c) throw new Error("Add this account's keys before linking a website.");
  }
  const {
    error
  } = await db.from("cashfree_website_accounts").upsert({
    website_id: data.websiteId,
    account_id: data.accountId,
    is_enabled: true,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, {
    onConflict: "website_id"
  });
  if (error) throw new Error("Could not link the website.");
  return {
    ok: true
  };
});
export {
  checkCcavenueCredentials_createServerFn_handler,
  getApplicationSummary_createServerFn_handler,
  listCashfreeAccounts_createServerFn_handler,
  listGateways_createServerFn_handler,
  listWebsiteGateways_createServerFn_handler,
  saveCashfreeAccount_createServerFn_handler,
  setCashfreeAccountActive_createServerFn_handler,
  setWebsiteCashfreeAccount_createServerFn_handler,
  setWebsiteGateway_createServerFn_handler,
  setWebsitePaymentsEnabled_createServerFn_handler,
  updateGateway_createServerFn_handler,
  updateLeadContact_createServerFn_handler,
  uploadGatewayLogo_createServerFn_handler
};
