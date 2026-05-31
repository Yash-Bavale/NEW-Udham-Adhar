import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/register-for-msme.html?raw";

export const Route = createFileRoute("/register-for-msme")({
  head: () => ({
    meta: [
      { title: "Register for MSME - Free Online Business Help Services — Business Help Services Consultancy" },
      { name: "description", content: "Register for MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
      { property: "og:title", content: "Register for MSME - Free Online Business Help Services" },
      { property: "og:description", content: "Register for MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
    ],
  }),
  component: () => <SeoLandingPage title="Register for MSME - Free Online Business Help Services" html={html} />,
});
