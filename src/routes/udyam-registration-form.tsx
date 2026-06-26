import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-form.html?raw";

export const Route = createFileRoute("/udyam-registration-form")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Form - Online MSME Registration Application" },
      { name: "description", content: "The Udyam registration form is the official online application required to register your business as an MSME on the Udyam portal. The form is designed to..." },
      { property: "og:title", content: "Udyam Registration Form - Online MSME Registration Application" },
      { property: "og:description", content: "The Udyam registration form is the official online application required to register your business as an MSME on the Udyam portal. The form is designed to..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-registration-form" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Form" linkTitle="Udyam Registration Form - Online MSME Registration Application" content={`The Udyam registration form is the official online application required to register your business as an MSME on the Udyam portal. The form is designed to collect essential business information such as enterprise name, type of business activity, address, and Aadhaar details for identity verification. It is completely free, secure, and easy to fill, making the process accessible for all entrepreneurs, including startups and existing businesses seeking formal recognition. Completing the Udyam registration form ensures that your business receives a unique Udyam Registration Number and a digitally signed MSME certificate. This certificate acts as legal proof of your status, allowing you to access government schemes, financial incentives, priority lending, subsidies, and participation in procurement tenders. The online form eliminates paperwork, simplifies verification, and integrates with PAN and GST data to maintain accuracy and compliance. Entrepreneurs can submit the form anytime from anywhere, making MSME registration convenient, fast, and reliable. By completing the Udyam registration form, businesses gain formal recognition, enhanced credibility with banks and clients, and the ability to leverage a wide range of government benefits designed to support small and medium enterprises in growth, expansion, and long-term sustainability.`} html={html} />,
});
