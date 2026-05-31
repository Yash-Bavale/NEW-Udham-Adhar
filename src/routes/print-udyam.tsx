import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam.html?raw";

export const Route = createFileRoute("/print-udyam")({
  head: () => ({
    meta: [
      { title: "Print Udyam Certificate | MSME Certificate Print Online — Udyam Registration Consultancy" },
      { name: "description", content: "Print Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "Print Udyam Certificate | MSME Certificate Print Online" },
      { property: "og:description", content: "Print Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam Certificate | MSME Certificate Print Online" html={html} />,
});
