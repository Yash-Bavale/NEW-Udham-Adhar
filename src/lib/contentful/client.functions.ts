import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

const GATEWAY = "https://connector-gateway.lovable.dev/contentful";

type CfEntry<F> = { sys: { id: string; updatedAt: string }; fields: F };
type CfList<F> = { total: number; skip: number; limit: number; items: CfEntry<F>[] };

/** Only these env var names may be selected per-website (allow-list). */
const ALLOWED_TOKEN_SECRETS = [
  "CONTENTFUL_API_KEY",
  "CONTENTFUL_API_KEY_1",
  "CONTENTFUL_API_KEY_2",
] as const;

/**
 * Resolve the Contentful space + connection key for the current host.
 * Falls back to the project-default env vars when the website row has no
 * per-site configuration. When a site selects e.g. CONTENTFUL_API_KEY_1 and
 * stores no explicit space id, the matching CONTENTFUL_SPACE_ID_1 is used.
 */
async function resolveCfCreds(): Promise<{ spaceId: string; apiKey: string }> {
  let explicitSpaceId = "";
  let secretName = "CONTENTFUL_API_KEY";
  try {
    const { resolveCurrentWebsite } = await import("@/lib/websites/current-website.server");
    const site = await resolveCurrentWebsite(getRequest());
    explicitSpaceId = site.contentful_space_id ?? "";
    const chosen = site.contentful_delivery_token_secret ?? "";
    if ((ALLOWED_TOKEN_SECRETS as readonly string[]).includes(chosen)) secretName = chosen;
  } catch {
    // ignore — use project defaults
  }
  const suffix = secretName.replace("CONTENTFUL_API_KEY", "");
  const spaceId =
    explicitSpaceId || process.env[`CONTENTFUL_SPACE_ID${suffix}`] || process.env.CONTENTFUL_SPACE_ID || "";
  const apiKey = process.env[secretName] ?? "";
  if (!spaceId || !apiKey) throw new Error("Contentful gateway env vars missing");
  return { spaceId, apiKey };
}


async function cfFetch<F>(path: string): Promise<CfList<F>> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Contentful gateway env vars missing");
  const { spaceId, apiKey } = await resolveCfCreds();
  const url = `${GATEWAY}/spaces/${spaceId}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      "X-Connection-Api-Key": apiKey,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Contentful ${res.status}: ${body.slice(0, 300)}`);
  }
  return (await res.json()) as CfList<F>;
}


/** Walk a Contentful rich-text document and collect its PLAIN text (used for FAQ answers, meta, etc.). */
function richTextToPlain(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { nodeType?: string; value?: string; content?: unknown[] };
  if (n.nodeType === "text" && typeof n.value === "string") return n.value;
  if (Array.isArray(n.content)) {
    let out = "";
    for (let i = 0; i < n.content.length; i++) {
      out += richTextToPlain(n.content[i]);
      const child = n.content[i] as { nodeType?: string } | undefined;
      if (
        child?.nodeType &&
        (child.nodeType === "paragraph" ||
          child.nodeType.startsWith("heading-") ||
          child.nodeType === "unordered-list" ||
          child.nodeType === "ordered-list") &&
        i < n.content.length - 1
      ) {
        out += "\n\n";
      }
    }
    return out;
  }
  return "";
}

/**
 * Walk a Contentful rich-text leaf TEXT node and wrap it with inline marks
 * (bold → <strong>, italic → <em>, underline → <u>, code → <code>).
 */
function richTextInlineToHtml(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as {
    nodeType?: string;
    value?: string;
    marks?: Array<{ type: string }>;
    content?: unknown[];
    data?: { uri?: string };
  };

  if (n.nodeType === "text") {
    let text = (n.value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const marks = n.marks ?? [];
    for (const mark of marks) {
      if (mark.type === "bold") text = `<strong>${text}</strong>`;
      else if (mark.type === "italic") text = `<em>${text}</em>`;
      else if (mark.type === "underline") text = `<u>${text}</u>`;
      else if (mark.type === "code") text = `<code>${text}</code>`;
    }
    return text;
  }

  if (n.nodeType === "hyperlink" && Array.isArray(n.content)) {
    const href = (n.data?.uri ?? "").replace(/"/g, "&quot;");
    const inner = n.content.map(richTextInlineToHtml).join("");
    return `<a href="${href}" rel="noopener">${inner}</a>`;
  }

  if (Array.isArray(n.content)) {
    return n.content.map(richTextInlineToHtml).join("");
  }
  return "";
}

/**
 * Convert a Contentful rich-text document JSON into an HTML string.
 * Preserves: headings (h2-h4), paragraphs, bold, italic, underline,
 * unordered lists, ordered lists, hyperlinks.
 * This is used wherever we render Contentful body content on-page.
 */
function richTextToHtml(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { nodeType?: string; content?: unknown[] };
  if (!Array.isArray(n.content)) return "";

  const parts: string[] = [];

  for (const block of n.content) {
    if (!block || typeof block !== "object") continue;
    const b = block as { nodeType?: string; content?: unknown[] };
    const type = b.nodeType ?? "";
    const children = b.content ?? [];

    if (type === "paragraph") {
      const inner = children.map(richTextInlineToHtml).join("");
      if (inner.trim()) parts.push(`<p>${inner}</p>`);
      continue;
    }

    if (type === "heading-2") {
      const inner = children.map(richTextInlineToHtml).join("");
      if (inner.trim()) parts.push(`<h2>${inner}</h2>`);
      continue;
    }
    if (type === "heading-3") {
      const inner = children.map(richTextInlineToHtml).join("");
      if (inner.trim()) parts.push(`<h3>${inner}</h3>`);
      continue;
    }
    if (type === "heading-4") {
      const inner = children.map(richTextInlineToHtml).join("");
      if (inner.trim()) parts.push(`<h4>${inner}</h4>`);
      continue;
    }

    if (type === "unordered-list") {
      const items = children.map((item) => {
        const ic = (item as { content?: unknown[] }).content ?? [];
        const liInner = ic.map((listItemBlock) => {
          const lib = listItemBlock as { nodeType?: string; content?: unknown[] };
          if (lib.nodeType === "paragraph") {
            return (lib.content ?? []).map(richTextInlineToHtml).join("");
          }
          return richTextInlineToHtml(listItemBlock);
        }).join("");
        return `<li>${liInner}</li>`;
      }).join("");
      if (items) parts.push(`<ul>${items}</ul>`);
      continue;
    }

    if (type === "ordered-list") {
      const items = children.map((item) => {
        const ic = (item as { content?: unknown[] }).content ?? [];
        const liInner = ic.map((listItemBlock) => {
          const lib = listItemBlock as { nodeType?: string; content?: unknown[] };
          if (lib.nodeType === "paragraph") {
            return (lib.content ?? []).map(richTextInlineToHtml).join("");
          }
          return richTextInlineToHtml(listItemBlock);
        }).join("");
        return `<li>${liInner}</li>`;
      }).join("");
      if (items) parts.push(`<ol>${items}</ol>`);
      continue;
    }

    if (type === "blockquote") {
      const inner = children.map((c) => {
        const bc = c as { nodeType?: string; content?: unknown[] };
        if (bc.nodeType === "paragraph") {
          return (bc.content ?? []).map(richTextInlineToHtml).join("");
        }
        return richTextInlineToHtml(c);
      }).join("");
      if (inner.trim()) parts.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }

    if (type === "hr") {
      parts.push("<hr />");
      continue;
    }
  }

  return parts.join("\n");
}

type SeoBodySection = ContentfulSeoArticle["bodySections"][number];

/** Convert Contentful Rich Text blocks into the sections consumed by SeoContentPage. */
function richTextToSections(document: unknown, articleTitle: string): SeoBodySection[] {
  if (!document || typeof document !== "object") return [];
  const blocks = (document as { content?: unknown[] }).content;
  if (!Array.isArray(blocks)) return [];

  const sections: SeoBodySection[] = [];
  let current: SeoBodySection | null = null;
  let currentSubsection: NonNullable<SeoBodySection["subsections"]>[number] | null = null;

  const ensureSection = () => {
    if (!current) {
      current = { heading: "Overview", level: 2, paragraphs: [] };
      sections.push(current);
    }
    return current;
  };

  for (const block of blocks) {
    const nodeType =
      block && typeof block === "object"
        ? (block as { nodeType?: string }).nodeType ?? ""
        : "";
    const text = richTextToPlain(block).trim();
    if (!text) continue;

    if (nodeType === "heading-1" || nodeType === "heading-2") {
      // Contentful authors commonly repeat the article title as the first H1.
      // The page already owns the single SEO H1, so do not render it twice.
      if (text.toLocaleLowerCase() === articleTitle.toLocaleLowerCase()) continue;
      current = { heading: text, level: 2, paragraphs: [] };
      currentSubsection = null;
      sections.push(current);
      continue;
    }

    if (nodeType === "heading-3" || nodeType === "heading-4") {
      const section = ensureSection();
      currentSubsection = { heading: text, level: 3, paragraphs: [] };
      section.subsections = [...(section.subsections ?? []), currentSubsection];
      continue;
    }

    // For paragraphs, lists, blockquotes — emit HTML to preserve bold/bullets/links.
    const html = richTextToHtml({ nodeType: "document", content: [block] }).trim();
    const htmlParagraphs = html ? [html] : text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    if (currentSubsection) currentSubsection.paragraphs.push(...htmlParagraphs);
    else ensureSection().paragraphs.push(...htmlParagraphs);
  }

  return sections.filter(
    (section) =>
      section.paragraphs.length > 0 ||
      (section.subsections?.some((subsection) => subsection.paragraphs.length > 0) ?? false),
  );
}

export type ContentfulFaq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

type FaqFields = {
  question?: string;
  answer?: unknown;
  category?: string;
};

/**
 * Fetch published FAQs from Contentful. Returns [] on any failure so callers
 * can fall back to local content. Cached at the edge for 60s (SWR 5min).
 */
export const getContentfulFaqs = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentfulFaq[]> => {
    try {
      // Paginate up to 500 (5 pages of 100).
      const all: CfEntry<FaqFields>[] = [];
      for (let skip = 0; skip < 500; skip += 100) {
        const page = await cfFetch<FaqFields>(
          `/entries?content_type=faq&limit=100&skip=${skip}&order=sys.createdAt`,
        );
        all.push(...page.items);
        if (page.items.length < 100) break;
      }
      return all
        .map((e) => ({
          id: e.sys.id,
          question: (e.fields.question ?? "").trim(),
          answer: richTextToPlain(e.fields.answer).trim(),
          category: (e.fields.category ?? "").trim(),
        }))
        .filter((f) => f.question && f.answer);
    } catch (err) {
      console.error("[contentful] getContentfulFaqs failed:", err);
      return [];
    }
  },
);

/* -------------------------------------------------------------------------- */
/*  Service Pages                                                             */
/* -------------------------------------------------------------------------- */

export type ContentfulServicePage = {
  id: string;
  serviceCode: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  priceInclusive: number | null;
  processingDays: number | null;
  metaTitle: string;
  metaDescription: string;
};

type ServicePageFields = {
  serviceCode?: string;
  slug?: string;
  name?: string;
  shortDescription?: string;
  longDescription?: unknown;
  priceInclusive?: number;
  processingDays?: number;
  metaTitle?: string;
  metaDescription?: string;
};

export const getContentfulServicePage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<ContentfulServicePage | null> => {
    try {
      const page = await cfFetch<ServicePageFields>(
        `/entries?content_type=servicePage&fields.slug=${encodeURIComponent(data.slug)}&limit=1`,
      );
      const e = page.items[0];
      if (!e) return null;
      const f = e.fields;
      return {
        id: e.sys.id,
        serviceCode: (f.serviceCode ?? "").trim(),
        slug: (f.slug ?? "").trim(),
        name: (f.name ?? "").trim(),
        shortDescription: (f.shortDescription ?? "").trim(),
        longDescription: richTextToHtml(f.longDescription).trim() || richTextToPlain(f.longDescription).trim(),
        priceInclusive: typeof f.priceInclusive === "number" ? f.priceInclusive : null,
        processingDays: typeof f.processingDays === "number" ? f.processingDays : null,
        metaTitle: (f.metaTitle ?? "").trim(),
        metaDescription: (f.metaDescription ?? "").trim(),
      };
    } catch (err) {
      console.error("[contentful] getContentfulServicePage failed:", err);
      return null;
    }
  });

/* -------------------------------------------------------------------------- */
/*  SEO Articles                                                              */
/* -------------------------------------------------------------------------- */

export type ContentfulSeoArticle = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  body: string;
  canonicalUrl: string;
  publishedAt: string;
  // Structured body overrides (all optional — fall back to local JSON if absent)
  aiOverview: { short?: string; medium?: string; long?: string } | null;
  quickFacts: Array<{ label: string; value: string }>;
  bodySections: Array<{
    heading: string;
    level: number;
    paragraphs: string[];
    subsections?: Array<{ heading: string; level: number; paragraphs: string[] }>;
  }>;
  eeat: {
    experience?: string;
    expertise?: string;
    trust?: string;
    transparency?: string;
    disclaimer?: string;
  } | null;
  faqs: Array<{ question: string; answer: string }>;
  internalLinks: Array<{ href: string; anchor: string; reason?: string }>;
  howto: Array<{ name: string; text: string }>;
  ctas: {
    hero?: string;
    middle?: string;
    bottom?: string;
    trust?: string;
    benefits?: string;
    why?: string;
  } | null;
};

type SeoArticleFields = {
  slug?: string;
  title?: string | string[];
  metaTitle?: string;
  metaDescription?: string;
  body?: unknown;
  canonicalUrl?: string;
  publishedAt?: string;
  aiOverview?: ContentfulSeoArticle["aiOverview"];
  quickFacts?: ContentfulSeoArticle["quickFacts"];
  bodySections?: ContentfulSeoArticle["bodySections"];
  eeat?: ContentfulSeoArticle["eeat"];
  faqs?: ContentfulSeoArticle["faqs"];
  internalLinks?: ContentfulSeoArticle["internalLinks"];
  howto?: ContentfulSeoArticle["howto"];
  ctas?: ContentfulSeoArticle["ctas"];
};

export const getContentfulSeoArticle = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<ContentfulSeoArticle | null> => {
    try {
      const page = await cfFetch<SeoArticleFields>(
        `/entries?content_type=seoArticle&fields.slug=${encodeURIComponent(data.slug)}&limit=1`,
      );
      const e = page.items[0];
      if (!e) return null;
      const f = e.fields;
      const title = Array.isArray(f.title) ? (f.title[0] ?? "") : (f.title ?? "");
      const normalizedTitle = String(title).trim();
      const authoredSections = Array.isArray(f.bodySections) ? f.bodySections : [];
      return {
        id: e.sys.id,
        slug: (f.slug ?? "").trim(),
        title: normalizedTitle,
        metaTitle: (f.metaTitle ?? "").trim(),
        metaDescription: (f.metaDescription ?? "").trim(),
        body: richTextToHtml(f.body).trim() || richTextToPlain(f.body).trim(),
        canonicalUrl: (f.canonicalUrl ?? "").trim(),
        publishedAt: (f.publishedAt ?? "").trim(),
        aiOverview: f.aiOverview ?? null,
        quickFacts: Array.isArray(f.quickFacts) ? f.quickFacts : [],
        bodySections:
          authoredSections.length > 0
            ? authoredSections
            : richTextToSections(f.body, normalizedTitle),
        eeat: f.eeat ?? null,
        faqs: Array.isArray(f.faqs) ? f.faqs : [],
        internalLinks: Array.isArray(f.internalLinks) ? f.internalLinks : [],
        howto: Array.isArray(f.howto) ? f.howto : [],
        ctas: f.ctas ?? null,
      };
    } catch (err) {
      console.error("[contentful] getContentfulSeoArticle failed:", err);
      return null;
    }
  });

/* -------------------------------------------------------------------------- */
/*  Landing Page (homepage)                                                   */
/* -------------------------------------------------------------------------- */

export type ContentfulLandingPage = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    heading?: string;
    subheading?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  } | null;
  howItWorks: string[];
  whyUs: string[];
  faqs: Array<{ question: string; answer: string }>;
  ctas: Record<string, string> | null;
};

type LandingPageFields = {
  slug?: string;
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  hero?: ContentfulLandingPage["hero"];
  howItWorks?: string[];
  whyUs?: string[];
  faqs?: ContentfulLandingPage["faqs"];
  ctas?: ContentfulLandingPage["ctas"];
};

export const getContentfulLandingPage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<ContentfulLandingPage | null> => {
    try {
      const page = await cfFetch<LandingPageFields>(
        `/entries?content_type=landingPage&fields.slug=${encodeURIComponent(data.slug)}&limit=1`,
      );
      const e = page.items[0];
      if (!e) return null;
      const f = e.fields;
      return {
        id: e.sys.id,
        slug: (f.slug ?? "").trim(),
        title: (f.title ?? "").trim(),
        metaTitle: (f.metaTitle ?? "").trim(),
        metaDescription: (f.metaDescription ?? "").trim(),
        hero: f.hero ?? null,
        howItWorks: Array.isArray(f.howItWorks) ? f.howItWorks : [],
        whyUs: Array.isArray(f.whyUs) ? f.whyUs : [],
        faqs: Array.isArray(f.faqs) ? f.faqs : [],
        ctas: f.ctas ?? null,
      };
    } catch (err) {
      console.error("[contentful] getContentfulLandingPage failed:", err);
      return null;
    }
  });

/* -------------------------------------------------------------------------- */
/*  SEO article index (sitemap)                                               */
/* -------------------------------------------------------------------------- */

export type ContentfulSeoSlug = {
  slug: string;
  canonicalUrl: string;
  updatedAt: string;
};

/** Every published page slug in the current site's Contentful space (paginated). */
export type ContentfulSeoPage = {
  slug: string;
  title: string;
};

/** Fetch slug + title for all published seoArticle entries (used for dynamic service grids). */
export const listContentfulSeoPages = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentfulSeoPage[]> => {
    const out: ContentfulSeoPage[] = [];
    const seen = new Set<string>();
    try {
      let skip = 0;
      for (;;) {
        const page = await cfFetch<{ slug?: string; title?: string | string[] }>(
          `/entries?content_type=seoArticle&select=sys.id,fields.slug,fields.title&limit=200&skip=${skip}`,
        );
        const items = page.items ?? [];
        for (const e of items) {
          const rawSlug = (e.fields?.slug ?? "").trim().toLowerCase();
          if (!rawSlug || rawSlug === "home" || rawSlug === "index") continue;
          if (seen.has(rawSlug)) continue;
          seen.add(rawSlug);
          const rawTitle = Array.isArray(e.fields?.title)
            ? (e.fields.title[0] ?? "")
            : (e.fields?.title ?? "");
          const title = String(rawTitle).trim() ||
            rawSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          out.push({ slug: rawSlug, title });
        }
        skip += page.limit || 200;
        if (skip >= (page.total || 0) || items.length === 0) break;
      }
    } catch (err) {
      console.error("[contentful] listContentfulSeoPages failed:", err);
    }
    return out;
  },
);

export const listContentfulSeoSlugs = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentfulSeoSlug[]> => {
    const out: ContentfulSeoSlug[] = [];
    const seen = new Set<string>();
    try {
      let skip = 0;
      for (;;) {
        // No `select` here: without a content_type filter Contentful rejects
        // field selections (and field ids differ per model), which silently
        // returned zero slugs.
        const page = await cfFetch<{ slug?: string; canonicalUrl?: string }>(
          `/entries?content_type=seoArticle&limit=200&skip=${skip}`,
        );

        const items = page.items ?? [];
        for (const e of items) {
          const rawSlug = (e.fields?.slug ?? "").trim().toLowerCase();
          if (!rawSlug || rawSlug === "home" || rawSlug === "index") continue;
          if (seen.has(rawSlug)) continue;
          seen.add(rawSlug);
          out.push({
            slug: rawSlug,
            canonicalUrl: (e.fields?.canonicalUrl ?? "").trim(),
            updatedAt: (e.sys?.updatedAt ?? "").slice(0, 10),
          });
        }
        skip += page.limit || 200;
        if (skip >= (page.total || 0) || items.length === 0) break;
      }
    } catch (err) {
      console.error("[contentful] listContentfulSeoSlugs failed:", err);
    }
    return out;
  },
);
