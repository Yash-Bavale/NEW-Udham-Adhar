import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, s as string, _ as _enum, n as number, b as boolean } from "../_libs/zod.mjs";
const listWebsiteTree = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("2e8e433cba710bd402580f2ab9a83ea0c65bf3aa3c0bf641656c1ba4134233e3"));
const WebsiteInput = object({
  id: string().uuid().optional(),
  name: string().trim().min(2).max(160),
  domain: string().trim().min(3).max(255).regex(/^[a-z0-9.-]+$/i, "Domain must contain only letters, digits, dots and hyphens"),
  description: string().trim().max(2e3).nullable().optional(),
  is_active: boolean().default(true),
  allow_admin: boolean().default(true),
  sort_order: number().int().min(0).max(1e4).default(0),
  contentful_space_id: string().trim().max(64).regex(/^[a-z0-9]*$/i, "Space ID must be letters and digits only").nullable().optional(),
  contentful_delivery_token_secret: _enum(["CONTENTFUL_API_KEY", "CONTENTFUL_API_KEY_1", "CONTENTFUL_API_KEY_2"]).nullable().optional(),
  sanity_project_id: string().trim().max(64).regex(/^[a-z0-9]*$/i, "Project ID must be letters and digits only").nullable().optional(),
  sanity_dataset: string().trim().max(64).regex(/^[a-z0-9_-]*$/i, "Dataset must be letters, digits, hyphens or underscores").nullable().optional()
});
const upsertWebsite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => WebsiteInput.parse(i)).handler(createSsrRpc("439b8ec582a43e2d1cea21dc8af8d1269508bfdfea6b8c8373058d2e6b08beec"));
const deleteWebsite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("9f763d14b4f9ae67924e7de3a0e16536f6eddd6453b622f9639f7ca49a138931"));
const CategoryInput = object({
  id: string().uuid().optional(),
  website_id: string().uuid(),
  name: string().trim().min(2).max(160),
  is_active: boolean().default(true),
  sort_order: number().int().min(0).max(1e4).default(0)
});
const upsertServiceCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CategoryInput.parse(i)).handler(createSsrRpc("4de833c750b74d4faeb919bac83319e1848132e194a419fd17103beb382a3876"));
const deleteServiceCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("5f55277b1e64a5b9fca765909b97aa75f06bcf0396a18cda68f259ecde643141"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  service_id: string().uuid(),
  website_id: string().uuid(),
  category_id: string().uuid().nullable().optional()
}).parse(i)).handler(createSsrRpc("0858cacc1c8ca3db6082d341b317e6ea70e061e492268385503dd8d0cec430a3"));
export {
  upsertServiceCategory as a,
  deleteServiceCategory as b,
  deleteWebsite as d,
  listWebsiteTree as l,
  upsertWebsite as u
};
