import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-registration-download.html?raw";

export const Route = createFileRoute("/udyam-registration-download")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Download - Get MSME Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Registration Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Sta" },
      { property: "og:title", content: "Udyam Registration Download - Get MSME Certificate Online" },
      { property: "og:description", content: "Udyam Registration Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Sta" },
    ],
  }),
  component: () => <WpPage title="Udyam Registration Download - Get MSME Certificate Online" html={html} />,
});
