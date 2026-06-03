import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { assertRole } from "@/lib/audit";

export const getApplicationDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ applicationId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin", "support"]);
    
    const { data: app, error } = await supabaseAdmin
      .from("applications")
      .select("*, lead:leads(*), certificates(*)")
      .eq("id", data.applicationId)
      .single();

    if (error || !app) throw new Error("Application not found");

    return { 
      application: app,
      lead: app.lead,
      certificates: app.certificates || []
    };
  });
