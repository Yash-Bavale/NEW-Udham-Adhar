import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/documents")({
  head: () => ({ meta: [{ title: "Documents — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <ComingSoon
      title="Document Management"
      subtitle="Global view of every customer document — preview, version history, expiry tracking."
      phase="next"
      fallbackHref="/admin/review"
      fallbackLabel="Document Review queue"
    />
  ),
});
