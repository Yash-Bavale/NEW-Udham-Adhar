import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-registration.html?raw";

export const Route = createFileRoute("/udyam-msme-registration")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Registration – Official Portal for MSME Certificate — Business Help Services Consultancy" },
      { name: "description", content: "Udyam MSME Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "Udyam MSME Registration – Official Portal for MSME Certifica" },
      { property: "og:description", content: "Udyam MSME Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Registration – Official Portal for MSME Certifica" html={html} />,
});
