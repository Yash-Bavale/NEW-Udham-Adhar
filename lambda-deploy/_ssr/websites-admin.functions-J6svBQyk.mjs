import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, _ as _enum, n as number, b as boolean } from "../_libs/zod.mjs";
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
const listWebsiteTree_createServerFn_handler = createServerRpc({
  id: "2e8e433cba710bd402580f2ab9a83ea0c65bf3aa3c0bf641656c1ba4134233e3",
  name: "listWebsiteTree",
  filename: "src/lib/crm/websites-admin.functions.ts"
}, (opts) => listWebsiteTree.__executeServer(opts));
const listWebsiteTree = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listWebsiteTree_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const [ws, cats, svcs] = await Promise.all([supabase.from("websites").select("*").order("sort_order", {
    ascending: true
  }), supabase.from("service_categories").select("*").order("sort_order", {
    ascending: true
  }), supabase.from("services").select("id, service_code, service_name, is_active, sort_order, website_id, category_id, total_amount").order("sort_order", {
    ascending: true
  })]);
  if (ws.error) throw new Error(ws.error.message);
  if (cats.error) throw new Error(cats.error.message);
  if (svcs.error) throw new Error(svcs.error.message);
  return {
    websites: ws.data ?? [],
    categories: cats.data ?? [],
    services: svcs.data ?? []
  };
});
const WebsiteInput = object({
  id: string().uuid().optional(),
  name: string().trim().min(2).max(160),
  domain: string().trim().min(3).max(255).regex(/^[a-z0-9.-]+$/i, "Domain must contain only letters, digits, dots and hyphens"),
  description: string().trim().max(2e3).nullable().optional(),
  is_active: boolean().default(true),
  allow_admin: boolean().default(true),
  sort_order: number().int().min(0).max(1e4).default(0),
  contentful_space_id: string().trim().max(64).regex(/^[a-z0-9]*$/i, "Space ID must be letters and digits only").nullable().optional(),
  contentful_delivery_token_secret: _enum(["CONTENTFUL_API_KEY", "CONTENTFUL_API_KEY_1", "CONTENTFUL_API_KEY_2"]).nullable().optional(),
  sanity_project_id: string().trim().max(64).regex(/^[a-z0-9]*$/i, "Project ID must be letters and digits only").nullable().optional(),
  sanity_dataset: string().trim().max(64).regex(/^[a-z0-9_-]*$/i, "Dataset must be letters, digits, hyphens or underscores").nullable().optional()
});
const upsertWebsite_createServerFn_handler = createServerRpc({
  id: "439b8ec582a43e2d1cea21dc8af8d1269508bfdfea6b8c8373058d2e6b08beec",
  name: "upsertWebsite",
  filename: "src/lib/crm/websites-admin.functions.ts"
}, (opts) => upsertWebsite.__executeServer(opts));
const upsertWebsite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => WebsiteInput.parse(i)).handler(upsertWebsite_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const payload = {
    ...data,
    domain: data.domain.toLowerCase().replace(/^www\./, "")
  };
  const dupQuery = supabase.from("websites").select("id, name").eq("domain", payload.domain);
  const {
    data: dup,
    error: dupErr
  } = await (payload.id ? dupQuery.neq("id", payload.id) : dupQuery).maybeSingle();
  if (dupErr) throw new Error(dupErr.message);
  if (dup) {
    throw new Error(`The domain "${payload.domain}" is already used by the website "${dup.name}". Use a different domain or edit that website instead.`);
  }
  if (payload.id) {
    const {
      id,
      ...patch
    } = payload;
    const {
      error
    } = await supabase.from("websites").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabase.from("websites").insert(payload);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteWebsite_createServerFn_handler = createServerRpc({
  id: "9f763d14b4f9ae67924e7de3a0e16536f6eddd6453b622f9639f7ca49a138931",
  name: "deleteWebsite",
  filename: "src/lib/crm/websites-admin.functions.ts"
}, (opts) => deleteWebsite.__executeServer(opts));
const deleteWebsite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(deleteWebsite_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin"]);
  const {
    count,
    error: cErr
  } = await supabase.from("services").select("id", {
    count: "exact",
    head: true
  }).eq("website_id", data.id);
  if (cErr) throw new Error(cErr.message);
  if ((count ?? 0) > 0) {
    throw new Error(`Cannot delete: ${count} service(s) still linked. Move or delete them first.`);
  }
  const {
    error
  } = await supabase.from("websites").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const CategoryInput = object({
  id: string().uuid().optional(),
  website_id: string().uuid(),
  name: string().trim().min(2).max(160),
  is_active: boolean().default(true),
  sort_order: number().int().min(0).max(1e4).default(0)
});
const upsertServiceCategory_createServerFn_handler = createServerRpc({
  id: "4de833c750b74d4faeb919bac83319e1848132e194a419fd17103beb382a3876",
  name: "upsertServiceCategory",
  filename: "src/lib/crm/websites-admin.functions.ts"
}, (opts) => upsertServiceCategory.__executeServer(opts));
const upsertServiceCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CategoryInput.parse(i)).handler(upsertServiceCategory_createServerFn_handler, async ({
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
    } = await supabase.from("service_categories").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabase.from("service_categories").insert(data);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteServiceCategory_createServerFn_handler = createServerRpc({
  id: "5f55277b1e64a5b9fca765909b97aa75f06bcf0396a18cda68f259ecde643141",
  name: "deleteServiceCategory",
  filename: "src/lib/crm/websites-admin.functions.ts"
}, (opts) => deleteServiceCategory.__executeServer(opts));
const deleteServiceCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(deleteServiceCategory_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    error: uErr
  } = await supabase.from("services").update({
    category_id: null
  }).eq("category_id", data.id);
  if (uErr) throw new Error(uErr.message);
  const {
    error
  } = await supabase.from("service_categories").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const moveService_createServerFn_handler = createServerRpc({
  id: "0858cacc1c8ca3db6082d341b317e6ea70e061e492268385503dd8d0cec430a3",
  name: "moveService",
  filename: "src/lib/crm/websites-admin.functions.ts"
}, (opts) => moveService.__executeServer(opts));
const moveService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  service_id: string().uuid(),
  website_id: string().uuid(),
  category_id: string().uuid().nullable().optional()
}).parse(i)).handler(moveService_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    error
  } = await supabase.from("services").update({
    website_id: data.website_id,
    category_id: data.category_id ?? null
  }).eq("id", data.service_id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  deleteServiceCategory_createServerFn_handler,
  deleteWebsite_createServerFn_handler,
  listWebsiteTree_createServerFn_handler,
  moveService_createServerFn_handler,
  upsertServiceCategory_createServerFn_handler,
  upsertWebsite_createServerFn_handler
};
