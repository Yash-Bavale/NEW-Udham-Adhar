import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-register.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-register")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhaar Register" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhaar register. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhaar Register" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhaar register. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-register" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Register – MSME Registration for Small Businesses" html={html} />,
});
