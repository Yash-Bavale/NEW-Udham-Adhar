import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/form-asset/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = String((params as { _splat?: string })._splat || "").trim();
        if (!splat || splat.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const { createStorageDownloadUrl } = await import("@/lib/storage/s3.server");
        const signedUrl = await createStorageDownloadUrl("form-assets", splat, 60 * 10);
        return new Response(null, {
          status: 302,
          headers: { Location: signedUrl, "Cache-Control": "no-store" },
        });
      },
    },
  },
});
