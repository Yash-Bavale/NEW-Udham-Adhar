import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/https-udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/https-udyamregistration-gov-in")({
  head: () => ({
    meta: [
      { title: "https UdyamRegistration.gov.in – Official Government MSME Portal — Udyam Registration Consultancy" },
      { name: "description", content: "https UdyamRegistration gov in Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
      { property: "og:title", content: "https UdyamRegistration.gov.in – Official Government MSME Po" },
      { property: "og:description", content: "https UdyamRegistration gov in Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
    ],
  }),
  component: () => <SeoLandingPage title="https UdyamRegistration.gov.in – Official Government MSME Po" html={html} />,
});
