import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-aadhaar-verify.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-verify")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Verify | Check MSME Udyam Registration Status — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Aadhaar Verify Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
      { property: "og:title", content: "Udyam Aadhaar Verify | Check MSME Udyam Registration Status" },
      { property: "og:description", content: "Udyam Aadhaar Verify Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
    ],
  }),
  component: () => <WpPage title="Udyam Aadhaar Verify | Check MSME Udyam Registration Status" html={html} />,
});
