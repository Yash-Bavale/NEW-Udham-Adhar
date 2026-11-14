import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn, g as getRequest } from "./server-BFjd5iLF.mjs";
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
const str = (v) => String(v ?? "").trim();
const arr = (v) => Array.isArray(v) ? v : [];
const getSanityFaqs_createServerFn_handler = createServerRpc({
  id: "618b01e5b32b1d8c5b5cc4465b568326723c6c24fcdc6a81211327d6f53df567",
  name: "getSanityFaqs",
  filename: "src/lib/sanity/client.functions.ts"
}, (opts) => getSanityFaqs.__executeServer(opts));
const getSanityFaqs = createServerFn({
  method: "GET"
}).handler(getSanityFaqs_createServerFn_handler, async () => {
  try {
    const {
      sanityQuery
    } = await import("./sanity.server-DxVJBPkV.mjs");
    const rows = await sanityQuery(getRequest(), `*[_type == "faq"] | order(_createdAt asc){ _id, question, answer, category }`);
    return rows.map((r) => ({
      id: str(r["_id"]),
      question: str(r["question"]),
      answer: str(r["answer"]),
      category: str(r["category"])
    })).filter((f) => f.question && f.answer);
  } catch (err) {
    console.error("[sanity] getSanityFaqs failed:", err);
    return [];
  }
});
const getSanityServicePage_createServerFn_handler = createServerRpc({
  id: "2e11faac915cce52818fc1de72639f67fec34bd3b3c0ced59e606e5cbe021c4f",
  name: "getSanityServicePage",
  filename: "src/lib/sanity/client.functions.ts"
}, (opts) => getSanityServicePage.__executeServer(opts));
const getSanityServicePage = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(getSanityServicePage_createServerFn_handler, async ({
  data
}) => {
  try {
    const {
      sanityQuery
    } = await import("./sanity.server-DxVJBPkV.mjs");
    const r = await sanityQuery(getRequest(), `*[_type == "servicePage" && slug == $slug][0]`, {
      slug: data.slug
    });
    if (!r) {
      const article = await getSanitySeoArticle({
        data: {
          slug: data.slug
        }
      }).catch(() => null);
      if (article) {
        return {
          id: article.id,
          serviceCode: data.slug,
          slug: article.slug,
          name: article.title,
          shortDescription: article.metaDescription,
          longDescription: article.body,
          priceInclusive: null,
          processingDays: null,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription
        };
      }
      return null;
    }
    return {
      id: str(r["_id"]),
      serviceCode: str(r["serviceCode"]),
      slug: str(r["slug"]),
      name: str(r["name"]),
      shortDescription: str(r["shortDescription"]),
      longDescription: str(r["longDescription"]),
      priceInclusive: typeof r["priceInclusive"] === "number" ? r["priceInclusive"] : null,
      processingDays: typeof r["processingDays"] === "number" ? r["processingDays"] : null,
      metaTitle: str(r["metaTitle"]),
      metaDescription: str(r["metaDescription"])
    };
  } catch (err) {
    console.error("[sanity] getSanityServicePage failed:", err);
    return null;
  }
});
const getSanitySeoArticle_createServerFn_handler = createServerRpc({
  id: "a8449235b53f082fa664f40cdc459bb6c618a31dae119e4a9f29a47b3a53fa30",
  name: "getSanitySeoArticle",
  filename: "src/lib/sanity/client.functions.ts"
}, (opts) => getSanitySeoArticle.__executeServer(opts));
const getSanitySeoArticle = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(getSanitySeoArticle_createServerFn_handler, async ({
  data
}) => {
  try {
    const {
      sanityQuery
    } = await import("./sanity.server-DxVJBPkV.mjs");
    const r = await sanityQuery(getRequest(), `*[_type == "seoArticle" && slug == $slug][0]`, {
      slug: data.slug.toLowerCase()
    });
    if (!r) return null;
    return {
      id: str(r["_id"]),
      slug: str(r["slug"]),
      title: str(r["title"]),
      metaTitle: str(r["metaTitle"]),
      metaDescription: str(r["metaDescription"]),
      body: str(r["body"]),
      canonicalUrl: str(r["canonicalUrl"]),
      publishedAt: str(r["publishedAt"]),
      aiOverview: r["aiOverview"] ?? null,
      quickFacts: arr(r["quickFacts"]),
      bodySections: arr(r["bodySections"]),
      eeat: r["eeat"] ?? null,
      faqs: arr(r["faqs"]),
      internalLinks: arr(r["internalLinks"]),
      howto: arr(r["howto"]),
      ctas: r["ctas"] ?? null
    };
  } catch (err) {
    console.error("[sanity] getSanitySeoArticle failed:", err);
    return null;
  }
});
const getSanityLandingPage_createServerFn_handler = createServerRpc({
  id: "8955a0298badd332920cc8a360a11051270c3bb8ffd76bffe00cdf376388b89b",
  name: "getSanityLandingPage",
  filename: "src/lib/sanity/client.functions.ts"
}, (opts) => getSanityLandingPage.__executeServer(opts));
const getSanityLandingPage = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(getSanityLandingPage_createServerFn_handler, async ({
  data
}) => {
  try {
    const {
      sanityQuery
    } = await import("./sanity.server-DxVJBPkV.mjs");
    const r = await sanityQuery(getRequest(), `*[_type == "landingPage" && slug == $slug][0]`, {
      slug: data.slug
    });
    if (!r) return null;
    return {
      id: str(r["_id"]),
      slug: str(r["slug"]),
      title: str(r["title"]),
      metaTitle: str(r["metaTitle"]),
      metaDescription: str(r["metaDescription"]),
      hero: r["hero"] ?? null,
      howItWorks: arr(r["howItWorks"]),
      whyUs: arr(r["whyUs"]),
      faqs: arr(r["faqs"]),
      ctas: r["ctas"] ?? null,
      longDescription: str(r["longDescription"])
    };
  } catch (err) {
    console.error("[sanity] getSanityLandingPage failed:", err);
    return null;
  }
});
const listSanitySeoPages_createServerFn_handler = createServerRpc({
  id: "051d632b986444aa7b6f3ff0cac71fabf9d3ebcca5f8743048eeb7d45155e15a",
  name: "listSanitySeoPages",
  filename: "src/lib/sanity/client.functions.ts"
}, (opts) => listSanitySeoPages.__executeServer(opts));
const listSanitySeoPages = createServerFn({
  method: "GET"
}).handler(listSanitySeoPages_createServerFn_handler, async () => {
  try {
    const {
      sanityQuery
    } = await import("./sanity.server-DxVJBPkV.mjs");
    const rows = await sanityQuery(getRequest(), `*[_type == "seoArticle" && defined(slug)]{ slug, title }`);
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const r of rows) {
      const slug = str(r.slug).toLowerCase();
      if (!slug || slug === "home" || slug === "index" || seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        slug,
        title: str(r.title) || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      });
    }
    return out;
  } catch (err) {
    console.error("[sanity] listSanitySeoPages failed:", err);
    return [];
  }
});
const listSanitySeoSlugs_createServerFn_handler = createServerRpc({
  id: "f2f5e038f089c2c510dc71bf53e1e25230f9cd21c9e7be4a184270b8da41b289",
  name: "listSanitySeoSlugs",
  filename: "src/lib/sanity/client.functions.ts"
}, (opts) => listSanitySeoSlugs.__executeServer(opts));
const listSanitySeoSlugs = createServerFn({
  method: "GET"
}).handler(listSanitySeoSlugs_createServerFn_handler, async () => {
  try {
    const {
      sanityQuery
    } = await import("./sanity.server-DxVJBPkV.mjs");
    const rows = await sanityQuery(getRequest(), `*[_type == "seoArticle" && defined(slug)]{ slug, canonicalUrl, _updatedAt }`);
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const r of rows) {
      const slug = str(r.slug).toLowerCase();
      if (!slug || slug === "home" || slug === "index" || seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        slug,
        canonicalUrl: str(r.canonicalUrl),
        updatedAt: str(r._updatedAt).slice(0, 10)
      });
    }
    return out;
  } catch (err) {
    console.error("[sanity] listSanitySeoSlugs failed:", err);
    return [];
  }
});
export {
  getSanityFaqs_createServerFn_handler,
  getSanityLandingPage_createServerFn_handler,
  getSanitySeoArticle_createServerFn_handler,
  getSanityServicePage_createServerFn_handler,
  listSanitySeoPages_createServerFn_handler,
  listSanitySeoSlugs_createServerFn_handler
};
