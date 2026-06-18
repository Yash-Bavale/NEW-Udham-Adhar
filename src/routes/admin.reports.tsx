import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <ComingSoon
      title="Reporting Dashboard"
      subtitle="Service revenue, conversion funnel and employee performance over a date range."
      phase="next"
      fallbackHref="/admin/dashboard"
      fallbackLabel="the Executive Dashboard"
    />
  ),
});
