import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-login.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-login")({
    head: () => ({
    meta: [
      { title: "Udyam Aadhaar Login | Access Your MSME Registration Online" },
      { name: "description", content: "Expert consultancy assistance for udyam aadhaar login | access your msme registration online. Get help with Udyam/MSME registration, updates and certificates..." },
      { property: "og:title", content: "Udyam Aadhaar Login | Access Your MSME Registration Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam aadhaar login | access your msme registration online. Get help with Udyam/MSME registration, updates and certificates..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-login" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Login" linkTitle="Udyam Aadhaar Login | Access Your MSME Registration Online" html={html} />,
});
