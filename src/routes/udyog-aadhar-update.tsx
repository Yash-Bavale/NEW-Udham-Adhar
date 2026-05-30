import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyog-aadhar-update.html?raw";

export const Route = createFileRoute("/udyog-aadhar-update")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Update - How to Update Your MSME Details — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhar Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
      { property: "og:title", content: "Udyog Aadhar Update - How to Update Your MSME Details" },
      { property: "og:description", content: "Udyog Aadhar Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
    ],
  }),
  component: () => <WpPage title="Udyog Aadhar Update - How to Update Your MSME Details" html={html} />,
});
