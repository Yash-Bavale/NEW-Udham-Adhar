// Reason picker source — returns 14 close reasons + their standard replies.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type OrderCloseReason = {
  id: string;
  category: "A" | "B" | "C" | string;
  number: number;
  label: string;
  standard_reply: string | null;
  sort_order: number;
};

export const listCloseReasons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("list_order_close_reasons");
    if (error) throw new Error(error.message);
    return (data ?? []) as OrderCloseReason[];
  });
