// Server-only audit helper. Import only from server functions / server routes.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AuditEntry = {
  actorId?: string | null;
  actorEmail?: string | null;
  entityType: string;
  entityId?: string | null;
  action: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
};

export async function writeAudit(entry: AuditEntry): Promise<void> {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      actor_id: entry.actorId ?? null,
      actor_email: entry.actorEmail ?? null,
      entity_type: entry.entityType,
      entity_id: entry.entityId ?? null,
      action: entry.action,
      old_value: (entry.oldValue ?? null) as never,
      new_value: (entry.newValue ?? null) as never,
      ip: entry.ip ?? null,
      user_agent: entry.userAgent ?? null,
    });
  } catch (err) {
    // Audit must never break the primary action
    console.error("[audit] failed", err);
  }
}
