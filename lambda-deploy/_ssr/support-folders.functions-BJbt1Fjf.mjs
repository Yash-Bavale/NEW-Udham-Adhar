import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
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
async function coreListFolders(userId) {
  const admin = await getAdmin();
  const {
    data: folders,
    error: fErr
  } = await admin.from("support_ticket_folders").select("id, name, color, is_shared, user_id, created_at, updated_at").or(`user_id.eq.${userId},is_shared.eq.true`).order("created_at", {
    ascending: true
  });
  if (fErr) {
    if (fErr.code === "PGRST205") {
      return {
        folders: [],
        starredCount: 0
      };
    }
    handleDbError(fErr, "Failed to list folders");
  }
  const folderList = folders ?? [];
  const folderIds = folderList.map((f) => f.id);
  const countMap = /* @__PURE__ */ new Map();
  if (folderIds.length > 0) {
    const {
      data: items,
      error: iErr
    } = await admin.from("support_ticket_folder_items").select("folder_id").in("folder_id", folderIds);
    if (!iErr && items) {
      items.forEach((item) => {
        countMap.set(item.folder_id, (countMap.get(item.folder_id) ?? 0) + 1);
      });
    }
  }
  const {
    count: starCount,
    error: sErr
  } = await admin.from("support_ticket_stars").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", userId);
  return {
    folders: folderList.map((f) => ({
      id: f.id,
      name: f.name,
      color: f.color ?? "slate",
      is_shared: !!f.is_shared,
      is_owner: f.user_id === userId,
      ticket_count: countMap.get(f.id) ?? 0,
      count: countMap.get(f.id) ?? 0,
      created_at: f.created_at
    })),
    starredCount: !sErr && typeof starCount === "number" ? starCount : 0
  };
}
async function coreCreateFolder({
  name,
  color = "slate",
  isShared = false,
  userId
}) {
  const admin = await getAdmin();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: row,
    error
  } = await admin.from("support_ticket_folders").insert({
    name,
    color,
    user_id: userId,
    is_shared: isShared,
    created_at: now,
    updated_at: now
  }).select("id, name, color, is_shared, created_at").single();
  if (error) {
    handleDbError(error, "Failed to create folder");
  }
  return {
    ok: true,
    folder: row
  };
}
async function coreRenameFolder({
  folderId,
  name,
  color,
  userId
}) {
  const admin = await getAdmin();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const patch = {
    name,
    updated_at: now
  };
  if (color) patch.color = color;
  const {
    data: updated,
    error
  } = await admin.from("support_ticket_folders").update(patch).eq("id", folderId).eq("user_id", userId).select().maybeSingle();
  if (error) {
    handleDbError(error, "Failed to rename folder");
  }
  if (!updated) {
    throw new Error("Folder not found or unauthorized");
  }
  return {
    ok: true,
    folder: updated
  };
}
async function coreDeleteFolder({
  folderId,
  userId
}) {
  const admin = await getAdmin();
  const {
    data: folder,
    error: fErr
  } = await admin.from("support_ticket_folders").select("id, user_id").eq("id", folderId).maybeSingle();
  if (fErr) {
    handleDbError(fErr, "Failed to verify folder");
  }
  const f = folder;
  if (!f || f.user_id !== userId) {
    throw new Error("Folder not found or unauthorized");
  }
  await admin.from("support_ticket_folder_items").delete().eq("folder_id", folderId);
  const {
    error: delErr
  } = await admin.from("support_ticket_folders").delete().eq("id", folderId).eq("user_id", userId);
  if (delErr) {
    handleDbError(delErr, "Failed to delete folder");
  }
  return {
    ok: true,
    deletedFolderId: folderId
  };
}
async function coreToggleStar({
  ticketId,
  isStarred,
  userId
}) {
  const admin = await getAdmin();
  const {
    data: existing,
    error: cErr
  } = await admin.from("support_ticket_stars").select("id").eq("ticket_id", ticketId).eq("user_id", userId).maybeSingle();
  if (cErr) {
    handleDbError(cErr, "Failed to check star status");
  }
  let newStarred = false;
  if (existing) {
    if (isStarred === true) return {
      ok: true,
      isStarred: true
    };
    const {
      error: delErr
    } = await admin.from("support_ticket_stars").delete().eq("ticket_id", ticketId).eq("user_id", userId);
    if (delErr) {
      handleDbError(delErr, "Failed to unstar ticket");
    }
    newStarred = false;
  } else {
    if (isStarred === false) return {
      ok: true,
      isStarred: false
    };
    const {
      error: insErr
    } = await admin.from("support_ticket_stars").insert({
      ticket_id: ticketId,
      user_id: userId,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (insErr) {
      handleDbError(insErr, "Failed to star ticket");
    }
    newStarred = true;
  }
  return {
    ok: true,
    isStarred: newStarred
  };
}
async function coreBulkToggleStar({
  ticketIds,
  isStarred = true,
  userId
}) {
  const admin = await getAdmin();
  if (isStarred) {
    const rows = ticketIds.map((tId) => ({
      ticket_id: tId,
      user_id: userId,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }));
    const {
      error: upsertErr
    } = await admin.from("support_ticket_stars").upsert(rows, {
      onConflict: "ticket_id,user_id"
    });
    if (upsertErr) {
      handleDbError(upsertErr, "Bulk star failed");
    }
  } else {
    const {
      error: delErr
    } = await admin.from("support_ticket_stars").delete().in("ticket_id", ticketIds).eq("user_id", userId);
    if (delErr) {
      handleDbError(delErr, "Bulk unstar failed");
    }
  }
  return {
    ok: true,
    count: ticketIds.length,
    isStarred,
    star: isStarred
  };
}
async function coreMoveTickets({
  ticketIds,
  folderId,
  userId
}) {
  const admin = await getAdmin();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: folder,
    error: fErr
  } = await admin.from("support_ticket_folders").select("id, is_shared, user_id").eq("id", folderId).maybeSingle();
  if (fErr) {
    handleDbError(fErr, "Failed to verify destination folder");
  }
  const f = folder;
  if (!f || f.user_id !== userId) {
    throw new Error("Only the folder owner can add tickets to this folder");
  }
  const ownIds = await ownedFolderIds(userId);
  const {
    error: delErr
  } = await admin.from("support_ticket_folder_items").delete().in("ticket_id", ticketIds).in("folder_id", ownIds.length ? ownIds : [folderId]);
  if (delErr) {
    handleDbError(delErr, "Failed to remove tickets from previous folder");
  }
  const rows = ticketIds.map((tId) => ({
    folder_id: folderId,
    ticket_id: tId,
    user_id: userId,
    created_at: now
  }));
  const {
    error: insErr
  } = await admin.from("support_ticket_folder_items").insert(rows);
  if (insErr) {
    handleDbError(insErr, "Failed to move tickets to destination folder");
  }
  return {
    ok: true,
    count: ticketIds.length,
    folderId
  };
}
async function ownedFolderIds(userId) {
  const admin = await getAdmin();
  const {
    data
  } = await admin.from("support_ticket_folders").select("id").eq("user_id", userId);
  return (data ?? []).map((r) => r.id);
}
async function coreRemoveTickets({
  ticketIds,
  userId
}) {
  const admin = await getAdmin();
  const ownIds = await ownedFolderIds(userId);
  if (!ownIds.length) return {
    ok: true,
    count: 0
  };
  const {
    error: delErr
  } = await admin.from("support_ticket_folder_items").delete().in("ticket_id", ticketIds).in("folder_id", ownIds);
  if (delErr) {
    handleDbError(delErr, "Failed to remove tickets from folder");
  }
  return {
    ok: true,
    count: ticketIds.length
  };
}
const listSupportFolders_createServerFn_handler = createServerRpc({
  id: "a063da8b2add06d1bf0ff8a6b0a949a23000a5963030c2a109c54477e7b6274a",
  name: "listSupportFolders",
  filename: "src/lib/crm/support-folders.functions.ts"
}, (opts) => listSupportFolders.__executeServer(opts));
const listSupportFolders = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(listSupportFolders_createServerFn_handler, async ({
  context
}) => coreListFolders(context.userId));
const createSupportFolder_createServerFn_handler = createServerRpc({
  id: "da97ea992e9a8fc30c51285e75e69c7c69f0f14475f2bc0abc80f86afa881ed0",
  name: "createSupportFolder",
  filename: "src/lib/crm/support-folders.functions.ts"
}, (opts) => createSupportFolder.__executeServer(opts));
const createSupportFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  name: string().trim().min(1).max(60),
  color: _enum(["slate", "blue", "indigo", "emerald", "amber", "rose", "purple"]).default("slate"),
  isShared: boolean().default(false)
}).parse(raw)).handler(createSupportFolder_createServerFn_handler, async ({
  data,
  context
}) => coreCreateFolder({
  ...data,
  userId: context.userId
}));
const renameSupportFolder_createServerFn_handler = createServerRpc({
  id: "6eb95c67b902441a56fe499fa9bd1b33fdb863b61196aa8b6418746dac9f80cb",
  name: "renameSupportFolder",
  filename: "src/lib/crm/support-folders.functions.ts"
}, (opts) => renameSupportFolder.__executeServer(opts));
const renameSupportFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  folderId: string().uuid(),
  name: string().trim().min(1).max(60),
  color: _enum(["slate", "blue", "indigo", "emerald", "amber", "rose", "purple"]).optional()
}).parse(raw)).handler(renameSupportFolder_createServerFn_handler, async ({
  data,
  context
}) => coreRenameFolder({
  ...data,
  userId: context.userId
}));
const deleteSupportFolder_createServerFn_handler = createServerRpc({
  id: "29d43ad624d73d4cd7ba0c4fc05ec612c9b6358996e55b83f5e9c9c389cbf898",
  name: "deleteSupportFolder",
  filename: "src/lib/crm/support-folders.functions.ts"
}, (opts) => deleteSupportFolder.__executeServer(opts));
const deleteSupportFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  folderId: string().uuid()
}).parse(raw)).handler(deleteSupportFolder_createServerFn_handler, async ({
  data,
  context
}) => coreDeleteFolder({
  folderId: data.folderId,
  userId: context.userId
}));
const toggleTicketStar_createServerFn_handler = createServerRpc({
  id: "f9d64b08169c88bf9ca05ad4ba42b28b6a227b88397b46078fa21a208c86a31b",
  name: "toggleTicketStar",
  filename: "src/lib/crm/support-folders.functions.ts"
}, (opts) => toggleTicketStar.__executeServer(opts));
const toggleTicketStar = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  ticketId: string().uuid(),
  isStarred: boolean().optional()
}).parse(raw)).handler(toggleTicketStar_createServerFn_handler, async ({
  data,
  context
}) => coreToggleStar({
  ...data,
  userId: context.userId
}));
const bulkToggleTicketStar_createServerFn_handler = createServerRpc({
  id: "18df254943aec1bf9f1b14fbc5d87f7ef2f423324fc4c7562a37ac32da1cc78e",
  name: "bulkToggleTicketStar",
  filename: "src/lib/crm/support-folders.functions.ts"
}, (opts) => bulkToggleTicketStar.__executeServer(opts));
const bulkToggleTicketStar = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  ticketIds: array(string().uuid()).min(1),
  isStarred: boolean().optional(),
  star: boolean().optional()
}).parse(raw)).handler(bulkToggleTicketStar_createServerFn_handler, async ({
  data,
  context
}) => coreBulkToggleStar({
  ticketIds: data.ticketIds,
  isStarred: data.isStarred ?? data.star ?? true,
  userId: context.userId
}));
const moveTicketsToFolder_createServerFn_handler = createServerRpc({
  id: "dea6d1d2415b665d7531510246840bd10d6c6698018c5474c0e390f6b3f82e6b",
  name: "moveTicketsToFolder",
  filename: "src/lib/crm/support-folders.functions.ts"
}, (opts) => moveTicketsToFolder.__executeServer(opts));
const moveTicketsToFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  ticketIds: array(string().uuid()).min(1),
  folderId: string().uuid()
}).parse(raw)).handler(moveTicketsToFolder_createServerFn_handler, async ({
  data,
  context
}) => coreMoveTickets({
  ...data,
  userId: context.userId
}));
const removeTicketsFromFolder_createServerFn_handler = createServerRpc({
  id: "8295cf49633528bca94784b8edea17d9cdbf9e5b779503ac5adbbec543ce945c",
  name: "removeTicketsFromFolder",
  filename: "src/lib/crm/support-folders.functions.ts"
}, (opts) => removeTicketsFromFolder.__executeServer(opts));
const removeTicketsFromFolder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  ticketIds: array(string().uuid()).min(1)
}).parse(raw)).handler(removeTicketsFromFolder_createServerFn_handler, async ({
  data,
  context
}) => coreRemoveTickets({
  ticketIds: data.ticketIds,
  userId: context.userId
}));
export {
  bulkToggleTicketStar_createServerFn_handler,
  createSupportFolder_createServerFn_handler,
  deleteSupportFolder_createServerFn_handler,
  listSupportFolders_createServerFn_handler,
  moveTicketsToFolder_createServerFn_handler,
  removeTicketsFromFolder_createServerFn_handler,
  renameSupportFolder_createServerFn_handler,
  toggleTicketStar_createServerFn_handler
};
