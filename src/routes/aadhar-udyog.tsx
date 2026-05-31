import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyog.html?raw";

export const Route = createFileRoute("/aadhar-udyog")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyog - Aadhaar Based Udyog Aadhar Registration — Udyam Registration Consultancy" },
      { name: "description", content: "Aadhar Udyog Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Aadhar Udyog - Aadhaar Based Udyog Aadhar Registration" },
      { property: "og:description", content: "Aadhar Udyog Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyog - Aadhaar Based Udyog Aadhar Registration" html={html} />,
});
