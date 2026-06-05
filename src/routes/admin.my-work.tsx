import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/my-work")({
  head: () => ({ meta: [{ title: "My Work — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <ComingSoon
      title="My Work"
      subtitle="Your personal queue — assigned applications, pending reviews, SLA warnings and follow-ups."
      phase="5.5b"
      fallbackHref="/admin/applications"
      fallbackLabel="the Application Queue"
    />
  ),
});
