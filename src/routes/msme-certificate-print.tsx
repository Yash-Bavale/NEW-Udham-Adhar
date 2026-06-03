import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-print.html?raw";

export const Route = createFileRoute("/msme-certificate-print")({
    head: () => ({
    meta: [
      { title: "MSME Certificate Print Online" },
      { name: "description", content: "Expert consultancy assistance for msme certificate print online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Certificate Print Online" },
      { property: "og:description", content: "Expert consultancy assistance for msme certificate print online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-print" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Print" linkTitle="MSME Certificate Print Online | Download Udyam/MSME Certificate" html={html} />,
});
