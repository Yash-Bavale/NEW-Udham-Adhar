// Self-permissions: what the currently signed-in user is allowed to do.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ModulePerm = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  scopeAll: boolean;
  scopes: Array<{ websiteId: string | null; categoryId: string | null; serviceId: string | null }>;
};

export type MyPermissions = {
  isAdmin: boolean;
  modules: Record<string, ModulePerm>;
};

export const getMyPermissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MyPermissions> => {
    const { supabase, userId } = context;
    // Admin detection
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const isAdmin = !!roles?.some((r) => r.role === "admin" || r.role === "super_admin");

    if (isAdmin) return { isAdmin: true, modules: {} };

    const [permsRes, scopesRes] = await Promise.all([
      supabase
        .from("user_permissions")
        .select("module_key, can_view, can_create, can_edit, can_delete, scope_all")
        .eq("user_id", userId),
      supabase
        .from("user_permission_scopes")
        .select("module_key, website_id, category_id, service_id")
        .eq("user_id", userId),
    ]);
    if (permsRes.error) throw new Error(permsRes.error.message);
    if (scopesRes.error) throw new Error(scopesRes.error.message);

    const modules: Record<string, ModulePerm> = {};
    for (const p of permsRes.data ?? []) {
      modules[p.module_key] = {
        view: !!p.can_view,
        create: !!p.can_create,
        edit: !!p.can_edit,
        delete: !!p.can_delete,
        scopeAll: !!p.scope_all,
        scopes: [],
      };
    }
    for (const s of scopesRes.data ?? []) {
      const m = modules[s.module_key];
      if (!m) continue;
      m.scopes.push({
        websiteId: s.website_id ?? null,
        categoryId: s.category_id ?? null,
        serviceId: s.service_id ?? null,
      });
    }
    return { isAdmin: false, modules };
  });

export async function getUserModulePermission(
  supabase: any,
  userId: string,
  moduleKey: string
): Promise<{
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  scopeAll: boolean;
  scopes: Array<{ websiteId: string | null; categoryId: string | null; serviceId: string | null }>;
}> {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const isAdmin = !!roles?.some((r: { role: string }) => r.role === "admin" || r.role === "super_admin");

  if (isAdmin) {
    return { canView: true, canCreate: true, canEdit: true, canDelete: true, scopeAll: true, scopes: [] };
  }

  const [permRes, scopesRes] = await Promise.all([
    supabase
      .from("user_permissions")
      .select("can_view, can_create, can_edit, can_delete, scope_all")
      .eq("user_id", userId)
      .eq("module_key", moduleKey)
      .maybeSingle(),
    supabase
      .from("user_permission_scopes")
      .select("website_id, category_id, service_id")
      .eq("user_id", userId)
      .eq("module_key", moduleKey),
  ]);

  const perm = permRes.data;
  if (!perm) {
    return { canView: true, canCreate: true, canEdit: true, canDelete: false, scopeAll: true, scopes: [] };
  }

  const scopes = (scopesRes.data ?? []).map((s: any) => ({
    websiteId: s.website_id ?? null,
    categoryId: s.category_id ?? null,
    serviceId: s.service_id ?? null,
  }));

  return {
    canView: !!perm.can_view,
    canCreate: !!perm.can_create,
    canEdit: !!perm.can_edit,
    canDelete: !!perm.can_delete,
    scopeAll: !!perm.scope_all,
    scopes,
  };
}
