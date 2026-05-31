import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyog-aadhar.html?raw";

export const Route = createFileRoute("/msme-udyog-aadhar")({
  head: () => ({
    meta: [
      { title: "MSME Udyog Aadhar - Old MSME Registration Identification — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Udyog Aadhar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
      { property: "og:title", content: "MSME Udyog Aadhar - Old MSME Registration Identification" },
      { property: "og:description", content: "MSME Udyog Aadhar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyog Aadhar - Old MSME Registration Identification" html={html} />,
});
