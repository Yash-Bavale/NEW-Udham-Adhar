import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-certificate.html?raw";

export const Route = createFileRoute("/udyam-msme-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam MSME - Government Portal for MSME Registration" },
      { name: "description", content: "Udyam MSME is the official government platform for registering businesses as micro, small, or medium enterprises. Registration is entirely free, paperless, and requires Aadhaar verification for authentication. Once registered, businesses receive a unique Udyam Registration Number and a digitally signed MSME..." },
      { property: "og:title", content: "Udyam MSME - Government Portal for MSME Registration" },
      { property: "og:description", content: "Udyam MSME is the official government platform for registering businesses as micro, small, or medium enterprises. Registration is entirely free, paperless, and requires Aadhaar verification for authentication. Once registered, businesses receive a unique Udyam Registration Number and a digitally signed MSME..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Certificate" linkTitle="Udyam MSME - Government Portal for MSME Registration" html={html} />,
});
