import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-registration-check.html?raw";

export const Route = createFileRoute("/udyam-registration-check")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Check | Verify MSME Status Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Registration Check Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "Udyam Registration Check | Verify MSME Status Online" },
      { property: "og:description", content: "Udyam Registration Check Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <WpPage title="Udyam Registration Check | Verify MSME Status Online" html={html} />,
});
