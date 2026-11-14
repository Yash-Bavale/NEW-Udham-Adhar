import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
let cachedId = null;
async function getDefaultWebsiteId() {
  if (cachedId) return cachedId;
  const { data, error } = await supabaseAdmin.from("websites").select("id").eq("domain", "udyamadhar.in").maybeSingle();
  if (error) throw error;
  if (data?.id) {
    cachedId = data.id;
    return data.id;
  }
  const { data: any, error: err2 } = await supabaseAdmin.from("websites").select("id").eq("is_active", true).order("sort_order", { ascending: true }).limit(1).maybeSingle();
  if (err2) throw err2;
  if (!any?.id) throw new Error("No websites configured");
  cachedId = any.id;
  return any.id;
}
async function resolveWebsiteIdFromRequest(request) {
  const host = request?.headers.get("host")?.toLowerCase().split(":")[0] ?? "";
  if (host) {
    const stripped = host.replace(/^www\./, "");
    const { data } = await supabaseAdmin.from("websites").select("id").eq("is_active", true).in("domain", [host, stripped]).maybeSingle();
    if (data?.id) return data.id;
  }
  return getDefaultWebsiteId();
}
export {
  getDefaultWebsiteId,
  resolveWebsiteIdFromRequest
};
