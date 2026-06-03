import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-check.html?raw";

export const Route = createFileRoute("/udyam-registration-check")({
    head: () => ({
    meta: [
      { title: "Business Help Services Check | Verify MSME Status Online" },
      { name: "description", content: "Expert consultancy assistance for udyam/msme check | verify msme status online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Business Help Services Check | Verify MSME Status Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam/msme check | verify msme status online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-check" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Check | Verify MSME Status Online" html={html} />,
});
