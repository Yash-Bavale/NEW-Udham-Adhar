import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import { clearWebsiteCache } from "./current-website.server-D9vbN4Zc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number, b as boolean, _ as _enum, f as unknown } from "../_libs/zod.mjs";
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
import "./client.server-3kDCe7R3.mjs";
const WebsiteId = object({
  websiteId: string().uuid()
});
const getWebsiteContent_createServerFn_handler = createServerRpc({
  id: "1c75e2b995d12f6e2782703f5d9c909b7f6f9029ca6bd5a74c38bbe6768bdc4a",
  name: "getWebsiteContent",
  filename: "src/lib/crm/site-content-admin.functions.ts"
}, (opts) => getWebsiteContent.__executeServer(opts));
const getWebsiteContent = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => WebsiteId.parse(i)).handler(getWebsiteContent_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const [site, nav, blocks] = await Promise.all([supabase.from("websites").select("id, name, domain, support_email, support_phone, whatsapp_number, business_hours, postal_address, footer_unlock_code, legal_footer_line").eq("id", data.websiteId).maybeSingle(), supabase.from("site_nav_items").select("*").eq("website_id", data.websiteId).order("sort_order", {
    ascending: true
  }), supabase.from("site_content_blocks").select("*").eq("website_id", data.websiteId).order("block_key", {
    ascending: true
  })]);
  if (site.error) throw new Error(site.error.message);
  if (nav.error) throw new Error(nav.error.message);
  if (blocks.error) throw new Error(blocks.error.message);
  if (!site.data) throw new Error("Website not found");
  return {
    website: site.data,
    nav: nav.data ?? [],
    blocks: blocks.data ?? []
  };
});
const NavInput = object({
  id: string().uuid().optional(),
  website_id: string().uuid(),
  nav_group: _enum(["header", "footer"]),
  label: string().trim().min(1).max(120),
  path: string().trim().min(1).max(300),
  open_in_new: boolean().default(false),
  is_active: boolean().default(true),
  sort_order: number().int().min(0).max(1e4).default(0)
});
const upsertNavItem_createServerFn_handler = createServerRpc({
  id: "3285eb8bd4853d778d0f96aa94ccbe87b7196b047ad27a208fbecbe370274cce",
  name: "upsertNavItem",
  filename: "src/lib/crm/site-content-admin.functions.ts"
}, (opts) => upsertNavItem.__executeServer(opts));
const upsertNavItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => NavInput.parse(i)).handler(upsertNavItem_createServerFn_handler, async ({
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
    } = await supabase.from("site_nav_items").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabase.from("site_nav_items").insert(data);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteNavItem_createServerFn_handler = createServerRpc({
  id: "400a9865b4b221e3a820829985d481338120f7e70337ed186929639802f0a038",
  name: "deleteNavItem",
  filename: "src/lib/crm/site-content-admin.functions.ts"
}, (opts) => deleteNavItem.__executeServer(opts));
const deleteNavItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(deleteNavItem_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    error
  } = await supabase.from("site_nav_items").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const BlockInput = object({
  website_id: string().uuid(),
  block_key: string().trim().min(2).max(120),
  content: unknown(),
  is_active: boolean().default(true)
});
const upsertContentBlock_createServerFn_handler = createServerRpc({
  id: "9177ae3d239452037965edda9ba2c3f94a33cb66eebf1a09a1f711fc6bdd30e2",
  name: "upsertContentBlock",
  filename: "src/lib/crm/site-content-admin.functions.ts"
}, (opts) => upsertContentBlock.__executeServer(opts));
const upsertContentBlock = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => BlockInput.parse(i)).handler(upsertContentBlock_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    error
  } = await supabase.from("site_content_blocks").upsert({
    website_id: data.website_id,
    block_key: data.block_key,
    content: data.content,
    is_active: data.is_active
  }, {
    onConflict: "website_id,block_key"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const ContactInput = object({
  websiteId: string().uuid(),
  support_email: string().trim().email().max(200).nullable(),
  support_phone: string().trim().max(60).nullable(),
  whatsapp_number: string().trim().max(60).nullable(),
  business_hours: string().trim().max(200).nullable(),
  postal_address: string().trim().max(500).nullable(),
  footer_unlock_code: string().trim().max(60).nullable(),
  legal_footer_line: string().trim().max(1e3).nullable()
});
const updateWebsiteContact_createServerFn_handler = createServerRpc({
  id: "a97982866ae58b8c62b684a253dad15791585c10b37aabba5d5c8fa8a3ec5c2c",
  name: "updateWebsiteContact",
  filename: "src/lib/crm/site-content-admin.functions.ts"
}, (opts) => updateWebsiteContact.__executeServer(opts));
const updateWebsiteContact = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ContactInput.parse(i)).handler(updateWebsiteContact_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    websiteId,
    ...patch
  } = data;
  const {
    error
  } = await supabase.from("websites").update(patch).eq("id", websiteId);
  if (error) throw new Error(error.message);
  clearWebsiteCache();
  return {
    ok: true
  };
});
export {
  deleteNavItem_createServerFn_handler,
  getWebsiteContent_createServerFn_handler,
  updateWebsiteContact_createServerFn_handler,
  upsertContentBlock_createServerFn_handler,
  upsertNavItem_createServerFn_handler
};
