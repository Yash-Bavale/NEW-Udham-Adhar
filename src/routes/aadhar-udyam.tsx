import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/aadhar-udyam.html?raw";

export const Route = createFileRoute("/aadhar-udyam")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam - Aadhaar Linked MSME Registration — Udyam Registration Consultancy" },
      { name: "description", content: "Aadhar Udyam Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Aadhar Udyam - Aadhaar Linked MSME Registration" },
      { property: "og:description", content: "Aadhar Udyam Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <WpPage title="Aadhar Udyam - Aadhaar Linked MSME Registration" html={html} />,
});
