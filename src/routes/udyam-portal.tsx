import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-portal.html?raw";

export const Route = createFileRoute("/udyam-portal")({
    head: () => ({
    meta: [
      { title: "Udyam Portal - Official MSME Registration Website" },
      { name: "description", content: "Expert consultancy assistance for udyam portal - official msme registration website. Get help with Udyam/MSME registration, updates and certificates across I..." },
      { property: "og:title", content: "Udyam Portal - Official MSME Registration Website" },
      { property: "og:description", content: "Expert consultancy assistance for udyam portal - official msme registration website. Get help with Udyam/MSME registration, updates and certificates across I..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Portal - Official MSME Registration Website" html={html} />,
});
