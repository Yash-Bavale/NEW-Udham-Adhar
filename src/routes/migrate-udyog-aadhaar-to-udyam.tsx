import { createFileRoute } from "@tanstack/react-router";
import { getContentfulServicePage, type ContentfulServicePage } from "@/lib/contentful/client.functions";
import { RichServicePage, type RichBlock } from "@/components/site/RichServicePage";
import {
  jsonLdScript,
  serviceSchema,
  faqSchema,
  howToSchema,
  breadcrumbSchema,
} from "@/lib/seo/jsonld";

const URL = "https://udyamadhar.in/migrate-udyog-aadhaar-to-udyam";
const TITLE = "Migrate Udyog Aadhar to Udyam | UAM Migration Assistance";
const DESC =
  "Migrate your existing Udyog Aadhar (UAM) to the new Udyam registration. Consultancy assistance to validate, re-register and obtain a digitally signed Udyam certificate.";

const FAQS = [
  {
    q: "Why must Udyog Aadhar be migrated to Udyam?",
    a: "The Government replaced the Udyog Aadhar Memorandum (UAM) system with the Udyam registration system in 2020. Banks, tender authorities and many ministries now recognise only the Udyam certificate. UAM-based registrations are gradually phased out, which is why migration is necessary to retain MSME benefits.",
  },
  {
    q: "Will my Udyog Aadhar Number (UAN) become my Udyam Number?",
    a: "No. Migration generates a fresh Udyam Registration Number (URN). The old UAN is retained as a reference only. The new Udyam certificate, with the new URN, is the valid MSME certificate going forward.",
  },
  {
    q: "What if my UAM details are outdated?",
    a: "If your business details have changed since the original UAM, you should provide the latest information during migration. Our team verifies your inputs against Aadhaar, PAN and GST records before submission to prevent rejection.",
  },
  {
    q: "Can I migrate without the original UAM acknowledgement?",
    a: "Yes. We can retrieve the UAN using your Aadhaar and registered mobile number on the official portal. The acknowledgement copy is helpful but not mandatory.",
  },
  {
    q: "How long does migration take?",
    a: "Most migration cases are completed within 2 to 3 business days once we have your UAN, Aadhaar, PAN and access to the OTP-linked mobile.",
  },
];

const STEPS = [
  {
    name: "Retrieve / verify your UAN",
    text: "We confirm your existing Udyog Aadhar Number and the linked Aadhaar / PAN records.",
  },
  {
    name: "Update business information",
    text: "Latest investment, turnover, address, NIC activity and bank account are captured for the migration application.",
  },
  {
    name: "Submission & OTP",
    text: "We submit the migration on the official portal and coordinate the Aadhaar-OTP with you.",
  },
  {
    name: "Issuance of new Udyam certificate",
    text: "The Ministry issues a fresh Udyam certificate with a new URN, which we email to you in PDF.",
  },
];

const BLOCKS: RichBlock[] = [
  { type: "h2", text: "Who should migrate?" },
  {
    type: "p",
    text: "Any business that holds an old Udyog Aadhar Memorandum (UAM) — typically issued between 2015 and 2020 — should migrate to Udyam to retain access to MSME benefits, government tenders, priority sector lending and subsidies. If you registered for MSME before July 2020, this service applies to you.",
  },
  { type: "h2", text: "Documents required" },
  {
    type: "ul",
    items: [
      "Existing Udyog Aadhar Number (UAN) or acknowledgement copy.",
      "Aadhaar of the proprietor / authorised signatory.",
      "PAN of the business (or proprietor for sole proprietorships).",
      "Bank account details, current address proof, GSTIN (if applicable).",
      "Access to the registered mobile for OTP verification.",
    ],
  },
  { type: "h2", text: "Migration process we handle for you" },
  { type: "ol", items: STEPS.map((s) => `${s.name}: ${s.text}`) },
  {
    type: "note",
    text: "Government fee for migration is ₹0. Our charge is a professional consultancy fee published on our Pricing Transparency page. We are a private firm — not part of the MSME Ministry.",
  },
  { type: "h2", text: "Frequently Asked Questions" },
  { type: "faq", items: FAQS },
];

export const Route = createFileRoute("/migrate-udyog-aadhaar-to-udyam")({
  loader: async () => ({ cms: await getContentfulServicePage({ data: { slug: "migrate-udyog-aadhaar-to-udyam" } }) }),
  head: ({ loaderData }) => {
    const cms = (loaderData as { cms: ContentfulServicePage | null } | undefined)?.cms;
    return ({
    meta: [
      { title: cms?.metaTitle || TITLE },
      { name: "description", content: cms?.metaDescription || DESC },
      { property: "og:title", content: cms?.metaTitle || TITLE },
      { property: "og:description", content: cms?.metaDescription || DESC },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      jsonLdScript(
        serviceSchema({
          name: "Udyog Aadhar to Udyam Migration",
          url: URL,
          description: DESC,
        }),
      ),
      jsonLdScript(
        howToSchema({
          name: "How to migrate Udyog Aadhar (UAM) to Udyam",
          totalTime: "P3D",
          steps: STEPS,
        }),
      ),
      jsonLdScript(faqSchema(FAQS)),
      jsonLdScript(
        breadcrumbSchema([
          { name: "Home", url: "https://udyamadhar.in/" },
          { name: "Migrate Udyog Aadhar to Udyam", url: URL },
        ]),
      ),
    ],
  });
  },
  component: function MigrateUdyogAadhaarPage() {
    const { cms } = Route.useLoaderData() as { cms: ContentfulServicePage | null };
    return (
      <RichServicePage
        serviceTitle={cms?.name || "Migrate Udyog Aadhaar"}
        h1={cms?.name || "Migrate Udyog Aadhar to Udyam — UAM Migration Assistance"}
        intro={
          cms?.shortDescription ||
          "Need to convert your old Udyog Aadhar Memorandum (UAM) into a valid Udyam Registration? Business Help Services provides step-by-step consultancy to complete your migration."
        }
        longDescriptionHtml={cms?.longDescription}
        blocks={cms?.longDescription ? [] : BLOCKS}
      />
    );
  },
});
