import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyam-registration")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Registration - Access MSME Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Aadhar Udyam Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Aadhar Udyam Registration - Access MSME Certificate" },
      { property: "og:description", content: "Aadhar Udyam Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Registration - Access MSME Certificate" html={html} />,
});
