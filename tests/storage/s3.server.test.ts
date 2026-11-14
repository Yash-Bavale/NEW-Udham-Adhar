import { describe, expect, it } from "vitest";
import {
  createStorageDownloadUrl,
  getStorageObjectKey,
  type StorageBucket,
} from "@/lib/storage/s3.server";

describe("S3 object key mapping", () => {
  it("uses the configured prefix for each logical storage bucket", () => {
    expect(getStorageObjectKey("documents", "orders/123/file.pdf")).toBe(
      "documents/orders/123/file.pdf",
    );
    expect(getStorageObjectKey("invoices", "2026/invoice.pdf")).toBe("invoices/2026/invoice.pdf");
    expect(getStorageObjectKey("form-assets", "gst/sample.pdf")).toBe("form-assets/gst/sample.pdf");
  });

  it("rejects invalid buckets and unsafe object paths", () => {
    expect(() => getStorageObjectKey("invalid" as StorageBucket, "file.pdf")).toThrow(
      "Invalid storage bucket.",
    );

    for (const path of [
      "",
      "../private.txt",
      "folder/../private.txt",
      "folder//file.pdf",
      "%2e%2e/private.txt",
      "folder%2f..%2fprivate.txt",
      "folder\\private.txt",
      `folder/${String.fromCharCode(0)}file.txt`,
    ]) {
      expect(() => getStorageObjectKey("documents", path)).toThrow("Invalid storage object path.");
    }
  });

  it("rejects object keys that exceed S3's maximum key length", () => {
    expect(() => getStorageObjectKey("documents", "a".repeat(1024))).toThrow(
      "Storage object path exceeds the S3 key length limit.",
    );
  });

  it("limits presigned URL expiry to S3's supported range", async () => {
    await expect(createStorageDownloadUrl("documents", "file.pdf", 0)).rejects.toThrow(
      "Presigned URL expiry must be between 1 second and 7 days.",
    );
    await expect(
      createStorageDownloadUrl("documents", "file.pdf", 7 * 24 * 60 * 60 + 1),
    ).rejects.toThrow("Presigned URL expiry must be between 1 second and 7 days.");
  });

  it("rejects an invalid configured S3 bucket name", async () => {
    const previousBucket = process.env.S3_BUCKET;
    process.env.S3_BUCKET = "invalid/bucket";

    try {
      await expect(createStorageDownloadUrl("documents", "file.pdf")).rejects.toThrow(
        "Invalid S3_BUCKET environment variable.",
      );
    } finally {
      if (previousBucket === undefined) {
        delete process.env.S3_BUCKET;
      } else {
        process.env.S3_BUCKET = previousBucket;
      }
    }
  });
});
