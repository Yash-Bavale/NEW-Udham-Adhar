import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-registration.html?raw";

export const Route = createFileRoute("/udyam-certificate-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Registration - How to Register and Get MSME Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Certificate Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
      { property: "og:title", content: "Udyam Certificate Registration - How to Register and Get MSM" },
      { property: "og:description", content: "Udyam Certificate Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Registration - How to Register and Get MSM" html={html} />,
});
