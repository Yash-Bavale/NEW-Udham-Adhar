import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/whatsapp-templates")({
  head: () => ({ meta: [{ title: "WhatsApp Templates — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <ComingSoon
      title="WhatsApp Templates"
      subtitle="Approved message templates for payment, documents, service updates."
      phase="next"
      fallbackHref="/admin/emails"
      fallbackLabel="Email Center"
    />
  ),
});
