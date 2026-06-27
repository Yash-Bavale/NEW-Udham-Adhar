import { createFileRoute } from "@tanstack/react-router";
import { RichServicePage, type RichBlock } from "@/components/site/RichServicePage";
import {
  jsonLdScript,
  serviceSchema,
  faqSchema,
  howToSchema,
  breadcrumbSchema,
} from "@/lib/seo/jsonld";

const URL = "https://udyamadhar.in/verify-udyam-certificate";
const TITLE = "Verify Udyam Certificate Online | URN Verification Assistance";
const DESC =
  "Verify a Udyam (MSME) registration certificate using the Udyam Registration Number (URN). Professional assistance to authenticate your or a vendor's MSME certificate.";

const FAQS = [
  {
    q: "How can I verify if a Udyam certificate is genuine?",
    a: "Every Udyam certificate carries a unique Udyam Registration Number (URN) and a QR code. The official portal lets anyone verify a URN and see basic details like enterprise name, category and date of registration. If those details match, the certificate is authentic.",
  },
  {
    q: "Why would a buyer or bank ask me to verify my Udyam?",
    a: "Many large buyers, tender bodies and banks independently verify the URN before extending MSME-specific benefits (e.g., priority sector loans, vendor payment protection under the MSMED Act). Our team can prepare a clean verification report you can share with them.",
  },
  {
    q: "Do you charge for verification?",
    a: "The official portal verification is free. We charge a professional fee only when you ask us to perform the verification on your behalf, prepare a verification snapshot or fix mismatches in your data.",
  },
  {
    q: "What should I do if verification shows wrong details?",
    a: "Mismatches usually mean your Udyam details are outdated or were entered incorrectly. In that case you need to use the 'Update Udyam Certificate' service to fix the records on the official portal.",
  },
];

const STEPS = [
  {
    name: "Share the Udyam Registration Number (URN)",
    text: "Send us the URN — usually in the format UDYAM-XX-00-0000000.",
  },
  {
    name: "Official portal lookup",
    text: "We verify the URN on the Ministry of MSME's Udyam portal and pull the registered enterprise details.",
  },
  {
    name: "Snapshot & report",
    text: "You receive a clean verification snapshot (PDF) you can share with banks, buyers or tender authorities.",
  },
];

const BLOCKS: RichBlock[] = [
  { type: "h2", text: "Why verify a Udyam certificate?" },
  {
    type: "p",
    text: "Udyam certificate verification confirms that an MSME registration is genuine, currently valid and tied to the correct business. It is commonly required by buyers, banks, tender authorities and large vendors before extending MSME-linked benefits.",
  },
  { type: "h2", text: "Information needed to verify" },
  {
    type: "ul",
    items: [
      "Udyam Registration Number (URN) — typically in the format UDYAM-XX-00-0000000.",
      "Registered mobile or email if you need detailed verification beyond what is publicly visible.",
    ],
  },
  { type: "h2", text: "Process we follow" },
  { type: "ol", items: STEPS.map((s) => `${s.name}: ${s.text}`) },
  {
    type: "note",
    text: "Verification on the official Udyam portal is free. Our charge applies only if you ask Business Help Services to perform the verification, prepare a snapshot, or fix detected mismatches.",
  },
  { type: "h2", text: "Frequently Asked Questions" },
  { type: "faq", items: FAQS },
];

export const Route = createFileRoute("/verify-udyam-certificate")({
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
        serviceSchema({
          name: "Udyam Certificate Verification",
          url: URL,
          description: DESC,
        }),
      ),
      jsonLdScript(
        howToSchema({
          name: "How to verify a Udyam certificate using the URN",
          totalTime: "PT1H",
          steps: STEPS,
        }),
      ),
      jsonLdScript(faqSchema(FAQS)),
      jsonLdScript(
        breadcrumbSchema([
          { name: "Home", url: "https://udyamadhar.in/" },
          { name: "Verify Udyam Certificate", url: URL },
        ]),
      ),
    ],
  }),
  component: () => (
    <RichServicePage
      serviceTitle="Verify Udyam Certificate"
      h1="Verify Udyam Certificate — URN Authentication & Snapshot"
      intro="Need to verify a Udyam (MSME) certificate — your own or a vendor's? Business Help Services helps you authenticate the Udyam Registration Number (URN) on the official portal and prepares a clean verification snapshot for buyers, banks and tender authorities."
      blocks={BLOCKS}
    />
  ),
});
