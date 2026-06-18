import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <ComingSoon
      title="Settings"
      subtitle="Company info, status master, notifications and payment gateway connections."
      phase="next"
      fallbackHref="/admin/gateways"
      fallbackLabel="Payment Gateways"
    />
  ),
});
