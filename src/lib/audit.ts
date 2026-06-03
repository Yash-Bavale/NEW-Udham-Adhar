import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./integrations/supabase/types";

export type AuditEntity = "lead" | "application" | "payment" | "complaint" | "onboarding" | "document" | "certificate";

export async function writeAudit(
  supabase: SupabaseClient<Database>,
  params: {
    entityType: AuditEntity;
    entityId: string;
    action: string;
    oldValue?: any;
    newValue?: any;
    actorId?: string;
    actorEmail?: string;
  }
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase.from("audit_logs").insert({
    entity_type: params.entityType,
    entity_id: params.entityId,
    action: params.action,
    old_value: params.oldValue,
    new_value: params.newValue,
    actor_id: params.actorId || user?.id,
    actor_email: params.actorEmail || user?.email,
  });
}

export async function assertRole(
  supabase: SupabaseClient<Database>,
  roles: Database["public"]["Enums"]["user_role"][]
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !roles.includes(profile.role)) {
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  return user;
}
