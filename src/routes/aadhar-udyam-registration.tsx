import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyam-registration")({
  head: () => ({
    meta: [
      { title: "Aadhar Business Help Services - Access MSME Certificate — Business Help Services Consultancy" },
      { name: "description", content: "Aadhar Business Help Services Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Aadhar Business Help Services - Access MSME Certificate" },
      { property: "og:description", content: "Aadhar Business Help Services Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Business Help Services - Access MSME Certificate" html={html} />,
});
