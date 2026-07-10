// Thin serverFn wrappers around the workflow engine.
// Callable from client code and admin UI.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { WorkflowEvent } from "./events";

const EventInput = z.object({
  applicationId: z.string().uuid(),
  event: z.any(), // typed union enforced at call sites
});

export const dispatchWorkflowEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => EventInput.parse(i))
  .handler(async ({ data, context }) => {
    const { dispatchEvent } = await import("./engine.server");
    const evt = { ...(data.event as object), applicationId: data.applicationId } as WorkflowEvent;
    const next = await dispatchEvent(evt, context.userId);
    return next;
  });

export const getWorkflowState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ applicationId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const [state, timers, automations, events] = await Promise.all([
      context.supabase.from("workflow_states").select("*").eq("application_id", data.applicationId).maybeSingle(),
      context.supabase.from("workflow_timers").select("*").eq("application_id", data.applicationId).in("status", ["running", "paused"]),
      context.supabase.from("workflow_automations").select("*").eq("application_id", data.applicationId).in("status", ["running", "paused"]),
      context.supabase.from("workflow_events").select("*").eq("application_id", data.applicationId).order("created_at", { ascending: false }).limit(200),
    ]);
    return {
      state: state.data,
      timers: timers.data ?? [],
      automations: automations.data ?? [],
      events: events.data ?? [],
    };
  });
