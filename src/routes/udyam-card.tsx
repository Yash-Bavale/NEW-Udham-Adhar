import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-card.html?raw";

export const Route = createFileRoute("/udyam-card")({
    head: () => ({
    meta: [
      { title: "Udyam Card - Official MSME Registration Card" },
      { name: "description", content: "Expert consultancy assistance for udyam card - official msme registration card. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Card - Official MSME Registration Card" },
      { property: "og:description", content: "Expert consultancy assistance for udyam card - official msme registration card. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-card" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Card - Official MSME Registration Card" html={html} />,
});
