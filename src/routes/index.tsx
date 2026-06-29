import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/site/LeadForm";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { UserSquare2, Fingerprint, Share2, Download, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";
import certImg from "@/assets/udyam-sample-certificate.png.asset.json";
import mapImg from "@/assets/india-map.svg.asset.json";
import {
  orgSchema,
  faqSchema,
  jsonLdScript,
} from "@/lib/seo/jsonld";

const HOMEPAGE_TITLE =
  "Udyam Registration Assistance | MSME Certificate Help — Business Help Services";
const HOMEPAGE_DESC =
  "Get expert assistance for Udyam registration, MSME certificate download, Udyog Aadhar update and migration. Private consultancy service. Apply online today.";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Is Business Help Services an official government website?",
    a: "No. Business Help Services is a private professional consultancy. We are not affiliated with or endorsed by the Ministry of MSME, the Government of India, or any government authority. The official portal for Udyam registration is udyamregistration.gov.in. Our service provides paid professional assistance to help individuals and businesses navigate the registration, update and download processes correctly and efficiently.",
  },
  {
    q: "What is Udyam registration and who needs it?",
    a: "Udyam registration is the official MSME certificate issued by the Government of India to micro, small and medium enterprises. Any business — sole proprietorship, partnership, private limited company, or LLP — that qualifies as an MSME under the Ministry's turnover and investment thresholds is eligible. Having a valid Udyam certificate enables access to government schemes, priority sector lending, collateral-free loans and various subsidies under MSME-linked programmes.",
  },
  {
    q: "What does Business Help Services charge and are these government fees?",
    a: "Our fees are strictly professional service charges for consultancy and assistance. They are not government fees. Udyam registration on the official government portal is free of cost. What we charge covers our team's time, document verification, process management and follow-up support. Our pricing is clearly listed on our Pricing Transparency page. We do not collect any amount that goes to the government.",
  },
  {
    q: "What documents are required for Udyam registration?",
    a: "The primary documents needed are: the applicant's Aadhaar card (linked to the registered mobile number for OTP verification), PAN card of the business owner or entity and the business bank account details. For companies and LLPs, the entity's PAN is used rather than the individual's. If any of your documents have mismatched details — for example, the name on Aadhaar differs from the name on PAN — our team can guide you through the correction process before registration.",
  },
  {
    q: "How long does the Udyam registration process take?",
    a: "In most cases, once our team has all verified documents and information, the registration process is completed within 1 to 2 business days. Download and reprint services are typically completed on the same day. Updates and migrations may take 2 to 3 business days depending on the nature of the change. We communicate the expected timeline clearly at the time of service confirmation.",
  },
  {
    q: "Can I update my Udyam certificate after it has been issued?",
    a: "Yes. The Udyam certificate can be updated if your business details have changed — including business name, address, additional activities, investment figures, or turnover. Updates are done on the official portal and require Aadhaar-linked OTP verification. If you no longer have access to the registered mobile number or email, that requires a separate process. Our team handles all types of updates, including cases where the original contact details are no longer accessible.",
  },
  {
    q: "What is Udyog Aadhar and how is it different from Udyam registration?",
    a: "Udyog Aadhar was the previous MSME registration system used before 2020. It has been replaced by the Udyam registration system. Businesses that have a Udyog Aadhar number need to migrate to Udyam to ensure their certificate remains valid and recognised. Business Help Services provides specific migration assistance for Udyog Aadhar to Udyam transition, which is a separate service from new registration.",
  },
  {
    q: "I tried registering on my own and it failed. Can you still help me?",
    a: "Yes, this is one of the most common situations we handle. Failed or incomplete applications can often be corrected and resubmitted. The most frequent causes are OTP failures due to unlinked Aadhaar, name mismatches between documents, incorrect NIC codes for business activity and PAN-related errors. Our team reviews the issue first and advises whether a correction or fresh application is the right approach, before any work begins.",
  },
];

const HOW_IT_WORKS = [
  "You fill the form and select your service — registration, update, download, migration, or a custom issue.",
  "You make the consultancy payment online through our secure payment gateway.",
  "Our team reviews your request and calls or emails you within 2 business hours (Monday to Saturday, 10 AM to 5 PM IST).",
  "We collect the necessary information and documents from you securely.",
  "Our expert handles the process, verifies all details and submits on your behalf.",
  "You receive your Udyam certificate or confirmation via email, typically within 1 to 3 business days depending on the service.",
];

const WHY_BULLETS = [
  "No back-and-forth with government portals — we handle the process end to end.",
  "Clear communication — we explain exactly what we are doing and why.",
  "Support in Hindi and English.",
  "Transparent pricing — what you see on our pricing page is what you pay. No hidden charges.",
  "Expert knowledge of scheme updates — we stay current on MSME Ministry changes so you do not have to.",
];

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
  // Prerender the homepage at build time → static HTML served from edge,
  // eliminating per-request SSR latency (TTFB win).
  prerender: { enabled: true },
  head: () => ({
    meta: [
      { title: HOMEPAGE_TITLE },
      { name: "description", content: HOMEPAGE_DESC },
      { property: "og:title", content: HOMEPAGE_TITLE },
      { property: "og:description", content: HOMEPAGE_DESC },
      { property: "og:url", content: "https://udyamadhar.in/" },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/" },
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
      jsonLdScript(faqSchema(FAQS)),
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://udyamadhar.in/#website",
        url: "https://udyamadhar.in/",
        name: "Udyam Registration Consultancy & Assistance Services",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://udyamadhar.in/faqs?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }),
    ],
  }),
  component: HomePage,
});


function HomePage() {
  useEffect(() => {
    trackEvent("page_view_landing", { path: "/" });
  }, []);
  return (
    <>
      {/* SEO H1 — kept in DOM for crawlers, visually hidden */}
      <section className="sr-only">
        <h1>Udyam Registration &amp; MSME Certificate Services</h1>
        <p>
          Private consultancy &amp; assistance for new Udyam (MSME) registration,
          certificate updates, downloads and Udyog Aadhaar to Udyam migration —
          pan-India support in English &amp; Hindi.
        </p>
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
              src={certImg.url}
              alt="Sample Udyam Certificate"
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
            {HOW_IT_WORKS.map((s, i) => (
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
            {WHY_BULLETS.map((b, i) => (
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
          {FAQS.map((f, i) => (
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
              {FACTS.map(([k, v]) => (
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
