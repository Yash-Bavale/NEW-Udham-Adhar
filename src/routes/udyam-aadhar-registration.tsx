import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhar-registration.html?raw";

export const Route = createFileRoute("/udyam-aadhar-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhar Registration - Aadhaar Linked MSME Registration" },
      { name: "description", content: "Udyam Aadhar registration is the Aadhaar-linked process for registering a business as a Micro, Small, or Medium Enterprise through the official Udyam portal. By connecting an entrepreneur’s Aadhaar number with their business details, the system ensures instant verification, eliminating paperwork and manual..." },
      { property: "og:title", content: "Udyam Aadhar Registration - Aadhaar Linked MSME Registration" },
      { property: "og:description", content: "Udyam Aadhar registration is the Aadhaar-linked process for registering a business as a Micro, Small, or Medium Enterprise through the official Udyam portal. By connecting an entrepreneur’s Aadhaar number with their business details, the system ensures instant verification, eliminating paperwork and manual..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhar registration" linkTitle="Udyam Aadhar Registration - Aadhaar Linked MSME Registration" html={html} />,
});
