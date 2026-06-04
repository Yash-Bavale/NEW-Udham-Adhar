import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-apply-online.html?raw";

export const Route = createFileRoute("/udyam-certificate-apply-online")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Apply Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Certificate Apply provides a fast and secure way for businesses to register under the MSME scheme and obtain their official certificate. By entering Aadhaar and business details, the certificate is issued instantly in PDF format for banking, tenders, and government schemes. The process is completely online,..." },
      { property: "og:title", content: "Udyam Certificate Apply Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Certificate Apply provides a fast and secure way for businesses to register under the MSME scheme and obtain their official certificate. By entering Aadhaar and business details, the certificate is issued instantly in PDF format for banking, tenders, and government schemes. The process is completely online,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-apply-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Apply Online" linkTitle="Udyam Certificate Apply Online" html={html} />,
});
