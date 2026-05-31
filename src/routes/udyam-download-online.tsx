import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download-online.html?raw";

export const Route = createFileRoute("/udyam-download-online")({
    head: () => ({
    meta: [
      { title: "Udyam Download Online" },
      { name: "description", content: "Expert consultancy assistance for udyam download online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Download Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam download online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-download-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Download Online" html={html} />,
});
