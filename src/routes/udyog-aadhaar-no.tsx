import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-no.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-no")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhaar Number (UAN) – Find, Verify & Update UAN" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhaar number (uan) – find, verify & update uan. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "Udyog Aadhaar Number (UAN) – Find, Verify & Update UAN" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhaar number (uan) – find, verify & update uan. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-no" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar No" linkTitle="Udyog Aadhaar Number (UAN) – Find, Verify & Update UAN" html={html} />,
});
