import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { isFieldVisible, MAX_DOC_SIZE_BYTES, ALLOWED_DOC_MIME } from "./schemas-DClqju6h.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { S as SERVICES } from "./constants-CKRzJJF_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { s as string, o as object, b as boolean, r as record, u as union, n as number, e as _null, _ as _enum } from "../_libs/zod.mjs";
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
const DEFAULT_ADMIN_EMAIL = "help@businesshelpservices.com";
const LeadCode = string().trim().regex(/^[A-Z]{2}-\d{4}-\d{6}$/, "Invalid reference code");
async function loadLeadByCode(admin, leadCode) {
  const {
    data,
    error
  } = await admin.from("leads").select("id, lead_code, name, email, mobile, service, service_id, status, total_amount").eq("lead_code", leadCode).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("We couldn't find that reference. Please double-check the link.");
  return data;
}
const AccessToken = string().trim().min(10).max(200);
async function loadAuthorizedLead(admin, leadCode, token, scope) {
  const {
    assertCustomerAccess,
    leadIdByCode
  } = await import("./customer-access.server-C_oBiISE.mjs");
  const {
    GENERIC_LINK_ERROR
  } = await import("./customer-access-core-Bd_9lLsD.mjs");
  const leadId = await leadIdByCode(leadCode);
  await assertCustomerAccess(token, leadId, scope, leadCode);
  try {
    return await loadLeadByCode(admin, leadCode);
  } catch {
    throw new Error(GENERIC_LINK_ERROR);
  }
}
async function resolveServiceCode(admin, serviceId, leadId, serviceLabel) {
  if (serviceId) {
    const {
      data
    } = await admin.from("services").select("service_code").eq("id", serviceId).maybeSingle();
    if (data?.service_code) return data.service_code;
  }
  if (leadId) {
    const {
      data: sub
    } = await admin.from("onboarding_submissions").select("service_code").eq("lead_id", leadId).not("service_code", "is", null).order("updated_at", {
      ascending: false
    }).limit(1).maybeSingle();
    if (sub?.service_code) return sub.service_code;
  }
  if (serviceLabel) {
    const normalized = serviceLabel.trim().toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ");
    const {
      data: svcRows
    } = await admin.from("services").select("service_code, service_name").limit(200);
    if (svcRows?.length) {
      const match = svcRows.find((r) => r.service_name.trim().toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ") === normalized);
      if (match) return match.service_code;
    }
  }
  if (serviceLabel) {
    const normalized = serviceLabel.trim().toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ");
    const aliases = {
      "new udyam registration": "new-udyam-registration",
      "new business help services": "new-udyam-registration",
      "update udyam certificate": "update-udyam-certificate",
      "download udyam certificate": "download-udyam-certificate",
      "udyam registration certificate download": "download-udyam-certificate",
      "download old udyam certificate": "download-udyam-certificate",
      "3 page udyam certificate download": "download-udyam-certificate",
      migrate: "migrate-udyog-aadhaar-to-udyam",
      "udyog aadhaar to udyam migration": "migrate-udyog-aadhaar-to-udyam",
      "udyog aadhar to udyam migration": "migrate-udyog-aadhaar-to-udyam",
      "forgot registered mobile / email": "forgot-mobile-email",
      "forgot registered mobile/email": "forgot-mobile-email",
      "correct pan / aadhaar name in udyam": "correct-pan-aadhaar",
      "correct pan / aadhar name in udyam": "correct-pan-aadhaar",
      "talk to expert": "talk-to-expert",
      "talk to expert - suitable service selection": "talk-to-expert",
      "expert consultation": "talk-to-expert"
    };
    if (aliases[normalized]) return aliases[normalized];
    const match = SERVICES.find((s) => s.label.trim().toLowerCase().replace(/[–—]/g, "-") === normalized);
    if (match?.slug) return match.slug;
  }
  console.warn(`[resolveServiceCode] Could not resolve service code for label="${serviceLabel}" id="${serviceId}" leadId="${leadId}" — falling back to new-udyam-registration`);
  return "new-udyam-registration";
}
const getOnboarding_createServerFn_handler = createServerRpc({
  id: "568493b198ca8dd94c8a85f18f0b6657e4d71573f746ad9e06c79e0141f2af24",
  name: "getOnboarding",
  filename: "src/lib/onboarding/onboarding.functions.ts"
}, (opts) => getOnboarding.__executeServer(opts));
const getOnboarding = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode,
  accessToken: AccessToken
}).parse(i)).handler(getOnboarding_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    loadServiceSchema
  } = await import("./schema-loader.server-DHyiVdV8.mjs");
  const lead = await loadAuthorizedLead(supabaseAdmin, data.leadCode, data.accessToken, "onboarding");
  const serviceCode = await resolveServiceCode(supabaseAdmin, lead.service_id, lead.id, lead.service);
  const schema = await loadServiceSchema(serviceCode);
  const [submissionRes, docsRes, paidPaymentRes] = await Promise.all([supabaseAdmin.from("onboarding_submissions").select("id, form_data, status, submitted_at, updated_at").eq("lead_id", lead.id).maybeSingle(), supabaseAdmin.from("documents").select("id, doc_type, file_name, mime_type, size_bytes, status, remarks, uploaded_at").eq("lead_id", lead.id).order("uploaded_at", {
    ascending: false
  }), supabaseAdmin.from("payments").select("id").eq("lead_id", lead.id).eq("status", "paid").limit(1).maybeSingle()]);
  if (submissionRes.error) throw new Error(submissionRes.error.message);
  if (docsRes.error) throw new Error(docsRes.error.message);
  const paid = !!paidPaymentRes.data || lead.status === "payment_successful" || lead.status === "under_process" || lead.status === "completed";
  return {
    lead: {
      leadCode: lead.lead_code,
      name: lead.name,
      email: lead.email,
      mobile: lead.mobile,
      service: lead.service,
      status: lead.status,
      paid
    },
    serviceCode,
    schema,
    submission: submissionRes.data,
    documents: docsRes.data ?? []
  };
});
const SubmitInput = object({
  leadCode: LeadCode,
  accessToken: AccessToken,
  // List-type answers (NIC activities, plants, bank details) are JSON strings and can be long.
  data: record(string().min(1).max(80), union([string().max(5e4), number(), boolean(), _null()])),
  draft: boolean().optional()
});
const submitOnboarding_createServerFn_handler = createServerRpc({
  id: "f2d2eb1a7cb2aa66e8afaefccd6dc38f0e92285810d24be34d15d9b64a767868",
  name: "submitOnboarding",
  filename: "src/lib/onboarding/onboarding.functions.ts"
}, (opts) => submitOnboarding.__executeServer(opts));
const submitOnboarding = createServerFn({
  method: "POST"
}).inputValidator((i) => SubmitInput.parse(i)).handler(submitOnboarding_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    loadServiceSchema
  } = await import("./schema-loader.server-DHyiVdV8.mjs");
  const lead = await loadAuthorizedLead(supabaseAdmin, data.leadCode, data.accessToken, "onboarding");
  const serviceCode = await resolveServiceCode(supabaseAdmin, lead.service_id, lead.id, lead.service);
  const schema = await loadServiceSchema(serviceCode);
  let mergedData = {
    ...data.data
  };
  const {
    data: prev
  } = await supabaseAdmin.from("onboarding_submissions").select("form_data").eq("lead_id", lead.id).maybeSingle();
  if (prev?.form_data) {
    mergedData = {
      ...prev.form_data,
      ...mergedData
    };
  }
  {
    const {
      promoteNicActivities
    } = await import("./nic-fill-ia8FfFhd.mjs");
    mergedData = promoteNicActivities(mergedData);
  }
  const validationFields = schema.fields;
  if (!data.draft) {
    const missing = [];
    for (const f of validationFields) {
      if (!f.required) continue;
      if (!isFieldVisible(f, validationFields, mergedData)) continue;
      const v = mergedData[f.key];
      if (v === void 0 || v === null || String(v).trim() === "") missing.push(f.label);
    }
    if (missing.length) throw new Error("Please fill: " + missing.slice(0, 4).join(", ") + (missing.length > 4 ? "…" : ""));
    const incDate = mergedData.incorporation_date;
    const comDate = mergedData.commencement_date;
    if (incDate && comDate && String(comDate) < String(incDate)) {
      throw new Error("Date of Commencement cannot be earlier than Date of Incorporation / Registration.");
    }
    for (const f of validationFields) {
      const key = f.key;
      if (typeof mergedData[key] === "string") {
        const isEmail = f.type === "email" || key.toLowerCase().includes("email") || f.label.toLowerCase().includes("email");
        if (isEmail) {
          mergedData[key] = String(mergedData[key]).trim().toLowerCase();
        }
      }
    }
    const plantsField = validationFields.find((f) => String(f.type) === "plants" || f.key === "plants");
    if (plantsField && isFieldVisible(plantsField, validationFields, mergedData)) {
      const rawPlants = mergedData[plantsField.key || "plants"];
      let plantArr = [];
      if (typeof rawPlants === "string" && rawPlants.trim()) {
        try {
          plantArr = JSON.parse(rawPlants);
        } catch {
        }
      } else if (Array.isArray(rawPlants)) {
        plantArr = rawPlants;
      }
      if (!Array.isArray(plantArr) || plantArr.length === 0) {
        throw new Error("At least one Plant / Unit detail is required.");
      }
      for (let i = 0; i < plantArr.length; i++) {
        const p = plantArr[i] || {};
        if (!p.unit_name || !p.city || !p.state || !p.pincode) {
          throw new Error(`Plant / Unit #${i + 1} is missing required address details.`);
        }
        const limits = [["address_flat", "Flat / Door / Block No.", 20], ["address_premises", "Name of Premises / Building", 50], ["address_village", "Village / Town", 30], ["address_block", "Block", 30], ["address_road", "Road / Street / Lane", 30], ["city", "City", 25]];
        for (const [k, label, max] of limits) {
          if (p[k] && String(p[k]).length > max) {
            throw new Error(`Plant / Unit #${i + 1}: ${label} can be at most ${max} characters.`);
          }
        }
      }
    }
    for (const f of validationFields) {
      if (!f.pattern) continue;
      if (!isFieldVisible(f, validationFields, mergedData)) continue;
      const v = mergedData[f.key];
      if (v === void 0 || v === null || String(v).trim() === "") continue;
      const valStr = String(v).trim();
      const rawPat = /^UDYAM-X+-X+-X+$/i.test(f.pattern.trim()) ? "^(UDYAM-[A-Z]{2}-\\d{2}-\\d{7}|[A-Z0-9-]{8,25})$" : f.pattern;
      const pat = rawPat.startsWith("^") && rawPat.endsWith("$") ? rawPat : `^(${rawPat})$`;
      try {
        if (!new RegExp(pat, "i").test(valStr)) {
          throw new Error(`Invalid format for ${f.label}.`);
        }
      } catch (err) {
        if (err instanceof Error && err.message.startsWith("Invalid format")) throw err;
        try {
          if (!new RegExp(f.pattern, "i").test(valStr)) {
            throw new Error(`Invalid format for ${f.label}.`);
          }
        } catch (e2) {
          if (e2 instanceof Error && e2.message.startsWith("Invalid format")) throw e2;
        }
      }
    }
  }
  const {
    data: app
  } = await supabaseAdmin.from("applications").select("id, order_status, fulfillment_status, closure_stage, workflow_status, form_status, form_submitted_at").eq("lead_id", lead.id).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const TERMINAL_ORDER_STATUSES = /* @__PURE__ */ new Set(["CLOSED", "COMPLETED", "REFUNDED", "CANCELLED"]);
  const CLOSED_FULFILLMENT = /* @__PURE__ */ new Set(["order_closed", "cancelled", "application_rejected", "certificate_rejected", "order_completed", "completed", "certificate_delivered", "service_completed", "application_approved", "approved", "refunded"]);
  const isTerminalOrder = Boolean(app && (TERMINAL_ORDER_STATUSES.has((app.order_status ?? "").toUpperCase()) || CLOSED_FULFILLMENT.has(app.fulfillment_status ?? "") || app.closure_stage === "closed" || app.closure_stage === "final_ticket_closed" || app.workflow_status === "closed" || app.workflow_status === "refund_closed"));
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: existingSub
  } = await supabaseAdmin.from("onboarding_submissions").select("id, status, submitted_at").eq("lead_id", lead.id).maybeSingle();
  const isAlreadySubmitted = existingSub?.status === "submitted" || Boolean(app?.form_submitted_at) || app?.form_status === "submitted" || isTerminalOrder;
  const targetStatus = data.draft && !isAlreadySubmitted ? "draft" : "submitted";
  const targetSubmittedAt = data.draft && !isAlreadySubmitted ? null : existingSub?.submitted_at || app?.form_submitted_at || now;
  const {
    error
  } = await supabaseAdmin.from("onboarding_submissions").upsert({
    lead_id: lead.id,
    application_id: app?.id ?? null,
    service_code: serviceCode,
    form_data: mergedData,
    status: targetStatus,
    submitted_at: targetSubmittedAt
  }, {
    onConflict: "lead_id"
  });
  if (error) throw new Error(error.message);
  if (!data.draft && app?.id && !isTerminalOrder) {
    await supabaseAdmin.from("applications").update({
      form_status: "submitted",
      form_submitted_at: now,
      order_status: "FORM_RECEIVED",
      fulfillment_status: "form_submitted",
      customer_hold_started_at: null,
      workflow_status: "processing",
      workflow_delay_reason: null,
      active_reason_id: null,
      active_reason_text: null
    }).eq("id", app.id);
    const {
      transitionStatusSystem
    } = await import("./transitions.server-Dp22-Q6w.mjs");
    const tr = await transitionStatusSystem({
      applicationId: app.id,
      toStatus: "details_pending",
      reason: "Onboarding details submitted"
    });
    if (!tr.ok) console.warn("[onboarding] transition skipped:", tr.reason);
    try {
      const {
        cancelTimers
      } = await import("./timers.server-BikGPSRc.mjs");
      await cancelTimers(app.id, ["form_pending_nudge_4h", "form_pending_autoclose_8h", "customer_hold_reminder"]);
      await supabaseAdmin.from("workflow_reminders").update({
        status: "cancelled"
      }).eq("application_id", app.id).eq("kind", "pending_closure_followup").in("status", ["pending", "failed"]);
      const {
        cancelAllForOrder
      } = await import("./schedulers.server-BPR-45Y2.mjs");
      await cancelAllForOrder(app.id, "form_submitted");
    } catch (e) {
      console.error("[onboarding] cancelling form timers failed", e);
    }
  } else if (!data.draft && app?.id && isTerminalOrder) {
    console.warn(`[onboarding] Skipped status update for terminal order ${app.id} (order_status=${app.order_status}, fulfillment_status=${app.fulfillment_status}). Form data has been saved to onboarding_submissions.`);
  }
  if (!data.draft) {
    const {
      count: docCount
    } = await supabaseAdmin.from("documents").select("id", {
      count: "exact",
      head: true
    }).eq("lead_id", lead.id);
    const {
      data: smtp
    } = await supabaseAdmin.from("smtp_settings").select("reply_to").order("updated_at", {
      ascending: false
    }).limit(1).maybeSingle();
    const adminTo = smtp?.reply_to ?? DEFAULT_ADMIN_EMAIL;
    const {
      enqueueFromTemplateInternal
    } = await import("./emails.server-BTJhg2a3.mjs");
    await enqueueFromTemplateInternal("admin_onboarding_submitted", adminTo, {
      customer_name: lead.name ?? "",
      name: lead.name ?? "",
      lead_code: lead.lead_code ?? "",
      service_name: lead.service ?? "",
      service: lead.service ?? "",
      document_count: docCount ?? 0
    }, {
      leadId: lead.id,
      applicationId: app?.id ?? void 0
    }).catch((e) => console.error("admin onboarding notification failed:", e));
    try {
      const {
        emitToRole,
        emitNotification
      } = await import("./emit.server-OhKEr4hO.mjs");
      if (lead.assigned_to) {
        await emitNotification({
          userId: lead.assigned_to,
          kind: "form_submitted",
          title: "Form Details Submitted",
          body: `${lead.name ?? "Customer"} submitted details for ${lead.service ?? ""}`,
          href: `/admin/leads/${lead.id}`,
          entityKind: "lead",
          entityId: lead.id
        });
      }
      await emitToRole("admin", {
        kind: "form_submitted",
        title: "Form Details Submitted",
        body: `${lead.name ?? "Customer"} submitted details for ${lead.service ?? ""}`,
        href: `/admin/leads/${lead.id}`,
        entityKind: "lead",
        entityId: lead.id
      });
      await emitToRole("super_admin", {
        kind: "form_submitted",
        title: "Form Details Submitted",
        body: `${lead.name ?? "Customer"} submitted details for ${lead.service ?? ""}`,
        href: `/admin/leads/${lead.id}`,
        entityKind: "lead",
        entityId: lead.id
      });
    } catch (e) {
      console.error("Internal notification emitting failed:", e);
    }
  }
  return {
    ok: true
  };
});
const UploadReqInput = object({
  leadCode: LeadCode,
  accessToken: AccessToken,
  docType: string().trim().min(1).max(60),
  fileName: string().trim().min(1).max(200),
  mimeType: string().trim().min(1).max(120),
  sizeBytes: number().int().min(1).max(MAX_DOC_SIZE_BYTES, `File too large. Max ${Math.round(MAX_DOC_SIZE_BYTES / 1024 / 1024)} MB.`)
});
const requestDocumentUpload_createServerFn_handler = createServerRpc({
  id: "d26efa7f1fc95b3400ac689b8f615e6a9023db787c42ac54b1e7249313b818fe",
  name: "requestDocumentUpload",
  filename: "src/lib/onboarding/onboarding.functions.ts"
}, (opts) => requestDocumentUpload.__executeServer(opts));
const requestDocumentUpload = createServerFn({
  method: "POST"
}).inputValidator((i) => UploadReqInput.parse(i)).handler(requestDocumentUpload_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  if (!ALLOWED_DOC_MIME.includes(data.mimeType.toLowerCase())) {
    throw new Error("Unsupported file type. Use PDF, JPG, PNG or WEBP.");
  }
  const lead = await loadAuthorizedLead(supabaseAdmin, data.leadCode, data.accessToken, "documents");
  const ext = (data.fileName.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) || "bin";
  const safeDocType = data.docType.replace(/[^a-z0-9_-]/gi, "_").slice(0, 40);
  const path = `${lead.id}/${safeDocType}-${Date.now()}.${ext}`;
  const {
    data: signed,
    error
  } = await supabaseAdmin.storage.from("documents").createSignedUploadUrl(path);
  if (error || !signed) throw new Error(error?.message ?? "Could not start upload.");
  return {
    path,
    token: signed.token,
    signedUrl: signed.signedUrl
  };
});
const ConfirmInput = object({
  leadCode: LeadCode,
  accessToken: AccessToken,
  docType: string().min(1).max(60),
  filePath: string().min(1).max(400),
  fileName: string().min(1).max(200),
  mimeType: string().min(1).max(120),
  sizeBytes: number().int().min(1).max(MAX_DOC_SIZE_BYTES)
});
const confirmDocumentUpload_createServerFn_handler = createServerRpc({
  id: "c64910ba5499b5d1e99d9126def59689b440e0a506943d28e49aeaabdedcf19c",
  name: "confirmDocumentUpload",
  filename: "src/lib/onboarding/onboarding.functions.ts"
}, (opts) => confirmDocumentUpload.__executeServer(opts));
const confirmDocumentUpload = createServerFn({
  method: "POST"
}).inputValidator((i) => ConfirmInput.parse(i)).handler(confirmDocumentUpload_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const lead = await loadAuthorizedLead(supabaseAdmin, data.leadCode, data.accessToken, "documents");
  if (!data.filePath.startsWith(`${lead.id}/`) || data.filePath.includes("..")) {
    throw new Error("Upload could not be verified. Please try again.");
  }
  const {
    data: existing
  } = await supabaseAdmin.from("documents").select("id, file_path").eq("lead_id", lead.id).eq("doc_type", data.docType);
  if (existing && existing.length) {
    const oldPaths = existing.map((r) => r.file_path);
    await supabaseAdmin.storage.from("documents").remove(oldPaths);
    await supabaseAdmin.from("documents").delete().in("id", existing.map((r) => r.id));
  }
  const {
    data: app
  } = await supabaseAdmin.from("applications").select("id").eq("lead_id", lead.id).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const {
    error
  } = await supabaseAdmin.from("documents").insert({
    lead_id: lead.id,
    application_id: app?.id ?? null,
    doc_type: data.docType,
    file_path: data.filePath,
    file_name: data.fileName,
    mime_type: data.mimeType,
    size_bytes: data.sizeBytes,
    status: "pending"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listOnboardingForLead_createServerFn_handler = createServerRpc({
  id: "aa709b406f4abd9550489179d2acbd69d4be33753e2e8ca268cfe4d048706eea",
  name: "listOnboardingForLead",
  filename: "src/lib/onboarding/onboarding.functions.ts"
}, (opts) => listOnboardingForLead.__executeServer(opts));
const listOnboardingForLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(listOnboardingForLead_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const [subRes, docRes] = await Promise.all([supabase.from("onboarding_submissions").select("id, service_code, form_data, status, submitted_at, updated_at").eq("lead_id", data.leadId).maybeSingle(), supabase.from("documents").select("id, doc_type, file_name, file_path, mime_type, size_bytes, status, remarks, uploaded_at, verified_at").eq("lead_id", data.leadId).order("uploaded_at", {
    ascending: false
  })]);
  if (subRes.error) throw new Error(subRes.error.message);
  if (docRes.error) throw new Error(docRes.error.message);
  return {
    submission: subRes.data,
    documents: docRes.data ?? []
  };
});
const getDocumentSignedUrl_createServerFn_handler = createServerRpc({
  id: "b53554934776d755cb0399c3fcf53ff1fe00a59ace30c4a5174f1b5042a5cd0d",
  name: "getDocumentSignedUrl",
  filename: "src/lib/onboarding/onboarding.functions.ts"
}, (opts) => getDocumentSignedUrl.__executeServer(opts));
const getDocumentSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(getDocumentSignedUrl_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    supabase
  } = context;
  const {
    data: isStaff
  } = await supabase.rpc("has_any_staff_role", {
    _user_id: context.userId
  });
  if (!isStaff) throw new Error("Not authorized.");
  const {
    data: doc,
    error
  } = await supabaseAdmin.from("documents").select("file_path").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!doc) throw new Error("Document not found.");
  const {
    data: signed,
    error: sErr
  } = await supabaseAdmin.storage.from("documents").createSignedUrl(doc.file_path, 60 * 10);
  if (sErr || !signed) throw new Error(sErr?.message ?? "Could not generate link.");
  return {
    url: signed.signedUrl
  };
});
const setDocumentStatus_createServerFn_handler = createServerRpc({
  id: "a85b06c6d418e4161ea026be601679e2eeed25ac21afbdd8f6e2f291e5f4f3d5",
  name: "setDocumentStatus",
  filename: "src/lib/onboarding/onboarding.functions.ts"
}, (opts) => setDocumentStatus.__executeServer(opts));
const setDocumentStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  status: _enum(["pending", "approved", "rejected"]),
  remarks: string().max(500).optional().nullable()
}).parse(i)).handler(setDocumentStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const verified = data.status === "approved";
  const {
    error
  } = await supabase.from("documents").update({
    status: data.status,
    remarks: data.remarks ?? null,
    verified_by: verified ? userId : null,
    verified_at: verified ? (/* @__PURE__ */ new Date()).toISOString() : null
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const requestFormHelp_createServerFn_handler = createServerRpc({
  id: "12ffab2d72b91e45d5a5887365c611c85db07c831a9b11477bc1712424abfed7",
  name: "requestFormHelp",
  filename: "src/lib/onboarding/onboarding.functions.ts"
}, (opts) => requestFormHelp.__executeServer(opts));
const requestFormHelp = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode,
  accessToken: AccessToken
}).parse(i)).handler(requestFormHelp_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const lead = await loadAuthorizedLead(supabaseAdmin, data.leadCode, data.accessToken, "help");
  await supabaseAdmin.from("activity_logs").insert({
    lead_id: lead.id,
    activity_type: "form_help_requested",
    activity_description: "Customer requested help submitting the onboarding form. Please contact them on the registered mobile number."
  });
  return {
    ok: true
  };
});
export {
  confirmDocumentUpload_createServerFn_handler,
  getDocumentSignedUrl_createServerFn_handler,
  getOnboarding_createServerFn_handler,
  listOnboardingForLead_createServerFn_handler,
  requestDocumentUpload_createServerFn_handler,
  requestFormHelp_createServerFn_handler,
  setDocumentStatus_createServerFn_handler,
  submitOnboarding_createServerFn_handler
};
