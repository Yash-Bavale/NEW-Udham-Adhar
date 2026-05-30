import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/msme-registration-login.html?raw";

export const Route = createFileRoute("/msme-registration-login")({
  head: () => ({
    meta: [
      { title: "MSME Registration Login | Access Your Udyam Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Registration Login Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "MSME Registration Login | Access Your Udyam Certificate Onli" },
      { property: "og:description", content: "MSME Registration Login Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <WpPage title="MSME Registration Login | Access Your Udyam Certificate Onli" html={html} />,
});
