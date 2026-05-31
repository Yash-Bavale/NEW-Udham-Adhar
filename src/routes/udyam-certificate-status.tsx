import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-status.html?raw";

export const Route = createFileRoute("/udyam-certificate-status")({
    head: () => ({
    meta: [
      { title: "Udyam Certificate Status | Check MSME Registration Online" },
      { name: "description", content: "Expert consultancy assistance for udyam certificate status | check msme registration online. Get help with Udyam/MSME registration, updates and certificates ..." },
      { property: "og:title", content: "Udyam Certificate Status | Check MSME Registration Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam certificate status | check msme registration online. Get help with Udyam/MSME registration, updates and certificates ..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-status" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Status | Check MSME Registration Online" html={html} />,
});
