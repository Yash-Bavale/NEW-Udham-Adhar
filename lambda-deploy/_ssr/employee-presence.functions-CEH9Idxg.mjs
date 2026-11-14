import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, n as number, a as array, s as string, b as boolean, _ as _enum } from "../_libs/zod.mjs";
let defaultShiftsConfig = [{
  id: "shift_alpha",
  name: "Shift Alpha (Morning)",
  code: "ALPHA",
  startTime: "09:00",
  endTime: "18:00",
  lunchStart: "13:00",
  lunchEnd: "14:00",
  graceMins: 15,
  isDefault: true,
  assignedUsers: []
}, {
  id: "shift_beta",
  name: "Shift Beta (Afternoon)",
  code: "BETA",
  startTime: "13:00",
  endTime: "22:00",
  lunchStart: "17:00",
  lunchEnd: "18:00",
  graceMins: 15,
  isDefault: false,
  assignedUsers: []
}, {
  id: "shift_general",
  name: "General Shift",
  code: "GEN",
  startTime: "10:00",
  endTime: "19:00",
  lunchStart: "13:30",
  lunchEnd: "14:30",
  graceMins: 15,
  isDefault: false,
  assignedUsers: []
}];
let presenceThresholdsConfig = {
  idleThresholdMins: 5,
  awayThresholdMins: 15,
  heartbeatIntervalSeconds: 30,
  sessionTimeoutHours: 9
};
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1),
  presenceStatus: _enum(["ACTIVE", "IDLE", "AWAY", "OFFLINE"]),
  currentPage: string().default("/admin"),
  currentModule: string().default("General"),
  currentOrderId: string().uuid().nullable().optional(),
  currentOrderCode: string().nullable().optional(),
  lastActionText: string().nullable().optional(),
  activeSecondsDelta: number().int().nonnegative().default(0),
  idleSecondsDelta: number().int().nonnegative().default(0),
  awaySecondsDelta: number().int().nonnegative().default(0),
  browser: string().default("Chrome"),
  os: string().default("Windows"),
  deviceType: string().default("Desktop"),
  ipAddress: string().default("103.21.58.92")
}).parse(i)).handler(createSsrRpc("da95e61acc686cd20bd84b5eed2adf2f95b79fdfa5f78a3a041f273ac2808343"));
const getActiveEmployeeSessions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("c303d2dceac601ba4f32a3631e352bde9e7e435dd80df41662ccbb8887c5c7d2"));
const terminateEmployeeSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1),
  employeeId: string().optional()
}).parse(i)).handler(createSsrRpc("f654f70eb23067e21a19e470fa33b8c580e53aa9dfda6c57455582801bbde8d6"));
const getShiftSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("522a414446fd9cca7c23dc89eaf4407087ae52b4f33356a2ef72467e7135c624"));
const saveShiftSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  shifts: array(object({
    id: string(),
    name: string().min(1),
    code: string().min(1),
    startTime: string().min(1),
    endTime: string().min(1),
    lunchStart: string().min(1),
    lunchEnd: string().min(1),
    graceMins: number().int().min(0).max(60).default(15),
    isDefault: boolean().default(false),
    assignedUsers: array(string()).default([])
  })),
  thresholds: object({
    idleThresholdMins: number().int().min(1).max(60).default(5),
    awayThresholdMins: number().int().min(2).max(120).default(15),
    heartbeatIntervalSeconds: number().int().min(10).max(120).default(30),
    sessionTimeoutHours: number().int().min(1).max(24).default(9)
  })
}).parse(i)).handler(createSsrRpc("cba23f4c161ec765ece2bfad3d69c8d9a2aa009e6022c785e07b42bb5d3c2664"));
function getEmployeePresenceState(employeeId) {
  const assignedShift = defaultShiftsConfig.find((s) => s.assignedUsers.includes(employeeId) || s.isDefault);
  return {
    session: null,
    shift: assignedShift || defaultShiftsConfig[0],
    thresholds: presenceThresholdsConfig
  };
}
export {
  getShiftSettings as a,
  getActiveEmployeeSessions as b,
  getEmployeePresenceState as g,
  saveShiftSettings as s,
  terminateEmployeeSession as t
};
