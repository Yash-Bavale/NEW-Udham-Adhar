import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-apply-online.html?raw";

export const Route = createFileRoute("/msme-apply-online")({
    head: () => ({
    meta: [
      { title: "MSME Apply Online" },
      { name: "description", content: "Expert consultancy assistance for msme apply online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Apply Online" },
      { property: "og:description", content: "Expert consultancy assistance for msme apply online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-apply-online" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Apply Online | Udyam Registration for Small Businesses" html={html} />,
});
