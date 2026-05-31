import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-regn.html?raw";

export const Route = createFileRoute("/udyam-regn")({
  head: () => ({
    meta: [
      { title: "Udyam Regn - Quick MSME Registration Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Regn Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
      { property: "og:title", content: "Udyam Regn - Quick MSME Registration Online" },
      { property: "og:description", content: "Udyam Regn Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Regn - Quick MSME Registration Online" html={html} />,
});
