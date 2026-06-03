import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-msme-udyam-certificate.html?raw";

export const Route = createFileRoute("/print-msme-udyam-certificate")({
    head: () => ({
    meta: [
      { title: "Print MSME Udyam Certificate | Online Printing Guide" },
      { name: "description", content: "Expert consultancy assistance for print msme udyam certificate | online printing guide. Get help with Udyam/MSME registration, updates and certificates acros..." },
      { property: "og:title", content: "Print MSME Udyam Certificate | Online Printing Guide" },
      { property: "og:description", content: "Expert consultancy assistance for print msme udyam certificate | online printing guide. Get help with Udyam/MSME registration, updates and certificates acros..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-msme-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Print MSME Udyam Certificate" linkTitle="Print MSME Udyam Certificate | Online Printing Guide" html={html} />,
});
