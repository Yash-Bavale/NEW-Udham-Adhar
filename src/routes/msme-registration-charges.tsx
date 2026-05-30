import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/msme-registration-charges.html?raw";

export const Route = createFileRoute("/msme-registration-charges")({
  head: () => ({
    meta: [
      { title: "MSME Registration Charges - Is MSME Registration Paid? — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Registration Charges Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "MSME Registration Charges - Is MSME Registration Paid?" },
      { property: "og:description", content: "MSME Registration Charges Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <WpPage title="MSME Registration Charges - Is MSME Registration Paid?" html={html} />,
});
