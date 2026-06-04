import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-update.html?raw";

export const Route = createFileRoute("/udyam-registration-update")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Update — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Registration Update allows businesses to edit and update their MSME registration details online. Entrepreneurs can correct or change information such as business name, address, PAN, or Aadhaar-linked details through the secure Udyam portal. Keeping your registration information current ensures uninterrupted..." },
      { property: "og:title", content: "Udyam Registration Update — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Registration Update allows businesses to edit and update their MSME registration details online. Entrepreneurs can correct or change information such as business name, address, PAN, or Aadhaar-linked details through the secure Udyam portal. Keeping your registration information current ensures uninterrupted..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Update" linkTitle="Udyam Registration Update" html={html} />,
});
