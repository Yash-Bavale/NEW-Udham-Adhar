import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhaar.html?raw";

export const Route = createFileRoute("/udyam-adhaar")({
  head: () => ({
    meta: [
      { title: "Udyam Adhaar — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Adhaar. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Adhaar — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Adhaar. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-adhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhaar" linkTitle="Udyam Adhaar" html={html} />,
});
