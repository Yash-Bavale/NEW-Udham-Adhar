/**
 * Render an HTML document to A4 PDF through the app's configured HTML renderer.
 * Kept behind a server-only module so dispute generation never leaks internals.
 */
export async function renderHtmlToPdf(html: string): Promise<Uint8Array> {
  const endpoint = process.env.HTML_PDF_RENDER_URL;
  const token = process.env.HTML_PDF_RENDER_TOKEN;

  if (!endpoint || !token) {
    throw new Error("Exact email PDF rendering is not configured");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html, format: "A4", printBackground: true }),
  });

  if (!response.ok) {
    throw new Error(`Exact email PDF rendering failed (${response.status})`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/pdf")) {
    throw new Error("Exact email PDF renderer returned an invalid file");
  }

  return new Uint8Array(await response.arrayBuffer());
}