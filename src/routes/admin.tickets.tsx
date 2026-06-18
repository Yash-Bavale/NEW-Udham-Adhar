import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/tickets")({
  head: () => ({ meta: [{ title: "Support Tickets — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <ComingSoon
      title="Support Tickets"
      subtitle="Inbound customer issues with priority, SLA timers and assignment."
      phase="next"
      fallbackHref="/admin/complaints"
      fallbackLabel="Complaints"
    />
  ),
});
