import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-status.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-status")({
    head: () => ({
    meta: [
      { title: "Udyam Aadhaar Status | Track Your MSME Registration Online" },
      { name: "description", content: "Expert consultancy assistance for udyam aadhaar status | track your msme registration online. Get help with Udyam/MSME registration, updates and certificates..." },
      { property: "og:title", content: "Udyam Aadhaar Status | Track Your MSME Registration Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam aadhaar status | track your msme registration online. Get help with Udyam/MSME registration, updates and certificates..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-status" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Status | Track Your MSME Registration Online" html={html} />,
});
