import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udham-aadhar-download.html?raw";

export const Route = createFileRoute("/udham-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udham Aadhar Download | Get Udyam Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udham Aadhar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
      { property: "og:title", content: "Udham Aadhar Download | Get Udyam Certificate Online" },
      { property: "og:description", content: "Udham Aadhar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
    ],
  }),
  component: () => <SeoLandingPage title="Udham Aadhar Download | Get Udyam Certificate Online" html={html} />,
});
