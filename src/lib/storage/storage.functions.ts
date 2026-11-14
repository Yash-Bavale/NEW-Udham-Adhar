import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole } from "@/lib/audit";

export const requestFormAssetUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        serviceCode: z
          .string()
          .trim()
          .min(2)
          .max(80)
          .regex(/^[a-z0-9-]+$/),
        fileName: z.string().trim().min(1).max(200),
        contentType: z.string().trim().min(1).max(120),
        sizeBytes: z
          .number()
          .int()
          .min(1)
          .max(15 * 1024 * 1024),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin"]);
    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
    const path = `${data.serviceCode}/${Date.now()}-${safeName}`;
    const { createStorageUploadUrl } = await import("@/lib/storage/s3.server");
    const signedUrl = await createStorageUploadUrl({
      bucket: "form-assets",
      path,
      contentType: data.contentType,
    });

    return { path, signedUrl };
  });
