import { c as createParser } from "./eventsource-parser.mjs";
class ErrorEvent extends Event {
  /**
   * HTTP status code, if this was triggered by an HTTP error
   * Note: this is not part of the spec, but is included for better error handling.
   *
   * @public
   */
  code;
  /**
   * Optional message attached to the error.
   * Note: this is not part of the spec, but is included for better error handling.
   *
   * @public
   */
  message;
  /**
   * Constructs a new `ErrorEvent` instance. This is typically not called directly,
   * but rather emitted by the `EventSource` object when an error occurs.
   *
   * @param type - The type of the event (should be "error")
   * @param errorEventInitDict - Optional properties to include in the error event
   */
  constructor(type, errorEventInitDict) {
    super(type);
    this.code = errorEventInitDict?.code ?? void 0;
    this.message = errorEventInitDict?.message ?? void 0;
  }
  /**
   * Node.js "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Node.js when you `console.log` an instance of this class.
   *
   * @param _depth - The current depth
   * @param options - The options passed to `util.inspect`
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @returns A string representation of the error
   */
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")](_depth, options, inspect) {
    return inspect(inspectableError(this), options);
  }
  /**
   * Deno "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Deno when you `console.log` an instance of this class.
   *
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @param options - The options passed to `Deno.inspect`
   * @returns A string representation of the error
   */
  [/* @__PURE__ */ Symbol.for("Deno.customInspect")](inspect, options) {
    return inspect(inspectableError(this), options);
  }
}
function syntaxError(message) {
  const DomException = globalThis.DOMException;
  if (typeof DomException === "function") {
    return new DomException(message, "SyntaxError");
  }
  return new SyntaxError(message);
}
function flattenError(err) {
  if (!(err instanceof Error)) {
    return `${err}`;
  }
  if ("errors" in err && Array.isArray(err.errors)) {
    return err.errors.map(flattenError).join(", ");
  }
  if ("cause" in err && err.cause instanceof Error) {
    return `${err}: ${flattenError(err.cause)}`;
  }
  return err.message;
}
function inspectableError(err) {
  return {
    type: err.type,
    message: err.message,
    code: err.code,
    defaultPrevented: err.defaultPrevented,
    cancelable: err.cancelable,
    timeStamp: err.timeStamp
  };
}
const DEFAULT_MAX_BUFFER_SIZE = 100 * 1024 * 1024;
class EventSourceImpl extends EventTarget {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;
  CONNECTING = 0;
  OPEN = 1;
  CLOSED = 2;
  get readyState() {
    return this.#readyState;
  }
  get url() {
    return this.#url.href;
  }
  get withCredentials() {
    return this.#withCredentials;
  }
  get onerror() {
    return this.#onError;
  }
  set onerror(value) {
    if (this.#onError) {
      this.removeEventListener("error", this.#onError);
    }
    this.#onError = value;
    if (value) {
      this.addEventListener("error", value);
    }
  }
  get onmessage() {
    return this.#onMessage;
  }
  set onmessage(value) {
    if (this.#onMessage) {
      this.removeEventListener("message", this.#onMessage);
    }
    this.#onMessage = value;
    if (value) {
      this.addEventListener("message", value);
    }
  }
  get onopen() {
    return this.#onOpen;
  }
  set onopen(value) {
    if (this.#onOpen) {
      this.removeEventListener("open", this.#onOpen);
    }
    this.#onOpen = value;
    if (value) {
      this.addEventListener("open", value);
    }
  }
  addEventListener(type, listener, options) {
    const listen = listener;
    super.addEventListener(type, listen, options);
  }
  removeEventListener(type, listener, options) {
    const listen = listener;
    super.removeEventListener(type, listen, options);
  }
  constructor(url, eventSourceInitDict) {
    super();
    try {
      if (url instanceof URL) {
        this.#url = url;
      } else if (typeof url === "string") {
        this.#url = new URL(url, getBaseURL());
      } else {
        throw new Error("Invalid URL");
      }
    } catch {
      throw syntaxError("An invalid or illegal string was specified");
    }
    this.#parser = createParser({
      maxBufferSize: eventSourceInitDict?.maxBufferSize ?? DEFAULT_MAX_BUFFER_SIZE,
      onEvent: this.#onEvent,
      onError: this.#onParseError,
      onId: this.#onIdChange,
      onRetry: this.#onRetryChange
    });
    this.#readyState = this.CONNECTING;
    this.#reconnectInterval = 3e3;
    this.#fetch = eventSourceInitDict?.fetch ?? globalThis.fetch;
    this.#withCredentials = eventSourceInitDict?.withCredentials ?? false;
    this.#connect();
  }
  close() {
    if (this.#reconnectTimer)
      clearTimeout(this.#reconnectTimer);
    if (this.#readyState === this.CLOSED)
      return;
    if (this.#controller)
      this.#controller.abort();
    this.#readyState = this.CLOSED;
    this.#controller = void 0;
  }
  // PRIVATES FOLLOW
  /**
   * Current connection state
   *
   * @internal
   */
  #readyState;
  /**
   * Original URL used to connect.
   *
   * Note that this will stay the same even after a redirect.
   *
   * @internal
   */
  #url;
  /**
   * The destination URL after a redirect. Is reset on reconnection.
   *
   * @internal
   */
  #redirectUrl;
  /**
   * Whether to include credentials in the request
   *
   * @internal
   */
  #withCredentials;
  /**
   * The fetch implementation to use
   *
   * @internal
   */
  #fetch;
  /**
   * The reconnection time in milliseconds
   *
   * @internal
   */
  #reconnectInterval;
  /**
   * Reference to an ongoing reconnect attempt, if any
   *
   * @internal
   */
  #reconnectTimer;
  /**
   * The last event ID seen by the EventSource, which will be sent as `Last-Event-ID` in the
   * request headers on a reconnection attempt.
   *
   * @internal
   */
  #lastEventId = null;
  /**
   * The AbortController instance used to abort the fetch request
   *
   * @internal
   */
  #controller;
  /**
   * Instance of an EventSource parser (`eventsource-parser` npm module)
   *
   * @internal
   */
  #parser;
  /**
   * Holds the current error handler, attached through `onerror` property directly.
   * Note that `addEventListener('error', …)` will not be stored here.
   *
   * @internal
   */
  #onError = null;
  /**
   * Holds the current message handler, attached through `onmessage` property directly.
   * Note that `addEventListener('message', …)` will not be stored here.
   *
   * @internal
   */
  #onMessage = null;
  /**
   * Holds the current open handler, attached through `onopen` property directly.
   * Note that `addEventListener('open', …)` will not be stored here.
   *
   * @internal
   */
  #onOpen = null;
  /**
   * Connect to the given URL and start receiving events
   *
   * @internal
   */
  #connect() {
    this.#readyState = this.CONNECTING;
    this.#controller = new AbortController();
    const fetch = this.#fetch;
    fetch(this.#url, this.#getRequestOptions()).then(this.#onFetchResponse).catch(this.#onFetchError);
  }
  /**
   * Handles the fetch response
   *
   * @param response - The Fetch(ish) response
   * @internal
   */
  #onFetchResponse = async (response) => {
    this.#parser.reset();
    const { body, redirected, status, headers } = response;
    if (status === 204) {
      this.#failConnection("Server sent HTTP 204, not reconnecting", 204);
      this.close();
      return;
    }
    if (redirected) {
      this.#redirectUrl = new URL(response.url);
    } else {
      this.#redirectUrl = void 0;
    }
    if (status !== 200) {
      this.#failConnection(`Non-200 status code (${status})`, status);
      return;
    }
    const contentType = headers.get("content-type") || "";
    if (!contentType.startsWith("text/event-stream")) {
      this.#failConnection('Invalid content type, expected "text/event-stream"', status);
      return;
    }
    if (this.#readyState === this.CLOSED) {
      return;
    }
    this.#readyState = this.OPEN;
    const openEvent = new Event("open");
    this.dispatchEvent(openEvent);
    if (typeof body !== "object" || !body || !("getReader" in body)) {
      this.#failConnection("Invalid response body, expected a web ReadableStream", status);
      this.close();
      return;
    }
    const decoder = new TextDecoder();
    const reader = body.getReader();
    let open = true;
    do {
      const { done, value } = await reader.read();
      if (this.#readyState === this.CLOSED) {
        open = false;
        break;
      }
      if (value) {
        this.#parser.feed(decoder.decode(value, { stream: !done }));
      }
      if (!done) {
        continue;
      }
      open = false;
      this.#parser.reset();
      this.#scheduleReconnect();
    } while (open);
  };
  /**
   * Handles rejected requests for the EventSource endpoint
   *
   * @param err - The error from `fetch()`
   * @internal
   */
  #onFetchError = (err) => {
    this.#controller = void 0;
    if (err.name === "AbortError" || err.type === "aborted") {
      return;
    }
    this.#scheduleReconnect(flattenError(err));
  };
  /**
   * Get request options for the `fetch()` request
   *
   * @returns The request options
   * @internal
   */
  #getRequestOptions() {
    const lastEvent = this.#lastEventId ? { "Last-Event-ID": this.#lastEventId } : void 0;
    const init = {
      // [spec] Let `corsAttributeState` be `Anonymous`…
      // [spec] …will have their mode set to "cors"…
      mode: "cors",
      redirect: "follow",
      headers: { Accept: "text/event-stream", ...lastEvent },
      cache: "no-store",
      signal: this.#controller?.signal
    };
    if ("window" in globalThis) {
      init.credentials = this.withCredentials ? "include" : "same-origin";
    }
    return init;
  }
  /**
   * Called by EventSourceParser when a blank line ends a block containing a valid `id` field.
   * This runs before `#onEvent` when the same block also contains data.
   *
   * @param value - The value of the `id` field
   * @internal
   */
  #onIdChange = (value) => {
    this.#lastEventId = value;
  };
  /**
   * Called by EventSourceParser instance when an event has successfully been parsed
   * and is ready to be processed.
   *
   * @param event - The parsed event
   * @internal
   */
  #onEvent = (event) => {
    const origin = this.#redirectUrl ? this.#redirectUrl.origin : this.#url.origin;
    const lastEventId = this.#lastEventId ?? "";
    const messageEvent = new MessageEvent(event.event || "message", {
      data: event.data,
      origin,
      lastEventId
    });
    if (messageEvent.origin !== origin) {
      defineEventProperty(messageEvent, "origin", origin);
    }
    if (messageEvent.lastEventId !== lastEventId) {
      defineEventProperty(messageEvent, "lastEventId", lastEventId);
    }
    this.dispatchEvent(messageEvent);
  };
  /**
   * Called by EventSourceParser instance when a new reconnection interval is received
   * from the EventSource endpoint.
   *
   * @param value - The new reconnection interval in milliseconds
   * @internal
   */
  #onRetryChange = (value) => {
    this.#reconnectInterval = value;
  };
  /**
   * Called by EventSourceParser instance when a parse error occurs.
   *
   * @param error - The parser error
   * @internal
   */
  #onParseError = (error) => {
    if (error.type !== "max-buffer-size-exceeded") {
      return;
    }
    this.close();
    this.#failConnection(error.message);
  };
  /**
   * Handles the process referred to in the EventSource specification as "failing a connection".
   *
   * @param error - The error causing the connection to fail
   * @param code - The HTTP status code, if available
   * @internal
   */
  #failConnection(message, code) {
    if (this.#readyState !== this.CLOSED) {
      this.#readyState = this.CLOSED;
    }
    const errorEvent = new ErrorEvent("error", { code, message });
    this.dispatchEvent(errorEvent);
  }
  /**
   * Schedules a reconnection attempt against the EventSource endpoint.
   *
   * @param message - The error causing the connection to fail
   * @param code - The HTTP status code, if available
   * @internal
   */
  #scheduleReconnect(message, code) {
    if (this.#readyState === this.CLOSED) {
      return;
    }
    this.#readyState = this.CONNECTING;
    const errorEvent = new ErrorEvent("error", { code, message });
    this.dispatchEvent(errorEvent);
    const timer = setTimeout(this.#reconnect, this.#reconnectInterval);
    if (typeof timer === "object" && timer !== null && "unref" in timer) {
      timer.unref();
    }
    this.#reconnectTimer = timer;
  }
  /**
   * Reconnects to the EventSource endpoint after a disconnect/failure
   *
   * @internal
   */
  #reconnect = () => {
    this.#reconnectTimer = void 0;
    if (this.#readyState !== this.CONNECTING) {
      return;
    }
    this.#connect();
  };
}
Object.defineProperty(EventSourceImpl, "name", { value: "EventSource" });
Object.defineProperty(EventSourceImpl, /* @__PURE__ */ Symbol.for("eventsource.supports-fetch-override"), {
  value: true,
  writable: false,
  configurable: false,
  enumerable: false
});
const EventSource = EventSourceImpl;
function getBaseURL() {
  const doc = "document" in globalThis ? globalThis.document : void 0;
  return doc && typeof doc === "object" && "baseURI" in doc && typeof doc.baseURI === "string" ? doc.baseURI : void 0;
}
function defineEventProperty(event, property, value) {
  Object.defineProperty(event, property, {
    value,
    enumerable: true,
    configurable: true
  });
}
export {
  EventSource as E
};
