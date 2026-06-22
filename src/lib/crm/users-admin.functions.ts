// Admin-only user/role management. Uses (await getAdmin()) to read auth.users.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ASSIGNABLE_ROLES, type Role } from "@/lib/roles";

const ROLE_VALUES = ASSIGNABLE_ROLES as unknown as [string, ...string[]];

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function assertAdmin(userId: string) {
  const { data, error } = await (await getAdmin())
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "super_admin"]);
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Forbidden: admin access required.");
}

export const listStaffUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    const { data: usersRes, error: uErr } = await admin.auth.admin.listUsers({
      page: 1, perPage: 200,
    });
    if (uErr) throw new Error(uErr.message);

    const [{ data: roles, error: rErr }, { data: profiles, error: pErr }] = await Promise.all([
      admin.from("user_roles").select("user_id, role"),
      admin.from("profiles").select("id, full_name, display_name, mobile, is_active, email"),
    ]);
    if (rErr) throw new Error(rErr.message);
    if (pErr) throw new Error(pErr.message);

    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const list = roleMap.get(r.user_id) ?? [];
      list.push(r.role as string);
      roleMap.set(r.user_id, list);
    });
    const profMap = new Map<string, { full_name: string | null; mobile: string | null; is_active: boolean | null; display_name: string | null }>();
    (profiles ?? []).forEach((p) => profMap.set(p.id, {
      full_name: p.full_name ?? null,
      mobile: p.mobile ?? null,
      is_active: p.is_active ?? true,
      display_name: p.display_name ?? null,
    }));

    return {
      rows: usersRes.users.map((u) => {
        const p = profMap.get(u.id);
        return {
          id: u.id,
          email: u.email ?? "",
          full_name: p?.full_name ?? p?.display_name ?? null,
          mobile: p?.mobile ?? null,
          is_active: p?.is_active !== false,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          roles: roleMap.get(u.id) ?? [],
        };
      }),
    };
  });

const RoleInput = z.object({
  user_id: z.string().uuid(),
  role: z.enum(ROLE_VALUES),
});

export const grantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => RoleInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await (await getAdmin())
      .from("user_roles")
      .upsert({ user_id: data.user_id, role: data.role as Role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const revokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => RoleInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await (await getAdmin())
      .from("user_roles")
      .delete()
      .eq("user_id", data.user_id)
      .eq("role", data.role as Role);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const InviteInput = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  mobile: z.string().trim().max(20).optional().nullable(),
  role: z.enum(ROLE_VALUES),
});

export const inviteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => InviteInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    // Invite via Supabase Auth (sends magic invite email)
    const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(data.email, {
      data: { display_name: data.full_name },
    });
    if (invErr) throw new Error(invErr.message);
    const newUser = invited.user;
    if (!newUser) throw new Error("Invite did not return a user.");

    // Upsert profile
    const { error: pErr } = await admin.from("profiles").upsert({
      id: newUser.id,
      email: data.email,
      display_name: data.full_name,
      full_name: data.full_name,
      mobile: data.mobile ?? null,
      is_active: true,
    }, { onConflict: "id" });
    if (pErr) throw new Error(pErr.message);

    // Grant role
    const { error: rErr } = await admin.from("user_roles").upsert(
      { user_id: newUser.id, role: data.role as Role },
      { onConflict: "user_id,role" },
    );
    if (rErr) throw new Error(rErr.message);

    return { ok: true, user_id: newUser.id };
  });

const UpdateInput = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().trim().min(1).max(120).optional(),
  mobile: z.string().trim().max(20).optional().nullable(),
  role: z.enum(ROLE_VALUES).optional(),
});

export const updateEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => UpdateInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();
    const patch: Record<string, unknown> = {};
    if (data.full_name !== undefined) {
      patch.full_name = data.full_name;
      patch.display_name = data.full_name;
    }
    if (data.mobile !== undefined) patch.mobile = data.mobile;
    if (Object.keys(patch).length) {
      const { error } = await admin.from("profiles").update(patch).eq("id", data.user_id);
      if (error) throw new Error(error.message);
    }
    if (data.role) {
      // Replace existing roles with the single chosen role (employee form keeps one role)
      const { error: dErr } = await admin.from("user_roles").delete().eq("user_id", data.user_id);
      if (dErr) throw new Error(dErr.message);
      const { error: iErr } = await admin.from("user_roles").insert({ user_id: data.user_id, role: data.role as Role });
      if (iErr) throw new Error(iErr.message);
    }
    return { ok: true };
  });

const ActiveInput = z.object({
  user_id: z.string().uuid(),
  is_active: z.boolean(),
});

export const setEmployeeActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ActiveInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    // Update profile flag
    const { error: pErr } = await admin.from("profiles").upsert(
      { id: data.user_id, is_active: data.is_active },
      { onConflict: "id" },
    );
    if (pErr) throw new Error(pErr.message);

    // Ban / unban in auth
    const { error: bErr } = await admin.auth.admin.updateUserById(data.user_id, {
      ban_duration: data.is_active ? "none" : "876000h",
    } as never);
    if (bErr) throw new Error(bErr.message);

    return { ok: true };
  });

/** Returns the current staff user's roles. Safe to call from any signed-in user. */
export const getMyStaffRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { userId, roles: (data ?? []).map((r) => r.role as string) };
  });
