import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam-certificate-download.html?raw";

export const Route = createFileRoute("/print-udyam-certificate-download")({
    head: () => ({
    meta: [
      { title: "Print Udyam Certificate Download | Get MSME Certificate PDF" },
      { name: "description", content: "Expert consultancy assistance for print udyam certificate download | get msme certificate pdf. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Print Udyam Certificate Download | Get MSME Certificate PDF" },
      { property: "og:description", content: "Expert consultancy assistance for print udyam certificate download | get msme certificate pdf. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-udyam-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam Certificate Download | Get MSME Certificate PDF" html={html} />,
});
