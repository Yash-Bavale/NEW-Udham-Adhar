import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, s as string, b as boolean, _ as _enum } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const getAppSettings_createServerFn_handler = createServerRpc({
  id: "da0d4ad64a43c12d5ccf5c8cadbe2039bcc683635ccd09609ec02bde330c4849",
  name: "getAppSettings",
  filename: "src/lib/settings/app-settings.functions.ts"
}, (opts) => getAppSettings.__executeServer(opts));
const getAppSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAppSettings_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("app_settings").select("customer_delay_autoclose_minutes, updated_at, updated_by").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    customerDelayAutocloseMinutes: data?.customer_delay_autoclose_minutes ?? 480,
    updatedAt: data?.updated_at ?? null,
    updatedBy: data?.updated_by ?? null
  };
});
const updateCustomerDelayAutocloseMinutes_createServerFn_handler = createServerRpc({
  id: "d47c7801098ff1a803823beb2d24ff484e855000f8de881693cee5d369da1970",
  name: "updateCustomerDelayAutocloseMinutes",
  filename: "src/lib/settings/app-settings.functions.ts"
}, (opts) => updateCustomerDelayAutocloseMinutes.__executeServer(opts));
const updateCustomerDelayAutocloseMinutes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  minutes: number().int().min(1).max(10080)
}).parse(raw)).handler(updateCustomerDelayAutocloseMinutes_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: isSuper
  } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "super_admin"
  });
  if (!isSuper) throw new Error("Forbidden: super_admin required");
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    error
  } = await supabaseAdmin.from("app_settings").upsert({
    id: 1,
    customer_delay_autoclose_minutes: data.minutes,
    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_by: context.userId
  }, {
    onConflict: "id"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true,
    minutes: data.minutes
  };
});
const SOUND_CONFIG_STORAGE_PATH = "config/sound-settings.json";
const DEFAULT_GLOBAL_SOUND_CONFIG = {
  enabled: true,
  tone: "chime",
  volume: 0.8,
  desktopNotifications: true,
  customAudioUrl: null,
  customAudioName: null,
  leadsSoundEnabled: true,
  ordersSoundEnabled: true,
  leadsToastEnabled: true,
  ordersToastEnabled: true,
  leadsRingtone: "chime",
  leadsCustomUrl: null,
  leadsCustomName: null,
  ordersRingtone: "bell",
  ordersCustomUrl: null,
  ordersCustomName: null
};
async function readSoundConfigFromStorage() {
  try {
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    const {
      data,
      error
    } = await supabaseAdmin.storage.from("documents").download(SOUND_CONFIG_STORAGE_PATH);
    if (error || !data) return null;
    const text = await data.text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}
async function writeSoundConfigToStorage(config) {
  try {
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    const existing = await readSoundConfigFromStorage() || DEFAULT_GLOBAL_SOUND_CONFIG;
    const merged = {
      ...existing,
      ...config
    };
    const buffer = Buffer.from(JSON.stringify(merged, null, 2), "utf-8");
    await supabaseAdmin.storage.from("documents").upload(SOUND_CONFIG_STORAGE_PATH, buffer, {
      contentType: "application/json",
      upsert: true
    });
  } catch (err) {
    console.warn("[writeSoundConfigToStorage] storage config write warning:", err);
  }
}
const getGlobalReminderSoundSettings_createServerFn_handler = createServerRpc({
  id: "c335a3a00eb993a229afef995edf4e3963b4bd473c9941f08e101653728fd7d4",
  name: "getGlobalReminderSoundSettings",
  filename: "src/lib/settings/app-settings.functions.ts"
}, (opts) => getGlobalReminderSoundSettings.__executeServer(opts));
const getGlobalReminderSoundSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getGlobalReminderSoundSettings_createServerFn_handler, async ({
  context
}) => {
  let dbRow = null;
  try {
    const {
      data
    } = await context.supabase.from("app_settings").select("alert_sound_tone, custom_audio_url, custom_audio_name, alert_sound_volume, alert_sound_enabled, desktop_notifications, leads_sound_enabled, orders_sound_enabled, leads_ringtone, leads_custom_url, leads_custom_name, orders_ringtone, orders_custom_url, orders_custom_name").eq("id", 1).maybeSingle();
    if (data && data.alert_sound_tone) {
      dbRow = data;
    }
  } catch {
  }
  const storageConfig = await readSoundConfigFromStorage();
  const enabled = dbRow?.alert_sound_enabled ?? storageConfig?.enabled ?? true;
  const tone = dbRow?.alert_sound_tone || storageConfig?.tone || "chime";
  const volume = typeof dbRow?.alert_sound_volume === "number" ? dbRow.alert_sound_volume : storageConfig?.volume ?? 0.8;
  const desktopNotifications = dbRow?.desktop_notifications ?? storageConfig?.desktopNotifications ?? true;
  const customAudioUrl = dbRow?.custom_audio_url || storageConfig?.customAudioUrl || null;
  const customAudioName = dbRow?.custom_audio_name || storageConfig?.customAudioName || null;
  const leadsSoundEnabled = dbRow?.leads_sound_enabled ?? storageConfig?.leadsSoundEnabled ?? true;
  const ordersSoundEnabled = dbRow?.orders_sound_enabled ?? storageConfig?.ordersSoundEnabled ?? true;
  const leadsToastEnabled = dbRow?.leads_toast_enabled ?? storageConfig?.leadsToastEnabled ?? true;
  const ordersToastEnabled = dbRow?.orders_toast_enabled ?? storageConfig?.ordersToastEnabled ?? true;
  const leadsRingtone = dbRow?.leads_ringtone || storageConfig?.leadsRingtone || "chime";
  const leadsCustomUrl = dbRow?.leads_custom_url || storageConfig?.leadsCustomUrl || null;
  const leadsCustomName = dbRow?.leads_custom_name || storageConfig?.leadsCustomName || null;
  const ordersRingtone = dbRow?.orders_ringtone || storageConfig?.ordersRingtone || "bell";
  const ordersCustomUrl = dbRow?.orders_custom_url || storageConfig?.ordersCustomUrl || null;
  const ordersCustomName = dbRow?.orders_custom_name || storageConfig?.ordersCustomName || null;
  return {
    enabled: enabled !== false,
    tone,
    volume,
    desktopNotifications: desktopNotifications !== false,
    customAudioUrl,
    customAudioName,
    leadsSoundEnabled: leadsSoundEnabled !== false,
    ordersSoundEnabled: ordersSoundEnabled !== false,
    leadsToastEnabled: leadsToastEnabled !== false,
    ordersToastEnabled: ordersToastEnabled !== false,
    leadsRingtone,
    leadsCustomUrl,
    leadsCustomName,
    ordersRingtone,
    ordersCustomUrl,
    ordersCustomName
  };
});
const saveGlobalReminderSoundSettings_createServerFn_handler = createServerRpc({
  id: "201f54cd7aabf113779c43ab955d6bc24f45dd0f00fa24c64eb0b1269d7f9fbb",
  name: "saveGlobalReminderSoundSettings",
  filename: "src/lib/settings/app-settings.functions.ts"
}, (opts) => saveGlobalReminderSoundSettings.__executeServer(opts));
const saveGlobalReminderSoundSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  enabled: boolean().optional(),
  tone: _enum(["chime", "bell", "digital_ring", "radar", "soft_ping", "custom"]).optional(),
  volume: number().min(0).max(1).optional(),
  desktopNotifications: boolean().optional(),
  customAudioUrl: string().nullable().optional(),
  customAudioName: string().nullable().optional()
}).parse(raw)).handler(saveGlobalReminderSoundSettings_createServerFn_handler, async ({
  data,
  context
}) => {
  await writeSoundConfigToStorage({
    enabled: data.enabled,
    tone: data.tone,
    volume: data.volume,
    desktopNotifications: data.desktopNotifications,
    customAudioUrl: data.customAudioUrl,
    customAudioName: data.customAudioName
  });
  try {
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    const updatePayload = {
      id: 1,
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_by: context.userId
    };
    if (data.enabled !== void 0) updatePayload.alert_sound_enabled = data.enabled;
    if (data.tone !== void 0) updatePayload.alert_sound_tone = data.tone;
    if (data.volume !== void 0) updatePayload.alert_sound_volume = data.volume;
    if (data.desktopNotifications !== void 0) updatePayload.desktop_notifications = data.desktopNotifications;
    if (data.customAudioUrl !== void 0) updatePayload.custom_audio_url = data.customAudioUrl;
    if (data.customAudioName !== void 0) updatePayload.custom_audio_name = data.customAudioName;
    await supabaseAdmin.from("app_settings").upsert(updatePayload, {
      onConflict: "id"
    });
  } catch (err) {
    console.warn("[saveGlobalReminderSoundSettings] app_settings write warning:", err);
  }
  return {
    ok: true,
    ...data
  };
});
const uploadAlertAudioFile_createServerFn_handler = createServerRpc({
  id: "0fb215fd36771cff8bd0927e5d92970fa4faf1e918647c3ee5f03a34717f96bb",
  name: "uploadAlertAudioFile",
  filename: "src/lib/settings/app-settings.functions.ts"
}, (opts) => uploadAlertAudioFile.__executeServer(opts));
const uploadAlertAudioFile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  fileName: string().min(1),
  base64Data: string().min(1),
  target: _enum(["reminder", "lead", "order"]).default("reminder")
}).parse(raw)).handler(uploadAlertAudioFile_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const match = data.base64Data.match(/^data:([^;]+);base64,(.+)$/);
  const mimeType = match ? match[1] : "audio/mpeg";
  const rawBase64 = match ? match[2] : data.base64Data;
  const buffer = Buffer.from(rawBase64, "base64");
  const extMatch = data.fileName.match(/\.(mp3|wav|ogg|m4a|aac)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : "mp3";
  const safeName = `${data.target}-sound-latest.${ext}`;
  const storagePath = `audio/${safeName}`;
  const {
    error: uploadErr
  } = await supabaseAdmin.storage.from("documents").upload(storagePath, buffer, {
    contentType: mimeType,
    upsert: true
  });
  if (uploadErr) {
    console.error("[uploadAlertAudioFile] storage error:", uploadErr);
    throw new Error(`Failed to upload audio: ${uploadErr.message}`);
  }
  const publicUrl = `/api/public/audio/${safeName}`;
  const configUpdate = {};
  if (data.target === "reminder") {
    configUpdate.customAudioUrl = publicUrl;
    configUpdate.customAudioName = data.fileName;
    configUpdate.tone = "custom";
  } else if (data.target === "lead") {
    configUpdate.leadsCustomUrl = publicUrl;
    configUpdate.leadsCustomName = data.fileName;
    configUpdate.leadsRingtone = "custom";
  } else if (data.target === "order") {
    configUpdate.ordersCustomUrl = publicUrl;
    configUpdate.ordersCustomName = data.fileName;
    configUpdate.ordersRingtone = "custom";
  }
  await writeSoundConfigToStorage(configUpdate);
  try {
    const updatePayload = {
      id: 1,
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_by: context.userId
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
    await supabaseAdmin.from("app_settings").upsert(updatePayload, {
      onConflict: "id"
    });
  } catch {
  }
  return {
    ok: true,
    url: publicUrl,
    fileName: data.fileName,
    storagePath
  };
});
const updateSoundSettings_createServerFn_handler = createServerRpc({
  id: "42f88baefd7ff2ad854b29ca2ba0a4823e83346307afd84b3517d9b392f998b5",
  name: "updateSoundSettings",
  filename: "src/lib/settings/app-settings.functions.ts"
}, (opts) => updateSoundSettings.__executeServer(opts));
const updateSoundSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  leadsSoundEnabled: boolean(),
  ordersSoundEnabled: boolean(),
  leadsToastEnabled: boolean().optional(),
  ordersToastEnabled: boolean().optional(),
  leadsRingtone: _enum(["chime", "bell", "alert", "ding", "soft", "custom"]),
  leadsCustomUrl: string().optional().nullable(),
  leadsCustomName: string().optional().nullable(),
  ordersRingtone: _enum(["chime", "bell", "alert", "ding", "soft", "custom"]),
  ordersCustomUrl: string().optional().nullable(),
  ordersCustomName: string().optional().nullable()
}).parse(raw)).handler(updateSoundSettings_createServerFn_handler, async ({
  data,
  context
}) => {
  await writeSoundConfigToStorage({
    leadsSoundEnabled: data.leadsSoundEnabled,
    ordersSoundEnabled: data.ordersSoundEnabled,
    leadsToastEnabled: data.leadsToastEnabled !== false,
    ordersToastEnabled: data.ordersToastEnabled !== false,
    leadsRingtone: data.leadsRingtone,
    leadsCustomUrl: data.leadsCustomUrl || null,
    leadsCustomName: data.leadsCustomName || null,
    ordersRingtone: data.ordersRingtone,
    ordersCustomUrl: data.ordersCustomUrl || null,
    ordersCustomName: data.ordersCustomName || null
  });
  try {
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    await supabaseAdmin.from("app_settings").upsert({
      id: 1,
      leads_sound_enabled: data.leadsSoundEnabled,
      orders_sound_enabled: data.ordersSoundEnabled,
      leads_toast_enabled: data.leadsToastEnabled !== false,
      orders_toast_enabled: data.ordersToastEnabled !== false,
      leads_ringtone: data.leadsRingtone,
      leads_custom_url: data.leadsCustomUrl || null,
      leads_custom_name: data.leadsCustomName || null,
      ordersRingtone: data.ordersRingtone,
      orders_custom_url: data.ordersCustomUrl || null,
      orders_custom_name: data.ordersCustomName || null,
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_by: context.userId
    }, {
      onConflict: "id"
    });
  } catch {
  }
  return {
    ok: true,
    ...data
  };
});
const CALLBACK_PRESETS_STORAGE_PATH = "config/callback-presets.json";
const DEFAULT_CALLBACK_PRESET_CONFIG = {
  quickMinutes: 60,
  recommendedHours: 2,
  afternoonHours: 3,
  beforeShiftEndHours: 4,
  tomorrowDefaultTime: "10:30"
};
async function readCallbackPresetsFromStorage() {
  try {
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    const {
      data,
      error
    } = await supabaseAdmin.storage.from("documents").download(CALLBACK_PRESETS_STORAGE_PATH);
    if (error || !data) return null;
    const text = await data.text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}
async function writeCallbackPresetsToStorage(config) {
  try {
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    const existing = await readCallbackPresetsFromStorage() || DEFAULT_CALLBACK_PRESET_CONFIG;
    const merged = {
      ...existing,
      ...config
    };
    const buffer = Buffer.from(JSON.stringify(merged, null, 2), "utf-8");
    await supabaseAdmin.storage.from("documents").upload(CALLBACK_PRESETS_STORAGE_PATH, buffer, {
      contentType: "application/json",
      upsert: true
    });
  } catch (err) {
    console.warn("[writeCallbackPresetsToStorage] storage config write warning:", err);
  }
}
const getCallbackReminderPresetSettings_createServerFn_handler = createServerRpc({
  id: "11ee5a37c80fbe9002e3d8fc8b7ce9a5ed86b8aea4f74e966e7ae36be8ef52f2",
  name: "getCallbackReminderPresetSettings",
  filename: "src/lib/settings/app-settings.functions.ts"
}, (opts) => getCallbackReminderPresetSettings.__executeServer(opts));
const getCallbackReminderPresetSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getCallbackReminderPresetSettings_createServerFn_handler, async () => {
  const storageConfig = await readCallbackPresetsFromStorage();
  const afternoonHours = storageConfig?.afternoonHours ?? storageConfig?.eveningHours ?? DEFAULT_CALLBACK_PRESET_CONFIG.afternoonHours;
  const beforeShiftEndHours = storageConfig?.beforeShiftEndHours ?? storageConfig?.laterTodayHours ?? DEFAULT_CALLBACK_PRESET_CONFIG.beforeShiftEndHours;
  return {
    quickMinutes: storageConfig?.quickMinutes ?? DEFAULT_CALLBACK_PRESET_CONFIG.quickMinutes,
    recommendedHours: storageConfig?.recommendedHours ?? DEFAULT_CALLBACK_PRESET_CONFIG.recommendedHours,
    afternoonHours,
    eveningHours: afternoonHours,
    // alias
    beforeShiftEndHours,
    laterTodayHours: beforeShiftEndHours,
    // alias
    tomorrowDefaultTime: storageConfig?.tomorrowDefaultTime ?? DEFAULT_CALLBACK_PRESET_CONFIG.tomorrowDefaultTime
  };
});
const saveCallbackReminderPresetSettings_createServerFn_handler = createServerRpc({
  id: "a04d5285dce31da0f52dfbf943c2d8c015900c3e5bf5bb9cbc3323c6104bd1d0",
  name: "saveCallbackReminderPresetSettings",
  filename: "src/lib/settings/app-settings.functions.ts"
}, (opts) => saveCallbackReminderPresetSettings.__executeServer(opts));
const saveCallbackReminderPresetSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  quickMinutes: number().min(1).max(1440),
  recommendedHours: number().min(0.1).max(72),
  afternoonHours: number().min(0.1).max(72).optional(),
  eveningHours: number().min(0.1).max(72).optional(),
  beforeShiftEndHours: number().min(0.1).max(72).optional(),
  laterTodayHours: number().min(0.1).max(72).optional(),
  tomorrowDefaultTime: string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
}).transform((d) => ({
  quickMinutes: d.quickMinutes,
  recommendedHours: d.recommendedHours,
  afternoonHours: d.afternoonHours ?? d.eveningHours ?? 3,
  beforeShiftEndHours: d.beforeShiftEndHours ?? d.laterTodayHours ?? 4,
  tomorrowDefaultTime: d.tomorrowDefaultTime
})).parse(raw)).handler(saveCallbackReminderPresetSettings_createServerFn_handler, async ({
  data
}) => {
  await writeCallbackPresetsToStorage(data);
  return {
    ok: true,
    ...data
  };
});
export {
  getAppSettings_createServerFn_handler,
  getCallbackReminderPresetSettings_createServerFn_handler,
  getGlobalReminderSoundSettings_createServerFn_handler,
  saveCallbackReminderPresetSettings_createServerFn_handler,
  saveGlobalReminderSoundSettings_createServerFn_handler,
  updateCustomerDelayAutocloseMinutes_createServerFn_handler,
  updateSoundSettings_createServerFn_handler,
  uploadAlertAudioFile_createServerFn_handler
};
