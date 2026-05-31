import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-registration-2.html?raw";

export const Route = createFileRoute("/udyog-aadhar-registration-2")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Registration — Business Help Services Consultancy" },
      { name: "description", content: "Udyog Aadhar Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udyog Aadhar Registration" },
      { property: "og:description", content: "Udyog Aadhar Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Registration" html={html} />,
});
