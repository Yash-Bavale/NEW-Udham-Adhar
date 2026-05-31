import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-number.html?raw";

export const Route = createFileRoute("/udyam-number")({
    head: () => ({
    meta: [
      { title: "Udyam Number - Unique MSME Registration ID" },
      { name: "description", content: "Expert consultancy assistance for udyam number - unique msme registration id. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Number - Unique MSME Registration ID" },
      { property: "og:description", content: "Expert consultancy assistance for udyam number - unique msme registration id. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Number - Unique MSME Registration ID" html={html} />,
});
