import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-print.html?raw";

export const Route = createFileRoute("/aadhar-udyam-print")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Print | Print MSME Udyam Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Aadhar Udyam Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra" },
      { property: "og:title", content: "Aadhar Udyam Print | Print MSME Udyam Certificate" },
      { property: "og:description", content: "Aadhar Udyam Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Print | Print MSME Udyam Certificate" html={html} />,
});
