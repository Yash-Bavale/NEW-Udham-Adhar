import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/msme-registration-fee.html?raw";

export const Route = createFileRoute("/msme-registration-fee")({
  head: () => ({
    meta: [
      { title: "MSME Registration Fee - Free Online MSME Registration Process — Udyam Registration Consultancy" },
      { name: "description", content: "MSME registration fee Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
      { property: "og:title", content: "MSME Registration Fee - Free Online MSME Registration Proces" },
      { property: "og:description", content: "MSME registration fee Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
    ],
  }),
  component: () => <WpPage title="MSME Registration Fee - Free Online MSME Registration Proces" html={html} />,
});
