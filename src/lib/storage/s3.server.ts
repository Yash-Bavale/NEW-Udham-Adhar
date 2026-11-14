import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FetchHttpHandler, streamCollector } from "@smithy/fetch-http-handler";

export type StorageBucket = "documents" | "invoices" | "form-assets";

const STORAGE_BUCKETS: readonly StorageBucket[] = ["documents", "invoices", "form-assets"];
const MAX_DELETE_KEYS = 1000;
const MAX_PRESIGNED_URL_SECONDS = 7 * 24 * 60 * 60;
const DEFAULT_PRESIGNED_URL_SECONDS = 15 * 60;
const S3_BUCKET_NAME_PATTERN = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;

function isValidS3BucketName(bucketName: string): boolean {
  return (
    S3_BUCKET_NAME_PATTERN.test(bucketName) &&
    !bucketName.includes("..") &&
    !bucketName.includes(".-") &&
    !bucketName.includes("-.") &&
    !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(bucketName) &&
    !bucketName.startsWith("xn--") &&
    !bucketName.startsWith("sthree-") &&
    !bucketName.endsWith("-s3alias") &&
    !bucketName.endsWith("--ol-s3")
  );
}

function getStorageConfig(): { client: S3Client; bucketName: string } {
  const bucketName = process.env.S3_BUCKET || "udyamadhar-storage";
  if (!isValidS3BucketName(bucketName)) {
    throw new Error("Invalid S3_BUCKET environment variable.");
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY environment variable.");
  }

  return {
    bucketName,
    client: new S3Client({
      region: process.env.AWS_REGION || "ap-south-1",
      credentials: { accessKeyId, secretAccessKey },
      requestHandler: new FetchHttpHandler(),
      streamCollector,
    }),
  };
}

function decodePathSegmentForValidation(segment: string): string {
  let decoded = segment;
  for (let depth = 0; depth < 8; depth += 1) {
    let next: string;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      return decoded;
    }

    if (next === decoded) return decoded;
    decoded = next;
    if (depth === 7) throw new Error("Invalid storage object path.");
  }

  return decoded;
}

function containsControlCharacters(value: string): boolean {
  return Array.from(value).some((character) => {
    const code = character.codePointAt(0) ?? 0;
    return code <= 0x1f || (code >= 0x7f && code <= 0x9f);
  });
}

export function getStorageObjectKey(bucket: StorageBucket, filePath: string): string {
  if (!STORAGE_BUCKETS.includes(bucket)) {
    throw new Error("Invalid storage bucket.");
  }
  if (typeof filePath !== "string") {
    throw new Error("Invalid storage object path.");
  }
  if (containsControlCharacters(filePath)) {
    throw new Error("Invalid storage object path.");
  }

  const normalizedPath = filePath.trim().replace(/^\/+/, "");
  const segments = normalizedPath.split("/");
  if (
    !normalizedPath ||
    segments.some((segment) => {
      const decodedSegment = decodePathSegmentForValidation(segment);
      return (
        !segment ||
        decodedSegment === "." ||
        decodedSegment === ".." ||
        decodedSegment.includes("/") ||
        decodedSegment.includes("\\") ||
        containsControlCharacters(segment) ||
        containsControlCharacters(decodedSegment)
      );
    })
  ) {
    throw new Error("Invalid storage object path.");
  }

  const objectKey = `${bucket}/${normalizedPath}`;
  if (new TextEncoder().encode(objectKey).byteLength > 1024) {
    throw new Error("Storage object path exceeds the S3 key length limit.");
  }

  return objectKey;
}

function validatePresignedUrlExpiry(expiresIn: number): number {
  if (!Number.isSafeInteger(expiresIn) || expiresIn < 1 || expiresIn > MAX_PRESIGNED_URL_SECONDS) {
    throw new Error("Presigned URL expiry must be between 1 second and 7 days.");
  }
  return expiresIn;
}

export async function uploadStorageObject(params: {
  bucket: StorageBucket;
  path: string;
  body: PutObjectCommandInput["Body"];
  contentType?: string;
  cacheControl?: string;
}): Promise<void> {
  const key = getStorageObjectKey(params.bucket, params.path);
  const { client, bucketName } = getStorageConfig();
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: params.body,
      ContentType: params.contentType,
      CacheControl: params.cacheControl,
    }),
  );
}

export async function createStorageDownloadUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn = DEFAULT_PRESIGNED_URL_SECONDS,
): Promise<string> {
  const key = getStorageObjectKey(bucket, path);
  const expiry = validatePresignedUrlExpiry(expiresIn);
  const { client, bucketName } = getStorageConfig();

  return getSignedUrl(client, new GetObjectCommand({ Bucket: bucketName, Key: key }), {
    expiresIn: expiry,
  });
}

export async function createStorageUploadUrl(params: {
  bucket: StorageBucket;
  path: string;
  contentType: string;
  expiresIn?: number;
}): Promise<string> {
  const key = getStorageObjectKey(params.bucket, params.path);
  const expiry = validatePresignedUrlExpiry(params.expiresIn ?? DEFAULT_PRESIGNED_URL_SECONDS);
  const { client, bucketName } = getStorageConfig();

  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: params.contentType,
    }),
    { expiresIn: expiry },
  );
}

export async function deleteStorageObjects(bucket: StorageBucket, paths: string[]): Promise<void> {
  const keys = paths.map((path) => ({ Key: getStorageObjectKey(bucket, path) }));
  if (!keys.length) return;

  const { client, bucketName } = getStorageConfig();
  for (let offset = 0; offset < keys.length; offset += MAX_DELETE_KEYS) {
    const result = await client.send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: keys.slice(offset, offset + MAX_DELETE_KEYS),
          Quiet: true,
        },
      }),
    );
    if (result.Errors?.length) {
      throw new Error(`Failed to delete ${result.Errors.length} S3 storage object(s).`);
    }
  }
}

export async function deleteStorageObject(bucket: StorageBucket, path: string): Promise<void> {
  await deleteStorageObjects(bucket, [path]);
}

export async function copyStorageObject(params: {
  sourceBucket: StorageBucket;
  sourcePath: string;
  destinationBucket: StorageBucket;
  destinationPath: string;
}): Promise<void> {
  const sourceKey = getStorageObjectKey(params.sourceBucket, params.sourcePath);
  const destinationKey = getStorageObjectKey(params.destinationBucket, params.destinationPath);
  const { client, bucketName } = getStorageConfig();
  const copySource = `${bucketName}/${sourceKey.split("/").map(encodeURIComponent).join("/")}`;

  await client.send(
    new CopyObjectCommand({
      Bucket: bucketName,
      Key: destinationKey,
      CopySource: copySource,
    }),
  );
}

export async function downloadStorageObject(
  bucket: StorageBucket,
  path: string,
): Promise<Uint8Array> {
  const key = getStorageObjectKey(bucket, path);
  const { client, bucketName } = getStorageConfig();
  const { Body } = await client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
  if (!Body) throw new Error("S3 returned an empty storage object.");
  return new Uint8Array(await Body.transformToByteArray());
}

export function isStorageObjectNotFound(error: unknown): boolean {
  return error instanceof Error && (error.name === "NoSuchKey" || error.name === "NotFound");
}
