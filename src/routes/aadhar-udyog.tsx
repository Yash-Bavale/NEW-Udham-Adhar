import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyog.html?raw";

export const Route = createFileRoute("/aadhar-udyog")({
    head: () => ({
    meta: [
      { title: "Aadhar Udyog - Aadhaar Based Udyog Aadhar Registration" },
      { name: "description", content: "Expert consultancy assistance for aadhar udyog - aadhaar based udyog aadhar registration. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "Aadhar Udyog - Aadhaar Based Udyog Aadhar Registration" },
      { property: "og:description", content: "Expert consultancy assistance for aadhar udyog - aadhaar based udyog aadhar registration. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyog" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyog" linkTitle="Aadhar Udyog - Aadhaar Based Udyog Aadhar Registration" html={html} />,
});
