import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-print-udyam-certificate.html?raw";

export const Route = createFileRoute("/msme-print-udyam-certificate")({
    head: () => ({
    meta: [
      { title: "MSME Print Udyam Certificate | Download & Print Online" },
      { name: "description", content: "Expert consultancy assistance for msme print udyam certificate | download & print online. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "MSME Print Udyam Certificate | Download & Print Online" },
      { property: "og:description", content: "Expert consultancy assistance for msme print udyam certificate | download & print online. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-print-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Print Udyam Certificate" linkTitle="MSME Print Udyam Certificate | Download & Print Online" html={html} />,
});
