import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function memberIdOf(ctx: { supabase: any; userId: string }): Promise<string | null> {
  const { data } = await ctx.supabase.from("profiles").select("smartflo_agent_id").eq("id", ctx.userId).maybeSingle();
  const v = typeof data?.smartflo_agent_id === "string" ? data.smartflo_agent_id.trim() : "";
  return /^\d+$/.test(v) ? v : null;
}

/** Safe status for the phone panel: names of missing settings only, never values. */
export const getWebRtcStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { accessFor } = await import("./callerdesk-webrtc.server");
    const a = accessFor(context.userId, await memberIdOf(context as any));
    if (!a.authorized) return { authorized: false as const };
    return { authorized: true as const, enabled: a.enabled, missing: a.missing, canRegister: a.canRegister };
  });

/** Per-agent SIP session config, released only to the authorised test agent with the flag on. */
export const getWebRtcSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { accessFor, readEnv, sessionCredentials } = await import("./callerdesk-webrtc.server");
    const env = readEnv();
    const a = accessFor(context.userId, await memberIdOf(context as any), env);
    if (!a.authorized) throw new Error("Browser calling is not enabled for your account.");
    if (!a.canRegister) throw new Error("WebRTC setup incomplete — waiting for CallerDesk VPN and agent SIP credentials.");
    const creds = sessionCredentials(env);
    if (!creds) throw new Error("CallerDesk WebRTC settings are invalid. Check host, port and path.");
    return creds;
  });
