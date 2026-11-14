import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
const getSanityFaqs = createServerFn({
  method: "GET"
}).handler(createSsrRpc("618b01e5b32b1d8c5b5cc4465b568326723c6c24fcdc6a81211327d6f53df567"));
const getSanityServicePage = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(createSsrRpc("2e11faac915cce52818fc1de72639f67fec34bd3b3c0ced59e606e5cbe021c4f"));
const getSanitySeoArticle = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(createSsrRpc("a8449235b53f082fa664f40cdc459bb6c618a31dae119e4a9f29a47b3a53fa30"));
const getSanityLandingPage = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(createSsrRpc("8955a0298badd332920cc8a360a11051270c3bb8ffd76bffe00cdf376388b89b"));
const listSanitySeoPages = createServerFn({
  method: "GET"
}).handler(createSsrRpc("051d632b986444aa7b6f3ff0cac71fabf9d3ebcca5f8743048eeb7d45155e15a"));
const listSanitySeoSlugs = createServerFn({
  method: "GET"
}).handler(createSsrRpc("f2f5e038f089c2c510dc71bf53e1e25230f9cd21c9e7be4a184270b8da41b289"));
export {
  getSanityFaqs as getContentfulFaqs,
  getSanityLandingPage as getContentfulLandingPage,
  getSanitySeoArticle as getContentfulSeoArticle,
  getSanityServicePage as getContentfulServicePage,
  listSanitySeoPages as listContentfulSeoPages,
  listSanitySeoSlugs as listContentfulSeoSlugs
};
