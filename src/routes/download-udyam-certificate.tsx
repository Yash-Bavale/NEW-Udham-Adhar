import { createFileRoute } from "@tanstack/react-router";
import { RichServicePage, type RichBlock } from "@/components/site/RichServicePage";
import {
  jsonLdScript,
  serviceSchema,
  faqSchema,
  howToSchema,
  breadcrumbSchema,
} from "@/lib/seo/jsonld";

const URL = "https://udyamadhar.in/download-udyam-certificate";
const TITLE = "Download Udyam Certificate Online | MSME Certificate Reprint";
const DESC =
  "Download or reprint your Udyam (MSME) certificate with consultancy assistance. We retrieve, verify and email a clean PDF copy — even if you have lost the credentials.";

const FAQS = [
  {
    q: "Can I download my Udyam certificate without the registered mobile number?",
    a: "OTP-based download requires access to the registered mobile or email. If you no longer have access, our team can guide you on the official process to update the contact details first, after which the download can proceed.",
  },
  {
    q: "Is the downloaded certificate the same as the original?",
    a: "Yes. The Udyam certificate is a digitally signed PDF issued by the Ministry of MSME. Every authentic download from the official portal contains the same QR code, URN and signature — there is no separate 'original' physical copy.",
  },
  {
    q: "How long does the download service take?",
    a: "Most download requests are completed on the same business day once we have your Udyam Registration Number (URN) or the registered mobile number for OTP verification.",
  },
  {
    q: "Do you charge a government fee for download?",
    a: "No. There is no government fee for downloading the Udyam certificate. Our fee is a professional service charge for handling the retrieval, verification and delivery on your behalf.",
  },
  {
    q: "What if I have forgotten my Udyam Registration Number?",
    a: "We can retrieve it using your registered mobile or email through the 'Forgot URN' flow on the official portal. Share your Aadhaar number and registered contact, and we will handle the rest.",
  },
];

const STEPS = [
  {
    name: "Share your URN or registered mobile",
    text: "Provide your Udyam Registration Number or the mobile/email linked to your Udyam account.",
  },
  {
    name: "OTP verification",
    text: "We coordinate the OTP with you (sent by the official portal) to authenticate the download.",
  },
  {
    name: "Retrieval & quality check",
    text: "We download the digitally signed PDF, verify the QR code and ensure all details are legible.",
  },
  {
    name: "Email delivery",
    text: "The certificate is emailed to you in clean PDF format, typically within a few hours.",
  },
];

const BLOCKS: RichBlock[] = [
  { type: "h2", text: "When you need this service" },
  {
    type: "ul",
    items: [
      "You lost the original PDF and need a fresh copy.",
      "You need a clean, print-ready certificate for a bank or tender.",
      "You forgot your Udyam Registration Number (URN).",
      "You are unsure whether your previous download is the latest version.",
    ],
  },
  { type: "h2", text: "How the Udyam certificate download process works" },
  { type: "ol", items: STEPS.map((s) => `${s.name}: ${s.text}`) },
  { type: "h2", text: "Documents / information required" },
  {
    type: "ul",
    items: [
      "Udyam Registration Number (URN), if available.",
      "Aadhaar number of the registered proprietor / signatory.",
      "Access to the registered mobile number or email for OTP.",
    ],
  },
  {
    type: "note",
    text: "The official Udyam portal does not charge any fee for certificate download. Our charge is strictly a professional consultancy fee.",
  },
  { type: "h2", text: "Frequently Asked Questions" },
  { type: "faq", items: FAQS },
];

export const Route = createFileRoute("/download-udyam-certificate")({
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
          name: "Download Udyam Certificate",
          url: URL,
          description: DESC,
        }),
      ),
      jsonLdScript(
        howToSchema({
          name: "How to download the Udyam certificate",
          totalTime: "PT4H",
          steps: STEPS,
        }),
      ),
      jsonLdScript(faqSchema(FAQS)),
      jsonLdScript(
        breadcrumbSchema([
          { name: "Home", url: "https://udyamadhar.in/" },
          { name: "Download Udyam Certificate", url: URL },
        ]),
      ),
    ],
  }),
  component: () => (
    <RichServicePage
      serviceTitle="Download Udyam Certificate"
      h1="Download Udyam Certificate — Reprint Your MSME Certificate"
      intro="Lost your Udyam certificate or need a clean, print-ready copy? Business Help Services helps you retrieve and download your Udyam (MSME) certificate quickly — even if you have forgotten the Udyam Registration Number."
      blocks={BLOCKS}
    />
  ),
});
