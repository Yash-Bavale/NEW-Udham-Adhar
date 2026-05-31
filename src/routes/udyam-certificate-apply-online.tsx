import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-apply-online.html?raw";

export const Route = createFileRoute("/udyam-certificate-apply-online")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Apply Online – Easy Registration Process & Benefits Guide — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Certificate Apply Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
      { property: "og:title", content: "Udyam Certificate Apply Online – Easy Registration Process &" },
      { property: "og:description", content: "Udyam Certificate Apply Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Apply Online – Easy Registration Process &" html={html} />,
});
