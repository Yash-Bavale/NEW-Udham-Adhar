import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate.html?raw";

export const Route = createFileRoute("/udyam-certificate")({
    head: () => ({
    meta: [
      { title: "Udyam Certificate - Download Official MSME Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for udyam certificate - download official msme certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Certificate - Download Official MSME Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam certificate - download official msme certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate" linkTitle="Udyam Certificate - Download Official MSME Certificate Online" html={html} />,
});
