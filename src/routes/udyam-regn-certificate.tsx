import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-regn-certificate.html?raw";

export const Route = createFileRoute("/udyam-regn-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Regn Certificate - MSME Registration Proof — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Regn Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "Udyam Regn Certificate - MSME Registration Proof" },
      { property: "og:description", content: "Udyam Regn Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <WpPage title="Udyam Regn Certificate - MSME Registration Proof" html={html} />,
});
