import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-card.html?raw";

export const Route = createFileRoute("/udyam-card")({
  head: () => ({
    meta: [
      { title: "Udyam Card - Official MSME Registration Card" },
      { name: "description", content: "The Udyam card is the official digital MSME registration card issued to businesses after successful registration on the Udyam portal. It contains the unique Udyam Registration Number, business details, and digital verification. The card serves as proof of MSME status, allowing businesses to access government..." },
      { property: "og:title", content: "Udyam Card - Official MSME Registration Card" },
      { property: "og:description", content: "The Udyam card is the official digital MSME registration card issued to businesses after successful registration on the Udyam portal. It contains the unique Udyam Registration Number, business details, and digital verification. The card serves as proof of MSME status, allowing businesses to access government..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-card" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Card" linkTitle="Udyam Card - Official MSME Registration Card" html={html} />,
});
