import { AsyncLocalStorage } from "node:async_hooks";
import { H as H3Event, t as toResponse, s as sanitizeStatusCode, a as sanitizeStatusMessage, c as clearSession$1, d as deleteCookie$1, p as parseCookies, g as getRequestHost$1, b as getRequestIP$1, e as getRequestProtocol$1, f as getRequestURL, h as getSession$1, i as getValidatedQuery$1, j as sealSession$1, k as setCookie$1, u as unsealSession$1, l as updateSession$1, m as useSession$1 } from "../_libs/h3-v2.mjs";
import { A as defineHandlerCallback, C as resolveManifestAssetLink, s as resolveManifestCssLink, j as rootRouteId, D as getNormalizedURL, x as waitForReason, E as isPromise, F as normalizeSsrResponse, G as attachRouterServerSsrUtils, H as _getRenderedMatches, I as stripSsrResponseBody, J as bindSsrResponseToRequest, K as createSerializationAdapter, i as invariant, e as isNotFound, L as isRedirect, M as mergeHeaders, N as executeRewriteInput, a as isDangerousProtocol, O as replaceSsrResponse, P as isSsrResponse, Q as disposeSsrResponse, S as makeSerovalPlugin, p as getScriptPreloadAttrs, T as getStylesheetHref, U as createRawStreamRPCPlugin, V as parseRedirect, W as defaultSerovalDeserializerPlugins } from "../_libs/tanstack__router-core.mjs";
import { f as fromJSON, t as toCrossJSONAsync, d as toCrossJSONStream } from "../_libs/seroval.mjs";
import { c as createServerHistory } from "../_libs/tanstack__history.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { r as renderRouterToStream, R as RouterProvider } from "../_libs/tanstack__react-router.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
function StartServer(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
  request,
  router,
  responseHeaders,
  children: /* @__PURE__ */ jsxRuntimeExports.jsx(StartServer, { router })
}));
var GLOBAL_EVENT_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
  return (typeof value === "object" || typeof value === "function") && value !== null && typeof value.then === "function";
}
function getSetCookieValues(headers) {
  const headersWithSetCookie = headers;
  if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
  const value = headers.get("set-cookie");
  return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
  if (response.ok) return;
  const eventSetCookies = getSetCookieValues(event.res.headers);
  if (eventSetCookies.length === 0) return;
  const responseSetCookies = getSetCookieValues(response.headers);
  response.headers.delete("set-cookie");
  for (const cookie of responseSetCookies) response.headers.append("set-cookie", cookie);
  for (const cookie of eventSetCookies) response.headers.append("set-cookie", cookie);
}
function finalizeResponse(value, event) {
  const response = ensureResponse(value);
  mergeEventResponseHeaders(response, event);
  return response;
}
function finalizeMaybeResponse(value, event) {
  if (isPromiseLike(value)) return Promise.resolve(value).then((resolved) => finalizeResponse(resolved, event), (error) => finalizeResponse(handleResponseError(error), event));
  return finalizeResponse(value, event);
}
function ensureResponse(value) {
  if (value instanceof Response) return value;
  return new Response("Internal Server Error", { status: 500 });
}
function handleResponseError(error) {
  if (error instanceof Response) return error;
  if (error instanceof Error) throw error;
  return new Response("Internal Server Error", { status: 500 });
}
function requestHandler(handler) {
  return (request, requestOpts) => {
    let h3Event;
    try {
      h3Event = new H3Event(request);
    } catch (error) {
      if (error instanceof URIError) return new Response(null, {
        status: 400,
        statusText: "Bad Request"
      });
      throw error;
    }
    let response;
    try {
      response = eventStorage.run({ h3Event }, () => handler(request, requestOpts));
    } catch (error) {
      response = handleResponseError(error);
    }
    return toResponse(finalizeMaybeResponse(response, h3Event), h3Event);
  };
}
function getH3Event() {
  const event = eventStorage.getStore();
  if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return event.h3Event;
}
function getRequest() {
  return getH3Event().req;
}
function getRequestHeaders() {
  return getH3Event().req.headers;
}
function getRequestHeader(name) {
  return getRequestHeaders().get(name) || void 0;
}
function getRequestIP(opts) {
  return getRequestIP$1(getH3Event(), opts);
}
function getRequestHost(opts) {
  return getRequestHost$1(getH3Event(), opts);
}
function getRequestUrl(opts) {
  return getRequestURL(getH3Event(), opts);
}
function getRequestProtocol(opts) {
  return getRequestProtocol$1(getH3Event(), opts);
}
function setResponseHeaders(headers) {
  const event = getH3Event();
  if (event.res.headers === headers) return;
  let previousName = "";
  for (const [name, value] of headers) {
    event.res.headers[name === previousName ? "append" : "set"](name, value);
    previousName = name;
  }
}
function getResponseHeaders() {
  return getH3Event().res.headers;
}
function getResponseHeader(name) {
  return getH3Event().res.headers.get(name) || void 0;
}
function setResponseHeader(name, value) {
  const event = getH3Event();
  if (Array.isArray(value)) {
    event.res.headers.delete(name);
    for (const valueItem of value) event.res.headers.append(name, valueItem);
  } else event.res.headers.set(name, value);
}
function removeResponseHeader(name) {
  getH3Event().res.headers.delete(name);
}
function clearResponseHeaders(headerNames) {
  const event = getH3Event();
  if (headerNames && headerNames.length > 0) for (const name of headerNames) event.res.headers.delete(name);
  else for (const name of event.res.headers.keys()) event.res.headers.delete(name);
}
function getResponseStatus() {
  return getH3Event().res.status || 200;
}
function setResponseStatus(code, text) {
  const event = getH3Event();
  if (code) event.res.status = sanitizeStatusCode(code, event.res.status);
  if (text) event.res.statusText = sanitizeStatusMessage(text);
}
function getCookies() {
  const cookies = parseCookies(getH3Event());
  const definedCookies = /* @__PURE__ */ Object.create(null);
  for (const [name, value] of Object.entries(cookies)) if (value !== void 0) definedCookies[name] = value;
  return definedCookies;
}
function getCookie(name) {
  return getCookies()[name];
}
function setCookie(name, value, options) {
  setCookie$1(getH3Event(), name, value, options);
}
function deleteCookie(name, options) {
  deleteCookie$1(getH3Event(), name, options);
}
function getDefaultSessionConfig(config) {
  return {
    name: "start",
    ...config
  };
}
function useSession(config) {
  return useSession$1(getH3Event(), getDefaultSessionConfig(config));
}
function getSession(config) {
  return getSession$1(getH3Event(), getDefaultSessionConfig(config));
}
function updateSession(config, update) {
  return updateSession$1(getH3Event(), getDefaultSessionConfig(config), update);
}
function sealSession(config) {
  return sealSession$1(getH3Event(), getDefaultSessionConfig(config));
}
function unsealSession(config, sealed) {
  return unsealSession$1(getH3Event(), getDefaultSessionConfig(config), sealed);
}
function clearSession(config) {
  return clearSession$1(getH3Event(), {
    name: "start",
    ...config
  });
}
function getResponse() {
  return getH3Event().res;
}
function getValidatedQuery(schema) {
  return getValidatedQuery$1(getH3Event(), schema);
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
async function getStartManifest(matchedRoutes) {
  const { tsrStartManifest } = await import("../_tanstack-start-manifest_v-CtHIERdX.mjs");
  const startManifest = tsrStartManifest();
  let routes = startManifest.routes;
  routes[rootRouteId];
  const manifestRoutes = {};
  for (const k in routes) {
    const v = routes[k];
    const result = {};
    if (v.preloads && v.preloads.length > 0) result.preloads = v.preloads;
    if (v.scripts && v.scripts.length > 0) result.scripts = v.scripts;
    if (v.css?.length) result.css = v.css;
    if (result.preloads || result.scripts || result.css) manifestRoutes[k] = result;
  }
  return {
    ...startManifest.scriptFormat ? { scriptFormat: startManifest.scriptFormat } : {},
    ...startManifest.inlineCss ? { inlineCss: startManifest.inlineCss } : {},
    routes: manifestRoutes
  };
}
const manifest = {
  "0067593134eb193da671a475c2adac40f368f2a32fe7848244690c7165394cee": {
    functionName: "createTicket_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "006ca1a79a570bc72bd81c598005c1894e1ca6e8d3cad1341a68b673d4c0c889": {
    functionName: "rejectDocument_createServerFn_handler",
    importer: () => import("./document-review.functions-CqZ_T4Al.mjs")
  },
  "00c97d8be02d8b1fc19f0a6d3a703142cafd52f92e2c47730b5fcc43a526750e": {
    functionName: "logLoginAttempt_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "014e15189e66b9e6f0bd6225154c527a9ccf5931417462192026bd3783101c32": {
    functionName: "migrateLegacyTelephonyAccount_createServerFn_handler",
    importer: () => import("./telephony-accounts.functions-JSX65WzZ.mjs")
  },
  "019efab430c8cc2fb376e96fc17c9a1b4d9f9261bdadf738e84ed4b25a5df33d": {
    functionName: "reconcilePaymentStatus_createServerFn_handler",
    importer: () => import("./payments.functions-CVqwWDl5.mjs")
  },
  "020bc091654580d284d6e4b547596976d7ba10c1d2943a465532548eab44aa1b": {
    functionName: "getDashboardKpis_createServerFn_handler",
    importer: () => import("./super-admin.functions-hGqZ75Mr.mjs")
  },
  "03772da093af34994f616823bc27ec41359870b376d9b8283c22bf1d80627fb1": {
    functionName: "listPaymentsAdmin_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "044194b71fb61b46c1d41d35a74a8fc9431765d51c255b3af3e0f62a3ffe29f0": {
    functionName: "createApplicationLink_createServerFn_handler",
    importer: () => import("./links.functions-CfVa06sP.mjs")
  },
  "0449bfb26b1a47bae455379cd53cf8331b3c15b2dc3b74403b76af38a3de1456": {
    functionName: "listCustomers_createServerFn_handler",
    importer: () => import("./customers.functions-Bn_P-jhI.mjs")
  },
  "051d632b986444aa7b6f3ff0cac71fabf9d3ebcca5f8743048eeb7d45155e15a": {
    functionName: "listSanitySeoPages_createServerFn_handler",
    importer: () => import("./client.functions-nIksBFX7.mjs")
  },
  "06a45a72d8e83158e10e99579fe4e990d1c9aa730458601f5d8cff3fc2b5c637": {
    functionName: "getGstReport_createServerFn_handler",
    importer: () => import("./gst-report.functions-DFGG3a4o.mjs")
  },
  "06b48d78dfde01bebe6d3642904b439fb3adb2a72c1748dc844a29beb7c38e19": {
    functionName: "getTicketAttachmentUploadUrl_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "06b5e65179bc3fbf45e5866dc6006ec12b0f38ae33fd2e3b4d1bdfa03c6d6f62": {
    functionName: "endWebRtcCall_createServerFn_handler",
    importer: () => import("./callerdesk-webrtc.functions-DDQSUOKd.mjs")
  },
  "06fa2a3e0155782bc44d5284fad876fa8de2e7ac8e280c13f44601e6b6595875": {
    functionName: "bulkUpdateLeadStatus_createServerFn_handler",
    importer: () => import("./leads-bulk.functions-DjIrl5IJ.mjs")
  },
  "07800048615b4c2dc10f3fe3036dc9d1578b6dbd4c118c4545416566ee253bcd": {
    functionName: "customerSideDelay_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "078cdff7ee6a343cf7f2d4f9f715dd2741dca0b97ebc6381132467d589ae2018": {
    functionName: "bulkAssignTickets_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "07a39f5a9f3ef7c4475945a068af14dd1a34903e237e4fe6962e0a316d78f61f": {
    functionName: "getWorkflowState_createServerFn_handler",
    importer: () => import("./engine.functions-DIMuNurD.mjs")
  },
  "07e98faa67ee2e14380a5485f7dcbfa3db6a48d37fdad1fa8084acd7a60f7bf9": {
    functionName: "getMyStaffRoles_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "082b0a40b4298c398d357448fa8068fe86758e8c54aa92b3fb9bf4995b3bcec1": {
    functionName: "sendOrderTemplateEmail_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "0858cacc1c8ca3db6082d341b317e6ea70e061e492268385503dd8d0cec430a3": {
    functionName: "moveService_createServerFn_handler",
    importer: () => import("./websites-admin.functions-J6svBQyk.mjs")
  },
  "091bb78af65becdc45c0fe332eba528a3e29940a4d33856ad620342c332c2b49": {
    functionName: "checkIsAdmin_createServerFn_handler",
    importer: () => import("./seo-pages.functions-COwus60w.mjs")
  },
  "0a0717370d67ad8f065badb00209f693544d7eb79c1282b2a800d01bc0a0c8b1": {
    functionName: "sendManualReminder_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "0a2a20e39134d06d5b5766c1ca724ce3765278e9dcd94def11e9276d82f13c18": {
    functionName: "setEmployeeWorkAccess_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "0bab5649c0dce6e11c70bbe53573667f8649ef75ff6566b7acbebd24f0762b94": {
    functionName: "forceLogoutAllSessionsAdmin_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "0badad713f90f6888cfa77b2356fdc2be9a50b04cbd94d1f1a380b93da87827b": {
    functionName: "cancelWorkflowReminder_createServerFn_handler",
    importer: () => import("./workflow.functions-BO-RhjxS.mjs")
  },
  "0bb0e419c89be14323e6b6e3c8f36bf2c134fec5be88beb9c37f6ef9919e0029": {
    functionName: "selectConsultationService_createServerFn_handler",
    importer: () => import("./talk-to-expert.functions-r9RoBVuH.mjs")
  },
  "0bc3099bda84fb4eac018557f525133d2dba8b74cef9bde593056ebf8b39db50": {
    functionName: "revokeRole_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "0bd3c60ff2a62bf1963a67ffde69faa8db38b6ab96bfa4863a6e484040278c0a": {
    functionName: "resolveCustomerRef_createServerFn_handler",
    importer: () => import("./customer-access.functions-jmK9u-TR.mjs")
  },
  "0dce889aa6e61c3af60ed70bfec07dc3821ea18a0b0c8a96a8fff0d00f92d239": {
    functionName: "exportGstr1RefundsCsv_createServerFn_handler",
    importer: () => import("./gst-report.functions-DFGG3a4o.mjs")
  },
  "0dfd70de5fb5f7a6a39736984be95c5bda5f56ea5fee84caab42019e2a0ec5e0": {
    functionName: "lookupIncomingCaller_createServerFn_handler",
    importer: () => import("./callerdesk-webrtc.functions-DDQSUOKd.mjs")
  },
  "0e23263f3aa24b2ca04e233c1028ea0ba3c3304d250b05d9bf39d1fa08281eda": {
    functionName: "listWorkflowReminders_createServerFn_handler",
    importer: () => import("./workflow.functions-BO-RhjxS.mjs")
  },
  "0ea4d2f5d1847b7c19d9f613329eefc7b1d8f365f011e56d59ec16a1b6864bf2": {
    functionName: "requestRefundInfo_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "0f0aede5fde78ba31eb70dc9a300dd72476ee819f62ff6349f9eceabc59c03b2": {
    functionName: "getMonthlyReport_createServerFn_handler",
    importer: () => import("./reports.functions-CTkL_CeV.mjs")
  },
  "0fb215fd36771cff8bd0927e5d92970fa4faf1e918647c3ee5f03a34717f96bb": {
    functionName: "uploadAlertAudioFile_createServerFn_handler",
    importer: () => import("./app-settings.functions-DHeNVODb.mjs")
  },
  "11a4cf2d7dd09379fc3c4cf0418cebbffa4d1e434a7d87c6f59cb6f171798f87": {
    functionName: "completeOrder_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "11ee5a37c80fbe9002e3d8fc8b7ce9a5ed86b8aea4f74e966e7ae36be8ef52f2": {
    functionName: "getCallbackReminderPresetSettings_createServerFn_handler",
    importer: () => import("./app-settings.functions-DHeNVODb.mjs")
  },
  "126d554582061618a151b6471904d5d4a0e1ed0e3984301ded150dfdf9d60839": {
    functionName: "approveRefund_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "127c0747644af17c257c063154528398a994726cffa639514df19d0c60e09ea9": {
    functionName: "listCallHistory_createServerFn_handler",
    importer: () => import("./calls.functions-z703p4Uz.mjs")
  },
  "12ffab2d72b91e45d5a5887365c611c85db07c831a9b11477bc1712424abfed7": {
    functionName: "requestFormHelp_createServerFn_handler",
    importer: () => import("./onboarding.functions-Cb4Pg19J.mjs")
  },
  "131c74d9038cd8c20abaa9935ed6cb336533d516eb0b64c9a26b40d972195500": {
    functionName: "initiatePayment_createServerFn_handler",
    importer: () => import("./initiate.functions-CIvFswQS.mjs")
  },
  "139cfe50af2c54ecfb9839c55ae9ccf4c83c6228ef78b8acd6e2f1027946564a": {
    functionName: "reopenOrder_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "1447999af53c2f01ede2170946a3a4ec8292344b67bd085b52b27aedeb2d87c5": {
    functionName: "setEmploymentStatus_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "149ee577f7b0a3af6727fea443b5b65c956be4e65a9dd1a4640814fe84c3966a": {
    functionName: "getProcessingErrors_createServerFn_handler",
    importer: () => import("./inbox-admin.functions-D4RMHTKm.mjs")
  },
  "160e215610bb38261254077ccd1b7868655ea22735a5cc5f0c6f552c81e98589": {
    functionName: "setEmployeeActive_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "164d8ff79d8fc1ec17a4d9e9a666155e25c71f0f5d6495888c8f4284785af090": {
    functionName: "initiateClickToCall_createServerFn_handler",
    importer: () => import("./outbound.functions-CtWE_oTa.mjs")
  },
  "16b48c19c873a3820188a883fc9714851723be9892c780834083f3dfabad21c4": {
    functionName: "listStaffUsers_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "16d4fe804ed5561f8208f71be62439795719e825860cb75ffb9b264fe9e3adf9": {
    functionName: "rejectRefund_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "1703190885432f55cd71e6fbe4806a09fffaddf721db8e739d7d2e0828d4d859": {
    functionName: "saveTelephonyAccount_createServerFn_handler",
    importer: () => import("./telephony-accounts.functions-JSX65WzZ.mjs")
  },
  "176f832daaa17526348ddd41ceee0cc440f5f0d8f0e55254f7150c96a8384443": {
    functionName: "getSitemapPageManagerData_createServerFn_handler",
    importer: () => import("./seo-pages.functions-COwus60w.mjs")
  },
  "17f0721bc034b4970400a330b29343e6721eb01fe6470405b55eeb1ae991dca2": {
    functionName: "closeOrder_createServerFn_handler",
    importer: () => import("./workflow-closure.functions-D37qqjru.mjs")
  },
  "1848a71e04596285318dde3ccacc82e72288aec67f4c203a610ce51262284ac7": {
    functionName: "listTasks_createServerFn_handler",
    importer: () => import("./tasks.functions-DIfMcByt.mjs")
  },
  "18df254943aec1bf9f1b14fbc5d87f7ef2f423324fc4c7562a37ac32da1cc78e": {
    functionName: "bulkToggleTicketStar_createServerFn_handler",
    importer: () => import("./support-folders.functions-BJbt1Fjf.mjs")
  },
  "1934e5defc2efa8e0e45da99bf77a3bf6dc43528f0e508418d4b51ed05bca4af": {
    functionName: "getLiveActivityFeed_createServerFn_handler",
    importer: () => import("./employee-performance.functions-Mo8Fan0_.mjs")
  },
  "19619d444b07e0eafca626f19645913442a406761552949b9d618e78465c476a": {
    functionName: "regenerateInvoice_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "19a4b5be0f82bd385f2d800a56e99a1945eac997fae13f8c8aac4e6d54847130": {
    functionName: "updateCustomer_createServerFn_handler",
    importer: () => import("./customers.functions-Bn_P-jhI.mjs")
  },
  "1adb81ec67c9714414753a32764ba32fca21b9bed5deadf0bec39eeeb2de966b": {
    functionName: "pollInboxNow_createServerFn_handler",
    importer: () => import("./inbox-admin.functions-D4RMHTKm.mjs")
  },
  "1af26807d563a4183803fc1099c32dbae5a1b568f7c20b4b17a573c925abf22f": {
    functionName: "getCustomerKycSignedUrl_createServerFn_handler",
    importer: () => import("./customers.functions-Bn_P-jhI.mjs")
  },
  "1c75e2b995d12f6e2782703f5d9c909b7f6f9029ca6bd5a74c38bbe6768bdc4a": {
    functionName: "getWebsiteContent_createServerFn_handler",
    importer: () => import("./site-content-admin.functions-BoGmvGO4.mjs")
  },
  "1cd121c75b5cf0252b3841e0ea4692c3c1aae560b33820945af83f5795fbf44e": {
    functionName: "linkTicketToApplication_createServerFn_handler",
    importer: () => import("./ticket-workspace.functions-DD3c7yBn.mjs")
  },
  "1dd01761d6106c37dc7defe795e7b9cddf327446eefff3c888ab4075f32b9021": {
    functionName: "getRevenueOverview_createServerFn_handler",
    importer: () => import("./revenue-admin.functions-D1LQSVoF.mjs")
  },
  "201f54cd7aabf113779c43ab955d6bc24f45dd0f00fa24c64eb0b1269d7f9fbb": {
    functionName: "saveGlobalReminderSoundSettings_createServerFn_handler",
    importer: () => import("./app-settings.functions-DHeNVODb.mjs")
  },
  "20feec4db495a4bb5829af8534c5b4c6b0ea27b979eb2c2834f9fc68da1ddcdb": {
    functionName: "listLeads_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "2127d0ea2e52451bb93b757bd02a315019800baabc585ac98f871e0270d3040a": {
    functionName: "listOrdersV2_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "2173c3ce7fa35b79e135fcfc01d86bff963a11da268e97ce97eac7377a71d81c": {
    functionName: "setAutoAssignEnabled_createServerFn_handler",
    importer: () => import("./assignment.functions-BGPC7-uK.mjs")
  },
  "21aebf8dd4084e78572d702968cc6c7c7e6519e3b21c0a398283cd18bd8a4ff9": {
    functionName: "addOrderNoteV2_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "21cf5bdf472b1a08d7a6b6a5005857b5d1fc8e3d479943f6396bfaec13cf77d4": {
    functionName: "listClosureReasons_createServerFn_handler",
    importer: () => import("./workflow.functions-BO-RhjxS.mjs")
  },
  "21e27b2e90d31aef224fb9e244e23ab422a0896bd8443ab5f481b2a5a5aa5c7a": {
    functionName: "updateComplaintNotes_createServerFn_handler",
    importer: () => import("./complaints-detail.functions-BjW34gZB.mjs")
  },
  "2254d21959939138c2885aeea81793d8c2b2d400be0d57f36de4f8d3bc6d2219": {
    functionName: "initiateWebRtcCall_createServerFn_handler",
    importer: () => import("./callerdesk-webrtc.functions-DDQSUOKd.mjs")
  },
  "2274070860800f84c07cd686dab3cdd7ea6c8ecf219cb304973b8f6125073bf8": {
    functionName: "removeFromPool_createServerFn_handler",
    importer: () => import("./assignment.functions-BGPC7-uK.mjs")
  },
  "241953f126eb4fe1ef508785175104af6d69b155a52bc7b3446b52e7ebefd508": {
    functionName: "retryFailedEmailsNow_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "24a4b844c8e03888a3f66f2d4cee5b97afc9607a88881a00181e5937616c0d81": {
    functionName: "exportGstRefundReportCsv_createServerFn_handler",
    importer: () => import("./gst-report.functions-DFGG3a4o.mjs")
  },
  "24e99414bd1f2312cffb4366cbe46f15efc024ed23ab187eb4a49be95dcaad50": {
    functionName: "updateContactSubmissionNotes_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "24ec6c1c5edfcedc81472bc9bc54c71af0b0731d2f3ad1e1eb0cd979e81cab47": {
    functionName: "listPaymentLedger_createServerFn_handler",
    importer: () => import("./revenue-admin.functions-D1LQSVoF.mjs")
  },
  "25670f8db79f2897dd4e72cdf89c9c54da59ffcab9f14d776141b39625fad9e3": {
    functionName: "scheduleOrderCallback_createServerFn_handler",
    importer: () => import("./callback-reminder.functions-C-8RSOAj.mjs")
  },
  "256ec20717c47cce284f7bea750973905a22d938ccd893a54ebab751e4c8b31a": {
    functionName: "markCertificateIssued_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "25bd823752ad6f1d56a44ec9b1238c2af05a0553dd118cc4c16c24f012d91820": {
    functionName: "createTicketFromProcessingError_createServerFn_handler",
    importer: () => import("./inbox-admin.functions-D4RMHTKm.mjs")
  },
  "26512d7455b89ae6ebb1899b7cc9642929a509dac6b82725cde3993486c58760": {
    functionName: "decideRefundRequest_createServerFn_handler",
    importer: () => import("./workflow-closure.functions-D37qqjru.mjs")
  },
  "26df7c1b1a423bf7c42658254ed6b651ee07d1de42e46c1e09b1218df0663944": {
    functionName: "listCertificates_createServerFn_handler",
    importer: () => import("./certificates.functions-BAmsF1n9.mjs")
  },
  "2797683dbec91af8c1fe604362b9345b671544f8480685016f0b41b5b4ccc971": {
    functionName: "logEmployeeCrmActivity_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "28ed152f44893ab0695188e3cddaa5c57cb165cd4da635ef96dada136daeada8": {
    functionName: "saveWorkflow_createServerFn_handler",
    importer: () => import("./service-forms.functions-BAWUc1dj.mjs")
  },
  "29226e0ca201fc8c535f8edfb3c0258d7feb439dce88746471c1a6de172dfde4": {
    functionName: "convertContactToComplaint_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "299b87b386cf821c9d2175b3ee03f20b9d19efc7459ff8588feee4bd5640c943": {
    functionName: "setWebsiteGateway_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "29a99c679947ba05957c8271fb172fd2e5c439cb712a41fcd78059f308cf01b8": {
    functionName: "getWebRtcStatus_createServerFn_handler",
    importer: () => import("./callerdesk-webrtc.functions-DDQSUOKd.mjs")
  },
  "29d43ad624d73d4cd7ba0c4fc05ec612c9b6358996e55b83f5e9c9c389cbf898": {
    functionName: "deleteSupportFolder_createServerFn_handler",
    importer: () => import("./support-folders.functions-BJbt1Fjf.mjs")
  },
  "2a3092ab1cf8736be4399e2cada97c33d646b58aec7abf0a1c445e6d9fadf422": {
    functionName: "upsertUserPermission_createServerFn_handler",
    importer: () => import("./permissions-admin.functions-Ch7-uAAa.mjs")
  },
  "2b937f8919d0a16dac3ca86da131dc8df532bfad6a82d6fe51c24c3cf2b55d61": {
    functionName: "listAllHistoricalStaff_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "2cb45762b7358a631b5702b66598c9526942e2f77228d0a1e3e2d15173e63c23": {
    functionName: "exportLeadsCsv_createServerFn_handler",
    importer: () => import("./leads-bulk.functions-DjIrl5IJ.mjs")
  },
  "2cc61d44a54b4c0a228fce402431d93f9b394b2ec032281960449c1ebed54cf6": {
    functionName: "getMyCallState_createServerFn_handler",
    importer: () => import("./calls.functions-z703p4Uz.mjs")
  },
  "2d26bf8c5f184ba93641072c9b44eb0595bbfbc2205945769a060fa190880939": {
    functionName: "globalSearch_createServerFn_handler",
    importer: () => import("./global-search.functions-CmcB_wvq.mjs")
  },
  "2d4f9c39697474538e4632647ad3441fe75cd3ea2de23dc9e4580b5a9c861695": {
    functionName: "adminUpdateOnboardingField_createServerFn_handler",
    importer: () => import("./onboarding-admin.functions-CE_gBbXI.mjs")
  },
  "2d90deabaa6d8e1dcf70500fc9c920e19839d0d6271e059b5271cca1428d0cf3": {
    functionName: "setMailProviderSetting_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "2e11faac915cce52818fc1de72639f67fec34bd3b3c0ced59e606e5cbe021c4f": {
    functionName: "getSanityServicePage_createServerFn_handler",
    importer: () => import("./client.functions-nIksBFX7.mjs")
  },
  "2e3406b16d6176e31753371c6512f018b272d89c1be77cab76ec23942270547c": {
    functionName: "changeOrderService_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "2e49731f2bbda08b56210775b2ac850640b990e9107b80a623a0d029e7018c85": {
    functionName: "completeTask_createServerFn_handler",
    importer: () => import("./tasks.functions-DIfMcByt.mjs")
  },
  "2e8ae0fe00588510f9813504109fd48e2234cfbfb13c8a784e04499332903297": {
    functionName: "getFormSubmissionForLead_createServerFn_handler",
    importer: () => import("./submissions-admin.functions-Bo0pIwAC.mjs")
  },
  "2e8e433cba710bd402580f2ab9a83ea0c65bf3aa3c0bf641656c1ba4134233e3": {
    functionName: "listWebsiteTree_createServerFn_handler",
    importer: () => import("./websites-admin.functions-J6svBQyk.mjs")
  },
  "2eb2b4190cb9b3be465e648582b0b669b7eaf0dcf4c4ff62c62cfeb6fe773566": {
    functionName: "closeTicketRestartT001_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "2ec8f80e22307b32583d47d9775aaadb6c7e06fffa691e8ab7ce93cd7d68100f": {
    functionName: "bulkMarkTicketsRead_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "2ece10d34e38bb933b9ca68e29595220cb39787cd35a25f4fa9d77f44212d539": {
    functionName: "searchDisputeOrder_createServerFn_handler",
    importer: () => import("./dispute-manager.functions-BWvTPtwi.mjs")
  },
  "2fa82cc37dda12c84554a97d188c2c7f6f9eb19a6b5bfb16b46a7ff3832dc8ff": {
    functionName: "sendConsultationPaymentLink_createServerFn_handler",
    importer: () => import("./talk-to-expert.functions-r9RoBVuH.mjs")
  },
  "3048daadd91322fa0a933fbb967fa5958c6067bcdcc67c13a0e4f7b622fd3108": {
    functionName: "getEmployeeDetail_createServerFn_handler",
    importer: () => import("./performance.functions-CJDzjY8Q.mjs")
  },
  "3063b58e23c647fd924a0b6676e3a6fb6bdbdc0551609db8c5956f6d1fea9c4e": {
    functionName: "mintCustomerLink_createServerFn_handler",
    importer: () => import("./customer-access.functions-jmK9u-TR.mjs")
  },
  "31408bd52348e5c8b9115280051f1416b2194f62e214dbffea630bcca2904707": {
    functionName: "getMyRoles_createServerFn_handler",
    importer: () => import("./status-engine.functions-7ehnBgE7.mjs")
  },
  "3285eb8bd4853d778d0f96aa94ccbe87b7196b047ad27a208fbecbe370274cce": {
    functionName: "upsertNavItem_createServerFn_handler",
    importer: () => import("./site-content-admin.functions-BoGmvGO4.mjs")
  },
  "3288c9e1299b019af439e0463777f8b816b26134df4450f4250d6876bb37e11f": {
    functionName: "markFormPending_createServerFn_handler",
    importer: () => import("./hold-actions.functions-u-SzJe41.mjs")
  },
  "32ef5ad05f019d464a283c2ef59e928f058a9c76c176bbdcd543d3cf6713b84c": {
    functionName: "listEmailTemplates_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "334d63f0b24a687445ce01e9d9cfdd0f73f178d19cd91a7b9208f4557bca986b": {
    functionName: "setCashfreeAccountActive_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "33fa09ec64b82a5b2724c5ab6baf7bd8de0c4e0ca64d10803f3aea8437be610e": {
    functionName: "bulkAssignOrders_createServerFn_handler",
    importer: () => import("./orders.functions-BYx9he5_.mjs")
  },
  "3420fec0092851628e781c482bc7e6a0cf27053e8d404f90be37e64553baccd3": {
    functionName: "getOrderTickets_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "34b9422b0c03ab57c3e29e53e17ed5b85e879c00f0dca117433f6aa3e04c7850": {
    functionName: "updateTicket_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "3552731b48e30d18773c88684b1e29bde958f33f1e44a004bc7bdc5622c7742c": {
    functionName: "addLeadNote_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "3631af097aa13afc2311d9e01dbab1705e423c2c8a616799195236876da4b667": {
    functionName: "listFormSchemaVersions_createServerFn_handler",
    importer: () => import("./service-forms.functions-BAWUc1dj.mjs")
  },
  "36fe73f03f0fe1aadf51dfa318bb4e0541ed55e116c9240ad693dabb665e67ec": {
    functionName: "resendServiceChangeEmail_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "37c656f57d1d1c6a759771d425548dbc040e60e526bf500057efb4875e1312e1": {
    functionName: "listCannedResponses_createServerFn_handler",
    importer: () => import("./canned-responses.functions-CYpR2616.mjs")
  },
  "3871aad8f7aa4b63a7c3905da37ea64de043477018c4ea6a35c989eca4e9b7c2": {
    functionName: "resendInvoiceEmail_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "3988ab34b8572744b4aee23991d321bea08f8967870a22ae6be93a1a5c32b51c": {
    functionName: "closeTicketReplyReasonT002_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "398e0d96e203242f9cabb83e9eac3c7532f0d2eea7a160c86b4de72db491ecd3": {
    functionName: "getOrderNotes_createServerFn_handler",
    importer: () => import("./orders.functions-BYx9he5_.mjs")
  },
  "3a5efc86063dd66664308eb1b4250b747d1d01d5b94c6732444a760364f0ee12": {
    functionName: "getMyWorkSummary_createServerFn_handler",
    importer: () => import("./my-work.functions-DBKBbIHU.mjs")
  },
  "3adfbbffa09a08986dadc258d343ab0ad93d2bb4e8b7fd791b5c562740a75971": {
    functionName: "getCurrentBrand_createServerFn_handler",
    importer: () => import("./current-brand.functions-BwvjrNqZ.mjs")
  },
  "3c55940c2d822478489139398ea01d186066bb1577cae00aeb562c8769b4ec09": {
    functionName: "markSubmittedToGovt_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "3cbf4afcd8a68e686caf817245b6a2b81485697d3d4d0a8d3163d94b945b7562": {
    functionName: "createCannedResponse_createServerFn_handler",
    importer: () => import("./canned-responses.functions-CYpR2616.mjs")
  },
  "3dd0e0958117f1e375d2825c17f1acd9346236700e2ef612196cb3cfc4ec6ae6": {
    functionName: "updateTrainingMaterial_createServerFn_handler",
    importer: () => import("./training.functions-BooxTkZp.mjs")
  },
  "3e692d70973f4a11e54fa6da52e86b5d5cc0d0f8f85eb3d5c75ed9fe3c69ab65": {
    functionName: "getPipelineHealth_createServerFn_handler",
    importer: () => import("./inbox-admin.functions-D4RMHTKm.mjs")
  },
  "3fc0c3cf1bc3dce4cb172c070dce51713283c5ef38f03aaf95122a2d7badeca0": {
    functionName: "regenerateAllInvoices_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "400a9865b4b221e3a820829985d481338120f7e70337ed186929639802f0a038": {
    functionName: "deleteNavItem_createServerFn_handler",
    importer: () => import("./site-content-admin.functions-BoGmvGO4.mjs")
  },
  "4114b5e00919843cc0d5a1ce0686f19123e81e048eb91f5cf6589f07eb6da8d1": {
    functionName: "getAllTickets_createServerFn_handler",
    importer: () => import("./inbox-admin.functions-D4RMHTKm.mjs")
  },
  "4239650687724d39355ca31c904d3d50b8f52f2aab7656030e4ad420d2d85bf3": {
    functionName: "verifyGoogleStaffAccess_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "426dc8982165cb56585502cfa8624b1abfbf84bb14875001b82612faca3f7119": {
    functionName: "getAssignmentOperationalMetrics_createServerFn_handler",
    importer: () => import("./assignment-history.functions-DRwXENAl.mjs")
  },
  "42f88baefd7ff2ad854b29ca2ba0a4823e83346307afd84b3517d9b392f998b5": {
    functionName: "updateSoundSettings_createServerFn_handler",
    importer: () => import("./app-settings.functions-DHeNVODb.mjs")
  },
  "43787bb4921a8af5061cd4e2fc99d9b6a00a3fbc845fc9701a1728739449a535": {
    functionName: "deleteAutomationRule_createServerFn_handler",
    importer: () => import("./workflow-settings.functions-B5aYpJpa.mjs")
  },
  "439b8ec582a43e2d1cea21dc8af8d1269508bfdfea6b8c8373058d2e6b08beec": {
    functionName: "upsertWebsite_createServerFn_handler",
    importer: () => import("./websites-admin.functions-J6svBQyk.mjs")
  },
  "43a50e85219edf7f93f3299a04e4ae48cd6bf5283226a9775db4f7ba062221c2": {
    functionName: "updateInvoiceGstin_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "44a247c443a8eff6f2a9767e8dc03f66b30578339a63f95b57919120b951f5a4": {
    functionName: "createEmployeeLeave_createServerFn_handler",
    importer: () => import("./assignment-history.functions-DRwXENAl.mjs")
  },
  "45c7f1f3bbc294efd23f478be9f714fd5f1e4339c0f9634d8ffb2370e7a36c2d": {
    functionName: "changeLeadService_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "45f96ec2adb10ed28feebac8ffa33b0f6c14b6015edc62b913abd3de40c396b9": {
    functionName: "markAllNotificationsRead_createServerFn_handler",
    importer: () => import("./notifications.functions-DnfGbPYy.mjs")
  },
  "46431139a879e3a1021466b1043485a416433a89ea31788e7fd320c1e51b17a2": {
    functionName: "checkOpenTicketForOrder_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "4839d762df335f667e0b74d5aef107beacc0003ce45065551a880693e02b5f46": {
    functionName: "createSavedFilter_createServerFn_handler",
    importer: () => import("./saved-filters.functions-DY4WThx5.mjs")
  },
  "485da0b0b57cf9ce0253228c501728e37775f078e2b910bae6d2d4246c244a58": {
    functionName: "getInvoiceDetail_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "486410dc4a4512bdca9f16a2ee48570e9451aef51ffcb899dc444bec0b486199": {
    functionName: "bulkUpdateTicketPriority_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "486a3e3c02066d5821f4be070bc0416f1f50182e06fc3d1b396dcd02a6da32ae": {
    functionName: "getBusinessHoursConfig_createServerFn_handler",
    importer: () => import("./business-hours.functions-CNKOiUp3.mjs")
  },
  "4aaae77f6d8f19038eea24f6f8dbc0919e4f556dc021105b54d7a4bddcf2b735": {
    functionName: "customerRefForCode_createServerFn_handler",
    importer: () => import("./customer-access.functions-jmK9u-TR.mjs")
  },
  "4b001e5e7dbd41692f9695e2f6f1eda68a486b5e3a85f6b46d4c928fd6aa6795": {
    functionName: "updateLead_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "4b718af2058457ad4352a3b88dfe6629eef8a95235577be72c15d0e7c8ef1f31": {
    functionName: "getMyPerformanceDashboard_createServerFn_handler",
    importer: () => import("./employee-performance.functions-Mo8Fan0_.mjs")
  },
  "4c41cbcbfaa0ed2e5189bf3b32a548657f33502a5dc5dca5cf012b9f7b7f0593": {
    functionName: "getEmployeePerformanceCommandCenter_createServerFn_handler",
    importer: () => import("./employee-performance.functions-Mo8Fan0_.mjs")
  },
  "4c96274b17860b41866821e57cc8a7f08539ccce6dcc04b8a561f30c2903329b": {
    functionName: "saveEmailTemplate_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "4cb54d7f9b5c50672ff86432d4dafd35a57a1652c3baeea600c8482b3b2b5369": {
    functionName: "saveBrowserDisputeEvidencePackage_createServerFn_handler",
    importer: () => import("./dispute-manager.functions-BWvTPtwi.mjs")
  },
  "4ceacdfbbf9c22889f80e0c88db7c75311a897eec25a557f265f8d416f73ffb1": {
    functionName: "listInvoices_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "4d32bcdb7e184bc01f23d4af7fcf66399d581a4f09cc0d90db737adfc2d8b221": {
    functionName: "searchEmailAuditTrace_createServerFn_handler",
    importer: () => import("./inbox-admin.functions-D4RMHTKm.mjs")
  },
  "4dbb6757d30f46ffef629a42eb01e0bcafed15825ca07dc9082df129169c4574": {
    functionName: "addCustomerNote_createServerFn_handler",
    importer: () => import("./customers.functions-Bn_P-jhI.mjs")
  },
  "4de833c750b74d4faeb919bac83319e1848132e194a419fd17103beb382a3876": {
    functionName: "upsertServiceCategory_createServerFn_handler",
    importer: () => import("./websites-admin.functions-J6svBQyk.mjs")
  },
  "4e8e88977ddb97dd593ce7f551542820185b53a6b656830f0a87bf718d37fd87": {
    functionName: "listGateways_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "4ec1a89ebe00abe521f11103e8b3ac8d29872581b44dfae40f2d065556a537f4": {
    functionName: "resendFormLink_createServerFn_handler",
    importer: () => import("./submissions-admin.functions-Bo0pIwAC.mjs")
  },
  "4f168db81722574bd917a9a8b9e1cdba1291319190a80a5eeddff0316ae3b635": {
    functionName: "findLeadByCodeOrId_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "4fd78f88e53af2297ce8fb3b5753a1052aee8ba8e773b3c44bb52f69de95df92": {
    functionName: "updateContactSubmissionStatus_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "4fe9eaf50f738360bae134bfb999b35b3d0cd7d95193b6785a0e6dbba772317e": {
    functionName: "getEmailDashboard_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "509d2bd4378ad9d098bd782e350146f68fa8ba764960488fb8e180072ebcc666": {
    functionName: "inviteEmployee_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "50ef44b91bac83cd17e6535cbde2d041c5bc7de3b2e7615c9f1115f3b16b1f9f": {
    functionName: "listPaymentsFull_createServerFn_handler",
    importer: () => import("./payments.functions-CVqwWDl5.mjs")
  },
  "522a414446fd9cca7c23dc89eaf4407087ae52b4f33356a2ef72467e7135c624": {
    functionName: "getShiftSettings_createServerFn_handler",
    importer: () => import("./employee-presence.functions-CIJ1TtsD.mjs")
  },
  "55e4e459df5a97de1b15a627721410bbd6db007b6b59b1b3eab4ea094ba1f21a": {
    functionName: "createPaymentLink_createServerFn_handler",
    importer: () => import("./payment-links.functions-_bmUKOht.mjs")
  },
  "563e6fa692fda355cabdf62c1ea270c5a4ff7f4913a989b27f15884364d989c2": {
    functionName: "getInvoiceSignedUrl_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "5672ba5ce6c14047dfcd150b21c917373989ecabf17d5ee68bd10e9e36ae33ec": {
    functionName: "prepareDisputeEvidencePackage_createServerFn_handler",
    importer: () => import("./dispute-manager.functions-BWvTPtwi.mjs")
  },
  "568493b198ca8dd94c8a85f18f0b6657e4d71573f746ad9e06c79e0141f2af24": {
    functionName: "getOnboarding_createServerFn_handler",
    importer: () => import("./onboarding.functions-Cb4Pg19J.mjs")
  },
  "58913168768a16ec2e36cc44239d8e725310f4f70d5061e7572da5e669802934": {
    functionName: "deleteReason_createServerFn_handler",
    importer: () => import("./workflow-settings.functions-B5aYpJpa.mjs")
  },
  "58b7a91d1610182e8b4371a6ee55962832af58180208f9764d474149445d9274": {
    functionName: "listContactEvents_createServerFn_handler",
    importer: () => import("./performance.functions-CJDzjY8Q.mjs")
  },
  "58e1777f82254bc16ea59ab14ff8496467833fc3a0f553f3c4a173b781add12c": {
    functionName: "listTrainingMaterials_createServerFn_handler",
    importer: () => import("./training.functions-BooxTkZp.mjs")
  },
  "59672288ea477c51778b4b3b38d79bd5f6259e5785a195f4834e47e90c5b14c2": {
    functionName: "troubleshootWebRtc_createServerFn_handler",
    importer: () => import("./webrtc-diag.functions-BXjN20Rf.mjs")
  },
  "5988fb6c503a67ea25dccc8a4628ecf3a9e30600c19e3155e4836ab212bc61e6": {
    functionName: "cancelEmployeeLeave_createServerFn_handler",
    importer: () => import("./assignment-history.functions-DRwXENAl.mjs")
  },
  "5a1abb33bc2a8e5ca7940b7d92cb9c732c9056f7468e7c14f476543635d182f2": {
    functionName: "transitionLead_createServerFn_handler",
    importer: () => import("./status-engine.functions-7ehnBgE7.mjs")
  },
  "5a1caabcc8114771c7e70e14aecc56e363697fa43895278b1aac630da0cd7a22": {
    functionName: "deleteService_createServerFn_handler",
    importer: () => import("./services-admin.functions-DE3Keao1.mjs")
  },
  "5a48d0f5e390a8b600bd7325a16d41c6ad86391cdd8bfa0f7cfea416f1014652": {
    functionName: "listEnabledTemplates_createServerFn_handler",
    importer: () => import("./leads-bulk.functions-DjIrl5IJ.mjs")
  },
  "5ad03f3cade89ac9422743d46e470efa32b5665b6e3a16024389d1d7b70c5eab": {
    functionName: "listAssignmentStaff_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "5aebe7431208fb9825a6244bb07831f951b04a087118f7f7e6cd2d9a0987db79": {
    functionName: "exportRevenueTransactions_createServerFn_handler",
    importer: () => import("./revenue-admin.functions-D1LQSVoF.mjs")
  },
  "5b02e9b200a10df79f3b2eb56e7dc03f781959696691e24bb0b4620b28b10931": {
    functionName: "getApplicationDocChecklist_createServerFn_handler",
    importer: () => import("./document-review.functions-CqZ_T4Al.mjs")
  },
  "5bed9aac48aaba6b4ffaa620ccdb3f7be37412157c85ee73443c642675dbdcfb": {
    functionName: "seedMissingEmailTemplates_createServerFn_handler",
    importer: () => import("./super-admin.functions-hGqZ75Mr.mjs")
  },
  "5c84987b4df8a607f9b4726f0d1383b336bfc825713aa01e61f0d1f9dc793d1a": {
    functionName: "createRefundRequest_createServerFn_handler",
    importer: () => import("./workflow-closure.functions-D37qqjru.mjs")
  },
  "5cbb7ac77801eef299d532ea798efce8698c17e40ab46cdcf77d3530e92cc30d": {
    functionName: "getEmployeeDetailPerformance_createServerFn_handler",
    importer: () => import("./employee-performance.functions-Mo8Fan0_.mjs")
  },
  "5eb986dae561fcc4fad2953cd410f430ab95d8dbb50e9b88e060b40095011fe9": {
    functionName: "deleteAllDisputeEvidenceRecords_createServerFn_handler",
    importer: () => import("./dispute-manager.functions-BWvTPtwi.mjs")
  },
  "5f54c01c40533c5893e3147e411a98b6337aba4a6b82dc6725404c01e116b4e8": {
    functionName: "resetEmployeePassword_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "5f55277b1e64a5b9fca765909b97aa75f06bcf0396a18cda68f259ecde643141": {
    functionName: "deleteServiceCategory_createServerFn_handler",
    importer: () => import("./websites-admin.functions-J6svBQyk.mjs")
  },
  "5f79241810afb35f15333acf891852373067a4611a11ef85db1ad852c27d498b": {
    functionName: "getCertificateUrl_createServerFn_handler",
    importer: () => import("./certificates.functions-BAmsF1n9.mjs")
  },
  "6008aaa579fe8e46dc831e636d555d1e3714c97ea61711a3597552302fd16fcf": {
    functionName: "startTechnicalHold_createServerFn_handler",
    importer: () => import("./hold-actions.functions-u-SzJe41.mjs")
  },
  "601f6f422fbd9c48fff7a562049f15955d4608aee15bbebe2a4bb93046170ec3": {
    functionName: "previewInvoice_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "602cdfe45c47e09b3bf7c1e91d5d600dc3cd155ca29992a4294b9312b9b5b41a": {
    functionName: "deleteSeoPage_createServerFn_handler",
    importer: () => import("./seo-pages.functions-COwus60w.mjs")
  },
  "60c340c86c87ebf31fbc35a80bee87cc159a655b56904f51965efc12b82223f0": {
    functionName: "checkCcavenueCredentials_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "60cfd8d6342eb1b86e2a11ef3033f65d7933f707a50a30daef0487d5acd98d13": {
    functionName: "listRefundsAdvanced_createServerFn_handler",
    importer: () => import("./refunds-v2.functions-DubtYnlX.mjs")
  },
  "60e9eb2914cc6c98a5084e5fee2694116cae17bdf415eb27866fc316dbaba4d7": {
    functionName: "handleGovtRejected_createServerFn_handler",
    importer: () => import("./close-actions.functions-Oz8eDeEK.mjs")
  },
  "611e4af203d52cd6595714fc80edd7570de11f68a88fd6fde9abebd848099257": {
    functionName: "getLeadSourceBreakdown_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "613133925adc584283d224cecd52db52623fca6aadd402cdafada966b2c61c13": {
    functionName: "getPerformanceOverview_createServerFn_handler",
    importer: () => import("./performance.functions-CJDzjY8Q.mjs")
  },
  "618b01e5b32b1d8c5b5cc4465b568326723c6c24fcdc6a81211327d6f53df567": {
    functionName: "getSanityFaqs_createServerFn_handler",
    importer: () => import("./client.functions-nIksBFX7.mjs")
  },
  "624e2203c3ff26f8a5838a9c68aac9cf7a9b7638a95506f34c62101a15a48a8d": {
    functionName: "processEmailQueueNow_createServerFn_handler",
    importer: () => import("./super-admin.functions-hGqZ75Mr.mjs")
  },
  "624ea81e2a4e7330514cfa25ce58d1944815b8d2f90fcf6d333d7374ac8128f0": {
    functionName: "getLead_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "62922bda681f7d917a254c37aca9a817debd776b1f6de58692e0b9674d974332": {
    functionName: "setWebsiteCashfreeAccount_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "642929bea5d8ba7673681487984eb825443eade0519e34411c565d5c367c12b2": {
    functionName: "createComplaint_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "64ae407a1e5233c74d20c6bdaf32e0824eaf0f950b6414e7d8a6d718fe3245be": {
    functionName: "getOrderDetail_createServerFn_handler",
    importer: () => import("./orders.functions-BYx9he5_.mjs")
  },
  "64ff918335064fa0f7d92a6e5c83acf632855a47ea1c9c89b64f13a5f235395d": {
    functionName: "syncTicketAttachmentsFn_createServerFn_handler",
    importer: () => import("./ticket-workspace.functions-DD3c7yBn.mjs")
  },
  "653209a89d50d0dd8515bdd5ea480da2402e5e86d9d4a158bc95426db58a2cc1": {
    functionName: "getPaymentLinkStatusForLead_createServerFn_handler",
    importer: () => import("./payment-links.functions-_bmUKOht.mjs")
  },
  "65469e4203b2260eb7440da0cb6e6fe9a6ced0325a486d5077e8f33437ea2822": {
    functionName: "transitionApplication_createServerFn_handler",
    importer: () => import("./status-engine.functions-7ehnBgE7.mjs")
  },
  "65d33652e3882fbd92caadff62c49fc5670eaeaa5e0b1eef1de9df1ac76ff3b3": {
    functionName: "bulkUpdateTicketStatus_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "665473392f3c3a66c40443da611b26f68339e0123671329875cfad4ecb64c5f3": {
    functionName: "getMailProviderSetting_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "6856102e0cdebdaf7c6d82d3c0c7ef3db14d91f9aeabfc566a9ed0c9fcf09a36": {
    functionName: "ourSideDelay_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "689fb74e74add6e8405035f16e80a0ec153925c679935db680207f704a42a466": {
    functionName: "closeOrderManual_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "68a0749206bdc320b8012142b4adc5cca47557871e787824af8cc7ed62b7e3a1": {
    functionName: "setWebsitePaymentsEnabled_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "68d63119ba6cd5a50d733a3ee802e67886b18e4148b5a9bc3e62b254909dba49": {
    functionName: "updateOrderAssignee_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "69ba3d5a14057fbaf9a778837d2272b001100ec37cfca9382e6510939e6560e6": {
    functionName: "escalateRefund_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "6af93f738eb386d4b69f4ada2d3ea06b746dcce13ad8028ee779a193d920c102": {
    functionName: "appendWorkflowEvent_createServerFn_handler",
    importer: () => import("./workflow.functions-BO-RhjxS.mjs")
  },
  "6b10accabd7dd926d6911cc19cfe1931c828f0ea341d923746015d647c294a6e": {
    functionName: "createTrainingMaterial_createServerFn_handler",
    importer: () => import("./training.functions-BooxTkZp.mjs")
  },
  "6b22e8814b71573e1de2d64cb074c1b83c4105412685752d3725349a6b4a743c": {
    functionName: "getPaymentsFilterMeta_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "6b3b6c642601f5d318ccda6d2fa4f4ac2a0db5fd6c3c5842e28f2a3c19667862": {
    functionName: "convertConsultationLead_createServerFn_handler",
    importer: () => import("./talk-to-expert.functions-r9RoBVuH.mjs")
  },
  "6b667762696faef5360ae1fd608c648bbafbfebee95e02daed3d0bfe1170f95d": {
    functionName: "exportGstr1Csv_createServerFn_handler",
    importer: () => import("./gst-report.functions-DFGG3a4o.mjs")
  },
  "6c00305b8313de356d6fc20dd2f97a12d6bc4d061a267cf63a7fd39f0dfae5cc": {
    functionName: "silentCloseOrder_createServerFn_handler",
    importer: () => import("./workflow-closure.functions-D37qqjru.mjs")
  },
  "6cc2097d0c981c4eababa1c6615b3e3558cf8cab084772c94c8408e7475ec53a": {
    functionName: "triggerEmployeeReassignment_createServerFn_handler",
    importer: () => import("./assignment-history.functions-DRwXENAl.mjs")
  },
  "6d7d13cbe721fc08caba335a5171fce85df5d53a68cee07f3f18ea3a41b62ec6": {
    functionName: "getFormSubmissionForApplication_createServerFn_handler",
    importer: () => import("./submissions-admin.functions-Bo0pIwAC.mjs")
  },
  "6de72b3689721a7d175e2b0854746cc92c3c581cb89aa196d336470dc7f3afa3": {
    functionName: "updateCannedResponse_createServerFn_handler",
    importer: () => import("./canned-responses.functions-CYpR2616.mjs")
  },
  "6eb95c67b902441a56fe499fa9bd1b33fdb863b61196aa8b6418746dac9f80cb": {
    functionName: "renameSupportFolder_createServerFn_handler",
    importer: () => import("./support-folders.functions-BJbt1Fjf.mjs")
  },
  "6ecd1857d303905d3ce4fc2f22439ed01140df31740f9060866ed04e3af08849": {
    functionName: "getMyPerformance_createServerFn_handler",
    importer: () => import("./performance.functions-CJDzjY8Q.mjs")
  },
  "6f604ae370005824cf7df12f962d0123c2ef10434d597db0e6341ff48570a720": {
    functionName: "getDailyReport_createServerFn_handler",
    importer: () => import("./reports.functions-CTkL_CeV.mjs")
  },
  "6fa3bf56936c0d26113e7a04809f389b07cf426d5b5c0a3237086c5a0a02d0eb": {
    functionName: "listPaymentsSafe_createServerFn_handler",
    importer: () => import("./payments.functions-CVqwWDl5.mjs")
  },
  "703983634b55ac4878c583ee22531b2b05a62029ad23f1e08a6523e8316c27bb": {
    functionName: "assignContactSubmission_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "70599394c8c56d39dde4c378981899313a160cfe44b83594118b1e148e43290b": {
    functionName: "addOrderNote_createServerFn_handler",
    importer: () => import("./orders.functions-BYx9he5_.mjs")
  },
  "707953d2d06d17bb45d798506ce509ddb8729000e6ff89a38888a4a02101e905": {
    functionName: "setUserPermissionScopes_createServerFn_handler",
    importer: () => import("./permissions-admin.functions-Ch7-uAAa.mjs")
  },
  "713d3edb49d13391d62b4b21cdc36c66cb157d606fa0be7cb185b611287ad861": {
    functionName: "makeOrderHotFromTicket_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "733c48f3386602879162d46a78ccb33ab7331e9f8b8b8bec11eb2de407b5490e": {
    functionName: "listInvoicesAdmin_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "7387de463f8326ffb9a16501fb46bed89dc5c073feeccf3c5acb4ec05b9f0b61": {
    functionName: "listTelephonyAccounts_createServerFn_handler",
    importer: () => import("./telephony-accounts.functions-JSX65WzZ.mjs")
  },
  "73d3cf99b38a1733357a6235415e0959e91e3ffdecbb230c73f1925718ee9090": {
    functionName: "grantRole_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "74bc5c339b9356b9246c172598a75ed5369c4c24a27b5b57f5ed85d20fae4ac6": {
    functionName: "listAutomationRules_createServerFn_handler",
    importer: () => import("./workflow-settings.functions-B5aYpJpa.mjs")
  },
  "7546255aaf3b239be1bd0df753c380337fb8555a475ea5ad788a76e44a2b3cff": {
    functionName: "listEmployeeLeaves_createServerFn_handler",
    importer: () => import("./assignment-history.functions-DRwXENAl.mjs")
  },
  "754f2710651260d2a82cef9ed6f1c31422f8ace7219c9db18a4deabe9123f90f": {
    functionName: "requestSecureLink_createServerFn_handler",
    importer: () => import("./customer-access.functions-jmK9u-TR.mjs")
  },
  "76b74460706c1efc5b6b5d9f74dcc0400d468a7dc23640fbcf38da73361cca18": {
    functionName: "deleteEmailTemplate_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "77bbb9ae007f0bc781f5f1500403ece1573cf472e5e4b0edad5f831634dab4ff": {
    functionName: "updateFulfillmentStatus_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "77ef8808231a090f80882f09215f191b1dc84c5b0d44557d4b01a94fec9a0b34": {
    functionName: "unlinkTicketFromApplication_createServerFn_handler",
    importer: () => import("./ticket-workspace.functions-DD3c7yBn.mjs")
  },
  "78314a488ea7596688dedae269bf64dece81f4fdc8705769902567e6eb14e08f": {
    functionName: "listActivityLogs_createServerFn_handler",
    importer: () => import("./dashboard.functions-ljRZWJWe.mjs")
  },
  "792ee45aa2a1d4bed897cb8ac4e2e2dd9c95391e9cd29143c26854a49c16095f": {
    functionName: "deleteUserPermissions_createServerFn_handler",
    importer: () => import("./permissions-admin.functions-Ch7-uAAa.mjs")
  },
  "798f509a1b80c5953a72119cffd3a6f8e0d0bab90823ae495aeb24216c2eb487": {
    functionName: "saveSmtpSettings_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "7a4da3468a8faefe0abed8d77c1ea9cab689d6335c68da1210c6c556c025f2ac": {
    functionName: "controlTimer_createServerFn_handler",
    importer: () => import("./engine.functions-DIMuNurD.mjs")
  },
  "7a5491f1b686526821af7e0777f253b9c18a7199be5912f80bd070c010ae126f": {
    functionName: "getAssignmentConfig_createServerFn_handler",
    importer: () => import("./assignment.functions-BGPC7-uK.mjs")
  },
  "7a8b51df43aa8522e5dd44e6a245c3e23ad7a0482fcbc5c4c04993ffce956935": {
    functionName: "resumeReopenedOrder_createServerFn_handler",
    importer: () => import("./hold-actions.functions-u-SzJe41.mjs")
  },
  "7ae5b100d8255f04fcbcc6fcff9a4bc89d92185caf898149a00cd623707d9ca8": {
    functionName: "closeTicketRefundR002_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "7b30f69ea58599893f4a8ae2d88f5c7e20e2da37171fdf46b91d756116d300c9": {
    functionName: "requestOrderDocumentUpload_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "7b3ce6f652105ed2102023205023891b0c7f4be4fdcd15ba1931be4948433a49": {
    functionName: "getSitemapManagerData_createServerFn_handler",
    importer: () => import("./sitemap-admin.functions-B9zwyK0M.mjs")
  },
  "7cb16efe2570f0dabdb180c60727fcb4b0264b5a9e03cba10f27826c405bdfd4": {
    functionName: "getRecentInboxEmails_createServerFn_handler",
    importer: () => import("./inbox-admin.functions-D4RMHTKm.mjs")
  },
  "7cb3f5133c671bca070b4e49874fb2b6ccbbc6483b0e35deed28ea85af65d8be": {
    functionName: "searchOrderOptions_createServerFn_handler",
    importer: () => import("./tasks.functions-DIfMcByt.mjs")
  },
  "7e4b354f22d1c5649b79d4fd3c6b414771cafbdbb47379f19891014b54ac66ff": {
    functionName: "createTask_createServerFn_handler",
    importer: () => import("./tasks.functions-DIfMcByt.mjs")
  },
  "7ec10086b4967aba0210ec34c7a1a3fb01a69c7cc3d1144a7063d78ab94a89c3": {
    functionName: "uploadTrainingDocument_createServerFn_handler",
    importer: () => import("./training.functions-BooxTkZp.mjs")
  },
  "7f2244ed856e42b971ee04c118cf8233bc171fc09764a3e88d588f3e23ffd9d5": {
    functionName: "listAssignmentHistoryAdmin_createServerFn_handler",
    importer: () => import("./assignment-history.functions-DRwXENAl.mjs")
  },
  "7f541ec4c21fd5bf6586bd077731828f214fbdccdae3f3411fccedef33eb01a5": {
    functionName: "generateInvoice_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "7f703a537117361002261c33441590d2150b449abfa8ae2f1906aae23d4ed18a": {
    functionName: "updateSubmissionStatus_createServerFn_handler",
    importer: () => import("./submissions-admin.functions-Bo0pIwAC.mjs")
  },
  "80587d4fb56b144aae5ab5ea345eb24aefcb446046f09c4e0885a63f469701db": {
    functionName: "logLeadContact_createServerFn_handler",
    importer: () => import("./performance.functions-CJDzjY8Q.mjs")
  },
  "8059c77c58fe42f888bfa541b28392e6846f0b613ad05453abf37fc0e4944aeb": {
    functionName: "getBuilderSchema_createServerFn_handler",
    importer: () => import("./form-builder.functions-BEo4pos6.mjs")
  },
  "80e8be4ef41e0519ccfb7105125c2dd753e548122d9a8183ae11f4d40a36925d": {
    functionName: "getSiteContent_createServerFn_handler",
    importer: () => import("./site-content.functions-CiYyniZh.mjs")
  },
  "821bda134b97d86f0ee4b1f310a659bbea8217187be0096c896d4a1871dfd5c8": {
    functionName: "getLeadFinance_createServerFn_handler",
    importer: () => import("./settlements.functions-mMqWwD7I.mjs")
  },
  "8295cf49633528bca94784b8edea17d9cdbf9e5b779503ac5adbbec543ce945c": {
    functionName: "removeTicketsFromFolder_createServerFn_handler",
    importer: () => import("./support-folders.functions-BJbt1Fjf.mjs")
  },
  "83f9ebf8b7f99e8945909ea37614c16e76dc59de78a1b838e05496a15cbeef8b": {
    functionName: "listSitemapWebsites_createServerFn_handler",
    importer: () => import("./sitemap-admin.functions-B9zwyK0M.mjs")
  },
  "8446842926479d9bb065c40b7124967c797ca4f270272cc9e07577d7043a6ea3": {
    functionName: "listOrderTickets_createServerFn_handler",
    importer: () => import("./list-order-tickets.functions-DtEq7oDH.mjs")
  },
  "850ac66cc0534b9c4d18a1117e6254021411713aa1646a9e13b28779dd069bba": {
    functionName: "getUnreconciledPayments_createServerFn_handler",
    importer: () => import("./settlements.functions-mMqWwD7I.mjs")
  },
  "8653215103488ed2133d5e7492fd1f25d23d87c6ef76b4daadce2b038c321bd8": {
    functionName: "deliverCertificate_createServerFn_handler",
    importer: () => import("./certificates.functions-BAmsF1n9.mjs")
  },
  "868b6920182a334ad84e6e0896f18feea08ccd9b69e0fad1f044a6ce276c3337": {
    functionName: "listLeadEmails_createServerFn_handler",
    importer: () => import("./emails-admin.functions-C7EPXWZV.mjs")
  },
  "873c3aeb7aaeeac99b72765e98306eaeb37aca8de8c6352714b00543bb0fdb22": {
    functionName: "listTickets_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "875bc4b40bc43054de83cc0383b5667754e5ced6e7246ae8db60958f2d32991a": {
    functionName: "closeTicketConsultationT001_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "87abae69d90f0e807c2d1f89044dcec39780a543c9398637920979f6ad01302c": {
    functionName: "resendOrderCertificate_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "88277d7574050c50789162cf1f7746c4c1bd631711e4c2ffa402c12f5068602c": {
    functionName: "bulkEmailLeads_createServerFn_handler",
    importer: () => import("./leads-bulk.functions-DjIrl5IJ.mjs")
  },
  "88b2c0a30e259b02476c36a336c6e49582e40494fce6ed45c6d1e4edc98640a4": {
    functionName: "resumeOrder_createServerFn_handler",
    importer: () => import("./workflow.functions-BO-RhjxS.mjs")
  },
  "88b9a1eb87f0d922651a75fe4060c142246e80829925ae270bda64cf87ade8dd": {
    functionName: "listLiveCalls_createServerFn_handler",
    importer: () => import("./calls.functions-z703p4Uz.mjs")
  },
  "8955a0298badd332920cc8a360a11051270c3bb8ffd76bffe00cdf376388b89b": {
    functionName: "getSanityLandingPage_createServerFn_handler",
    importer: () => import("./client.functions-nIksBFX7.mjs")
  },
  "89e64d3af38c4fe97260d131faccea2fbda2dceacc78515f4d22adb466e2b54d": {
    functionName: "listFollowUpsForLead_createServerFn_handler",
    importer: () => import("./follow-ups.functions-B__Q1PL2.mjs")
  },
  "8a3bb9359a2be76e216599f64b8c23a31c29a05a5567c18a30becfdbbc4d9797": {
    functionName: "cancelOrderCallback_createServerFn_handler",
    importer: () => import("./callback-reminder.functions-C-8RSOAj.mjs")
  },
  "8a403c3ce936ae0eb8897b725fc850af5ac7f520462b211a30858458f63d6907": {
    functionName: "listUserPermissions_createServerFn_handler",
    importer: () => import("./permissions-admin.functions-Ch7-uAAa.mjs")
  },
  "8af738b0ce7d72c81c7476176ba266494cb07ffe0d8b3282190250de142b4376": {
    functionName: "duplicateEmailTemplate_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "8c2424cad7224077f54cca04271460d5d1dae95781478ce2b14087821a6617b2": {
    functionName: "getOrderDocumentSignedUrl_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "8c50e4b184a9242cfa93c769a651c3c143078de3153178a016cf1c8a2a872e92": {
    functionName: "recordHeartbeat_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "8d26cdba261f14f0ab9ac68dd289ccc9a884bbf2e560e508edf5a8195ea09a12": {
    functionName: "listRefundRequests_createServerFn_handler",
    importer: () => import("./workflow-closure.functions-D37qqjru.mjs")
  },
  "8e754c3cf31d97400ffb9aef78976823e9d72bc96ed695a8aa6dd04528879078": {
    functionName: "getServiceConfig_createServerFn_handler",
    importer: () => import("./service-forms.functions-BAWUc1dj.mjs")
  },
  "8e98c7980bb07bc1254ec584186b1b881e9ad925ec0a9c7ebbafa104f23f9fc5": {
    functionName: "resumeFromCustomerDelay_createServerFn_handler",
    importer: () => import("./hold-actions.functions-u-SzJe41.mjs")
  },
  "9086494cebbe0ce49af5ad30994e07139bf1702db7d73aea84fd989a88ffdd95": {
    functionName: "getWorkforceDashboardMetrics_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "9177ae3d239452037965edda9ba2c3f94a33cb66eebf1a09a1f711fc6bdd30e2": {
    functionName: "upsertContentBlock_createServerFn_handler",
    importer: () => import("./site-content-admin.functions-BoGmvGO4.mjs")
  },
  "918d8aae65ebe20712bed437989b3f302e0625664bfa9df72ef042771c08d4bc": {
    functionName: "exportDayWiseRevenue_createServerFn_handler",
    importer: () => import("./revenue-admin.functions-D1LQSVoF.mjs")
  },
  "91eaffc162c08d41abe3c48b3f2a8f7b55f78a6f96b03bd9f89300ab54506141": {
    functionName: "listAssignmentPool_createServerFn_handler",
    importer: () => import("./assignment.functions-BGPC7-uK.mjs")
  },
  "9329bbe0908519771e7717498711da76208d92dc640056a7dad5b7fcd6031c21": {
    functionName: "closeTicketFinal_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "93370f49b87a0612ddb801b4160c30de41ab3f1a7d58f67f8e127bb88e5fca12": {
    functionName: "listCashfreeAccounts_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "93499bd1da03c5adf57649d5a9386e400c566bd800f89ec071e2ad4c8c8d8b43": {
    functionName: "listEmailLogs_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "9352d2ec2b46ff7b350730511f0b0a82b0d8c6480019ebf5fb71c7f0afbaa949": {
    functionName: "uploadCertificate_createServerFn_handler",
    importer: () => import("./certificates.functions-BAmsF1n9.mjs")
  },
  "935b085390b565f0181d2bf15cefb3bfebbbe896c480ad26b69ba6a1c4caac05": {
    functionName: "resolveApplicationLink_createServerFn_handler",
    importer: () => import("./links.functions-CfVa06sP.mjs")
  },
  "955f3d0f1d75646335826c5e99af658baebab9f38a2231baf0ecdd5b4405ff94": {
    functionName: "getSuperAdminOverview_createServerFn_handler",
    importer: () => import("./super-admin.functions-hGqZ75Mr.mjs")
  },
  "9573e437b1ae63bcb34e0328b56cc0c42a1cc33eea492ff5e2709a9538cd4257": {
    functionName: "markRefundProcessed_createServerFn_handler",
    importer: () => import("./refunds.functions-NGl5GEKe.mjs")
  },
  "95d44d906ae59330134cb408bccccc6477dd4f3fe235d64e3b15579aa4d81734": {
    functionName: "transitionComplaint_createServerFn_handler",
    importer: () => import("./status-engine.functions-7ehnBgE7.mjs")
  },
  "961f27d6ee17bbb447cce182ae91e3206b3bb364961e06ec23c085c50b896dd9": {
    functionName: "getLeadCounts_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "96ec3e176fbf36926c6f13b2d01cf96b3716c2a00d6bfe2b21e5e438d57513a8": {
    functionName: "confirmTicketAttachment_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "973d466e32de56f2346284c571c6322fce00b1af7acf9e20a21a2ed0f56e9bc5": {
    functionName: "getRepeatPurchaseMetrics_createServerFn_handler",
    importer: () => import("./customers.functions-Bn_P-jhI.mjs")
  },
  "975937810f01a96133e4199fe30d0693dab6d027c1fde165320e566a19e2c75d": {
    functionName: "closeOrderSystem_createServerFn_handler",
    importer: () => import("./close-actions.functions-Oz8eDeEK.mjs")
  },
  "9846c6ab10efb3dc263bff2994c13dd6c80f0613da6b7d2ebdbf5cb70b95ec11": {
    functionName: "updateLeadAssignee_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "984d76ca1c32cc7ff3f579f02c5b2931a6bfc87dccf587a3ba0a670369f07ff7": {
    functionName: "getAdjacentTickets_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "99ca93a2951d4255b26eae2e59eebc39fc70a61b461a703b5e8d3315e96cf01d": {
    functionName: "getTransactionDetail_createServerFn_handler",
    importer: () => import("./revenue-admin.functions-D1LQSVoF.mjs")
  },
  "9b8bd700c57751d04c989cb03c005aea4af7f1d9edddc32ee9b8f2097ff5f7d1": {
    functionName: "listSubmissions_createServerFn_handler",
    importer: () => import("./submissions-admin.functions-Bo0pIwAC.mjs")
  },
  "9bb41a1d650a9b2d7e3d6f466b34e28587533984bbc075a247e50cedf6a73acb": {
    functionName: "getFinanceReport_createServerFn_handler",
    importer: () => import("./reports.functions-CTkL_CeV.mjs")
  },
  "9bda9d91530f581142f950e4afc1f1466417da335f64953fb15a66d7ba2ee5de": {
    functionName: "completeOrderCallback_createServerFn_handler",
    importer: () => import("./callback-reminder.functions-C-8RSOAj.mjs")
  },
  "9bfeccd8321347372a8a9d8ae37859585d198ac98b49c265ab28fbe3a9735c85": {
    functionName: "retryProcessingError_createServerFn_handler",
    importer: () => import("./inbox-admin.functions-D4RMHTKm.mjs")
  },
  "9c4111329a69a79f89481e64f3feff498d735bcde7c8e2f6c75460ddbb31aa1d": {
    functionName: "saveCashfreeAccount_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "9f763d14b4f9ae67924e7de3a0e16536f6eddd6453b622f9639f7ca49a138931": {
    functionName: "deleteWebsite_createServerFn_handler",
    importer: () => import("./websites-admin.functions-J6svBQyk.mjs")
  },
  "a04d5285dce31da0f52dfbf943c2d8c015900c3e5bf5bb9cbc3323c6104bd1d0": {
    functionName: "saveCallbackReminderPresetSettings_createServerFn_handler",
    importer: () => import("./app-settings.functions-DHeNVODb.mjs")
  },
  "a063da8b2add06d1bf0ff8a6b0a949a23000a5963030c2a109c54477e7b6274a": {
    functionName: "listSupportFolders_createServerFn_handler",
    importer: () => import("./support-folders.functions-BJbt1Fjf.mjs")
  },
  "a1686ef4b8a37642fb43d1b7dbff9af37c0e23ecf6475e5ec8bf89eb2fce930e": {
    functionName: "revenueStats_createServerFn_handler",
    importer: () => import("./payments.functions-CVqwWDl5.mjs")
  },
  "a1710990f8c46ca07241f6449d89b9872f8207edabe560fd0fd03015131b3a67": {
    functionName: "forceLogoutSessionAdmin_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "a50e92b3bc0b31686b381bbc186bfa0469955c928cebda915d4d45ddb3f14325": {
    functionName: "closeTicketWithReply_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "a530035146e8ddda76500756657e0953cb7b950eee253147a9631c1ed73831f7": {
    functionName: "updateSavedFilter_createServerFn_handler",
    importer: () => import("./saved-filters.functions-DY4WThx5.mjs")
  },
  "a5ca012de55c756cbdcd5e32d5729343fa721101501b748ce2589b600869ae27": {
    functionName: "setExternalDelay_createServerFn_handler",
    importer: () => import("./workflow.functions-BO-RhjxS.mjs")
  },
  "a6d9530ee14b15af1f81b1edf893a9451d0052e52fc04788d6074693bd70857e": {
    functionName: "deleteEmployee_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "a6f0560507698b550ff0997b2a5e78434e44a45cead455eaacffed5a8538589e": {
    functionName: "getDashboardStats_createServerFn_handler",
    importer: () => import("./dashboard.functions-ljRZWJWe.mjs")
  },
  "a6f9794ff59810cecbc6972eabeabcad4e07624fe54a7cd8455a06d358a9a633": {
    functionName: "getDueRemindersSummary_createServerFn_handler",
    importer: () => import("./callback-reminder.functions-C-8RSOAj.mjs")
  },
  "a75af8edf4ef9a2aca7af599d2fe09724a28cd4dd7bda495e06c9fc64872b336": {
    functionName: "exportGstReportCsv_createServerFn_handler",
    importer: () => import("./gst-report.functions-DFGG3a4o.mjs")
  },
  "a781c1a2fc7b6a0c3b6ae13a5b652ba9257b201a4fcb0174898cca78b74b0c45": {
    functionName: "getTrainingDocDownloadUrl_createServerFn_handler",
    importer: () => import("./training.functions-BooxTkZp.mjs")
  },
  "a7b4c46095556f0116bb77c34a6e2cf10ea985c5f8485b8b5451a77becb12970": {
    functionName: "listStaffForAssignment_createServerFn_handler",
    importer: () => import("./tasks.functions-DIfMcByt.mjs")
  },
  "a8176ce5c4f52210a1f824a706bd9699e51636c514ec317056128c1a3a2c2346": {
    functionName: "resolveTicketAndResumeOrder_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "a8449235b53f082fa664f40cdc459bb6c618a31dae119e4a9f29a47b3a53fa30": {
    functionName: "getSanitySeoArticle_createServerFn_handler",
    importer: () => import("./client.functions-nIksBFX7.mjs")
  },
  "a85b06c6d418e4161ea026be601679e2eeed25ac21afbdd8f6e2f291e5f4f3d5": {
    functionName: "setDocumentStatus_createServerFn_handler",
    importer: () => import("./onboarding.functions-Cb4Pg19J.mjs")
  },
  "a88444092486de02238a8ce8089bf67dad9c797396759b0a50e2910b6b2aaed7": {
    functionName: "upsertService_createServerFn_handler",
    importer: () => import("./services-admin.functions-DE3Keao1.mjs")
  },
  "a976c0603a25ef17ecdd1a61bcc1aea6b6d4a4aa791aa5e81f327676732d7370": {
    functionName: "getTrainingDocUploadUrl_createServerFn_handler",
    importer: () => import("./training.functions-BooxTkZp.mjs")
  },
  "a97982866ae58b8c62b684a253dad15791585c10b37aabba5d5c8fa8a3ec5c2c": {
    functionName: "updateWebsiteContact_createServerFn_handler",
    importer: () => import("./site-content-admin.functions-BoGmvGO4.mjs")
  },
  "aa29de67b1f16df41ee45a2473cf1af9dade105a78c24f90e6ce43cb50c2977b": {
    functionName: "importSettlementCsv_createServerFn_handler",
    importer: () => import("./settlements.functions-mMqWwD7I.mjs")
  },
  "aa6aa250901ef03955b14659602fe5d7e436559550243cf8c0b0119642229fbd": {
    functionName: "listReviewDocuments_createServerFn_handler",
    importer: () => import("./document-review.functions-CqZ_T4Al.mjs")
  },
  "aa709b406f4abd9550489179d2acbd69d4be33753e2e8ca268cfe4d048706eea": {
    functionName: "listOnboardingForLead_createServerFn_handler",
    importer: () => import("./onboarding.functions-Cb4Pg19J.mjs")
  },
  "aa7b88a0b56a13b4e82bf291bf5e989aba84058f6b65b3a64a648d0e1fd6d7ed": {
    functionName: "listLeadEvents_createServerFn_handler",
    importer: () => import("./lead-status.functions-D0K0Ccu1.mjs")
  },
  "aabf2ace5da0bceb6608f833d01e2f87a0b5c943a88ce256e84f68af7333d2a6": {
    functionName: "getMonthlyAttendance_createServerFn_handler",
    importer: () => import("./attendance-payroll.functions-Dvx68M6F.mjs")
  },
  "aadb5e10457500de8bbf781749bcfd79f4a9c145fccfaa3f17dc8cf32d937814": {
    functionName: "replaceInvoice_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "aaf61620faceaf5d5caa71f36233696aa4538dc557db8f4f1f608aeef52f817f": {
    functionName: "approveRefund_createServerFn_handler",
    importer: () => import("./refunds.functions-NGl5GEKe.mjs")
  },
  "ab44d51e25f84e10cd4513a24068b08803d793165397a24448b0ef62ed9ac300": {
    functionName: "listAuditLog_createServerFn_handler",
    importer: () => import("./reports.functions-CTkL_CeV.mjs")
  },
  "ac3259a8b2f79a78c18eef3be950db1a5440f184e23ec5591981811aac4ca088": {
    functionName: "markCustomerReplied_createServerFn_handler",
    importer: () => import("./workflow.functions-BO-RhjxS.mjs")
  },
  "ac650ed9879a6610188e82023f4b6d93df44a6571fec15a067ce14e62a24b980": {
    functionName: "resumeFromHold_createServerFn_handler",
    importer: () => import("./hold-actions.functions-u-SzJe41.mjs")
  },
  "ac679de14a5b764361c735386d9a75e188d5fff75537c94e13874a0f5ecc16d6": {
    functionName: "buildZohoInvoiceExport_createServerFn_handler",
    importer: () => import("./zoho-export.functions-Ckx_XJ5X.mjs")
  },
  "acdc84c5b6654c7e1618a2b180126a2ad9b2910aeb3e10dcd17fd575a48a74b5": {
    functionName: "updateEmployee_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "ad8f7485f17d344a376154f86c82b33b021de429a28d9353abafaa3e17ebf4b2": {
    functionName: "updateGateway_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "adeb0e75e2ef29d9fd0c6ea3392660738a76f4c62f1c33743613ae2a4c56f88e": {
    functionName: "sendFormLink_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "af14603d7dbf4bf37b66da5c021cd47be52f00be29b18ef5655c90259de5accd": {
    functionName: "searchCustomerOptions_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "af4259d0703d838f4e2a4de7bf83bd244dff09349ac5961c5c1dcee10706dd58": {
    functionName: "deleteCannedResponse_createServerFn_handler",
    importer: () => import("./canned-responses.functions-CYpR2616.mjs")
  },
  "b08fbdd9d88ccbe5e6a2b1eb82bfbe5632066df4623ed1444654c3482652d493": {
    functionName: "setSitemapInclusion_createServerFn_handler",
    importer: () => import("./sitemap-admin.functions-B9zwyK0M.mjs")
  },
  "b0ae9c064171c2de5f323c1dfda080c3a203e50f5491efcb7f3b2123728dcc35": {
    functionName: "updateLeadContact_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "b25dd7970bedbdbdff7b3c458bcbdfe08487a7961a260d1d7052e9649ea40b23": {
    functionName: "listSavedFilters_createServerFn_handler",
    importer: () => import("./saved-filters.functions-DY4WThx5.mjs")
  },
  "b334d85b2e2ac82f4b29429a685679c429122c575d02ac976438df598dc74425": {
    functionName: "listWebRtcEvents_createServerFn_handler",
    importer: () => import("./webrtc-diag.functions-BXjN20Rf.mjs")
  },
  "b353c6087f9fac35710238d4e9182c7820cb9a4959bfd1ed2e5bea26bda5f87c": {
    functionName: "addManualNote_createServerFn_handler",
    importer: () => import("./lead-status.functions-D0K0Ccu1.mjs")
  },
  "b3733e1aceb348de0df1b06cb31a68f96067758e25ebad5406776840c0f87283": {
    functionName: "listServices_createServerFn_handler",
    importer: () => import("./services-admin.functions-DE3Keao1.mjs")
  },
  "b52c83dc1ea228ab0f2bdd6fb3c20ddbeeee51a1a45bd88de8fa945a6178feee": {
    functionName: "getOrderDetailV2_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "b53554934776d755cb0399c3fcf53ff1fe00a59ace30c4a5174f1b5042a5cd0d": {
    functionName: "getDocumentSignedUrl_createServerFn_handler",
    importer: () => import("./onboarding.functions-Cb4Pg19J.mjs")
  },
  "b65c4ab724f5f1ed296f3959f7e05191b919e8bff50e754913bd30a636ca001d": {
    functionName: "regeneratePaymentLink_createServerFn_handler",
    importer: () => import("./payment-links.functions-_bmUKOht.mjs")
  },
  "b6e24206718ff59d0462b3bef0390ea09c23a27d65774f412139a74730a134fb": {
    functionName: "processEmailQueueNow_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "b6fbaa242855e30e2931b57777521c23efc1a8ed0bc94660d6897fa79e12b029": {
    functionName: "updateComplaint_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "b7ba6a8b7c43e0c7654c19787799e796b414196d1fb8e28d5d4caf2fbfa34200": {
    functionName: "listEligibleEmployees_createServerFn_handler",
    importer: () => import("./assignment.functions-BGPC7-uK.mjs")
  },
  "b986717c6d840e8063209d60ece8e5308853eafb3aeaeb3543267dd60c979cf1": {
    functionName: "closeTicketNormalT001_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "bad46058b61ba9640fc451ed9b10c448c81cfd7af68f4de09b8ef28da79aa164": {
    functionName: "upsertAutomationRule_createServerFn_handler",
    importer: () => import("./workflow-settings.functions-B5aYpJpa.mjs")
  },
  "bb2da9d9bd6ade64a5b503127144b735390dd5d8176b03710abef7013c2baa7b": {
    functionName: "deleteNotification_createServerFn_handler",
    importer: () => import("./notifications.functions-DnfGbPYy.mjs")
  },
  "bbd99b5215687dc0e22283b828ab654992dd1106b158acf3774bf9d3d97aa96b": {
    functionName: "getCustomerInvoiceUrl_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "bdaed249103b005012ed7d34cfef7ba34eb0153b3495781d2cfb1198a3a96d1a": {
    functionName: "getDashboardTopServices_createServerFn_handler",
    importer: () => import("./super-admin.functions-hGqZ75Mr.mjs")
  },
  "bf98d6a120e262e69216c45bb7aedba8dd849aa814e7e516140cb1533ed812fe": {
    functionName: "upsertSeoPage_createServerFn_handler",
    importer: () => import("./seo-pages.functions-COwus60w.mjs")
  },
  "bfaf7c929d50cc138682db317bd483e72b3fbc215672095cd58346801bba44ea": {
    functionName: "markRefundProcessed_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "c05623c763ae910a4af76c3fd6df3625512dcaa1e542a58253897255d67e2aa0": {
    functionName: "getDashboardSecondary_createServerFn_handler",
    importer: () => import("./super-admin.functions-hGqZ75Mr.mjs")
  },
  "c0dd0783f9d0e940177779c900d504ee31a2c43813e0385051022b44428b3dfe": {
    functionName: "controlAutomation_createServerFn_handler",
    importer: () => import("./engine.functions-DIMuNurD.mjs")
  },
  "c0f2bf63f75667a3bd0890ba0e616e01daca561a9a899023d27d88c2e47e2622": {
    functionName: "checkLiveSitemap_createServerFn_handler",
    importer: () => import("./sitemap-admin.functions-B9zwyK0M.mjs")
  },
  "c170b5c939e887ebe3322c5035b1020ab47da960f720bb564ea04c4f8d853650": {
    functionName: "saveIvrDraft_createServerFn_handler",
    importer: () => import("./ivr.functions-CCGTlcL7.mjs")
  },
  "c1edb9a1c3a5f91827d0c6f694520cfd580aba2ebeed3ea28a3b3b8e6f7f2e83": {
    functionName: "sendPaymentLinkEmail_createServerFn_handler",
    importer: () => import("./payment-links.functions-_bmUKOht.mjs")
  },
  "c29f5abce8f2a9cb7ee57f729379634a8bd561e2b67985444ff482ae458f6843": {
    functionName: "listPermissionModules_createServerFn_handler",
    importer: () => import("./permissions-admin.functions-Ch7-uAAa.mjs")
  },
  "c303d2dceac601ba4f32a3631e352bde9e7e435dd80df41662ccbb8887c5c7d2": {
    functionName: "getActiveEmployeeSessions_createServerFn_handler",
    importer: () => import("./employee-presence.functions-CIJ1TtsD.mjs")
  },
  "c335a3a00eb993a229afef995edf4e3963b4bd473c9941f08e101653728fd7d4": {
    functionName: "getGlobalReminderSoundSettings_createServerFn_handler",
    importer: () => import("./app-settings.functions-DHeNVODb.mjs")
  },
  "c3702d027355198bf7e1301017e87d122daf1cd7acaa27bc291cf0abb92416b5": {
    functionName: "getEmployeeMetricDrilldown_createServerFn_handler",
    importer: () => import("./employee-performance.functions-Mo8Fan0_.mjs")
  },
  "c59d6a6c5f50ec681c098ce0cb8106520ddf6082b3d485c7d72792ffec2c69e6": {
    functionName: "updateBusinessHoursConfig_createServerFn_handler",
    importer: () => import("./business-hours.functions-CNKOiUp3.mjs")
  },
  "c64910ba5499b5d1e99d9126def59689b440e0a506943d28e49aeaabdedcf19c": {
    functionName: "confirmDocumentUpload_createServerFn_handler",
    importer: () => import("./onboarding.functions-Cb4Pg19J.mjs")
  },
  "c69695ee8338dba9c4d350af69956b373e056ac03a34efabd4925a4ccb934d02": {
    functionName: "listMyNotifications_createServerFn_handler",
    importer: () => import("./notifications.functions-DnfGbPYy.mjs")
  },
  "c6977c6a5c7e6e9f6eec748213346d3cb5b868338abc225d32707e116867bb11": {
    functionName: "sendLeadEmail_createServerFn_handler",
    importer: () => import("./emails-admin.functions-C7EPXWZV.mjs")
  },
  "c8ae2564d5472e3ea5314c853ecf9d3784b7d02bd722a3499ed370c7bdd1e4d7": {
    functionName: "completeFollowUp_createServerFn_handler",
    importer: () => import("./follow-ups.functions-B__Q1PL2.mjs")
  },
  "c8faf6de0d26f6e932e5f45a07d8b3405b13d396c42989ccd704ad9d7d26b8e3": {
    functionName: "updateComplaintStatus_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "c903b98c46cee4bd96d81d71f246de4a4d6d2d10e3c1ae5d1673bbb0ed546efa": {
    functionName: "getDocumentSignedUrl_createServerFn_handler",
    importer: () => import("./document-review.functions-CqZ_T4Al.mjs")
  },
  "c928c74a3ac6888dbaad8614a5b11b51d00f78d0123cade2a5cbac362869074e": {
    functionName: "uploadGatewayLogo_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "c9fab14567506a7602dfc4ad844cc8e1ba5d4424f30f786b5fccc796c0efb1da": {
    functionName: "getCustomer360_createServerFn_handler",
    importer: () => import("./customers.functions-Bn_P-jhI.mjs")
  },
  "ca0efa78a2921709400effdd574a61007c89e89f77ad52074b659ed03f82e423": {
    functionName: "requestDocumentReupload_createServerFn_handler",
    importer: () => import("./onboarding-admin.functions-CE_gBbXI.mjs")
  },
  "cb0dcac84b823bc63911ae523fd36e8bff736727bc7280844feade19352c0107": {
    functionName: "auditOrderPayments_createServerFn_handler",
    importer: () => import("./payment-audit.functions-CPQ0jIxT.mjs")
  },
  "cb2a013f6771304a32e61c341b866d5ac79f7e61d1b0d819782c58afed8a7cfa": {
    functionName: "submitAllPagesToSitemap_createServerFn_handler",
    importer: () => import("./seo-pages.functions-COwus60w.mjs")
  },
  "cb5cd1edb0683d4b8c27db182aaa1e516f1fe2b939d1944801019c7368c7b994": {
    functionName: "refundPayment_createServerFn_handler",
    importer: () => import("./payments.functions-CVqwWDl5.mjs")
  },
  "cba23f4c161ec765ece2bfad3d69c8d9a2aa009e6022c785e07b42bb5d3c2664": {
    functionName: "saveShiftSettings_createServerFn_handler",
    importer: () => import("./employee-presence.functions-CIJ1TtsD.mjs")
  },
  "cd400d41658f23e803b7f6688b2ab0148e33b17225845ce91427c788162419c9": {
    functionName: "archiveEmployee_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "ce1e068f5dcf99f7ea2b3a07492e1b45775a96328d70f1c69702279a892dac82": {
    functionName: "bulkAssignLeads_createServerFn_handler",
    importer: () => import("./leads-bulk.functions-DjIrl5IJ.mjs")
  },
  "ce294dc403958b755c35bbbda8af5e1651efab537079d4b894d07b29b5d21200": {
    functionName: "getWebRtcSession_createServerFn_handler",
    importer: () => import("./callerdesk-webrtc.functions-DDQSUOKd.mjs")
  },
  "cea0f513beae0a10d45fae42411f1863d054def9c90fcd80a0f95e7bf666169e": {
    functionName: "sendTestEmail_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "cf1e48ef930364020fdf4dc9d1a601b16c458b6d90587a5be483441aaa700148": {
    functionName: "getTicket_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "cf4cf9cddbb6aac45968f2c2632802af04240c2e67fd4aa06efe0025d51553b1": {
    functionName: "listAuditLogs_createServerFn_handler",
    importer: () => import("./audit.functions-CSRXX8-Z.mjs")
  },
  "cf6e6729a8ff40c24ef20d7be8c0c6bd9c885baa44053e5f2a3fb94965cf62b6": {
    functionName: "listCloseReasons_createServerFn_handler",
    importer: () => import("./reasons.functions-DoPfT1Ir.mjs")
  },
  "d05b611db77fb7cdd3c2dfecce657c3a154cfb520b2b66def6f7ebbcd8a1e086": {
    functionName: "getDocumentSignedUrl_createServerFn_handler",
    importer: () => import("./documents-admin.functions-B3fcnIYW.mjs")
  },
  "d09b5def561c97d9af2d33d19dea3fb9e628ab88e1cbc611eb88b776cde547d4": {
    functionName: "createLead_createServerFn_handler",
    importer: () => import("./leads.functions-4ZMFVopL.mjs")
  },
  "d1016360f0aa2151eba677d792bd1549b83ef1f0313e829577a3549f7555b732": {
    functionName: "bulkDeleteLeads_createServerFn_handler",
    importer: () => import("./leads-bulk.functions-DjIrl5IJ.mjs")
  },
  "d1653e71979212c9a27274cd6c5362e87e89dbbbb46fb5b675d66858ad2d19bd": {
    functionName: "listWebsiteGateways_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "d26efa7f1fc95b3400ac689b8f615e6a9023db787c42ac54b1e7249313b818fe": {
    functionName: "requestDocumentUpload_createServerFn_handler",
    importer: () => import("./onboarding.functions-Cb4Pg19J.mjs")
  },
  "d2b513abb725553d7a81750fc3992405be3425757125bf872f711fd4cd389540": {
    functionName: "listSettlements_createServerFn_handler",
    importer: () => import("./settlements.functions-mMqWwD7I.mjs")
  },
  "d2d1919a68fd9d08baebe96c655a187f25a4bcfd40745577844c3a2180b40dae": {
    functionName: "getApplicationSummary_createServerFn_handler",
    importer: () => import("./gateways.functions-DSbfsXA2.mjs")
  },
  "d2dafb67d3372ec274e8ec9446326171333b85be156e5271cde802283e173467": {
    functionName: "markNotificationRead_createServerFn_handler",
    importer: () => import("./notifications.functions-DnfGbPYy.mjs")
  },
  "d3447064a35da20230170714e09da71fe23e6ab0445238d746cad37ec7383e5d": {
    functionName: "deleteSavedFilter_createServerFn_handler",
    importer: () => import("./saved-filters.functions-DY4WThx5.mjs")
  },
  "d34c7c83506c44f2c86116d6dcd7dfcdc4b6cfb60731a7bf41577677c9c2ea57": {
    functionName: "getOrderTimelineEvents_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "d39f7a313a28a3ae4629f9222f47e7b1aba875239da644152c18a0af43e1e440": {
    functionName: "getTicketOrderContext_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "d470933a0c8489fb0aff43b9f366a84315b763108e87b734e4c1b3ce27d9a9c4": {
    functionName: "confirmOrderDocumentUpload_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "d47c7801098ff1a803823beb2d24ff484e855000f8de881693cee5d369da1970": {
    functionName: "updateCustomerDelayAutocloseMinutes_createServerFn_handler",
    importer: () => import("./app-settings.functions-DHeNVODb.mjs")
  },
  "d4c1bef89bd71fafe10b445f2e52b286c4d3dff433b22244f895280313b69ac8": {
    functionName: "getTicketWorkspace_createServerFn_handler",
    importer: () => import("./ticket-workspace.functions-DD3c7yBn.mjs")
  },
  "d501189b91a655e5accd4a82330fd2abb54fd77e722bf3485295a47e0d83fcb6": {
    functionName: "getRefundDetail_createServerFn_handler",
    importer: () => import("./refunds-v2.functions-DubtYnlX.mjs")
  },
  "d54ef0f0e4687d54c02c473e13f6542597498ab4d8b31291a14528e244a2f5e2": {
    functionName: "exchangeOnboardingAccess_createServerFn_handler",
    importer: () => import("./customer-access.functions-jmK9u-TR.mjs")
  },
  "d59bbd896d658bff27bd047795a7d69bb88958a4f4de31550366d4b252a431fc": {
    functionName: "listActiveServiceCodes_createServerFn_handler",
    importer: () => import("./services-admin.functions-DE3Keao1.mjs")
  },
  "d59f1962ef7e3cf40fa81dddee94b56f3c2684f7b5e86c333caff6d574e8f9b0": {
    functionName: "getTicketStats_createServerFn_handler",
    importer: () => import("./tickets.functions-S7DOa2Zi.mjs")
  },
  "d6ad71ae21406133fa959e553fabe4b46832fdf0cadfe84258c23eb0fe10f137": {
    functionName: "listAssignableStaff_createServerFn_handler",
    importer: () => import("./leads-bulk.functions-DjIrl5IJ.mjs")
  },
  "d7f5f55726d446a674e3196ec5d4274263597d06eb6aad8b33dc7a4cc5dcdab1": {
    functionName: "getSmtpSettings_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "d836104feccf04cf7d9cad7af7654fd68ec5d280bae32c6a32555bd5b678d6ed": {
    functionName: "deleteDisputeEvidenceRecord_createServerFn_handler",
    importer: () => import("./dispute-manager.functions-BWvTPtwi.mjs")
  },
  "d8d156737c93b048a2e95445e9c57065c3a617ec5087ba2685a183cbefae5e41": {
    functionName: "checkCallerDeskApi_createServerFn_handler",
    importer: () => import("./ivr.functions-CCGTlcL7.mjs")
  },
  "d933b30de9c7f68233a221e99d85a647716654f80f7b1722eb1c42cb6be7668a": {
    functionName: "uploadCustomerKyc_createServerFn_handler",
    importer: () => import("./customers.functions-Bn_P-jhI.mjs")
  },
  "d9c9ef36b53cf84b9a2e945fb56104fdba1ba96871e0671aa2fcc9ca6f4bcf3f": {
    functionName: "replyToTicket_createServerFn_handler",
    importer: () => import("./ticket-actions.functions-DlEpuy6S.mjs")
  },
  "d9d55c1ca43dacb36fc0449eea5f535b04bc1af8d112c9b1f19574f972c083e1": {
    functionName: "toggleEmployeeAutoAssign_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "da04f7605b8d75776e008917b637993f670a179601f8bb45bbbb2a61b081fa31": {
    functionName: "listOrders_createServerFn_handler",
    importer: () => import("./orders.functions-BYx9he5_.mjs")
  },
  "da0d4ad64a43c12d5ccf5c8cadbe2039bcc683635ccd09609ec02bde330c4849": {
    functionName: "getAppSettings_createServerFn_handler",
    importer: () => import("./app-settings.functions-DHeNVODb.mjs")
  },
  "da95e61acc686cd20bd84b5eed2adf2f95b79fdfa5f78a3a041f273ac2808343": {
    functionName: "recordEmployeeHeartbeat_createServerFn_handler",
    importer: () => import("./employee-presence.functions-CIJ1TtsD.mjs")
  },
  "da97ea992e9a8fc30c51285e75e69c7c69f0f14475f2bc0abc80f86afa881ed0": {
    functionName: "createSupportFolder_createServerFn_handler",
    importer: () => import("./support-folders.functions-BJbt1Fjf.mjs")
  },
  "da9d6d9c3d8004b320f0cf7c11c397ee2dcbf6fa79d35d73f58a42a06073fa80": {
    functionName: "listDelayReasons_createServerFn_handler",
    importer: () => import("./workflow.functions-BO-RhjxS.mjs")
  },
  "db3cc9b5df7abcc9f0342f59301780d8f998bc5570bab41ff7257dcd5e69e901": {
    functionName: "rejectRefund_createServerFn_handler",
    importer: () => import("./refunds.functions-NGl5GEKe.mjs")
  },
  "dbb3a693497cad78d5e6db0526d3841c660eea21e060983617138bd55fa1e199": {
    functionName: "getDocumentVersions_createServerFn_handler",
    importer: () => import("./documents-admin.functions-B3fcnIYW.mjs")
  },
  "dc19c53b368fe6f95d5a4d961beeafd20a738cf08324386310c95a2cd5635b72": {
    functionName: "togglePoolActive_createServerFn_handler",
    importer: () => import("./assignment.functions-BGPC7-uK.mjs")
  },
  "dc37c1aac912d572f98679801c0ba85526d37f4024d42745970f0b055a22c598": {
    functionName: "getComplaintDetail_createServerFn_handler",
    importer: () => import("./complaints-detail.functions-BjW34gZB.mjs")
  },
  "dca6096388aae1648c4deb26f7f6adef2eda764a56c707affc3d1ba5eafe90e2": {
    functionName: "saveCallDisposition_createServerFn_handler",
    importer: () => import("./calls.functions-z703p4Uz.mjs")
  },
  "dd21c7df0c60d6dbd86d9b9ffca5a8cc14d93af9804b4b08d5c550d88ff01f07": {
    functionName: "searchLeadOptions_createServerFn_handler",
    importer: () => import("./tasks.functions-DIfMcByt.mjs")
  },
  "dd7725c6ee45b6eb20e71b48e9095a6feef3b9b04429dba5308a67bd37a667bb": {
    functionName: "addLead_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "dd7d46b7ea327b08659aa3a559ab2cfe54293fef562482d2e87559d88c4790fb": {
    functionName: "logWebRtcEvent_createServerFn_handler",
    importer: () => import("./webrtc-diag.functions-BXjN20Rf.mjs")
  },
  "de765927a918f23f14a73bfe49caf9beb4e2576eca3b91277479cb7af7012513": {
    functionName: "markFormReceived_createServerFn_handler",
    importer: () => import("./hold-actions.functions-u-SzJe41.mjs")
  },
  "de7b499e119d14314a77e83ab4dff63e0a0e9225a8d694d74d6f30a50094f526": {
    functionName: "toggleEmailTemplate_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "de8a02d50774582b4c08f65e0206f58913670b8d18ea311db23be0e45639c1cb": {
    functionName: "getArticleBySlug_createServerFn_handler",
    importer: () => import("./seo-articles.functions-CCBA9r09.mjs")
  },
  "dea6d1d2415b665d7531510246840bd10d6c6698018c5474c0e390f6b3f82e6b": {
    functionName: "moveTicketsToFolder_createServerFn_handler",
    importer: () => import("./support-folders.functions-BJbt1Fjf.mjs")
  },
  "df1ae59a7f5f018a0d24113ba519afd977688e1adc326b5e857389147a0659b4": {
    functionName: "requestRefund_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "dfc8827427f508213ef859dcf3ff5322fbb0315ce988f62b9a4d225f8b5f00a4": {
    functionName: "listEmployeeSessionsAdmin_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "e1a2200e76ec3de9445b40eb5525e6673c81b4f21b5ef049052ae61f0b5ebf7b": {
    functionName: "recordInboundWebRtcCall_createServerFn_handler",
    importer: () => import("./callerdesk-webrtc.functions-DDQSUOKd.mjs")
  },
  "e2a65903eef495a17e983d66c62ae516501984bac0ddeca5e8694bb12a73f0a8": {
    functionName: "refundStats_createServerFn_handler",
    importer: () => import("./refunds-v2.functions-DubtYnlX.mjs")
  },
  "e32ba0e0b922ed15816a88dc599cbb4cb3ebd86f92c5c7497ba65be3f3abb840": {
    functionName: "logEmployeeLogout_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "e371ba470b5e8545bddb7a15efe6ed5c42577be071c1104ef102f9c38c302ac3": {
    functionName: "getMyPermissions_createServerFn_handler",
    importer: () => import("./permissions.functions-BpkahPzZ.mjs")
  },
  "e495dab944592aa1efe4387d4e97ff38d2fdf8e0d47eb8bbf4cff069674f7784": {
    functionName: "dispatchWorkflowEvent_createServerFn_handler",
    importer: () => import("./engine.functions-DIMuNurD.mjs")
  },
  "e49d6cccb59b6129f16ebe939760c546674b34fbbf8964e9dd65c5e54fff7348": {
    functionName: "listContactSubmissions_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "e4abd237eae812270bb0f90bfb594a9449f902721909a36ce3788bdc8802879c": {
    functionName: "upsertReason_createServerFn_handler",
    importer: () => import("./workflow-settings.functions-B5aYpJpa.mjs")
  },
  "e6075969b838a5a062b1bd5d84660f2c78ae83af2027797a7ebb21ed9ce4e66a": {
    functionName: "transitionLeadStatus_createServerFn_handler",
    importer: () => import("./lead-status.functions-D0K0Ccu1.mjs")
  },
  "e6ef5c4dabe8c6f5fea11a7ae1bc18460ce831300a1e241fea9b11d92196a99b": {
    functionName: "listStaff_createServerFn_handler",
    importer: () => import("./leads-admin.functions-BnzCsptj.mjs")
  },
  "e7b149fb264f74ca595143db653047e05a9f77ad4b35c7a7b4d2bd34b902dc35": {
    functionName: "getIvrDraft_createServerFn_handler",
    importer: () => import("./ivr.functions-CCGTlcL7.mjs")
  },
  "e814f27c2f587f64a006887db25e32b44faf994b1cb78c96e73fb0bdd5aadcd3": {
    functionName: "startProcessing_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "e82451722893ca5dfec67fd8c60d44dfa9517426a964d54353200dd9b1ac0b81": {
    functionName: "listEmployeeAssignedOrders_createServerFn_handler",
    importer: () => import("./orders-v2.functions-DsCJyIlv.mjs")
  },
  "e8e3212186e8b01b6252003eaebe4fd50796a9196fabeaa2834128b023c9610b": {
    functionName: "getSidebarNotificationCounts_createServerFn_handler",
    importer: () => import("./notifications.functions-DnfGbPYy.mjs")
  },
  "e92d13874486b286a8efa9ced8a7abd62df39c3b65b52b66a0d8222452fbfd81": {
    functionName: "listCopyableForms_createServerFn_handler",
    importer: () => import("./form-builder.functions-BEo4pos6.mjs")
  },
  "e9f1f0226d382bcdece75b519f9c4aafc4924c4b13cb57e55922ef46603e5abc": {
    functionName: "listReasons_createServerFn_handler",
    importer: () => import("./workflow-settings.functions-B5aYpJpa.mjs")
  },
  "ea2f93c736af85d566e73fa4b23b31e07fdb401502dde24f002eedc266ff73fa": {
    functionName: "sendTestTemplateEmail_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "ea362e5d4ecad5f10c7442bec5a9cfb3a003b07e978efa45b1f7a96f1710e728": {
    functionName: "saveFormSchema_createServerFn_handler",
    importer: () => import("./service-forms.functions-BAWUc1dj.mjs")
  },
  "ea7b702784f8a007035b0947a01600d6612395f09c47cda1dcce982fe7db0f04": {
    functionName: "deleteTrainingMaterial_createServerFn_handler",
    importer: () => import("./training.functions-BooxTkZp.mjs")
  },
  "ead327ebc9c4fbefa84dd85284c0d83b8884e6feeb42e1fba252c8eb6911259e": {
    functionName: "listAllSeoPages_createServerFn_handler",
    importer: () => import("./seo-pages.functions-COwus60w.mjs")
  },
  "eb088c0811f59cb537b36938bdfe15b96f4d0b1786172c6df167dd012b85d8fe": {
    functionName: "searchLeadsForComplaint_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "ebc56e3a532d1959880185d3b8fd4c1b349fe938464d21691bfd8f00c5369904": {
    functionName: "saveBuilderSchema_createServerFn_handler",
    importer: () => import("./form-builder.functions-BEo4pos6.mjs")
  },
  "ec2a2915f1335882f896f05269d03c351f59b66ffacffe24530c11a59fe03058": {
    functionName: "getOrderCallbackHistoryCount_createServerFn_handler",
    importer: () => import("./callback-reminder.functions-C-8RSOAj.mjs")
  },
  "ecb86802e09595b5aa50024a9e3ed97280264586e2c3837ecb65e39ac564dec8": {
    functionName: "listInvoiceEvents_createServerFn_handler",
    importer: () => import("./invoices.functions-BpwWo8QA.mjs")
  },
  "edde8b335979e78bb77341824d287de67497b8db1b0f5f5033eb06506eb51698": {
    functionName: "getOrderCallbackHistory_createServerFn_handler",
    importer: () => import("./callback-reminder.functions-C-8RSOAj.mjs")
  },
  "ee0b99f0cd6aee6c8acafd75e2f0b846e20b65ffe89565fae23a4c00b4e0a2ad": {
    functionName: "listComplaints_createServerFn_handler",
    importer: () => import("./complaints.functions-CaNEzCnf.mjs")
  },
  "ee90d54753a68e9dab9aec7563aaa41c56a07b11ddee544ba0d078cf03647f3b": {
    functionName: "addRefundNote_createServerFn_handler",
    importer: () => import("./order-actions.functions-Bz7gqW30.mjs")
  },
  "ef1afa92e37d48b452fc3de4565b242ec0d19a9206ae450472845b4805100d64": {
    functionName: "markAwaitingGovt_createServerFn_handler",
    importer: () => import("./hold-actions.functions-u-SzJe41.mjs")
  },
  "ef90c0d98ae5021a2d754723d4e659399a98111b6c64fb68eef52eea8b368cb1": {
    functionName: "getDisputeEvidenceSignedUrl_createServerFn_handler",
    importer: () => import("./dispute-manager.functions-BWvTPtwi.mjs")
  },
  "f03b9babc606ef26fece41a7b5546a811f8ab9c7ff5eefc7239acb029b9a24f9": {
    functionName: "getTrainingMaterial_createServerFn_handler",
    importer: () => import("./training.functions-BooxTkZp.mjs")
  },
  "f0b8bb7969191da953cca0c54fd3d7059ede7bd771b7663867bb3c46f168afd3": {
    functionName: "getSubmission_createServerFn_handler",
    importer: () => import("./submissions-admin.functions-Bo0pIwAC.mjs")
  },
  "f0dbedb5ec593c70f8c791dc2d475f702ed7a73c86c64fe807681bf6377e6d84": {
    functionName: "bulkResetUserPermissions_createServerFn_handler",
    importer: () => import("./permissions-admin.functions-Ch7-uAAa.mjs")
  },
  "f0e7d80f063c91dc5897e4c06084e2a959baadc70f5e772b1e16d17f27df34bb": {
    functionName: "getWorkflowDashboard_createServerFn_handler",
    importer: () => import("./dashboard.functions-B-Qkmw1f.mjs")
  },
  "f238b499d9b67901c07679f4b77a6fab3088b18854776eb76b1205e72407e1df": {
    functionName: "getEmployeeSecurityDetailAdmin_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "f2c6767e9b0e44f145664eb145a7b3ca9e79901e5b7aee61df42c4a79789eb19": {
    functionName: "getUnreadNotificationCount_createServerFn_handler",
    importer: () => import("./notifications.functions-DnfGbPYy.mjs")
  },
  "f2d2eb1a7cb2aa66e8afaefccd6dc38f0e92285810d24be34d15d9b64a767868": {
    functionName: "submitOnboarding_createServerFn_handler",
    importer: () => import("./onboarding.functions-Cb4Pg19J.mjs")
  },
  "f2f5e038f089c2c510dc71bf53e1e25230f9cd21c9e7be4a184270b8da41b289": {
    functionName: "listSanitySeoSlugs_createServerFn_handler",
    importer: () => import("./client.functions-nIksBFX7.mjs")
  },
  "f426295b42c2bf51fdda901383002069a52b92aad539fb6bafccf4753f990f43": {
    functionName: "getActiveOrderCallback_createServerFn_handler",
    importer: () => import("./callback-reminder.functions-C-8RSOAj.mjs")
  },
  "f44d566350427ee1369a974c32a3d66e3de1be5fb11479cde11092b1faa428fa": {
    functionName: "getEmployeeWorkAccess_createServerFn_handler",
    importer: () => import("./users-admin.functions-DZ_zr_-w.mjs")
  },
  "f4ecd300564fbbcf870139dd7ad6854828be6d370f5c200c552c0ae77248d813": {
    functionName: "resetConsultationSelection_createServerFn_handler",
    importer: () => import("./talk-to-expert.functions-r9RoBVuH.mjs")
  },
  "f4fa710c0f6297d160ab7ea1d5dfe3689f438deaf1de913464b2119e22aa4f14": {
    functionName: "getBuilderSchemaVersion_createServerFn_handler",
    importer: () => import("./form-builder.functions-BEo4pos6.mjs")
  },
  "f52e1267030f91f5a09e1f66ae38caf9bdd9a6e4210d17cc03b77e191b4da030": {
    functionName: "autoDistributeSelectedOrders_createServerFn_handler",
    importer: () => import("./assignment-history.functions-DRwXENAl.mjs")
  },
  "f654f70eb23067e21a19e470fa33b8c580e53aa9dfda6c57455582801bbde8d6": {
    functionName: "terminateEmployeeSession_createServerFn_handler",
    importer: () => import("./employee-presence.functions-CIJ1TtsD.mjs")
  },
  "f77ca8591a43e62b5a1411d9c32b2c9ec2e6fc1360924690709f6e7dec4ed4a8": {
    functionName: "addToPool_createServerFn_handler",
    importer: () => import("./assignment.functions-BGPC7-uK.mjs")
  },
  "f7fa7f855667dfa7d272f6e9d06ac465d5fa5d25b291788a3de36d3953d5e0cd": {
    functionName: "markConsultationCompleted_createServerFn_handler",
    importer: () => import("./consultation.functions-BHGxCivB.mjs")
  },
  "f89ae9f1db3c5ef0f51b2c9e0578f8de83470985d7547a7ab3a2818f75ce9621": {
    functionName: "getOrderAssignmentHistory_createServerFn_handler",
    importer: () => import("./assignment-history.functions-DRwXENAl.mjs")
  },
  "f9335ee0512e2040f1278ffbfbca707cf7f62c095040043ebf802308a0d21d58": {
    functionName: "getDashboardCharts_createServerFn_handler",
    importer: () => import("./super-admin.functions-hGqZ75Mr.mjs")
  },
  "f9d64b08169c88bf9ca05ad4ba42b28b6a227b88397b46078fa21a208c86a31b": {
    functionName: "toggleTicketStar_createServerFn_handler",
    importer: () => import("./support-folders.functions-BJbt1Fjf.mjs")
  },
  "fb4a0b8d71dcf2c85d64454ce89c6338feaca0ce0e6dc5af787d571444e3c27e": {
    functionName: "getMySessionInfo_createServerFn_handler",
    importer: () => import("./employee-sessions.functions-B0Ac1IcF.mjs")
  },
  "fca32a96b48069d020f83144113a38487b271af9a04ccc4bc08ec77924394c18": {
    functionName: "listAllDocuments_createServerFn_handler",
    importer: () => import("./documents-admin.functions-B3fcnIYW.mjs")
  },
  "fceb9da64309818a1d212ce197388584695884910b65324c14ea2f9d8918003b": {
    functionName: "approveDocument_createServerFn_handler",
    importer: () => import("./document-review.functions-CqZ_T4Al.mjs")
  },
  "fd7232795931abda353df2e9e8928705e11050e83048cfd6e07390ead56ac454": {
    functionName: "setEmailTemplateDispatchMode_createServerFn_handler",
    importer: () => import("./emails.functions-n6A0vMf0.mjs")
  },
  "fd963bea4cc60c9f99bb62927d1ff7e65a6f2659027181393ebed6da00cb1db5": {
    functionName: "listPublicSeoPages_createServerFn_handler",
    importer: () => import("./seo-pages.functions-COwus60w.mjs")
  },
  "fdd3883e9759e666d09c7eb23a1c3a7f7093102c8bbd05cc15ab961af17da738": {
    functionName: "searchNicCodes_createServerFn_handler",
    importer: () => import("./nic.functions-BE2MSjSd.mjs")
  },
  "fe7953f392b66ecd37c4ffb1340a423e171201938de5cea5dfecccc2c236cf5d": {
    functionName: "listWorkflowEvents_createServerFn_handler",
    importer: () => import("./workflow.functions-BO-RhjxS.mjs")
  },
  "fecb9b24901ff281edebf8340bde67064997a73b8b8411e126686ab2336d8677": {
    functionName: "getLeadTimeline_createServerFn_handler",
    importer: () => import("./lead-timeline.functions-CIWvAT_q.mjs")
  },
  "ff3f815eb40dc4cf12a0087b8034090c17d4ad68f387fbde80aeb24cbf8e22a2": {
    functionName: "createFollowUp_createServerFn_handler",
    importer: () => import("./follow-ups.functions-B__Q1PL2.mjs")
  }
};
async function getServerFnById(id, access) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
  if (!fnModule) {
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    throw new Error("Server function module export not resolved for serverFn ID: " + id);
  }
  return action;
}
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
var FRAME_TYPE_JSON = 0;
var FRAME_TYPE_CHUNK = 1;
var FRAME_TYPE_END = 2;
var FRAME_TYPE_ERROR = 3;
var FRAME_HEADER_SIZE = 9;
var MAX_FRAME_PAYLOAD_SIZE = 16 * 1024 * 1024;
var MAX_FRAMED_STREAMS = 1024;
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
var GLOBAL_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return context;
}
var getStartOptions = () => getStartContext().startOptions;
function getSerovalPlugins(routerPlugins) {
  return [...getStartOptions()?.serializationAdapters?.map(makeSerovalPlugin) ?? [], ...routerPlugins];
}
var textEncoder$1 = new TextEncoder();
var EMPTY_PAYLOAD = new Uint8Array(0);
var MAX_ERROR_MESSAGE_CODE_UNITS = 4096;
function encodeFrame(type, streamId, payload) {
  if (payload.byteLength > MAX_FRAME_PAYLOAD_SIZE) throw new RangeError(`Frame payload exceeds ${MAX_FRAME_PAYLOAD_SIZE} bytes`);
  const frame = new Uint8Array(FRAME_HEADER_SIZE + payload.length);
  frame[0] = type;
  frame[1] = streamId >>> 24 & 255;
  frame[2] = streamId >>> 16 & 255;
  frame[3] = streamId >>> 8 & 255;
  frame[4] = streamId & 255;
  frame[5] = payload.length >>> 24 & 255;
  frame[6] = payload.length >>> 16 & 255;
  frame[7] = payload.length >>> 8 & 255;
  frame[8] = payload.length & 255;
  frame.set(payload, FRAME_HEADER_SIZE);
  return frame;
}
function encodeErrorPayload(error) {
  const originalMessage = error instanceof Error ? error.message : String(error ?? "Unknown error");
  const message = originalMessage.length > MAX_ERROR_MESSAGE_CODE_UNITS ? `${originalMessage.slice(0, MAX_ERROR_MESSAGE_CODE_UNITS)}…` : originalMessage;
  return textEncoder$1.encode(message);
}
function createMultiplexedStream(recordStream, options = {}) {
  let controller;
  let stopped = false;
  let activePumps = 0;
  let wakeDemand;
  let admission;
  const readers = /* @__PURE__ */ new Set();
  const pendingRawStreams = /* @__PURE__ */ new Set();
  const abortOutput = () => errorOutput(options.signal?.reason);
  const wakeAdmission = () => {
    const wake = wakeDemand;
    wakeDemand = void 0;
    wake?.();
  };
  const cancelReader = (reader, reason) => {
    reader.cancel(reason).catch(() => {
    });
  };
  const cancelStream = (stream, reason) => {
    stream.cancel(reason).catch(() => {
    });
  };
  const stop = (reason) => {
    if (stopped) return false;
    stopped = [reason];
    options.signal?.removeEventListener("abort", abortOutput);
    wakeAdmission();
    for (const reader of readers) cancelReader(reader, reason);
    for (const stream of pendingRawStreams) cancelStream(stream, reason);
    pendingRawStreams.clear();
    return true;
  };
  const errorOutput = (error) => {
    if (!stop(error)) return;
    try {
      controller.error(error);
    } catch {
    }
  };
  const waitForDemand = async () => {
    while (!stopped && (controller.desiredSize ?? 0) <= 0) await new Promise((resolve) => {
      wakeDemand = resolve;
    });
    return !stopped;
  };
  const admitFrame = (type, streamId, payload) => {
    if (stopped) return false;
    if (!admission && (controller.desiredSize ?? 0) > 0) {
      controller.enqueue(encodeFrame(type, streamId, payload));
      return true;
    }
    const runAdmission = async () => {
      if (!await waitForDemand()) return false;
      controller.enqueue(encodeFrame(type, streamId, payload));
      return true;
    };
    const result = admission ? admission.then(runAdmission) : runAdmission();
    const clearAdmission = () => {
      if (admission === tail) admission = void 0;
    };
    const tail = result.then(clearAdmission, clearAdmission);
    admission = tail;
    return result;
  };
  const maybeClose = () => {
    if (activePumps !== 0 || !stop()) return;
    try {
      controller.close();
    } catch {
    }
  };
  const startPump = (pump) => {
    activePumps++;
    pump().then(() => {
      activePumps--;
      maybeClose();
    }, (error) => {
      activePumps--;
      errorOutput(error);
    });
  };
  async function pumpRawStream(streamId, stream) {
    const reader = stream.getReader();
    readers.add(reader);
    try {
      while (!stopped) {
        const { done, value } = await reader.read();
        if (stopped) return;
        if (done) {
          const frameAdmission = admitFrame(FRAME_TYPE_END, streamId, EMPTY_PAYLOAD);
          if (frameAdmission !== true) await frameAdmission;
          return;
        }
        if (!(value instanceof Uint8Array)) throw new TypeError("RawStream chunks must be Uint8Array");
        let offset = 0;
        do {
          const frameAdmission = admitFrame(FRAME_TYPE_CHUNK, streamId, value.byteLength <= MAX_FRAME_PAYLOAD_SIZE ? value : value.subarray(offset, offset + MAX_FRAME_PAYLOAD_SIZE));
          if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
          offset += MAX_FRAME_PAYLOAD_SIZE;
        } while (offset < value.byteLength);
      }
    } catch (error) {
      if (!stopped) {
        const frameAdmission = admitFrame(FRAME_TYPE_ERROR, streamId, encodeErrorPayload(error));
        if (frameAdmission !== true) await frameAdmission;
      }
    } finally {
      readers.delete(reader);
      reader.releaseLock();
    }
  }
  async function pumpRecords() {
    const reader = recordStream.getReader();
    readers.add(reader);
    try {
      while (!stopped) {
        const { done, value } = await reader.read();
        if (stopped) {
          if (!done) for (const registration of value.rawStreams) cancelStream(registration.stream, stopped[0]);
          return;
        }
        if (done) return;
        for (const registration of value.rawStreams) pendingRawStreams.add(registration.stream);
        const frameAdmission = admitFrame(FRAME_TYPE_JSON, 0, value.json);
        if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
        for (const registration of value.rawStreams) {
          pendingRawStreams.delete(registration.stream);
          startPump(pumpRawStream.bind(void 0, registration.id, registration.stream));
        }
      }
    } catch (error) {
      if (!stopped) errorOutput(error);
    } finally {
      readers.delete(reader);
      reader.releaseLock();
    }
  }
  return new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      if (options.signal?.aborted) {
        cancelStream(recordStream, options.signal.reason);
        errorOutput(options.signal.reason);
        return;
      }
      options.signal?.addEventListener("abort", abortOutput, { once: true });
      startPump(pumpRecords);
    },
    pull() {
      wakeAdmission();
    },
    cancel(reason) {
      if (stop(reason)) options.onCancel?.(reason);
    }
  });
}
function isSafeKey(key) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function safeObjectMerge(target, source) {
  const result = /* @__PURE__ */ Object.create(null);
  if (target) {
    for (const key of Object.keys(target)) if (isSafeKey(key)) result[key] = target[key];
  }
  if (source && typeof source === "object") {
    for (const key of Object.keys(source)) if (isSafeKey(key)) result[key] = source[key];
  }
  return result;
}
function createNullProtoObject(source) {
  if (!source) return /* @__PURE__ */ Object.create(null);
  const obj = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(source)) if (isSafeKey(key)) obj[key] = source[key];
  return obj;
}
var getStartContextServerOnly = getStartContext;
var createServerFn = (options, __opts) => {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
  const setValidator = (validator) => {
    return createServerFn(void 0, {
      ...resolvedOptions,
      validator,
      inputValidator: validator
    });
  };
  const res = {
    options: resolvedOptions,
    middleware: (middleware) => {
      const newMiddleware = [...resolvedOptions.middleware || []];
      middleware.forEach((item) => {
        if (TSS_SERVER_FUNCTION_FACTORY in item) {
          if (item.options.middleware) newMiddleware.push(...item.options.middleware);
        } else newMiddleware.push(item);
      });
      const res2 = createServerFn(void 0, {
        ...resolvedOptions,
        middleware: newMiddleware
      });
      res2[TSS_SERVER_FUNCTION_FACTORY] = true;
      return res2;
    },
    validator: setValidator,
    inputValidator: setValidator,
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      const newOptions = {
        ...resolvedOptions,
        extractedFn,
        serverFn
      };
      const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
      extractedFn.method = resolvedOptions.method;
      return Object.assign(async (opts) => {
        const result = await executeMiddleware$1(resolvedMiddleware, "client", {
          ...extractedFn,
          ...newOptions,
          data: opts?.data,
          headers: opts?.headers,
          signal: opts?.signal,
          fetch: opts?.fetch,
          context: createNullProtoObject()
        });
        const redirect = parseRedirect(result.error);
        if (redirect) throw redirect;
        if (result.error) throw result.error;
        return result.result;
      }, {
        ...extractedFn,
        method: resolvedOptions.method,
        __executeServer: async (opts) => {
          const startContext = getStartContextServerOnly();
          const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
          return await executeMiddleware$1(resolvedMiddleware, "server", {
            ...extractedFn,
            data: opts.data,
            method: opts.method ?? resolvedOptions.method,
            serverFnMeta: extractedFn.serverFnMeta,
            context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
            request: startContext.request
          }).then((d) => ({
            result: d.result,
            error: d.error,
            context: d.sendContext
          }));
        }
      });
    }
  };
  const fun = (options2) => {
    return createServerFn(void 0, {
      ...resolvedOptions,
      ...options2
    });
  };
  return Object.assign(fun, res);
};
async function executeMiddleware$1(middlewares, env, opts) {
  let flattenedMiddlewares = flattenMiddlewares([...getStartOptions()?.functionMiddleware || [], ...middlewares]);
  if (env === "server") {
    const startContext = getStartContextServerOnly({ throwIfNotFound: false });
    if (startContext?.executedRequestMiddlewares) flattenedMiddlewares = flattenedMiddlewares.filter((m) => !startContext.executedRequestMiddlewares.has(m));
  }
  const callNextMiddleware = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) return ctx;
    try {
      let validator = "validator" in nextMiddleware.options ? nextMiddleware.options.validator : void 0;
      if (!validator && "inputValidator" in nextMiddleware.options) validator = nextMiddleware.options.inputValidator;
      if (validator && env === "server") ctx.data = await execValidator(validator, ctx.data);
      let middlewareFn = void 0;
      if (env === "client") {
        if ("client" in nextMiddleware.options) middlewareFn = nextMiddleware.options.client;
      } else if ("server" in nextMiddleware.options) middlewareFn = nextMiddleware.options.server;
      if (middlewareFn) {
        const userNext = async (userCtx = {}) => {
          const result2 = await callNextMiddleware({
            ...ctx,
            ...userCtx,
            context: safeObjectMerge(ctx.context, userCtx.context),
            sendContext: safeObjectMerge(ctx.sendContext, userCtx.sendContext),
            headers: mergeHeaders(ctx.headers, userCtx.headers),
            _callSiteFetch: ctx._callSiteFetch,
            fetch: ctx._callSiteFetch ?? userCtx.fetch ?? ctx.fetch,
            result: userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : ctx.result,
            error: userCtx.error ?? ctx.error
          });
          if (result2.error) throw result2.error;
          return result2;
        };
        const result = await middlewareFn({
          ...ctx,
          next: userNext
        });
        if (isRedirect(result)) return {
          ...ctx,
          error: result
        };
        if (result instanceof Response) return {
          ...ctx,
          result
        };
        if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
        return result;
      }
      return callNextMiddleware(ctx);
    } catch (error) {
      return {
        ...ctx,
        error
      };
    }
  };
  return callNextMiddleware({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || createNullProtoObject(),
    _callSiteFetch: opts.fetch
  });
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware, depth) => {
    if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
    middleware.forEach((m) => {
      if (m.options.middleware) recurse(m.options.middleware, depth + 1);
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares, 0);
  return flattened;
}
async function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = await validator["~standard"].validate(input);
    if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) return validator.parse(input);
  if (typeof validator === "function") return validator(input);
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    "~types": void 0,
    options: {
      inputValidator: options.validator ?? options.inputValidator,
      client: async ({ next, sendContext, fetch: fetch2, ...ctx }) => {
        const payload = {
          ...ctx,
          context: sendContext,
          fetch: fetch2
        };
        return next(await options.extractedFn?.(payload));
      },
      server: async ({ next, ...ctx }) => {
        const result = await options.serverFn?.(ctx);
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
var createMiddleware = (options, __opts) => {
  const resolvedOptions = {
    type: "request",
    ...__opts || options
  };
  const setValidator = (validator) => {
    return createMiddleware({}, Object.assign(resolvedOptions, {
      validator,
      inputValidator: validator
    }));
  };
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
    },
    validator: setValidator,
    inputValidator: setValidator,
    client: (client) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { client }));
    },
    server: (server2) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { server: server2 }));
    }
  };
};
var innerCreateCsrfMiddleware = (opts = {}) => {
  const middleware = createMiddleware().server(async (ctx) => {
    const csrfCtx = ctx;
    if (opts.filter && !await opts.filter(csrfCtx)) return ctx.next();
    if (await isCsrfRequestAllowed(opts, csrfCtx)) return ctx.next();
    return getFailureResponse(opts, csrfCtx);
  });
  return middleware;
};
var createCsrfMiddleware = innerCreateCsrfMiddleware;
async function isCsrfRequestAllowed(opts, ctx) {
  const result = await getCsrfRequestValidationResult(opts, ctx);
  return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
async function getCsrfRequestValidationResult(opts, ctx) {
  const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
  if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
  const origin = ctx.request.headers.get("Origin");
  if (origin !== null) {
    if (opts.origin) return matchValue(opts.origin, origin, ctx);
    return origin === new URL(ctx.request.url).origin;
  }
  const referer = ctx.request.headers.get("Referer");
  if (referer === null || opts.referer === false) return;
  if (typeof opts.referer === "function") return opts.referer(referer, ctx);
  if (opts.origin) {
    const refererOrigin = getOriginFromUrl(referer);
    return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
  }
  return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
async function matchValue(matcher, value, ctx) {
  if (typeof matcher === "function") return matcher(value, ctx);
  if (Array.isArray(matcher)) return matcher.includes(value);
  return value === matcher;
}
function getOriginFromUrl(url) {
  try {
    return new URL(url).origin;
  } catch {
    return;
  }
}
function isRefererSameOrigin(referer, requestOrigin) {
  if (referer === requestOrigin) return true;
  if (!referer.startsWith(requestOrigin)) return false;
  if (referer.length === requestOrigin.length) return true;
  const code = referer.charCodeAt(requestOrigin.length);
  return code === 47 || code === 63 || code === 35;
}
async function getFailureResponse(opts, ctx) {
  if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
  return opts.failureResponse?.clone() ?? new Response("Forbidden", {
    status: 403
  });
}
var serovalPlugins = void 0;
var FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
var MAX_PAYLOAD_SIZE = 1e6;
var MAX_PENDING_SERIALIZATION_RECORDS = 1024;
var MAX_PENDING_SERIALIZATION_BYTES = 32 * 1024 * 1024;
var textEncoder = new TextEncoder();
function encodeSerializationRecord(value) {
  return textEncoder.encode(JSON.stringify(value));
}
function exceedsPendingSerializationLimit(record, recordCount, pendingBytes) {
  return recordCount >= MAX_PENDING_SERIALIZATION_RECORDS || pendingBytes + record.byteLength > MAX_PENDING_SERIALIZATION_BYTES;
}
function runSerializationCleanup(dispose) {
  try {
    dispose();
  } catch {
  }
}
function cancelRawStream(stream, reason) {
  stream.cancel(reason).catch(() => {
  });
}
var handleServerAction = async ({ request, context, serverFnId }) => {
  const methodUpper = request.method.toUpperCase();
  const url = new URL(request.url);
  const action = await getServerFnById(serverFnId);
  if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
    status: 405,
    headers: { Allow: action.method }
  });
  const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
  serovalPlugins ??= getSerovalPlugins(defaultSerovalDeserializerPlugins);
  const contentType = request.headers.get("Content-Type");
  try {
    let res;
    if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
      if (methodUpper === "GET") {
        if (false) ;
        invariant();
      }
      const formData = await request.formData();
      const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
      formData.delete(TSS_FORMDATA_CONTEXT);
      const params = {
        context,
        data: formData,
        method: methodUpper
      };
      if (typeof serializedContext === "string") try {
        const deserializedContext = fromJSON(JSON.parse(serializedContext), { plugins: serovalPlugins });
        if (typeof deserializedContext === "object" && deserializedContext) params.context = safeObjectMerge(deserializedContext, context);
      } catch (e) {
        if (false) ;
      }
      res = await action(params);
    } else if (methodUpper === "GET") {
      const payloadParam = url.searchParams.get("payload");
      if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
      const payload = payloadParam ? fromJSON(JSON.parse(payloadParam), { plugins: serovalPlugins }) : void 0;
      res = await action({
        data: payload?.data,
        context: safeObjectMerge(payload?.context, context),
        method: methodUpper
      });
    } else {
      const payload = contentType?.includes("application/json") ? fromJSON(await request.json(), { plugins: serovalPlugins }) : void 0;
      res = await action({
        data: payload?.data,
        context: safeObjectMerge(payload?.context, context),
        method: methodUpper
      });
    }
    const unwrapped = res.error !== void 0 ? res.error : res.result;
    if (isNotFound(res)) res = isNotFoundResponse(res);
    if (!isServerFn && (unwrapped instanceof Response || unwrapped === null || typeof unwrapped !== "object")) return unwrapped;
    if (unwrapped instanceof Response) {
      if (isRedirect(unwrapped)) return unwrapped;
      unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
      return unwrapped;
    }
    return serializeResult(res, request.signal, serovalPlugins);
  } catch (error) {
    if (error instanceof Response) return error;
    if (isNotFound(error)) return isNotFoundResponse(error);
    console.error("Server Fn Error!", error);
    const serializedError = JSON.stringify(await toCrossJSONAsync(error, {
      refs: /* @__PURE__ */ new Map(),
      plugins: serovalPlugins
    }));
    const response = getResponse();
    const headers = {
      "Content-Type": "application/json",
      [X_TSS_SERIALIZED]: "true"
    };
    try {
      return new Response(serializedError, {
        status: response.status ?? 500,
        statusText: response.statusText,
        headers
      });
    } catch {
      return new Response(serializedError, {
        status: 500,
        statusText: "",
        headers
      });
    }
  }
};
function serializeResult(res, signal, plugins) {
  const alsResponse = getResponse();
  const initialRecords = [];
  let initialBytes = 0;
  const pendingRawStreams = [];
  let done = false;
  let initialParsed = false;
  let serializationFailure;
  let disposeSerialization;
  let onParse = (value, initial) => {
    if (serializationFailure) return;
    initialParsed ||= initial;
    const record = encodeSerializationRecord(value);
    if (exceedsPendingSerializationLimit(record, initialRecords.length, initialBytes)) {
      serializationFailure = [/* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit")];
      return;
    }
    initialRecords.push(record);
    initialBytes += record.byteLength;
  };
  let onDone = () => {
    if (initialParsed) done = true;
  };
  let onError = (error) => {
    serializationFailure ??= [error];
  };
  const rawStreamPlugin = createRawStreamRPCPlugin((id, stream) => {
    if (serializationFailure) {
      cancelRawStream(stream, serializationFailure[0]);
      return;
    }
    if (id > MAX_FRAMED_STREAMS) {
      const error = /* @__PURE__ */ new Error(`Too many raw streams in framed response (max ${MAX_FRAMED_STREAMS})`);
      cancelRawStream(stream, error);
      onError(error);
      return;
    }
    pendingRawStreams.push({
      id,
      stream
    });
  });
  const dispose = toCrossJSONStream(res, {
    refs: /* @__PURE__ */ new Map(),
    plugins: [rawStreamPlugin, ...plugins],
    onParse(value, initial) {
      onParse(value, initial);
    },
    onDone() {
      onDone();
    },
    onError: (error) => {
      onError(error);
    }
  });
  if (serializationFailure) {
    runSerializationCleanup(dispose);
    for (const registration of pendingRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
    throw serializationFailure[0];
  }
  if (!done) disposeSerialization = dispose;
  if (done && pendingRawStreams.length === 0 && initialRecords.length === 1) return new Response(initialRecords[0], {
    status: alsResponse.status,
    statusText: alsResponse.statusText,
    headers: {
      "Content-Type": "application/json",
      [X_TSS_SERIALIZED]: "true"
    }
  });
  if (done && initialRecords.length === 1) {
    const json = initialRecords[0];
    if (json.byteLength > MAX_FRAME_PAYLOAD_SIZE) {
      const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
      for (const registration of pendingRawStreams) cancelRawStream(registration.stream, error);
      throw error;
    }
    const rawStreams = pendingRawStreams.splice(0);
    initialRecords.length = 0;
    return createFramedResponse(new ReadableStream({
      start(controller) {
        controller.enqueue({
          json,
          rawStreams
        });
        controller.close();
      },
      cancel(reason) {
        for (const registration of rawStreams) cancelRawStream(registration.stream, reason);
      }
    }), { signal });
  }
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const recordAbortController = new AbortController();
  let pendingBytes = 0;
  const pendingRecords = /* @__PURE__ */ new Set();
  const abortRecordStream = (error) => {
    if (serializationFailure) return;
    serializationFailure = [error];
    const disposeCurrentSerialization = disposeSerialization;
    disposeSerialization = void 0;
    for (const registration of pendingRawStreams.splice(0)) cancelRawStream(registration.stream, error);
    for (const record of pendingRecords) for (const registration of record.rawStreams) cancelRawStream(registration.stream, error);
    pendingRecords.clear();
    recordAbortController.abort(error);
    writer.abort(error).catch(() => {
    });
    if (disposeCurrentSerialization) runSerializationCleanup(disposeCurrentSerialization);
  };
  const writeRecord = (json, rawStreams) => {
    if (serializationFailure) {
      for (const registration of rawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
      return false;
    }
    if (json.byteLength > MAX_FRAME_PAYLOAD_SIZE || exceedsPendingSerializationLimit(json, pendingRecords.size, pendingBytes)) {
      const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
      for (const registration of rawStreams) cancelRawStream(registration.stream, error);
      onError(error);
      return false;
    }
    pendingBytes += json.byteLength;
    const record = {
      json,
      rawStreams
    };
    pendingRecords.add(record);
    writer.write(record).then(() => {
      pendingRecords.delete(record);
      pendingBytes -= json.byteLength;
    }, (error) => {
      const stillOwned = pendingRecords.delete(record);
      pendingBytes -= json.byteLength;
      if (stillOwned) for (const registration of rawStreams) cancelRawStream(registration.stream, error);
    });
    return true;
  };
  onParse = (value) => {
    if (serializationFailure) return;
    writeRecord(encodeSerializationRecord(value), pendingRawStreams.splice(0));
  };
  onDone = () => {
    if (serializationFailure) return;
    disposeSerialization = void 0;
    writer.close().catch(() => {
    });
  };
  onError = (error) => {
    abortRecordStream(error);
  };
  const initialRawStreams = pendingRawStreams.splice(0);
  for (let index = 0; index < initialRecords.length; index++) {
    const isLast = index === initialRecords.length - 1;
    if (!writeRecord(initialRecords[index], isLast ? initialRawStreams : [])) {
      if (!isLast) for (const registration of initialRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
      initialRecords.length = 0;
      throw serializationFailure[0];
    }
  }
  initialRecords.length = 0;
  if (done) onDone();
  writer.closed.catch((error) => {
    abortRecordStream(error);
  });
  return createFramedResponse(readable, {
    signal: AbortSignal.any([recordAbortController.signal, signal]),
    onCancel: abortRecordStream
  });
  function createFramedResponse(records, options) {
    const multiplexedStream = createMultiplexedStream(records, options);
    try {
      return new Response(multiplexedStream, {
        status: alsResponse.status,
        statusText: alsResponse.statusText,
        headers: {
          "Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
          [X_TSS_SERIALIZED]: "true"
        }
      });
    } catch (error) {
      cancelRawStream(multiplexedStream, error);
      throw error;
    }
  }
}
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  const response = new Response(JSON.stringify(rest), {
    status: 404,
    headers
  });
  response.headers.set("Content-Type", "application/json");
  return response;
}
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
  "fetch",
  "font",
  "image",
  "script",
  "style",
  "track"
]);
function buildLinkParam(name, value) {
  if (value === void 0) return name;
  if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
  return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
  const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
  if (hint.as) parts.push(buildLinkParam("as", hint.as));
  if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
  if (hint.type) parts.push(buildLinkParam("type", hint.type));
  if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
  if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
  if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
  return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
  const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
  return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
  const as = getStringAttr(attrs, "as");
  return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
  const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
  const type = getStringAttr(attrs, "type");
  const integrity = getStringAttr(attrs, "integrity");
  const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
  const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
  if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
  if (type) hint.type = type;
  if (integrity) hint.integrity = integrity;
  if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
  if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
  const href = getStringAttr(attrs, "href");
  const rel = getStringAttr(attrs, "rel");
  if (!href || !rel) return void 0;
  const relTokens = rel.split(/\s+/);
  let hintRel;
  let hintAs;
  if (relTokens.includes("modulepreload")) {
    hintRel = "modulepreload";
    hintAs = "script";
  } else if (relTokens.includes("stylesheet")) {
    hintRel = "preload";
    hintAs = "style";
  } else if (relTokens.includes("preload")) {
    hintAs = getPreloadAs(attrs);
    if (!hintAs) return void 0;
    hintRel = "preload";
  } else if (relTokens.includes("preconnect")) {
    hintRel = "preconnect";
    hintAs = void 0;
  } else if (relTokens.includes("dns-prefetch")) {
    hintRel = "dns-prefetch";
    hintAs = void 0;
  }
  if (!hintRel) return void 0;
  const hint = {
    href,
    rel: hintRel
  };
  if (hintAs) hint.as = hintAs;
  addEarlyHintFetchAttrs(hint, attrs);
  return hint;
}
function collectStaticHintsFromManifest(manifest2, matchedRoutes) {
  const hints = [];
  for (const route of matchedRoutes) {
    const routeManifest = manifest2.routes[route.id];
    if (!routeManifest) continue;
    for (const link of routeManifest.preloads ?? []) {
      const attrs = getScriptPreloadAttrs(manifest2, link);
      const hint = {
        href: attrs.href,
        rel: attrs.rel,
        as: "script"
      };
      if (attrs.crossOrigin !== void 0) hint.crossOrigin = attrs.crossOrigin;
      hints.push(hint);
    }
    for (const link of routeManifest.css ?? []) {
      const stylesheetHref = getStylesheetHref(link);
      if (manifest2.inlineCss?.styles[stylesheetHref] !== void 0) continue;
      const resolvedLink = resolveManifestCssLink(link);
      const hint = {
        href: stylesheetHref,
        rel: "preload",
        as: "style"
      };
      if (resolvedLink.crossOrigin !== void 0) hint.crossOrigin = resolvedLink.crossOrigin;
      hints.push(hint);
    }
  }
  return hints;
}
function collectDynamicHintsFromMatches(matches) {
  const hints = [];
  for (const match of matches) {
    const links = match.links;
    if (!Array.isArray(links)) continue;
    for (const link of links) {
      const hint = linkAttrsToEarlyHint(link);
      if (hint) hints.push(hint);
    }
  }
  return hints;
}
function createEarlyHintsEvent(opts) {
  const nextHints = [];
  const nextLinks = [];
  for (const hint of opts.hints) {
    const link = serializeEarlyHint(hint);
    if (opts.sentLinks.has(link)) continue;
    opts.sentLinks.add(link);
    opts.sentHints.push(hint);
    nextHints.push(hint);
    nextLinks.push(link);
  }
  if (!nextHints.length && opts.phase !== "dynamic") return void 0;
  return {
    phase: opts.phase,
    hints: nextHints,
    links: nextLinks,
    allHints: opts.sentHints.slice(),
    allLinks: Array.from(opts.sentLinks)
  };
}
function createResponseLinkHeaderEntries(opts) {
  for (const hint of opts.hints) {
    const link = serializeEarlyHint(hint);
    if (opts.sentLinks.has(link)) continue;
    opts.sentLinks.add(link);
    opts.entries.push({
      phase: opts.phase,
      hint,
      link
    });
  }
}
function getResponseLinkHeaderEntries(opts) {
  if (!opts.filter) return opts.entries.map((entry) => entry.link);
  try {
    const links = [];
    for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
    return links;
  } catch (err) {
    console.error("Error filtering response Link headers:", err);
    return [];
  }
}
function notifyEarlyHints(phase, event, onEarlyHints) {
  try {
    const result = onEarlyHints(event);
    if (result) Promise.resolve(result).catch((err) => {
      console.error(`Error sending ${phase} early hints:`, err);
    });
  } catch (err) {
    console.error(`Error sending ${phase} early hints:`, err);
  }
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
  if (typeof responseLinkHeader !== "object") return;
  return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
  for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
  for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
    phase: opts.phase,
    hint: opts.event.hints[index],
    link: opts.event.links[index]
  });
}
function collectEarlyHintsPhase(opts) {
  const event = opts.onEarlyHints ? createEarlyHintsEvent({
    phase: opts.phase,
    hints: opts.hints,
    sentLinks: opts.sentLinks,
    sentHints: opts.sentHints
  }) : void 0;
  if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
  if (!opts.responseLinkHeaderEntries) return;
  if (event) {
    collectResponseLinkHeaderEntries({
      phase: opts.phase,
      event,
      entries: opts.responseLinkHeaderEntries
    });
    return;
  }
  createResponseLinkHeaderEntries({
    phase: opts.phase,
    hints: opts.hints,
    sentLinks: opts.sentLinks,
    entries: opts.responseLinkHeaderEntries
  });
}
function createEarlyHintsCollector(opts) {
  if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
  const sentLinks = /* @__PURE__ */ new Set();
  const sentHints = opts.onEarlyHints ? new Array() : void 0;
  const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
  const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
  return {
    collectStatic: ({ manifest: manifest2, matchedRoutes }) => {
      if (!matchedRoutes?.length) return;
      collectEarlyHintsPhase({
        phase: "static",
        hints: collectStaticHintsFromManifest(manifest2, matchedRoutes),
        sentLinks,
        sentHints,
        onEarlyHints: opts.onEarlyHints,
        responseLinkHeaderEntries
      });
    },
    collectDynamic: (matches) => {
      collectEarlyHintsPhase({
        phase: "dynamic",
        hints: collectDynamicHintsFromMatches(matches),
        sentLinks,
        sentHints,
        onEarlyHints: opts.onEarlyHints,
        responseLinkHeaderEntries
      });
    },
    appendResponseHeaders: (headers) => {
      if (!responseLinkHeaderEntries?.length) return;
      appendResponseLinkHeaders({
        responseHeaders: headers,
        entries: responseLinkHeaderEntries,
        filter: responseLinkHeaderFilter
      });
    }
  };
}
function normalizeTransformAssetResult(result) {
  if (typeof result === "string") return { href: result };
  return result;
}
function escapeCssString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
  const { strings, urls } = options.template;
  if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
  let css = strings[0];
  for (let index = 0; index < urls.length; index++) {
    const transformed = normalizeTransformAssetResult(await options.transformFn({
      kind: "css-url",
      url: urls[index],
      stylesheetHref: options.stylesheetHref
    }));
    css += escapeCssString(transformed.href) + strings[index + 1];
  }
  return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
  const transformedStyles = {};
  const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
    const template = inlineCss.templates?.[stylesheetHref];
    return [stylesheetHref, template ? await transformInlineCssTemplate({
      stylesheetHref,
      template,
      transformFn
    }) : css];
  }));
  for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
  return {
    styles: transformedStyles,
    ...inlineCss.templates ? { templates: inlineCss.templates } : {}
  };
}
function resolveTransformAssetsCrossOrigin(config, kind) {
  if (!config) return void 0;
  if (typeof config === "string") return config;
  return config[kind];
}
function isObjectShorthand(transform) {
  return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
  if (typeof transform === "string") {
    const prefix = transform;
    return {
      type: "transform",
      transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
      cache: true
    };
  }
  if (typeof transform === "function") return {
    type: "transform",
    transformFn: transform,
    cache: true
  };
  if (isObjectShorthand(transform)) {
    const { prefix, crossOrigin } = transform;
    return {
      type: "transform",
      transformFn: ({ url, kind }) => {
        const href = `${prefix}${url}`;
        if (kind === "css-url") return { href };
        const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
        return co ? {
          href,
          crossOrigin: co
        } : { href };
      },
      cache: true
    };
  }
  if ("createTransform" in transform && transform.createTransform) return {
    type: "createTransform",
    createTransform: transform.createTransform,
    cache: transform.cache !== false
  };
  return {
    type: "transform",
    transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
    cache: transform.cache !== false
  };
}
function assignManifestLink(link, next) {
  if (typeof link === "string") return next.crossOrigin ? next : next.href;
  const nextLink = {
    ...link,
    href: next.href
  };
  if (next.crossOrigin) nextLink.crossOrigin = next.crossOrigin;
  else delete nextLink.crossOrigin;
  return nextLink;
}
async function transformManifestAssets(source, transformFn, _opts) {
  const manifest2 = structuredClone(source);
  const inlineCssEnabled = _opts?.inlineCss !== false;
  const scriptTransforms = /* @__PURE__ */ new Map();
  const transformScript = (url) => {
    const cached = scriptTransforms.get(url);
    if (cached) return cached;
    const transformed = Promise.resolve(transformFn({
      url,
      kind: "script"
    })).then(normalizeTransformAssetResult);
    scriptTransforms.set(url, transformed);
    return transformed;
  };
  if (!inlineCssEnabled) delete manifest2.inlineCss;
  else if (manifest2.inlineCss) manifest2.inlineCss = await transformInlineCssStyles(manifest2.inlineCss, transformFn);
  for (const route of Object.values(manifest2.routes)) {
    if (route.preloads?.length) route.preloads = await Promise.all(route.preloads.map(async (link) => {
      const result = await transformScript(resolveManifestAssetLink(link).href);
      return assignManifestLink(link, {
        href: result.href,
        crossOrigin: result.crossOrigin
      });
    }));
    if (route.css?.length && !manifest2.inlineCss) route.css = await Promise.all(route.css.map(async (link) => {
      const result = normalizeTransformAssetResult(await transformFn({
        url: resolveManifestCssLink(link).href,
        kind: "stylesheet"
      }));
      return assignManifestLink(link, {
        href: result.href,
        crossOrigin: result.crossOrigin
      });
    }));
    if (route.scripts?.length) for (const script of route.scripts) {
      const src = script.attrs?.src;
      if (typeof src !== "string") continue;
      const result = await transformScript(src);
      script.attrs = {
        ...script.attrs,
        src: result.href
      };
      if (result.crossOrigin) script.attrs.crossOrigin = result.crossOrigin;
      else delete script.attrs.crossOrigin;
    }
  }
  return manifest2;
}
function buildManifest(source, opts) {
  return {
    ...source.scriptFormat ? { scriptFormat: source.scriptFormat } : {},
    ...opts?.inlineCss !== false && source.inlineCss ? { inlineCss: structuredClone(source.inlineCss) } : {},
    routes: { ...source.routes }
  };
}
function getStaticHandlerInlineCssDefault(handlerInlineCss) {
  if (typeof handlerInlineCss === "function") return;
  return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
  if (opts.requestInlineCss !== void 0) return opts.requestInlineCss;
  if (typeof opts.handlerInlineCss === "function") return await opts.handlerInlineCss({ request: opts.request });
  return opts.handlerInlineCss ?? true;
}
function createCachedBaseManifestLoader(loadBaseManifest) {
  let baseManifestPromise;
  return () => {
    if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
      baseManifestPromise = void 0;
      throw error;
    });
    return baseManifestPromise;
  };
}
function createFinalManifestTransformResolver(transformAssets, opts) {
  const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
  const cache = transformConfig ? transformConfig.cache : true;
  const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
  let cachedCreateTransformPromise;
  const clearCachedCreateTransform = () => {
    cachedCreateTransformPromise = void 0;
  };
  return {
    cache,
    warmup,
    clearCachedCreateTransform,
    getTransformFn: async (ctx) => {
      if (!transformConfig) return void 0;
      if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
      if (!cache || false) return transformConfig.createTransform(ctx);
      if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
        clearCachedCreateTransform();
        throw error;
      });
      return cachedCreateTransformPromise;
    }
  };
}
function createFinalManifestResolver(opts) {
  const finalManifestCache = /* @__PURE__ */ new Map();
  const transformResolver = createFinalManifestTransformResolver(opts.transformAssets);
  const handlerDefaultInlineCss = getStaticHandlerInlineCssDefault(opts.inlineCss);
  const getRequestManifestOptions = async (requestOpts) => {
    const transformFn = await transformResolver.getTransformFn({
      warmup: false,
      request: requestOpts.request
    });
    const inlineCss = await resolveInlineCssForRequest({
      request: requestOpts.request,
      handlerInlineCss: opts.inlineCss,
      requestInlineCss: requestOpts.requestInlineCss
    });
    return {
      getBaseManifest: requestOpts.getBaseManifest,
      transformFn,
      cache: transformResolver.cache,
      inlineCss
    };
  };
  const resolveRequest = async (requestOpts, cache) => {
    return resolveFinalManifest({
      ...await getRequestManifestOptions(requestOpts),
      finalManifestCache: cache
    });
  };
  return {
    warmup: ({ getBaseManifest: getBaseManifest2 }) => warmupFinalManifest({
      enabled: transformResolver.warmup,
      handlerDefaultInlineCss,
      cache: transformResolver.cache,
      finalManifestCache,
      getBaseManifest: getBaseManifest2,
      getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
      onError: transformResolver.clearCachedCreateTransform
    }),
    resolveCached: (requestOpts) => resolveRequest(requestOpts, finalManifestCache),
    resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
  };
}
function getFinalManifestCacheKey(inlineCss) {
  return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, promise) {
  const cachedFinalManifestPromise = promise.catch((error) => {
    if (cachedFinalManifestPromises.get(cacheKey) === cachedFinalManifestPromise) cachedFinalManifestPromises.delete(cacheKey);
    throw error;
  });
  cachedFinalManifestPromises.set(cacheKey, cachedFinalManifestPromise);
  return cachedFinalManifestPromise;
}
function getOrCreateCachedFinalManifestPromise(cachedFinalManifestPromises, cacheKey, computeFinalManifest) {
  const cachedFinalManifestPromise = cachedFinalManifestPromises.get(cacheKey);
  if (cachedFinalManifestPromise) return cachedFinalManifestPromise;
  return cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
  return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifest(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
  const computeFinalManifest = async () => {
    return buildFinalManifest({
      base: await opts.getBaseManifest(),
      transformFn: opts.transformFn,
      inlineCss: opts.inlineCss
    });
  };
  if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
  return computeFinalManifest();
}
function warmupFinalManifest(opts) {
  if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
  const inlineCss = opts.handlerDefaultInlineCss;
  const warmupPromise = getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), async () => {
    const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
    return buildFinalManifest({
      base,
      transformFn,
      inlineCss
    });
  });
  if (opts.onError) warmupPromise.catch(opts.onError);
  return warmupPromise;
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
  key: "$TSS/serverfn",
  test: (v) => {
    if (typeof v !== "function") return false;
    if (!(TSS_SERVER_FUNCTION in v)) return false;
    return !!v[TSS_SERVER_FUNCTION];
  },
  toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
  fromSerializable: ({ functionId }) => {
    const fn = async (opts, signal) => {
      const serverFn = await getServerFnById(functionId);
      const result = await serverFn({
        data: opts?.data,
        context: opts?.context,
        method: serverFn.method ?? "GET"
      }, signal);
      if (result.error !== void 0) throw result.error;
      return result.result;
    };
    return fn;
  }
});
function getStartResponseHeaders(opts) {
  return mergeHeaders({ "Content-Type": "text/html; charset=utf-8" }, ..._getRenderedMatches(opts.router.stores.matches.get()).map((match) => {
    return match.headers;
  }));
}
var entriesPromise;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
  const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
    import("./router-QgJicixe.mjs").then((n) => n.bD),
    import("./start-DyL9F3AQ.mjs"),
    import("./empty-plugin-adapters-BFgPZ6_d.mjs")
  ]);
  return {
    routerEntry,
    startEntry,
    pluginAdapters
  };
}
function getEntries() {
  if (!entriesPromise) entriesPromise = loadEntries();
  return entriesPromise;
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var ERR_NO_RESPONSE = "Internal Server Error";
var ERR_NO_DEFER = "Internal Server Error";
function throwRouteHandlerError() {
  throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
  throw new Error(ERR_NO_DEFER);
}
function getResponseFromResult(result) {
  return isSsrResponse(result) || result instanceof Response ? result : result?.response;
}
var responseBodySources = /* @__PURE__ */ new WeakMap();
function disposeResponseResult(result, reason) {
  const response = getResponseFromResult(result);
  if (isSsrResponse(response) || response instanceof Response) disposeSsrResponse(response, reason);
}
function transferResponseBodyOwnership(source, response) {
  if (!source.body || !response.body) throw new Error("Response body ownership requires two response bodies");
  responseBodySources.set(response, source);
  return response;
}
function hasResponseBody(value) {
  return value instanceof Response && value.body !== null;
}
function inheritsResponseOwnership(ownership, candidate) {
  return hasResponseBody(candidate) && (candidate.body === ownership.response.body || responseBodySources.get(candidate) === ownership.response);
}
function disposeResponseOwnership(ownership, reason) {
  const { response, sourceBody, streamResponse } = ownership;
  streamResponse?.dispose(reason);
  if (!streamResponse || response.body !== sourceBody) response.body.cancel(reason).catch(() => {
  });
}
function getOwnedResponse(ownership) {
  const { response, sourceBody, streamResponse } = ownership;
  if (!streamResponse) return response;
  if (streamResponse.response === response && response.body === sourceBody) return streamResponse;
  if (response.body === sourceBody) return {
    ...streamResponse,
    response
  };
  return {
    ...streamResponse,
    response,
    dispose(reason) {
      disposeResponseOwnership(ownership, reason);
    }
  };
}
function createLateResponseDisposer(signal) {
  return (result) => disposeResponseResult(result, signal.reason);
}
async function executeMiddleware(middlewares, terminal, ctx, signal, terminalNext) {
  let index = -1;
  let responseOwnership;
  let settled = false;
  const disposeAbandonedResult = createLateResponseDisposer(signal);
  const setResponse = (response) => {
    const ssrResponse = isSsrResponse(response) ? response : void 0;
    const streamResponse = ssrResponse?.serverSsrCleanup === "stream" ? ssrResponse : void 0;
    const exposed = ssrResponse ? ssrResponse.response : response;
    const current = responseOwnership;
    if (settled) {
      if (exposed !== ctx.response) disposeResponseResult(response, "late middleware response");
      return;
    }
    if (current && current.response === exposed) current.streamResponse ??= streamResponse;
    else if (current && inheritsResponseOwnership(current, exposed)) {
      current.response = exposed;
      current.streamResponse ??= streamResponse;
    } else {
      if (current) disposeResponseOwnership(current, "middleware response replaced");
      if (hasResponseBody(exposed)) responseOwnership = {
        response: exposed,
        sourceBody: exposed.body,
        streamResponse
      };
      else responseOwnership = void 0;
    }
    ctx.response = exposed;
  };
  const reconcileCtxResponse = () => {
    if (ctx.response !== responseOwnership?.response) setResponse(ctx.response);
  };
  let nextPromise;
  function next(nextCtx) {
    const result = runNext(nextCtx);
    nextPromise = result;
    return result;
  }
  async function runNext(nextCtx) {
    signal.throwIfAborted();
    if (nextCtx) {
      if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
      for (const key of Object.keys(nextCtx)) if (key === "response") setResponse(nextCtx.response);
      else if (key !== "context") ctx[key] = nextCtx[key];
    }
    index++;
    const isTerminal = index === middlewares.length;
    const middleware = index < middlewares.length ? middlewares[index] : isTerminal ? terminal : void 0;
    const middlewareNext = isTerminal && terminalNext ? terminalNext : next;
    if (!middleware) return ctx;
    let result;
    try {
      const pending = middleware({
        ...ctx,
        next: middlewareNext
      });
      if (nextPromise && pending === nextPromise) {
        nextPromise = void 0;
        await pending;
        if (signal.aborted) throw signal.reason;
        return ctx;
      } else if (!isPromise(pending)) {
        result = pending;
        signal.throwIfAborted();
      } else result = await waitForReason(pending, signal, disposeAbandonedResult, disposeAbandonedResult);
    } catch (err) {
      reconcileCtxResponse();
      if (signal.aborted) {
        if (result !== void 0) disposeAbandonedResult(result);
        if (err !== signal.reason) disposeAbandonedResult(err);
        throw signal.reason;
      }
      if (err instanceof Response) {
        setResponse(err);
        return ctx;
      }
      throw err;
    }
    if (isTerminal && terminalNext && !result) throwRouteHandlerError();
    reconcileCtxResponse();
    if (result && result !== ctx) {
      const response = getResponseFromResult(result);
      if (response !== void 0 && response !== ctx.response) setResponse(response);
      if (response !== result && result.context && result.context !== ctx.context) ctx.context = safeObjectMerge(ctx.context, result.context);
    }
    return ctx;
  }
  try {
    await runNext();
    const response = ctx.response;
    if (!response) throwRouteHandlerError();
    reconcileCtxResponse();
    if (signal.aborted) throw signal.reason;
    settled = true;
    return responseOwnership ? getOwnedResponse(responseOwnership) : response;
  } catch (err) {
    settled = true;
    if (responseOwnership) disposeResponseOwnership(responseOwnership, signal.aborted ? signal.reason : err);
    throw err;
  }
}
function createStartHandler(cbOrOptions) {
  const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
  const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
  const finalManifestResolver = createFinalManifestResolver({
    ...handlerOptions
  });
  const resolveManifestForRequest = finalManifestResolver.resolveCached;
  finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest() });
  const startRequestResolver = async (request, requestOpts) => {
    const signal = request.signal;
    let router;
    let routerPromise;
    let responseOwnsCleanup = false;
    try {
      signal.throwIfAborted();
      const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
      const href = url.pathname + url.search + url.hash;
      const origin = url.origin;
      if (handledProtocolRelativeURL) return Response.redirect(url, 308);
      const entries = await waitForReason(getEntries(), signal);
      const isServerFnRequest = !!SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE);
      const startInstance = entries.startEntry.startInstance;
      let startOptions;
      if (startInstance) {
        const pendingStartOptions = startInstance.getOptions();
        startOptions = isPromise(pendingStartOptions) ? await waitForReason(pendingStartOptions, signal) : pendingStartOptions;
        signal.throwIfAborted();
      } else startOptions = {};
      const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
      const serializationAdapters = [
        ...startOptions.serializationAdapters || [],
        ...hasPluginAdapters ? pluginSerializationAdapters : [],
        ServerFunctionSerializationAdapter
      ];
      const requestStartOptions = {
        ...startOptions,
        requestMiddleware: startInstance ? startOptions.requestMiddleware : isServerFnRequest ? [defaultCsrfMiddleware] : void 0,
        serializationAdapters
      };
      const flattenedRequestMiddlewares = requestStartOptions.requestMiddleware ? flattenMiddlewares(requestStartOptions.requestMiddleware) : [];
      const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
      const getRouter = () => {
        routerPromise ??= (async () => {
          signal.throwIfAborted();
          const requestRouter = await waitForReason(entries.routerEntry.getRouter(), signal);
          let isShell = IS_SHELL_ENV;
          if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
          const history = createServerHistory(href);
          requestRouter.update({
            history,
            isShell,
            isPrerendering: IS_PRERENDERING,
            origin: requestRouter.options.origin ?? origin,
            defaultSsr: requestStartOptions.defaultSsr,
            serializationAdapters: [...requestStartOptions.serializationAdapters, ...requestRouter.options.serializationAdapters || []],
            basepath: ROUTER_BASEPATH
          });
          router = requestRouter;
          return requestRouter;
        })();
        return routerPromise;
      };
      const handlerType = isServerFnRequest ? "serverFn" : "router";
      const startContext = {
        getRouter,
        startOptions: requestStartOptions,
        request,
        executedRequestMiddlewares,
        handlerType
      };
      let terminal;
      if (isServerFnRequest) {
        if (false) ;
        const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
        if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
        terminal = ({ context }) => runWithStartContext({
          ...startContext,
          contextAfterGlobalMiddlewares: context
        }, () => handleServerAction({
          request,
          context: requestOpts?.context,
          serverFnId
        }));
      } else {
        const executeRouter = async (serverContext, matchedRoutes) => {
          if (!/(^|,)\s*(\*\/\*|text\/html)/.test(request.headers.get("Accept") || "*/*")) return normalizeSsrResponse(Response.json({ error: "Only HTML requests are supported here" }, { status: 406 }));
          const manifest2 = await waitForReason(resolveManifestForRequest({
            request,
            requestInlineCss: requestOpts?.inlineCss,
            getBaseManifest: () => getBaseManifest(matchedRoutes)
          }), signal);
          const earlyHints = createEarlyHintsForRequest({
            onEarlyHints: requestOpts?.onEarlyHints,
            responseLinkHeader: requestOpts?.responseLinkHeader
          });
          earlyHints?.collectStatic({
            manifest: manifest2,
            matchedRoutes
          });
          const routerInstance = await getRouter();
          attachRouterServerSsrUtils({
            router: routerInstance,
            manifest: manifest2,
            getRequestAssets: () => getStartContext({ throwIfNotFound: false })?.requestAssets
          });
          routerInstance.options.additionalContext = { serverContext };
          await routerInstance.load({ _signal: signal });
          signal.throwIfAborted();
          if (routerInstance._serverResult?.type === "redirect") return normalizeSsrResponse(routerInstance._serverResult.redirect);
          earlyHints?.collectDynamic(_getRenderedMatches(routerInstance.stores.matches.get()));
          const ctx = getStartContext({ throwIfNotFound: false });
          await routerInstance.serverSsr.dehydrate({
            requestAssets: ctx?.requestAssets,
            signal
          });
          signal.throwIfAborted();
          const responseHeaders = getStartResponseHeaders({ router: routerInstance });
          earlyHints?.appendResponseHeaders(responseHeaders);
          signal.throwIfAborted();
          const disposeLate = createLateResponseDisposer(signal);
          return normalizeSsrResponse(await waitForReason(cb({
            request,
            router: routerInstance,
            responseHeaders
          }), signal, disposeLate, disposeLate));
        };
        terminal = ({ context }) => runWithStartContext({
          ...startContext,
          contextAfterGlobalMiddlewares: context
        }, () => handleServerRoutes({
          getRouter,
          request,
          url,
          executeRouter,
          context,
          executedRequestMiddlewares
        }));
      }
      const middlewareResponse = await executeMiddleware(flattenedRequestMiddlewares.map((d) => d.options.server), terminal, {
        request,
        pathname: url.pathname,
        handlerType,
        context: createNullProtoObject(requestOpts?.context)
      }, signal);
      let result;
      try {
        result = await handleRedirectResponse(middlewareResponse, getRouter, signal, isServerFnRequest && request.headers.get("x-tsr-serverFn") === "true");
        if (request.method === "HEAD") result = stripSsrResponseBody(result, "HEAD body stripped");
      } catch (error) {
        disposeResponseResult(middlewareResponse, signal.aborted ? signal.reason : error);
        throw error;
      }
      bindSsrResponseToRequest(router, result, signal);
      signal.throwIfAborted();
      responseOwnsCleanup = result.serverSsrCleanup === "stream";
      return result.response;
    } finally {
      if (router?.serverSsr && !responseOwnsCleanup) router.serverSsr.cleanup();
    }
  };
  return requestHandler(startRequestResolver);
}
var relativeRedirectProtocols = /* @__PURE__ */ new Set();
async function handleRedirectResponse(response, getRouter, signal, serializeRedirect) {
  signal.throwIfAborted();
  const ssrResponse = normalizeSsrResponse(response);
  const redirect = ssrResponse.response;
  if (!isRedirect(redirect)) return ssrResponse;
  const opts = redirect.options;
  const href = redirect.headers.get("Location") || opts.href;
  if (!href && opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
  if (!href && [
    "params",
    "search",
    "hash"
  ].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
  signal.throwIfAborted();
  if (href && !isDangerousProtocol(href, relativeRedirectProtocols)) {
    opts.href = href;
    redirect.headers.set("Location", href);
  } else {
    const router = await getRouter();
    signal.throwIfAborted();
    router.resolveRedirect(redirect);
  }
  if (serializeRedirect) {
    const redirectOptions = { ...opts };
    delete redirectOptions.headers;
    const responseHeaders = new Headers(redirect.headers);
    responseHeaders.set("content-type", "application/json");
    return replaceSsrResponse(ssrResponse, Response.json({
      ...redirectOptions,
      isSerializedRedirect: true
    }, { headers: responseHeaders }), "redirect response replaced");
  }
  return ssrResponse;
}
function withParsedParams(handler, matchedRoutes) {
  if (!matchedRoutes.some((route) => route.options.params?.parse ?? route.options.parseParams)) return handler;
  return (ctx) => {
    const params = Object.assign(/* @__PURE__ */ Object.create(null), ctx.params);
    for (const route of matchedRoutes) {
      const parse = route.options.params?.parse ?? route.options.parseParams;
      if (parse) Object.assign(params, parse(params));
    }
    return handler({
      ...ctx,
      params
    });
  };
}
async function handleServerRoutes({ getRouter, request, url, executeRouter, context, executedRequestMiddlewares }) {
  const router = await getRouter();
  const pathname = executeRewriteInput(router.rewrite, url).pathname;
  const [matchedRoutes, rawParams, foundRoute] = router.getMatchedRoutes(pathname);
  const isExactMatch = foundRoute && rawParams["**"] === void 0;
  const routeMiddlewares = [];
  let terminalHandler = (ctx) => executeRouter(ctx.context, matchedRoutes);
  let terminalNext;
  for (const route of matchedRoutes) {
    const serverMiddleware = route.options.server?.middleware;
    if (serverMiddleware) {
      const flattened = flattenMiddlewares(serverMiddleware);
      for (const m of flattened) if (!executedRequestMiddlewares.has(m)) routeMiddlewares.push(m.options.server);
    }
  }
  const server2 = foundRoute?.options.server;
  if (server2?.handlers && isExactMatch) {
    const handlers = typeof server2.handlers === "function" ? server2.handlers({ createHandlers: (d) => d }) : server2.handlers;
    const requestMethod = request.method.toUpperCase();
    const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
    if (handler) {
      const mayDefer = !!foundRoute.options.component;
      if (typeof handler !== "function") {
        if (handler.middleware?.length) {
          const handlerMiddlewares = flattenMiddlewares(handler.middleware);
          for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
        }
      }
      const routeHandler = typeof handler === "function" ? handler : handler.handler;
      if (routeHandler) {
        const parsedHandler = withParsedParams(routeHandler, matchedRoutes);
        if (!mayDefer) {
          terminalHandler = parsedHandler;
          terminalNext = throwIfMayNotDefer;
        } else routeMiddlewares.push(parsedHandler);
      }
    }
  }
  return normalizeSsrResponse(await executeMiddleware(routeMiddlewares, terminalHandler, {
    request,
    context,
    params: rawParams,
    pathname,
    handlerType: "router"
  }, request.signal, terminalNext));
}
var fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
  return { async fetch(...args) {
    return await entry.fetch(...args);
  } };
}
var server_default = createServerEntry({ fetch });
const server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createServerEntry,
  default: server_default
}, Symbol.toStringTag, { value: "Module" }));
export {
  sealSession as A,
  setCookie as B,
  setResponseHeader as C,
  setResponseHeaders as D,
  transferResponseBodyOwnership as E,
  unsealSession as F,
  updateSession as G,
  HEADERS as H,
  useSession as I,
  server as J,
  StartServer as S,
  TSS_SERVER_FUNCTION as T,
  getServerFnById as a,
  createMiddleware as b,
  createServerFn as c,
  clearResponseHeaders as d,
  clearSession as e,
  createStartHandler as f,
  getRequest as g,
  defaultStreamHandler as h,
  deleteCookie as i,
  getCookie as j,
  getCookies as k,
  getRequestHeader as l,
  getRequestHeaders as m,
  getRequestHost as n,
  getRequestIP as o,
  getRequestProtocol as p,
  getRequestUrl as q,
  getResponse as r,
  setResponseStatus as s,
  getResponseHeader as t,
  getResponseHeaders as u,
  getResponseStatus as v,
  getSession as w,
  getValidatedQuery as x,
  removeResponseHeader as y,
  requestHandler as z
};
