import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-status.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-status")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Status — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Aadhaar Status. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Aadhaar Status — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Aadhaar Status. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-status" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Status" linkTitle="Udyam Aadhaar Status" html={html} />,
});
