export async function uploadToStorageUrl(
  signedUrl: string,
  file: Blob,
  contentType = file.type || "application/octet-stream",
): Promise<void> {
  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Storage upload failed (${response.status} ${response.statusText}).`);
  }
}
