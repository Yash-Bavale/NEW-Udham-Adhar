// JSON-LD builders for SEO schema. Inject via route head().scripts as
// `{ type: "application/ld+json", children: JSON.stringify(...) }`.

const SITE = "https://udyamadhar.in";
const ORG_ID = `${SITE}/#organization`;

export const orgSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Business Help Services",
  url: `${SITE}/`,
  logo: `${SITE}/logo.png`,
  description:
    "Private professional consultancy providing Udyam registration, MSME certificate assistance, Udyog Aadhar migration and compliance services.",
  areaServed: "India",
  knowsAbout: [
    "Udyam Registration",
    "MSME Certificate",
    "Udyog Aadhar to Udyam Migration",
    "MSME Registration Process",
    "Udyam Certificate Download",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9767870331",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["Hindi", "English", "Marathi"],
  },
  sameAs: ["https://www.linkedin.com/company/business-help-services"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Koregaon Bk, Taluka-Khed",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "410505",
    addressCountry: "IN",
  },
});

export const faqSchema = (items: Array<{ q: string; a: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const serviceSchema = (s: {
  name: string;
  url: string;
  description: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: `${s.name} — Business Help Services`,
  serviceType: s.name,
  provider: {
    "@type": "Organization",
    name: "Business Help Services",
    url: `${SITE}/`,
  },
  areaServed: { "@type": "Country", name: "India" },
  url: s.url,
  description: s.description,
});

export const howToSchema = (input: {
  name: string;
  totalTime?: string;
  steps: Array<{ name: string; text: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: input.name,
  ...(input.totalTime ? { totalTime: input.totalTime } : {}),
  step: input.steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

export const jsonLdScript = (data: unknown) => ({
  type: "application/ld+json" as const,
  children: JSON.stringify(data),
});
