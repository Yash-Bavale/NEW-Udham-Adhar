import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-msme-certificate-download")({
    head: () => ({
    meta: [
      { title: "Udyam MSME Certificate Download | Get Official PDF Online" },
      { name: "description", content: "Expert consultancy assistance for udyam msme certificate download | get official pdf online. Get help with Udyam/MSME registration, updates and certificates ..." },
      { property: "og:title", content: "Udyam MSME Certificate Download | Get Official PDF Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam msme certificate download | get official pdf online. Get help with Udyam/MSME registration, updates and certificates ..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-msme-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Certificate Download" linkTitle="Udyam MSME Certificate Download | Get Official PDF Online" html={html} />,
});
