import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/review")({
  head: () => ({ meta: [{ title: "Document Review — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <ComingSoon
      title="Document Review Center"
      subtitle="KYC-style three-pane reviewer: form on the left, document viewer in the centre, approve / reject / re-request on the right."
      phase="5.5d"
      fallbackHref="/admin/submissions"
      fallbackLabel="the existing submissions list"
    />
  ),
});
