import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, s as string, b as boolean, n as number } from "../_libs/zod.mjs";
const listCannedResponses = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  activeOnly: boolean().default(false),
  category: string().optional()
}).parse(i ?? {})).handler(createSsrRpc("37c656f57d1d1c6a759771d425548dbc040e60e526bf500057efb4875e1312e1"));
const createCannedResponse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  title: string().trim().min(2).max(100),
  body: string().trim().min(2).max(8e3),
  category: string().trim().max(50).optional(),
  sort_order: number().int().min(0).default(0),
  is_active: boolean().default(true)
}).parse(i)).handler(createSsrRpc("3cbf4afcd8a68e686caf817245b6a2b81485697d3d4d0a8d3163d94b945b7562"));
const updateCannedResponse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  title: string().trim().min(2).max(100).optional(),
  body: string().trim().min(2).max(8e3).optional(),
  category: string().trim().max(50).nullable().optional(),
  sort_order: number().int().min(0).optional(),
  is_active: boolean().optional()
}).parse(i)).handler(createSsrRpc("6de72b3689721a7d175e2b0854746cc92c3c581cb89aa196d336470dc7f3afa3"));
const deleteCannedResponse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("af4259d0703d838f4e2a4de7bf83bd244dff09349ac5961c5c1dcee10706dd58"));
export {
  createCannedResponse as c,
  deleteCannedResponse as d,
  listCannedResponses as l,
  updateCannedResponse as u
};
