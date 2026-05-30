import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/register-for-msme.html?raw";

export const Route = createFileRoute("/register-for-msme")({
  head: () => ({
    meta: [
      { title: "Register for MSME - Free Online Udyam Registration — Udyam Registration Consultancy" },
      { name: "description", content: "Register for MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
      { property: "og:title", content: "Register for MSME - Free Online Udyam Registration" },
      { property: "og:description", content: "Register for MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
    ],
  }),
  component: () => <WpPage title="Register for MSME - Free Online Udyam Registration" html={html} />,
});
