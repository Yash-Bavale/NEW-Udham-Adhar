import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-updation.html?raw";

export const Route = createFileRoute("/msme-updation")({
  head: () => ({
    meta: [
      { title: "MSME Updation - How to Update Your MSME Registration Details — Business Help Services Consultancy" },
      { name: "description", content: "MSME Updation Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
      { property: "og:title", content: "MSME Updation - How to Update Your MSME Registration Details" },
      { property: "og:description", content: "MSME Updation Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Updation - How to Update Your MSME Registration Details" html={html} />,
});
