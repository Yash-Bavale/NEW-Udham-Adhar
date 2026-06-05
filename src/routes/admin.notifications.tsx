import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <ComingSoon
      title="Notification Center"
      subtitle="Real-time alerts: new leads, payment success, document uploads, certificate delivery, assignments, SLA breaches."
      phase="5.5b"
      fallbackHref="/admin/activity"
      fallbackLabel="the Activity Log"
    />
  ),
});
