import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyog-aadhar-card.html?raw";

export const Route = createFileRoute("/udyog-aadhar-card")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Card - Old MSME Registration Document — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhar Card Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
      { property: "og:title", content: "Udyog Aadhar Card - Old MSME Registration Document" },
      { property: "og:description", content: "Udyog Aadhar Card Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
    ],
  }),
  component: () => <WpPage title="Udyog Aadhar Card - Old MSME Registration Document" html={html} />,
});
