import { createFileRoute, redirect } from "@tanstack/react-router";

// Temporary: SEO admin currently lives at /seo-admin with its own auth gate.
// 5.5h will fully fold the SEO admin UI into the AdminShell.
export const Route = createFileRoute("/admin/seo")({
  beforeLoad: () => {
    throw redirect({ to: "/seo-admin" });
  },
});
