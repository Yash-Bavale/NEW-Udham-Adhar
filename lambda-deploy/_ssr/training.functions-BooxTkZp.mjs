import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { i as isUserAdmin } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, b as boolean, s as string, n as number, a as array, _ as _enum } from "../_libs/zod.mjs";
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
const DEFAULT_TRAINING_MATERIALS = [{
  id: "sop-udyam-new-reg-01",
  title: "SOP: New Udyam Registration & Document Verification",
  description: "Standard end-to-end operating procedure for processing brand new Udyam MSME registrations, Aadhaar OTP authentication, and PAN validation.",
  category: "Process & Portals",
  content_type: "rich_text",
  content: `## Objective
Guide executive and operations staff on processing new MSME Udyam applications accurately within SLA.

### 1. Initial Verification Checklist
- **Aadhaar Number**: Verify 12-digit Aadhaar of proprietor/partner/director.
- **PAN Card**: Verify PAN is active and matches applicant's legal name.
- **Bank Account Details**: IFSC Code and Account number matching business name.
- **Enterprise Details**: Major activity (Manufacturing / Service), NIC 2-digit & 5-digit codes.

### 2. Processing Steps on National Portal
1. Open official government Udyam registration portal.
2. Enter Aadhaar number and applicant name as per Aadhaar.
3. Call customer immediately for OTP when prompt displays.
4. Validate PAN details and organization type (Proprietary / Partnership / Private Limited).
5. Enter investment details, plant & machinery value, and turnover from previous ITR.
6. Submit final OTP authentication with customer on phone.

### 3. Error Handling
- **Aadhaar Name Mismatch**: Request customer's Aadhaar update or verify spelling.
- **Server Gateway Timeout**: Place order into **Technical Delay** with government portal timestamp.`,
  tags: ["udyam", "sop", "new-registration", "process"],
  is_pinned: true,
  is_published: true,
  sort_order: 1,
  created_by_name: "Super Admin",
  created_at: "2026-09-01T10:00:00.000Z",
  updated_at: "2026-09-25T14:30:00.000Z"
}, {
  id: "sop-customer-delay-protocol-02",
  title: "SOP: Customer Delay, OTP Follow-up & Holding Protocol",
  description: "Step-by-step guideline on placing orders in Customer Delay, maximum hold durations, and WhatsApp/Call retry schedules.",
  category: "Customer Handling",
  content_type: "rich_text",
  content: `## Customer Delay & OTP Management Rules

### When to mark Customer Delay:
- Customer phone is unreachable, switched off, or not answering after **3 call attempts**.
- Customer is not ready with OTP / Aadhaar linked mobile is with another family member.
- Customer requested to call back at a specific time.
- Missing documents (PAN copy, electricity bill, canceled cheque).

### Execution Flow:
1. Trigger WhatsApp automated document / OTP link from CRM.
2. Select exact **Customer Delay Reason** in CRM workflow.
3. Schedule next **Callback Reminder** with exact date and time requested by customer.
4. Never leave order in untracked state; always record specific notes on customer conversation.

### Maximum Hold Duration:
- Customer Delay is permitted for up to **72 hours** with daily follow-up calls before escalation.`,
  tags: ["customer-delay", "otp", "follow-up", "sop"],
  is_pinned: true,
  is_published: true,
  sort_order: 2,
  created_by_name: "Super Admin",
  created_at: "2026-09-02T11:00:00.000Z",
  updated_at: "2026-09-26T10:00:00.000Z"
}, {
  id: "sop-nic-technical-hold-03",
  title: "SOP: Technical Delay & NIC Government Portal Downtime",
  description: "Rules for placing orders into Technical Delay when government servers or gateway APIs are temporarily down.",
  category: "Technical & NIC Delays",
  content_type: "rich_text",
  content: `## Technical Delay Protocol

### Eligibility:
- NIC Government Portal displaying 502/504 Bad Gateway.
- Aadhaar UIDAI e-KYC authentication server downtime.
- Income Tax PAN verification service unreachable.

### Steps:
1. Verify downtime across 2 independent browsers/networks.
2. Update CRM order stage to **Technical Delay**.
3. Select specific technical reason code (e.g. \`NIC_PORTAL_DOWN\`, \`UIDAI_OTP_SERVER_DOWN\`).
4. Re-check government portal every **45 minutes**. Once live, immediately resume and process pending queue.`,
  tags: ["technical-delay", "nic-portal", "uidai", "server-down"],
  is_pinned: false,
  is_published: true,
  sort_order: 3,
  created_by_name: "Super Admin",
  created_at: "2026-09-03T09:30:00.000Z",
  updated_at: "2026-09-20T16:00:00.000Z"
}, {
  id: "sop-hot-orders-ticket-escalations-04",
  title: "SOP: Hot Priority Orders & Escalated Ticket Handling",
  description: "Guidelines for processing urgent <15 min SLA hot priority orders received from customer support tickets.",
  category: "Customer Handling",
  content_type: "rich_text",
  content: `## Hot Priority Order Protocol (< 15 Min SLA)

### Criteria:
- Order marked **HOT ORDER NOW** with flame indicator.
- Support team escalated customer ticket (#TICKET-ID).
- Reopened completed order requiring certificate correction or urgent delivery.

### Immediate Actions:
1. Prioritize before any normal queue orders.
2. Call customer within **5 minutes** of assignment.
3. Review ticket remarks attached to order.
4. Deliver updated certificate or resolve modification request immediately.`,
  tags: ["hot-orders", "tickets", "urgent", "sla"],
  is_pinned: true,
  is_published: true,
  sort_order: 4,
  created_by_name: "Super Admin",
  created_at: "2026-09-05T12:00:00.000Z",
  updated_at: "2026-09-26T12:00:00.000Z"
}, {
  id: "sop-certificate-delivery-quality-05",
  title: "SOP: Certificate Generation & Quality Audit Checklist",
  description: "Pre-dispatch quality checklist before uploading final Udyam Registration Certificate and marking order completed.",
  category: "Compliance & Verification",
  content_type: "rich_text",
  content: `## Certificate Quality Control Checklist

Before uploading the final PDF certificate:
- [ ] Udyam Registration Number (URN) format is valid (\`UDYAM-XX-00-0000000\`).
- [ ] Enterprise Name is spelled 100% identically to customer application.
- [ ] Major Activity (Manufacturing / Services) correctly classified.
- [ ] PDF is clean, high resolution, with official QR code verifiable.
- [ ] Upload to CRM to trigger automated WhatsApp & Email certificate delivery.`,
  tags: ["certificate", "quality-check", "delivery", "completion"],
  is_pinned: false,
  is_published: true,
  sort_order: 5,
  created_by_name: "Super Admin",
  created_at: "2026-09-06T14:00:00.000Z",
  updated_at: "2026-09-22T11:00:00.000Z"
}];
const STORAGE_BLOCK_KEY = "training_library_documents";
function cleanStoragePath(urlOrPath) {
  if (!urlOrPath) return null;
  const trimmed = urlOrPath.trim();
  if (!trimmed) return null;
  if (trimmed.includes("/documents/")) {
    const extracted = trimmed.split("/documents/")[1].split("?")[0];
    return decodeURIComponent(extracted);
  }
  return trimmed;
}
async function getTargetWebsiteId(admin) {
  const {
    data: websites
  } = await admin.from("websites").select("id").order("created_at", {
    ascending: true
  }).limit(1);
  if (websites && websites.length > 0 && websites[0].id) {
    return websites[0].id;
  }
  return "00000000-0000-0000-0000-000000000000";
}
async function loadPersistedTrainingMaterials(admin) {
  try {
    const {
      data: block,
      error
    } = await admin.from("site_content_blocks").select("content").eq("block_key", STORAGE_BLOCK_KEY).limit(1).maybeSingle();
    if (error) {
      console.warn("Could not query training block:", error.message);
    }
    if (block?.content && Array.isArray(block.content) && block.content.length > 0) {
      return block.content;
    }
  } catch (err) {
    console.error("loadPersistedTrainingMaterials error:", err);
  }
  return DEFAULT_TRAINING_MATERIALS;
}
async function savePersistedTrainingMaterials(admin, list) {
  const {
    data: existing,
    error: findError
  } = await admin.from("site_content_blocks").select("id, website_id").eq("block_key", STORAGE_BLOCK_KEY).limit(1).maybeSingle();
  if (existing?.id) {
    const {
      error: updateError
    } = await admin.from("site_content_blocks").update({
      content: list,
      is_active: true,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", existing.id);
    if (updateError) {
      console.error("Failed to update training site_content_blocks:", updateError);
      throw new Error(`Failed to update training materials: ${updateError.message}`);
    }
    return;
  }
  const websiteId = await getTargetWebsiteId(admin);
  const {
    error: insertError
  } = await admin.from("site_content_blocks").upsert({
    website_id: websiteId,
    block_key: STORAGE_BLOCK_KEY,
    content: list,
    is_active: true
  }, {
    onConflict: "website_id,block_key"
  });
  if (insertError) {
    console.error("Failed to insert training site_content_blocks:", insertError);
    throw new Error(`Failed to save training materials: ${insertError.message}`);
  }
}
async function attachSignedUrlIfNeeded(admin, item) {
  if (!item.document_url) return item;
  const docUrl = item.document_url;
  if (docUrl.startsWith("training/") || docUrl.startsWith("documents/training/")) {
    const path = docUrl.startsWith("documents/") ? docUrl.replace(/^documents\//, "") : docUrl;
    try {
      const {
        data: signed
      } = await admin.storage.from("documents").createSignedUrl(path, 60 * 60 * 24 * 7);
      if (signed?.signedUrl) {
        return {
          ...item,
          document_url: signed.signedUrl
        };
      }
    } catch {
    }
  }
  return item;
}
const listTrainingMaterials_createServerFn_handler = createServerRpc({
  id: "58e1777f82254bc16ea59ab14ff8496467833fc3a0f553f3c4a173b781add12c",
  name: "listTrainingMaterials",
  filename: "src/lib/crm/training.functions.ts"
}, (opts) => listTrainingMaterials.__executeServer(opts));
const listTrainingMaterials = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  category: string().optional(),
  query: string().optional(),
  includeDrafts: boolean().default(false)
}).parse(i ?? {})).handler(listTrainingMaterials_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  const rawMaterials = await loadPersistedTrainingMaterials(admin);
  let result = rawMaterials;
  if (!isAdmin && !data.includeDrafts) {
    result = result.filter((m) => m.is_published);
  }
  if (data.category && data.category !== "All") {
    result = result.filter((m) => m.category === data.category);
  }
  if (data.query && data.query.trim()) {
    const q = data.query.toLowerCase().trim();
    result = result.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.content.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q)));
  }
  result.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
  const enriched = await Promise.all(result.map((m) => attachSignedUrlIfNeeded(admin, m)));
  return {
    materials: enriched,
    isAdmin,
    categories: ["All", "General SOPs", "Process & Portals", "Customer Handling", "Technical & NIC Delays", "Compliance & Verification", "Scripts & Templates"]
  };
});
const getTrainingMaterial_createServerFn_handler = createServerRpc({
  id: "f03b9babc606ef26fece41a7b5546a811f8ab9c7ff5eefc7239acb029b9a24f9",
  name: "getTrainingMaterial",
  filename: "src/lib/crm/training.functions.ts"
}, (opts) => getTrainingMaterial.__executeServer(opts));
const getTrainingMaterial = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string()
}).parse(i)).handler(getTrainingMaterial_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  const materials = await loadPersistedTrainingMaterials(admin);
  const item = materials.find((m) => m.id === data.id);
  if (!item) throw new Error("Training material not found");
  if (!item.is_published && !isAdmin) throw new Error("Document is currently in draft");
  const enriched = await attachSignedUrlIfNeeded(admin, item);
  return {
    material: enriched,
    isAdmin
  };
});
const TrainingCreateSchema = object({
  title: string().trim().min(2, "Title must be at least 2 characters").max(200),
  description: string().trim().max(1e3).default(""),
  category: _enum(["General SOPs", "Process & Portals", "Customer Handling", "Technical & NIC Delays", "Compliance & Verification", "Scripts & Templates"]),
  content_type: _enum(["rich_text", "document", "external_link"]).default("rich_text"),
  content: string().default(""),
  document_url: string().nullable().optional(),
  file_name: string().nullable().optional(),
  file_size_bytes: number().nullable().optional(),
  tags: array(string()).default([]),
  is_pinned: boolean().default(false),
  is_published: boolean().default(true),
  sort_order: number().int().default(0)
});
const createTrainingMaterial_createServerFn_handler = createServerRpc({
  id: "6b10accabd7dd926d6911cc19cfe1931c828f0ea341d923746015d647c294a6e",
  name: "createTrainingMaterial",
  filename: "src/lib/crm/training.functions.ts"
}, (opts) => createTrainingMaterial.__executeServer(opts));
const createTrainingMaterial = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => TrainingCreateSchema.parse(i)).handler(createTrainingMaterial_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  if (!isAdmin) throw new Error("Forbidden: Only administrators can create training materials.");
  const {
    data: profile
  } = await admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle();
  const staffName = profile?.display_name || profile?.email?.split("@")[0] || "Admin";
  const materials = await loadPersistedTrainingMaterials(admin);
  const cleanDocUrl = cleanStoragePath(data.document_url);
  const newMaterial = {
    id: `training-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...data,
    document_url: cleanDocUrl,
    created_by_name: staffName,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  materials.unshift(newMaterial);
  await savePersistedTrainingMaterials(admin, materials);
  return {
    success: true,
    material: newMaterial
  };
});
const TrainingUpdateSchema = object({
  id: string(),
  title: string().trim().min(2).max(200).optional(),
  description: string().trim().max(1e3).optional(),
  category: _enum(["General SOPs", "Process & Portals", "Customer Handling", "Technical & NIC Delays", "Compliance & Verification", "Scripts & Templates"]).optional(),
  content_type: _enum(["rich_text", "document", "external_link"]).optional(),
  content: string().optional(),
  document_url: string().nullable().optional(),
  file_name: string().nullable().optional(),
  file_size_bytes: number().nullable().optional(),
  tags: array(string()).optional(),
  is_pinned: boolean().optional(),
  is_published: boolean().optional(),
  sort_order: number().int().optional()
});
const updateTrainingMaterial_createServerFn_handler = createServerRpc({
  id: "3dd0e0958117f1e375d2825c17f1acd9346236700e2ef612196cb3cfc4ec6ae6",
  name: "updateTrainingMaterial",
  filename: "src/lib/crm/training.functions.ts"
}, (opts) => updateTrainingMaterial.__executeServer(opts));
const updateTrainingMaterial = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => TrainingUpdateSchema.parse(i)).handler(updateTrainingMaterial_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  if (!isAdmin) throw new Error("Forbidden: Only administrators can update training materials.");
  const materials = await loadPersistedTrainingMaterials(admin);
  const idx = materials.findIndex((m) => m.id === data.id);
  if (idx === -1) throw new Error("Training material not found");
  const existing = materials[idx];
  const cleanDocUrl = data.document_url !== void 0 ? cleanStoragePath(data.document_url) : existing.document_url;
  const updated = {
    ...existing,
    ...data,
    document_url: cleanDocUrl,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  materials[idx] = updated;
  await savePersistedTrainingMaterials(admin, materials);
  return {
    success: true,
    material: updated
  };
});
const deleteTrainingMaterial_createServerFn_handler = createServerRpc({
  id: "ea7b702784f8a007035b0947a01600d6612395f09c47cda1dcce982fe7db0f04",
  name: "deleteTrainingMaterial",
  filename: "src/lib/crm/training.functions.ts"
}, (opts) => deleteTrainingMaterial.__executeServer(opts));
const deleteTrainingMaterial = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string()
}).parse(i)).handler(deleteTrainingMaterial_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  if (!isAdmin) throw new Error("Forbidden: Only administrators can delete training materials.");
  let materials = await loadPersistedTrainingMaterials(admin);
  materials = materials.filter((m) => m.id !== data.id);
  await savePersistedTrainingMaterials(admin, materials);
  return {
    success: true
  };
});
const uploadTrainingDocument_createServerFn_handler = createServerRpc({
  id: "7ec10086b4967aba0210ec34c7a1a3fb01a69c7cc3d1144a7063d78ab94a89c3",
  name: "uploadTrainingDocument",
  filename: "src/lib/crm/training.functions.ts"
}, (opts) => uploadTrainingDocument.__executeServer(opts));
const uploadTrainingDocument = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  fileName: string().min(1),
  fileBase64: string().min(1),
  contentType: string().default("application/pdf")
}).parse(i)).handler(uploadTrainingDocument_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  if (!isAdmin) throw new Error("Forbidden: Only administrators can upload training documents.");
  const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `training/${Date.now()}-${safeName}`;
  const base64Data = data.fileBase64.includes(",") ? data.fileBase64.split(",")[1] : data.fileBase64;
  const fileBuffer = Buffer.from(base64Data, "base64");
  const {
    error: uploadError
  } = await admin.storage.from("documents").upload(filePath, fileBuffer, {
    contentType: data.contentType,
    upsert: true
  });
  if (uploadError) {
    console.error("Storage upload failed:", uploadError);
    throw new Error(`Failed to upload document: ${uploadError.message}`);
  }
  const {
    data: signedData
  } = await admin.storage.from("documents").createSignedUrl(filePath, 60 * 60 * 24 * 7);
  return {
    success: true,
    filePath,
    fileName: data.fileName,
    fileSizeBytes: fileBuffer.length,
    downloadUrl: signedData?.signedUrl || filePath
  };
});
const getTrainingDocUploadUrl_createServerFn_handler = createServerRpc({
  id: "a976c0603a25ef17ecdd1a61bcc1aea6b6d4a4aa791aa5e81f327676732d7370",
  name: "getTrainingDocUploadUrl",
  filename: "src/lib/crm/training.functions.ts"
}, (opts) => getTrainingDocUploadUrl.__executeServer(opts));
const getTrainingDocUploadUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  fileName: string(),
  contentType: string()
}).parse(i)).handler(getTrainingDocUploadUrl_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  if (!isAdmin) throw new Error("Forbidden: Only administrators can upload training files.");
  const ext = data.fileName.split(".").pop() || "pdf";
  const path = `training/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const {
    data: signed,
    error
  } = await admin.storage.from("documents").createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  const {
    data: signedView
  } = await admin.storage.from("documents").createSignedUrl(path, 60 * 60 * 24 * 7);
  return {
    path,
    uploadUrl: signed.signedUrl,
    token: signed.token,
    downloadUrl: signedView?.signedUrl || path
  };
});
const getTrainingDocDownloadUrl_createServerFn_handler = createServerRpc({
  id: "a781c1a2fc7b6a0c3b6ae13a5b652ba9257b201a4fcb0174898cca78b74b0c45",
  name: "getTrainingDocDownloadUrl",
  filename: "src/lib/crm/training.functions.ts"
}, (opts) => getTrainingDocDownloadUrl.__executeServer(opts));
const getTrainingDocDownloadUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  documentUrlOrPath: string().min(1)
}).parse(i)).handler(getTrainingDocDownloadUrl_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const target = data.documentUrlOrPath;
  if (target.startsWith("http://") || target.startsWith("https://") && !target.includes("/storage/v1/object/") && !target.includes("supabase.co/storage")) {
    return {
      url: target
    };
  }
  let storagePath = target;
  if (target.includes("/documents/")) {
    storagePath = target.split("/documents/")[1].split("?")[0];
  }
  const {
    data: signed,
    error
  } = await admin.storage.from("documents").createSignedUrl(storagePath, 60 * 60 * 24 * 7);
  if (error || !signed?.signedUrl) {
    return {
      url: target
    };
  }
  return {
    url: signed.signedUrl
  };
});
export {
  createTrainingMaterial_createServerFn_handler,
  deleteTrainingMaterial_createServerFn_handler,
  getTrainingDocDownloadUrl_createServerFn_handler,
  getTrainingDocUploadUrl_createServerFn_handler,
  getTrainingMaterial_createServerFn_handler,
  listTrainingMaterials_createServerFn_handler,
  updateTrainingMaterial_createServerFn_handler,
  uploadTrainingDocument_createServerFn_handler
};
