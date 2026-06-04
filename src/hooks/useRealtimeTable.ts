import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Subscribe to postgres_changes for a table. Calls onChange on any INSERT/UPDATE/DELETE. */
export function useRealtimeTable(
  table: string,
  onChange: () => void,
  opts?: { filter?: string; schema?: string }
) {
  useEffect(() => {
    const schema = opts?.schema ?? "public";
    const channel = supabase
      .channel(`rt:${schema}:${table}:${opts?.filter ?? "all"}`)
      .on(
        "postgres_changes" as never,
        { event: "*", schema, table, ...(opts?.filter ? { filter: opts.filter } : {}) },
        () => onChange()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, opts?.filter, opts?.schema]);
}
