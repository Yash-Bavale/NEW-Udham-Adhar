import { createFileRoute } from "@tanstack/react-router";
import { RichServicePage, type RichBlock } from "@/components/site/RichServicePage";
import {
  jsonLdScript,
  faqSchema,
  howToSchema,
  breadcrumbSchema,
} from "@/lib/seo/jsonld";

const URL = "https://udyamadhar.in/udyam-registration-process";
const TITLE = "Udyam Registration Process | Step-by-Step MSME Guide (2026)";
const DESC =
  "Complete step-by-step guide to the Udyam (MSME) registration process — eligibility, documents, NIC codes, OTP, certificate issuance and post-registration compliance.";

const FAQS = [
  {
    q: "How long does the Udyam registration process actually take?",
    a: "If all documents (Aadhaar, PAN, bank details, NIC code) are ready and the registered mobile is accessible for OTP, the process itself takes about 10–20 minutes online. Through our consultancy, end-to-end delivery — including verification and email of the signed certificate — typically completes within 1 to 2 business days.",
  },
  {
    q: "Do I need separate Udyam registrations for multiple branches?",
    a: "No. A single Udyam registration covers all branches of the same enterprise. You can add multiple NIC activities and addresses within one Udyam record. Separate registrations are only needed for separate legal entities.",
  },
  {
    q: "What is an NIC code and how do I pick the right one?",
    a: "The National Industrial Classification (NIC) code identifies your business activity. Picking the wrong code can affect tender eligibility and scheme access. We help you choose the correct primary NIC and any additional activity codes during the application.",
  },
  {
    q: "Does the process change between manufacturing and service businesses?",
    a: "The portal is the same, but the NIC code, investment and turnover treatment differs. Manufacturers and service providers both qualify; the system automatically classifies the enterprise as Micro, Small, or Medium based on the values entered.",
  },
];

const STEPS = [
  {
    name: "Check eligibility",
    text: "Confirm that your business meets the MSME thresholds for investment and turnover.",
  },
  {
    name: "Gather documents",
    text: "Keep ready: Aadhaar of the proprietor / signatory, business PAN, bank details, address proof and GSTIN if applicable.",
  },
  {
    name: "Identify your NIC code",
    text: "Pick the correct primary activity and any additional NIC codes. This affects future scheme eligibility.",
  },
  {
    name: "Submit on the Udyam portal",
    text: "File the application on udyamregistration.gov.in. Aadhaar OTP is mandatory.",
  },
  {
    name: "OTP verification",
    text: "An OTP is sent to the Aadhaar-linked mobile. Verify to authenticate the submission.",
  },
  {
    name: "Receive the certificate",
    text: "A digitally signed Udyam certificate with QR code and URN is generated and emailed.",
  },
  {
    name: "Post-registration compliance",
    text: "Keep your investment, turnover, bank and contact details current via timely updates on the portal.",
  },
];

const BLOCKS: RichBlock[] = [
  { type: "h2", text: "Who is eligible for Udyam registration?" },
  {
    type: "p",
    text: "Any business — proprietorship, partnership, LLP, HUF, private limited or public company — engaged in manufacturing or services and meeting the MSME investment and turnover thresholds is eligible for Udyam registration.",
  },
  { type: "h2", text: "MSME classification — current thresholds" },
  {
    type: "table",
    headers: ["Category", "Investment in Plant & Machinery", "Annual Turnover"],
    rows: [
      ["Micro", "Up to ₹2.5 Crore", "Up to ₹10 Crore"],
      ["Small", "Up to ₹25 Crore", "Up to ₹100 Crore"],
      ["Medium", "Up to ₹125 Crore", "Up to ₹500 Crore"],
    ],
  },
  {
    type: "note",
    text: "Classification thresholds are revised periodically by the Ministry of MSME. Always refer to udyamregistration.gov.in for the current limits before applying.",
  },
  { type: "h2", text: "Full step-by-step Udyam registration process" },
  { type: "ol", items: STEPS.map((s) => `${s.name}: ${s.text}`) },
  { type: "h2", text: "Common reasons applications get rejected" },
  {
    type: "ul",
    items: [
      "Name on Aadhaar does not match name on PAN.",
      "Aadhaar mobile is inactive — OTP cannot be received.",
      "Wrong NIC code chosen for the actual activity.",
      "PAN mismatch between proprietor PAN and entity PAN for companies/LLPs.",
      "Bank account in a different name than the registered entity.",
    ],
  },
  { type: "h2", text: "How Business Help Services simplifies the process" },
  {
    type: "p",
    text: "We handle the entire process — eligibility check, document verification, NIC selection, application submission, OTP coordination and certificate delivery. Our team also advises on corrections (Aadhaar / PAN / GST) when they are required as prerequisites.",
  },
  { type: "h2", text: "Frequently Asked Questions" },
  { type: "faq", items: FAQS },
];

export const Route = createFileRoute("/udyam-registration-process")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      jsonLdScript(
        howToSchema({
          name: "Udyam Registration Process — Step-by-Step",
          totalTime: "P2D",
          steps: STEPS,
        }),
      ),
      jsonLdScript(faqSchema(FAQS)),
      jsonLdScript(
        breadcrumbSchema([
          { name: "Home", url: "https://udyamadhar.in/" },
          { name: "Udyam Registration Process", url: URL },
        ]),
      ),
    ],
  }),
  component: () => (
    <RichServicePage
      h1="Udyam Registration Process — Complete Step-by-Step Guide"
      intro="A clear, end-to-end guide to the Udyam (MSME) registration process: eligibility thresholds, documents, NIC code selection, OTP verification, certificate issuance and post-registration compliance. Updated for 2026."
      blocks={BLOCKS}
    />
  ),
});
