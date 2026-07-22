import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole } from "@/lib/audit";

export const listServices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

// Public: active service codes for the website lead form.
export const listActiveServiceCodes = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("service_code")
    .eq("is_active", true);
  if (error) throw new Error(error.message);
  return { codes: (data ?? []).map((r) => r.service_code as string) };
});

const ServiceInput = z.object({
  id: z.string().uuid().optional(),
  service_code: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  service_name: z.string().trim().min(2).max(160),
  description: z.string().max(2000).nullable().optional(),
  base_amount: z.number().min(0).max(1_000_000),
  gst_amount: z.number().min(0).max(1_000_000),
  total_amount: z.number().min(0).max(1_000_000),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(10_000).default(0),
  govt_portal_url: z.string().trim().max(1000).nullable().optional(),
  website_id: z.string().uuid().optional(),
  category_id: z.string().uuid().nullable().optional(),
});

export const upsertService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ServiceInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    await assertRole(supabase, ["super_admin", "admin"]);
    if (data.id) {
      const { id, ...patch } = data;
      const { error } = await supabase.from("services").update(patch).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      let website_id = data.website_id;
      if (!website_id) {
        const { getDefaultWebsiteId } = await import("@/lib/websites/default-website.server");
        website_id = await getDefaultWebsiteId();
      }
      const { error } = await supabase.from("services").insert({ ...data, website_id });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });


export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    await assertRole(supabase, ["super_admin", "admin"]);
    const { error } = await supabase.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
