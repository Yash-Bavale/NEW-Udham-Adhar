import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function check() {
  const { data, error } = await (supabaseAdmin as any)
    .from("support_ticket_folders")
    .select("id")
    .limit(1);

  console.log("Query support_ticket_folders result:", { data, error });
}

check();
