import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-registration.html?raw";

export const Route = createFileRoute("/udyog-aadhar-registration")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar Registration - MSME Registration Process (Old)" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar registration - msme registration process (old). Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyog Aadhar Registration - MSME Registration Process (Old)" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar registration - msme registration process (old). Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Registration - MSME Registration Process (Old)" html={html} />,
});
