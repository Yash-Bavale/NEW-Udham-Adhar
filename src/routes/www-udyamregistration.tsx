import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/www-udyamregistration.html?raw";

export const Route = createFileRoute("/www-udyamregistration")({
  head: () => ({
    meta: [
      { title: "www UdyamRegistration – Official Portal for MSME Registration — Business Help Services Consultancy" },
      { name: "description", content: "www UdyamRegistration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
      { property: "og:title", content: "www UdyamRegistration – Official Portal for MSME Registratio" },
      { property: "og:description", content: "www UdyamRegistration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
    ],
  }),
  component: () => <SeoLandingPage title="www UdyamRegistration – Official Portal for MSME Registratio" html={html} />,
});
