import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <ComingSoon
      title="Tasks"
      subtitle="Real task engine — verify info, verify docs, generate certificates, customer follow-ups, custom tasks."
      phase="5.5f"
      fallbackHref="/admin/complaints"
      fallbackLabel="the complaints workspace"
    />
  ),
});
