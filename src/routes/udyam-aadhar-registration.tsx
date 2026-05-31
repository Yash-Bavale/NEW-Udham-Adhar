import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhar-registration.html?raw";

export const Route = createFileRoute("/udyam-aadhar-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhar Registration - Aadhaar Linked MSME Registration — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Aadhar Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udyam Aadhar Registration - Aadhaar Linked MSME Registration" },
      { property: "og:description", content: "Udyam Aadhar Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhar Registration - Aadhaar Linked MSME Registration" html={html} />,
});
