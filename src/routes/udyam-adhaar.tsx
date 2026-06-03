import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhaar.html?raw";

export const Route = createFileRoute("/udyam-adhaar")({
    head: () => ({
    meta: [
      { title: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Regi..." },
      { name: "description", content: "Expert consultancy assistance for udyam aadhaar - aadhaar-based verification for msme regi.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Regi..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam aadhaar - aadhaar-based verification for msme regi.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-adhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhaar" linkTitle="Udyam Aadhaar - Aadhaar-Based Verification for MSME Registration" html={html} />,
});
