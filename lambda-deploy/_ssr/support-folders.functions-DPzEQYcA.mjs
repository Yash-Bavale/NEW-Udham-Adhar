import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, b as boolean, _ as _enum, s as string, a as array } from "../_libs/zod.mjs";
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
const MISSING_MIGRATION_MSG = "Database tables for support folders and stars have not been applied to Supabase yet. Please run migration 'supabase/migrations/20261025140000_support_ticket_folders_and_stars.sql' in the Supabase SQL Editor.";
function handleDbError(error, actionDesc) {
  if (error?.code === "PGRST205") {
    throw new Error(MISSING_MIGRATION_MSG);
  }
  throw new Error(`${actionDesc}: ${error?.message || error?.code || "Unknown database error"}`);
}
async function getTicketOrganizationMeta(userId, ticketIds) {
  const admin = await getAdmin();
  const starredSet = /* @__PURE__ */ new Set();
  const ticketFolderMap = /* @__PURE__ */ new Map();
  if (!ticketIds.length) {
    return {
      starredSet,
      ticketFolderMap,
      starredCount: 0
    };
  }
  try {
    const {
      data: starRows,
      error: sErr
    } = await admin.from("support_ticket_stars").select("ticket_id").eq("user_id", userId).in("ticket_id", ticketIds);
    if (sErr && sErr.code !== "PGRST205") {
      console.warn("[getTicketOrganizationMeta] starRows warning:", sErr);
    } else if (starRows) {
      starRows.forEach((r) => starredSet.add(r.ticket_id));
    }
    const {
      data: itemRows,
      error: iErr
    } = await admin.from("support_ticket_folder_items").select("ticket_id, folder_id").in("ticket_id", ticketIds);
    if (iErr && iErr.code !== "PGRST205") {
      console.warn("[getTicketOrganizationMeta] itemRows warning:", iErr);
    } else if (itemRows && itemRows.length > 0) {
      const folderIds = Array.from(new Set(itemRows.map((r) => r.folder_id).filter(Boolean)));
      if (folderIds.length > 0) {
        const {
          data: folderRows,
          error: fErr
        } = await admin.from("support_ticket_folders").select("id, name, color, is_shared, user_id").in("id", folderIds).or(`user_id.eq.${userId},is_shared.eq.true`);
        if (!fErr && folderRows) {
          const folderMap = new Map(folderRows.map((f) => [f.id, f]));
          itemRows.forEach((r) => {
            const f = folderMap.get(r.folder_id);
            if (f) {
              ticketFolderMap.set(r.ticket_id, {
                folderId: f.id,
                folderName: f.name,
                color: f.color || "slate"
              });
            }
          });
        }
      }
    }
    let starTotal = starredSet.size;
    const {
      count,
      error: countErr
    } = await admin.from("support_ticket_stars").select("id", {
      count: "exact",
      head: true
    }).eq("user_id", userId);
    if (!countErr && typeof count === "number") {
      starTotal = count;
    }
    return {
      starredSet,
      ticketFolderMap,
      starredCount: starTotal
    };
  } catch (err) {
    if (err?.code === "PGRST205") {
      return {
        starredSet,
        ticketFolderMap,
        starredCount: 0
      };
    }
    return {
      starredSet,
      ticketFolderMap,
      starredCount: 0
    };
  }
}
async function getUserStarredTicketIds(userId) {
  const admin = await getAdmin();
  const {
    data,
    error
  } = await admin.from("support_ticket_stars").select("ticket_id").eq("user_id", userId);
  if (error) {
    if (error.code === "PGRST205") return [];
    handleDbError(error, "Failed to fetch starred tickets");
  }
  return (data ?? []).map((r) => r.ticket_id);
}
async function getFolderTicketIds(folderId, userId) {
  const admin = await getAdmin();
  if (userId) {
    const {
      data: folder,
      error: fErr
    } = await admin.from("support_ticket_folders").select("id, is_shared, user_id").eq("id", folderId).maybeSingle();
    if (fErr) {
      if (fErr.code === "PGRST205") return [];
      handleDbError(fErr, "Failed to verify folder permission");
    }
    const f = folder;
    if (f && !f.is_shared && f.user_id !== userId) {
      return [];
    }
  }
  const {
    data,
    error
  } = await admin.from("support_ticket_folder_items").select("ticket_id").eq("folder_id", folderId);
  if (error) {
    if (error.code === "PGRST205") return [];
    handleDbError(error, "Failed to fetch tickets in folder");
  }
  return (data ?? []).map((r) => r.ticket_id);
}
const listSupportFolders = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a063da8b2add06d1bf0ff8a6b0a949a23000a5963030c2a109c54477e7b6274a"));
const createSupportFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  name: string().trim().min(1).max(60),
  color: _enum(["slate", "blue", "indigo", "emerald", "amber", "rose", "purple"]).default("slate"),
  isShared: boolean().default(false)
}).parse(raw)).handler(createSsrRpc("da97ea992e9a8fc30c51285e75e69c7c69f0f14475f2bc0abc80f86afa881ed0"));
const renameSupportFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  folderId: string().uuid(),
  name: string().trim().min(1).max(60),
  color: _enum(["slate", "blue", "indigo", "emerald", "amber", "rose", "purple"]).optional()
}).parse(raw)).handler(createSsrRpc("6eb95c67b902441a56fe499fa9bd1b33fdb863b61196aa8b6418746dac9f80cb"));
const deleteSupportFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  folderId: string().uuid()
}).parse(raw)).handler(createSsrRpc("29d43ad624d73d4cd7ba0c4fc05ec612c9b6358996e55b83f5e9c9c389cbf898"));
const toggleTicketStar = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  ticketId: string().uuid(),
  isStarred: boolean().optional()
}).parse(raw)).handler(createSsrRpc("f9d64b08169c88bf9ca05ad4ba42b28b6a227b88397b46078fa21a208c86a31b"));
const bulkToggleTicketStar = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  ticketIds: array(string().uuid()).min(1),
  isStarred: boolean().optional(),
  star: boolean().optional()
}).parse(raw)).handler(createSsrRpc("18df254943aec1bf9f1b14fbc5d87f7ef2f423324fc4c7562a37ac32da1cc78e"));
const moveTicketsToFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  ticketIds: array(string().uuid()).min(1),
  folderId: string().uuid()
}).parse(raw)).handler(createSsrRpc("dea6d1d2415b665d7531510246840bd10d6c6698018c5474c0e390f6b3f82e6b"));
const removeTicketsFromFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  ticketIds: array(string().uuid()).min(1)
}).parse(raw)).handler(createSsrRpc("8295cf49633528bca94784b8edea17d9cdbf9e5b779503ac5adbbec543ce945c"));
export {
  bulkToggleTicketStar,
  createSupportFolder,
  deleteSupportFolder,
  getFolderTicketIds,
  getTicketOrganizationMeta,
  getUserStarredTicketIds,
  listSupportFolders,
  moveTicketsToFolder,
  removeTicketsFromFolder,
  renameSupportFolder,
  toggleTicketStar
};
