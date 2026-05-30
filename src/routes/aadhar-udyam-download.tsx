import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/aadhar-udyam-download.html?raw";

export const Route = createFileRoute("/aadhar-udyam-download")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Download - Download Aadhaar Linked MSME Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Aadhar Udyam Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
      { property: "og:title", content: "Aadhar Udyam Download - Download Aadhaar Linked MSME Certifi" },
      { property: "og:description", content: "Aadhar Udyam Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
    ],
  }),
  component: () => <WpPage title="Aadhar Udyam Download - Download Aadhaar Linked MSME Certifi" html={html} />,
});
