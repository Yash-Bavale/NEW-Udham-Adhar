import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SeoPage = {
  id: string;
  slug: string;
  label: string;
  enabled: boolean;
  sort_order: number;
  page_type?: string;
};

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

/** Public — used by footer triple-click to render the hidden link list.
 *  Scoped to the current host's website so a secondary site never lists the
 *  primary site's SEO pages. */
export const listPublicSeoPages = createServerFn({ method: "GET" }).handler(
  async (): Promise<SeoPage[]> => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const { resolveCurrentWebsite } = await import("@/lib/websites/current-website.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const site = await resolveCurrentWebsite(getRequest());
    const { data, error } = await supabaseAdmin
      .from("seo_pages")
      .select("id, slug, label, enabled, sort_order, page_type")
      .eq("enabled", true)
      .eq("website_id", site.id)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as SeoPage[];
  },
);

/** Admin — full list including disabled rows. */
export const listAllSeoPages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SeoPage[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("seo_pages")
      .select("id, slug, label, enabled, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as SeoPage[];
  });

const UpsertInput = z.object({
  id: z.string().uuid().optional(),
  website_id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  label: z.string().trim().min(1).max(200),
  enabled: z.boolean(),
  sort_order: z.number().int().min(0).max(100000),
});

export const upsertSeoPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => UpsertInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("seo_pages")
        .update({
          slug: data.slug,
          label: data.label,
          enabled: data.enabled,
          sort_order: data.sort_order,
          ...(data.website_id ? { website_id: data.website_id } : {}),
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      let websiteId = data.website_id;
      if (!websiteId) {
        const { data: site, error: sErr } = await supabaseAdmin
          .from("websites")
          .select("id")
          .eq("is_primary", true)
          .maybeSingle();
        if (sErr) throw new Error(sErr.message);
        if (!site) throw new Error("No primary website configured");
        websiteId = site.id;
      }
      const { error } = await supabaseAdmin.from("seo_pages").insert({
        website_id: websiteId,
        slug: data.slug,
        label: data.label,
        enabled: data.enabled,
        sort_order: data.sort_order,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });



export const deleteSeoPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("seo_pages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });
