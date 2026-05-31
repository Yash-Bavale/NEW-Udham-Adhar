import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/www-udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/www-udyamregistration-gov-in")({
  head: () => ({
    meta: [
      { title: "www.udyamregistration.gov.in - Official MSME Registration Website — Udyam Registration Consultancy" },
      { name: "description", content: "www.udyamregistration.gov.in Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your St" },
      { property: "og:title", content: "www.udyamregistration.gov.in - Official MSME Registration We" },
      { property: "og:description", content: "www.udyamregistration.gov.in Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your St" },
    ],
  }),
  component: () => <SeoLandingPage title="www.udyamregistration.gov.in - Official MSME Registration We" html={html} />,
});
