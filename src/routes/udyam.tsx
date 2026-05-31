import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam.html?raw";

export const Route = createFileRoute("/udyam")({
    head: () => ({
    meta: [
      { title: "Udyam - Government Portal for MSME Registration" },
      { name: "description", content: "Expert consultancy assistance for udyam - government portal for msme registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam - Government Portal for MSME Registration" },
      { property: "og:description", content: "Expert consultancy assistance for udyam - government portal for msme registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam - Government Portal for MSME Registration" html={html} />,
});
