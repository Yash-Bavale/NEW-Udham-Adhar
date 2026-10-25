import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

const STORAGE_PATH = "config/support_ticket_organization.json";

export interface FallbackOrgData {
  folders: Array<{
    id: string;
    name: string;
    color: string;
    user_id: string;
    is_shared: boolean;
    created_at: string;
    updated_at: string;
  }>;
  folder_items: Array<{
    id: string;
    folder_id: string;
    ticket_id: string;
    user_id: string;
    created_at: string;
  }>;
  stars: Array<{
    id: string;
    ticket_id: string;
    user_id: string;
    created_at: string;
  }>;
}

const DEFAULT_ORG_DATA: FallbackOrgData = {
  folders: [],
  folder_items: [],
  stars: [],
};

export async function readFallbackOrg(): Promise<FallbackOrgData> {
  try {
    const admin = await getAdmin();
    const { data, error } = await admin.storage
      .from("documents")
      .download(STORAGE_PATH);
    if (error || !data) return DEFAULT_ORG_DATA;
    const text = await data.text();
    return JSON.parse(text) as FallbackOrgData;
  } catch {
    return DEFAULT_ORG_DATA;
  }
}

export async function writeFallbackOrg(data: FallbackOrgData): Promise<void> {
  try {
    const admin = await getAdmin();
    const buffer = Buffer.from(JSON.stringify(data, null, 2), "utf-8");
    await admin.storage
      .from("documents")
      .upload(STORAGE_PATH, buffer, {
        contentType: "application/json",
        upsert: true,
      });
  } catch (err) {
    console.warn("[writeFallbackOrg] storage upload warning:", err);
  }
}

/**
 * Returns mapping of starred status and folder membership for a given list of ticket IDs.
 */
export async function getTicketOrganizationMeta(
  userId: string,
  ticketIds: string[]
): Promise<{
  starredSet: Set<string>;
  ticketFolderMap: Map<string, { folderId: string; folderName: string; color: string }>;
  starredCount: number;
}> {
  const admin = await getAdmin();
  const starredSet = new Set<string>();
  const ticketFolderMap = new Map<string, { folderId: string; folderName: string; color: string }>();

  if (!ticketIds.length) {
    return { starredSet, ticketFolderMap, starredCount: 0 };
  }

  try {
    // 1. Try DB queries
    const [{ data: starRows, error: sErr }, { data: itemRows, error: iErr }] = await Promise.all([
      admin
        .from("support_ticket_stars" as any)
        .select("ticket_id")
        .eq("user_id", userId)
        .in("ticket_id", ticketIds),
      admin
        .from("support_ticket_folder_items" as any)
        .select("ticket_id, folder_id, folder:support_ticket_folders(id, name, color, is_shared, user_id)")
        .in("ticket_id", ticketIds),
    ]);

    if (!sErr && starRows) {
      starRows.forEach((r: any) => starredSet.add(r.ticket_id));
    }
    if (!iErr && itemRows) {
      itemRows.forEach((r: any) => {
        if (r.folder && (r.folder.is_shared || r.folder.user_id === userId)) {
          ticketFolderMap.set(r.ticket_id, {
            folderId: r.folder.id,
            folderName: r.folder.name,
            color: r.folder.color || "slate",
          });
        }
      });
    }

    if (!sErr && !iErr) {
      const { count: starTotal } = await admin
        .from("support_ticket_stars" as any)
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      return { starredSet, ticketFolderMap, starredCount: starTotal ?? starredSet.size };
    }
  } catch {
    // Fall back to storage
  }

  // Fallback storage path
  const fallback = await readFallbackOrg();
  const userStars = fallback.stars.filter((s) => s.user_id === userId);
  userStars.forEach((s) => {
    if (ticketIds.includes(s.ticket_id)) starredSet.add(s.ticket_id);
  });

  const folderMap = new Map(fallback.folders.map((f) => [f.id, f]));
  fallback.folder_items.forEach((item) => {
    if (ticketIds.includes(item.ticket_id)) {
      const f = folderMap.get(item.folder_id);
      if (f && (f.is_shared || f.user_id === userId)) {
        ticketFolderMap.set(item.ticket_id, {
          folderId: f.id,
          folderName: f.name,
          color: f.color || "slate",
        });
      }
    }
  });

  return { starredSet, ticketFolderMap, starredCount: userStars.length };
}

/**
 * Returns all starred ticket IDs for a user.
 */
export async function getUserStarredTicketIds(userId: string): Promise<string[]> {
  const admin = await getAdmin();
  try {
    const { data, error } = await admin
      .from("support_ticket_stars" as any)
      .select("ticket_id")
      .eq("user_id", userId);
    if (!error && data) {
      return (data as any[]).map((r) => r.ticket_id);
    }
  } catch {}

  const fallback = await readFallbackOrg();
  return fallback.stars.filter((s) => s.user_id === userId).map((s) => s.ticket_id);
}

/**
 * Returns all ticket IDs in a specific folder.
 */
export async function getFolderTicketIds(folderId: string, userId?: string): Promise<string[]> {
  const admin = await getAdmin();
  try {
    if (userId) {
      const { data: folder } = await admin
        .from("support_ticket_folders" as any)
        .select("id, is_shared, user_id")
        .eq("id", folderId)
        .maybeSingle();
      const f: any = folder;
      if (f && !f.is_shared && f.user_id !== userId) {
        return [];
      }
    }
    const { data, error } = await admin
      .from("support_ticket_folder_items" as any)
      .select("ticket_id")
      .eq("folder_id", folderId);
    if (!error && data) {
      return (data as any[]).map((r) => r.ticket_id);
    }
  } catch {}

  const fallback = await readFallbackOrg();
  if (userId) {
    const folder = fallback.folders.find((f) => f.id === folderId);
    if (folder && !folder.is_shared && folder.user_id !== userId) {
      return [];
    }
  }
  return fallback.folder_items.filter((i) => i.folder_id === folderId).map((i) => i.ticket_id);
}

// ─────────────────────────────────────────────────────────────
// CORE REUSABLE WORKER FUNCTIONS (Used by API & Tests)
// ─────────────────────────────────────────────────────────────

export async function coreListFolders(userId: string) {
  const admin = await getAdmin();

  try {
    const { data: folders, error: fErr } = await admin
      .from("support_ticket_folders" as any)
      .select("id, name, color, is_shared, user_id, created_at, updated_at")
      .or(`user_id.eq.${userId},is_shared.eq.true`)
      .order("created_at", { ascending: true });

    if (!fErr && folders) {
      const folderIds = (folders as any[]).map((f) => f.id);
      const { data: items } = await admin
        .from("support_ticket_folder_items" as any)
        .select("folder_id")
        .in("folder_id", folderIds.length ? folderIds : ["00000000-0000-0000-0000-000000000000"]);

      const countMap = new Map<string, number>();
      (items ?? []).forEach((item: any) => {
        countMap.set(item.folder_id, (countMap.get(item.folder_id) ?? 0) + 1);
      });

      const { count: starCount } = await admin
        .from("support_ticket_stars" as any)
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      return {
        folders: (folders as any[]).map((f) => ({
          id: f.id,
          name: f.name,
          color: f.color ?? "slate",
          is_shared: !!f.is_shared,
          is_owner: f.user_id === userId,
          ticket_count: countMap.get(f.id) ?? 0,
          count: countMap.get(f.id) ?? 0,
          created_at: f.created_at,
        })),
        starredCount: starCount ?? 0,
      };
    }
  } catch {}

  // Fallback storage
  const fallback = await readFallbackOrg();
  const userFolders = fallback.folders.filter((f) => f.user_id === userId || f.is_shared);
  const countMap = new Map<string, number>();
  fallback.folder_items.forEach((item) => {
    countMap.set(item.folder_id, (countMap.get(item.folder_id) ?? 0) + 1);
  });

  const starCount = fallback.stars.filter((s) => s.user_id === userId).length;

  return {
    folders: userFolders.map((f) => ({
      id: f.id,
      name: f.name,
      color: f.color ?? "slate",
      is_shared: !!f.is_shared,
      is_owner: f.user_id === userId,
      ticket_count: countMap.get(f.id) ?? 0,
      count: countMap.get(f.id) ?? 0,
      created_at: f.created_at,
    })),
    starredCount: starCount,
  };
}

export async function coreCreateFolder({
  name,
  color = "slate",
  isShared = false,
  userId,
}: {
  name: string;
  color?: string;
  isShared?: boolean;
  userId: string;
}) {
  const admin = await getAdmin();
  const now = new Date().toISOString();

  try {
    const { data: row, error } = await admin
      .from("support_ticket_folders" as any)
      .insert({
        name,
        color,
        user_id: userId,
        is_shared: isShared,
        created_at: now,
        updated_at: now,
      })
      .select("id, name, color, is_shared, created_at")
      .single();

    if (!error && row) {
      return { ok: true, folder: row as any };
    }
  } catch {}

  const fallback = await readFallbackOrg();
  const newFolder = {
    id: crypto.randomUUID(),
    name,
    color,
    user_id: userId,
    is_shared: isShared,
    created_at: now,
    updated_at: now,
  };
  fallback.folders.push(newFolder);
  await writeFallbackOrg(fallback);
  return { ok: true, folder: newFolder as any };
}

export async function coreRenameFolder({
  folderId,
  name,
  color,
  userId,
}: {
  folderId: string;
  name: string;
  color?: string;
  userId: string;
}) {
  const admin = await getAdmin();
  const now = new Date().toISOString();

  const patch: any = { name, updated_at: now };
  if (color) patch.color = color;

  try {
    const { data: updated, error } = await admin
      .from("support_ticket_folders" as any)
      .update(patch)
      .eq("id", folderId)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (!error && updated) {
      return { ok: true, folder: updated as any };
    }
  } catch {}

  const fallback = await readFallbackOrg();
  const folder = fallback.folders.find((f) => f.id === folderId && f.user_id === userId);
  if (!folder) throw new Error("Folder not found or unauthorized");
  folder.name = name;
  if (color) folder.color = color;
  folder.updated_at = now;
  await writeFallbackOrg(fallback);
  return { ok: true, folder: folder as any };
}

export async function coreDeleteFolder({
  folderId,
  userId,
}: {
  folderId: string;
  userId: string;
}) {
  const admin = await getAdmin();

  try {
    const { data: folder } = await admin
      .from("support_ticket_folders" as any)
      .select("id, user_id")
      .eq("id", folderId)
      .maybeSingle();
    const f: any = folder;

    if (f && f.user_id !== userId) {
      throw new Error("Folder not found or unauthorized");
    }

    if (f) {
      await admin
        .from("support_ticket_folder_items" as any)
        .delete()
        .eq("folder_id", folderId);

      const { error } = await admin
        .from("support_ticket_folders" as any)
        .delete()
        .eq("id", folderId)
        .eq("user_id", userId);

      if (!error) {
        return { ok: true, deletedFolderId: folderId };
      }
    }
  } catch (err: any) {
    if (err.message === "Folder not found or unauthorized") throw err;
  }

  const fallback = await readFallbackOrg();
  const folder = fallback.folders.find((f) => f.id === folderId);
  if (!folder || folder.user_id !== userId) {
    throw new Error("Folder not found or unauthorized");
  }

  fallback.folders = fallback.folders.filter((f) => f.id !== folderId);
  fallback.folder_items = fallback.folder_items.filter((i) => i.folder_id !== folderId);
  await writeFallbackOrg(fallback);
  return { ok: true, deletedFolderId: folderId };
}

export async function coreToggleStar({
  ticketId,
  isStarred,
  userId,
}: {
  ticketId: string;
  isStarred?: boolean;
  userId: string;
}) {
  const admin = await getAdmin();

  try {
    const { data: existing, error: cErr } = await admin
      .from("support_ticket_stars" as any)
      .select("id")
      .eq("ticket_id", ticketId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!cErr) {
      let newStarred = false;
      if (existing) {
        if (isStarred === true) return { ok: true, isStarred: true };
        await admin
          .from("support_ticket_stars" as any)
          .delete()
          .eq("ticket_id", ticketId)
          .eq("user_id", userId);
        newStarred = false;
      } else {
        if (isStarred === false) return { ok: true, isStarred: false };
        await admin
          .from("support_ticket_stars" as any)
          .insert({
            ticket_id: ticketId,
            user_id: userId,
            created_at: new Date().toISOString(),
          });
        newStarred = true;
      }
      return { ok: true, isStarred: newStarred };
    }
  } catch {}

  const fallback = await readFallbackOrg();
  const idx = fallback.stars.findIndex((s) => s.ticket_id === ticketId && s.user_id === userId);
  let finalStarred = false;
  if (idx !== -1) {
    if (isStarred === true) return { ok: true, isStarred: true };
    fallback.stars.splice(idx, 1);
    finalStarred = false;
  } else {
    if (isStarred === false) return { ok: true, isStarred: false };
    fallback.stars.push({
      id: crypto.randomUUID(),
      ticket_id: ticketId,
      user_id: userId,
      created_at: new Date().toISOString(),
    });
    finalStarred = true;
  }
  await writeFallbackOrg(fallback);
  return { ok: true, isStarred: finalStarred };
}

export async function coreBulkToggleStar({
  ticketIds,
  isStarred = true,
  userId,
}: {
  ticketIds: string[];
  isStarred?: boolean;
  userId: string;
}) {
  const admin = await getAdmin();

  try {
    if (isStarred) {
      const rows = ticketIds.map((tId) => ({
        ticket_id: tId,
        user_id: userId,
        created_at: new Date().toISOString(),
      }));
      const { error: upsertErr } = await admin
        .from("support_ticket_stars" as any)
        .upsert(rows, { onConflict: "ticket_id,user_id" });
      if (!upsertErr) {
        return { ok: true, count: ticketIds.length, isStarred, star: isStarred };
      }
    } else {
      const { error: delErr } = await admin
        .from("support_ticket_stars" as any)
        .delete()
        .in("ticket_id", ticketIds)
        .eq("user_id", userId);
      if (!delErr) {
        return { ok: true, count: ticketIds.length, isStarred, star: isStarred };
      }
    }
  } catch {}

  const fallback = await readFallbackOrg();
  if (isStarred) {
    ticketIds.forEach((tId) => {
      if (!fallback.stars.some((s) => s.ticket_id === tId && s.user_id === userId)) {
        fallback.stars.push({
          id: crypto.randomUUID(),
          ticket_id: tId,
          user_id: userId,
          created_at: new Date().toISOString(),
        });
      }
    });
  } else {
    fallback.stars = fallback.stars.filter(
      (s) => !(ticketIds.includes(s.ticket_id) && s.user_id === userId)
    );
  }
  await writeFallbackOrg(fallback);
  return { ok: true, count: ticketIds.length, isStarred, star: isStarred };
}

export async function coreMoveTickets({
  ticketIds,
  folderId,
  userId,
}: {
  ticketIds: string[];
  folderId: string;
  userId: string;
}) {
  const admin = await getAdmin();
  const now = new Date().toISOString();

  try {
    const { data: folder } = await admin
      .from("support_ticket_folders" as any)
      .select("id, is_shared, user_id")
      .eq("id", folderId)
      .maybeSingle();
    const f: any = folder;

    if (f && !f.is_shared && f.user_id !== userId) {
      throw new Error("Folder not found or unauthorized");
    }

    if (f) {
      await admin
        .from("support_ticket_folder_items" as any)
        .delete()
        .in("ticket_id", ticketIds);

      const rows = ticketIds.map((tId) => ({
        folder_id: folderId,
        ticket_id: tId,
        user_id: userId,
        created_at: now,
      }));

      const { error } = await admin
        .from("support_ticket_folder_items" as any)
        .insert(rows);

      if (!error) {
        return { ok: true, count: ticketIds.length, folderId };
      }
    }
  } catch (err: any) {
    if (err.message === "Folder not found or unauthorized") throw err;
  }

  const fallback = await readFallbackOrg();
  const folder = fallback.folders.find((f) => f.id === folderId);
  if (!folder || (!folder.is_shared && folder.user_id !== userId)) {
    throw new Error("Folder not found or unauthorized");
  }

  fallback.folder_items = fallback.folder_items.filter(
    (item) => !ticketIds.includes(item.ticket_id)
  );
  ticketIds.forEach((tId) => {
    fallback.folder_items.push({
      id: crypto.randomUUID(),
      folder_id: folderId,
      ticket_id: tId,
      user_id: userId,
      created_at: now,
    });
  });
  await writeFallbackOrg(fallback);
  return { ok: true, count: ticketIds.length, folderId };
}

export async function coreRemoveTickets({
  ticketIds,
}: {
  ticketIds: string[];
  userId?: string;
}) {
  const admin = await getAdmin();
  try {
    const { error: delErr } = await admin
      .from("support_ticket_folder_items" as any)
      .delete()
      .in("ticket_id", ticketIds);
    if (!delErr) {
      return { ok: true, count: ticketIds.length };
    }
  } catch {}

  const fallback = await readFallbackOrg();
  fallback.folder_items = fallback.folder_items.filter(
    (item) => !ticketIds.includes(item.ticket_id)
  );
  await writeFallbackOrg(fallback);
  return { ok: true, count: ticketIds.length };
}

// ─────────────────────────────────────────────────────────────
// SERVER FUNCTIONS (Exposed to UI with session middleware)
// ─────────────────────────────────────────────────────────────

export const listSupportFolders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => coreListFolders(context.userId));

export const createSupportFolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        name: z.string().trim().min(1).max(60),
        color: z.enum(["slate", "blue", "indigo", "emerald", "amber", "rose", "purple"]).default("slate"),
        isShared: z.boolean().default(false),
      })
      .parse(raw)
  )
  .handler(async ({ data, context }) => coreCreateFolder({ ...data, userId: context.userId }));

export const renameSupportFolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        folderId: z.string().uuid(),
        name: z.string().trim().min(1).max(60),
        color: z.enum(["slate", "blue", "indigo", "emerald", "amber", "rose", "purple"]).optional(),
      })
      .parse(raw)
  )
  .handler(async ({ data, context }) => coreRenameFolder({ ...data, userId: context.userId }));

export const deleteSupportFolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ folderId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => coreDeleteFolder({ folderId: data.folderId, userId: context.userId }));

export const toggleTicketStar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ ticketId: z.string().uuid(), isStarred: z.boolean().optional() }).parse(raw)
  )
  .handler(async ({ data, context }) => coreToggleStar({ ...data, userId: context.userId }));

export const bulkToggleTicketStar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        ticketIds: z.array(z.string().uuid()).min(1),
        isStarred: z.boolean().optional(),
        star: z.boolean().optional(),
      })
      .parse(raw)
  )
  .handler(async ({ data, context }) =>
    coreBulkToggleStar({
      ticketIds: data.ticketIds,
      isStarred: data.isStarred ?? data.star ?? true,
      userId: context.userId,
    })
  );

export const moveTicketsToFolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        ticketIds: z.array(z.string().uuid()).min(1),
        folderId: z.string().uuid(),
      })
      .parse(raw)
  )
  .handler(async ({ data, context }) => coreMoveTickets({ ...data, userId: context.userId }));

export const removeTicketsFromFolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ ticketIds: z.array(z.string().uuid()).min(1) }).parse(raw)
  )
  .handler(async ({ data, context }) => coreRemoveTickets({ ticketIds: data.ticketIds, userId: context.userId }));
