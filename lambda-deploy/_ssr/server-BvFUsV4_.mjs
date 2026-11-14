import { s as setResponseStatus, g as getRequest, S as StartServer } from "./server-BFjd5iLF.mjs";
import { H, d, e, f, h, i, j, k, l, m, n, o, p, q, r, t, u, v, w, x, y, z, A, B, C, D, E, F, G, I } from "./server-BFjd5iLF.mjs";
import { A as defineHandlerCallback } from "../_libs/tanstack__router-core.mjs";
import { G as G2, Z, $, w as w2 } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as renderRouterToString } from "../_libs/tanstack__react-router.mjs";
import "../_libs/seroval.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
var defaultRenderHandler = defineHandlerCallback(({ router, responseHeaders }) => renderRouterToString({
  router,
  responseHeaders,
  children: /* @__PURE__ */ jsxRuntimeExports.jsx(StartServer, { router })
}));
var VIRTUAL_MODULES = {
  startManifest: "tanstack-start-manifest:v",
  serverFnResolver: "#tanstack-start-server-fn-resolver",
  pluginAdapters: "#tanstack-start-plugin-adapters"
};
export {
  H as HEADERS,
  StartServer,
  VIRTUAL_MODULES,
  G2 as attachRouterServerSsrUtils,
  d as clearResponseHeaders,
  e as clearSession,
  Z as createRequestHandler,
  f as createStartHandler,
  defaultRenderHandler,
  h as defaultStreamHandler,
  defineHandlerCallback,
  i as deleteCookie,
  j as getCookie,
  k as getCookies,
  getRequest,
  l as getRequestHeader,
  m as getRequestHeaders,
  n as getRequestHost,
  o as getRequestIP,
  p as getRequestProtocol,
  q as getRequestUrl,
  r as getResponse,
  t as getResponseHeader,
  u as getResponseHeaders,
  v as getResponseStatus,
  w as getSession,
  x as getValidatedQuery,
  y as removeResponseHeader,
  z as requestHandler,
  A as sealSession,
  B as setCookie,
  C as setResponseHeader,
  D as setResponseHeaders,
  setResponseStatus,
  E as transferResponseBodyOwnership,
  $ as transformPipeableStreamWithRouter,
  w2 as transformReadableStreamWithRouter,
  F as unsealSession,
  G as updateSession,
  I as useSession
};
