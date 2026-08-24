// App-wide settings (single-row public.app_settings).
// Read: any signed-in staff. Write: super_admin only.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAppSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("app_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const d = (data as any) ?? {};
    return {
      customerDelayAutocloseMinutes: (data?.customer_delay_autoclose_minutes as number | undefined) ?? 480,
      leadsSoundEnabled: d.leads_sound_enabled ?? true,
      ordersSoundEnabled: d.orders_sound_enabled ?? true,
      leadsRingtone: (d.leads_ringtone as string) || (d.ringtone as string) || "chime",
      leadsCustomUrl: (d.leads_custom_url as string) || "",
      ordersRingtone: (d.orders_ringtone as string) || (d.ringtone as string) || "bell",
      ordersCustomUrl: (d.orders_custom_url as string) || "",
      updatedAt: (data?.updated_at as string | undefined) ?? null,
      updatedBy: (data?.updated_by as string | undefined) ?? null,
    };
  });

export const updateCustomerDelayAutocloseMinutes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ minutes: z.number().int().min(1).max(10080) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    // Verify super_admin role using the caller's own RLS context.
    const { data: isSuper } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "super_admin",
    });
    if (!isSuper) throw new Error("Forbidden: super_admin required");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("app_settings")
      .upsert(
        {
          id: 1,
          customer_delay_autoclose_minutes: data.minutes,
          updated_at: new Date().toISOString(),
          updated_by: context.userId,
        } as never,
        { onConflict: "id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true, minutes: data.minutes };
  });

export const updateSoundSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      leadsSoundEnabled: z.boolean(),
      ordersSoundEnabled: z.boolean(),
      leadsRingtone: z.enum(["chime", "bell", "alert", "ding", "soft", "custom"]),
      leadsCustomUrl: z.string().optional(),
      ordersRingtone: z.enum(["chime", "bell", "alert", "ding", "soft", "custom"]),
      ordersCustomUrl: z.string().optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("app_settings")
      .upsert(
        {
          id: 1,
          leads_sound_enabled: data.leadsSoundEnabled,
          orders_sound_enabled: data.ordersSoundEnabled,
          leads_ringtone: data.leadsRingtone,
          leads_custom_url: data.leadsCustomUrl ?? "",
          orders_ringtone: data.ordersRingtone,
          orders_custom_url: data.ordersCustomUrl ?? "",
          updated_at: new Date().toISOString(),
          updated_by: context.userId,
        } as never,
        { onConflict: "id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true, ...data };
  });
