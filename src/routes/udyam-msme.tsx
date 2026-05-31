import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme.html?raw";

export const Route = createFileRoute("/udyam-msme")({
    head: () => ({
    meta: [
      { title: "Udyam MSME - Government Portal for MSME Registration" },
      { name: "description", content: "Expert consultancy assistance for udyam msme - government portal for msme registration. Get help with Udyam/MSME registration, updates and certificates acros..." },
      { property: "og:title", content: "Udyam MSME - Government Portal for MSME Registration" },
      { property: "og:description", content: "Expert consultancy assistance for udyam msme - government portal for msme registration. Get help with Udyam/MSME registration, updates and certificates acros..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-msme" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME - Government Portal for MSME Registration" html={html} />,
});
