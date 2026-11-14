import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, n as number, s as string, _ as _enum, b as boolean } from "../_libs/zod.mjs";
const getAppSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("da0d4ad64a43c12d5ccf5c8cadbe2039bcc683635ccd09609ec02bde330c4849"));
const updateCustomerDelayAutocloseMinutes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  minutes: number().int().min(1).max(10080)
}).parse(raw)).handler(createSsrRpc("d47c7801098ff1a803823beb2d24ff484e855000f8de881693cee5d369da1970"));
const getGlobalReminderSoundSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("c335a3a00eb993a229afef995edf4e3963b4bd473c9941f08e101653728fd7d4"));
const saveGlobalReminderSoundSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  enabled: boolean().optional(),
  tone: _enum(["chime", "bell", "digital_ring", "radar", "soft_ping", "custom"]).optional(),
  volume: number().min(0).max(1).optional(),
  desktopNotifications: boolean().optional(),
  customAudioUrl: string().nullable().optional(),
  customAudioName: string().nullable().optional()
}).parse(raw)).handler(createSsrRpc("201f54cd7aabf113779c43ab955d6bc24f45dd0f00fa24c64eb0b1269d7f9fbb"));
const uploadAlertAudioFile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  fileName: string().min(1),
  base64Data: string().min(1),
  target: _enum(["reminder", "lead", "order"]).default("reminder")
}).parse(raw)).handler(createSsrRpc("0fb215fd36771cff8bd0927e5d92970fa4faf1e918647c3ee5f03a34717f96bb"));
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
}).parse(raw)).handler(createSsrRpc("42f88baefd7ff2ad854b29ca2ba0a4823e83346307afd84b3517d9b392f998b5"));
const DEFAULT_CALLBACK_PRESET_CONFIG = {
  quickMinutes: 60,
  recommendedHours: 2,
  afternoonHours: 3,
  beforeShiftEndHours: 4,
  tomorrowDefaultTime: "10:30"
};
const getCallbackReminderPresetSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("11ee5a37c80fbe9002e3d8fc8b7ce9a5ed86b8aea4f74e966e7ae36be8ef52f2"));
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
})).parse(raw)).handler(createSsrRpc("a04d5285dce31da0f52dfbf943c2d8c015900c3e5bf5bb9cbc3323c6104bd1d0"));
export {
  DEFAULT_CALLBACK_PRESET_CONFIG as D,
  getAppSettings as a,
  getCallbackReminderPresetSettings as b,
  updateCustomerDelayAutocloseMinutes as c,
  updateSoundSettings as d,
  saveCallbackReminderPresetSettings as e,
  getGlobalReminderSoundSettings as g,
  saveGlobalReminderSoundSettings as s,
  uploadAlertAudioFile as u
};
