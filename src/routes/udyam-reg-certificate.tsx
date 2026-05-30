import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-reg-certificate.html?raw";

export const Route = createFileRoute("/udyam-reg-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Reg Certificate - Download MSME Registration Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Reg Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
      { property: "og:title", content: "Udyam Reg Certificate - Download MSME Registration Certifica" },
      { property: "og:description", content: "Udyam Reg Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
    ],
  }),
  component: () => <WpPage title="Udyam Reg Certificate - Download MSME Registration Certifica" html={html} />,
});
