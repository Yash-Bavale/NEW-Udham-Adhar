import { createServerFn } from "@tanstack/react-start";

const GATEWAY = "https://connector-gateway.lovable.dev/contentful";

type CfEntry<F> = { sys: { id: string; updatedAt: string }; fields: F };
type CfList<F> = { total: number; skip: number; limit: number; items: CfEntry<F>[] };

async function cfFetch<F>(path: string): Promise<CfList<F>> {
  const key = process.env.LOVABLE_API_KEY;
  const apiKey = process.env.CONTENTFUL_API_KEY;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  if (!key || !apiKey || !spaceId) {
    throw new Error("Contentful gateway env vars missing");
  }
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

/** Walk a Contentful rich-text document and collect its plain text. */
function richTextToPlain(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { nodeType?: string; value?: string; content?: unknown[] };
  if (n.nodeType === "text" && typeof n.value === "string") return n.value;
  if (Array.isArray(n.content)) {
    let out = "";
    for (let i = 0; i < n.content.length; i++) {
      out += richTextToPlain(n.content[i]);
      // Paragraph breaks preserve readability
      const child = n.content[i] as { nodeType?: string } | undefined;
      if (child?.nodeType === "paragraph" && i < n.content.length - 1) out += "\n\n";
    }
    return out;
  }
  return "";
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
        longDescription: richTextToPlain(f.longDescription).trim(),
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
};

type SeoArticleFields = {
  slug?: string;
  title?: string | string[];
  metaTitle?: string;
  metaDescription?: string;
  body?: unknown;
  canonicalUrl?: string;
  publishedAt?: string;
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
      return {
        id: e.sys.id,
        slug: (f.slug ?? "").trim(),
        title: String(title).trim(),
        metaTitle: (f.metaTitle ?? "").trim(),
        metaDescription: (f.metaDescription ?? "").trim(),
        body: richTextToPlain(f.body).trim(),
        canonicalUrl: (f.canonicalUrl ?? "").trim(),
        publishedAt: (f.publishedAt ?? "").trim(),
      };
    } catch (err) {
      console.error("[contentful] getContentfulSeoArticle failed:", err);
      return null;
    }
  });
