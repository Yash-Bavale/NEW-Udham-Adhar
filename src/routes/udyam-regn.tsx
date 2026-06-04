import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-regn.html?raw";

export const Route = createFileRoute("/udyam-regn")({
  head: () => ({
    meta: [
      { title: "Udyam Regn - Quick MSME Registration Online" },
      { name: "description", content: "Udyam Regn represents the simplified, modernized approach to MSME registration in India, designed to make the entire process smooth, transparent, and accessible to every entrepreneur. This system allows business owners to complete their registration online using minimal information such as Aadhaar, PAN, and basic..." },
      { property: "og:title", content: "Udyam Regn - Quick MSME Registration Online" },
      { property: "og:description", content: "Udyam Regn represents the simplified, modernized approach to MSME registration in India, designed to make the entire process smooth, transparent, and accessible to every entrepreneur. This system allows business owners to complete their registration online using minimal information such as Aadhaar, PAN, and basic..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-regn" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Regn" linkTitle="Udyam Regn - Quick MSME Registration Online" html={html} />,
});
