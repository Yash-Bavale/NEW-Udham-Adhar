import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/audio/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = String(params._splat || "").trim();
        if (!splat || splat.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        // Containment: only flat reminder-sound files are served. No folders,
        // no other buckets, no call recordings.
        const name = splat.startsWith("audio/") ? splat.slice(6) : splat;
        if (!/^[A-Za-z0-9._-]{1,120}\.(mp3|wav|ogg|m4a|aac)$/.test(name) || name.startsWith(".")) {
          return new Response("Not found", { status: 404 });
        }
        const path = `audio/${name}`;

        try {
          const { downloadStorageObject, isStorageObjectNotFound } = await import("@/lib/storage/s3.server");
          let data: Uint8Array;
          try {
            data = await downloadStorageObject("documents", path);
          } catch (error) {
            if (isStorageObjectNotFound(error)) {
              return new Response("Audio file not found", { status: 404 });
            }
            throw error;
          }

          let contentType = "audio/mpeg";
          if (path.endsWith(".wav")) contentType = "audio/wav";
          else if (path.endsWith(".ogg")) contentType = "audio/ogg";
          else if (path.endsWith(".m4a")) contentType = "audio/mp4";
          else if (path.endsWith(".aac")) contentType = "audio/aac";

          const body = new ArrayBuffer(data.byteLength);
          new Uint8Array(body).set(data);
          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400, immutable",
              "Accept-Ranges": "bytes",
            },
          });
        } catch (err) {
          console.error("[AudioRoute] error serving audio:", err);
          return new Response("Internal server error", { status: 500 });
        }
      },
    },
  },
});
