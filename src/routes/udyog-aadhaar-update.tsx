import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-update.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-update")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Update – Modify UAN Details Online — Business Help Services Consultancy" },
      { name: "description", content: "Udyog Aadhaar Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
      { property: "og:title", content: "Udyog Aadhaar Update – Modify UAN Details Online" },
      { property: "og:description", content: "Udyog Aadhaar Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Update – Modify UAN Details Online" html={html} />,
});
