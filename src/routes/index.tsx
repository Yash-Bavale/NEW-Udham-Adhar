import { useEffect } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { LeadForm } from "@/components/site/LeadForm";
import { Button } from "@/components/ui/button";
import { UserSquare2, Fingerprint, Share2, Download, ArrowRight } from "lucide-react";
import { HomeFaqSection } from "@/components/site/HomeFaqSection";
import { trackEvent } from "@/lib/analytics/track";
import certImg from "@/assets/udyam-sample-certificate.png.asset.json";
import mapImg from "@/assets/india-map.svg.asset.json";
import {
  orgSchema,
  faqSchema,
  jsonLdScript,
} from "@/lib/seo/jsonld";
import { useBrand } from "@/lib/websites/brand-context";
import { getCurrentBrand } from "@/lib/websites/current-brand.functions";
import { useBlockItems } from "@/lib/websites/site-content-context";
import {
  getContentfulLandingPage,
  getContentfulFaqs,
  type ContentfulLandingPage,
} from "@/lib/contentful/client.functions";
import { FAQS as FALLBACK_FAQS } from "@/lib/faqs-data";

const HOMEPAGE_TITLE =
  "Udyam Registration & MSME Certificate Help";
const HOMEPAGE_DESC =
  "Get expert assistance for Udyam registration, MSME certificate download, Udyog Aadhar update and migration. Private consultancy service. Apply online today.";


const STEPS = [
  { icon: UserSquare2, label: "Fill Form & Make Payment", color: "text-brand-navy" },
  { icon: Fingerprint, label: "Submit Required Information", color: "text-brand-red" },
  { icon: Share2, label: "Expert Assistance & Verification", color: "text-brand-navy" },
  { icon: Download, label: "Updates Shared via Email", color: "text-green-600" },
];

const FACTS: [string, string][] = [
  ["Country", "India"],
  ["Area", "3,287,263 sq. km."],
  ["States", "28"],
  ["Population", "1,46,39,00,000"],
  ["Literacy", "80.9%"],
];

export const Route = createFileRoute("/")({
  loader: async () => {
    const [cms, cfFaqs, brand] = await Promise.all([
      getContentfulLandingPage({ data: { slug: "home" } }),
      getContentfulFaqs(),
      getCurrentBrand(),
    ]);
    // Prefer the Contentful `faq` content type (scales past 100 entries),
    // then the landing-page faqs field, then the local fallback dataset.
    const rawFaqs = cfFaqs.length
      ? cfFaqs.map((f) => ({ q: f.question, a: f.answer }))
      : cms?.faqs?.length
        ? cms.faqs.map((f) => ({ q: f.question, a: f.answer }))
        : FALLBACK_FAQS.map((f) => ({ q: f.q, a: f.a }));
    const seen = new Set<string>();
    const faqs = rawFaqs.filter((f) => {
      const key = f.q.trim().toLowerCase();
      if (!f.q.trim() || !f.a.trim() || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return {
      cms,
      faqs,
      baseUrl: brand.baseUrl,
      siteName: brand.siteName,
      legalEntity: brand.legalEntity,
    };
  },
  head: ({ loaderData }) => {
    const ld = loaderData as
      | {
          cms: ContentfulLandingPage | null;
          faqs?: Array<{ q: string; a: string }>;
          baseUrl?: string;
          legalEntity?: string;
        }
      | undefined;
    const cms = ld?.cms;
    const baseUrl = ld?.baseUrl || "https://udyamadhar.in";
    const orgName = ld?.legalEntity || "Udyam Registration Consultancy & Assistance Services";
    const title = cms?.metaTitle || HOMEPAGE_TITLE;
    const desc = cms?.metaDescription || HOMEPAGE_DESC;
    const faqList = ld?.faqs ?? [];
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `${baseUrl}/` },
      ],
      links: [
        { rel: "canonical", href: `${baseUrl}/` },
        // Preload the LCP image so the browser fetches it before React mounts.
        {
          rel: "preload",
          as: "image",
          href: certImg.url,
          fetchpriority: "high",
        },
      ],
      scripts: [
        jsonLdScript(orgSchema()),
        jsonLdScript(faqSchema(faqList)),
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: orgName,
          potentialAction: {
            "@type": "SearchAction",
            target: `${baseUrl}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      ],
    };
  },
  component: HomePage,
});


function HomePage() {
  const { cms, faqs: faqList } = useLoaderData({ from: "/" }) as {
    cms: ContentfulLandingPage | null;
    faqs: Array<{ q: string; a: string }>;
  };
  const factsBlock = useBlockItems<{ label: string; value: string }>(
    "home.facts",
    FACTS.map(([label, value]) => ({ label, value })),
  );
  const brand = useBrand();
  const certUrl = brand.sampleCertificateAssetUrl || certImg.url;
  const heroHeading = cms?.hero?.heading || "Udyam Registration & MSME Certificate Services";
  const heroSub = cms?.hero?.subheading ||
    "Private consultancy & assistance for new Udyam (MSME) registration, certificate updates, downloads and Udyog Aadhaar to Udyam migration — pan-India support in English & Hindi.";

  useEffect(() => {
    trackEvent("page_view_landing", { path: "/" });
  }, []);
  return (
    <>
      {/* SEO H1 — kept in DOM for crawlers, visually hidden */}
      <section className="sr-only">
        <h1>{heroHeading}</h1>
        <p>{heroSub}</p>
      </section>


      {/* Form + Sample Certificate */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:py-8 grid gap-6 lg:grid-cols-2 items-start">
        <LeadForm />
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="bg-form-header text-white text-center py-4">
            <h2 className="text-xl font-bold font-display">Sample Certificate</h2>
          </div>
          <div className="p-6">
            <img
              src={certUrl}
              alt={`Sample ${brand.siteName} certificate`}
              width={1200}
              height={849}
              className="w-full h-auto rounded-md border border-border"
              loading="eager"
              fetchPriority="high"
            />

            <p className="mt-3 text-center text-sm text-muted-foreground text-slate-950">
              Note: Sample Udyam Certificate shown for reference purposes only.
            </p>
          </div>
        </div>
      </section>

      {/* TLDR — crawlable HTML, keyword in first 40 words */}
      <section className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">
          About Udyam Registration
        </h2>
        <div className="mt-4 space-y-4 text-sm md:text-base leading-relaxed text-foreground/85">
          <p>
            Udyam registration is the government certificate that officially
            recognises your business as a Micro, Small, or Medium Enterprise
            (MSME) under the Ministry of MSME, Government of India. It was
            formerly known as Udyog Aadhar. Every business that qualifies for
            MSME status — whether a manufacturer, trader, or service provider —
            benefits from the protections, subsidies and financial advantages
            that come with a valid Udyam certificate.
          </p>
          <p>
            Business Help Services provides professional consultancy assistance
            for the complete Udyam registration process. We help new applicants
            register, existing certificate holders update their details,
            businesses download or reprint their certificate and Udyog Aadhar
            holders migrate to the new Udyam system. Our team has assisted
            businesses across India — from solo proprietors in Pune to
            multi-location manufacturers in Gujarat and Tamil Nadu.
          </p>
          <p>
            If you have questions about eligibility, documents, or what your
            certificate covers, our experts are available during business
            hours. Fill the form above or call us directly.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-brand-navy/5">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">
            How Business Help Services Works
          </h2>
          <p className="mt-3 text-sm md:text-base text-foreground/80">
            We have designed the process to be as straightforward as possible.
            Here is what happens after you submit the form:
          </p>
          <ol className="mt-4 list-decimal pl-6 space-y-2 text-sm md:text-base text-foreground/85">
            {howItWorks.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">
          Why Business Owners Trust Us
        </h2>
        <div className="mt-4 space-y-3 text-sm md:text-base leading-relaxed text-foreground/85">
          <p>
            Most Udyam-related applications that get rejected or delayed have
            one thing in common — a mismatch between the details in the
            Aadhaar card, PAN card and the business records. Our team checks
            every document before submission. This alone eliminates the most
            common reason applicants face rejections.
          </p>
          <p>Beyond document checking, here is what our clients consistently tell us they value:</p>
          <ul className="list-disc pl-6 space-y-1">
            {whyUs.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ — visible HTML answers */}
      <section className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold font-display text-foreground leading-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-center text-xs md:text-sm tracking-widest uppercase text-muted-foreground">
          Udyam &amp; MSME Registration — Apply, Update, Download
        </p>

        <dl className="mt-8 md:mt-10 space-y-4">
          {faqList.map((f, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-4 md:p-5"
            >
              <dt className="text-left text-base md:text-lg font-semibold font-display text-foreground">
                {f.q}
              </dt>
              <dd className="mt-2 text-foreground/85 leading-relaxed text-sm md:text-base">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <Button
            asChild
            size="lg"
            className="bg-brand-navy text-white hover:bg-brand-navy-deep shadow-sm"
          >
            <Link to="/faqs">
              Read all Udyam registration FAQs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-brand-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <h2 className="text-center text-2xl md:text-3xl font-bold font-display text-foreground">
            Udyam Assistance Process – Fast &amp; Simple
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4 items-start">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Icon className={`w-9 h-9 md:w-11 md:h-11 ${s.color}`} strokeWidth={2} />
                  </div>
                  <p className="mt-4 font-bold text-foreground text-sm md:text-base leading-snug max-w-[12ch]">
                    {s.label}
                  </p>
                  {i < STEPS.length - 1 && (
                    <ArrowRight
                      className="hidden md:block absolute top-10 -right-3 w-6 h-6 text-foreground"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* India Coverage + Served States */}
      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <div className="bg-muted/40 px-6 py-5 border-b border-border">
            <h2 className="text-center text-2xl md:text-3xl font-bold font-display text-foreground">
              We Provide Consultancy Services Across India
            </h2>
          </div>
          <div className="p-6 text-sm md:text-base text-foreground/85 leading-relaxed">
            <p>
              Business Help Services operates as a national consultancy,
              assisting clients in every state and union territory. Our team
              has handled Udyam registrations and MSME certificate services for
              businesses in Maharashtra, Gujarat, Rajasthan, Uttar Pradesh,
              Madhya Pradesh, Karnataka, Tamil Nadu, Telangana, West Bengal,
              Punjab and beyond. Language is not a barrier — we support
              consultations in Hindi &amp; English.
            </p>
          </div>
          <div className="p-4 md:p-6 flex justify-center border-t border-border">
            <img
              src={mapImg.url}
              alt="Map of India showing all states where consultancy services are provided"
              className="w-full max-w-xl h-auto"
              loading="lazy"
            />
          </div>
          <table className="w-full border-t border-border text-sm md:text-base">
            <tbody>
              {factsBlock.map(({ label: k, value: v }) => (
                <tr key={k} className="border-b border-border last:border-b-0">
                  <th
                    scope="row"
                    className="w-1/2 text-left font-normal text-foreground px-4 md:px-6 py-4 border-r border-border"
                  >
                    {k}
                  </th>
                  <td className="px-4 md:px-6 py-4 text-foreground">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
