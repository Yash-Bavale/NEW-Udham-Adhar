import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam.html?raw";

export const Route = createFileRoute("/aadhar-udyam")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam - Aadhaar Linked MSME Registration" },
      { name: "description", content: "Aadhar Udyam refers to the Aadhaar-linked MSME registration process conducted through the official Udyam portal, designed to help business owners register quickly, securely, and without paperwork. By connecting the entrepreneur’s Aadhaar number directly with the registration application, the system enables instant..." },
      { property: "og:title", content: "Aadhar Udyam - Aadhaar Linked MSME Registration" },
      { property: "og:description", content: "Aadhar Udyam refers to the Aadhaar-linked MSME registration process conducted through the official Udyam portal, designed to help business owners register quickly, securely, and without paperwork. By connecting the entrepreneur’s Aadhaar number directly with the registration application, the system enables instant..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam" linkTitle="Aadhar Udyam - Aadhaar Linked MSME Registration" html={html} />,
});
