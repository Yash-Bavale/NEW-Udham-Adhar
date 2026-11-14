import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const RequestSchema = z.object({
  application_id: z.string().uuid(),
  reason: z.string().optional(),
  keep_document_id: z.string().uuid().optional().nullable(),
});

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

export const Route = createFileRoute("/api/internal/delete-order-documents")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
        const cronSecret = process.env.CRON_SECRET ?? "";
        const authorization = request.headers.get("authorization") ?? "";
        const bearer = authorization.toLowerCase().startsWith("bearer ")
          ? authorization.slice(7).trim()
          : "";
        const apiKey = request.headers.get("apikey") ?? "";
        const authorized =
          (!!serviceKey && (bearer === serviceKey || apiKey === serviceKey)) ||
          (!!cronSecret && (bearer === cronSecret || apiKey === cronSecret));
        if (!authorized) return jsonResponse({ error: "unauthorized" }, 401);

        let payload: z.infer<typeof RequestSchema>;
        try {
          payload = RequestSchema.parse(await request.json());
        } catch {
          return jsonResponse({ error: "Invalid request payload." }, 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: documents, error: listError } = await supabaseAdmin
          .from("documents")
          .select("id, file_path, doc_type")
          .eq("application_id", payload.application_id);
        if (listError) return jsonResponse({ error: listError.message }, 500);

        const toDelete = (documents ?? []).filter((document) => {
          if (payload.keep_document_id && document.id === payload.keep_document_id) return false;
          return String(document.doc_type ?? "").toLowerCase() !== "certificate";
        });
        const paths = toDelete.map((document) => document.file_path).filter(Boolean);
        const ids = toDelete.map((document) => document.id);

        if (paths.length) {
          const { deleteStorageObjects } = await import("@/lib/storage/s3.server");
          await deleteStorageObjects("documents", paths);
        }

        if (ids.length) {
          const { error: deleteError } = await supabaseAdmin
            .from("documents")
            .delete()
            .in("id", ids);
          if (deleteError) return jsonResponse({ error: deleteError.message }, 500);
        }

        const { error: updateError } = await supabaseAdmin
          .from("applications")
          .update({
            documents_deleted_at: new Date().toISOString(),
            documents_deleted_reason: payload.reason ?? "refund",
          })
          .eq("id", payload.application_id);
        if (updateError) return jsonResponse({ error: updateError.message }, 500);

        return jsonResponse({
          ok: true,
          storage_deleted: paths.length,
          rows_deleted: ids.length,
          reason: payload.reason ?? "refund",
        });
      },
    },
  },
});
