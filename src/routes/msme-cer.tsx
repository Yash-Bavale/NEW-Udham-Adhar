import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-cer.html?raw";

export const Route = createFileRoute("/msme-cer")({
    head: () => ({
    meta: [
      { title: "MSME Cer Download | Udyam MSME Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for msme cer download | udyam msme certificate online. Get help with Udyam/MSME registration, updates and certificates across I..." },
      { property: "og:title", content: "MSME Cer Download | Udyam MSME Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for msme cer download | udyam msme certificate online. Get help with Udyam/MSME registration, updates and certificates across I..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-cer" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Cer" linkTitle="MSME Cer Download | Udyam MSME Certificate Online" html={html} />,
});
