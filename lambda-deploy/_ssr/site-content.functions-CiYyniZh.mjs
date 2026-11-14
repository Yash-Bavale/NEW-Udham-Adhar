import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn, g as getRequest } from "./server-BFjd5iLF.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const EMPTY = {
  websiteId: "",
  headerNav: [],
  footerNav: [],
  blocks: {}
};
const getSiteContent_createServerFn_handler = createServerRpc({
  id: "80e8be4ef41e0519ccfb7105125c2dd753e548122d9a8183ae11f4d40a36925d",
  name: "getSiteContent",
  filename: "src/lib/websites/site-content.functions.ts"
}, (opts) => getSiteContent.__executeServer(opts));
const getSiteContent = createServerFn({
  method: "GET"
}).handler(getSiteContent_createServerFn_handler, async () => {
  try {
    const {
      resolveCurrentWebsite
    } = await import("./current-website.server-D9vbN4Zc.mjs");
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    const site = await resolveCurrentWebsite(getRequest());
    const [navRes, blockRes] = await Promise.all([supabaseAdmin.from("site_nav_items").select("id, label, path, nav_group, open_in_new, sort_order").eq("website_id", site.id).eq("is_active", true).order("sort_order", {
      ascending: true
    }), supabaseAdmin.from("site_content_blocks").select("block_key, content").eq("website_id", site.id).eq("is_active", true)]);
    const rows = navRes.data ?? [];
    const toItem = (r) => ({
      id: r.id,
      label: r.label,
      path: r.path,
      openInNew: !!r.open_in_new
    });
    const blocks = {};
    for (const b of blockRes.data ?? []) blocks[b.block_key] = b.content;
    return {
      websiteId: site.id,
      headerNav: rows.filter((r) => r.nav_group === "header").map(toItem),
      footerNav: rows.filter((r) => r.nav_group === "footer").map(toItem),
      blocks
    };
  } catch (err) {
    console.warn("[getSiteContent] falling back to code defaults", err);
    return EMPTY;
  }
});
export {
  getSiteContent_createServerFn_handler
};
