import { u as undiciExports } from "./undici.mjs";
function createNodeFetch(options) {
  let proxyOption = options?.proxy ?? true, dispatcher, tls = options?.tls, allowH2 = options?.allowH2 ?? false;
  dispatcher = proxyOption === true ? new undiciExports.EnvHttpProxyAgent({
    connections: options?.connections,
    allowH2,
    requestTls: tls ? {
      cert: tls.cert,
      key: tls.key,
      ca: tls.ca
    } : void 0
  }) : typeof proxyOption == "string" ? new undiciExports.ProxyAgent({
    uri: proxyOption,
    connections: options?.connections,
    allowH2,
    requestTls: tls ? {
      cert: tls.cert,
      key: tls.key,
      ca: tls.ca
    } : void 0
  }) : new undiciExports.Agent({
    connections: options?.connections,
    allowH2,
    connect: tls ? {
      cert: tls.cert,
      key: tls.key,
      ca: tls.ca
    } : void 0
  });
  let halfDuplex = { duplex: "half" };
  return async function nodeFetch(input, reqInit) {
    let { body, ...rest } = reqInit ?? {}, init = {
      ...rest,
      dispatcher,
      ...body === void 0 ? {} : { body },
      ...body instanceof ReadableStream ? halfDuplex : {}
    };
    return adaptResponse(await undiciExports.fetch(input, init));
  };
}
function adaptResponse(response) {
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    url: response.url,
    redirected: response.redirected,
    body: response.body,
    text: () => response.text(),
    arrayBuffer: () => response.arrayBuffer()
  };
}
function anySignal(signals) {
  if (typeof AbortSignal.any == "function") return AbortSignal.any(signals);
  let controller = new AbortController();
  for (let signal of signals) if (signal.aborted) return controller.abort(signal.reason), controller.signal;
  let onAbort = () => {
    controller.abort(signals.find((signal) => signal.aborted)?.reason);
    for (let signal of signals) signal.removeEventListener("abort", onAbort);
  };
  for (let signal of signals) signal.addEventListener("abort", onAbort);
  return controller.signal;
}
var HttpError = class extends Error {
  constructor(opts) {
    let url = opts.url.length > 400 ? opts.url.slice(0, 399) + "…" : opts.url;
    super(`${opts.method}-request to ${url} resulted in HTTP ${opts.status} ${opts.statusText}`), this.name = "HttpError", this.url = opts.url, this.method = opts.method, this.status = opts.status, this.statusText = opts.statusText, this.headers = opts.headers, this.body = opts.body, this.response = opts.response;
  }
}, TimeoutError = class extends Error {
  constructor(opts) {
    let url = opts.url.length > 400 ? opts.url.slice(0, 399) + "…" : opts.url;
    super(`Request timed out after ${opts.timeoutMs}ms waiting for response headers: ${opts.method} ${url}`), this.name = "TimeoutError", this.url = opts.url, this.method = opts.method, this.timeoutMs = opts.timeoutMs, this.phase = opts.phase, this.code = "ETIMEDOUT";
  }
};
let decoder;
function createBufferedResponse(status, statusText, headers, body, url, redirected) {
  let cachedText, cachedJson;
  return {
    status,
    statusText,
    headers,
    url,
    redirected,
    body,
    text() {
      return cachedText ??= (decoder ??= new TextDecoder()).decode(body);
    },
    json() {
      return (cachedJson ??= { value: JSON.parse(this.text()) }).value;
    },
    bytes() {
      return body;
    }
  };
}
function createRequester$1(options) {
  let instanceFetch = options?.fetch, instanceBase = options?.base, instanceHttpErrors = options?.httpErrors, instanceTimeout = options?.timeout, instanceCredentials = options?.credentials, middleware = options?.middleware ?? [], transforms = [], wrappers = [];
  for (let mw of middleware) typeof mw == "object" ? transforms.push(mw) : wrappers.push(mw);
  async function performFetch(fetchFn, opts) {
    let { totalMs, headersMs, attachSignal } = resolveTimeout(opts.timeout === void 0 ? instanceTimeout : opts.timeout), { url, init, clearTotalTimer } = buildFetchArgs(opts, attachSignal ? totalMs : void 0, instanceCredentials), method = init.method ?? "GET", totalTimeout = !attachSignal && totalMs !== void 0 ? rejectAfterTimeout(totalMs, new DOMException("The operation was aborted due to timeout", "TimeoutError")) : void 0, totalDeadline = totalTimeout?.deadline, clearDeadline = () => {
      clearTotalTimer?.(), totalTimeout?.clear();
    };
    if (headersMs === void 0 && totalDeadline === void 0) try {
      return {
        response: await fetchFn(url, init),
        url,
        method,
        totalDeadline,
        clearDeadline
      };
    } catch (reason) {
      throw clearDeadline(), reason;
    }
    let deadlines = totalDeadline === void 0 ? [] : [totalDeadline], timer, controller;
    if (headersMs !== void 0) {
      let timeoutError = new TimeoutError({
        url,
        method,
        timeoutMs: headersMs,
        phase: "headers"
      });
      controller = attachSignal ? new AbortController() : void 0, deadlines.push(new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(timeoutError), controller?.abort(timeoutError);
        }, headersMs);
      }));
    }
    let signal = controller && init.signal ? anySignal([init.signal, controller.signal]) : controller?.signal ?? init.signal, fetching;
    try {
      return fetching = Promise.resolve(controller ? fetchFn(url, {
        ...init,
        signal
      }) : fetchFn(url, init)), {
        response: await Promise.race([fetching, ...deadlines]),
        url,
        method,
        totalDeadline,
        clearDeadline
      };
    } catch (reason) {
      throw fetching?.then((response) => response.body?.cancel()).catch(() => {
      }), clearDeadline(), reason;
    } finally {
      clearTimeout(timer);
    }
  }
  async function getItBuffered(opts) {
    let { response, url, method, totalDeadline, clearDeadline } = await performFetch(opts.fetch ?? instanceFetch ?? globalThis.fetch, opts), httpErrors = opts.httpErrors ?? instanceHttpErrors ?? true;
    try {
      return await raceDeadline(bufferAndCheck(response, httpErrors, url, method), totalDeadline);
    } finally {
      clearDeadline();
    }
  }
  let fetchChain = composeFetchChain(getItBuffered, wrappers);
  async function requestJson(opts) {
    let transformedOpts = runBeforeRequest(opts, transforms), buffered = runAfterResponse(await fetchChain(transformedOpts), transformedOpts, transforms);
    try {
      return responseOf(buffered, JSON.parse(buffered.text()));
    } catch (cause) {
      throw TypeError(`Failed to parse JSON response from ${opts.url}: ${cause instanceof Error ? cause.message : cause}`, { cause });
    }
  }
  async function requestText(opts) {
    let transformedOpts = runBeforeRequest(opts, transforms), buffered = runAfterResponse(await fetchChain(transformedOpts), transformedOpts, transforms);
    return responseOf(buffered, buffered.text());
  }
  async function requestStream(opts) {
    let transformedOpts = runBeforeRequest(opts, transforms), capturedResponse;
    async function getItStreamed(reqOpts) {
      let { response, url, method, totalDeadline, clearDeadline } = await performFetch(reqOpts.fetch ?? instanceFetch ?? globalThis.fetch, reqOpts), httpErrors = reqOpts.httpErrors ?? instanceHttpErrors ?? true;
      if (httpErrors && response.status >= 400) try {
        return await raceDeadline(bufferAndCheck(response, httpErrors, url, method), totalDeadline);
      } finally {
        clearDeadline();
      }
      return totalDeadline !== void 0 && clearDeadline(), capturedResponse = response, createBufferedResponse(response.status, response.statusText, response.headers, /* @__PURE__ */ new Uint8Array(), response.url, response.redirected);
    }
    if (defineFnName(getItStreamed, "getItStreamed"), await composeFetchChain(getItStreamed, wrappers)(transformedOpts), !capturedResponse) throw Error("Stream response was not captured");
    let streamBody = capturedResponse.body ?? new ReadableStream({ start(controller) {
      controller.close();
    } });
    return responseOf(capturedResponse, streamBody);
  }
  async function request(input) {
    let raw = typeof input == "string" ? { url: input } : input, url = raw.url;
    instanceBase && !/^https?:\/\//.test(url) && (url = instanceBase.replace(/\/$/, "") + "/" + url.replace(/^\//, ""));
    let opts = {
      ...raw,
      url,
      headers: mergeHeaders(options?.headers, raw.headers)
    };
    switch (opts.as ?? options?.as) {
      case "json":
        return await requestJson(opts);
      case "text":
        return await requestText(opts);
      case "stream":
        return await requestStream(opts);
      default: {
        let transformedOpts = runBeforeRequest(opts, transforms);
        return runAfterResponse(await fetchChain(transformedOpts), transformedOpts, transforms);
      }
    }
  }
  return defineFnName(performFetch, "performFetch"), defineFnName(getItBuffered, "getItBuffered"), defineFnName(requestStream, "requestStream"), defineFnName(requestJson, "requestJson"), defineFnName(requestText, "requestText"), defineFnName(request, "request"), request;
}
function resolveTimeout(value) {
  return typeof value == "number" || value === false ? {
    totalMs: enabledMs(value),
    headersMs: void 0,
    attachSignal: true
  } : {
    totalMs: value?.total === void 0 ? 12e4 : enabledMs(value.total),
    headersMs: enabledMs(value?.headers),
    attachSignal: value?.signal !== false
  };
}
function enabledMs(value) {
  if (!(value === void 0 || value === false || value <= 0)) return value;
}
function unrefTimer(timer) {
  typeof timer == "object" && timer && "unref" in timer && typeof timer.unref == "function" && timer.unref();
}
function rejectAfterTimeout(ms, reason) {
  let timer, deadline = new Promise((_, reject) => {
    timer = setTimeout(() => reject(reason), ms), unrefTimer(timer);
  });
  return deadline.catch(() => {
  }), {
    deadline,
    clear: () => clearTimeout(timer)
  };
}
async function raceDeadline(work, deadline) {
  if (deadline === void 0) return work;
  try {
    return await Promise.race([work, deadline]);
  } catch (reason) {
    throw work.catch(() => {
    }), reason;
  }
}
function isPlainObject$1(value) {
  if (typeof value != "object" || !value || Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function isBinaryBody(value) {
  return value instanceof Blob || value instanceof ArrayBuffer || value instanceof ReadableStream || ArrayBuffer.isView(value) || value instanceof FormData || value instanceof URLSearchParams;
}
function sanitizeHeaders(input) {
  if (input instanceof Headers || Array.isArray(input)) return input;
  let clean = {};
  for (let [key, value] of Object.entries(input)) value !== void 0 && (clean[key] = value);
  return clean;
}
function mergeHeaders(base, override) {
  let headers = new Headers(base ? sanitizeHeaders(base) : void 0);
  override && new Headers(sanitizeHeaders(override)).forEach((value, key) => {
    headers.set(key, value);
  });
  let result = {};
  return headers.forEach((value, key) => {
    result[key] = value;
  }), result;
}
function buildFetchArgs(opts, totalMs, instanceCredentials) {
  let url = opts.url;
  if (opts.query) {
    let entries = opts.query instanceof URLSearchParams ? opts.query.entries() : Object.entries(opts.query), params = new URLSearchParams();
    for (let [key, value] of entries) value !== void 0 && params.append(key, `${value}`);
    let qs = params.toString();
    if (qs) {
      let fragmentStart = url.indexOf("#"), urlWithoutFragment = fragmentStart === -1 ? url : url.slice(0, fragmentStart), fragment = fragmentStart === -1 ? "" : url.slice(fragmentStart);
      url = `${urlWithoutFragment}${urlWithoutFragment.includes("?") ? "&" : "?"}${qs}${fragment}`;
    }
  }
  let headers = new Headers(opts.headers), init = {};
  if (opts.method && (init.method = opts.method), !opts.method && opts.body !== void 0 && opts.body !== null && (init.method = "POST"), opts.body !== void 0 && opts.body !== null) if (typeof opts.body == "string") init.body = opts.body;
  else if (isPlainObject$1(opts.body) || Array.isArray(opts.body)) init.body = JSON.stringify(opts.body), headers.has("content-type") || headers.set("content-type", "application/json");
  else if (isBinaryBody(opts.body)) init.body = opts.body;
  else throw TypeError(`Unsupported body type: ${typeof opts.body}`);
  init.headers = headers;
  let signal = opts.signal, clearTotalTimer;
  if (totalMs !== void 0) {
    let totalController = new AbortController(), timer = setTimeout(() => totalController.abort(new DOMException("The operation was aborted due to timeout", "TimeoutError")), totalMs);
    unrefTimer(timer), clearTotalTimer = () => clearTimeout(timer), signal = signal ? anySignal([signal, totalController.signal]) : totalController.signal;
  }
  signal && (init.signal = signal);
  let credentials = opts.credentials ?? instanceCredentials;
  return credentials !== void 0 && (init.credentials = credentials), opts.redirect && (init.redirect = opts.redirect), {
    url,
    init,
    clearTotalTimer
  };
}
async function bufferAndCheck(response, httpErrors, requestUrl, requestMethod) {
  let arrayBuffer = await response.arrayBuffer(), bytes = new Uint8Array(arrayBuffer), buffered = createBufferedResponse(response.status, response.statusText, response.headers, bytes, response.url, response.redirected);
  if (httpErrors && response.status >= 400) {
    let error = new HttpError({
      url: requestUrl,
      method: requestMethod,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: buffered.text(),
      response: buffered
    });
    throw hasV8StackTraceApi(Error) && Error.captureStackTrace(error, bufferAndCheck), error;
  }
  return buffered;
}
function composeFetchChain(coreFetch, wrappers) {
  let chain = coreFetch;
  for (let i = wrappers.length - 1; i >= 0; i--) {
    let wrapper = wrappers[i], next = chain;
    chain = (opts) => wrapper(opts, next);
  }
  return chain;
}
function runBeforeRequest(opts, transforms) {
  let result = opts;
  for (let mw of transforms) mw.beforeRequest && (result = mw.beforeRequest(result));
  return result;
}
function runAfterResponse(response, options, transforms) {
  let result = response;
  for (let mw of transforms) mw.afterResponse && (result = mw.afterResponse(result, options));
  return result;
}
function responseOf(source, body) {
  return {
    status: source.status,
    statusText: source.statusText,
    headers: source.headers,
    url: source.url,
    redirected: source.redirected,
    body
  };
}
function hasV8StackTraceApi(ctor) {
  return "captureStackTrace" in ctor;
}
function defineFnName(fn, name) {
  Object.defineProperty(fn, "name", { value: name });
}
function isHttpError(error) {
  if (!isRecord(error) || error.name !== "HttpError" || typeof error.message != "string" || typeof error.url != "string" || typeof error.method != "string" || typeof error.status != "number" || typeof error.statusText != "string" || !isHeaders(error.headers) || !("body" in error) || !isRecord(error.response)) return false;
  let response = error.response;
  return response.status === error.status && typeof response.statusText == "string" && isHeaders(response.headers) && "body" in response && (response.url === void 0 || typeof response.url == "string") && (response.redirected === void 0 || typeof response.redirected == "boolean");
}
function isRecord(value) {
  return typeof value == "object" && !!value;
}
function isHeaders(value) {
  return isRecord(value) && typeof value.get == "function";
}
let defaultFetch;
function nodeCreateRequester(options) {
  return options?.fetch || (defaultFetch ??= createNodeFetch()), createRequester$1({
    ...options,
    fetch: options?.fetch ?? defaultFetch
  });
}
function createRequester(options) {
  return nodeCreateRequester(options);
}
const DEFAULT_REDACT_HEADERS = ["cookie", "authorization"];
let requestId = 0;
function debug(opts) {
  let log = opts?.log, redactSet = new Set((opts?.redactHeaders ?? DEFAULT_REDACT_HEADERS).map((h) => h.toLowerCase())), verbose = opts?.verbose;
  return log ? async function debugMiddleware(options, next) {
    let metaId = options.meta?.requestId, id = typeof metaId == "string" || typeof metaId == "number" ? metaId : ++requestId, method = (options.method ?? "GET").toUpperCase();
    log("[%s] %s %s", id, method, options.url), options.headers && log("[%s] request headers %o", id, headersToObject(options.headers, redactSet)), options.body !== void 0 && options.body !== null && log("[%s] request body %s", id, summarizeBody(options.body));
    try {
      let response = await next(options);
      return log("[%s] %d %s", id, response.status, response.statusText), verbose && (log("[%s] response headers %o", id, headersToObject(response.headers, redactSet)), log("[%s] response body %s", id, summarizeBody(response.text()))), response;
    } catch (error) {
      throw log("[%s] error %s", id, error instanceof Error ? error.message : String(error)), error;
    }
  } : noopMiddleware;
}
async function noopMiddleware(options, next) {
  return next(options);
}
function summarizeBody(body) {
  return typeof body == "string" ? truncate(body, 16384) : isPlainObject(body) || Array.isArray(body) ? truncate(JSON.stringify(body), 16384) : body instanceof ReadableStream ? "[ReadableStream]" : body instanceof FormData ? "[FormData]" : body instanceof URLSearchParams ? truncate(body.toString(), 16384) : body instanceof ArrayBuffer || ArrayBuffer.isView(body) ? `[binary ${body.byteLength} bytes]` : String(body);
}
function truncate(str, max) {
  return str.length <= max ? str : str.slice(0, max) + `… (${str.length - max} more characters)`;
}
function isPlainObject(value) {
  if (typeof value != "object" || !value) return false;
  let proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function headersToObject(headers, redactSet) {
  let result = {};
  return new Headers(headers).forEach((value, key) => {
    result[key] = redactSet.has(key.toLowerCase()) ? "REDACTED" : value;
  }), result;
}
function retry(opts) {
  let defaultMaxRetries = opts?.maxRetries ?? 5, retryDelay = opts?.retryDelay ?? getRetryDelay, shouldRetry = opts?.shouldRetry ?? isRetryableRequest;
  return async function retryMiddleware(options, next) {
    let maxRetries = typeof options.maxRetries == "number" ? options.maxRetries : defaultMaxRetries, lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) try {
      return await next(options);
    } catch (error) {
      if (lastError = error, attempt >= maxRetries || !shouldRetry(error, attempt, options)) throw error;
      await sleep(retryDelay(attempt), options.signal);
    }
    throw lastError;
  };
}
function getRetryDelay(attemptNumber) {
  return 100 * 2 ** attemptNumber + Math.random() * 100;
}
function isRetryableRequest(error, _attemptNumber, options) {
  let method = (options.method ?? "GET").toUpperCase();
  return method !== "GET" && method !== "HEAD" || error instanceof Error && "name" in error && error.name === "HttpError" ? false : isRetryableError(error);
}
const RETRYABLE_CODES = /* @__PURE__ */ new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EPIPE",
  "ENOTFOUND",
  "ENETDOWN",
  "EHOSTUNREACH",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_SOCKET"
]);
function isRetryableError(error) {
  if (!(error instanceof Error)) return false;
  let code = getErrorCode(error) ?? getErrorCode(error.cause);
  return code ? RETRYABLE_CODES.has(code) : error.name === "TimeoutError" || error.name === "AbortError" ? false : "retryable" in error && typeof error.retryable == "boolean" ? error.retryable : error instanceof TypeError;
}
function getErrorCode(error) {
  if (error instanceof Error) return "code" in error && typeof error.code == "string" ? error.code : void 0;
}
function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    let timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer), reject(signal.reason);
    }, { once: true });
  });
}
export {
  anySignal as a,
  isRetryableRequest as b,
  createRequester as c,
  debug as d,
  createNodeFetch as e,
  isHttpError as i,
  retry as r
};
