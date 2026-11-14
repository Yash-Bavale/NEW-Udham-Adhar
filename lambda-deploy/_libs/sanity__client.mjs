import { c as createRequester, r as retry, a as anySignal, i as isHttpError, b as isRetryableRequest, d as debug, e as createNodeFetch } from "./get-it.mjs";
import { c as cjsExports, o as operatorsExports } from "./rxjs.mjs";
import { Readable } from "node:stream";
import { c as createDebug } from "./obug.mjs";
import { E as EventSource } from "./eventsource.mjs";
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
function isRecord(value) {
  return typeof value == "object" && !!value && !Array.isArray(value);
}
const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
function codeFrame(query, location2, message) {
  let lines = query.split(NEWLINE), { start, end, markerLines } = getMarkerLines({
    start: columnToLine(location2.start, lines),
    end: location2.end ? columnToLine(location2.end, lines) : void 0
  }, lines), numberMaxWidth = `${end}`.length;
  return query.split(NEWLINE, end).slice(start, end).map((line, index) => {
    let number = start + 1 + index, gutter = ` ${` ${number}`.slice(-numberMaxWidth)} |`, hasMarker = markerLines[number], lastMarkerLine = !markerLines[number + 1];
    if (!hasMarker) return ` ${gutter}${line.length > 0 ? ` ${line}` : ""}`;
    let markerLine = "";
    if (Array.isArray(hasMarker)) {
      let markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " "), numberOfMarkers = hasMarker[1] || 1;
      markerLine = [
        "\n ",
        gutter.replace(/\d/g, " "),
        " ",
        markerSpacing,
        "^".repeat(numberOfMarkers)
      ].join(""), lastMarkerLine && message && (markerLine += " " + message);
    }
    return [
      ">",
      gutter,
      line.length > 0 ? ` ${line}` : "",
      markerLine
    ].join("");
  }).join("\n");
}
function getMarkerLines(loc, source) {
  let startLoc = { ...loc.start }, endLoc = {
    ...startLoc,
    ...loc.end
  }, startLine = startLoc.line ?? -1, startColumn = startLoc.column ?? 0, endLine = endLoc.line, endColumn = endLoc.column, start = Math.max(startLine - 3, 0), end = Math.min(source.length, endLine + 3);
  startLine === -1 && (start = 0), endLine === -1 && (end = source.length);
  let lineDiff = endLine - startLine, markerLines = {};
  if (lineDiff) for (let i = 0; i <= lineDiff; i++) {
    let lineNumber = i + startLine;
    markerLines[lineNumber] = startColumn ? i === 0 ? [startColumn, source[lineNumber - 1].length - startColumn + 1] : i === lineDiff ? [0, endColumn] : [0, source[lineNumber - i].length] : true;
  }
  else markerLines[startLine] = startColumn === endColumn ? !startColumn || [startColumn, 0] : [startColumn, endColumn - startColumn];
  return {
    start,
    end,
    markerLines
  };
}
function columnToLine(column, lines) {
  let offset = 0;
  for (let i = 0; i < lines.length; i++) {
    let lineLength = lines[i].length + 1;
    if (offset + lineLength > column) return {
      line: i + 1,
      column: column - offset
    };
    offset += lineLength;
  }
  return {
    line: lines.length,
    column: lines[lines.length - 1]?.length ?? 0
  };
}
function httpResponseFromFetch(res, reqUrl, reqMethod) {
  return {
    statusCode: res.status,
    statusMessage: res.statusText || null,
    headers: headersToRecord$1(res.headers),
    body: res.body,
    url: res.url || reqUrl,
    method: reqMethod
  };
}
function headersToRecord$1(headers) {
  let out = {};
  return headers.forEach((value, key) => {
    out[key] = value;
  }), out;
}
var ClientError = class extends Error {
  response;
  statusCode = 400;
  responseBody;
  traceId;
  details;
  constructor(res, tag) {
    let props = extractErrorProps(res, tag);
    super(props.message), Object.assign(this, props);
  }
}, ServerError = class extends Error {
  response;
  statusCode = 500;
  responseBody;
  traceId;
  details;
  constructor(res) {
    let props = extractErrorProps(res);
    super(props.message), Object.assign(this, props);
  }
};
function extractErrorProps(res, tag) {
  let body = res.body, props = {
    response: res,
    statusCode: res.statusCode,
    responseBody: stringifyBody(body, res),
    traceId: extractTraceId(res),
    message: "",
    details: void 0
  };
  if (!isRecord(body)) return props.message = `${httpErrorMessage(res, body)}${formatTraceId(props.traceId)}`, props;
  let error = body.error;
  if (typeof error == "string" && typeof body.message == "string") return props.message = `${error} - ${body.message}${formatTraceId(props.traceId)}`, props;
  if (typeof error != "object" || !error) return props.message = typeof error == "string" ? `${error}${formatTraceId(props.traceId)}` : typeof body.message == "string" ? `${body.message}${formatTraceId(props.traceId)}` : `${httpErrorMessage(res, body)}${formatTraceId(props.traceId)}`, props;
  if (isMutationError(error) || isActionError(error)) {
    let allItems = error.items || [], items = allItems.slice(0, 5).map((item) => item.error?.description).filter(Boolean), itemsStr = items.length ? `:
- ${items.join("\n- ")}` : "";
    return allItems.length > 5 && (itemsStr += `
...and ${allItems.length - 5} more`), props.message = `${error.description}${formatTraceId(props.traceId)}${itemsStr}`, props.details = body.error, props;
  }
  return isQueryParseError(error) ? (props.message = formatQueryParseError(error, tag, props.traceId), props.details = body.error, props) : "description" in error && typeof error.description == "string" ? (props.message = `${error.description}${formatTraceId(props.traceId)}`, props.details = error, props) : (props.message = `${httpErrorMessage(res, body)}${formatTraceId(props.traceId)}`, props);
}
function isMutationError(error) {
  return "type" in error && error.type === "mutationError" && "description" in error && typeof error.description == "string";
}
function isActionError(error) {
  return "type" in error && error.type === "actionError" && "description" in error && typeof error.description == "string";
}
function isQueryParseError(error) {
  return isRecord(error) && error.type === "queryParseError" && typeof error.query == "string" && typeof error.start == "number" && typeof error.end == "number";
}
function formatQueryParseError(error, tag, traceId) {
  let { query, start, end, description } = error, withTraceId = traceId ? `
(traceId: ${traceId})` : "";
  if (!query || start === void 0) return `GROQ query parse error: ${description}${withTraceId}`;
  let withTag = tag ? `

Tag: ${tag}` : "";
  return `GROQ query parse error:
${codeFrame(query, {
    start,
    end
  }, description)}${withTag}${withTraceId}`;
}
function httpErrorMessage(res, body) {
  let details = typeof body == "string" ? ` (${sliceWithEllipsis(body, 100)})` : "", statusMessage = res.statusMessage ? ` ${res.statusMessage}` : "";
  return `${res.method}-request to ${res.url} resulted in HTTP ${res.statusCode}${statusMessage}${details}`;
}
function extractTraceId(res) {
  let traceparent = res?.headers?.traceparent;
  if (traceparent) return traceparent.split("-")[1];
}
function stringifyBody(body, res) {
  return (res.headers["content-type"] || "").toLowerCase().indexOf("application/json") === -1 ? body : JSON.stringify(body, null, 2);
}
function formatTraceId(traceId) {
  return traceId ? ` (traceId: ${traceId})` : "";
}
function sliceWithEllipsis(str, max) {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}
var CorsOriginError = class extends Error {
  projectId;
  addOriginUrl;
  constructor({ projectId: projectId2, credentials } = {}) {
    if (super("CorsOriginError"), this.name = "CorsOriginError", this.projectId = projectId2, projectId2 && typeof location < "u") {
      let url = new URL(`https://sanity.io/manage/project/${projectId2}/api`), { origin } = location;
      url.searchParams.set("cors", "add"), url.searchParams.set("origin", origin), credentials && url.searchParams.set("credentials", ""), this.addOriginUrl = url, this.message = `The current origin is not allowed to connect to the Live Content API. Add it here: ${url}`;
    } else this.message = projectId2 ? `The current origin is not allowed to connect to the Live Content API. Change your configuration here: https://sanity.io/manage/project/${projectId2}/api` : "The current origin is not allowed to connect to the Live Content API.";
  }
};
function defineRequester(envOptions, config = {}) {
  let applyFetchInit = (opts, next) => {
    let fetchInit = opts.meta?.fetchInit;
    if (typeof fetchInit != "object" || !fetchInit) return next(opts);
    let baseFetch = opts.fetch ?? envOptions.fetch ?? globalThis.fetch, fetchWithInit = (input, init) => baseFetch(input, {
      ...fetchInit,
      ...init
    });
    return next({
      ...opts,
      fetch: fetchWithInit
    });
  }, requester = createRequester({
    ...envOptions.fetch ? { fetch: envOptions.fetch } : {},
    headers: envOptions.headers,
    httpErrors: true,
    middleware: [
      retry({
        shouldRetry: shouldRetryRequest,
        maxRetries: config.maxRetries ?? 5,
        ...config.retryDelay ? { retryDelay: config.retryDelay } : {}
      }),
      ...envOptions.middleware,
      applyFetchInit,
      printWarnings(config)
    ]
  }), promise = (options) => {
    if (typeof options.url != "string") throw TypeError("Request options must include a `url`");
    return executeRequest(requester, options);
  }, observable = (options) => new cjsExports.Observable((subscriber) => {
    let controller = new AbortController(), userSignal = options.signal, signal = userSignal ? anySignal([userSignal, controller.signal]) : controller.signal, subscription = cjsExports.from(promise({
      ...options,
      signal
    })).subscribe(subscriber);
    return () => {
      subscription.unsubscribe(), controller.abort();
    };
  });
  return {
    promise,
    observable
  };
}
async function executeRequest(requester, fetchOptions) {
  let url = fetchOptions.url, method = (fetchOptions.method ?? "GET").toUpperCase(), response;
  try {
    response = await requester(fetchOptions);
  } catch (err) {
    if (isHttpError(err)) {
      let errBody = parseJsonText(typeof err.body == "string" ? err.body : "", err.headers), canonical = httpResponseFromFetch({
        status: err.status,
        statusText: err.statusText,
        headers: err.headers,
        body: errBody,
        url: err.response.url ?? err.url
      }, url, method), tag = extractRequestTag(fetchOptions.query);
      throw canonical.statusCode >= 500 ? new ServerError(canonical) : new ClientError(canonical, tag);
    }
    throw err;
  }
  return {
    type: "response",
    body: parseJsonBody(response),
    statusCode: response.status,
    statusMessage: response.statusText || null,
    headers: headersToRecord(response.headers),
    url: response.url || url,
    method
  };
}
function extractRequestTag(query) {
  if (!query) return;
  if (query instanceof URLSearchParams) return query.get("tag") ?? void 0;
  let tag = query.tag;
  return typeof tag == "string" ? tag : void 0;
}
function parseJsonBody(response) {
  return parseJsonText(response.text(), response.headers);
}
function parseJsonText(text, headers) {
  let contentType = (headers.get("content-type") ?? "").toLowerCase();
  if (text) {
    if (contentType.includes("application/json")) try {
      return JSON.parse(text);
    } catch {
      return text;
    }
    return text;
  }
}
function headersToRecord(headers) {
  let out = {};
  return headers.forEach((value, key) => {
    out[key] = value;
  }), out;
}
function shouldRetryRequest(err, attempt, options) {
  if (isHttpError(err)) {
    let isSafe = (options.method ?? "GET") === "GET" || options.method === "HEAD", isQuery2 = (options.url ?? "").includes("/data/query"), status = err.status;
    return !!((isSafe || isQuery2) && (status === 429 || status === 502 || status === 503));
  }
  return isRetryableRequest(err, attempt, options);
}
function printWarnings(config) {
  let seen = {}, shouldIgnore = (message) => config.ignoreWarnings !== void 0 && (Array.isArray(config.ignoreWarnings) ? config.ignoreWarnings : [config.ignoreWarnings]).some((pattern) => typeof pattern == "string" ? message.includes(pattern) : pattern.test(message));
  return { afterResponse(response) {
    let header = response.headers.get("x-sanity-warning");
    if (!header) return response;
    for (let msg of header.split(",").map((m) => m.trim())) !msg || seen[msg] || shouldIgnore(msg) || (seen[msg] = true, console.warn(msg));
    return response;
  } };
}
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var p = {
    0: 8203,
    1: 8204,
    2: 8205,
    3: 8290,
    4: 8291,
    5: 8288,
    6: 65279,
    7: 8289,
    8: 119155,
    9: 119156,
    a: 119157,
    b: 119158,
    c: 119159,
    d: 119160,
    e: 119161,
    f: 119162
  }, l = {
    0: 8203,
    1: 8204,
    2: 8205,
    3: 65279
  }, d = {
    0: String.fromCodePoint(l[0]),
    1: String.fromCodePoint(l[1]),
    2: String.fromCodePoint(l[2]),
    3: String.fromCodePoint(l[3])
  }, u = [
    ,
    ,
    ,
    ,
  ].fill(String.fromCodePoint(l[0])).join("");
  function A(e) {
    let r = JSON.stringify(e), t = new TextEncoder().encode(r), i = "";
    for (let c = 0; c < t.length; c++) {
      let n = t[c];
      i += d[n >> 6 & 3] + d[n >> 4 & 3] + d[n >> 2 & 3] + d[n & 3];
    }
    return u + i;
  }
  function I(e) {
    return !Number.isNaN(Number(e)) || /[a-z]/i.test(e) && !/\d+(?:[-:\/]\d+){2}(?:T\d+(?:[-:\/]\d+){1,2}(\.\d+)?Z?)?/.test(e) ? false : !!Date.parse(e);
  }
  function S(e) {
    try {
      new URL(e, e.startsWith("/") ? "https://acme.com" : void 0);
    } catch {
      return false;
    }
    return true;
  }
  function y(e, r, t = "auto") {
    return t === true || t === "auto" && (I(e) || S(e)) ? e : `${e}${A(r)}`;
  }
  Object.fromEntries(Object.entries(d).map((e) => [e[1], +e[0]])), Object.fromEntries(Object.entries(p).map((e) => e.reverse()));
  var h = `${Object.values(p).map((e) => `\\u{${e.toString(16)}}`).join("")}`, x = exports.VERCEL_STEGA_REGEX = RegExp(`[${h}]{4,}`, "gu");
  function P(e) {
    return {
      cleaned: e.replace(x, ""),
      encoded: e.match(x)?.[0] || ""
    };
  }
  function w(e) {
    return e && JSON.parse(P(JSON.stringify(e)).cleaned);
  }
  exports.VERCEL_STEGA_REGEX = x, exports.vercelStegaClean = w, exports.vercelStegaCombine = y;
}));
const DRAFTS_FOLDER = "drafts", VERSION_FOLDER = "versions", DRAFTS_PREFIX = `${DRAFTS_FOLDER}.`, VERSION_PREFIX = `${VERSION_FOLDER}.`;
function isDraftId$1(id) {
  return id.startsWith(DRAFTS_PREFIX);
}
function isVersionId$1(id) {
  return id.startsWith(VERSION_PREFIX);
}
function isPublishedId$1(id) {
  return !isDraftId$1(id) && !isVersionId$1(id);
}
function asDraftId(value) {
  return value;
}
function asPublishedId$1(value) {
  return value;
}
function getDraftId(id) {
  if (isVersionId$1(id)) {
    let publishedId = getPublishedId$1(id);
    return asDraftId(DRAFTS_PREFIX + publishedId);
  }
  return isDraftId$1(id) ? id : DRAFTS_PREFIX + id;
}
function getVersionId(id, version2) {
  if (version2 === "drafts" || version2 === "published") throw Error('Version can not be "published" or "drafts"');
  return `${VERSION_PREFIX}${version2}.${getPublishedId$1(id)}`;
}
function getVersionFromId$1(id) {
  if (!isVersionId$1(id)) return;
  let [_versionPrefix, versionId, ..._publishedId] = id.split(".");
  return versionId;
}
function getPublishedId$1(id) {
  if (isVersionId$1(id)) return asPublishedId$1(id.split(".").slice(2).join("."));
  if (isDraftId$1(id)) return asPublishedId$1(id.slice(DRAFTS_PREFIX.length));
  if (isPublishedId$1(id)) return id;
  throw Error(`Unable to resolve a published id from "${id}"`);
}
function generateHelpUrl(slug) {
  return "https://www.sanity.io/help/" + slug;
}
const VALID_ASSET_TYPES = ["image", "file"], VALID_INSERT_LOCATIONS = [
  "before",
  "after",
  "replace"
], dataset = (name2) => {
  if (!/^(~[a-z0-9]{1}[-\w]{0,63}|[a-z0-9]{1}[-\w]{0,63})$/.test(name2)) throw Error("Datasets can only contain lowercase characters, numbers, underscores and dashes, and start with tilde, and be maximum 64 characters");
}, projectId = (id) => {
  if (!/^[-a-z0-9]+$/i.test(id)) throw Error("`projectId` can only contain only a-z, 0-9 and dashes");
}, validateAssetType = (type) => {
  if (VALID_ASSET_TYPES.indexOf(type) === -1) throw Error(`Invalid asset type: ${type}. Must be one of ${VALID_ASSET_TYPES.join(", ")}`);
}, validateObject = (op, val) => {
  if (typeof val != "object" || !val || Array.isArray(val)) throw Error(`${op}() takes an object of properties`);
}, validateDocumentId = (op, id) => {
  if (typeof id != "string" || !/^[a-z0-9_][a-z0-9_.-]{0,127}$/i.test(id) || id.includes("..")) throw Error(`${op}(): "${id}" is not a valid document ID`);
}, requireDocumentId = (op, doc) => {
  if (!doc._id) throw Error(`${op}() requires that the document contains an ID ("_id" property)`);
  validateDocumentId(op, doc._id);
}, validateDocumentType = (op, type) => {
  if (typeof type != "string") throw Error(`\`${op}()\`: \`${type}\` is not a valid document type`);
}, requireDocumentType = (op, doc) => {
  if (!doc._type) throw Error(`\`${op}()\` requires that the document contains a type (\`_type\` property)`);
  validateDocumentType(op, doc._type);
}, validateVersionIdMatch = (builtVersionId, document) => {
  if (document._id && document._id !== builtVersionId) throw Error(`The provided document ID (\`${document._id}\`) does not match the generated version ID (\`${builtVersionId}\`)`);
}, validateInsert = (at, selector, items) => {
  let signature = "insert(at, selector, items)";
  if (VALID_INSERT_LOCATIONS.indexOf(at) === -1) {
    let valid = VALID_INSERT_LOCATIONS.map((loc) => `"${loc}"`).join(", ");
    throw Error(`${signature} takes an "at"-argument which is one of: ${valid}`);
  }
  if (typeof selector != "string") throw Error(`${signature} takes a "selector"-argument which must be a string`);
  if (!Array.isArray(items)) throw Error(`${signature} takes an "items"-argument which must be an array`);
}, hasDataset = (config) => {
  if (config.dataset) return config.dataset;
  let resource = config.resource;
  if (resource && resource.type === "dataset") {
    let segments = resource.id.split(".");
    if (segments.length !== 2) throw Error('Dataset resource ID must be in the format "project.dataset"');
    return segments[1];
  }
  throw Error("`dataset` must be provided to perform queries");
}, requestTag = (tag) => {
  if (typeof tag != "string" || !/^[a-z0-9._-]{1,75}$/i.test(tag)) throw Error("Tag can only contain alphanumeric characters, underscores, dashes and dots, and be between one and 75 characters long.");
  return tag;
}, resourceConfig = (config) => {
  let resource = config.resource;
  if (!resource) throw Error("`resource` must be provided to perform resource queries");
  let { type, id } = resource;
  switch (type) {
    case "dataset":
      if (id.split(".").length !== 2) throw Error('Dataset resource ID must be in the format "project.dataset"');
      return;
    case "dashboard":
    case "knowledge-base":
    case "media-library":
    case "canvas":
      return;
    default:
      throw Error(`Unsupported resource type: ${type.toString()}`);
  }
}, resourceGuard = (service, config) => {
  if (config.resource) throw Error(`\`${service}\` does not support resource-based operations`);
};
function once(fn) {
  let didCall = false, returnValue;
  return (...args) => didCall ? returnValue : (returnValue = fn(...args), didCall = true, returnValue);
}
const createWarningPrinter = (message) => once((...args) => console.warn(message.join(" "), ...args)), printCdnAndWithCredentialsWarning = createWarningPrinter(["Because you set `withCredentials` to true, we will override your `useCdn`", "setting to be false since (cookie-based) credentials are never set on the CDN"]), printCdnWarning = createWarningPrinter([
  "Since you haven't set a value for `useCdn`, we will deliver content using our",
  "global, edge-cached API-CDN. If you wish to have content delivered faster, set",
  "`useCdn: false` to use the Live API. Note: You may incur higher costs using the live API."
]), printCdnPreviewDraftsWarning = createWarningPrinter(["The Sanity client is configured with the `perspective` set to `drafts` or `previewDrafts`, which doesn't support the API-CDN.", "The Live API will be used instead. Set `useCdn: false` in your configuration to hide this warning."]), printPreviewDraftsDeprecationWarning = createWarningPrinter(["The `previewDrafts` perspective has been renamed to  `drafts` and will be removed in a future API version"]), printBrowserTokenWarning = createWarningPrinter(["You have configured Sanity client to use a token in the browser. This may cause unintentional security issues.", `See ${generateHelpUrl("js-client-browser-token")} for more information and how to hide this warning.`]), printCredentialedTokenWarning = createWarningPrinter(["You have configured Sanity client to use a token, but also provided `withCredentials: true`.", "This is no longer supported - only token will be used - remove `withCredentials: true`."]), printNoApiVersionSpecifiedWarning = createWarningPrinter(["Using the Sanity client without specifying an API version is deprecated.", `See ${generateHelpUrl("js-client-api-version")}`]), printCreateVersionWithBaseIdWarning = createWarningPrinter(["You have called `createVersion()` with a defined `document`.", "If you are creating a version of a document that already exists, prefer providing `baseId` and `releaseId` instead."]), printDeprecatedUriOptionWarning = createWarningPrinter(["The `uri` request option has been renamed to `url`.", "Please update your code to use `url` instead. Support for `uri` will be removed in a future version."]), printDeprecatedResourceConfigWarning = createWarningPrinter(["The `~experimental_resource` configuration property has been renamed to `resource`.", "Please update your client configuration to use `resource` instead. Support for `~experimental_resource` will be removed in a future version."]), defaultConfig = {
  apiHost: "https://api.sanity.io",
  apiVersion: "1",
  useProjectHostname: true,
  stega: { enabled: false }
}, LOCALHOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0"
], isLocal = (host) => LOCALHOSTS.indexOf(host) !== -1;
function validateApiVersion(apiVersion) {
  if (apiVersion === "1" || apiVersion === "X") return;
  let apiDate = new Date(apiVersion);
  if (!(/^\d{4}-\d{2}-\d{2}$/.test(apiVersion) && apiDate instanceof Date && apiDate.getTime() > 0)) throw Error("Invalid API version string, expected `1` or date in format `YYYY-MM-DD`");
}
function validateApiPerspective(perspective) {
  if (Array.isArray(perspective) && perspective.length > 1 && perspective.includes("raw")) throw TypeError('Invalid API perspective value: "raw". The raw-perspective can not be combined with other perspectives');
}
const initConfig = (config, prevConfig) => {
  let specifiedConfig = {
    ...prevConfig,
    ...config,
    stega: {
      ...typeof prevConfig.stega == "boolean" ? { enabled: prevConfig.stega } : prevConfig.stega || defaultConfig.stega,
      ...typeof config.stega == "boolean" ? { enabled: config.stega } : config.stega || {}
    }
  };
  specifiedConfig.apiVersion || printNoApiVersionSpecifiedWarning();
  let newConfig = {
    ...defaultConfig,
    ...specifiedConfig,
    apiHost: specifiedConfig.apiHost ?? defaultConfig.apiHost
  };
  newConfig["~experimental_resource"] && !newConfig.resource && (printDeprecatedResourceConfigWarning(), newConfig.resource = newConfig["~experimental_resource"]);
  let resourceConfig$1 = newConfig.resource, projectBased = newConfig.useProjectHostname && !resourceConfig$1;
  if (typeof Promise > "u") {
    let helpUrl = generateHelpUrl("js-client-promise-polyfill");
    throw Error(`No native Promise-implementation found, polyfill needed - see ${helpUrl}`);
  }
  if (projectBased && !newConfig.projectId) throw Error("Configuration must contain `projectId`");
  if (resourceConfig$1 && resourceConfig(newConfig), newConfig.perspective !== void 0 && validateApiPerspective(newConfig.perspective), "encodeSourceMap" in newConfig) throw Error("It looks like you're using options meant for '@sanity/preview-kit/client'. 'encodeSourceMap' is not supported in '@sanity/client'. Did you mean 'stega.enabled'?");
  if ("encodeSourceMapAtPath" in newConfig) throw Error("It looks like you're using options meant for '@sanity/preview-kit/client'. 'encodeSourceMapAtPath' is not supported in '@sanity/client'. Did you mean 'stega.filter'?");
  if (typeof newConfig.stega.enabled != "boolean") throw Error(`stega.enabled must be a boolean, received ${newConfig.stega.enabled}`);
  if (newConfig.stega.enabled && newConfig.stega.studioUrl === void 0) throw Error("stega.studioUrl must be defined when stega.enabled is true");
  if (newConfig.stega.enabled && typeof newConfig.stega.studioUrl != "string" && typeof newConfig.stega.studioUrl != "function") throw Error(`stega.studioUrl must be a string or a function, received ${newConfig.stega.studioUrl}`);
  let isBrowser = typeof window < "u" && window.location && window.location.hostname, isLocalhost = isBrowser && isLocal(window.location.hostname), hasToken = !!newConfig.token;
  newConfig.withCredentials && hasToken && (printCredentialedTokenWarning(), newConfig.withCredentials = false), isBrowser && isLocalhost && hasToken && newConfig.ignoreBrowserTokenWarning !== true ? printBrowserTokenWarning() : newConfig.useCdn === void 0 && printCdnWarning(), projectBased && projectId(newConfig.projectId), newConfig.dataset && dataset(newConfig.dataset), "requestTagPrefix" in newConfig && (newConfig.requestTagPrefix = newConfig.requestTagPrefix ? requestTag(newConfig.requestTagPrefix).replace(/\.+$/, "") : void 0), newConfig.apiVersion = `${newConfig.apiVersion}`.replace(/^v/, ""), newConfig.isDefaultApi = newConfig.apiHost === defaultConfig.apiHost, newConfig.useCdn === true && newConfig.withCredentials && printCdnAndWithCredentialsWarning(), newConfig.useCdn = newConfig.useCdn !== false && !newConfig.withCredentials, validateApiVersion(newConfig.apiVersion);
  let hostParts = newConfig.apiHost.split("://", 2), protocol = hostParts[0], host = hostParts[1], cdnHost = newConfig.isDefaultApi ? "apicdn.sanity.io" : host;
  return projectBased ? (newConfig.url = `${protocol}://${newConfig.projectId}.${host}/v${newConfig.apiVersion}`, newConfig.cdnUrl = `${protocol}://${newConfig.projectId}.${cdnHost}/v${newConfig.apiVersion}`) : (newConfig.url = `${newConfig.apiHost}/v${newConfig.apiVersion}`, newConfig.cdnUrl = newConfig.url), newConfig;
};
var ConnectionFailedError = class extends Error {
  name = "ConnectionFailedError";
  /**
  * HTTP status code of the rejected connection attempt, if known.
  * Only set when the EventSource implementation exposes it — the `eventsource`
  * package used by the client does (as `code` on its error events), while
  * native EventSource implementations (browser and Node.js) do not.
  */
  status;
  constructor(message, options = {}) {
    let { status, ...errorOptions } = options;
    super(message, errorOptions), this.status = status;
  }
}, DisconnectError = class extends Error {
  name = "DisconnectError";
  reason;
  constructor(message, reason, options = {}) {
    super(message, options), this.reason = reason;
  }
}, ChannelError = class extends Error {
  name = "ChannelError";
  data;
  constructor(message, data) {
    super(message), this.data = data;
  }
}, MessageError = class extends Error {
  name = "MessageError";
  data;
  constructor(message, data, options = {}) {
    super(message, options), this.data = data;
  }
}, MessageParseError = class extends Error {
  name = "MessageParseError";
};
const REQUIRED_EVENTS = ["channelError", "disconnect"];
function connectEventSource(initEventSource, events) {
  return cjsExports.defer(() => {
    let es = initEventSource();
    return cjsExports.isObservable(es) ? es : cjsExports.of(es);
  }).pipe(cjsExports.mergeMap((es) => connectWithESInstance(es, events)));
}
function connectWithESInstance(es, events) {
  return new cjsExports.Observable((observer) => {
    let requestedEvents = new Set(events), isRequestedEvent = (type) => requestedEvents.has(type), emitOpen = isRequestedEvent("open");
    function onError(evt) {
      if ("data" in evt) {
        let [parseError, event] = parseEvent(evt);
        observer.error(parseError || !event ? new MessageParseError("Unable to parse EventSource error message", { cause: parseError }) : new MessageError(isRecord(event.data) && typeof event.data.message == "string" ? event.data.message : "", event));
        return;
      }
      if (evt.code !== void 0) {
        observer.error(new ConnectionFailedError("EventSource connection failed", { status: evt.code }));
        return;
      }
      if (es.readyState === es.CLOSED) observer.error(new ConnectionFailedError("EventSource connection failed"));
      else {
        let type = "reconnect";
        isRequestedEvent(type) && observer.next({ type });
      }
    }
    function onOpen() {
      let type = "open";
      isRequestedEvent(type) && observer.next({ type });
    }
    function onMessage(message) {
      let [parseError, event] = parseEvent(message);
      if (parseError || !event) {
        observer.error(new MessageParseError("Unable to parse EventSource message", { cause: parseError }));
        return;
      }
      if (message.type === "channelError") {
        let tag = new URL(es.url).searchParams.get("tag");
        observer.error(new ChannelError(extractErrorMessage(event?.data, tag), event.data));
        return;
      }
      if (message.type === "disconnect") {
        observer.error(new DisconnectError(`Server disconnected client: ${isRecord(event.data) && typeof event.data.reason == "string" && event.data.reason || "unknown error"}`));
        return;
      }
      isRequestedEvent(message.type) && observer.next({
        type: message.type,
        id: message.lastEventId,
        ...event.data ? { data: event.data } : {}
      });
    }
    es.addEventListener("error", onError), emitOpen && es.addEventListener("open", onOpen);
    let cleanedEvents = [.../* @__PURE__ */ new Set([...REQUIRED_EVENTS, ...events])].filter((type) => type !== "error" && type !== "open" && type !== "reconnect");
    return cleanedEvents.forEach((type) => es.addEventListener(type, onMessage)), () => {
      es.removeEventListener("error", onError), emitOpen && es.removeEventListener("open", onOpen), cleanedEvents.forEach((type) => es.removeEventListener(type, onMessage)), es.close();
    };
  });
}
function parseEvent(message) {
  try {
    let data = typeof message.data == "string" && JSON.parse(message.data);
    return [null, {
      type: message.type,
      id: message.lastEventId,
      ...isEmptyObject(data) ? {} : { data }
    }];
  } catch (err) {
    return [err, null];
  }
}
function extractErrorMessage(err, tag) {
  let error = isRecord(err) ? err.error : void 0;
  if (!error) {
    let message = isRecord(err) ? err.message : void 0;
    return typeof message == "string" && message || "Unknown listener error";
  }
  if (isRecord(error)) {
    if (isQueryParseError(error)) return formatQueryParseError(error, tag);
    if (typeof error.description == "string") return error.description;
  }
  return typeof error == "string" ? error : JSON.stringify(error, null, 2);
}
function isEmptyObject(data) {
  for (let _ in data) return false;
  return true;
}
function getSelection(sel) {
  if (typeof sel == "string") return { id: sel };
  if (Array.isArray(sel)) return {
    query: "*[_id in $ids]",
    params: { ids: sel }
  };
  if (typeof sel == "object" && sel && "query" in sel && typeof sel.query == "string") return "params" in sel && typeof sel.params == "object" && sel.params !== null ? {
    query: sel.query,
    params: sel.params
  } : { query: sel.query };
  let selectionOpts = [
    "* Document ID (<docId>)",
    "* Array of document IDs",
    "* Object containing `query`"
  ].join("\n");
  throw Error(`Unknown selection - must be one of:

${selectionOpts}`);
}
var BasePatch = class {
  selection;
  operations;
  constructor(selection, operations = {}) {
    this.selection = selection, this.operations = operations;
  }
  /**
  * Sets the given attributes to the document. Does NOT merge objects.
  * The operation is added to the current patch, ready to be commited by `commit()`
  *
  * @param attrs - Attributes to set. To set a deep attribute, use JSONMatch, eg: \{"nested.prop": "value"\}
  */
  set(attrs) {
    return this._assign("set", attrs);
  }
  /**
  * Sets the given attributes to the document if they are not currently set. Does NOT merge objects.
  * The operation is added to the current patch, ready to be commited by `commit()`
  *
  * @param attrs - Attributes to set. To set a deep attribute, use JSONMatch, eg: \{"nested.prop": "value"\}
  */
  setIfMissing(attrs) {
    return this._assign("setIfMissing", attrs);
  }
  /**
  * Performs a "diff-match-patch" operation on the string attributes provided.
  * The operation is added to the current patch, ready to be commited by `commit()`
  *
  * @param attrs - Attributes to perform operation on. To set a deep attribute, use JSONMatch, eg: \{"nested.prop": "dmp"\}
  */
  diffMatchPatch(attrs) {
    return validateObject("diffMatchPatch", attrs), this._assign("diffMatchPatch", attrs);
  }
  /**
  * Unsets the attribute paths provided.
  * The operation is added to the current patch, ready to be commited by `commit()`
  *
  * @param attrs - Attribute paths to unset.
  */
  unset(attrs) {
    if (!Array.isArray(attrs)) throw Error("unset(attrs) takes an array of attributes to unset, non-array given");
    return this.operations = Object.assign({}, this.operations, { unset: attrs }), this;
  }
  /**
  * Increment a numeric value. Each entry in the argument is either an attribute or a JSON path. The value may be a positive or negative integer or floating-point value. The operation will fail if target value is not a numeric value, or doesn't exist.
  *
  * @param attrs - Object of attribute paths to increment, values representing the number to increment by.
  */
  inc(attrs) {
    return this._assign("inc", attrs);
  }
  /**
  * Decrement a numeric value. Each entry in the argument is either an attribute or a JSON path. The value may be a positive or negative integer or floating-point value. The operation will fail if target value is not a numeric value, or doesn't exist.
  *
  * @param attrs - Object of attribute paths to decrement, values representing the number to decrement by.
  */
  dec(attrs) {
    return this._assign("dec", attrs);
  }
  /**
  * Provides methods for modifying arrays, by inserting, appending and replacing elements via a JSONPath expression.
  *
  * @param at - Location to insert at, relative to the given selector, or 'replace' the matched path
  * @param selector - JSONPath expression, eg `comments[-1]` or `blocks[_key=="abc123"]`
  * @param items - Array of items to insert/replace
  */
  insert(at, selector, items) {
    return validateInsert(at, selector, items), this._assign("insert", {
      [at]: selector,
      items
    });
  }
  /**
  * Append the given items to the array at the given JSONPath
  *
  * @param selector - Attribute/path to append to, eg `comments` or `person.hobbies`
  * @param items - Array of items to append to the array
  */
  append(selector, items) {
    return this.insert("after", `${selector}[-1]`, items);
  }
  /**
  * Prepend the given items to the array at the given JSONPath
  *
  * @param selector - Attribute/path to prepend to, eg `comments` or `person.hobbies`
  * @param items - Array of items to prepend to the array
  */
  prepend(selector, items) {
    return this.insert("before", `${selector}[0]`, items);
  }
  /**
  * Change the contents of an array by removing existing elements and/or adding new elements.
  *
  * @param selector - Attribute or JSONPath expression for array
  * @param start - Index at which to start changing the array (with origin 0). If greater than the length of the array, actual starting index will be set to the length of the array. If negative, will begin that many elements from the end of the array (with origin -1) and will be set to 0 if absolute value is greater than the length of the array.x
  * @param deleteCount - An integer indicating the number of old array elements to remove.
  * @param items - The elements to add to the array, beginning at the start index. If you don't specify any elements, splice() will only remove elements from the array.
  */
  splice(selector, start, deleteCount, items) {
    let delAll = deleteCount === void 0 || deleteCount === -1, startIndex = start < 0 ? start - 1 : start, delCount = delAll ? -1 : Math.max(0, start + deleteCount), rangeSelector = `${selector}[${startIndex}:${startIndex < 0 && delCount >= 0 ? "" : delCount}]`;
    return this.insert("replace", rangeSelector, items || []);
  }
  /**
  * Adds a revision clause, preventing the document from being patched if the `_rev` property does not match the given value
  *
  * @param rev - Revision to lock the patch to
  */
  ifRevisionId(rev) {
    return this.operations.ifRevisionID = rev, this;
  }
  /**
  * Return a plain JSON representation of the patch
  */
  serialize() {
    return {
      ...getSelection(this.selection),
      ...this.operations
    };
  }
  /**
  * Return a plain JSON representation of the patch
  */
  toJSON() {
    return this.serialize();
  }
  /**
  * Clears the patch of all operations
  */
  reset() {
    return this.operations = {}, this;
  }
  _assign(op, props, merge = true) {
    return validateObject(op, props), this.operations = Object.assign({}, this.operations, { [op]: Object.assign({}, merge && this.operations[op] || {}, props) }), this;
  }
  _set(op, props) {
    return this._assign(op, props, false);
  }
}, ObservablePatch = class ObservablePatch2 extends BasePatch {
  #client;
  constructor(selection, operations, client) {
    super(selection, operations), this.#client = client;
  }
  /**
  * Clones the patch
  */
  clone() {
    return new ObservablePatch2(this.selection, { ...this.operations }, this.#client);
  }
  commit(options) {
    if (!this.#client) throw Error("No `client` passed to patch, either provide one or pass the patch to a clients `mutate()` method");
    let returnFirst = typeof this.selection == "string", opts = Object.assign({
      returnFirst,
      returnDocuments: true
    }, options);
    return this.#client.mutate({ patch: this.serialize() }, opts);
  }
}, Patch = class Patch2 extends BasePatch {
  #client;
  constructor(selection, operations, client) {
    super(selection, operations), this.#client = client;
  }
  /**
  * Clones the patch
  */
  clone() {
    return new Patch2(this.selection, { ...this.operations }, this.#client);
  }
  commit(options) {
    if (!this.#client) throw Error("No `client` passed to patch, either provide one or pass the patch to a clients `mutate()` method");
    let returnFirst = typeof this.selection == "string", opts = Object.assign({
      returnFirst,
      returnDocuments: true
    }, options);
    return this.#client.mutate({ patch: this.serialize() }, opts);
  }
};
const defaultMutateOptions = { returnDocuments: false };
var BaseTransaction = class {
  operations;
  trxId;
  constructor(operations = [], transactionId) {
    this.operations = operations, this.trxId = transactionId;
  }
  /**
  * Creates a new Sanity document. If `_id` is provided and already exists, the mutation will fail. If no `_id` is given, one will automatically be generated by the database.
  * The operation is added to the current transaction, ready to be commited by `commit()`
  *
  * @param doc - Document to create. Requires a `_type` property.
  */
  create(doc) {
    return validateObject("create", doc), this._add({ create: doc });
  }
  /**
  * Creates a new Sanity document. If a document with the same `_id` already exists, the create operation will be ignored.
  * The operation is added to the current transaction, ready to be commited by `commit()`
  *
  * @param doc - Document to create if it does not already exist. Requires `_id` and `_type` properties.
  */
  createIfNotExists(doc) {
    let op = "createIfNotExists";
    return validateObject(op, doc), requireDocumentId(op, doc), this._add({ [op]: doc });
  }
  /**
  * Creates a new Sanity document, or replaces an existing one if the same `_id` is already used.
  * The operation is added to the current transaction, ready to be commited by `commit()`
  *
  * @param doc - Document to create or replace. Requires `_id` and `_type` properties.
  */
  createOrReplace(doc) {
    let op = "createOrReplace";
    return validateObject(op, doc), requireDocumentId(op, doc), this._add({ [op]: doc });
  }
  /**
  * Deletes the document with the given document ID
  * The operation is added to the current transaction, ready to be commited by `commit()`
  *
  * @param documentId - Document ID to delete
  */
  delete(documentId) {
    return validateDocumentId("delete", documentId), this._add({ delete: { id: documentId } });
  }
  transactionId(id) {
    return id ? (this.trxId = id, this) : this.trxId;
  }
  /**
  * Return a plain JSON representation of the transaction
  */
  serialize() {
    return [...this.operations];
  }
  /**
  * Return a plain JSON representation of the transaction
  */
  toJSON() {
    return this.serialize();
  }
  /**
  * Clears the transaction of all operations
  */
  reset() {
    return this.operations = [], this;
  }
  _add(mut) {
    return this.operations.push(mut), this;
  }
}, Transaction = class Transaction2 extends BaseTransaction {
  #client;
  constructor(operations, client, transactionId) {
    super(operations, transactionId), this.#client = client;
  }
  /**
  * Clones the transaction
  */
  clone() {
    return new Transaction2([...this.operations], this.#client, this.trxId);
  }
  commit(options) {
    if (!this.#client) throw Error("No `client` passed to transaction, either provide one or pass the transaction to a clients `mutate()` method");
    return this.#client.mutate(this.serialize(), Object.assign({ transactionId: this.trxId }, defaultMutateOptions, options || {}));
  }
  patch(patchOrDocumentId, patchOps) {
    let isBuilder = typeof patchOps == "function", isPatch = typeof patchOrDocumentId != "string" && patchOrDocumentId instanceof Patch, isMutationSelection = typeof patchOrDocumentId == "object" && ("query" in patchOrDocumentId || "id" in patchOrDocumentId);
    if (isPatch) return this._add({ patch: patchOrDocumentId.serialize() });
    if (isBuilder) {
      let patch = patchOps(new Patch(patchOrDocumentId, {}, this.#client));
      if (!(patch instanceof Patch)) throw Error("function passed to `patch()` must return the patch");
      return this._add({ patch: patch.serialize() });
    }
    if (isMutationSelection) {
      let patch = new Patch(patchOrDocumentId, patchOps || {}, this.#client);
      return this._add({ patch: patch.serialize() });
    }
    return this._add({ patch: {
      id: patchOrDocumentId,
      ...patchOps
    } });
  }
}, ObservableTransaction = class ObservableTransaction2 extends BaseTransaction {
  #client;
  constructor(operations, client, transactionId) {
    super(operations, transactionId), this.#client = client;
  }
  /**
  * Clones the transaction
  */
  clone() {
    return new ObservableTransaction2([...this.operations], this.#client, this.trxId);
  }
  commit(options) {
    if (!this.#client) throw Error("No `client` passed to transaction, either provide one or pass the transaction to a clients `mutate()` method");
    return this.#client.mutate(this.serialize(), Object.assign({ transactionId: this.trxId }, defaultMutateOptions, options || {}));
  }
  patch(patchOrDocumentId, patchOps) {
    let isBuilder = typeof patchOps == "function";
    if (typeof patchOrDocumentId != "string" && patchOrDocumentId instanceof ObservablePatch) return this._add({ patch: patchOrDocumentId.serialize() });
    if (isBuilder) {
      let patch = patchOps(new ObservablePatch(patchOrDocumentId, {}, this.#client));
      if (!(patch instanceof ObservablePatch)) throw Error("function passed to `patch()` must return the patch");
      return this._add({ patch: patch.serialize() });
    }
    return this._add({ patch: {
      id: patchOrDocumentId,
      ...patchOps
    } });
  }
};
const possibleStoreRequestOptions = [
  "headers",
  "signal",
  "tag",
  "timeout",
  "token"
];
function requestOptions(config, overrides = {}) {
  let headers = {};
  config.headers && Object.assign(headers, config.headers);
  let token = overrides.token || config.token;
  token && (headers.Authorization = `Bearer ${token}`), !overrides.useGlobalApi && !config.useProjectHostname && config.projectId && (headers["X-Sanity-Project-ID"] = config.projectId);
  let request = {
    url: overrides.url,
    headers: Object.assign(headers, overrides.headers || {})
  };
  overrides.method && (request.method = overrides.method), overrides.body !== void 0 && (request.body = overrides.body), overrides.query && (request.query = expandQueryArrays(overrides.query)), overrides.signal && (request.signal = overrides.signal), (overrides.withCredentials === void 0 ? config.withCredentials : overrides.withCredentials) && (request.credentials = "include"), typeof overrides.maxRedirects == "number" && (request.redirect = overrides.maxRedirects === 0 ? "manual" : "follow");
  let timeout = overrides.timeout === void 0 ? config.timeout : overrides.timeout;
  request.timeout = timeout === void 0 ? 3e5 : timeout !== 0 && timeout, overrides.useAbortSignal === false && !request.signal && (request.timeout = typeof request.timeout == "number" && request.timeout > 0 && {
    total: request.timeout,
    signal: false
  });
  let fetchOption = typeof overrides.fetch == "object" && typeof config.fetch == "object" ? {
    ...config.fetch,
    ...overrides.fetch
  } : overrides.fetch || config.fetch;
  return typeof fetchOption == "function" ? request.fetch = fetchOption : typeof fetchOption == "object" && fetchOption && (request.meta = {
    ...request.meta,
    fetchInit: fetchOption
  }), !request.fetch && config.resolveFetch && (request.fetch = config.resolveFetch(typeof config.proxy == "string" ? config.proxy : void 0)), typeof overrides.maxRetries == "number" && (request.maxRetries = overrides.maxRetries), typeof config.lineage == "string" && config.lineage && (request.meta = {
    ...request.meta,
    lineage: config.lineage
  }), request;
}
function expandQueryArrays(query) {
  if (query instanceof URLSearchParams || !query || typeof query != "object" || !Object.values(query).some(Array.isArray)) return query;
  let params = new URLSearchParams();
  for (let [key, value] of Object.entries(query)) if (value != null) {
    if (Array.isArray(value)) for (let item of value) item != null && params.append(key, `${item}`);
    else params.append(key, `${value}`);
  }
  return params;
}
var import_dist$1 = require_dist();
function stegaClean(result) {
  return (0, import_dist$1.vercelStegaClean)(result);
}
const encodeQueryString = ({ query, params = {}, options = {} }) => {
  let searchParams = new URLSearchParams(), { tag, includeMutations, returnQuery, ...opts } = options;
  tag && searchParams.append("tag", tag), searchParams.append("query", query);
  for (let [key, value] of Object.entries(params)) value !== void 0 && searchParams.append(`$${key}`, JSON.stringify(value));
  for (let [key, value] of Object.entries(opts)) value && searchParams.append(key, `${value}`);
  return returnQuery === false && searchParams.append("returnQuery", "false"), includeMutations === false && searchParams.append("includeMutations", "false"), `?${searchParams}`;
}, excludeFalsey = (param, defValue) => param === false ? void 0 : param === void 0 ? defValue : param, getMutationQuery = (options = {}) => ({
  dryRun: options.dryRun,
  returnIds: true,
  returnDocuments: excludeFalsey(options.returnDocuments, true),
  visibility: options.visibility || "sync",
  autoGenerateArrayKeys: options.autoGenerateArrayKeys,
  skipCrossDatasetReferenceValidation: options.skipCrossDatasetReferenceValidation
}), indexBy = (docs, attr) => docs.reduce((indexed, doc) => (indexed[attr(doc)] = doc, indexed), /* @__PURE__ */ Object.create(null));
function _fetchRequest(_stega, _params, options) {
  let stega = "stega" in options ? {
    ..._stega,
    ...typeof options.stega == "boolean" ? { enabled: options.stega } : options.stega || {}
  } : _stega, params = stega.enabled ? stegaClean(_params) : _params, mapResponse = options.filterResponse === false ? (res) => res : (res) => res.result, { cache, next, ...opts } = {
    useAbortSignal: options.signal !== void 0,
    resultSourceMap: stega.enabled ? "withKeyArraySelector" : options.resultSourceMap,
    ...options,
    returnQuery: options.filterResponse === false && options.returnQuery !== false
  };
  return {
    stega,
    params,
    mapResponse,
    reqOpts: cache !== void 0 || next !== void 0 ? {
      ...opts,
      fetch: {
        cache,
        next
      }
    } : opts
  };
}
function _fetchObservable(client, httpRequest, _stega, query, _params = {}, options = {}) {
  return _observe(options.signal, (signal) => _fetch$2(client, httpRequest, _stega, query, _params, {
    ...options,
    signal
  }));
}
function _fetch$2(client, httpRequest, _stega, query, _params = {}, options = {}) {
  let { stega, params, mapResponse, reqOpts } = _fetchRequest(_stega, _params, options), request = _dataRequest(client, httpRequest, "query", {
    query,
    params
  }, reqOpts);
  return stega.enabled ? Promise.all([request, Promise.resolve().then(function() {
    return stegaEncodeSourceMapCO1HKnm2;
  })]).then(([res, { stegaEncodeSourceMap: stegaEncodeSourceMap2 }]) => {
    let result = stegaEncodeSourceMap2(res.result, res.resultSourceMap, stega);
    return mapResponse({
      ...res,
      result
    });
  }) : request.then(mapResponse);
}
function _getDocumentObservable(client, httpRequest, id, opts = {}) {
  return _observe(opts.signal, (signal) => _request(client, httpRequest, _getDocumentOptions(client, id, {
    ...opts,
    signal
  })).then((body) => _mapGetDocument(body, opts.includeAllVersions)));
}
function _getDocument(client, httpRequest, id, opts = {}) {
  return _request(client, httpRequest, _getDocumentOptions(client, id, opts)).then((body) => _mapGetDocument(body, opts.includeAllVersions));
}
function _getDocumentOptions(client, id, opts) {
  let docId = id;
  if (opts.releaseId) {
    let versionId = getVersionFromId$1(id);
    if (!versionId) {
      if (isDraftId$1(id)) throw Error(`The document ID (\`${id}\`) is a draft, but \`options.releaseId\` is set as \`${opts.releaseId}\``);
      docId = getVersionId(id, opts.releaseId);
    } else if (versionId !== opts.releaseId) throw Error(`The document ID (\`${id}\`) is already a version of \`${versionId}\` release, but this does not match the provided \`options.releaseId\` (\`${opts.releaseId}\`)`);
  }
  return {
    url: _getDataUrl(client, "doc", docId),
    tag: opts.tag,
    signal: opts.signal,
    query: opts.includeAllVersions === void 0 ? void 0 : { includeAllVersions: opts.includeAllVersions }
  };
}
function _mapGetDocument(body, includeAllVersions) {
  let documents = body.documents;
  return documents ? includeAllVersions ? documents : documents[0] : includeAllVersions ? [] : void 0;
}
function _getDocumentsObservable(client, httpRequest, ids, opts = {}) {
  return _observe(opts.signal, (signal) => _getDocuments(client, httpRequest, ids, {
    ...opts,
    signal
  }));
}
function _getDocuments(client, httpRequest, ids, opts = {}) {
  return _request(client, httpRequest, _getDocumentsOptions(client, ids, opts)).then((body) => _mapGetDocuments(body, ids));
}
function _getDocumentsOptions(client, ids, opts) {
  return {
    url: _getDataUrl(client, "doc", ids.join(",")),
    tag: opts.tag,
    signal: opts.signal
  };
}
function _mapGetDocuments(body, ids) {
  let indexed = indexBy(body.documents || [], (doc) => doc._id);
  return ids.map((id) => indexed[id] || null);
}
function _documentsExistsObservable(client, httpRequest, ids, opts = {}) {
  return _observe(opts.signal, (signal) => _documentsExists(client, httpRequest, ids, {
    ...opts,
    signal
  }));
}
async function _documentsExists(client, httpRequest, ids, opts = {}) {
  let existing = /* @__PURE__ */ new Set();
  if (ids.length === 0) return existing;
  for (let i = 0; i < ids.length; i += 100) {
    let batchIds = ids.slice(i, i + 100), body = await _request(client, httpRequest, {
      url: _getDataUrl(client, "doc", batchIds.map(encodeURIComponent).join(",")),
      tag: opts.tag,
      signal: opts.signal,
      query: { excludeContent: true }
    }), missing = /* @__PURE__ */ new Set();
    for (let omitted of body.omitted || []) omitted.reason === "existence" && missing.add(omitted.id);
    for (let id of batchIds) missing.has(id) || existing.add(id);
  }
  return existing;
}
function _getReleaseDocumentsObservable(client, httpRequest, releaseId, opts = {}) {
  return _observe(opts.signal, (signal) => _getReleaseDocuments(client, httpRequest, releaseId, {
    ...opts,
    signal
  }));
}
function _getReleaseDocuments(client, httpRequest, releaseId, opts = {}) {
  return _dataRequest(client, httpRequest, "query", {
    query: "*[sanity::partOfRelease($releaseId)]",
    params: { releaseId }
  }, opts);
}
function _createIfNotExistsObservable(client, httpRequest, doc, options) {
  return _observe(options?.signal, (signal) => _createIfNotExists(client, httpRequest, doc, {
    ...options,
    signal
  }));
}
function _createOrReplaceObservable(client, httpRequest, doc, options) {
  return _observe(options?.signal, (signal) => _createOrReplace(client, httpRequest, doc, {
    ...options,
    signal
  }));
}
function _createVersionObservable(client, httpRequest, doc, publishedId, options) {
  return _observe(options?.signal, (signal) => _createVersion(client, httpRequest, doc, publishedId, {
    ...options,
    signal
  }));
}
function _createVersionFromBaseObservable(client, httpRequest, publishedId, baseId, releaseId, ifBaseRevisionId, options) {
  return _observe(options?.signal, (signal) => _createVersionFromBase(client, httpRequest, publishedId, baseId, releaseId, ifBaseRevisionId, {
    ...options,
    signal
  }));
}
function _deleteObservable(client, httpRequest, selection, options) {
  return _observe(options?.signal, (signal) => _delete$1(client, httpRequest, selection, {
    ...options,
    signal
  }));
}
function _discardVersionObservable(client, httpRequest, versionId, purge = false, options) {
  return _observe(options?.signal, (signal) => _discardVersion(client, httpRequest, versionId, purge, {
    ...options,
    signal
  }));
}
function _replaceVersionObservable(client, httpRequest, doc, options) {
  return _observe(options?.signal, (signal) => _replaceVersion(client, httpRequest, doc, {
    ...options,
    signal
  }));
}
function _unpublishVersionObservable(client, httpRequest, versionId, publishedId, options) {
  return _observe(options?.signal, (signal) => _unpublishVersion(client, httpRequest, versionId, publishedId, {
    ...options,
    signal
  }));
}
function _mutateObservable(client, httpRequest, mutations, options) {
  return _observe(options?.signal, (signal) => _mutate(client, httpRequest, mutations, {
    ...options,
    signal
  }));
}
function _actionObservable(client, httpRequest, actions, options) {
  return _observe(options?.signal, (signal) => _action(client, httpRequest, actions, {
    ...options,
    signal
  }));
}
function _dataRequestOptions(client, endpoint, body, options = {}) {
  let isMutation = endpoint === "mutate", isAction = endpoint === "actions", isQuery2 = endpoint === "query", strQuery = isMutation || isAction ? "" : encodeQueryString(body), useGet = !isMutation && !isAction && strQuery.length < 11264, stringQuery = useGet ? strQuery : "", returnFirst = options.returnFirst, { timeout, token, tag, headers, returnQuery, lastLiveEventId, cacheMode } = options, url = _getDataUrl(client, endpoint, stringQuery);
  return {
    reqOptions: {
      method: useGet ? "GET" : "POST",
      url,
      body: useGet ? void 0 : body,
      query: isMutation && getMutationQuery(options),
      timeout,
      headers,
      token,
      tag,
      returnQuery,
      perspective: options.perspective,
      variant: options.variant,
      resultSourceMap: options.resultSourceMap,
      lastLiveEventId: Array.isArray(lastLiveEventId) ? lastLiveEventId[0] : lastLiveEventId,
      cacheMode,
      canUseCdn: isQuery2,
      signal: options.signal,
      fetch: options.fetch,
      useAbortSignal: options.useAbortSignal,
      useCdn: options.useCdn
    },
    isMutation,
    returnFirst
  };
}
function _mapDataResponse(res, isMutation, returnFirst, returnDocuments) {
  if (!isMutation) return res;
  let results = res.results || [];
  if (returnDocuments) return returnFirst ? results[0] && results[0].document : results.map((mut) => mut.document);
  let key = returnFirst ? "documentId" : "documentIds", ids = returnFirst ? results[0] && results[0].id : results.map((mut) => mut.id);
  return {
    transactionId: res.transactionId,
    results,
    [key]: ids
  };
}
function _dataRequest(client, httpRequest, endpoint, body, options = {}) {
  let { reqOptions, isMutation, returnFirst } = _dataRequestOptions(client, endpoint, body, options);
  return _request(client, httpRequest, reqOptions).then((res) => _mapDataResponse(res, isMutation, returnFirst, options.returnDocuments));
}
function _createObservable(client, httpRequest, doc, op, options = {}) {
  return _observe(options.signal, (signal) => _create$1(client, httpRequest, doc, op, {
    ...options,
    signal
  }));
}
function _create$1(client, httpRequest, doc, op, options = {}) {
  let mutation = { [op]: doc }, opts = Object.assign({
    returnFirst: true,
    returnDocuments: true
  }, options);
  return _dataRequest(client, httpRequest, "mutate", { mutations: [mutation] }, opts);
}
function _action(client, httpRequest, actions, options) {
  return _dataRequest(client, httpRequest, "actions", {
    actions: Array.isArray(actions) ? actions : [actions],
    transactionId: options && options.transactionId || void 0,
    skipCrossDatasetReferenceValidation: options && options.skipCrossDatasetReferenceValidation || void 0,
    dryRun: options && options.dryRun || void 0
  }, options);
}
function _mutate(client, httpRequest, mutations, options) {
  let mut;
  return mut = mutations instanceof Patch || mutations instanceof ObservablePatch ? { patch: mutations.serialize() } : mutations instanceof Transaction || mutations instanceof ObservableTransaction ? mutations.serialize() : mutations, _dataRequest(client, httpRequest, "mutate", {
    mutations: Array.isArray(mut) ? mut : [mut],
    transactionId: options && options.transactionId || void 0
  }, options);
}
function _delete$1(client, httpRequest, selection, options) {
  return _dataRequest(client, httpRequest, "mutate", { mutations: [{ delete: getSelection(selection) }] }, options);
}
function _createIfNotExists(client, httpRequest, doc, options) {
  return requireDocumentId("createIfNotExists", doc), _create$1(client, httpRequest, doc, "createIfNotExists", options);
}
function _createOrReplace(client, httpRequest, doc, options) {
  return requireDocumentId("createOrReplace", doc), _create$1(client, httpRequest, doc, "createOrReplace", options);
}
function _createVersion(client, httpRequest, doc, publishedId, options) {
  return requireDocumentId("createVersion", doc), requireDocumentType("createVersion", doc), printCreateVersionWithBaseIdWarning(), _action(client, httpRequest, {
    actionType: "sanity.action.document.version.create",
    publishedId,
    document: doc
  }, options);
}
function _createVersionFromBase(client, httpRequest, publishedId, baseId, releaseId, ifBaseRevisionId, options) {
  if (!baseId) throw Error("`createVersion()` requires `baseId` when no `document` is provided");
  if (!publishedId) throw Error("`createVersion()` requires `publishedId` when `baseId` is provided");
  return validateDocumentId("createVersion", baseId), validateDocumentId("createVersion", publishedId), _action(client, httpRequest, {
    actionType: "sanity.action.document.version.create",
    publishedId,
    baseId,
    versionId: releaseId ? getVersionId(publishedId, releaseId) : getDraftId(publishedId),
    ifBaseRevisionId
  }, options);
}
function _discardVersion(client, httpRequest, versionId, purge = false, options) {
  return _action(client, httpRequest, {
    actionType: "sanity.action.document.version.discard",
    versionId,
    purge
  }, options);
}
function _replaceVersion(client, httpRequest, doc, options) {
  return requireDocumentId("replaceVersion", doc), requireDocumentType("replaceVersion", doc), _action(client, httpRequest, {
    actionType: "sanity.action.document.version.replace",
    document: doc
  }, options);
}
function _unpublishVersion(client, httpRequest, versionId, publishedId, options) {
  return _action(client, httpRequest, {
    actionType: "sanity.action.document.version.unpublish",
    versionId,
    publishedId
  }, options);
}
const hasDataConfig = (client) => {
  let config = client.config();
  return config.dataset !== void 0 && config.projectId !== void 0 || config.resource !== void 0;
}, isQuery = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "query")), isMutate = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "mutate")), isDoc = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "doc", "")), isListener = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "listen")), isHistory = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "history", "")), isData = (client, uri) => uri.startsWith("/data/") || isQuery(client, uri) || isMutate(client, uri) || isDoc(client, uri) || isListener(client, uri) || isHistory(client, uri);
function _prepareRequest(client, options) {
  options.uri !== void 0 && printDeprecatedUriOptionWarning();
  let uri = options.uri || options.url;
  if (typeof uri != "string") throw TypeError("Request options must include a `url`");
  let config = client.config(), canUseCdn = options.canUseCdn === void 0 ? ["GET", "HEAD"].indexOf(options.method || "GET") >= 0 && isData(client, uri) : options.canUseCdn, useCdn = (options.useCdn ?? config.useCdn) && canUseCdn, tag = options.tag && config.requestTagPrefix ? [config.requestTagPrefix, options.tag].join(".") : options.tag || config.requestTagPrefix;
  if (tag && options.tag !== null && (options.query = {
    tag: requestTag(tag),
    ...options.query
  }), [
    "GET",
    "HEAD",
    "POST"
  ].indexOf(options.method || "GET") >= 0 && isQuery(client, uri)) {
    let resultSourceMap = options.resultSourceMap ?? config.resultSourceMap;
    resultSourceMap !== void 0 && resultSourceMap !== false && (options.query = {
      resultSourceMap,
      ...options.query
    });
    let perspectiveOption = options.perspective || config.perspective;
    perspectiveOption !== void 0 && (perspectiveOption === "previewDrafts" && printPreviewDraftsDeprecationWarning(), validateApiPerspective(perspectiveOption), options.query = {
      perspective: Array.isArray(perspectiveOption) ? perspectiveOption.join(",") : perspectiveOption,
      ...options.query
    }, (Array.isArray(perspectiveOption) && perspectiveOption.length > 0 || perspectiveOption === "previewDrafts" || perspectiveOption === "drafts") && useCdn && (useCdn = false, printCdnPreviewDraftsWarning()));
    let variantOption = options.variant || config.variant;
    typeof variantOption == "string" && (options.query = {
      variant: variantOption,
      ...options.query
    }), typeof variantOption == "object" && (options.query = {
      variantCondition: variantConditionsToQueryArray(variantOption),
      ...options.query
    }), options.lastLiveEventId && (options.query = {
      ...options.query,
      lastLiveEventId: options.lastLiveEventId
    }), options.returnQuery === false && (options.query = {
      returnQuery: "false",
      ...options.query
    }), useCdn && options.cacheMode == "noStale" && (options.query = {
      cacheMode: "noStale",
      ...options.query
    });
  }
  return requestOptions(config, Object.assign({}, options, { url: _getUrl(client, uri, useCdn) }));
}
function _observe(userSignal, run) {
  return new cjsExports.Observable((subscriber) => {
    let controller = new AbortController();
    return run(userSignal ? anySignal([userSignal, controller.signal]) : controller.signal).then((value) => {
      subscriber.next(value), subscriber.complete();
    }, (err) => subscriber.error(err)), () => controller.abort();
  });
}
function _request(client, httpRequest, options) {
  return httpRequest(_prepareRequest(client, options), client.config().requestHandler).then((body) => body);
}
function _requestObservable(client, httpRequest, options) {
  return _observe(options.signal, (signal) => _request(client, httpRequest, {
    ...options,
    signal
  }));
}
function _uploadObservable(client, options) {
  let reqOptions = _prepareRequest(client, options), requester = client.config().requester, request = new cjsExports.Observable((subscriber) => requester(reqOptions).subscribe(subscriber)).pipe(operatorsExports.filter((event) => event?.type === "progress" || event?.type === "response"), operatorsExports.map((event) => event.type === "progress" ? {
    type: "progress",
    stage: event.stage,
    percent: event.percent,
    total: event.total,
    loaded: event.loaded,
    lengthComputable: event.lengthComputable
  } : {
    type: "response",
    body: event.body
  }));
  return options.signal ? request.pipe(_withAbortSignal(options.signal)) : request;
}
function _getDataUrl(client, operation, path) {
  let config = client.config();
  if (config.resource) return resourceConfig(config), `${resourceDataBase(config)}/${path === void 0 ? operation : `${operation}/${path}`}`.replace(/\/($|\?)/, "$1");
  let baseUri = `/${operation}/${hasDataset(config)}`;
  return `/data${path === void 0 ? baseUri : `${baseUri}/${path}`}`.replace(/\/($|\?)/, "$1");
}
function _getUrl(client, uri, canUseCdn = false) {
  let { url, cdnUrl } = client.config();
  return `${canUseCdn ? cdnUrl : url}/${uri.replace(/^\//, "")}`;
}
function _withAbortSignal(signal) {
  return (input) => new cjsExports.Observable((observer) => {
    let abort = () => observer.error(_createAbortError(signal));
    if (signal && signal.aborted) {
      abort();
      return;
    }
    let subscription = input.subscribe(observer);
    return signal.addEventListener("abort", abort), () => {
      signal.removeEventListener("abort", abort), subscription.unsubscribe();
    };
  });
}
function _createAbortError(signal) {
  return new DOMException(signal?.reason ?? "The operation was aborted.", "AbortError");
}
const resourceDataBase = (config) => {
  let resource = config.resource;
  if (!resource) throw Error("`resource` must be provided to perform resource queries");
  let { type, id } = resource;
  switch (type) {
    case "dataset": {
      let segments = id.split(".");
      if (segments.length !== 2) throw Error('Dataset ID must be in the format "project.dataset"');
      return `/projects/${segments[0]}/datasets/${segments[1]}`;
    }
    case "canvas":
      return `/canvases/${id}`;
    case "knowledge-base":
      return `/knowledge-bases/${id}`;
    case "media-library":
      return `/media-libraries/${id}`;
    case "dashboard":
      return `/dashboards/${id}`;
    default:
      throw Error(`Unsupported resource type: ${type.toString()}`);
  }
};
function variantConditionsToQueryArray(variantConditions) {
  return Object.entries(variantConditions).map(([condition, value]) => `${condition}:${value}`).toSorted();
}
function _generateObservable(client, httpRequest, request) {
  return _requestObservable(client, httpRequest, {
    method: "POST",
    url: `/agent/action/generate/${hasDataset(client.config())}`,
    body: request
  });
}
function _generate(client, httpRequest, request) {
  return _request(client, httpRequest, {
    method: "POST",
    url: `/agent/action/generate/${hasDataset(client.config())}`,
    body: request
  });
}
function _patch(client, httpRequest, request) {
  return _request(client, httpRequest, {
    method: "POST",
    url: `/agent/action/patch/${hasDataset(client.config())}`,
    body: request
  });
}
function _prompt(client, httpRequest, request) {
  return _request(client, httpRequest, {
    method: "POST",
    url: `/agent/action/prompt/${hasDataset(client.config())}`,
    body: request
  });
}
function _transformObservable(client, httpRequest, request) {
  return _requestObservable(client, httpRequest, {
    method: "POST",
    url: `/agent/action/transform/${hasDataset(client.config())}`,
    body: request
  });
}
function _transform(client, httpRequest, request) {
  return _request(client, httpRequest, {
    method: "POST",
    url: `/agent/action/transform/${hasDataset(client.config())}`,
    body: request
  });
}
function _translateObservable(client, httpRequest, request) {
  return _requestObservable(client, httpRequest, {
    method: "POST",
    url: `/agent/action/translate/${hasDataset(client.config())}`,
    body: request
  });
}
function _translate(client, httpRequest, request) {
  return _request(client, httpRequest, {
    method: "POST",
    url: `/agent/action/translate/${hasDataset(client.config())}`,
    body: request
  });
}
var ObservableAgentsActionClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Run an instruction to generate content in a target document.
  * @param request - instruction request
  */
  generate(request) {
    return _generateObservable(this.#client, this.#httpRequest, request);
  }
  /**
  * Transform a target document based on a source.
  * @param request - translation request
  */
  transform(request) {
    return _transformObservable(this.#client, this.#httpRequest, request);
  }
  /**
  * Translate a target document based on a source.
  * @param request - translation request
  */
  translate(request) {
    return _translateObservable(this.#client, this.#httpRequest, request);
  }
}, AgentActionsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Run an instruction to generate content in a target document.
  * @param request - instruction request
  */
  generate(request) {
    return _generate(this.#client, this.#httpRequest, request);
  }
  /**
  * Transform a target document based on a source.
  * @param request - translation request
  */
  transform(request) {
    return _transform(this.#client, this.#httpRequest, request);
  }
  /**
  * Translate a target document based on a source.
  * @param request - translation request
  */
  translate(request) {
    return _translate(this.#client, this.#httpRequest, request);
  }
  /**
  * Run a raw instruction and return the result either as text or json
  * @param request - prompt request
  */
  prompt(request) {
    return _prompt(this.#client, this.#httpRequest, request);
  }
  /**
  * Patch a document using a schema aware API.
  * Does not use an LLM, but uses the schema to ensure paths and values matches the schema.
  * @param request - instruction request
  */
  patch(request) {
    return _patch(this.#client, this.#httpRequest, request);
  }
}, ObservableAssetsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  upload(assetType, body, options) {
    return _upload(this.#client, this.#httpRequest, assetType, body, options);
  }
}, AssetsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  upload(assetType, body, options) {
    let observable = _upload(this.#client, this.#httpRequest, assetType, body, options);
    return cjsExports.lastValueFrom(observable.pipe(operatorsExports.filter((event) => event.type === "response"), operatorsExports.map((event) => pluckUploadedAsset(event.body))));
  }
};
function isMediaLibraryUploadBody(body) {
  return "asset" in body;
}
function pluckUploadedAsset(body) {
  return isMediaLibraryUploadBody(body) ? body.asset : body.document;
}
function _upload(client, _httpRequest, assetType, body, opts = {}) {
  validateAssetType(assetType);
  let meta = opts.extract || void 0;
  meta && !meta.length && (meta = ["none"]);
  let config = client.config(), options = optionsFromFile(opts, body), { tag, label, title, description, creditLine, filename, source } = options, isMediaLibrary = config.resource?.type === "media-library", query = isMediaLibrary ? {
    title,
    filename
  } : {
    label,
    title,
    description,
    filename,
    meta,
    creditLine
  };
  source && !isMediaLibrary && (query.sourceId = source.id, query.sourceName = source.name, query.sourceUrl = source.url);
  let headers = options.contentType ? { "Content-Type": options.contentType } : {}, baseRequest = {
    tag,
    method: "POST",
    timeout: options.timeout || 0,
    url: buildAssetUploadUrl(config, assetType),
    headers,
    query,
    body
  };
  return typeof XMLHttpRequest < "u" ? cjsExports.defer(async () => {
    let { uploadWithProgress: uploadWithProgress2 } = await Promise.resolve().then(function() {
      return browserUploadQxCD0Hp6;
    }), req = _prepareRequest(client, { ...baseRequest });
    return uploadWithProgress2({
      url: appendQuery(req.url, req.query),
      method: req.method ?? "POST",
      headers: req.headers,
      body,
      withCredentials: req.credentials === "include",
      timeout: typeof req.timeout == "object" ? req.timeout.total : req.timeout,
      signal: req.signal
    });
  }).pipe(operatorsExports.mergeAll()) : _uploadObservable(client, baseRequest);
}
function appendQuery(url, query) {
  if (!query) return url;
  let qs = (query instanceof URLSearchParams ? query : new URLSearchParams(Object.entries(query).flatMap(([key, value]) => value == null ? [] : [[key, `${value}`]]))).toString();
  return qs ? url + (url.includes("?") ? "&" : "?") + qs : url;
}
function buildAssetUploadUrl(config, assetType) {
  let assetTypeEndpoint = assetType === "image" ? "images" : "files", resource = config.resource;
  if (resource) {
    let { type, id } = resource;
    switch (type) {
      case "dataset":
        throw Error("Assets are not supported for dataset resources, yet. Configure the client with `{projectId: <projectId>, dataset: <datasetId>}` instead.");
      case "canvas":
        return `/canvases/${id}/assets/${assetTypeEndpoint}`;
      case "knowledge-base":
        throw Error("Assets are not supported for knowledge-base resources. Use `client.context.imports` to add content instead.");
      case "media-library":
        return `/media-libraries/${id}/upload`;
      case "dashboard":
        return `/dashboards/${id}/assets/${assetTypeEndpoint}`;
      default:
        throw Error(`Unsupported resource type: ${type.toString()}`);
    }
  }
  return `assets/${assetTypeEndpoint}/${hasDataset(config)}`;
}
function optionsFromFile(opts, file) {
  return typeof File > "u" || !(file instanceof File) ? opts : Object.assign({
    filename: opts.preserveFilename === false ? void 0 : file.name,
    contentType: file.type
  }, opts);
}
var defaults_default = (obj, defaults) => Object.keys(defaults).concat(Object.keys(obj)).reduce((target, prop) => (target[prop] = obj[prop] === void 0 ? defaults[prop] : obj[prop], target), {});
const pick = (obj, props) => props.reduce((selection, prop) => (obj[prop] === void 0 || (selection[prop] = obj[prop]), selection), {}), RETRYABLE_STATUSES = /* @__PURE__ */ new Set([408, 429]);
function reconnectOnConnectionFailure() {
  return function(source) {
    return source.pipe(cjsExports.catchError((err, caught) => err instanceof ConnectionFailedError && (typeof err.status != "number" || err.status < 400 || err.status >= 500 || RETRYABLE_STATUSES.has(err.status)) ? cjsExports.concat(cjsExports.of({ type: "reconnect" }), cjsExports.timer(1e3).pipe(cjsExports.mergeMap(() => caught))) : cjsExports.throwError(() => err)));
  };
}
function resolveEventSourceFetch(config, options = {}) {
  let extraHeaders = options.headers, credentials = options.withCredentials ? "include" : void 0;
  return function eventSourceFetch(url, init) {
    let baseFetch = pickBaseFetch(config), mergedInit = { ...init };
    if (extraHeaders) {
      let headers = new Headers(init?.headers);
      for (let [key, value] of Object.entries(extraHeaders)) headers.set(key, value);
      mergedInit.headers = headers;
    }
    return credentials !== void 0 && (mergedInit.credentials = credentials), baseFetch(typeof url == "string" ? url : url.href, mergedInit);
  };
}
function pickBaseFetch(config) {
  return config.resolveFetch ? config.resolveFetch(typeof config.proxy == "string" ? config.proxy : void 0) : globalThis.fetch.bind(globalThis);
}
const possibleOptions = [
  "includePreviousRevision",
  "includeResult",
  "includeMutations",
  "includeAllVersions",
  "visibility",
  "effectFormat",
  "enableResume",
  "tag"
], defaultOptions = { includeResult: true };
function _listen$2(query, params, opts = {}) {
  let { url, requestTagPrefix } = this.config(), tag = opts.tag && requestTagPrefix ? [requestTagPrefix, opts.tag].join(".") : opts.tag, options = {
    ...defaults_default(opts, defaultOptions),
    tag
  }, listenOpts = pick(options, possibleOptions), qs = encodeQueryString({
    query,
    params,
    options: {
      tag,
      ...listenOpts
    }
  }), uri = `${url}${_getDataUrl(this, "listen", qs)}`;
  if (uri.length > 14800) return cjsExports.throwError(() => /* @__PURE__ */ Error("Query too large for listener"));
  let listenFor = options.events ? options.events : ["mutation"];
  return _connectListenEventSource(this, uri, listenFor);
}
function _connectListenEventSource(client, uri, listenFor) {
  let config = client.config(), { token, withCredentials, headers: configHeaders } = config, headers = {};
  token && (headers.Authorization = `Bearer ${token}`), configHeaders && Object.assign(headers, configHeaders);
  let initEventSource = () => new EventSource(uri, { fetch: resolveEventSourceFetch(config, {
    headers: Object.keys(headers).length ? headers : void 0,
    withCredentials
  }) });
  return connectEventSource(initEventSource, listenFor).pipe(reconnectOnConnectionFailure(), operatorsExports.filter((event) => listenFor.includes(event.type)), operatorsExports.map((event) => ({
    type: event.type,
    ..."data" in event ? event.data : {}
  })));
}
const possibleRequestOptions = [
  "headers",
  "signal",
  "tag",
  "timeout",
  "token"
];
function commentUrl(id) {
  if (!id) throw Error("Comment ID must be provided");
  return `/collaboration/comments/${encodeURIComponent(id)}`;
}
function resolveCommentResource(client) {
  let { resource, projectId: projectId2, dataset: dataset2 } = client.config();
  if (resource) return resource;
  if (projectId2 && dataset2) return {
    type: "dataset",
    id: `${projectId2}.${dataset2}`
  };
  throw Error("`resource` or `projectId` and `dataset` must be configured to use collaboration comments");
}
function resourceQuery(client) {
  let { collaboration } = client.config(), organizationId = collaboration?.organizationId;
  if (!organizationId) throw Error("`collaboration.organizationId` must be configured to use collaboration comments");
  let resource = resolveCommentResource(client);
  return {
    organizationId,
    resourceId: resource.id,
    resourceType: resource.type
  };
}
function _getTargetDocumentRef(client, documentId) {
  if (!documentId) throw Error("Document ID must be provided");
  let resource = resolveCommentResource(client);
  return `${resource.type}:${resource.id}:${getPublishedId$1(documentId)}`;
}
function write(client, httpRequest, method, url, body, options = {}) {
  return _requestObservable(client, httpRequest, {
    method,
    url,
    body,
    query: {
      ...resourceQuery(client),
      ...options.transactionId ? { transactionId: options.transactionId } : {}
    },
    ...pick(options, possibleRequestOptions)
  });
}
function writeDocument(commentId, ...args) {
  return write(...args).pipe(operatorsExports.map(({ results }) => {
    let result = commentId ? results.find(({ id }) => id === commentId) : results[0];
    if (!result?.document) throw Error("Comment write did not return a comment document");
    return result.document;
  }));
}
function writeMutationResult(...args) {
  return write(...args).pipe(operatorsExports.map(({ transactionId, results }) => ({
    transactionId,
    documentIds: results.map((result) => result.id),
    results
  })));
}
function _create(client, httpRequest, body, options) {
  return writeDocument(body._id, client, httpRequest, "POST", "/collaboration/comments", body, options);
}
function _update(client, httpRequest, id, body, options) {
  return writeDocument(id, client, httpRequest, "PATCH", commentUrl(id), body, options);
}
function _delete(client, httpRequest, id, options) {
  return writeMutationResult(client, httpRequest, "DELETE", commentUrl(id), void 0, options);
}
function _addReaction(client, httpRequest, id, shortName, options) {
  return writeDocument(id, client, httpRequest, "POST", `${commentUrl(id)}/reactions`, { shortName }, options);
}
function _removeReaction(client, httpRequest, id, shortName, options) {
  return writeDocument(id, client, httpRequest, "DELETE", `${commentUrl(id)}/reactions/${encodeURIComponent(shortName)}`, void 0, options);
}
function _fetch$1(client, httpRequest, query, params, options) {
  let search = resourceQuery(client);
  return _requestObservable(client, httpRequest, {
    ...encodeQueryString({
      query,
      params
    }).length < 11264 ? {
      method: "GET",
      url: `/collaboration/comments/query${encodeQueryString({
        query,
        params,
        options: search
      })}`
    } : {
      method: "POST",
      url: "/collaboration/comments/query",
      query: search,
      body: {
        query,
        params: params ?? {}
      }
    },
    ...pick(options || {}, possibleRequestOptions)
  }).pipe(operatorsExports.map((response) => response.result));
}
function _listen$1(client, query, params, options) {
  let opts = options ?? {}, { requestTagPrefix } = client.config(), tag = opts.tag && requestTagPrefix ? [requestTagPrefix, opts.tag].join(".") : opts.tag, listenOpts = pick({
    ...defaults_default(opts, defaultOptions),
    tag
  }, possibleOptions), qs = encodeQueryString({
    query,
    params,
    options: {
      ...listenOpts,
      ...resourceQuery(client)
    }
  }), uri = `${client.getUrl("/collaboration/comments/listen")}${qs}`;
  return uri.length > 14800 ? cjsExports.throwError(() => /* @__PURE__ */ Error("Query too large for listener")) : _connectListenEventSource(client, uri, opts.events ? opts.events : ["mutation"]);
}
var ObservableCollaborationCommentsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Create a comment or reply on the configured resource.
  *
  * A top-level comment requires `target`; a reply requires `parentCommentId` (never both).
  * Replies inherit `target`, `status`, and `threadId` from the parent comment.
  *
  * @param body - Comment to create
  * @param options - Optional request options
  * @returns The created comment
  */
  create(body, options) {
    return _create(this.#client, this.#httpRequest, body, options);
  }
  /**
  * Update an existing comment.
  *
  * Updating `status` cascades to the comment's replies.
  *
  * @param id - Comment document ID
  * @param body - Fields to update
  * @param options - Optional request options
  * @returns The updated comment
  */
  update(id, body, options) {
    return _update(this.#client, this.#httpRequest, id, body, options);
  }
  /**
  * Delete a comment and its replies.
  *
  * @param id - Comment document ID
  * @param options - Optional request options
  * @returns Mutation result, where `documentIds` covers the comment and every deleted reply
  */
  delete(id, options) {
    return _delete(this.#client, this.#httpRequest, id, options);
  }
  /**
  * Add the current user's reaction to a comment.
  *
  * @param id - Comment document ID
  * @param shortName - Emoji short name, for example `:+1:`
  * @param options - Optional request options
  * @returns The comment, with the reaction applied
  */
  addReaction(id, shortName, options) {
    return _addReaction(this.#client, this.#httpRequest, id, shortName, options);
  }
  /**
  * Remove the current user's reaction from a comment.
  *
  * @param id - Comment document ID
  * @param shortName - Emoji short name, for example `:+1:`
  * @param options - Optional request options
  * @returns The comment, with the reaction removed
  */
  removeReaction(id, shortName, options) {
    return _removeReaction(this.#client, this.#httpRequest, id, shortName, options);
  }
  /**
  * Build the global document reference used by `target.document._ref`, for use in
  * queries and listeners.
  *
  * The reference is built from the configured `resource` and the published ID of
  * the given document ID, since comment references always use published IDs.
  *
  * @example
  * ```ts
  * client.collaboration.comments.listen(
  *   '*[_type == "sanity.comment" && target.document._ref == $ref]',
  *   {ref: client.collaboration.comments.getTargetDocumentRef('doc-1')},
  * )
  * ```
  *
  * @param documentId - Document ID, in published, draft or version form
  * @returns Global document reference, of the form `resourceType:resourceId:documentId`
  */
  getTargetDocumentRef(documentId) {
    return _getTargetDocumentRef(this.#client, documentId);
  }
  /**
  * Fetch comments on the configured resource.
  *
  * Takes the same `query` and `params` as `client.fetch`, and switches from a
  * GET to a POST for queries too large for the request URL in the same way,
  * but queries the comments endpoint, which accepts none of the query options
  * `client.fetch` does (`perspective`, `useCdn`, `filterResponse`,
  * `resultSourceMap`, stega).
  *
  * The query runs against the organization store, which is not scoped to
  * comments, so filter on `_type == "sanity.comment"`.
  *
  * @param query - GROQ-query to perform
  * @param params - Optional query parameters
  * @param options - Optional request options
  */
  fetch(query, params, options) {
    return _fetch$1(this.#client, this.#httpRequest, query, params, options);
  }
  listen(query, params, options) {
    return _listen$1(this.#client, query, params, options);
  }
}, CollaborationCommentsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Create a comment or reply on the configured resource.
  *
  * A top-level comment requires `target`; a reply requires `parentCommentId` (never both).
  * Replies inherit `target`, `status`, and `threadId` from the parent comment.
  *
  * @param body - Comment to create
  * @param options - Optional request options
  * @returns The created comment
  */
  create(body, options) {
    return cjsExports.lastValueFrom(_create(this.#client, this.#httpRequest, body, options));
  }
  /**
  * Update an existing comment.
  *
  * Updating `status` cascades to the comment's replies.
  *
  * @param id - Comment document ID
  * @param body - Fields to update
  * @param options - Optional request options
  * @returns The updated comment
  */
  update(id, body, options) {
    return cjsExports.lastValueFrom(_update(this.#client, this.#httpRequest, id, body, options));
  }
  /**
  * Delete a comment and its replies.
  *
  * @param id - Comment document ID
  * @param options - Optional request options
  * @returns Mutation result, where `documentIds` covers the comment and every deleted reply
  */
  delete(id, options) {
    return cjsExports.lastValueFrom(_delete(this.#client, this.#httpRequest, id, options));
  }
  /**
  * Add the current user's reaction to a comment.
  *
  * @param id - Comment document ID
  * @param shortName - Emoji short name, for example `:+1:`
  * @param options - Optional request options
  * @returns The comment, with the reaction applied
  */
  addReaction(id, shortName, options) {
    return cjsExports.lastValueFrom(_addReaction(this.#client, this.#httpRequest, id, shortName, options));
  }
  /**
  * Remove the current user's reaction from a comment.
  *
  * @param id - Comment document ID
  * @param shortName - Emoji short name, for example `:+1:`
  * @param options - Optional request options
  * @returns The comment, with the reaction removed
  */
  removeReaction(id, shortName, options) {
    return cjsExports.lastValueFrom(_removeReaction(this.#client, this.#httpRequest, id, shortName, options));
  }
  /**
  * Build the global document reference used by `target.document._ref`, for use in
  * queries and listeners.
  *
  * The reference is built from the configured `resource` and the published ID of
  * the given document ID, since comment references always use published IDs.
  *
  * @example
  * ```ts
  * const comments = await client.collaboration.comments.fetch(
  *   '*[_type == "sanity.comment" && target.document._ref == $ref]',
  *   {ref: client.collaboration.comments.getTargetDocumentRef('doc-1')},
  * )
  * ```
  *
  * @param documentId - Document ID, in published, draft or version form
  * @returns Global document reference, of the form `resourceType:resourceId:documentId`
  */
  getTargetDocumentRef(documentId) {
    return _getTargetDocumentRef(this.#client, documentId);
  }
  /**
  * Fetch comments on the configured resource.
  *
  * Takes the same `query` and `params` as `client.fetch`, and switches from a
  * GET to a POST for queries too large for the request URL in the same way,
  * but queries the comments endpoint, which accepts none of the query options
  * `client.fetch` does (`perspective`, `useCdn`, `filterResponse`,
  * `resultSourceMap`, stega).
  *
  * The query runs against the organization store, which is not scoped to
  * comments, so filter on `_type == "sanity.comment"`.
  *
  * @param query - GROQ-query to perform
  * @param params - Optional query parameters
  * @param options - Optional request options
  */
  fetch(query, params, options) {
    return cjsExports.lastValueFrom(_fetch$1(this.#client, this.#httpRequest, query, params, options));
  }
  listen(query, params, options) {
    return _listen$1(this.#client, query, params, options);
  }
};
function _organizationId(client) {
  let organizationId = client.config().context?.organizationId;
  if (!organizationId) throw Error("`context.organizationId` must be configured to query Context documents");
  return organizationId;
}
function storeUrl(client, suffix) {
  return `/context/organizations/${encodeURIComponent(_organizationId(client))}/${suffix}`;
}
function _fetch(client, httpRequest, query, params, options) {
  let url = storeUrl(client, "query");
  return _requestObservable(client, httpRequest, {
    ...encodeQueryString({
      query,
      params
    }).length < 11264 ? {
      method: "GET",
      url: `${url}${encodeQueryString({
        query,
        params
      })}`
    } : {
      method: "POST",
      url,
      body: {
        query,
        params: params ?? {}
      }
    },
    ...pick(options || {}, possibleStoreRequestOptions)
  }).pipe(operatorsExports.map((response) => response.result));
}
function _listen(client, query, params, options) {
  let opts = options ?? {}, { requestTagPrefix } = client.config(), tag = opts.tag && requestTagPrefix ? [requestTagPrefix, opts.tag].join(".") : opts.tag, listenOpts = pick({
    ...defaults_default(opts, defaultOptions),
    tag
  }, possibleOptions), qs = encodeQueryString({
    query,
    params,
    options: listenOpts
  }), uri = `${client.getUrl(storeUrl(client, "listen"))}${qs}`;
  return uri.length > 14800 ? cjsExports.throwError(() => /* @__PURE__ */ Error("Query too large for listener")) : _connectListenEventSource(client, uri, opts.events ? opts.events : ["mutation"]);
}
const ENTRY_TYPE = "sanity.context.entry", ISSUE_TYPE = "sanity.context.issue", MCP_TYPE = "sanity.context.mcp";
function _one(client, httpRequest, query, params, options) {
  return cjsExports.lastValueFrom(_fetch(client, httpRequest, query, params, options));
}
async function _drainByCreatedAt(client, httpRequest, filter, params, options) {
  let all = [], cursor;
  for (; ; ) {
    let query = `*[${cursor ? `${filter} && (_createdAt > $c || (_createdAt == $c && _id > $i))` : filter}] | order(_createdAt asc, _id asc) [0...200]`, page = await cjsExports.lastValueFrom(_fetch(client, httpRequest, query, cursor ? {
      ...params,
      ...cursor
    } : params, options));
    if (all.push(...page), page.length < 200) return all;
    let last = page[page.length - 1];
    cursor = {
      c: last._createdAt,
      i: last._id
    };
  }
}
function _readEntry(client, httpRequest, knowledgeBaseId, path, options) {
  return _one(client, httpRequest, `*[_type == "${ENTRY_TYPE}" && knowledgeBaseId == $kb && path == $path][0]`, {
    kb: knowledgeBaseId,
    path
  }, options);
}
async function _listEntries(client, httpRequest, knowledgeBaseId, options) {
  let all = [], after = "";
  for (; ; ) {
    let page = await cjsExports.lastValueFrom(_fetch(client, httpRequest, `*[_type == "${ENTRY_TYPE}" && knowledgeBaseId == $kb && path > $after] | order(path asc) [0...200] {_id, path, title, tldr, status}`, {
      kb: knowledgeBaseId,
      after
    }, options));
    if (all.push(...page), page.length < 200) return all;
    after = page[page.length - 1].path;
  }
}
function _listIssues(client, httpRequest, knowledgeBaseId, status, options) {
  return _drainByCreatedAt(client, httpRequest, `_type == "${ISSUE_TYPE}" && knowledgeBaseId == $kb${status === void 0 ? "" : " && status == $status"}`, status === void 0 ? { kb: knowledgeBaseId } : {
    kb: knowledgeBaseId,
    status
  }, options);
}
function _readIssue(client, httpRequest, knowledgeBaseId, issueId, options) {
  return _one(client, httpRequest, `*[_type == "${ISSUE_TYPE}" && knowledgeBaseId == $kb && _id == $id][0]`, {
    kb: knowledgeBaseId,
    id: issueId
  }, options);
}
function _listInstructions(client, httpRequest, knowledgeBaseId, options) {
  return _drainByCreatedAt(client, httpRequest, '_type == "sanity.context.instruction" && knowledgeBaseId == $kb && schemaVersion == 1', { kb: knowledgeBaseId }, options);
}
function _listMcpEndpoints(client, httpRequest, options) {
  return cjsExports.lastValueFrom(_fetch(client, httpRequest, `*[_type == "${MCP_TYPE}" && organizationId == $org] | order(_createdAt asc, _id asc) [0...500]`, { org: _organizationId(client) }, options));
}
function _readMcpEndpoint(client, httpRequest, name2, options) {
  return _one(client, httpRequest, `*[_type == "${MCP_TYPE}" && organizationId == $org && name == $name][0]`, {
    org: _organizationId(client),
    name: name2
  }, options);
}
function _readConversation(client, httpRequest, threadId, options) {
  return _one(client, httpRequest, '*[_type == "sanity.context.conversation" && organizationId == $org && threadId == $threadId][0]', {
    org: _organizationId(client),
    threadId
  }, options);
}
const COLLECTION_URL = "/context/knowledge-bases";
function _resolveKnowledgeBaseId(client) {
  let resource = client.config().resource;
  if (resource?.type !== "knowledge-base") throw Error("`resource` of type `knowledge-base` must be configured to use knowledge-base methods");
  return resource.id;
}
function _knowledgeBaseUrl(knowledgeBaseId, suffix = "") {
  return `${COLLECTION_URL}/${encodeURIComponent(knowledgeBaseId)}${suffix}`;
}
function _conversationUrl(client, threadId) {
  let organizationId = client.config().context?.organizationId;
  if (!organizationId) throw Error("`context.organizationId` must be configured to record conversations");
  if (!threadId) throw Error("`threadId` must be provided");
  return `/context/organizations/${encodeURIComponent(organizationId)}/conversations/${encodeURIComponent(threadId)}`;
}
function _query(entries) {
  return Object.fromEntries(Object.entries(entries).flatMap(([key, value]) => value === void 0 ? [] : [[key, `${value}`]]));
}
function _fetchBody(file) {
  return ArrayBuffer.isView(file) ? file.buffer instanceof ArrayBuffer ? new Uint8Array(file.buffer, file.byteOffset, file.byteLength) : Uint8Array.from(file) : file;
}
var ContextClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /** Request against the configured knowledge base. */
  #request(suffix, reqOptions = {}) {
    return _request(this.#client, this.#httpRequest, {
      url: _knowledgeBaseUrl(_resolveKnowledgeBaseId(this.#client), suffix),
      ...reqOptions
    });
  }
  /** Shared shape of every paginated list endpoint scoped to the knowledge base. */
  #list(suffix, params, extraQuery) {
    return this.#request(suffix, {
      query: _query({
        cursor: params?.cursor,
        limit: params?.limit,
        ...extraQuery
      }),
      signal: params?.signal,
      tag: params?.tag
    });
  }
  async #uploadFile(params, options) {
    let staged = await this.#request("/imports/uploads", {
      method: "POST",
      body: {
        filename: params.filename,
        ...params.contentType && { contentType: params.contentType }
      },
      ...options
    }), config = this.#client.config(), putResponse = await (config.resolveFetch?.(config.proxy) ?? globalThis.fetch)(staged.uploadUrl, {
      method: "PUT",
      body: _fetchBody(params.file),
      ...params.contentType && { headers: { "content-type": params.contentType } },
      signal: options?.signal
    });
    if (!putResponse.ok) throw Error(`File upload failed: ${putResponse.status} ${putResponse.statusText}`);
    return this.#request(`/imports/uploads/${encodeURIComponent(staged.importId)}/complete`, {
      method: "POST",
      body: {},
      ...options
    });
  }
  /** The knowledge base collection: management addressed per call. */
  knowledgeBases = {
    /** Create a knowledge base. Requires the org-level knowledge-base create grant. */
    create: (params, options) => _request(this.#client, this.#httpRequest, {
      url: COLLECTION_URL,
      method: "POST",
      body: params,
      ...options
    }),
    /** List the organization's knowledge bases. */
    list: (params) => _request(this.#client, this.#httpRequest, {
      url: COLLECTION_URL,
      query: _query({
        organizationId: params.organizationId,
        cursor: params.cursor,
        limit: params.limit
      }),
      signal: params.signal,
      tag: params.tag
    }),
    /** Fetch a knowledge base by its id. */
    get: (knowledgeBaseId, options) => _request(this.#client, this.#httpRequest, {
      url: _knowledgeBaseUrl(knowledgeBaseId),
      ...options
    }),
    /** Edit a knowledge base's configuration. */
    edit: (knowledgeBaseId, params, options) => _request(this.#client, this.#httpRequest, {
      url: _knowledgeBaseUrl(knowledgeBaseId),
      method: "PATCH",
      body: params,
      ...options
    }),
    /** Delete a knowledge base and its generated content. */
    delete: async (knowledgeBaseId, options) => {
      await _request(this.#client, this.#httpRequest, {
        url: _knowledgeBaseUrl(knowledgeBaseId),
        method: "DELETE",
        ...options
      });
    }
  };
  /**
  * GROQ over the organization's Context documents (conversation telemetry
  * today; the store holds every Context family and the caller's access
  * decides what a query returns, so filter on `_type`).
  *
  * Requires `context.organizationId` in the client configuration.
  */
  fetch(query, params, options) {
    return cjsExports.lastValueFrom(_fetch(this.#client, this.#httpRequest, query, params, options));
  }
  /**
  * Listen for changes to the organization's Context documents. Mirrors
  * `client.listen(query, params, options)` and emits mutation events by
  * default.
  */
  listen(query, params, options) {
    return _listen(this.#client, query, params, options);
  }
  /**
  * Conversation telemetry. `threadId` identifies the conversation within
  * the organization — reuse means the same conversation. Beyond the canned
  * `get`, reads go through {@link fetch} and {@link listen} with GROQ
  * (`_type == "sanity.context.conversation"`).
  *
  * Requires `context.organizationId` in the client configuration.
  */
  conversations = {
    /**
    * Record a conversation. Messages replace the stored transcript
    * wholesale; `metadata` and model fields only overwrite when present.
    * Last write per thread wins — retries are safe.
    */
    save: (params, options) => {
      let { threadId, ...body } = params;
      return _request(this.#client, this.#httpRequest, {
        url: _conversationUrl(this.#client, threadId),
        method: "PUT",
        body,
        ...options
      });
    },
    /**
    * Record the classification your own model produced for one thread:
    * exactly one of `coreMetrics` (a verdict) or `classificationError`
    * (why classification failed).
    */
    classify: (params, options) => {
      let { threadId, ...body } = params;
      return _request(this.#client, this.#httpRequest, {
        url: _conversationUrl(this.#client, threadId),
        method: "PATCH",
        body,
        ...options
      });
    },
    /**
    * One recorded conversation by its thread id, or `null` when the thread
    * was never recorded. Runs:
    *
    * `*[_type == "sanity.context.conversation" && organizationId == $org && threadId == $threadId][0]`
    *
    * For anything more, use {@link fetch}.
    */
    get: (params, options) => _readConversation(this.#client, this.#httpRequest, params.threadId, options)
  };
  /**
  * Build the configured knowledge base. The server waits for pending import
  * processing before assembling, so importing and building back to back is
  * safe. Track the returned job with {@link jobs}.
  */
  build(options) {
    return this.#request("/build", {
      method: "POST",
      ...options
    });
  }
  /** Cancel the running build, if any. */
  cancelBuild(options) {
    return this.#request("/build/cancel", {
      method: "POST",
      ...options
    });
  }
  /** Run an incremental refresh: re-check sources and apply what changed. */
  refresh(options) {
    return this.#request("/refresh", {
      method: "POST",
      ...options
    });
  }
  /** Imports: feed content into the configured knowledge base. */
  imports = {
    /**
    * Import content. One entry point, discriminated on `type`: inline
    * `text`, a website `crawl`, a Sanity `dataset` bind, or a `file`
    * upload. Processing queues automatically. The file variant stages the
    * upload, PUTs the bytes to a signed storage URL, and confirms; the
    * bytes never pass through the Context API.
    */
    create: (params, options) => params.type === "file" ? this.#uploadFile(params, options) : this.#request("/imports", {
      method: "POST",
      body: params,
      ...options
    }),
    list: (params) => this.#list("/imports", params),
    get: (params, options) => this.#request(`/imports/${encodeURIComponent(params.importId)}`, options),
    /** A short-lived signed URL for the original uploaded bytes. */
    download: (params, options) => this.#request(`/imports/${encodeURIComponent(params.importId)}/download`, options),
    delete: async (params, options) => {
      await this.#request(`/imports/${encodeURIComponent(params.importId)}`, {
        method: "DELETE",
        ...options
      });
    }
  };
  /** Jobs: poll async work (builds, imports) to a terminal state. */
  jobs = { get: (params, options) => this.#request(`/jobs/${encodeURIComponent(params.jobId)}`, options) };
  /**
  * Issues: findings from builds awaiting triage. Reads are canned GROQ
  * queries against the organization's document store; for anything more,
  * use {@link fetch}. Reads require `context.organizationId` alongside the
  * knowledge-base `resource` in the client configuration.
  */
  issues = {
    /**
    * Every issue on the knowledge base, oldest first, optionally narrowed
    * to one status. Drains keyset pages internally and resolves with the
    * complete set. Runs:
    *
    * `*[_type == "sanity.context.issue" && knowledgeBaseId == $kb && status == $status] | order(_createdAt asc, _id asc)`
    *
    * (the status clause only when given). For anything more, use {@link fetch}.
    */
    list: (params, options) => _listIssues(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), params?.status, options),
    /**
    * One issue by its document id, or `null` when it does not exist. Runs:
    *
    * `*[_type == "sanity.context.issue" && knowledgeBaseId == $kb && _id == $id][0]`
    *
    * For anything more, use {@link fetch}.
    */
    get: (params, options) => _readIssue(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), params.issueId, options),
    /** Resolve a conflict issue. Mints the standing instruction, same as the dashboard. */
    resolve: (params, options) => {
      let { issueId, ...body } = params;
      return this.#request(`/issues/${encodeURIComponent(issueId)}/resolve`, {
        method: "POST",
        body,
        ...options
      });
    },
    dismiss: (params, options) => this.#request(`/issues/${encodeURIComponent(params.issueId)}/dismiss`, {
      method: "POST",
      ...options
    }),
    reopen: (params, options) => this.#request(`/issues/${encodeURIComponent(params.issueId)}/reopen`, {
      method: "POST",
      ...options
    }),
    /** Apply already-accepted issues to the knowledge base in one batch. */
    apply: (params, options) => this.#request("/issues/apply", {
      method: "POST",
      body: params,
      ...options
    })
  };
  /** Instructions: standing decisions that steer every build. */
  instructions = {
    create: (params, options) => this.#request("/instructions", {
      method: "POST",
      body: params,
      ...options
    }),
    /**
    * Every current-schema instruction on the knowledge base, oldest first.
    * Drains keyset pages internally and resolves with the complete set.
    * Runs:
    *
    * `*[_type == "sanity.context.instruction" && knowledgeBaseId == $kb && schemaVersion == 1] | order(_createdAt asc, _id asc)`
    *
    * For anything more, use {@link fetch}. Requires `context.organizationId`
    * alongside the knowledge-base `resource` in the client configuration.
    */
    list: (options) => _listInstructions(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), options),
    edit: (params, options) => {
      let { instructionId, ...body } = params;
      return this.#request(`/instructions/${encodeURIComponent(instructionId)}`, {
        method: "PATCH",
        body,
        ...options
      });
    },
    delete: async (params, options) => {
      await this.#request(`/instructions/${encodeURIComponent(params.instructionId)}`, {
        method: "DELETE",
        ...options
      });
    }
  };
  /**
  * Entries: the built outline, one entry per node. Reads are canned GROQ
  * queries against the organization's document store; for anything more,
  * use {@link fetch}. Requires `context.organizationId` alongside the
  * knowledge-base `resource` in the client configuration.
  */
  entries = {
    /**
    * Every entry, path-ordered, as a metadata view (`_id`, `path`,
    * `title`, `tldr`, `status`) with bodies excluded. Drains keyset pages
    * internally and resolves with the complete set. Runs:
    *
    * `*[_type == "sanity.context.entry" && knowledgeBaseId == $kb && path > $after] | order(path asc) [0...200] {_id, path, title, tldr, status}`
    *
    * For bodies, use `entries.get` or {@link fetch}.
    */
    list: (options) => _listEntries(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), options),
    /**
    * One entry with its full body and citations, by outline path (e.g.
    * `billing/refunds`), or `null` when no entry sits at that path. Runs:
    *
    * `*[_type == "sanity.context.entry" && knowledgeBaseId == $kb && path == $path][0]`
    *
    * For anything more, use {@link fetch}.
    */
    get: (params, options) => _readEntry(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), params.path, options),
    /**
    * Rebuild one entry from its already-placed sources, by outline path.
    * Poll the returned job with {@link jobs}; `affectedEntries` lists every
    * entry the rebuild touches.
    */
    rebuild: (params, options) => this.#request(`/entries/${encodeURIComponent(params.path)}/rebuild`, {
      method: "POST",
      ...options
    })
  };
  /**
  * MCP endpoint configurations, org-owned documents read with canned GROQ
  * queries. Requires `context.organizationId` in the client configuration.
  */
  mcpEndpoints = {
    /**
    * The organization's MCP endpoint configurations, oldest first. Runs:
    *
    * `*[_type == "sanity.context.mcp" && organizationId == $org] | order(_createdAt asc, _id asc) [0...500]`
    *
    * For anything more, use {@link fetch}.
    */
    list: (options) => _listMcpEndpoints(this.#client, this.#httpRequest, options),
    /**
    * One MCP endpoint configuration by its URL name, or `null` when none
    * carries that name. Runs:
    *
    * `*[_type == "sanity.context.mcp" && organizationId == $org && name == $name][0]`
    *
    * For anything more, use {@link fetch}.
    */
    get: (params, options) => _readMcpEndpoint(this.#client, this.#httpRequest, params.name, options)
  };
  /** Sources: the distilled units builds cite. */
  sources = {
    /**
    * List sources, optionally filtered by `status` or the `importId` they
    * came from. `ids` is a lookup mode: it resolves those exact sources
    * (e.g. from an entry's citations) and overrides `status` and `cursor`.
    */
    list: (params) => this.#list("/sources", params, {
      status: params?.status,
      importId: params?.importId,
      ids: params?.ids?.join(",")
    }),
    get: (params, options) => this.#request(`/sources/${encodeURIComponent(params.sourceId)}`, options),
    /**
    * Distilled source content, optionally a line range: the evidence behind
    * a citation or an issue.
    */
    content: (params, options) => this.#request(`/sources/${encodeURIComponent(params.sourceId)}/content`, {
      query: _query({
        startLine: params.startLine,
        endLine: params.endLine
      }),
      ...options
    }),
    delete: async (params, options) => {
      await this.#request(`/sources/${encodeURIComponent(params.sourceId)}`, {
        method: "DELETE",
        ...options
      });
    }
  };
}, ObservableContextClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /** The knowledge base collection: management addressed per call. */
  knowledgeBases = {
    /** Create a knowledge base. Requires the org-level knowledge-base create grant. */
    create: (params, options) => _observe(options?.signal, (signal) => _request(this.#client, this.#httpRequest, {
      url: COLLECTION_URL,
      method: "POST",
      body: params,
      tag: options?.tag,
      signal
    })),
    /** List the organization's knowledge bases. */
    list: (params) => _observe(params.signal, (signal) => _request(this.#client, this.#httpRequest, {
      url: COLLECTION_URL,
      query: _query({
        organizationId: params.organizationId,
        cursor: params.cursor,
        limit: params.limit
      }),
      tag: params.tag,
      signal
    })),
    /** Fetch a knowledge base by its id. */
    get: (knowledgeBaseId, options) => _observe(options?.signal, (signal) => _request(this.#client, this.#httpRequest, {
      url: _knowledgeBaseUrl(knowledgeBaseId),
      tag: options?.tag,
      signal
    })),
    /** Edit a knowledge base's configuration. */
    edit: (knowledgeBaseId, params, options) => _observe(options?.signal, (signal) => _request(this.#client, this.#httpRequest, {
      url: _knowledgeBaseUrl(knowledgeBaseId),
      method: "PATCH",
      body: params,
      tag: options?.tag,
      signal
    })),
    /** Delete a knowledge base and its generated content. */
    delete: (knowledgeBaseId, options) => _observe(options?.signal, (signal) => _request(this.#client, this.#httpRequest, {
      url: _knowledgeBaseUrl(knowledgeBaseId),
      method: "DELETE",
      tag: options?.tag,
      signal
    }))
  };
  /**
  * GROQ over the organization's Context documents (conversation telemetry
  * today; the store holds every Context family and the caller's access
  * decides what a query returns, so filter on `_type`).
  *
  * Requires `context.organizationId` in the client configuration.
  */
  fetch(query, params, options) {
    return _fetch(this.#client, this.#httpRequest, query, params, options);
  }
  /**
  * Listen for changes to the organization's Context documents. Mirrors
  * `client.listen(query, params, options)` and emits mutation events by
  * default.
  */
  listen(query, params, options) {
    return _listen(this.#client, query, params, options);
  }
  /**
  * Conversation telemetry. `threadId` identifies the conversation within
  * the organization — reuse means the same conversation. Beyond the canned
  * `get`, reads go through {@link fetch} and {@link listen} with GROQ
  * (`_type == "sanity.context.conversation"`).
  *
  * Requires `context.organizationId` in the client configuration.
  */
  conversations = {
    /**
    * Record a conversation. Messages replace the stored transcript
    * wholesale; `metadata` and model fields only overwrite when present.
    * Last write per thread wins — retries are safe.
    */
    save: (params, options) => {
      let { threadId, ...body } = params;
      return _observe(options?.signal, (signal) => _request(this.#client, this.#httpRequest, {
        url: _conversationUrl(this.#client, threadId),
        method: "PUT",
        body,
        tag: options?.tag,
        signal
      }));
    },
    /**
    * Record the classification your own model produced for one thread:
    * exactly one of `coreMetrics` (a verdict) or `classificationError`
    * (why classification failed).
    */
    classify: (params, options) => {
      let { threadId, ...body } = params;
      return _observe(options?.signal, (signal) => _request(this.#client, this.#httpRequest, {
        url: _conversationUrl(this.#client, threadId),
        method: "PATCH",
        body,
        tag: options?.tag,
        signal
      }));
    },
    /**
    * One recorded conversation by its thread id, or `null` when the thread
    * was never recorded. Runs:
    *
    * `*[_type == "sanity.context.conversation" && organizationId == $org && threadId == $threadId][0]`
    *
    * For anything more, use {@link fetch}.
    */
    get: (params, options) => _observe(options?.signal, (signal) => _readConversation(this.#client, this.#httpRequest, params.threadId, {
      ...options,
      signal
    }))
  };
  /**
  * Entries: the built outline, one entry per node. Reads are canned GROQ
  * queries against the organization's document store; for anything more,
  * use {@link fetch}. Requires `context.organizationId` alongside the
  * knowledge-base `resource` in the client configuration.
  */
  entries = {
    /**
    * Every entry, path-ordered, as a metadata view (`_id`, `path`,
    * `title`, `tldr`, `status`) with bodies excluded. Drains keyset pages
    * internally and emits the complete set. Runs:
    *
    * `*[_type == "sanity.context.entry" && knowledgeBaseId == $kb && path > $after] | order(path asc) [0...200] {_id, path, title, tldr, status}`
    *
    * For bodies, use `entries.get` or {@link fetch}.
    */
    list: (options) => _observe(options?.signal, (signal) => _listEntries(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), {
      ...options,
      signal
    })),
    /**
    * One entry with its full body and citations, by outline path (e.g.
    * `billing/refunds`), or `null` when no entry sits at that path. Runs:
    *
    * `*[_type == "sanity.context.entry" && knowledgeBaseId == $kb && path == $path][0]`
    *
    * For anything more, use {@link fetch}.
    */
    get: (params, options) => _observe(options?.signal, (signal) => _readEntry(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), params.path, {
      ...options,
      signal
    })),
    /**
    * Rebuild one entry from its already-placed sources, by outline path.
    * Poll the returned job with the promise client's `jobs`;
    * `affectedEntries` lists every entry the rebuild touches.
    */
    rebuild: (params, options) => _observe(options?.signal, (signal) => _request(this.#client, this.#httpRequest, {
      url: _knowledgeBaseUrl(_resolveKnowledgeBaseId(this.#client), `/entries/${encodeURIComponent(params.path)}/rebuild`),
      method: "POST",
      tag: options?.tag,
      signal
    }))
  };
  /**
  * Issues: findings from builds awaiting triage. Reads are canned GROQ
  * queries against the organization's document store; for anything more,
  * use {@link fetch}. Requires `context.organizationId` alongside the
  * knowledge-base `resource` in the client configuration.
  */
  issues = {
    /**
    * Every issue on the knowledge base, oldest first, optionally narrowed
    * to one status. Drains keyset pages internally and emits the complete
    * set. Runs:
    *
    * `*[_type == "sanity.context.issue" && knowledgeBaseId == $kb && status == $status] | order(_createdAt asc, _id asc)`
    *
    * (the status clause only when given). For anything more, use {@link fetch}.
    */
    list: (params, options) => _observe(options?.signal, (signal) => _listIssues(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), params?.status, {
      ...options,
      signal
    })),
    /**
    * One issue by its document id, or `null` when it does not exist. Runs:
    *
    * `*[_type == "sanity.context.issue" && knowledgeBaseId == $kb && _id == $id][0]`
    *
    * For anything more, use {@link fetch}.
    */
    get: (params, options) => _observe(options?.signal, (signal) => _readIssue(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), params.issueId, {
      ...options,
      signal
    }))
  };
  /**
  * Instructions: standing decisions that steer every build. The canned
  * GROQ read; writes are promise-based on `client.context`.
  */
  instructions = {
    /**
    * Every current-schema instruction on the knowledge base, oldest first.
    * Drains keyset pages internally and emits the complete set. Runs:
    *
    * `*[_type == "sanity.context.instruction" && knowledgeBaseId == $kb && schemaVersion == 1] | order(_createdAt asc, _id asc)`
    *
    * For anything more, use {@link fetch}. Requires `context.organizationId`
    * alongside the knowledge-base `resource` in the client configuration.
    */
    list: (options) => _observe(options?.signal, (signal) => _listInstructions(this.#client, this.#httpRequest, _resolveKnowledgeBaseId(this.#client), {
      ...options,
      signal
    }))
  };
  /**
  * MCP endpoint configurations, org-owned documents read with canned GROQ
  * queries. Requires `context.organizationId` in the client configuration.
  */
  mcpEndpoints = {
    /**
    * The organization's MCP endpoint configurations, oldest first. Runs:
    *
    * `*[_type == "sanity.context.mcp" && organizationId == $org] | order(_createdAt asc, _id asc) [0...500]`
    *
    * For anything more, use {@link fetch}.
    */
    list: (options) => _observe(options?.signal, (signal) => _listMcpEndpoints(this.#client, this.#httpRequest, {
      ...options,
      signal
    })),
    /**
    * One MCP endpoint configuration by its URL name, or `null` when none
    * carries that name. Runs:
    *
    * `*[_type == "sanity.context.mcp" && organizationId == $org && name == $name][0]`
    *
    * For anything more, use {@link fetch}.
    */
    get: (params, options) => _observe(options?.signal, (signal) => _readMcpEndpoint(this.#client, this.#httpRequest, params.name, {
      ...options,
      signal
    }))
  };
};
function shareReplayLatest(configOrPredicate, config) {
  return _shareReplayLatest(typeof configOrPredicate == "function" ? {
    predicate: configOrPredicate,
    ...config
  } : configOrPredicate);
}
function _shareReplayLatest(config) {
  return (source) => {
    let latest, emitted = false, { predicate, ...shareConfig } = config, wrapped = source.pipe(cjsExports.tap((value) => {
      config.predicate(value) && (emitted = true, latest = value);
    }), cjsExports.finalize(() => {
      emitted = false, latest = void 0;
    }), cjsExports.share(shareConfig)), emitLatest = new cjsExports.Observable((subscriber) => {
      emitted && subscriber.next(latest), subscriber.complete();
    });
    return cjsExports.merge(wrapped, emitLatest);
  };
}
const requiredApiVersion = "2021-03-25";
var LiveClient = class {
  #client;
  constructor(client) {
    this.#client = client;
  }
  /**
  * Requires `apiVersion` to be `2021-03-25` or later.
  */
  events({ includeDrafts = false, tag: _tag, waitFor } = {}) {
    let config = this.#client.config(), { projectId: projectId2, apiVersion: _apiVersion, token, withCredentials, requestTagPrefix, headers: configHeaders } = config, apiVersion = _apiVersion.replace(/^v/, "");
    if (apiVersion !== "X" && apiVersion < requiredApiVersion) throw Error(`The live events API requires API version ${requiredApiVersion} or later. The current API version is ${apiVersion}. Please update your API version to use this feature.`);
    if (includeDrafts && !token && !withCredentials) throw Error("The live events API requires a token or withCredentials when 'includeDrafts: true'. Please update your client configuration. The token should have the lowest possible access role.");
    let path = _getDataUrl(this.#client, "live/events"), url = new URL(this.#client.getUrl(path, false)), tag = _tag && requestTagPrefix ? [requestTagPrefix, _tag].join(".") : _tag;
    tag && url.searchParams.set("tag", tag), includeDrafts && url.searchParams.set("includeDrafts", "true"), waitFor && url.searchParams.set("waitFor", waitFor);
    let eventSourceHeaders = {};
    includeDrafts && token && (eventSourceHeaders.Authorization = `Bearer ${token}`), configHeaders && Object.assign(eventSourceHeaders, configHeaders);
    let eventSourceWithCredentials = !!(includeDrafts && withCredentials), transportCache = eventsCache.get(config.resolveFetch);
    transportCache || (transportCache = /* @__PURE__ */ new Map(), eventsCache.set(config.resolveFetch, transportCache));
    let cacheKey = JSON.stringify([
      url.href,
      typeof config.proxy == "string" ? config.proxy : null,
      eventSourceHeaders,
      eventSourceWithCredentials
    ]), existing = transportCache.get(cacheKey);
    if (existing) return existing;
    let initEventSource = () => new EventSource(url.href, { fetch: resolveEventSourceFetch(config, {
      headers: Object.keys(eventSourceHeaders).length ? eventSourceHeaders : void 0,
      withCredentials: eventSourceWithCredentials
    }) }), events = connectEventSource(initEventSource, [
      "message",
      "restart",
      "welcome",
      "reconnect",
      "goaway"
    ]), checkCors = checkCorsObservable(new URL(this.#client.getUrl("/check/cors", false)), projectId2, eventSourceWithCredentials, pickBaseFetch(config)), observable = events.pipe(reconnectOnConnectionFailure(), cjsExports.mergeMap((event) => event.type === "reconnect" ? checkCors.pipe(cjsExports.mergeMap(() => cjsExports.of(event))) : cjsExports.of(event)), cjsExports.catchError((err) => err instanceof CorsOriginError ? cjsExports.throwError(() => err) : checkCors.pipe(cjsExports.mergeMap(() => {
      throw err;
    }))), operatorsExports.map((event) => {
      if (event.type === "message") {
        let { data, ...rest } = event;
        return {
          ...rest,
          tags: data.tags
        };
      }
      return event;
    })).pipe(operatorsExports.finalize(() => {
      transportCache.delete(cacheKey), transportCache.size === 0 && eventsCache.delete(config.resolveFetch);
    }), shareReplayLatest({ predicate: (event) => event.type === "welcome" }));
    return transportCache.set(cacheKey, observable), observable;
  }
};
function checkCorsObservable(url, projectId2, requireCredentials, fetcher) {
  return new cjsExports.Observable((observer) => {
    let controller = new AbortController(), { signal } = controller;
    return fetcher(url.href, {
      method: "GET",
      credentials: "omit",
      signal
    }).then((response) => {
      if (!(signal.aborted || !response.ok)) return response.text();
    }).then((text) => {
      if (signal.aborted) return;
      let parsed = text === void 0 ? void 0 : JSON.parse(text), result = isRecord(parsed) ? parsed.result : void 0;
      if (requireCredentials && isRecord(result) && result.withCredentials === false) {
        observer.error(new CorsOriginError({
          projectId: projectId2,
          credentials: true
        }));
        return;
      }
      if (isRecord(result) && result.allowed === false) {
        observer.error(new CorsOriginError({
          projectId: projectId2,
          credentials: requireCredentials
        }));
        return;
      }
      observer.next(), observer.complete();
    }).catch(() => {
      signal.aborted || observer.closed || (observer.next(), observer.complete());
    }), () => controller.abort();
  });
}
const eventsCache = /* @__PURE__ */ new Map();
var ObservableDatasetsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Create a new dataset with the given name
  *
  * @param name - Name of the dataset to create
  * @param options - Options for the dataset, including optional embeddings configuration
  */
  create(name2, options) {
    return _modifyObservable(this.#client, this.#httpRequest, "PUT", name2, options);
  }
  /**
  * Edit a dataset with the given name
  *
  * @param name - Name of the dataset to edit
  * @param options - New options for the dataset
  */
  edit(name2, options) {
    return _modifyObservable(this.#client, this.#httpRequest, "PATCH", name2, options);
  }
  /**
  * Delete a dataset with the given name
  *
  * @param name - Name of the dataset to delete
  */
  delete(name2) {
    return _modifyObservable(this.#client, this.#httpRequest, "DELETE", name2);
  }
  /**
  * Fetch a list of datasets for the configured project
  */
  list() {
    resourceGuard("dataset", this.#client.config());
    let config = this.#client.config(), projectId2 = config.projectId, url = "/datasets";
    return config.useProjectHostname === false && (url = `/projects/${projectId2}/datasets`), _requestObservable(this.#client, this.#httpRequest, {
      url,
      tag: null
    });
  }
  /**
  * Get embeddings settings for a dataset
  *
  * @param name - Name of the dataset
  */
  getEmbeddingsSettings(name2) {
    return resourceGuard("dataset", this.#client.config()), dataset(name2), _requestObservable(this.#client, this.#httpRequest, {
      url: _embeddingsSettingsUri(this.#client, name2),
      tag: null
    });
  }
  /**
  * Edit embeddings settings for a dataset
  *
  * @param name - Name of the dataset
  * @param settings - Embeddings settings to apply
  */
  editEmbeddingsSettings(name2, settings) {
    return resourceGuard("dataset", this.#client.config()), dataset(name2), _requestObservable(this.#client, this.#httpRequest, {
      method: "PUT",
      url: _embeddingsSettingsUri(this.#client, name2),
      body: settings,
      tag: null
    });
  }
}, DatasetsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Create a new dataset with the given name
  *
  * @param name - Name of the dataset to create
  * @param options - Options for the dataset, including optional embeddings configuration
  */
  create(name2, options) {
    return resourceGuard("dataset", this.#client.config()), _modify(this.#client, this.#httpRequest, "PUT", name2, options);
  }
  /**
  * Edit a dataset with the given name
  *
  * @param name - Name of the dataset to edit
  * @param options - New options for the dataset
  */
  edit(name2, options) {
    return resourceGuard("dataset", this.#client.config()), _modify(this.#client, this.#httpRequest, "PATCH", name2, options);
  }
  /**
  * Delete a dataset with the given name
  *
  * @param name - Name of the dataset to delete
  */
  delete(name2) {
    return resourceGuard("dataset", this.#client.config()), _modify(this.#client, this.#httpRequest, "DELETE", name2);
  }
  /**
  * Fetch a list of datasets for the configured project
  */
  list() {
    resourceGuard("dataset", this.#client.config());
    let config = this.#client.config(), projectId2 = config.projectId, url = "/datasets";
    return config.useProjectHostname === false && (url = `/projects/${projectId2}/datasets`), _request(this.#client, this.#httpRequest, {
      url,
      tag: null
    });
  }
  /**
  * Get embeddings settings for a dataset
  *
  * @param name - Name of the dataset
  */
  getEmbeddingsSettings(name2) {
    return resourceGuard("dataset", this.#client.config()), dataset(name2), _request(this.#client, this.#httpRequest, {
      url: _embeddingsSettingsUri(this.#client, name2),
      tag: null
    });
  }
  /**
  * Edit embeddings settings for a dataset
  *
  * @param name - Name of the dataset
  * @param settings - Embeddings settings to apply
  */
  editEmbeddingsSettings(name2, settings) {
    return resourceGuard("dataset", this.#client.config()), dataset(name2), _request(this.#client, this.#httpRequest, {
      method: "PUT",
      url: _embeddingsSettingsUri(this.#client, name2),
      body: settings,
      tag: null
    });
  }
};
function _embeddingsSettingsUri(client, name2) {
  let config = client.config();
  return config.useProjectHostname === false ? `/projects/${config.projectId}/datasets/${name2}/settings/embeddings` : `/datasets/${name2}/settings/embeddings`;
}
function _modifyObservable(client, httpRequest, method, name2, options) {
  return resourceGuard("dataset", client.config()), dataset(name2), _requestObservable(client, httpRequest, {
    method,
    url: `/datasets/${name2}`,
    body: options,
    tag: null
  });
}
function _modify(client, httpRequest, method, name2, options) {
  return resourceGuard("dataset", client.config()), dataset(name2), _request(client, httpRequest, {
    method,
    url: `/datasets/${name2}`,
    body: options,
    tag: null
  });
}
const SYNC_INVOCABLE_FUNCTION_TYPES = ["sanity.function.pubsub"], ASYNC_INVOCABLE_FUNCTION_TYPES = [
  "sanity.function.durable",
  "sanity.function.pubsub",
  "sanity.function.queue"
], INVOCABLE_FUNCTION_TYPES = [.../* @__PURE__ */ new Set([...SYNC_INVOCABLE_FUNCTION_TYPES, ...ASYNC_INVOCABLE_FUNCTION_TYPES])], scopeHeaders = (config, request) => {
  let organizationId = request?.organizationId || config.organizationId;
  if (organizationId) return {
    "X-Sanity-Scope-Type": "organization",
    "X-Sanity-Scope-Id": organizationId
  };
  let { projectId: projectId2 } = config;
  if (!projectId2) throw Error("`functions.invoke()` requires a `projectId` to be set in the client config, or an `organizationId` for a stack deployed at organization scope");
  return {
    "X-Sanity-Scope-Type": "project",
    "X-Sanity-Scope-Id": projectId2
  };
}, resolveStackId = (config, request) => {
  let stackId = request?.stackId || config.stackId;
  if (!stackId) throw Error("`functions.invoke()` requires a `stackId`, either in the client config or on the request. Function names are only unique within a stack.");
  return stackId;
};
function _resolveFunctionId(client, httpRequest, functionName, stackId, headers, request, sync) {
  return _requestObservable(client, httpRequest, {
    method: "GET",
    url: `/blueprints/stacks/${stackId}`,
    headers,
    signal: request?.signal
  }).pipe(cjsExports.map((stack) => {
    let match = (stack?.resources || []).find((resource) => resource.type?.startsWith("sanity.function.") && resource.name === functionName);
    if (!match) throw Error(`Function "${functionName}" not found in stack "${stackId}"`);
    if (!match.externalId) throw Error(`Function "${functionName}" is declared in stack "${stackId}" but is not deployed`);
    if (!INVOCABLE_FUNCTION_TYPES.includes(match.type)) throw Error(`Function invocation is not supported for ${match.type}`);
    if (sync && !SYNC_INVOCABLE_FUNCTION_TYPES.includes(match.type)) throw Error(`Synchronous function invocation is not supported for ${match.type}`);
    if (!sync && !ASYNC_INVOCABLE_FUNCTION_TYPES.includes(match.type)) throw Error(`Asynchronous function invocation is not supported for ${match.type}`);
    return match.externalId;
  }));
}
function _invoke(client, httpRequest, functionName, request, options) {
  return cjsExports.defer(() => {
    let config = client.config(), headers = scopeHeaders(config, request), stackId = resolveStackId(config, request), sync = options?.sync ?? false;
    return _resolveFunctionId(client, httpRequest, functionName, stackId, headers, request, sync).pipe(cjsExports.mergeMap((functionId) => _requestObservable(client, httpRequest, {
      method: "POST",
      url: `/functions/${functionId}/invoke${sync ? "?sync=true" : ""}`,
      headers,
      body: { event: { data: request?.event?.data ?? {} } },
      timeout: request?.timeout,
      signal: request?.signal
    })));
  });
}
var ObservableFunctionsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  invoke(functionName, request, options) {
    return _invoke(this.#client, this.#httpRequest, functionName, request, options);
  }
}, FunctionsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  invoke(functionName, request, options) {
    return cjsExports.lastValueFrom(_invoke(this.#client, this.#httpRequest, functionName, request, options));
  }
}, ObservableMediaLibraryVideoClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Get video playback information for a media library asset
  *
  * @param assetIdentifier - Asset instance identifier (GDR, video-prefixed ID, or container ID)
  * @param options - Options for transformations and expiration
  */
  getPlaybackInfo(assetIdentifier, options = {}) {
    let config = this.#client.config(), configMediaLibraryId = (config.resource || config["~experimental_resource"])?.id, { instanceId, libraryId } = parseAssetInstanceId(assetIdentifier), effectiveLibraryId = libraryId || configMediaLibraryId;
    if (!effectiveLibraryId) throw Error("Could not determine Media Library ID - you need to provide a valid Media Library ID in the client config or a Media Library GDR");
    let url = buildVideoPlaybackInfoUrl(instanceId, effectiveLibraryId), queryParams = buildQueryParams(options);
    return _requestObservable(this.#client, this.#httpRequest, {
      method: "GET",
      url,
      query: queryParams
    });
  }
}, MediaLibraryVideoClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Get video playback information for a media library asset
  *
  * @param assetIdentifier - Asset instance identifier (GDR, video-prefixed ID, or container ID)
  * @param options - Options for transformations and expiration
  */
  getPlaybackInfo(assetIdentifier, options = {}) {
    let config = this.#client.config(), configMediaLibraryId = (config.resource || config["~experimental_resource"])?.id, { instanceId, libraryId } = parseAssetInstanceId(assetIdentifier), effectiveLibraryId = libraryId || configMediaLibraryId;
    if (!effectiveLibraryId) throw Error("Could not determine Media Library ID - you need to provide a valid Media Library ID in the client config or a Media Library GDR");
    let url = buildVideoPlaybackInfoUrl(instanceId, effectiveLibraryId), queryParams = buildQueryParams(options);
    return _request(this.#client, this.#httpRequest, {
      method: "GET",
      url,
      query: queryParams
    });
  }
};
const ML_GDR_PATTERN = /^media-library:(ml[^:]+):([^:]+)$/;
function isSanityReference(assetIdentifier) {
  return typeof assetIdentifier == "object" && "_ref" in assetIdentifier;
}
function parseAssetInstanceId(assetIdentifier) {
  let ref = isSanityReference(assetIdentifier) ? assetIdentifier._ref : assetIdentifier, match = ML_GDR_PATTERN.exec(ref);
  if (match) {
    let [, libraryId, instanceId] = match;
    return {
      libraryId,
      instanceId
    };
  }
  if (typeof assetIdentifier == "string" && assetIdentifier.startsWith("video-")) return { instanceId: assetIdentifier };
  throw Error(`Invalid video asset instance identifier "${ref}": must be a valid video instance id or a Global Dataset Reference (GDR) to the video asset in the Media Library`);
}
function buildVideoPlaybackInfoUrl(instanceId, libraryId) {
  return `/media-libraries/${libraryId}/video/${instanceId}/playback-info`;
}
function buildQueryParams(options) {
  let params = {};
  if (options.transformations) {
    let { thumbnail, animated, storyboard } = options.transformations;
    thumbnail && (thumbnail.width && (params.thumbnailWidth = thumbnail.width), thumbnail.height && (params.thumbnailHeight = thumbnail.height), thumbnail.time !== void 0 && (params.thumbnailTime = thumbnail.time), thumbnail.fit && (params.thumbnailFit = thumbnail.fit), thumbnail.format && (params.thumbnailFormat = thumbnail.format)), animated && (animated.width && (params.animatedWidth = animated.width), animated.height && (params.animatedHeight = animated.height), animated.start !== void 0 && (params.animatedStart = animated.start), animated.end !== void 0 && (params.animatedEnd = animated.end), animated.fps && (params.animatedFps = animated.fps), animated.format && (params.animatedFormat = animated.format)), storyboard && storyboard.format && (params.storyboardFormat = storyboard.format);
  }
  return options.expiration && (params.expiration = options.expiration), params;
}
var ObservableProjectsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Fetch a list of projects the authenticated user has access to.
  *
  * @param options - Options for the list request
  *   - `includeMembers` - Whether to include members in the response (default: true)
  *   - `includeFeatures` - Whether to include features in the response (default: true)
  *   - `organizationId` - ID of the organization to fetch projects for
  *   - `onlyExplicitMembership` - Whether to include only projects with explicit membership (default: false)
  */
  list(options) {
    let query = {};
    return options?.includeMembers === false && (query.includeMembers = "false"), options?.includeFeatures === false && (query.includeFeatures = "false"), options?.organizationId && (query.organizationId = options.organizationId), options?.onlyExplicitMembership && (query.onlyExplicitMembership = "true"), _requestObservable(this.#client, this.#httpRequest, {
      url: "/projects",
      query
    });
  }
  /**
  * Fetch a project by project ID
  *
  * @param projectId - ID of the project to fetch
  */
  getById(projectId2) {
    return _requestObservable(this.#client, this.#httpRequest, { url: `/projects/${projectId2}` });
  }
}, ProjectsClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Fetch a list of projects the authenticated user has access to.
  *
  * @param options - Options for the list request
  *   - `includeMembers` - Whether to include members in the response (default: true)
  *   - `includeFeatures` - Whether to include features in the response (default: true)
  *   - `organizationId` - ID of the organization to fetch projects for
  *   - `onlyExplicitMembership` - Whether to include only projects with explicit membership (default: false)
  */
  list(options) {
    let query = {};
    return options?.includeMembers === false && (query.includeMembers = "false"), options?.includeFeatures === false && (query.includeFeatures = "false"), options?.organizationId && (query.organizationId = options.organizationId), options?.onlyExplicitMembership && (query.onlyExplicitMembership = "true"), _request(this.#client, this.#httpRequest, {
      url: "/projects",
      query
    });
  }
  /**
  * Fetch a project by project ID
  *
  * @param projectId - ID of the project to fetch
  */
  getById(projectId2) {
    return _request(this.#client, this.#httpRequest, { url: `/projects/${projectId2}` });
  }
};
function generateReleaseId() {
  let id = "";
  for (; id.length < 8; ) {
    let bytes = crypto.getRandomValues(new Uint8Array(8 - id.length));
    for (let byte of bytes) {
      let index = byte & 63;
      index < 62 && (id += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[index]);
    }
  }
  return id;
}
const getDocumentVersionId = (publishedId, releaseId) => releaseId ? getVersionId(publishedId, releaseId) : getDraftId(publishedId);
function deriveDocumentVersionId(op, { releaseId, publishedId, document }) {
  if (publishedId && document._id) {
    let versionId = getDocumentVersionId(publishedId, releaseId);
    return validateVersionIdMatch(versionId, document), versionId;
  }
  if (document._id) {
    let isDraft = isDraftId$1(document._id), isVersion = isVersionId$1(document._id);
    if (!isDraft && !isVersion) throw Error(`\`${op}()\` requires a document with an \`_id\` that is a version or draft ID`);
    if (releaseId) {
      if (isDraft) throw Error(`\`${op}()\` was called with a document ID (\`${document._id}\`) that is a draft ID, but a release ID (\`${releaseId}\`) was also provided.`);
      let builtVersionId = getVersionFromId$1(document._id);
      if (builtVersionId !== releaseId) throw Error(`\`${op}()\` was called with a document ID (\`${document._id}\`) that is a version ID, but the release ID (\`${releaseId}\`) does not match the document's version ID (\`${builtVersionId}\`).`);
    }
    return document._id;
  }
  if (publishedId) return getDocumentVersionId(publishedId, releaseId);
  throw Error(`\`${op}()\` requires either a publishedId or a document with an \`_id\``);
}
const getArgs = (releaseOrOptions, maybeOptions) => {
  if (typeof releaseOrOptions == "object" && releaseOrOptions && ("releaseId" in releaseOrOptions || "metadata" in releaseOrOptions)) {
    let { releaseId = generateReleaseId(), metadata = {} } = releaseOrOptions;
    return [
      releaseId,
      metadata,
      maybeOptions
    ];
  }
  return [
    generateReleaseId(),
    {},
    releaseOrOptions
  ];
}, createRelease = (releaseOrOptions, maybeOptions) => {
  let [releaseId, metadata, options] = getArgs(releaseOrOptions, maybeOptions);
  return {
    action: {
      actionType: "sanity.action.release.create",
      releaseId,
      metadata: {
        ...metadata,
        releaseType: metadata.releaseType || "undecided"
      }
    },
    options
  };
};
var ObservableReleasesClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * @public
  *
  * Retrieve a release by id.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to retrieve.
  * @param options - Additional query options including abort signal and query tag.
  * @returns An observable that resolves to the release document {@link ReleaseDocument}.
  *
  * @example Retrieving a release by id
  * ```ts
  * client.observable.releases.get({releaseId: 'my-release'}).pipe(
  *   tap((release) => console.log(release)),
  *   // {
  *   //   _id: '_.releases.my-release',
  *   //   name: 'my-release'
  *   //   _type: 'system.release',
  *   //   metadata: {releaseType: 'asap'},
  *   //   _createdAt: '2021-01-01T00:00:00.000Z',
  *   //   ...
  *   // }
  * ).subscribe()
  * ```
  */
  get({ releaseId }, options) {
    return _getDocumentObservable(this.#client, this.#httpRequest, `_.releases.${releaseId}`, options);
  }
  create(releaseOrOptions, maybeOptions) {
    let { action, options } = createRelease(releaseOrOptions, maybeOptions), { releaseId, metadata } = action;
    return _actionObservable(this.#client, this.#httpRequest, action, options).pipe(cjsExports.map((actionResult) => ({
      ...actionResult,
      releaseId,
      metadata
    })));
  }
  /**
  * @public
  *
  * Edits an existing release, updating the metadata.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to edit.
  *   - `patch` - The patch operation to apply on the release metadata {@link PatchMutationOperation}.
  * @param options - Additional action options.
  * @returns An observable that resolves to the `transactionId`.
  */
  edit({ releaseId, patch }, options) {
    let editAction = {
      actionType: "sanity.action.release.edit",
      releaseId,
      patch
    };
    return _actionObservable(this.#client, this.#httpRequest, editAction, options);
  }
  /**
  * @public
  *
  * Publishes all documents in a release at once. For larger releases the effect of the publish
  * will be visible immediately when querying but the removal of the `versions.<releasesId>.*`
  * documents and creation of the corresponding published documents with the new content may
  * take some time.
  *
  * During this period both the source and target documents are locked and cannot be
  * modified through any other means.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to publish.
  * @param options - Additional action options.
  * @returns An observable that resolves to the `transactionId`.
  */
  publish({ releaseId }, options) {
    let publishAction = {
      actionType: "sanity.action.release.publish",
      releaseId
    };
    return _actionObservable(this.#client, this.#httpRequest, publishAction, options);
  }
  /**
  * @public
  *
  * An archive action removes an active release. The documents that comprise the release
  * are deleted and therefore no longer queryable.
  *
  * While the documents remain in retention the last version can still be accessed using document history endpoint.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to archive.
  * @param options - Additional action options.
  * @returns An observable that resolves to the `transactionId`.
  */
  archive({ releaseId }, options) {
    let archiveAction = {
      actionType: "sanity.action.release.archive",
      releaseId
    };
    return _actionObservable(this.#client, this.#httpRequest, archiveAction, options);
  }
  /**
  * @public
  *
  * An unarchive action restores an archived release and all documents
  * with the content they had just prior to archiving.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to unarchive.
  * @param options - Additional action options.
  * @returns An observable that resolves to the `transactionId`.
  */
  unarchive({ releaseId }, options) {
    let unarchiveAction = {
      actionType: "sanity.action.release.unarchive",
      releaseId
    };
    return _actionObservable(this.#client, this.#httpRequest, unarchiveAction, options);
  }
  /**
  * @public
  *
  * A schedule action queues a release for publishing at the given future time.
  * The release is locked such that no documents in the release can be modified and
  * no documents that it references can be deleted as this would make the publish fail.
  * At the given time, the same logic as for the publish action is triggered.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to schedule.
  *   - `publishAt` - The serialised date and time to publish the release. If the `publishAt` is in the past, the release will be published immediately.
  * @param options - Additional action options.
  * @returns An observable that resolves to the `transactionId`.
  */
  schedule({ releaseId, publishAt }, options) {
    let scheduleAction = {
      actionType: "sanity.action.release.schedule",
      releaseId,
      publishAt
    };
    return _actionObservable(this.#client, this.#httpRequest, scheduleAction, options);
  }
  /**
  * @public
  *
  * An unschedule action stops a release from being published.
  * The documents in the release are considered unlocked and can be edited again.
  * This may fail if another release is scheduled to be published after this one and
  * has a reference to a document created by this one.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to unschedule.
  * @param options - Additional action options.
  * @returns An observable that resolves to the `transactionId`.
  */
  unschedule({ releaseId }, options) {
    let unscheduleAction = {
      actionType: "sanity.action.release.unschedule",
      releaseId
    };
    return _actionObservable(this.#client, this.#httpRequest, unscheduleAction, options);
  }
  /**
  * @public
  *
  * A delete action removes a published or archived release.
  * The backing system document will be removed from the dataset.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to delete.
  * @param options - Additional action options.
  * @returns An observable that resolves to the `transactionId`.
  */
  delete({ releaseId }, options) {
    let deleteAction = {
      actionType: "sanity.action.release.delete",
      releaseId
    };
    return _actionObservable(this.#client, this.#httpRequest, deleteAction, options);
  }
  /**
  * @public
  *
  * Fetch the documents in a release by release id.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to fetch documents for.
  * @param options - Additional mutation options {@link BaseMutationOptions}.
  * @returns An observable that resolves to the documents in the release.
  */
  fetchDocuments({ releaseId }, options) {
    return _getReleaseDocumentsObservable(this.#client, this.#httpRequest, releaseId, options);
  }
}, ReleasesClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * @public
  *
  * Retrieve a release by id.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to retrieve.
  * @param options - Additional query options including abort signal and query tag.
  * @returns A promise that resolves to the release document {@link ReleaseDocument}.
  *
  * @example Retrieving a release by id
  * ```ts
  * const release = await client.releases.get({releaseId: 'my-release'})
  * console.log(release)
  * // {
  * //   _id: '_.releases.my-release',
  * //   name: 'my-release'
  * //   _type: 'system.release',
  * //   metadata: {releaseType: 'asap'},
  * //   _createdAt: '2021-01-01T00:00:00.000Z',
  * //   ...
  * // }
  * ```
  */
  get({ releaseId }, options) {
    return _getDocument(this.#client, this.#httpRequest, `_.releases.${releaseId}`, options);
  }
  async create(releaseOrOptions, maybeOptions) {
    let { action, options } = createRelease(releaseOrOptions, maybeOptions), { releaseId, metadata } = action;
    return {
      ...await _action(this.#client, this.#httpRequest, action, options),
      releaseId,
      metadata
    };
  }
  /**
  * @public
  *
  * Edits an existing release, updating the metadata.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to edit.
  *   - `patch` - The patch operation to apply on the release metadata {@link PatchMutationOperation}.
  * @param options - Additional action options.
  * @returns A promise that resolves to the `transactionId`.
  */
  edit({ releaseId, patch }, options) {
    let editAction = {
      actionType: "sanity.action.release.edit",
      releaseId,
      patch
    };
    return _action(this.#client, this.#httpRequest, editAction, options);
  }
  /**
  * @public
  *
  * Publishes all documents in a release at once. For larger releases the effect of the publish
  * will be visible immediately when querying but the removal of the `versions.<releasesId>.*`
  * documents and creation of the corresponding published documents with the new content may
  * take some time.
  *
  * During this period both the source and target documents are locked and cannot be
  * modified through any other means.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to publish.
  * @param options - Additional action options.
  * @returns A promise that resolves to the `transactionId`.
  */
  publish({ releaseId }, options) {
    let publishAction = {
      actionType: "sanity.action.release.publish",
      releaseId
    };
    return _action(this.#client, this.#httpRequest, publishAction, options);
  }
  /**
  * @public
  *
  * An archive action removes an active release. The documents that comprise the release
  * are deleted and therefore no longer queryable.
  *
  * While the documents remain in retention the last version can still be accessed using document history endpoint.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to archive.
  * @param options - Additional action options.
  * @returns A promise that resolves to the `transactionId`.
  */
  archive({ releaseId }, options) {
    let archiveAction = {
      actionType: "sanity.action.release.archive",
      releaseId
    };
    return _action(this.#client, this.#httpRequest, archiveAction, options);
  }
  /**
  * @public
  *
  * An unarchive action restores an archived release and all documents
  * with the content they had just prior to archiving.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to unarchive.
  * @param options - Additional action options.
  * @returns A promise that resolves to the `transactionId`.
  */
  unarchive({ releaseId }, options) {
    let unarchiveAction = {
      actionType: "sanity.action.release.unarchive",
      releaseId
    };
    return _action(this.#client, this.#httpRequest, unarchiveAction, options);
  }
  /**
  * @public
  *
  * A schedule action queues a release for publishing at the given future time.
  * The release is locked such that no documents in the release can be modified and
  * no documents that it references can be deleted as this would make the publish fail.
  * At the given time, the same logic as for the publish action is triggered.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to schedule.
  *   - `publishAt` - The serialised date and time to publish the release. If the `publishAt` is in the past, the release will be published immediately.
  * @param options - Additional action options.
  * @returns A promise that resolves to the `transactionId`.
  */
  schedule({ releaseId, publishAt }, options) {
    let scheduleAction = {
      actionType: "sanity.action.release.schedule",
      releaseId,
      publishAt
    };
    return _action(this.#client, this.#httpRequest, scheduleAction, options);
  }
  /**
  * @public
  *
  * An unschedule action stops a release from being published.
  * The documents in the release are considered unlocked and can be edited again.
  * This may fail if another release is scheduled to be published after this one and
  * has a reference to a document created by this one.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to unschedule.
  * @param options - Additional action options.
  * @returns A promise that resolves to the `transactionId`.
  */
  unschedule({ releaseId }, options) {
    let unscheduleAction = {
      actionType: "sanity.action.release.unschedule",
      releaseId
    };
    return _action(this.#client, this.#httpRequest, unscheduleAction, options);
  }
  /**
  * @public
  *
  * A delete action removes a published or archived release.
  * The backing system document will be removed from the dataset.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to delete.
  * @param options - Additional action options.
  * @returns A promise that resolves to the `transactionId`.
  */
  delete({ releaseId }, options) {
    let deleteAction = {
      actionType: "sanity.action.release.delete",
      releaseId
    };
    return _action(this.#client, this.#httpRequest, deleteAction, options);
  }
  /**
  * @public
  *
  * Fetch the documents in a release by release id.
  *
  * @category Releases
  *
  * @param params - Release action parameters:
  *   - `releaseId` - The id of the release to fetch documents for.
  * @param options - Additional mutation options {@link BaseMutationOptions}.
  * @returns A promise that resolves to the documents in the release.
  */
  fetchDocuments({ releaseId }, options) {
    return _getReleaseDocuments(this.#client, this.#httpRequest, releaseId, options);
  }
}, ObservableUsersClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Fetch a user by user ID
  *
  * @param id - User ID of the user to fetch. If `me` is provided, a minimal response including the users role is returned.
  */
  getById(id) {
    return _requestObservable(this.#client, this.#httpRequest, { url: `/users/${id}` });
  }
}, UsersClient = class {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
  * Fetch a user by user ID
  *
  * @param id - User ID of the user to fetch. If `me` is provided, a minimal response including the users role is returned.
  */
  getById(id) {
    return _request(this.#client, this.#httpRequest, { url: `/users/${id}` });
  }
}, ObservableSanityClient = class ObservableSanityClient2 {
  /**
  * Upload, fetch and delete assets (images and files) in the configured dataset
  *
  * @category Assets
  */
  assets;
  /**
  * Create, list, edit and delete datasets in the configured project
  *
  * @category Projects & Datasets
  */
  datasets;
  /**
  * Subscribe to live content updates through the Live Content API
  *
  * @category Real-time
  */
  live;
  /**
  * Interact with Media Library assets
  *
  * @category Assets
  */
  mediaLibrary;
  /**
  * Fetch information about the projects the authenticated user has access to
  *
  * @category Projects & Datasets
  */
  projects;
  /**
  * Fetch information about users in the configured project
  *
  * @category Projects & Datasets
  */
  users;
  /**
  * Run Agent Actions - AI-powered operations to generate, transform, translate, prompt and patch documents
  *
  * @category Agent Actions
  */
  agent;
  collaboration;
  functions;
  /**
  * Create and manage content releases and their scheduled publishing
  *
  * @category Releases
  */
  releases;
  /** @beta */
  context;
  #clientConfig;
  #httpRequest;
  /**
  * Listen to document changes matching a GROQ query, delivered as server-sent events
  *
  * @category Real-time
  */
  listen = _listen$2;
  constructor(httpRequest, config = defaultConfig) {
    this.config(config), this.#httpRequest = httpRequest, this.assets = new ObservableAssetsClient(this, this.#httpRequest), this.datasets = new ObservableDatasetsClient(this, this.#httpRequest), this.live = new LiveClient(this), this.mediaLibrary = { video: new ObservableMediaLibraryVideoClient(this, this.#httpRequest) }, this.projects = new ObservableProjectsClient(this, this.#httpRequest), this.users = new ObservableUsersClient(this, this.#httpRequest), this.agent = { action: new ObservableAgentsActionClient(this, this.#httpRequest) }, this.collaboration = { comments: new ObservableCollaborationCommentsClient(this, this.#httpRequest) }, this.functions = new ObservableFunctionsClient(this, this.#httpRequest), this.releases = new ObservableReleasesClient(this, this.#httpRequest), this.context = new ObservableContextClient(this, this.#httpRequest);
  }
  /**
  * Clone the client - returns a new instance
  *
  * @category Configuration
  */
  clone() {
    return new ObservableSanityClient2(this.#httpRequest, this.config());
  }
  config(newConfig) {
    if (newConfig === void 0) return { ...this.#clientConfig };
    if (this.#clientConfig && this.#clientConfig.allowReconfigure === false) throw Error("Existing client instance cannot be reconfigured - use `withConfig(newConfig)` to return a new client");
    return this.#clientConfig = initConfig(newConfig, this.#clientConfig || {}), this;
  }
  /**
  * Clone the client with a new (partial) configuration.
  *
  * @category Configuration
  *
  * @param newConfig - New client configuration properties, shallowly merged with existing configuration
  */
  withConfig(newConfig) {
    let thisConfig = this.config();
    return new ObservableSanityClient2(this.#httpRequest, {
      ...thisConfig,
      ...newConfig,
      stega: {
        ...thisConfig.stega,
        ...typeof newConfig?.stega == "boolean" ? { enabled: newConfig.stega } : newConfig?.stega || {}
      }
    });
  }
  fetch(query, params, options) {
    return _fetchObservable(this, this.#httpRequest, this.#clientConfig.stega, query, params, options);
  }
  getDocument(id, options) {
    if (options?.includeAllVersions === true) return _getDocumentObservable(this, this.#httpRequest, id, {
      ...options,
      includeAllVersions: true
    });
    let opts = {
      signal: options?.signal,
      tag: options?.tag,
      releaseId: options?.releaseId,
      ...options && "includeAllVersions" in options ? { includeAllVersions: false } : {}
    };
    return _getDocumentObservable(this, this.#httpRequest, id, opts);
  }
  /**
  * Fetch multiple documents in one request.
  * Should be used sparingly - performing a query is usually a better option.
  * The order/position of documents is preserved based on the original array of IDs.
  * If any of the documents are missing, they will be replaced by a `null` entry in the returned array
  *
  * @category Querying
  *
  * @param ids - Document IDs to fetch
  * @param options - Request options
  */
  getDocuments(ids, options) {
    return _getDocumentsObservable(this, this.#httpRequest, ids, options);
  }
  /**
  * Convenient and bandwidth efficient method of checking wether a set of document IDs exists.
  * Returns a set of the IDs that exist.
  *
  * @category Querying
  *
  * @param ids - Document IDs to check
  * @param options - Request options
  */
  documentsExists(ids, options) {
    return _documentsExistsObservable(this, this.#httpRequest, ids, options);
  }
  create(document, options) {
    return _createObservable(this, this.#httpRequest, document, "create", options);
  }
  createIfNotExists(document, options) {
    return _createIfNotExistsObservable(this, this.#httpRequest, document, options);
  }
  createOrReplace(document, options) {
    return _createOrReplaceObservable(this, this.#httpRequest, document, options);
  }
  createVersion({ document, publishedId, releaseId, baseId, ifBaseRevisionId }, options) {
    if (!document) return _createVersionFromBaseObservable(this, this.#httpRequest, publishedId, baseId, releaseId, ifBaseRevisionId, options);
    let documentVersionId = deriveDocumentVersionId("createVersion", {
      document,
      publishedId,
      releaseId
    }), documentVersion = {
      ...document,
      _id: documentVersionId
    }, versionPublishedId = publishedId || getPublishedId$1(document._id);
    return _createVersionObservable(this, this.#httpRequest, documentVersion, versionPublishedId, options);
  }
  delete(selection, options) {
    return _deleteObservable(this, this.#httpRequest, selection, options);
  }
  /**
  * @public
  *
  * Deletes the draft or release version of a document.
  *
  * @remarks
  * * Discarding a version with no `releaseId` will discard the draft version of the published document.
  * * If the draft or release version does not exist, any error will throw.
  *
  * @category Versions
  *
  * @param params - Version action parameters:
  *   - `releaseId` - The ID of the release to discard the document from.
  *   - `publishedId` - The published ID of the document to discard.
  * @param purge - if `true` the document history is also discarded.
  * @param options - Additional action options.
  * @returns an observable that resolves to the `transactionId`.
  *
  * @example Discarding a release version of a document
  * ```ts
  * client.observable.discardVersion({publishedId: 'myDocument', releaseId: 'myRelease'})
  * // The document with the ID `versions.myRelease.myDocument` will be discarded.
  * ```
  *
  * @example Discarding a draft version of a document
  * ```ts
  * client.observable.discardVersion({publishedId: 'myDocument'})
  * // The document with the ID `drafts.myDocument` will be discarded.
  * ```
  */
  discardVersion({ releaseId, publishedId }, purge, options) {
    let documentVersionId = getDocumentVersionId(publishedId, releaseId);
    return _discardVersionObservable(this, this.#httpRequest, documentVersionId, purge, options);
  }
  replaceVersion({ document, publishedId, releaseId }, options) {
    let documentVersionId = deriveDocumentVersionId("replaceVersion", {
      document,
      publishedId,
      releaseId
    }), documentVersion = {
      ...document,
      _id: documentVersionId
    };
    return _replaceVersionObservable(this, this.#httpRequest, documentVersion, options);
  }
  /**
  * @public
  *
  * Used to indicate when a document within a release should be unpublished when
  * the release is run.
  *
  * @remarks
  * * If the published document does not exist, an error will be thrown.
  *
  * @category Versions
  *
  * @param params - Version action parameters:
  *   - `releaseId` - The ID of the release to unpublish the document from.
  *   - `publishedId` - The published ID of the document to unpublish.
  * @param options - Additional action options.
  * @returns an observable that resolves to the `transactionId`.
  *
  * @example Unpublishing a release version of a published document
  * ```ts
  * client.observable.unpublishVersion({publishedId: 'myDocument', releaseId: 'myRelease'})
  * // The document with the ID `versions.myRelease.myDocument` will be unpublished. when `myRelease` is run.
  * ```
  */
  unpublishVersion({ releaseId, publishedId }, options) {
    let versionId = getVersionId(publishedId, releaseId);
    return _unpublishVersionObservable(this, this.#httpRequest, versionId, publishedId, options);
  }
  mutate(operations, options) {
    return _mutateObservable(this, this.#httpRequest, operations, options);
  }
  /**
  * Create a new buildable patch of operations to perform
  *
  * @param selection - Document ID, an array of document IDs, or an object with `query` and optional `params`, defining which document(s) to patch
  * @param operations - Optional object of patch operations to initialize the patch instance with
  * @returns Patch instance - call `.commit()` to perform the operations defined
  */
  patch(selection, operations) {
    return new ObservablePatch(selection, operations, this);
  }
  /**
  * Create a new transaction of mutations
  *
  * @category Mutations
  *
  * @param operations - Optional array of mutation operations to initialize the transaction instance with
  */
  transaction(operations) {
    return new ObservableTransaction(operations, this);
  }
  /**
  * Perform action operations against the configured dataset
  *
  * @category Mutations
  *
  * @param operations - Action operation(s) to execute
  * @param options - Action options
  */
  action(operations, options) {
    return _actionObservable(this, this.#httpRequest, operations, options);
  }
  /**
  * Perform an HTTP request against the Sanity API
  *
  * @category HTTP
  *
  * @param options - Request options
  */
  request(options) {
    return _requestObservable(this, this.#httpRequest, options);
  }
  /**
  * Get a Sanity API URL for the URI provided
  *
  * @category HTTP
  *
  * @param uri - URI/path to build URL for
  * @param canUseCdn - Whether or not to allow using the API CDN for this route
  */
  getUrl(uri, canUseCdn) {
    return _getUrl(this, uri, canUseCdn);
  }
  /**
  * Get a Sanity API URL for the data operation and path provided
  *
  * @category HTTP
  *
  * @param operation - Data operation (eg `query`, `mutate`, `listen` or similar)
  * @param path - Path to append after the operation
  */
  getDataUrl(operation, path) {
    return _getDataUrl(this, operation, path);
  }
}, SanityClient = class SanityClient2 {
  /**
  * Upload, fetch and delete assets (images and files) in the configured dataset
  *
  * @category Assets
  */
  assets;
  /**
  * Create, list, edit and delete datasets in the configured project
  *
  * @category Projects & Datasets
  */
  datasets;
  /**
  * Subscribe to live content updates through the Live Content API
  *
  * @category Real-time
  */
  live;
  /**
  * Interact with Media Library assets
  *
  * @category Assets
  */
  mediaLibrary;
  /**
  * Fetch information about the projects the authenticated user has access to
  *
  * @category Projects & Datasets
  */
  projects;
  /**
  * Fetch information about users in the configured project
  *
  * @category Projects & Datasets
  */
  users;
  /**
  * Run Agent Actions - AI-powered operations to generate, transform, translate, prompt and patch documents
  *
  * @category Agent Actions
  */
  agent;
  collaboration;
  functions;
  /**
  * Create and manage content releases and their scheduled publishing
  *
  * @category Releases
  */
  releases;
  /** @beta */
  context;
  /**
  * Observable version of the Sanity client, with the same configuration as the promise-based one
  *
  * @category Configuration
  */
  observable;
  #clientConfig;
  #httpRequest;
  /**
  * Listen to document changes matching a GROQ query, delivered as server-sent events
  *
  * @category Real-time
  */
  listen = _listen$2;
  constructor(httpRequest, config = defaultConfig) {
    this.config(config), this.#httpRequest = httpRequest, this.assets = new AssetsClient(this, this.#httpRequest), this.datasets = new DatasetsClient(this, this.#httpRequest), this.live = new LiveClient(this), this.mediaLibrary = { video: new MediaLibraryVideoClient(this, this.#httpRequest) }, this.projects = new ProjectsClient(this, this.#httpRequest), this.users = new UsersClient(this, this.#httpRequest), this.agent = { action: new AgentActionsClient(this, this.#httpRequest) }, this.collaboration = { comments: new CollaborationCommentsClient(this, this.#httpRequest) }, this.functions = new FunctionsClient(this, this.#httpRequest), this.releases = new ReleasesClient(this, this.#httpRequest), this.context = new ContextClient(this, this.#httpRequest), this.observable = new ObservableSanityClient(httpRequest, config);
  }
  /**
  * Clone the client - returns a new instance
  *
  * @category Configuration
  */
  clone() {
    return new SanityClient2(this.#httpRequest, this.config());
  }
  config(newConfig) {
    if (newConfig === void 0) return { ...this.#clientConfig };
    if (this.#clientConfig && this.#clientConfig.allowReconfigure === false) throw Error("Existing client instance cannot be reconfigured - use `withConfig(newConfig)` to return a new client");
    return this.observable && this.observable.config(newConfig), this.#clientConfig = initConfig(newConfig, this.#clientConfig || {}), this;
  }
  /**
  * Clone the client with a new (partial) configuration.
  *
  * @category Configuration
  *
  * @param newConfig - New client configuration properties, shallowly merged with existing configuration
  */
  withConfig(newConfig) {
    let thisConfig = this.config();
    return new SanityClient2(this.#httpRequest, {
      ...thisConfig,
      ...newConfig,
      stega: {
        ...thisConfig.stega,
        ...typeof newConfig?.stega == "boolean" ? { enabled: newConfig.stega } : newConfig?.stega || {}
      }
    });
  }
  fetch(query, params, options) {
    return _fetch$2(this, this.#httpRequest, this.#clientConfig.stega, query, params, options);
  }
  getDocument(id, options) {
    if (options?.includeAllVersions === true) return _getDocument(this, this.#httpRequest, id, {
      ...options,
      includeAllVersions: true
    });
    let opts = {
      signal: options?.signal,
      tag: options?.tag,
      releaseId: options?.releaseId,
      ...options && "includeAllVersions" in options ? { includeAllVersions: false } : {}
    };
    return _getDocument(this, this.#httpRequest, id, opts);
  }
  /**
  * Fetch multiple documents in one request.
  * Should be used sparingly - performing a query is usually a better option.
  * The order/position of documents is preserved based on the original array of IDs.
  * If any of the documents are missing, they will be replaced by a `null` entry in the returned array
  *
  * @category Querying
  *
  * @param ids - Document IDs to fetch
  * @param options - Request options
  */
  getDocuments(ids, options) {
    return _getDocuments(this, this.#httpRequest, ids, options);
  }
  /**
  * Convenient and bandwidth efficient method of checking wether a set of document IDs exists.
  * Returns a set of the IDs that exist.
  *
  * @category Querying
  *
  * @param ids - Document IDs to check
  * @param options - Request options
  */
  documentsExists(ids, options) {
    return _documentsExists(this, this.#httpRequest, ids, options);
  }
  create(document, options) {
    return _create$1(this, this.#httpRequest, document, "create", options);
  }
  createIfNotExists(document, options) {
    return _createIfNotExists(this, this.#httpRequest, document, options);
  }
  createOrReplace(document, options) {
    return _createOrReplace(this, this.#httpRequest, document, options);
  }
  createVersion({ document, publishedId, releaseId, baseId, ifBaseRevisionId }, options) {
    if (!document) return _createVersionFromBase(this, this.#httpRequest, publishedId, baseId, releaseId, ifBaseRevisionId, options);
    let documentVersionId = deriveDocumentVersionId("createVersion", {
      document,
      publishedId,
      releaseId
    }), documentVersion = {
      ...document,
      _id: documentVersionId
    }, versionPublishedId = publishedId || getPublishedId$1(document._id);
    return _createVersion(this, this.#httpRequest, documentVersion, versionPublishedId, options);
  }
  delete(selection, options) {
    return _delete$1(this, this.#httpRequest, selection, options);
  }
  /**
  * @public
  *
  * Deletes the draft or release version of a document.
  *
  * @remarks
  * * Discarding a version with no `releaseId` will discard the draft version of the published document.
  * * If the draft or release version does not exist, any error will throw.
  *
  * @category Versions
  *
  * @param params - Version action parameters:
  *   - `releaseId` - The ID of the release to discard the document from.
  *   - `publishedId` - The published ID of the document to discard.
  * @param purge - if `true` the document history is also discarded.
  * @param options - Additional action options.
  * @returns a promise that resolves to the `transactionId`.
  *
  * @example Discarding a release version of a document
  * ```ts
  * client.discardVersion({publishedId: 'myDocument', releaseId: 'myRelease'})
  * // The document with the ID `versions.myRelease.myDocument` will be discarded.
  * ```
  *
  * @example Discarding a draft version of a document
  * ```ts
  * client.discardVersion({publishedId: 'myDocument'})
  * // The document with the ID `drafts.myDocument` will be discarded.
  * ```
  */
  discardVersion({ releaseId, publishedId }, purge, options) {
    let documentVersionId = getDocumentVersionId(publishedId, releaseId);
    return _discardVersion(this, this.#httpRequest, documentVersionId, purge, options);
  }
  replaceVersion({ document, publishedId, releaseId }, options) {
    let documentVersionId = deriveDocumentVersionId("replaceVersion", {
      document,
      publishedId,
      releaseId
    }), documentVersion = {
      ...document,
      _id: documentVersionId
    };
    return _replaceVersion(this, this.#httpRequest, documentVersion, options);
  }
  /**
  * @public
  *
  * Used to indicate when a document within a release should be unpublished when
  * the release is run.
  *
  * @remarks
  * * If the published document does not exist, an error will be thrown.
  *
  * @category Versions
  *
  * @param params - Version action parameters:
  *   - `releaseId` - The ID of the release to unpublish the document from.
  *   - `publishedId` - The published ID of the document to unpublish.
  * @param options - Additional action options.
  * @returns a promise that resolves to the `transactionId`.
  *
  * @example Unpublishing a release version of a published document
  * ```ts
  * await client.unpublishVersion({publishedId: 'myDocument', releaseId: 'myRelease'})
  * // The document with the ID `versions.myRelease.myDocument` will be unpublished. when `myRelease` is run.
  * ```
  */
  unpublishVersion({ releaseId, publishedId }, options) {
    let versionId = getVersionId(publishedId, releaseId);
    return _unpublishVersion(this, this.#httpRequest, versionId, publishedId, options);
  }
  mutate(operations, options) {
    return _mutate(this, this.#httpRequest, operations, options);
  }
  /**
  * Create a new buildable patch of operations to perform
  *
  * @param selection - Document ID, an array of document IDs, or an object with `query` and optional `params`, defining which document(s) to patch
  * @param operations - Optional object of patch operations to initialize the patch instance with
  * @returns Patch instance - call `.commit()` to perform the operations defined
  */
  patch(documentId, operations) {
    return new Patch(documentId, operations, this);
  }
  /**
  * Create a new transaction of mutations
  *
  * @category Mutations
  *
  * @param operations - Optional array of mutation operations to initialize the transaction instance with
  */
  transaction(operations) {
    return new Transaction(operations, this);
  }
  /**
  * Perform action operations against the configured dataset
  * Returns a promise that resolves to the transaction result
  *
  * @category Mutations
  *
  * @param operations - Action operation(s) to execute
  * @param options - Action options
  */
  action(operations, options) {
    return _action(this, this.#httpRequest, operations, options);
  }
  /**
  * Perform a request against the Sanity API
  * NOTE: Only use this for Sanity API endpoints, not for your own APIs!
  *
  * @category HTTP
  *
  * @param options - Request options
  * @returns Promise resolving to the response body
  */
  request(options) {
    return _request(this, this.#httpRequest, options);
  }
  /**
  * Perform an HTTP request a `/data` sub-endpoint
  * NOTE: Considered internal, thus marked as deprecated. Use `request` instead.
  *
  * @deprecated - Use `request()` or your own HTTP library instead
  * @param endpoint - Endpoint to hit (mutate, query etc)
  * @param body - Request body
  * @param options - Request options
  * @internal
  */
  dataRequest(endpoint, body, options) {
    return _dataRequest(this, this.#httpRequest, endpoint, body, options);
  }
  /**
  * Get a Sanity API URL for the URI provided
  *
  * @category HTTP
  *
  * @param uri - URI/path to build URL for
  * @param canUseCdn - Whether or not to allow using the API CDN for this route
  */
  getUrl(uri, canUseCdn) {
    return _getUrl(this, uri, canUseCdn);
  }
  /**
  * Get a Sanity API URL for the data operation and path provided
  *
  * @category HTTP
  *
  * @param operation - Data operation (eg `query`, `mutate`, `listen` or similar)
  * @param path - Path to append after the operation
  */
  getDataUrl(operation, path) {
    return _getDataUrl(this, operation, path);
  }
};
function defineCreateClientExports(envOptions, ClassConstructor) {
  let defaultRequester = defineRequester(envOptions).observable, createClient2 = (config) => {
    let { observable: clientRequester, promise: clientRequesterPromise } = defineRequester(envOptions, {
      ignoreWarnings: config.ignoreWarnings,
      maxRetries: config.maxRetries,
      retryDelay: config.retryDelay
    }), performRequest = async (options) => (await clientRequesterPromise({
      redirect: "manual",
      ...options
    })).body, httpRequest = (options, requestHandler) => requestHandler ? requestHandler(options, performRequest) : performRequest(options);
    return new ClassConstructor(httpRequest, {
      ...config,
      requester: clientRequester,
      resolveFetch: config.resolveFetch ?? envOptions.resolveFetch
    });
  };
  return {
    requester: defaultRequester,
    createClient: createClient2
  };
}
var name = "@sanity/client", version = "8.6.2";
const log = createDebug("sanity:client");
function isNodeReadableStream(value) {
  return typeof value != "object" || !value || !("pipe" in value) ? false : typeof value.pipe == "function";
}
const proxyFetchCache = /* @__PURE__ */ new Map();
function getProxyFetch(proxyUrl) {
  let cached = proxyFetchCache.get(proxyUrl);
  if (cached) return cached;
  let fetch = createNodeFetch({
    proxy: proxyUrl,
    connections: 30
  });
  return proxyFetchCache.set(proxyUrl, fetch), fetch;
}
let envDefaultFetch;
function resolveFetch(proxyUrl) {
  return typeof proxyUrl == "string" ? getProxyFetch(proxyUrl) : (envDefaultFetch ??= createNodeFetch(), envDefaultFetch);
}
const middleware = [
  debug({
    log: (message, ...args) => log(message, ...args),
    verbose: true
  }),
  { beforeRequest(opts) {
    let configLineage = typeof opts.meta?.lineage == "string" ? opts.meta.lineage : void 0, lineage = typeof process < "u" && process.env.X_SANITY_LINEAGE || configLineage;
    if (!lineage) return opts;
    let headers = new Headers(opts.headers);
    return headers.set("x-sanity-lineage", lineage), {
      ...opts,
      headers
    };
  } },
  { beforeRequest(opts) {
    return isNodeReadableStream(opts.body) ? {
      ...opts,
      body: Readable.toWeb(opts.body)
    } : opts;
  } }
], exp = defineCreateClientExports({
  headers: { "User-Agent": `${name} ${version}` },
  middleware,
  resolveFetch
}, SanityClient), createClient = exp.createClient;
var import_dist = require_dist();
function isDraftId(id) {
  return id.startsWith("drafts.");
}
function isVersionId(id) {
  return id.startsWith("versions.");
}
function isPublishedId(id) {
  return !isDraftId(id) && !isVersionId(id);
}
function asPublishedId(value) {
  return value;
}
function getVersionFromId(id) {
  if (!isVersionId(id)) return;
  let [_versionPrefix, versionId, ..._publishedId] = id.split(".");
  return versionId;
}
function getPublishedId(id) {
  if (isVersionId(id)) return asPublishedId(id.split(".").slice(2).join("."));
  if (isDraftId(id)) return asPublishedId(id.slice(7));
  if (isPublishedId(id)) return id;
  throw Error(`Unable to resolve a published id from "${id}"`);
}
const reKeySegment = /_key\s*==\s*['"](.*)['"]/;
function isKeySegment(segment) {
  return typeof segment == "string" ? reKeySegment.test(segment.trim()) : typeof segment == "object" && "_key" in segment;
}
function toString(path) {
  if (!Array.isArray(path)) throw Error("Path is not an array");
  return path.reduce((target, segment, i) => {
    let segmentType = typeof segment;
    if (segmentType === "number") return `${target}[${segment}]`;
    if (segmentType === "string") return `${target}${i === 0 ? "" : "."}${segment}`;
    if (isKeySegment(segment) && segment._key) return `${target}[_key=="${segment._key}"]`;
    if (Array.isArray(segment)) {
      let [from, to] = segment;
      return `${target}[${from}:${to}]`;
    }
    throw Error(`Unsupported path segment \`${JSON.stringify(segment)}\``);
  }, "");
}
const ESCAPE = {
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "'": "\\'",
  "\\": "\\\\"
}, UNESCAPE = {
  "\\f": "\f",
  "\\n": "\n",
  "\\r": "\r",
  "\\t": "	",
  "\\'": "'",
  "\\\\": "\\"
};
function jsonPath(path) {
  return `$${path.map((segment) => typeof segment == "string" ? `['${segment.replace(/[\f\n\r\t'\\]/g, (match) => ESCAPE[match])}']` : typeof segment == "number" ? `[${segment}]` : segment._key === "" ? `[${segment._index}]` : `[?(@._key=='${segment._key.replace(/['\\]/g, (match) => ESCAPE[match])}')]`).join("")}`;
}
function jsonPathArray(path) {
  return path.map((segment) => typeof segment == "string" ? `['${segment.replace(/[\f\n\r\t'\\]/g, (match) => ESCAPE[match])}']` : typeof segment == "number" ? `[${segment}]` : segment._key === "" ? `[${segment._index}]` : `[?(@._key=='${segment._key.replace(/['\\]/g, (match) => ESCAPE[match])}')]`);
}
function parseJsonPath(path) {
  let parsed = [], parseRe = /\['(.*?)'\]|\[(\d+)\]|\[\?\(@\._key=='(.*?)'\)\]/g, match;
  for (; (match = parseRe.exec(path)) !== null; ) {
    if (match[1] !== void 0) {
      let key = match[1].replace(/\\(\\|f|n|r|t|')/g, (m) => UNESCAPE[m]);
      parsed.push(key);
      continue;
    }
    if (match[2] !== void 0) {
      parsed.push(parseInt(match[2], 10));
      continue;
    }
    if (match[3] !== void 0) {
      let _key = match[3].replace(/\\(\\')/g, (m) => UNESCAPE[m]);
      parsed.push({
        _key,
        _index: -1
      });
      continue;
    }
  }
  return parsed;
}
function jsonPathToStudioPath(path) {
  return path.map((segment) => {
    if (typeof segment == "string" || typeof segment == "number") return segment;
    if (segment._key !== "") return { _key: segment._key };
    if (segment._index !== -1) return segment._index;
    throw Error(`invalid segment:${JSON.stringify(segment)}`);
  });
}
function jsonPathToMappingPath(path) {
  return path.map((segment) => {
    if (typeof segment == "string" || typeof segment == "number") return segment;
    if (segment._index !== -1) return segment._index;
    throw Error(`invalid segment:${JSON.stringify(segment)}`);
  });
}
function createEditUrl(options) {
  let { baseUrl, workspace: _workspace = "default", tool: _tool = "default", id: _id, type, path, projectId: projectId2, dataset: dataset2 } = options;
  if (!baseUrl) throw Error("baseUrl is required");
  if (!path) throw Error("path is required");
  if (!_id) throw Error("id is required");
  if (baseUrl !== "/" && baseUrl.endsWith("/")) throw Error("baseUrl must not end with a slash");
  let workspace = _workspace === "default" ? void 0 : _workspace, tool = _tool === "default" ? void 0 : _tool, id = getPublishedId(_id), stringifiedPath = Array.isArray(path) ? toString(jsonPathToStudioPath(path)) : path, searchParams = new URLSearchParams({
    baseUrl,
    id,
    type,
    path: stringifiedPath
  });
  if (workspace && searchParams.set("workspace", workspace), tool && searchParams.set("tool", tool), projectId2 && searchParams.set("projectId", projectId2), dataset2 && searchParams.set("dataset", dataset2), isPublishedId(_id)) searchParams.set("perspective", "published");
  else if (isVersionId(_id)) {
    let versionId = getVersionFromId(_id);
    searchParams.set("perspective", versionId);
  }
  let segments = [baseUrl === "/" ? "" : baseUrl];
  workspace && segments.push(workspace);
  let routerParams = [
    "mode=presentation",
    `id=${id}`,
    `type=${type}`,
    `path=${encodeURIComponent(stringifiedPath)}`
  ];
  return tool && routerParams.push(`tool=${tool}`), segments.push("intent", "edit", `${routerParams.join(";")}?${searchParams}`), segments.join("/");
}
function resolveMapping(resultPath, csm) {
  if (!csm?.mappings) return;
  let resultMappingPath = jsonPath(jsonPathToMappingPath(resultPath));
  if (csm.mappings[resultMappingPath] !== void 0) return {
    mapping: csm.mappings[resultMappingPath],
    matchedPath: resultMappingPath,
    pathSuffix: ""
  };
  let resultMappingPathArray = jsonPathArray(jsonPathToMappingPath(resultPath));
  for (let i = resultMappingPathArray.length - 1; i >= 0; i--) {
    let key = `$${resultMappingPathArray.slice(0, i).join("")}`, mappingFound = csm.mappings[key];
    if (mappingFound) return {
      mapping: mappingFound,
      matchedPath: key,
      pathSuffix: resultMappingPath.substring(key.length)
    };
  }
}
function resolveStudioBaseRoute(studioUrl) {
  let baseUrl = typeof studioUrl == "string" ? studioUrl : studioUrl.baseUrl;
  return baseUrl !== "/" && (baseUrl = baseUrl.replace(/\/$/, "")), typeof studioUrl == "string" ? { baseUrl } : {
    ...studioUrl,
    baseUrl
  };
}
function isArray(value) {
  return value !== null && Array.isArray(value);
}
function walkMap(value, mappingFn, path = []) {
  if (isArray(value)) return value.map((v, idx) => {
    if (isRecord(v)) {
      let _key = v._key;
      if (typeof _key == "string") return walkMap(v, mappingFn, path.concat({
        _key,
        _index: idx
      }));
    }
    return walkMap(v, mappingFn, path.concat(idx));
  });
  if (isRecord(value)) {
    if (value._type === "block" || value._type === "span") {
      let result = { ...value };
      return value._type === "block" ? result.children = walkMap(value.children, mappingFn, path.concat("children")) : value._type === "span" && (result.text = walkMap(value.text, mappingFn, path.concat("text"))), result;
    }
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walkMap(v, mappingFn, path.concat(k))]));
  }
  return mappingFn(value, path);
}
function encodeIntoResult(result, csm, encoder) {
  return walkMap(result, (value, path) => {
    if (typeof value != "string") return value;
    let resolveMappingResult = resolveMapping(path, csm);
    if (!resolveMappingResult) return value;
    let { mapping, matchedPath } = resolveMappingResult;
    if (mapping.type !== "value" || mapping.source.type !== "documentValue") return value;
    let sourceDocument = csm.documents[mapping.source.document], sourcePath = csm.paths[mapping.source.path], matchPathSegments = parseJsonPath(matchedPath);
    return encoder({
      sourcePath: parseJsonPath(sourcePath).concat(path.slice(matchPathSegments.length)),
      sourceDocument,
      resultPath: path,
      value
    });
  });
}
const filterDefault = ({ sourcePath, resultPath, value }) => {
  if (isValidDate(value) || isValidURL(value)) return false;
  let endPath = sourcePath.at(-1);
  return !(sourcePath.at(-2) === "slug" && endPath === "current" || typeof endPath == "string" && (endPath.startsWith("_") || endPath.endsWith("Id")) || sourcePath.some((path) => path === "meta" || path === "metadata" || path === "openGraph" || path === "seo") || hasTypeLike(sourcePath) || hasTypeLike(resultPath) || typeof endPath == "string" && denylist.has(endPath));
}, denylist = /* @__PURE__ */ new Set(/* @__PURE__ */ "color.colour.currency.email.format.gid.hex.href.hsl.hsla.icon.id.index.key.language.layout.link.linkAction.locale.lqip.page.path.ref.rgb.rgba.route.secret.slug.status.tag.template.theme.type.textTheme.unit.url.username.variant.website".split("."));
function isValidDate(dateString) {
  return /^\d{4}-\d{2}-\d{2}/.test(dateString) ? !!Date.parse(dateString) : false;
}
const allowedProtocols = /* @__PURE__ */ new Set([
  "app:",
  "data:",
  "discord:",
  "file:",
  "ftp:",
  "ftps:",
  "geo:",
  "http:",
  "https:",
  "imap:",
  "javascript:",
  "magnet:",
  "mailto:",
  "maps:",
  "ms-excel:",
  "ms-powerpoint:",
  "ms-word:",
  "slack:",
  "sms:",
  "spotify:",
  "steam:",
  "teams:",
  "tel:",
  "vscode:",
  "zoom:"
]);
function isValidURL(url) {
  try {
    let { protocol } = new URL(url, url.startsWith("/") ? "https://acme.com" : void 0);
    return allowedProtocols.has(protocol) || protocol.startsWith("web+");
  } catch {
    return false;
  }
}
function hasTypeLike(path) {
  return path.some((segment) => typeof segment == "string" && segment.match(/type/i) !== null);
}
function stegaEncodeSourceMap(result, resultSourceMap, config) {
  let { filter, logger, enabled } = config;
  if (!enabled) {
    let msg = "config.enabled must be true, don't call this function otherwise";
    throw logger?.error?.(`[@sanity/client]: ${msg}`, {
      result,
      resultSourceMap,
      config
    }), TypeError(msg);
  }
  if (!resultSourceMap) return logger?.error?.("[@sanity/client]: Missing Content Source Map from response body", {
    result,
    resultSourceMap,
    config
  }), result;
  if (!config.studioUrl) {
    let msg = "config.studioUrl must be defined";
    throw logger?.error?.(`[@sanity/client]: ${msg}`, {
      result,
      resultSourceMap,
      config
    }), TypeError(msg);
  }
  let report = {
    encoded: [],
    skipped: []
  }, resultWithStega = encodeIntoResult(result, resultSourceMap, ({ sourcePath, sourceDocument, resultPath, value }) => {
    if ((typeof filter == "function" ? filter({
      sourcePath,
      resultPath,
      filterDefault,
      sourceDocument,
      value
    }) : filterDefault({
      sourcePath,
      resultPath,
      value
    })) === false) return logger && report.skipped.push({
      path: prettyPathForLogging(sourcePath),
      value: `${value.slice(0, 20)}${value.length > 20 ? "..." : ""}`,
      length: value.length
    }), value;
    logger && report.encoded.push({
      path: prettyPathForLogging(sourcePath),
      value: `${value.slice(0, 20)}${value.length > 20 ? "..." : ""}`,
      length: value.length
    });
    let { baseUrl, workspace, tool } = resolveStudioBaseRoute(typeof config.studioUrl == "function" ? config.studioUrl(sourceDocument) : config.studioUrl);
    if (!baseUrl) return value;
    let { _id: id, _type: type, _projectId: projectId2, _dataset: dataset2 } = sourceDocument;
    return (0, import_dist.vercelStegaCombine)(value, {
      origin: "sanity.io",
      href: createEditUrl({
        baseUrl,
        workspace,
        tool,
        id,
        type,
        path: sourcePath,
        ...!config.omitCrossDatasetReferenceData && {
          dataset: dataset2,
          projectId: projectId2
        }
      })
    }, false);
  });
  if (logger) {
    let isSkipping = report.skipped.length, isEncoding = report.encoded.length;
    if ((isSkipping || isEncoding) && ((logger?.groupCollapsed || logger.log)?.("[@sanity/client]: Encoding source map into result"), logger.log?.(`[@sanity/client]: Paths encoded: ${report.encoded.length}, skipped: ${report.skipped.length}`)), report.encoded.length > 0 && (logger?.log?.("[@sanity/client]: Table of encoded paths"), (logger?.table || logger.log)?.(report.encoded)), report.skipped.length > 0) {
      let skipped = /* @__PURE__ */ new Set();
      for (let { path } of report.skipped) skipped.add(path.replace(reKeySegment, "0").replace(/\[\d+\]/g, "[]"));
      logger?.log?.("[@sanity/client]: List of skipped paths", [...skipped.values()]);
    }
    (isSkipping || isEncoding) && logger?.groupEnd?.();
  }
  return resultWithStega;
}
function prettyPathForLogging(path) {
  return toString(jsonPathToStudioPath(path));
}
const stegaEncodeSourceMapCO1HKnm2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  encodeIntoResult,
  stegaEncodeSourceMap
});
function uploadWithProgress(options) {
  return new cjsExports.Observable((subscriber) => {
    let xhr = new XMLHttpRequest(), { url, method, headers, body, withCredentials, timeout, signal } = options;
    xhr.open(method, url), xhr.withCredentials = withCredentials, typeof timeout == "number" && timeout > 0 && (xhr.timeout = timeout);
    for (let [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value);
    xhr.upload.onprogress = (e) => {
      subscriber.next({
        type: "progress",
        stage: "upload",
        percent: e.lengthComputable ? Math.round(e.loaded / e.total * 100) : 0,
        total: e.total || void 0,
        loaded: e.loaded,
        lengthComputable: e.lengthComputable
      });
    }, xhr.onload = () => {
      if (xhr.status >= 400) {
        let errorHeaders = parseXhrResponseHeaders(xhr.getAllResponseHeaders()), canonical = httpResponseFromFetch({
          status: xhr.status,
          statusText: xhr.statusText,
          headers: errorHeaders,
          body: parseJsonText(xhr.responseText, errorHeaders),
          url: xhr.responseURL
        }, url, method);
        subscriber.error(xhr.status >= 500 ? new ServerError(canonical) : new ClientError(canonical));
        return;
      }
      let responseBody;
      try {
        responseBody = JSON.parse(xhr.responseText);
      } catch {
        subscriber.error(/* @__PURE__ */ Error("Failed to parse upload response as JSON"));
        return;
      }
      subscriber.next({
        type: "response",
        body: responseBody
      }), subscriber.complete();
    }, xhr.onerror = () => {
      subscriber.error(/* @__PURE__ */ Error("XHR upload network error"));
    }, xhr.ontimeout = () => {
      subscriber.error(new DOMException(`The operation timed out after ${timeout}ms while attempting to reach ${url}`, "TimeoutError"));
    }, xhr.onabort = () => {
      subscriber.error(new DOMException("Upload aborted", "AbortError"));
    };
    let onSignalAbort = () => xhr.abort();
    if (signal) {
      if (signal.aborted) {
        subscriber.error(new DOMException("Upload aborted", "AbortError"));
        return;
      }
      signal.addEventListener("abort", onSignalAbort, { once: true });
    }
    return xhr.send(body), () => {
      signal?.removeEventListener("abort", onSignalAbort), xhr.abort();
    };
  });
}
function parseXhrResponseHeaders(raw) {
  let headers = new Headers();
  for (let line of raw.split("\r\n")) {
    let separator = line.indexOf(":");
    if (!(separator <= 0)) try {
      headers.append(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
    } catch {
    }
  }
  return headers;
}
const browserUploadQxCD0Hp6 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  uploadWithProgress
});
export {
  createClient as c
};
