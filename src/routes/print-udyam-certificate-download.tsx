import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam-certificate-download.html?raw";

export const Route = createFileRoute("/print-udyam-certificate-download")({
  head: () => ({
    meta: [
      { title: "Print Udyam Certificate Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Print Udyam Certificate Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Print Udyam Certificate Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Print Udyam Certificate Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-udyam-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam Certificate Download" linkTitle="Print Udyam Certificate Download" html={html} />,
});
