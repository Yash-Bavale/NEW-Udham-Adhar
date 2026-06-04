import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download-certificate.html?raw";

export const Route = createFileRoute("/udyam-download-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Download Certificate - Instant MSME Certificate Access" },
      { name: "description", content: "Udyam download certificate allows businesses registered on the official Udyam portal to instantly access and download their MSME registration certificate online. This certificate is digitally signed and acts as legal proof of the enterprise’s micro, small, or medium status. Having the certificate enables businesses..." },
      { property: "og:title", content: "Udyam Download Certificate - Instant MSME Certificate Access" },
      { property: "og:description", content: "Udyam download certificate allows businesses registered on the official Udyam portal to instantly access and download their MSME registration certificate online. This certificate is digitally signed and acts as legal proof of the enterprise’s micro, small, or medium status. Having the certificate enables businesses..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-download-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Download Certificate" linkTitle="Udyam Download Certificate - Instant MSME Certificate Access" html={html} />,
});
