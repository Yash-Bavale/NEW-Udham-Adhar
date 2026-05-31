import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/ms-me-certificate.html?raw";

export const Route = createFileRoute("/ms-me-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Online | Get Business Help Services Certificate — Business Help Services Consultancy" },
      { name: "description", content: "MSME Certificate Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "MSME Certificate Online | Get Business Help Services Certificate" },
      { property: "og:description", content: "MSME Certificate Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Online | Get Business Help Services Certificate" html={html} />,
});
