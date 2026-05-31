import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
});

export const upsertService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ServiceInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    if (data.id) {
      const { id, ...patch } = data;
      const { error } = await supabase.from("services").update(patch).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("services").insert(data);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
