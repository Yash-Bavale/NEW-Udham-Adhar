import { c as createClient } from "../_libs/sanity__client.mjs";
import "../_libs/get-it.mjs";
import "../_libs/undici.mjs";
import "node:assert";
import "node:net";
import "node:querystring";
import "node:events";
import "node:diagnostics_channel";
import "node:tls";
import "node:buffer";
import "node:zlib";
import "node:perf_hooks";
import "node:util/types";
import "node:sqlite";
import "node:worker_threads";
import "node:console";
import "node:fs/promises";
import "node:timers";
import "node:dns";
import "node:http";
import "node:stream";
import "node:util";
import "node:crypto";
import "node:url";
import "node:async_hooks";
import "node:path";
import "../_libs/rxjs.mjs";
import "../_libs/obug.mjs";
import "node:tty";
import "../_libs/eventsource.mjs";
import "../_libs/eventsource-parser.mjs";
const SANITY_API_VERSION = "2024-01-01";
const DEFAULT_SANITY_PROJECT_ID = "519jq1ws";
const DEFAULT_SANITY_DATASET = "production";
const HOST_DATASETS = {
  "udyamadhar.in": "production",
  "udyamregistrations.in": "udyamregistrations"
};
const clients = /* @__PURE__ */ new Map();
function getClient({ projectId, dataset }) {
  const key = `${projectId}:${dataset}`;
  let client = clients.get(key);
  if (!client) {
    client = createClient({
      projectId,
      dataset,
      apiVersion: SANITY_API_VERSION,
      useCdn: true,
      perspective: "published",
      // The datasets require an authenticated read; fall back to the write
      // token (server-only) so a missing read token can never blank the site.
      token: process.env["SANITY_READ_TOKEN"] || process.env["SANITY_WRITE_TOKEN"] || void 0
    });
    clients.set(key, client);
  }
  return client;
}
async function resolveSanityCreds(request) {
  let projectId = process.env["SANITY_PROJECT_ID"] || DEFAULT_SANITY_PROJECT_ID;
  let dataset = DEFAULT_SANITY_DATASET;
  const host = request?.headers.get("host")?.toLowerCase().split(":")[0]?.replace(/^www\./, "") ?? "";
  if (host && HOST_DATASETS[host]) dataset = HOST_DATASETS[host];
  try {
    const { resolveCurrentWebsite } = await import("./current-website.server-D9vbN4Zc.mjs");
    const site = await resolveCurrentWebsite(request);
    if (site.sanity_project_id) projectId = site.sanity_project_id;
    if (site.sanity_dataset) dataset = site.sanity_dataset;
    else if (site.domain && HOST_DATASETS[site.domain.replace(/^www\./, "")]) {
      dataset = HOST_DATASETS[site.domain.replace(/^www\./, "")];
    }
  } catch {
  }
  return { projectId, dataset };
}
const cache = /* @__PURE__ */ new Map();
const TTL_MS = 5 * 60 * 1e3;
async function sanityQuery(request, query, params = {}) {
  const creds = await resolveSanityCreds(request);
  const cacheKey = `${creds.projectId}:${creds.dataset}:${query}:${JSON.stringify(params)}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) return cached.data;
  try {
    const data = await getClient(creds).fetch(query, params);
    cache.set(cacheKey, { expiresAt: now + TTL_MS, data });
    return data;
  } catch (err) {
    if (cached) return cached.data;
    throw err;
  }
}
export {
  DEFAULT_SANITY_DATASET,
  DEFAULT_SANITY_PROJECT_ID,
  SANITY_API_VERSION,
  resolveSanityCreds,
  sanityQuery
};
