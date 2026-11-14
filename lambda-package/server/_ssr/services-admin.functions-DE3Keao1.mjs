import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean, n as number } from "../_libs/zod.mjs";
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
const listServices_createServerFn_handler = createServerRpc({
  id: "b3733e1aceb348de0df1b06cb31a68f96067758e25ebad5406776840c0f87283",
  name: "listServices",
  filename: "src/lib/crm/services-admin.functions.ts"
}, (opts) => listServices.__executeServer(opts));
const listServices = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  includeInactive: boolean().optional(),
  websiteId: string().uuid().optional()
}).optional().parse(raw)).handler(listServices_createServerFn_handler, async ({
  data: input,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  let q = supabaseAdmin.from("services").select("*, website:websites(id, name, domain, is_active)").order("sort_order", {
    ascending: true
  });
  if (!input?.includeInactive) {
    q = q.eq("is_active", true);
  }
  if (input?.websiteId) {
    q = q.eq("website_id", input.websiteId);
  }
  const {
    data,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    rows: data ?? []
  };
});
const listActiveServiceCodes_createServerFn_handler = createServerRpc({
  id: "d59bbd896d658bff27bd047795a7d69bb88958a4f4de31550366d4b252a431fc",
  name: "listActiveServiceCodes",
  filename: "src/lib/crm/services-admin.functions.ts"
}, (opts) => listActiveServiceCodes.__executeServer(opts));
const listActiveServiceCodes = createServerFn({
  method: "GET"
}).handler(listActiveServiceCodes_createServerFn_handler, async () => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    getRequest
  } = await import("./server-BvFUsV4_.mjs");
  const {
    resolveWebsiteIdFromRequest
  } = await import("./default-website.server-BIcPmBN6.mjs");
  let websiteId = null;
  try {
    websiteId = await resolveWebsiteIdFromRequest(getRequest());
  } catch {
    websiteId = null;
  }
  let q = supabaseAdmin.from("services").select("service_code, service_name, sort_order").eq("is_active", true);
  if (websiteId) q = q.eq("website_id", websiteId);
  const {
    data,
    error
  } = await q.order("sort_order", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  return {
    codes: rows.map((r) => r.service_code),
    services: rows.map((r) => ({
      code: r.service_code,
      name: r.service_name
    }))
  };
});
const ServiceInput = object({
  id: string().uuid().optional(),
  service_code: string().trim().min(2).max(80).regex(/^[a-zA-Z0-9_-]+$/, "letters, numbers, hyphen or underscore only"),
  service_name: string().trim().min(2).max(160),
  description: string().max(2e3).nullable().optional(),
  base_amount: number().min(0).max(1e6),
  gst_amount: number().min(0).max(1e6),
  total_amount: number().min(0).max(1e6),
  is_active: boolean().default(true),
  sort_order: number().int().min(0).max(1e4).default(0),
  govt_portal_url: string().trim().max(1e3).nullable().optional(),
  website_id: string().uuid().optional(),
  category_id: string().uuid().nullable().optional(),
  expected_processing_days: number().int().min(0).max(3650).nullable().optional(),
  journey_key: string().trim().max(80).nullable().optional()
});
const upsertService_createServerFn_handler = createServerRpc({
  id: "a88444092486de02238a8ce8089bf67dad9c797396759b0a50e2910b6b2aaed7",
  name: "upsertService",
  filename: "src/lib/crm/services-admin.functions.ts"
}, (opts) => upsertService.__executeServer(opts));
const upsertService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ServiceInput.parse(i)).handler(upsertService_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  if (data.id) {
    const {
      id,
      ...patch
    } = data;
    const {
      error
    } = await supabase.from("services").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    let website_id = data.website_id;
    if (!website_id) {
      const {
        getDefaultWebsiteId
      } = await import("./default-website.server-BIcPmBN6.mjs");
      website_id = await getDefaultWebsiteId();
    }
    const {
      error
    } = await supabase.from("services").insert({
      ...data,
      website_id
    });
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteService_createServerFn_handler = createServerRpc({
  id: "5a1caabcc8114771c7e70e14aecc56e363697fa43895278b1aac630da0cd7a22",
  name: "deleteService",
  filename: "src/lib/crm/services-admin.functions.ts"
}, (opts) => deleteService.__executeServer(opts));
const deleteService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(deleteService_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    error
  } = await supabase.from("services").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  deleteService_createServerFn_handler,
  listActiveServiceCodes_createServerFn_handler,
  listServices_createServerFn_handler,
  upsertService_createServerFn_handler
};
