import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-apply-online.html?raw";

export const Route = createFileRoute("/udyam-certificate-apply-online")({
    head: () => ({
    meta: [
      { title: "Udyam Certificate Apply Online" },
      { name: "description", content: "Expert consultancy assistance for udyam certificate apply online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Certificate Apply Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam certificate apply online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-apply-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Apply | Register Your MSME Online" html={html} />,
});
