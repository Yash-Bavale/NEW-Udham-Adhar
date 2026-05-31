import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam-certificate.html?raw";

export const Route = createFileRoute("/print-udyam-certificate")({
    head: () => ({
    meta: [
      { title: "Print Udyam Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for print udyam certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Print Udyam Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for print udyam certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam Certificate Online | Download Business Help Services" html={html} />,
});
