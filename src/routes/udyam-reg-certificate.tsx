import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-reg-certificate.html?raw";

export const Route = createFileRoute("/udyam-reg-certificate")({
    head: () => ({
    meta: [
      { title: "Udyam Reg Certificate - Download MSME Registration Certi..." },
      { name: "description", content: "Expert consultancy assistance for udyam reg certificate - download msme registration certi.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Reg Certificate - Download MSME Registration Certi..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam reg certificate - download msme registration certi.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-reg-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Reg Certificate - Download MSME Registration Certifica" html={html} />,
});
