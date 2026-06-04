import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyam-registration")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Aadhar Udyam registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhar Udyam registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Aadhar Udyam registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam registration" linkTitle="Aadhar Udyam registration" html={html} />,
});
