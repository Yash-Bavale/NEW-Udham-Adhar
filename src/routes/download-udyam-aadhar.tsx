import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-aadhar.html?raw";

export const Route = createFileRoute("/download-udyam-aadhar")({
  head: () => ({
    meta: [
      { title: "Download Udyam Aadhar Certificate | MSME Certificate Online — Business Help Services Consultancy" },
      { name: "description", content: "Download Udyam Aadhar Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Yo" },
      { property: "og:title", content: "Download Udyam Aadhar Certificate | MSME Certificate Online" },
      { property: "og:description", content: "Download Udyam Aadhar Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Yo" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Aadhar Certificate | MSME Certificate Online" html={html} />,
});
