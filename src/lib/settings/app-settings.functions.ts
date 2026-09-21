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
      .select("customer_delay_autoclose_minutes, updated_at, updated_by")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      customerDelayAutocloseMinutes: (data?.customer_delay_autoclose_minutes as number | undefined) ?? 480,
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

export const getGlobalReminderSoundSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const { data, error } = await context.supabase
        .from("app_settings")
        .select("alert_sound_tone, custom_audio_url, custom_audio_name, alert_sound_volume, alert_sound_enabled, desktop_notifications, leads_sound_enabled, orders_sound_enabled, leads_ringtone, leads_custom_url, leads_custom_name, orders_ringtone, orders_custom_url, orders_custom_name")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.warn("[getGlobalReminderSoundSettings] select warning:", error.message);
      }

      const row = (data as any) || {};
      return {
        enabled: row.alert_sound_enabled !== false,
        tone: (row.alert_sound_tone || "chime") as "chime" | "bell" | "digital_ring" | "radar" | "soft_ping" | "custom",
        volume: typeof row.alert_sound_volume === "number" ? row.alert_sound_volume : (row.alert_sound_volume ? parseFloat(row.alert_sound_volume) : 0.8),
        desktopNotifications: row.desktop_notifications !== false,
        customAudioUrl: (row.custom_audio_url as string | null) || null,
        customAudioName: (row.custom_audio_name as string | null) || null,
        leadsSoundEnabled: row.leads_sound_enabled !== false,
        ordersSoundEnabled: row.orders_sound_enabled !== false,
        leadsRingtone: (row.leads_ringtone || "chime") as string,
        leadsCustomUrl: (row.leads_custom_url as string | null) || null,
        leadsCustomName: (row.leads_custom_name as string | null) || null,
        ordersRingtone: (row.orders_ringtone || "bell") as string,
        ordersCustomUrl: (row.orders_custom_url as string | null) || null,
        ordersCustomName: (row.orders_custom_name as string | null) || null,
      };
    } catch (err) {
      console.warn("[getGlobalReminderSoundSettings] error:", err);
      return {
        enabled: true,
        tone: "chime" as const,
        volume: 0.8,
        desktopNotifications: true,
        customAudioUrl: null,
        customAudioName: null,
        leadsSoundEnabled: true,
        ordersSoundEnabled: true,
        leadsRingtone: "chime",
        leadsCustomUrl: null,
        leadsCustomName: null,
        ordersRingtone: "bell",
        ordersCustomUrl: null,
        ordersCustomName: null,
      };
    }
  });

export const saveGlobalReminderSoundSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      enabled: z.boolean().optional(),
      tone: z.enum(["chime", "bell", "digital_ring", "radar", "soft_ping", "custom"]).optional(),
      volume: z.number().min(0).max(1).optional(),
      desktopNotifications: z.boolean().optional(),
      customAudioUrl: z.string().nullable().optional(),
      customAudioName: z.string().nullable().optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const updatePayload: Record<string, any> = {
      id: 1,
      updated_at: new Date().toISOString(),
      updated_by: context.userId,
    };

    if (data.enabled !== undefined) updatePayload.alert_sound_enabled = data.enabled;
    if (data.tone !== undefined) updatePayload.alert_sound_tone = data.tone;
    if (data.volume !== undefined) updatePayload.alert_sound_volume = data.volume;
    if (data.desktopNotifications !== undefined) updatePayload.desktop_notifications = data.desktopNotifications;
    if (data.customAudioUrl !== undefined) updatePayload.custom_audio_url = data.customAudioUrl;
    if (data.customAudioName !== undefined) updatePayload.custom_audio_name = data.customAudioName;

    const { error } = await supabaseAdmin
      .from("app_settings")
      .upsert(updatePayload as never, { onConflict: "id" });

    if (error) {
      console.error("[saveGlobalReminderSoundSettings] upsert error:", error);
      throw new Error(error.message);
    }

    return { ok: true, ...data };
  });

export const uploadAlertAudioFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      fileName: z.string().min(1),
      base64Data: z.string().min(1), // Base64 data (with or without data:audio/... prefix)
      target: z.enum(["reminder", "lead", "order"]).default("reminder"),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Clean base64 string
    const match = data.base64Data.match(/^data:([^;]+);base64,(.+)$/);
    const mimeType = match ? match[1] : "audio/mpeg";
    const rawBase64 = match ? match[2] : data.base64Data;
    const buffer = Buffer.from(rawBase64, "base64");

    // Determine extension
    const extMatch = data.fileName.match(/\.(mp3|wav|ogg|m4a|aac)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : "mp3";
    const safeName = `${data.target}-sound-${Date.now()}.${ext}`;
    const storagePath = `audio/${safeName}`;

    // Upload to 'documents' bucket
    const { error: uploadErr } = await supabaseAdmin.storage
      .from("documents")
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadErr) {
      console.error("[uploadAlertAudioFile] storage error:", uploadErr);
      throw new Error(`Failed to upload audio: ${uploadErr.message}`);
    }

    // Public API route to serve this audio
    const publicUrl = `/api/public/audio/${safeName}`;

    // Persist to app_settings
    const updatePayload: Record<string, any> = {
      id: 1,
      updated_at: new Date().toISOString(),
      updated_by: context.userId,
    };

    if (data.target === "reminder") {
      updatePayload.custom_audio_url = publicUrl;
      updatePayload.custom_audio_name = data.fileName;
      updatePayload.alert_sound_tone = "custom";
    } else if (data.target === "lead") {
      updatePayload.leads_custom_url = publicUrl;
      updatePayload.leads_custom_name = data.fileName;
      updatePayload.leads_ringtone = "custom";
    } else if (data.target === "order") {
      updatePayload.orders_custom_url = publicUrl;
      updatePayload.orders_custom_name = data.fileName;
      updatePayload.orders_ringtone = "custom";
    }

    await supabaseAdmin
      .from("app_settings")
      .upsert(updatePayload as never, { onConflict: "id" });

    return {
      ok: true,
      url: publicUrl,
      fileName: data.fileName,
      storagePath,
    };
  });

export const updateSoundSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      leadsSoundEnabled: z.boolean(),
      ordersSoundEnabled: z.boolean(),
      leadsRingtone: z.enum(["chime", "bell", "alert", "ding", "soft", "custom"]),
      leadsCustomUrl: z.string().optional().nullable(),
      leadsCustomName: z.string().optional().nullable(),
      ordersRingtone: z.enum(["chime", "bell", "alert", "ding", "soft", "custom"]),
      ordersCustomUrl: z.string().optional().nullable(),
      ordersCustomName: z.string().optional().nullable(),
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
          leads_custom_url: data.leadsCustomUrl || null,
          leads_custom_name: data.leadsCustomName || null,
          orders_ringtone: data.ordersRingtone,
          orders_custom_url: data.ordersCustomUrl || null,
          orders_custom_name: data.ordersCustomName || null,
          updated_at: new Date().toISOString(),
          updated_by: context.userId,
        } as never,
        { onConflict: "id" },
      );
    if (error) {
      console.warn("[updateSoundSettings] upsert warning:", error.message);
    }
    return { ok: true, ...data };
  });
