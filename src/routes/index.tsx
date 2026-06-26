import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/site/LeadForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { UserSquare2, Fingerprint, Share2, Download, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";
import certImg from "@/assets/udyam-sample-certificate.png.asset.json";
import mapImg from "@/assets/india-map.svg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Online — Apply, Update & Download MSME Certificate" },
      {
        name: "description",
        content:
          "Udyam (MSME) registration consultancy: apply for new Udyam certificate, update details, download Udyam / Udyog Aadhaar certificate. Pan-India assistance.",
      },
      { property: "og:title", content: "Udyam Registration Online — Apply, Update & Download MSME Certificate" },
      {
        property: "og:description",
        content:
          "Udyam (MSME) registration consultancy: new registration, certificate updates, downloads and Udyog Aadhaar migration. Trusted assistance across India.",
      },
      { property: "og:url", content: "https://udyamadhar.in/" },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://udyamadhar.in/#organization",
              name: "Business Help Services",
              url: "https://udyamadhar.in/",
              description:
                "Private consultancy providing assistance with Udyam/MSME registration, certificate updates, downloads and Udyog Aadhaar migration across India.",
              areaServed: "IN",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pune",
                addressRegion: "MH",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "help@businesshelpservices.com",
                areaServed: "IN",
                availableLanguage: ["en", "hi"],
              },
            },
            {
              "@type": "LocalBusiness",
              "@id": "https://udyamadhar.in/#localbusiness",
              name: "Business Help Services",
              url: "https://udyamadhar.in/",
              image: "https://udyamadhar.in/",
              priceRange: "₹₹",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pune",
                addressRegion: "MH",
                addressCountry: "IN",
              },
              areaServed: "IN",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "10:00",
                  closes: "18:00",
                },
              ],
            },
            {
              "@type": "Service",
              name: "Udyam / MSME Registration Assistance",
              serviceType: "Business registration consultancy",
              provider: { "@id": "https://udyamadhar.in/#organization" },
              areaServed: "IN",
              description:
                "Consultancy assistance for new Udyam registration, certificate updates, downloads, Udyog Aadhaar to Udyam migration and related corrections.",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Udyam consultancy services",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "New Udyam Registration assistance" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Update Udyam Certificate assistance" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Download Udyam Certificate assistance" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Udyog Aadhaar to Udyam migration assistance" } },
                ],
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q.replace(/^\d+\.\s*/, ""),
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "WebSite",
              "@id": "https://udyamadhar.in/#website",
              url: "https://udyamadhar.in/",
              name: "Udyam Registration Consultancy & Assistance Services",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://udyamadhar.in/faqs?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://udyamadhar.in/",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});


const FAQS = [
  {
    q: "1. What is Business Help Services?",
    a: "Business Help Services is an online registration process for Micro, Small, and Medium Enterprises (MSMEs) in India, subject to applicable eligibility criteria and regulations.",
  },
  {
    q: "2. Who can apply for Business Help Services?",
    a: "Eligible proprietors, startups, traders, service providers, manufacturers, partnerships, companies, and other business entities operating as MSMEs may apply subject to applicable rules and eligibility conditions.",
  },
  {
    q: "3. What is the use of Business Help Services for businesses?",
    a: "Business Help Services may help businesses maintain MSME registration records and may be used wherever applicable for business-related documentation, compliance, financial, operational, or institutional purposes subject to applicable policies and eligibility conditions.",
  },
  {
    q: "4. Can I update or modify my Business Help Services details?",
    a: "Subject to applicable rules and portal functionality, certain business details such as address, mobile number, email, business activity, or other information may be updated through the relevant process and verification requirements.",
  },
  {
    q: "5. What should I do if my registered mobile number or email is no longer accessible?",
    a: "Depending upon applicable procedures and verification requirements, users may request assistance for updating or recovering registered contact details wherever permitted.",
  },
  {
    q: "6. Can I download my Udyam Certificate online?",
    a: "Subject to applicable verification procedures and portal availability, Udyam-related certificates or acknowledgments may be downloaded or retrieved through the relevant process wherever available.",
  },
  {
    q: "7. What documents or information may be required for Udyam-related services?",
    a: "Depending upon the requested service, users may be required to provide details such as Aadhaar information, PAN information, business details, OTP verification, contact details, or other supporting information wherever applicable.",
  },
  {
    q: "8. Is OTP verification required for certain Udyam-related processes?",
    a: "Yes. Certain services or updates may require OTP verification, authentication confirmation, or consent-based validation depending upon the applicable process and system requirements.",
  },
  {
    q: "9. Can businesses update business activity or classification details in Udyam records?",
    a: "Subject to applicable procedures and verification requirements, certain business-related details including activity classification or related information may be updated wherever permitted.",
  },
  {
    q: "10. What happens if incorrect information is submitted during registration or update?",
    a: "Incorrect, incomplete, inconsistent, or unverifiable information may affect processing, verification, communication, eligibility assessment, or successful completion of the requested service.",
  },
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

function HomePage() {
  useEffect(() => {
    trackEvent("page_view_landing", { path: "/" });
  }, []);
  return (
    <>
      {/* SEO H1 — visible above the fold */}
      <section className="mx-auto max-w-7xl px-4 pt-6 md:pt-8">
        <h1 className="text-2xl md:text-4xl font-extrabold font-display text-brand-navy leading-tight">
          Udyam Registration Online — Apply, Update &amp; Download MSME Certificate
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-3xl">
          Private consultancy &amp; assistance for new Udyam (MSME) registration, certificate updates,
          downloads and Udyog Aadhaar to Udyam migration — pan-India support in English &amp; Hindi.
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

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold font-display text-foreground leading-tight">
          Frequently Asked Questions for MSME registration in India.
        </h2>
        <p className="mt-4 text-center text-xs md:text-sm tracking-widest uppercase text-muted-foreground">
          MSME Business Help Services Online, SSI – Small Scale Industries Certificate – Update, Edit, and Download Acknowledgement
        </p>

        <Accordion type="single" collapsible className="mt-8 md:mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold font-display hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* SSR-visible FAQ mirror for crawlers — Radix Accordion does not render closed panels in HTML */}
        <div className="sr-only" aria-hidden="true">
          {FAQS.map((f, i) => (
            <div key={`faq-ssr-${i}`}>
              <h3>{f.q.replace(/^\d+\.\s*/, "")}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <Button
            asChild
            size="lg"
            className="bg-brand-navy text-white hover:bg-brand-navy-deep shadow-sm"
          >
            <Link to="/faqs">
              Read More <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* India Coverage */}
      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <div className="bg-muted/40 px-6 py-5 border-b border-border">
            <h2 className="text-center text-2xl md:text-3xl font-bold font-display text-foreground">
              We provide consultancy services across India.
            </h2>
          </div>
          <div className="p-4 md:p-6 flex justify-center">
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
