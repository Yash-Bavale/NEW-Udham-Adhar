async function writeAudit(params) {
  const { data: { user } } = await params.supabase.auth.getUser();
  await params.supabase.from("audit_logs").insert({
    entity_type: params.entityType,
    entity_id: params.entityId,
    action: params.action,
    old_value: params.oldValue,
    new_value: params.newValue,
    actor_id: params.actorId || user?.id,
    actor_email: params.actorEmail || user?.email
  });
}
async function assertRole(supabase, roles) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const checks = await Promise.all(
    roles.map(
      (role) => supabase.rpc("has_role", {
        _user_id: user.id,
        _role: role
      })
    )
  );
  const hasRole = checks.some(({ data, error }) => !error && data === true);
  if (!hasRole) {
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }
  return user;
}
async function isUserAdmin(supabase, userId) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r) => r.role);
  return roles.includes("super_admin") || roles.includes("admin");
}
export {
  assertRole as a,
  isUserAdmin as i,
  writeAudit as w
};
