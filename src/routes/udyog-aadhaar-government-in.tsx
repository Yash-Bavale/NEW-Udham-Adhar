import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-government-in.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-government-in")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhaar Government Portal – MSME Registration Details" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhaar government portal – msme registration details. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyog Aadhaar Government Portal – MSME Registration Details" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhaar government portal – msme registration details. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-government-in" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Government Portal – MSME Registration Details" html={html} />,
});
