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

    // Month boundary (UTC ok — used only for "this month" counters)
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const monthStartIso = monthStart.toISOString();

    const [
      { data: roles, error: rErr },
      { data: profiles, error: pErr },
      { data: leadsAssigned, error: laErr },
      { data: appsAssigned, error: aaErr },
      { data: appsCompletedMonth, error: cmErr },
      { data: appsCompletedAll, error: caErr },
    ] = await Promise.all([
      admin.from("user_roles").select("user_id, role"),
      admin.from("profiles").select("id, full_name, display_name, mobile, is_active, email, employee_code, department, joining_date"),
      admin.from("leads").select("assigned_to, status, created_at, updated_at"),
      admin.from("applications").select("assigned_to, application_status"),
      admin
        .from("applications")
        .select("assigned_to, updated_at, application_status")
        .eq("application_status", "completed")
        .gte("updated_at", monthStartIso),
      admin
        .from("applications")
        .select("assigned_to, created_at, updated_at, application_status")
        .eq("application_status", "completed"),
    ]);
    if (rErr) throw new Error(rErr.message);
    if (pErr) throw new Error(pErr.message);
    if (laErr) throw new Error(laErr.message);
    if (aaErr) throw new Error(aaErr.message);
    if (cmErr) throw new Error(cmErr.message);
    if (caErr) throw new Error(caErr.message);

    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const list = roleMap.get(r.user_id) ?? [];
      list.push(r.role as string);
      roleMap.set(r.user_id, list);
    });
    const profMap = new Map<string, { full_name: string | null; mobile: string | null; is_active: boolean | null; display_name: string | null; employee_code: string | null; department: string | null; joining_date: string | null }>();
    (profiles ?? []).forEach((p) => profMap.set(p.id, {
      full_name: p.full_name ?? null,
      mobile: p.mobile ?? null,
      is_active: p.is_active ?? true,
      display_name: p.display_name ?? null,
      employee_code: (p as any).employee_code ?? null,
      department: (p as any).department ?? null,
      joining_date: (p as any).joining_date ?? null,
    }));


    // Performance aggregates keyed by user_id
    type Perf = {
      assignedLeads: number;
      openLeads: number;
      assignedApps: number;
      openApps: number;
      completedThisMonth: number;
      avgTurnaroundHours: number | null;
    };
    const perf = new Map<string, Perf>();
    const ensure = (id: string): Perf => {
      let p = perf.get(id);
      if (!p) {
        p = { assignedLeads: 0, openLeads: 0, assignedApps: 0, openApps: 0, completedThisMonth: 0, avgTurnaroundHours: null };
        perf.set(id, p);
      }
      return p;
    };
    const OPEN_LEAD = new Set(["new", "lead_received", "documents_pending", "under_process", "under_review"]);
    const OPEN_APP = new Set(["details_pending", "documents_pending", "under_review", "under_process", "awaiting_payment"]);

    (leadsAssigned ?? []).forEach((l) => {
      if (!l.assigned_to) return;
      const p = ensure(l.assigned_to);
      p.assignedLeads += 1;
      if (OPEN_LEAD.has(String(l.status ?? ""))) p.openLeads += 1;
    });
    (appsAssigned ?? []).forEach((a) => {
      if (!a.assigned_to) return;
      const p = ensure(a.assigned_to);
      p.assignedApps += 1;
      if (OPEN_APP.has(String(a.application_status ?? ""))) p.openApps += 1;
    });
    (appsCompletedMonth ?? []).forEach((a) => {
      if (!a.assigned_to) return;
      ensure(a.assigned_to).completedThisMonth += 1;
    });
    // Avg turnaround: completed apps, mean (updated_at - created_at) hours
    const turnaroundAgg = new Map<string, { sum: number; n: number }>();
    (appsCompletedAll ?? []).forEach((a) => {
      if (!a.assigned_to || !a.created_at || !a.updated_at) return;
      const ms = new Date(a.updated_at).getTime() - new Date(a.created_at).getTime();
      if (!Number.isFinite(ms) || ms < 0) return;
      const cur = turnaroundAgg.get(a.assigned_to) ?? { sum: 0, n: 0 };
      cur.sum += ms / 3_600_000;
      cur.n += 1;
      turnaroundAgg.set(a.assigned_to, cur);
    });
    turnaroundAgg.forEach((v, id) => {
      const p = ensure(id);
      p.avgTurnaroundHours = v.n ? Math.round((v.sum / v.n) * 10) / 10 : null;
    });

    return {
      rows: usersRes.users.map((u) => {
        const p = profMap.get(u.id);
        const stats = perf.get(u.id) ?? {
          assignedLeads: 0, openLeads: 0, assignedApps: 0, openApps: 0,
          completedThisMonth: 0, avgTurnaroundHours: null as number | null,
        };
        return {
          id: u.id,
          email: u.email ?? "",
          full_name: p?.full_name ?? p?.display_name ?? null,
          mobile: p?.mobile ?? null,
          is_active: p?.is_active !== false,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          roles: roleMap.get(u.id) ?? [],
          employee_code: p?.employee_code ?? null,
          department: p?.department ?? null,
          joining_date: p?.joining_date ?? null,
          perf: stats,
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
  password: z.string().min(8).max(72).optional(),
});

function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out + "!9";
}

export const inviteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => InviteInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    // Create user directly with confirmed email — no verification/confirmation required.
    const tempPassword = data.password ?? generateTempPassword();
    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { display_name: data.full_name },
    });
    if (cErr) throw new Error(cErr.message);
    const newUser = created.user;
    if (!newUser) throw new Error("User creation did not return a user.");

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

    return { ok: true, user_id: newUser.id, email: data.email, temp_password: tempPassword };
  });

const UpdateInput = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().trim().min(1).max(120).optional(),
  mobile: z.string().trim().max(20).optional().nullable(),
  role: z.enum(ROLE_VALUES).optional(),
  department: z.string().trim().max(120).optional().nullable(),
  joining_date: z.string().trim().max(20).optional().nullable(), // ISO date
});

export const updateEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => UpdateInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();
    const patch: { full_name?: string; display_name?: string; mobile?: string | null; department?: string | null; joining_date?: string | null } = {};
    if (data.full_name !== undefined) {
      patch.full_name = data.full_name;
      patch.display_name = data.full_name;
    }
    if (data.mobile !== undefined) patch.mobile = data.mobile;
    if (data.department !== undefined) patch.department = data.department;
    if (data.joining_date !== undefined) patch.joining_date = data.joining_date || null;
    if (Object.keys(patch).length) {
      const { error } = await admin.from("profiles").update(patch).eq("id", data.user_id);
      if (error) throw new Error(error.message);
    }
    if (data.role) {
      const { error: dErr } = await admin.from("user_roles").delete().eq("user_id", data.user_id);
      if (dErr) throw new Error(dErr.message);
      const { error: iErr } = await admin.from("user_roles").insert({ user_id: data.user_id, role: data.role as Role });
      if (iErr) throw new Error(iErr.message);
    }
    return { ok: true };
  });

// ---------- Work Access (Phase 4) ----------

const WORK_MODULES = ["work.leads", "work.orders", "work.support", "work.finance"] as const;
type WorkModule = (typeof WORK_MODULES)[number];

export const getEmployeeWorkAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ user_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();
    const [perms, scopes, ws, svcs] = await Promise.all([
      admin.from("user_permissions").select("module_key, can_view").eq("user_id", data.user_id).in("module_key", WORK_MODULES as unknown as string[]),
      admin.from("user_permission_scopes").select("module_key, website_id, service_id").eq("user_id", data.user_id).in("module_key", WORK_MODULES as unknown as string[]),
      admin.from("websites").select("id, name, domain, is_active").order("sort_order", { ascending: true }),
      admin.from("services").select("id, service_code, service_name, website_id, is_active").order("sort_order", { ascending: true }),
    ]);
    const permMap: Record<string, boolean> = {};
    for (const m of WORK_MODULES) permMap[m] = false;
    (perms.data ?? []).forEach((p: any) => { permMap[p.module_key] = !!p.can_view; });
    const websiteScopes: Record<string, string[]> = {};
    const serviceScopes: Record<string, string[]> = {};
    for (const m of WORK_MODULES) { websiteScopes[m] = []; serviceScopes[m] = []; }
    (scopes.data ?? []).forEach((s: any) => {
      if (s.website_id) websiteScopes[s.module_key]?.push(s.website_id);
      if (s.service_id) serviceScopes[s.module_key]?.push(s.service_id);
    });
    return {
      permissions: permMap,
      websiteScopes,
      serviceScopes,
      websites: ws.data ?? [],
      services: svcs.data ?? [],
    };
  });

const WorkAccessInput = z.object({
  user_id: z.string().uuid(),
  work: z.object({
    "work.leads": z.boolean().default(false),
    "work.orders": z.boolean().default(false),
    "work.support": z.boolean().default(false),
    "work.finance": z.boolean().default(false),
  }),
  websites: z.array(z.string().uuid()).default([]),
  services: z.array(z.string().uuid()).default([]),
});

/** Writes user_permissions + user_permission_scopes for the four work modules.
 *  Website + service scopes apply to whichever work modules the user has enabled.
 *  Passing an empty websites/services list means "unrestricted" for that dimension. */
export const setEmployeeWorkAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => WorkAccessInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();
    // Upsert permissions per work module (syncing both work.* and short module keys)
    const MODULE_KEY_PAIRS: Record<string, string[]> = {
      "work.leads": ["work.leads", "leads"],
      "work.orders": ["work.orders", "orders"],
      "work.support": ["work.support", "support", "tickets", "complaints"],
      "work.finance": ["work.finance", "finance", "payments", "invoices"],
    };

    const allKeysToReset: string[] = [];
    for (const m of WORK_MODULES) {
      const can = !!data.work[m];
      const keysToSync = MODULE_KEY_PAIRS[m] || [m];
      for (const k of keysToSync) {
        allKeysToReset.push(k);
        const { error } = await admin.from("user_permissions").upsert({
          user_id: data.user_id,
          module_key: k,
          can_view: can,
          can_create: false,
          can_edit: false,
          can_delete: false,
          scope_all: data.websites.length === 0 && data.services.length === 0,
        }, { onConflict: "user_id,module_key" });
        if (error) throw new Error(error.message);
      }
    }
    // Reset scopes for these modules, then rewrite
    const { error: dErr } = await admin.from("user_permission_scopes")
      .delete()
      .eq("user_id", data.user_id)
      .in("module_key", allKeysToReset as never);
    if (dErr) throw new Error(dErr.message);
    const rows: Array<{ user_id: string; module_key: string; website_id?: string; service_id?: string }> = [];
    for (const m of WORK_MODULES) {
      if (!data.work[m]) continue; // only scope enabled modules
      const keysToSync = MODULE_KEY_PAIRS[m] || [m];
      for (const k of keysToSync) {
        for (const w of data.websites) rows.push({ user_id: data.user_id, module_key: k, website_id: w });
        for (const s of data.services) rows.push({ user_id: data.user_id, module_key: k, service_id: s });
      }
    }
    if (rows.length) {
      const { error: iErr } = await admin.from("user_permission_scopes").insert(rows as never);
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

    // If account deactivated, automatically redistribute active orders
    if (!data.is_active) {
      try {
        const { reassignOrdersFromUnavailableEmployee } = await import("./assignment-engine.server");
        await reassignOrdersFromUnavailableEmployee({
          unavailableEmployeeId: data.user_id,
          reason: "Employee account deactivated by administrator",
          changeType: "AUTO_UNAVAILABLE",
          actorId: context.userId,
        });
      } catch (reassignErr) {
        console.warn("[setEmployeeActive] Auto-reassign warning:", reassignErr);
      }
    }

    return { ok: true };
  });

/** Returns the current staff user's roles. Safe to call from any signed-in user. */
export const getMyStaffRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const admin = await getAdmin();
    const { data, error } = await admin.from("user_roles").select("role").eq("user_id", userId);
    if (error) throw new Error(error.message);
    const { data: prof } = await admin
      .from("profiles")
      .select("display_name, full_name")
      .eq("id", userId)
      .maybeSingle();
    return {
      userId,
      roles: (data ?? []).map((r) => r.role as string),
      displayName: (prof?.display_name || prof?.full_name || null) as string | null,
    };
  });

const ResetPasswordInput = z.object({
  user_id: z.string().uuid(),
  new_password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

/** Super-admin only: set an employee's password directly. */
export const resetEmployeePassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ResetPasswordInput.parse(i))
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const { data: roles, error: rErr } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "super_admin");
    if (rErr) throw new Error(rErr.message);
    if (!roles || roles.length === 0) throw new Error("Forbidden: super_admin only.");

    const { error: uErr } = await admin.auth.admin.updateUserById(data.user_id, {
      password: data.new_password,
    });
    if (uErr) throw new Error(uErr.message);

    try {
      await admin.from("audit_logs").insert({
        entity_type: "user",
        entity_id: data.user_id,
        action: "password_reset",
        actor_id: context.userId,
        new_value: { method: "super_admin_direct_set" },
      } as never);
    } catch { /* audit best-effort */ }

    return { ok: true };
  });

const DeleteEmployeeInput = z.object({
  user_id: z.string().uuid(),
});

/** Admin / Super-admin: permanently delete an employee user, profile, roles and permissions. */
export const deleteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => DeleteEmployeeInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    if (data.user_id === context.userId) {
      throw new Error("You cannot delete your own account.");
    }

    // Delete permissions, scopes, roles & profile
    await Promise.all([
      admin.from("user_permissions").delete().eq("user_id", data.user_id),
      admin.from("user_permission_scopes").delete().eq("user_id", data.user_id),
      admin.from("user_roles").delete().eq("user_id", data.user_id),
      admin.from("profiles").delete().eq("id", data.user_id),
    ]);

    // Delete auth user account
    const { error: dErr } = await admin.auth.admin.deleteUser(data.user_id);
    if (dErr) throw new Error(dErr.message);

    try {
      await admin.from("audit_logs").insert({
        entity_type: "user",
        entity_id: data.user_id,
        action: "delete_employee",
        actor_id: context.userId,
        new_value: { status: "deleted" },
      } as never);
    } catch { /* audit best-effort */ }

    return { ok: true };
  });
