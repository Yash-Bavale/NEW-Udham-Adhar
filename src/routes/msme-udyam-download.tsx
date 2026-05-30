import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/msme-udyam-download.html?raw";

export const Route = createFileRoute("/msme-udyam-download")({
  head: () => ({
    meta: [
      { title: "MSME Udyam Download - Download MSME Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Udyam Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
      { property: "og:title", content: "MSME Udyam Download - Download MSME Certificate Online" },
      { property: "og:description", content: "MSME Udyam Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
    ],
  }),
  component: () => <WpPage title="MSME Udyam Download - Download MSME Certificate Online" html={html} />,
});
