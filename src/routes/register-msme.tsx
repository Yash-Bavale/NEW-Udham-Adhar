import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/register-msme.html?raw";

export const Route = createFileRoute("/register-msme")({
  head: () => ({
    meta: [
      { title: "Register MSME - Online Process for Business Registration — Udyam Registration Consultancy" },
      { name: "description", content: "Register MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
      { property: "og:title", content: "Register MSME - Online Process for Business Registration" },
      { property: "og:description", content: "Register MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
    ],
  }),
  component: () => <SeoLandingPage title="Register MSME - Online Process for Business Registration" html={html} />,
});
