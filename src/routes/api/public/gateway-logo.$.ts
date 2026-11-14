import { createFileRoute } from "@tanstack/react-router";

const LOGO_PATH = /^gateway-logos\/[0-9a-f-]{36}-\d+\.(?:png|jpe?g|gif|webp)$/i;

export const Route = createFileRoute("/api/public/gateway-logo/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = String((params as { _splat?: string })._splat || "").trim();
        if (!LOGO_PATH.test(path)) {
          return new Response("Not found", { status: 404 });
        }

        const { createStorageDownloadUrl } = await import("@/lib/storage/s3.server");
        const signedUrl = await createStorageDownloadUrl("documents", path, 600);
        return new Response(null, {
          status: 302,
          headers: {
            Location: signedUrl,
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
