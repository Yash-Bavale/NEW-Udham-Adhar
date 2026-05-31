import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-registration.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Registration - Link Aadhaar for MSME Registration — Business Help Services Consultancy" },
      { name: "description", content: "Udyog Aadhar Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udyam Aadhaar Registration - Link Aadhaar for MSME Registrat" },
      { property: "og:description", content: "Udyog Aadhar Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Registration - Link Aadhaar for MSME Registrat" html={html} />,
});
