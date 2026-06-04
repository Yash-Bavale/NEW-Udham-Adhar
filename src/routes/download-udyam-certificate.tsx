import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate.html?raw";

export const Route = createFileRoute("/download-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Download Udyam Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Download Udyam Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Download Udyam Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Download Udyam Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Certificate" linkTitle="Download Udyam Certificate" html={html} />,
});
