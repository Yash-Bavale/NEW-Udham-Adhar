import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-login.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-login")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Login — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Aadhaar Login. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Aadhaar Login — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Aadhaar Login. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-login" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Login" linkTitle="Udyam Aadhaar Login" html={html} />,
});
