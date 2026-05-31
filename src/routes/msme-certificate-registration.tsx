import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-registration.html?raw";

export const Route = createFileRoute("/msme-certificate-registration")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Registration - Steps to Register Your Business — Business Help Services Consultancy" },
      { name: "description", content: "MSME Certificate Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your S" },
      { property: "og:title", content: "MSME Certificate Registration - Steps to Register Your Busin" },
      { property: "og:description", content: "MSME Certificate Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your S" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Registration - Steps to Register Your Busin" html={html} />,
});
