import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-govin.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-govin")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhaar Govin – Official MSME Registration Support" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhaar govin – official msme registration support. Get help with Udyam/MSME registration, updates and certificates a..." },
      { property: "og:title", content: "Udyog Aadhaar Govin – Official MSME Registration Support" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhaar govin – official msme registration support. Get help with Udyam/MSME registration, updates and certificates a..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-govin" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Govin" linkTitle="Udyog Aadhaar Govin – Official MSME Registration Support" html={html} />,
});
