import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-download.html?raw";

export const Route = createFileRoute("/udyam-registration-download")({
  head: () => ({
    meta: [
      { title: "Business Help Services Download - Get MSME Certificate Online — Business Help Services Consultancy" },
      { name: "description", content: "Business Help Services Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Sta" },
      { property: "og:title", content: "Business Help Services Download - Get MSME Certificate Online" },
      { property: "og:description", content: "Business Help Services Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Sta" },
    ],
  }),
  component: () => <SeoLandingPage title="Business Help Services Download - Get MSME Certificate Online" html={html} />,
});
