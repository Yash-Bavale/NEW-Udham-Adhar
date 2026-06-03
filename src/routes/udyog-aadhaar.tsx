import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar.html?raw";

export const Route = createFileRoute("/udyog-aadhaar")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhaar - Previous MSME Registration System" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhaar - previous msme registration system. Get help with Udyam/MSME registration, updates and certificates across I..." },
      { property: "og:title", content: "Udyog Aadhaar - Previous MSME Registration System" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhaar - previous msme registration system. Get help with Udyam/MSME registration, updates and certificates across I..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar - Old MSME Registration Process Explained" html={html} />,
});
