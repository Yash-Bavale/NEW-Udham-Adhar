import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, s as string, _ as _enum, b as boolean } from "../_libs/zod.mjs";
const listTasks = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  scope: _enum(["mine", "all"]).default("all"),
  includeCompleted: boolean().default(false)
}).parse(i ?? {})).handler(createSsrRpc("1848a71e04596285318dde3ccacc82e72288aec67f4c203a610ce51262284ac7"));
const listStaffForAssignment = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a7b4c46095556f0116bb77c34a6e2cf10ea985c5f8485b8b5451a77becb12970"));
const searchLeadOptions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  q: string().default("")
}).parse(i ?? {})).handler(createSsrRpc("dd21c7df0c60d6dbd86d9b9ffca5a8cc14d93af9804b4b08d5c550d88ff01f07"));
const searchOrderOptions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  q: string().default(""),
  leadId: string().uuid().optional()
}).parse(i ?? {})).handler(createSsrRpc("7cb3f5133c671bca070b4e49874fb2b6ccbbc6483b0e35deed28ea85af65d8be"));
const createTask = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  title: string().trim().min(2).max(200),
  description: string().trim().max(2e3).optional(),
  assignedTo: string().uuid().nullable().optional(),
  dueAt: string().min(1),
  // ISO from datetime-local
  priority: _enum(["high", "medium", "low"]).default("medium"),
  leadId: string().uuid().nullable().optional(),
  applicationId: string().uuid().nullable().optional()
}).parse(i)).handler(createSsrRpc("7e4b354f22d1c5649b79d4fd3c6b414771cafbdbb47379f19891014b54ac66ff"));
const completeTask = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  completed: boolean().default(true)
}).parse(i)).handler(createSsrRpc("2e49731f2bbda08b56210775b2ac850640b990e9107b80a623a0d029e7018c85"));
export {
  listTasks as a,
  createTask as b,
  completeTask as c,
  searchOrderOptions as d,
  listStaffForAssignment as l,
  searchLeadOptions as s
};
