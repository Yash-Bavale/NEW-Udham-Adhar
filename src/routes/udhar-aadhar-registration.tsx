import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udhar-aadhar-registration.html?raw";

export const Route = createFileRoute("/udhar-aadhar-registration")({
  head: () => ({
    meta: [
      { title: "Udhar Aadhar Registration Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udhar Aadhar Registration Online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udhar Aadhar Registration Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udhar Aadhar Registration Online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udhar-aadhar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udhar Aadhar Registration Online" linkTitle="Udhar Aadhar Registration Online" html={html} />,
});
